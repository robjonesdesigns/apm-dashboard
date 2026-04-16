-- ============================================================
-- Migration 002: Production Tracking and OEE Computation
-- ============================================================
-- Adds the data layer that Plant Overview KPIs read from.
-- See vector/decisions/ADR-032-production-tracking-and-oee.md for
-- the design decisions, formulas, and MES integration seam.
-- ============================================================

-- ============================================================
-- ASSETS: design rate, unit, and production weight
-- ============================================================
-- design_throughput_rate is the ideal output per hour at 100% performance.
-- design_throughput_unit is the physical unit (Nm3/h, bbl/h, kg/h, etc.).
-- production_weight is this asset's fraction of plant OEE contribution
-- (all weights for assets in a plant should sum to ~1.0; enforced at
-- application level, not DB).
alter table assets
  add column if not exists design_throughput_rate numeric(14,4),
  add column if not exists design_throughput_unit text,
  add column if not exists production_weight numeric(6,5) not null default 0;

create index if not exists assets_production_weight_idx
  on assets (plant_id) where production_weight > 0;

-- ============================================================
-- ASSET_RUNTIME_STATES (hypertable)
-- ============================================================
-- Event log of asset state transitions. Each row marks the moment an
-- asset moved into `state`. The state persists until the next row.
-- Used for Gantt timelines, audit trails, and future event-driven
-- analytics. OEE is computed from production_log, not this table.
create table if not exists asset_runtime_states (
  asset_id     uuid        not null references assets(id) on delete cascade,
  ts           timestamptz not null,
  state        asset_status not null,
  reason_code  text,                                       -- ISO 14224 failure code when state = 'down'
  is_planned   boolean     not null default false,         -- distinguishes planned vs unplanned downtime
  primary key (asset_id, ts)
);

select create_hypertable(
  'asset_runtime_states',
  by_range('ts', interval '1 day'),
  if_not_exists => true
);

create index if not exists asset_runtime_states_ts_idx      on asset_runtime_states (ts desc);
create index if not exists asset_runtime_states_state_idx   on asset_runtime_states (state, ts desc);

-- ============================================================
-- PRODUCTION_LOG (hypertable)
-- ============================================================
-- One row per asset per hour. All OEE numerators and denominators.
-- Simulator (or MES in production) writes this. Dashboard views read it.
-- Avoids needing a cagg on state transitions because the hour-grained
-- rollup happens at write time.
create table if not exists production_log (
  asset_id           uuid        not null references assets(id) on delete cascade,
  hour               timestamptz not null,                  -- top of hour
  units_produced     numeric(14,4) not null default 0,
  units_theoretical  numeric(14,4) not null default 0,      -- design rate * run_hours
  units_defective    numeric(14,4) not null default 0,
  run_seconds        integer     not null default 0,        -- seconds in running or degraded state
  planned_seconds    integer     not null default 3600,     -- seconds expected to run (excludes out_of_service)
  primary key (asset_id, hour)
);

select create_hypertable(
  'production_log',
  by_range('hour', interval '7 days'),
  if_not_exists => true
);

create index if not exists production_log_hour_idx on production_log (hour desc);

-- ============================================================
-- ASSET_KPI_HOURLY (view)
-- ============================================================
-- Per-asset hourly OEE. Cheap view on top of production_log.
-- Availability guards against planned_seconds = 0 (asset in planned outage).
-- Performance guards against units_theoretical = 0 (asset not producing).
-- Quality guards against units_produced = 0 (no output to assess).
create or replace view asset_kpi_hourly as
select
  asset_id,
  hour,
  run_seconds,
  planned_seconds,
  units_produced,
  units_theoretical,
  units_defective,
  -- Availability = run_seconds / planned_seconds (0..1)
  case when planned_seconds > 0
       then run_seconds::numeric / planned_seconds
       else null end                                          as availability,
  -- Performance = units_produced / units_theoretical (0..1, can exceed 1 rarely)
  case when units_theoretical > 0
       then least(units_produced / units_theoretical, 1.0)
       else null end                                          as performance,
  -- Quality = (produced - defective) / produced (0..1)
  case when units_produced > 0
       then (units_produced - units_defective) / units_produced
       else null end                                          as quality,
  -- OEE = A * P * Q, null if any factor is null
  case
    when planned_seconds > 0 and units_theoretical > 0 and units_produced > 0
    then (run_seconds::numeric / planned_seconds)
       * least(units_produced / units_theoretical, 1.0)
       * ((units_produced - units_defective) / units_produced)
    else null
  end                                                         as oee
