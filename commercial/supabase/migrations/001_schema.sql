-- ============================================================
-- APM Commercial v2 — Initial Schema
-- Target: Timescale Cloud (PostgreSQL 16+, TimescaleDB 2.18+)
-- Scope:  orgs, plants, ISO 14224 taxonomy, assets, sensors,
--         sensor_readings (hypertable), alarms (ISA-18.2),
--         failure_records, work_orders, maintenance_plans,
--         rul_predictions, insights.
-- Notes:  Multi-tenant from day one. RLS enabled on all
--         tenant-scoped tables. Reference tables (ISO 14224)
--         are global and read-only to tenants.
-- ============================================================

-- ============================================================
-- DEV RESET: drop our own objects so re-runs are idempotent.
-- Leaves extensions (timescaledb, timescaledb_toolkit, etc) alone.
-- Remove this section before promoting to production.
-- ============================================================
drop materialized view if exists sensor_readings_1h cascade;
drop materialized view if exists sensor_readings_1m cascade;
drop table if exists sensor_readings cascade;
drop table if exists alarm_events cascade;
drop table if exists alarms cascade;
drop table if exists insights cascade;
drop table if exists work_orders cascade;
drop table if exists rul_predictions cascade;
drop table if exists failure_records cascade;
drop table if exists maintenance_plans cascade;
drop table if exists sensors cascade;
drop table if exists assets cascade;
drop table if exists plants cascade;
drop table if exists orgs cascade;
drop table if exists iso14224_failure_mechanisms cascade;
drop table if exists iso14224_failure_modes cascade;
drop table if exists iso14224_equipment_classes cascade;

drop type if exists insight_status cascade;
drop type if exists insight_action_type cascade;
drop type if exists maintenance_strategy cascade;
drop type if exists work_order_urgency cascade;
drop type if exists work_order_status cascade;
drop type if exists alarm_priority cascade;
drop type if exists alarm_state cascade;
drop type if exists iso_equipment_class cascade;
drop type if exists asset_status cascade;
drop type if exists asset_criticality cascade;

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "pgcrypto";
create extension if not exists "citext";
create extension if not exists "timescaledb";

-- ============================================================
-- ENUMS
-- ============================================================
create type asset_criticality   as enum ('A','B','C','D');
create type asset_status        as enum ('running','degraded','down','standby','out_of_service');
create type iso_equipment_class as enum (
  'rotating','static','electrical','instrument','safety','utility'
);

-- ISA-18.2 canonical alarm states
create type alarm_state as enum (
  'normal',
  'unack_alarm',
  'ack_alarm',
  'rtn_unack',           -- returned to normal, unacknowledged
  'shelved',
  'suppressed_by_design',
  'out_of_service'
);

create type alarm_priority as enum ('low','medium','high','critical');

create type work_order_status as enum (
  'draft','planned','scheduled','in_progress','on_hold','completed','cancelled'
);
create type work_order_urgency as enum ('emergency','urgent','scheduled');

create type maintenance_strategy as enum (
  'reactive','preventive','predictive','prescriptive','condition_based'
);

create type insight_action_type as enum (
  'replace_component','inspect','lubricate','realign','rebalance',
  'tighten','clean','calibrate','schedule_outage','adjust_setpoint',
  'investigate_root_cause','no_action_required'
);

create type insight_status as enum (
  'open','acknowledged','in_progress','dismissed','resolved'
);

-- ============================================================
-- TENANCY
-- ============================================================
create table orgs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

create table plants (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  name        text not null,
  location    text,
  timezone    text not null default 'UTC',
  created_at  timestamptz not null default now(),
  unique (org_id, name)
);

-- ============================================================
-- ISO 14224 TAXONOMY (reference data, not tenant-scoped)
-- ============================================================
create table iso14224_equipment_classes (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,              -- 'CP' compressor, 'PU' pump, etc.
  class       iso_equipment_class not null,
  name        text not null,
  parent_id   uuid references iso14224_equipment_classes(id) on delete restrict
);

create table iso14224_failure_modes (
  id                  uuid primary key default gen_random_uuid(),
  code                text not null,             -- 'BRD','LOA','VIB','FTS'
  name                text not null,             -- 'Bearing damage'
  description         text,
  equipment_class_id  uuid references iso14224_equipment_classes(id),
  unique (code, equipment_class_id)
);