from production_log;

-- ============================================================
-- PLANT_KPI_HOURLY (view)
-- ============================================================
-- Production-weighted rollup of asset_kpi_hourly per plant per hour.
-- Weights re-normalize over assets that have non-null metrics, so
-- assets in planned outage don't distort the plant average.
create or replace view plant_kpi_hourly as
with per_asset as (
  select
    a.plant_id,
    k.hour,
    a.production_weight,
    k.availability,
    k.performance,
    k.quality,
    k.oee
  from asset_kpi_hourly k
  join assets a on a.id = k.asset_id
  where a.production_weight > 0
)
select
  plant_id,
  hour,
  -- Weighted average with re-normalized weights over contributing assets.
  case when sum(production_weight) filter (where availability is not null) > 0
       then sum(availability * production_weight) filter (where availability is not null)
          / sum(production_weight) filter (where availability is not null)
       else null end                                          as availability,
  case when sum(production_weight) filter (where performance is not null) > 0
       then sum(performance * production_weight) filter (where performance is not null)
          / sum(production_weight) filter (where performance is not null)
       else null end                                          as performance,
  case when sum(production_weight) filter (where quality is not null) > 0
       then sum(quality * production_weight) filter (where quality is not null)
          / sum(production_weight) filter (where quality is not null)
       else null end                                          as quality,
  case when sum(production_weight) filter (where oee is not null) > 0
       then sum(oee * production_weight) filter (where oee is not null)
          / sum(production_weight) filter (where oee is not null)
       else null end                                          as oee,
  count(*) filter (where availability is not null)            as contributing_asset_count
from per_asset
group by plant_id, hour;

-- ============================================================
-- Columnstore compression policies (Timescale 2.18+)
-- ============================================================
-- Apply the same pattern as sensor_readings: compress old chunks,
-- segmented by asset_id for fast asset-scoped queries.

alter table asset_runtime_states set (
  timescaledb.enable_columnstore,
  timescaledb.segmentby = 'asset_id',
  timescaledb.orderby   = 'ts desc'
);

call add_columnstore_policy('asset_runtime_states', after => interval '30 days', if_not_exists => true);

alter table production_log set (
  timescaledb.enable_columnstore,
  timescaledb.segmentby = 'asset_id',
  timescaledb.orderby   = 'hour desc'
);

call add_columnstore_policy('production_log', after => interval '60 days', if_not_exists => true);

-- ============================================================
-- Retention policies
-- ============================================================
-- Keep 2 years of raw runtime states and 3 years of production log.
-- Both are small enough to retain indefinitely, but a policy prevents
-- unbounded growth for customers that run the simulator on a loop.

select add_retention_policy('asset_runtime_states', drop_after => interval '2 years', if_not_exists => true);
select add_retention_policy('production_log',       drop_after => interval '3 years', if_not_exists => true);

-- ============================================================
-- Comments (for TablePlus / pgAdmin discoverability)
-- ============================================================
comment on table asset_runtime_states is 'State transitions per asset. One row = moment of transition. State persists until next row.';
comment on table production_log        is 'Hourly aggregated production per asset. One row per asset per hour. OEE source of truth.';
comment on view  asset_kpi_hourly      is 'Per-asset hourly OEE (availability * performance * quality). Computed from production_log.';
comment on view  plant_kpi_hourly      is 'Production-weighted plant OEE rollup per hour. Read by Plant Overview route loader.';