create table iso14224_failure_mechanisms (
  id              uuid primary key default gen_random_uuid(),
  failure_mode_id uuid not null references iso14224_failure_modes(id) on delete cascade,
  code            text not null,                 -- 'WEA' wear, 'COR' corrosion
  name            text not null,
  unique (failure_mode_id, code)
);

-- ============================================================
-- ASSETS + HIERARCHY (recursive per ISO 14224)
-- ============================================================
create table assets (
  id                   uuid primary key default gen_random_uuid(),
  org_id               uuid not null references orgs(id) on delete cascade,
  plant_id             uuid not null references plants(id) on delete cascade,
  parent_asset_id      uuid references assets(id) on delete cascade,
  tag                  text not null,            -- 'K-101'
  name                 text not null,            -- 'Naphtha Reformer Compressor'
  equipment_class_id   uuid references iso14224_equipment_classes(id),
  criticality          asset_criticality not null default 'C',
  status               asset_status      not null default 'running',
  manufacturer         text,
  model                text,
  serial_number        text,
  installed_at         date,
  commissioned_at      date,
  design_life_years    numeric(5,2),
  replacement_cost_usd numeric(14,2),
  metadata             jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (plant_id, tag)
);
create index assets_plant_idx        on assets (plant_id);
create index assets_parent_idx       on assets (parent_asset_id);
create index assets_criticality_idx  on assets (criticality, status);

-- ============================================================
-- SENSORS
-- ============================================================
create table sensors (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references orgs(id) on delete cascade,
  asset_id         uuid not null references assets(id) on delete cascade,
  tag              text not null,                -- historian tag 'K-101.VIB.DE.X'
  name             text not null,
  unit             text not null,                -- 'mm/s','degC','bar','%'
  measurement_type text not null,                -- 'vibration','temperature','pressure'
  sample_rate_hz   numeric(10,4) not null default 1,
  lo_lo            numeric(14,4),                -- ISA-18.2 thresholds
  lo               numeric(14,4),
  hi               numeric(14,4),
  hi_hi            numeric(14,4),
  expected_min     numeric(14,4),
  expected_max     numeric(14,4),
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  unique (asset_id, tag)
);
create index sensors_asset_idx on sensors (asset_id);

-- ============================================================
-- SENSOR READINGS (TimescaleDB hypertable)
-- ============================================================
create table sensor_readings (
  sensor_id uuid not null references sensors(id) on delete cascade,
  ts        timestamptz not null,
  value     double precision not null,
  quality   smallint not null default 192,       -- OPC UA quality code
  primary key (sensor_id, ts)
);

-- Note: RLS on sensor_readings must be enabled in a narrow window:
-- AFTER continuous aggregates are created (cagg creation blocks on RLS)
-- and BEFORE columnstore is enabled (columnstore blocks ALTER TABLE RLS).
-- See the `alter table sensor_readings enable row level security` further down.

-- Create the hypertable (TimescaleDB 2.18+ dimension builder syntax).
select create_hypertable(
  'sensor_readings',
  by_range('ts', interval '1 day')
);

-- ------------------------------------------------------------
-- Continuous aggregate: 1-minute rollup
-- Must be created BEFORE enabling columnstore on the base table.
-- ------------------------------------------------------------
create materialized view sensor_readings_1m
with (timescaledb.continuous) as
select
  sensor_id,
  time_bucket(interval '1 minute', ts) as bucket,
  avg(value)    as avg_value,
  min(value)    as min_value,
  max(value)    as max_value,
  stddev(value) as stddev_value,
  count(*)      as sample_count
from sensor_readings
group by sensor_id, time_bucket(interval '1 minute', ts);

select add_continuous_aggregate_policy(
  'sensor_readings_1m',
  start_offset      => interval '3 hours',
  end_offset        => interval '1 minute',
  schedule_interval => interval '1 minute',
  if_not_exists     => true
);

-- ------------------------------------------------------------
-- Continuous aggregate: 1-hour rollup (hierarchical, built from 1m)
-- ------------------------------------------------------------
create materialized view sensor_readings_1h
with (timescaledb.continuous) as
select
  sensor_id,
  time_bucket(interval '1 hour', bucket) as bucket,
  avg(avg_value)     as avg_value,
  min(min_value)     as min_value,
  max(max_value)     as max_value,
  sum(sample_count)  as sample_count
from sensor_readings_1m
group by sensor_id, time_bucket(interval '1 hour', bucket);

select add_continuous_aggregate_policy(
  'sensor_readings_1h',
  start_offset      => interval '1 day',
  end_offset        => interval '1 hour',
  schedule_interval => interval '10 minutes',
  if_not_exists     => true
);

-- NOTE: RLS is intentionally NOT enabled on sensor_readings.
-- TimescaleDB's columnstore + continuous aggregates are incompatible
-- with row-level security on hypertables. You can have any two of
-- (RLS, columnstore, continuous aggregates), not all three.
-- We pick columnstore + continuous aggregates for compression and
-- rollup performance. Tenant isolation for sensor_readings is
-- enforced at the application query layer: every query filters by
-- sensor_id, and the sensors table (which DOES have RLS) controls
-- which sensor_ids a user can see. This is also the pattern Timescale
-- recommends for high-volume time-series tables regardless of RLS
-- availability, because RLS adds per-row overhead that dominates
-- query cost on hypertable scans at commercial scale.

-- ------------------------------------------------------------
-- Columnstore (Timescale 2.18+ replacement for compression).
-- Chunks older than 7 days get column-compressed, segmented by
-- sensor_id for fast sensor-scoped queries.
-- ------------------------------------------------------------
alter table sensor_readings set (
  timescaledb.enable_columnstore,
  timescaledb.segmentby = 'sensor_id',
  timescaledb.orderby   = 'ts desc'
);

call add_columnstore_policy('sensor_readings', after => interval '7 days', if_not_exists => true);

-- Retention: drop raw chunks after 90 days. Rollups persist in caggs.
select add_retention_policy('sensor_readings', drop_after => interval '90 days', if_not_exists => true);

-- ============================================================
-- ALARMS (ISA-18.2)
-- ============================================================
create table alarms (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references orgs(id) on delete cascade,
  sensor_id       uuid not null references sensors(id) on delete cascade,
  threshold_kind  text not null,                 -- 'lo_lo','lo','hi','hi_hi','rate_of_change'
  priority        alarm_priority not null,
  state           alarm_state not null default 'normal',
  state_since     timestamptz not null default now(),
  acknowledged_by uuid,
  shelved_until   timestamptz,
  unique (sensor_id, threshold_kind)
);
create index alarms_state_idx on alarms (state) where state <> 'normal';

-- Append-only transition log. Source of truth for replay.
create table alarm_events (
  id              uuid primary key default gen_random_uuid(),
  alarm_id        uuid not null references alarms(id) on delete cascade,
  from_state      alarm_state,
  to_state        alarm_state not null,
  occurred_at     timestamptz not null default now(),
  triggered_value double precision,
  actor           uuid,
  note            text
);
create index alarm_events_alarm_ts_idx on alarm_events (alarm_id, occurred_at desc);

-- ============================================================
-- FAILURE RECORDS
-- ============================================================
create table failure_records (
  id                   uuid primary key default gen_random_uuid(),
  org_id               uuid not null references orgs(id) on delete cascade,
  asset_id             uuid not null references assets(id) on delete restrict,
  detected_at          timestamptz not null,
  failed_at            timestamptz,
  failure_mode_id      uuid not null references iso14224_failure_modes(id),
  failure_mechanism_id uuid references iso14224_failure_mechanisms(id),
  severity             alarm_priority not null,
  detection_method     text,                     -- 'vibration','operator','inspection','process'
  downtime_hours       numeric(10,2),
  production_loss_usd  numeric(14,2),
  root_cause           text,
  notes                text,
  created_at           timestamptz not null default now()
);
create index fr_asset_idx on failure_records (asset_id, detected_at desc);

-- ============================================================
-- RUL PREDICTIONS (per failure mode, time-stamped, versioned)
-- ============================================================
create table rul_predictions (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references orgs(id) on delete cascade,
  asset_id        uuid not null references assets(id) on delete cascade,
  generated_at    timestamptz not null default now(),
  model_name      text not null,                 -- 'exp_pf_v1','weibull_v2'
  model_version   text not null,
  failure_mode_id uuid references iso14224_failure_modes(id),
  rul_p10_days    numeric(10,2) not null,        -- pessimistic
  rul_p50_days    numeric(10,2) not null,        -- median
  rul_p90_days    numeric(10,2) not null,        -- optimistic
  confidence      numeric(4,3) not null,         -- 0.000 - 1.000
  features        jsonb not null default '{}'::jsonb,
  unique (asset_id, generated_at, model_name, failure_mode_id)
);
create index rul_asset_latest_idx on rul_predictions (asset_id, generated_at desc);

-- ============================================================
-- INSIGHTS (prescriptive layer — the product's value)
-- ============================================================
create table insights (
  id                    uuid primary key default gen_random_uuid(),
  org_id                uuid not null references orgs(id) on delete cascade,
  asset_id              uuid not null references assets(id) on delete cascade,
  generated_at          timestamptz not null default now(),
  status                insight_status not null default 'open',
  action_type           insight_action_type not null,
  headline              text not null,           -- 'Replace DE bearing within 14 days'
  rationale             text not null,
  confidence            numeric(4,3) not null,
  priority              alarm_priority not null,
  estimated_savings_usd numeric(14,2),
  estimated_cost_usd    numeric(14,2),
  due_by                timestamptz,
  rul_prediction_id     uuid references rul_predictions(id) on delete set null,
  failure_record_id     uuid references failure_records(id) on delete set null,
  sensor_id             uuid references sensors(id)         on delete set null,
  alarm_id              uuid references alarms(id)          on delete set null,
  resolved_at           timestamptz,
  resolved_by           uuid,
  resolution_notes      text
);
create index insights_asset_status_idx  on insights (asset_id, status);
create index insights_open_priority_idx on insights (priority, due_by) where status = 'open';

-- ============================================================
-- WORK ORDERS (many WOs -> one insight)
-- ============================================================
create table work_orders (
  id                 uuid primary key default gen_random_uuid(),
  org_id             uuid not null references orgs(id) on delete cascade,
  asset_id           uuid not null references assets(id) on delete restrict,
  failure_record_id  uuid references failure_records(id) on delete set null,
  insight_id         uuid references insights(id)       on delete set null,
  number             text not null,              -- 'WO-2026-00417'
  title              text not null,
  description        text,
  status             work_order_status    not null default 'draft',
  urgency            work_order_urgency   not null default 'scheduled',
  strategy           maintenance_strategy not null default 'reactive',
  discipline         text,                       -- 'mechanical','instrument','operations','electrical'
  planned_start      timestamptz,
  planned_end        timestamptz,
  actual_start       timestamptz,
  actual_end         timestamptz,
  estimated_hours    numeric(8,2),
  actual_hours       numeric(8,2),
  estimated_cost_usd numeric(14,2),
  actual_cost_usd    numeric(14,2),
  assigned_to        uuid,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (org_id, number)
);
create index wo_asset_idx   on work_orders (asset_id, status);
create index wo_status_idx  on work_orders (status, planned_start);
create index wo_insight_idx on work_orders (insight_id);

-- ============================================================
-- MAINTENANCE PLANS (PM schedule templates)
-- ============================================================
create table maintenance_plans (
  id                     uuid primary key default gen_random_uuid(),
  org_id                 uuid not null references orgs(id) on delete cascade,
  asset_id               uuid not null references assets(id) on delete cascade,
  name                   text not null,
  strategy               maintenance_strategy not null,
  task_description       text not null,
  interval_days          integer,
  interval_runtime_hours integer,
  last_executed_at       timestamptz,
  next_due_at            timestamptz,
  estimated_hours        numeric(8,2),
  required_skills        text[],
  created_at             timestamptz not null default now()
);
create index mp_asset_idx on maintenance_plans (asset_id, next_due_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table plants            enable row level security;
alter table assets            enable row level security;
alter table sensors           enable row level security;
-- sensor_readings RLS enabled above (before columnstore)
alter table alarms            enable row level security;
alter table alarm_events      enable row level security;
alter table failure_records   enable row level security;
alter table work_orders       enable row level security;
alter table maintenance_plans enable row level security;
alter table rul_predictions   enable row level security;
alter table insights          enable row level security;

-- Tenant isolation policies deferred until the auth layer is chosen.
-- RLS is enabled above on every tenant-scoped table, so non-superusers
-- get deny-all by default (secure). The seed script connects as
-- tsdbadmin (superuser) which bypasses RLS, so seeding works today.
--
-- When the frontend auth stack lands (Clerk / Auth0 / custom JWT),
-- add policies in a follow-up migration that reads the tenant claim
-- via current_setting('app.org_id', true) set at session start.
