// ============================================================
// seed.mjs — APM commercial v2 seed + physics simulator.
//
// Usage:
//   node scripts/seed.mjs           # upsert taxonomy + assets, run sim
//   node scripts/seed.mjs --reset   # truncate tenant data first
//
// Requires:
//   - Local Supabase running: `supabase start` (Postgres at 54322)
//   - Migration 001_schema.sql already applied
//   - .env with DATABASE_URL
//
// Pipeline:
//   1. Load .env, connect via postgres (porsager).
//   2. Optionally reset tenant data.
//   3. Upsert ISO 14224 reference taxonomy.
//   4. Upsert Baytown org + plant + 10 assets + sub-components + sensors.
//   5. Create alarm definitions from sensor thresholds.
//   6. Run 28-day physics simulation at 1-minute tick. Batched COPY-style
//      inserts in 10k-row chunks.
//   7. Walk the ISA-18.2 alarm state machine off the simulated values,
//      writing alarm_events.
//   8. Emit failure_records for assets with a story.
//   9. Generate daily RUL predictions (+ extra near failure) with P10/P50/P90.
//  10. Generate prescriptive insights and spawn work orders across disciplines.
// ============================================================

import 'dotenv/config';
import postgres from 'postgres';
import {
  createRng, noise, flat, linear, asymptotic, powerLaw, sawtooth,
  bearingFourStage, rulBand, rulConfidence, classifyThreshold, PRIORITY_FOR_THRESHOLD,
} from './physics.mjs';
import {
  EQUIPMENT_CLASSES, FAILURE_MODES, FAILURE_MECHANISMS,
  ORG_NAME, PLANT_NAME, PLANT_TZ, ASSETS, ASSET_DESIGN,
} from './data.mjs';

// ---- Config ----
const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
const SIM_SEED     = parseInt(process.env.SIM_SEED ?? '20260411', 10);
const SIM_END      = process.env.SIM_END ? new Date(process.env.SIM_END) : new Date();
const SIM_DURATION_DAYS = 28;
const TICK_SECONDS      = 60;   // 1-minute sample rate
const BATCH_SIZE        = 10_000;
const RESET             = process.argv.includes('--reset');

const simStart = new Date(SIM_END.getTime() - SIM_DURATION_DAYS * 86_400_000);
const SIM_DURATION_SEC = SIM_DURATION_DAYS * 86_400;

// ---- Model registry ----
const MODELS = { flat, linear, asymptotic, powerLaw, sawtooth, bearingFourStage };

// ============================================================
// main
// ============================================================
async function main() {
  console.log(`[seed] connecting to ${DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`);
  const sql = postgres(DATABASE_URL, { max: 4, idle_timeout: 30 });

  try {
    if (RESET) await resetTenant(sql);
    await seedTaxonomy(sql);

    const { orgId, plantId } = await seedOrgPlant(sql);
    const assetMap  = await seedAssets(sql, orgId, plantId);
    const sensorMap = await seedSensors(sql, orgId, assetMap);
    const alarmMap  = await seedAlarms(sql, orgId, sensorMap);

    const { readingCount, alarmEventCount } = await simulate(sql, sensorMap, alarmMap);
    console.log(`[sim] wrote ${readingCount.toLocaleString()} readings + ${alarmEventCount} alarm events`);

    await emitFailureRecords(sql, orgId, assetMap, sensorMap);
    await generateRul(sql, orgId, assetMap);
    await generateInsightsAndWorkOrders(sql, orgId, assetMap);
    await seedRuntimeAndProduction(sql, assetMap);
    await refreshKpiAggregates(sql);

    // Snap each asset's current `status` column to its latest runtime state
    // so Plant Overview asset-count query reflects the simulated outcome.
    await syncAssetStatuses(sql);

    console.log('[seed] done');
  } catch (err) {
    console.error('[seed] FAILED', err);
    process.exitCode = 1;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

// ============================================================
// 1. Reset tenant data
// ============================================================
async function resetTenant(sql) {
  // Wipes simulation + operational data but keeps orgs + plants intact.
  // This means the Baytown org UUID is stable across resets, so the
  // Supabase profile -> org_id mapping (set up manually once) stays valid.
  // In production, orgs are created by the signup flow, never by this script.
  console.log('[reset] truncating simulation data (preserving orgs + plants)');
  await sql`
    truncate
      sensor_readings, alarm_events, alarms, insights, work_orders,
      rul_predictions, failure_records, maintenance_plans,
      production_log, asset_runtime_states,
      sensors, assets
    restart identity cascade
  `;
}

// ============================================================
// 2. ISO 14224 reference taxonomy (idempotent upsert by code)
// ============================================================
async function seedTaxonomy(sql) {
  console.log('[taxonomy] upserting equipment classes + failure modes + mechanisms');

  for (const ec of EQUIPMENT_CLASSES) {
    await sql`
      insert into iso14224_equipment_classes ${sql(ec)}
      on conflict (code) do update set class = excluded.class, name = excluded.name
    `;
  }

  // failure_modes unique on (code, equipment_class_id)
  const classRows = await sql`select id, code from iso14224_equipment_classes`;
  const classByCode = new Map(classRows.map(r => [r.code, r.id]));

  for (const fm of FAILURE_MODES) {
    const equipment_class_id = classByCode.get(fm.klass);
    await sql`
      insert into iso14224_failure_modes ${sql({
        code: fm.code, name: fm.name, equipment_class_id,
      })}
      on conflict (code, equipment_class_id) do update set name = excluded.name
    `;
  }

  // mechanisms FK to a failure_mode_id. We attach each mechanism to the first
  // mode we find of equivalent intent; for simplicity store one row per mode+mech.
  const modeRows = await sql`select id, code from iso14224_failure_modes`;
  for (const mode of modeRows) {
    for (const mech of FAILURE_MECHANISMS) {
      await sql`
        insert into iso14224_failure_mechanisms ${sql({
          failure_mode_id: mode.id, code: mech.code, name: mech.name,
        })}
        on conflict (failure_mode_id, code) do nothing
      `;
    }
  }
}

// ============================================================
// 3. Org + Plant
// ============================================================
async function seedOrgPlant(sql) {
  const [org] = await sql`
    insert into orgs ${sql({ name: ORG_NAME })}
    on conflict do nothing returning id
  `;
  const orgId = org?.id ?? (await sql`select id from orgs where name = ${ORG_NAME}`)[0].id;

  const [plant] = await sql`
    insert into plants ${sql({ org_id: orgId, name: PLANT_NAME, timezone: PLANT_TZ })}
    on conflict (org_id, name) do update set timezone = excluded.timezone
    returning id
  `;
  console.log(`[tenant] org=${orgId} plant=${plant.id}`);
  return { orgId, plantId: plant.id };
}

// ============================================================
// 4. Assets (recursive, respects parent_asset_id)
// ============================================================
async function seedAssets(sql, orgId, plantId) {
  const classRows = await sql`select id, code from iso14224_equipment_classes`;
  const classByCode = new Map(classRows.map(r => [r.code, r.id]));

  const assetMap = new Map(); // tag -> { id, def }

  async function upsert(def, parentId = null) {
    const equipment_class_id = classByCode.get(def.klass);
    const design = ASSET_DESIGN[def.tag] ?? null;
    const row = {
      org_id: orgId,
      plant_id: plantId,
      parent_asset_id: parentId,
      tag: def.tag,
      name: def.name,
      equipment_class_id,
      criticality: def.criticality,
      status: 'running',
      design_life_years: def.installedYears ?? null,
      replacement_cost_usd: def.replacementCost ?? null,
      design_throughput_rate: design?.rate ?? null,
      design_throughput_unit: design?.unit ?? null,
      production_weight: design?.weight ?? 0,
    };
    const [a] = await sql`
      insert into assets ${sql(row)}
      on conflict (plant_id, tag) do update set
        name = excluded.name,
        criticality = excluded.criticality,
        equipment_class_id = excluded.equipment_class_id,
        parent_asset_id = excluded.parent_asset_id,
        design_throughput_rate = excluded.design_throughput_rate,
        design_throughput_unit = excluded.design_throughput_unit,
        production_weight = excluded.production_weight,
        updated_at = now()
      returning id
    `;
    assetMap.set(def.tag, { id: a.id, def });
    for (const child of def.children ?? []) {
      await upsert(child, a.id);
    }
  }

  for (const asset of ASSETS) await upsert(asset);
  console.log(`[assets] seeded ${assetMap.size} assets`);
  return assetMap;
}

// ============================================================
// 5. Sensors
// ============================================================
async function seedSensors(sql, orgId, assetMap) {
  const sensorMap = new Map(); // tag -> { id, def, assetTag }

  async function upsertSensorsFor(def) {
    const asset = assetMap.get(def.tag);
    for (const s of def.sensors ?? []) {
      const row = {
        org_id: orgId,
        asset_id: asset.id,
        tag: s.tag,
        name: s.name,
        unit: s.unit,
        measurement_type: s.measurementType,
        sample_rate_hz: 1 / TICK_SECONDS,
        lo_lo: s.thresholds.lo_lo,
        lo:    s.thresholds.lo,
        hi:    s.thresholds.hi,
        hi_hi: s.thresholds.hi_hi,
        expected_min: s.thresholds.expected_min ?? null,
        expected_max: s.thresholds.expected_max ?? null,
      };
      const [r] = await sql`
        insert into sensors ${sql(row)}
        on conflict (asset_id, tag) do update set
          name = excluded.name,
          unit = excluded.unit,
          lo_lo = excluded.lo_lo, lo = excluded.lo,
          hi = excluded.hi, hi_hi = excluded.hi_hi
        returning id
      `;
      sensorMap.set(s.tag, { id: r.id, def: s, assetTag: def.tag });
    }
    for (const child of def.children ?? []) await upsertSensorsFor(child);
  }

  for (const a of ASSETS) await upsertSensorsFor(a);
  console.log(`[sensors] seeded ${sensorMap.size} sensors`);
  return sensorMap;
}

// ============================================================
// 6. Alarm definitions (one per threshold kind present on sensor)
// ============================================================
async function seedAlarms(sql, orgId, sensorMap) {
  const alarmMap = new Map(); // sensor_id|threshold_kind -> alarm_id
  for (const [, sensor] of sensorMap) {
    const kinds = [];
    if (sensor.def.thresholds.lo_lo != null) kinds.push('lo_lo');
    if (sensor.def.thresholds.lo    != null) kinds.push('lo');
    if (sensor.def.thresholds.hi    != null) kinds.push('hi');
    if (sensor.def.thresholds.hi_hi != null) kinds.push('hi_hi');
    for (const kind of kinds) {
      const [a] = await sql`
        insert into alarms ${sql({
          org_id: orgId,
          sensor_id: sensor.id,
          threshold_kind: kind,
          priority: PRIORITY_FOR_THRESHOLD[kind] ?? 'medium',
          state: 'normal',
        })}
        on conflict (sensor_id, threshold_kind) do update set
          priority = excluded.priority
        returning id
      `;
      alarmMap.set(`${sensor.id}|${kind}`, a.id);
    }
  }
  console.log(`[alarms] seeded ${alarmMap.size} alarm definitions`);
  return alarmMap;
}

// ============================================================
// 7. Simulation loop
// ============================================================
async function simulate(sql, sensorMap, alarmMap) {
  const ticks = Math.floor(SIM_DURATION_SEC / TICK_SECONDS);
  const sensorList = [...sensorMap.values()];
  const rng = createRng(SIM_SEED);

  // Precompute model fn per sensor.
  const fns = sensorList.map(s => {
    const factory = MODELS[s.def.model];
    if (!factory) throw new Error(`Unknown model: ${s.def.model} on ${s.def.tag}`);
    return { sensor: s, fn: factory(s.def.modelParams), sigma: s.def.noiseSigma ?? 0 };
  });

  // Track alarm state per (sensor, kind) for state-machine walking.
  // Start all in 'normal'.
  const activeState = new Map(); // key = sensor_id|kind -> state string
  const alarmEvents = [];        // batched inserts

  let batch = [];
  let readingCount = 0;

  for (let i = 0; i < ticks; i++) {
    const tSec = i * TICK_SECONDS;
    const ts = new Date(simStart.getTime() + tSec * 1000);
    for (const { sensor, fn, sigma } of fns) {
      const clean = fn(tSec, SIM_DURATION_SEC);
      const value = clean + (sigma > 0 ? noise(rng, sigma) : 0);
      batch.push([sensor.id, ts.toISOString(), value, 192]);
      readingCount++;

      // Alarm state walker: classify and record transitions.
      const kind = classifyThreshold(sensor.def.thresholds, value);
      if (kind !== 'normal') {
        const key = `${sensor.id}|${kind}`;
        const prev = activeState.get(key) ?? 'normal';
        if (prev === 'normal') {
          activeState.set(key, 'unack_alarm');
          const alarmId = alarmMap.get(key);
          if (alarmId) {
            alarmEvents.push({
              alarm_id: alarmId,
              from_state: 'normal',
              to_state: 'unack_alarm',
              occurred_at: ts.toISOString(),
              triggered_value: value,
            });
          }
        }
      } else {
        // Return-to-normal across all kinds this sensor may have been in.
        for (const k of ['lo_lo', 'lo', 'hi', 'hi_hi']) {
          const key = `${sensor.id}|${k}`;
          if (activeState.get(key) && activeState.get(key) !== 'normal') {
            const alarmId = alarmMap.get(key);
            if (alarmId) {
              alarmEvents.push({
                alarm_id: alarmId,
                from_state: activeState.get(key),
                to_state: 'rtn_unack',
                occurred_at: ts.toISOString(),
                triggered_value: value,
              });
            }
            activeState.set(key, 'normal');
          }
        }
      }
    }

    if (batch.length >= BATCH_SIZE) {
      await flushReadings(sql, batch);
      batch = [];
    }
  }
  if (batch.length) await flushReadings(sql, batch);

  // Update current alarm states to whatever they ended at.
  for (const [key, state] of activeState) {
    if (state === 'normal') continue;
    const alarmId = alarmMap.get(key);
    if (alarmId) {
      await sql`update alarms set state = ${state}, state_since = now() where id = ${alarmId}`;
    }
  }

  // Flush alarm events in chunks.
  for (let i = 0; i < alarmEvents.length; i += BATCH_SIZE) {
    const chunk = alarmEvents.slice(i, i + BATCH_SIZE);
    await sql`insert into alarm_events ${sql(chunk, 'alarm_id', 'from_state', 'to_state', 'occurred_at', 'triggered_value')}`;
  }

  return { readingCount, alarmEventCount: alarmEvents.length };
}

async function flushReadings(sql, batch) {
  // Shape rows for postgres.js multi-row insert.
  const rows = batch.map(([sensor_id, ts, value, quality]) => ({ sensor_id, ts, value, quality }));
  // Retry with exponential backoff. Timescale Cloud's TLS edge occasionally
  // resets long-running connections mid-stream; postgres.js transparently
  // reconnects on the next call, so a simple retry loop is sufficient.
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await sql`insert into sensor_readings ${sql(rows, 'sensor_id', 'ts', 'value', 'quality')}`;
      process.stdout.write(`\r[sim] inserted ${rows.length} readings ...`);
      return;
    } catch (err) {
      const transient =
        err.code === 'ERR_SSL_SSL/TLS_ALERT_BAD_RECORD_MAC' ||
        err.code === 'ECONNRESET' ||
        err.code === 'EPIPE' ||
        err.code === 'CONNECTION_CLOSED' ||
        err.code === 'CONNECTION_ENDED' ||
        /ssl|socket|connection/i.test(err.message ?? '');
      if (!transient || attempt === maxAttempts) throw err;
      const delay = 500 * Math.pow(2, attempt - 1); // 500ms, 1s, 2s, 4s
      console.log(`\n[sim] transient error on batch (attempt ${attempt}/${maxAttempts}): ${err.code ?? err.message}. retrying in ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// ============================================================
// 8. Failure records (for assets that have a story)
// ============================================================
async function emitFailureRecords(sql, orgId, assetMap, sensorMap) {
  const modeRows = await sql`
    select fm.id, fm.code, ec.code as klass
    from iso14224_failure_modes fm
    left join iso14224_equipment_classes ec on ec.id = fm.equipment_class_id
  `;
  const modeByKey = new Map(modeRows.map(r => [`${r.klass}|${r.code}`, r.id]));
  const mechRows = await sql`select id, code from iso14224_failure_mechanisms limit 1000`;
  const firstMechByCode = new Map();
  for (const r of mechRows) if (!firstMechByCode.has(r.code)) firstMechByCode.set(r.code, r.id);

  for (const [tag, { id: assetId, def }] of assetMap) {
    if (!def.story) continue;
    const detected_at = new Date(simStart.getTime() + def.story.detectedAtFrac * SIM_DURATION_SEC * 1000);
    const failed_at   = new Date(simStart.getTime() + def.story.failedAtFrac   * SIM_DURATION_SEC * 1000);
    const failure_mode_id = modeByKey.get(`${def.klass}|${def.story.failureModeCode}`);
    const failure_mechanism_id = firstMechByCode.get(def.story.failureMechanismCode) ?? null;

    await sql`
      insert into failure_records ${sql({
        org_id: orgId,
        asset_id: assetId,
        detected_at: detected_at.toISOString(),
        failed_at:   failed_at.toISOString(),
        failure_mode_id,
        failure_mechanism_id,
        severity: def.story.severity,
        detection_method: 'vibration',
        downtime_hours: def.story.downtimeHours,
        production_loss_usd: def.story.productionLossUsd,
        root_cause: def.story.rootCause,
      })}
    `;
    await sql`update assets set status = 'down' where id = ${assetId}`;
    console.log(`[failure] ${tag}: ${def.story.failureModeCode} @ ${failed_at.toISOString()}`);
  }
}

// ============================================================
// 9. RUL predictions (daily per asset, extra near failure)
// ============================================================
async function generateRul(sql, orgId, assetMap) {
  const modeRows = await sql`select id, code from iso14224_failure_modes`;
  const anyMode = modeRows[0]?.id;

  let total = 0;
  for (const [, { id: assetId, def }] of assetMap) {
    // Daily predictions across the window.
    for (let day = 0; day < SIM_DURATION_DAYS; day++) {
      const generated_at = new Date(simStart.getTime() + day * 86_400_000);
      const p50 = computeP50(def, day);
      const bands = rulBand({ p50Days: p50, method: inferMethod(def) });
      const confidence = rulConfidence({ p50Days: p50 });
      await sql`
        insert into rul_predictions ${sql({
          org_id: orgId,
          asset_id: assetId,
          generated_at: generated_at.toISOString(),
          model_name: 'exp_pf_v1',
          model_version: '1.0.0',
          failure_mode_id: anyMode,
          rul_p10_days: bands.p10,
          rul_p50_days: bands.p50,
          rul_p90_days: bands.p90,
          confidence,
          features: { day_of_window: day, has_story: !!def.story },
        })}
        on conflict (asset_id, generated_at, model_name, failure_mode_id) do nothing
      `;
      total++;
    }
  }
  console.log(`[rul] wrote ${total} predictions`);
}

function computeP50(def, day) {
  if (!def.story) {
    // Healthy asset: long RUL, slowly ticks down.
    return 720 - day * 0.8;
  }
  // Story asset: RUL collapses as we approach failedAtFrac.
  const failDay = def.story.failedAtFrac * SIM_DURATION_DAYS;
  return Math.max(0.5, failDay - day);
}

function inferMethod(def) {
  // Story assets with bearing-shaped curves use vibration-based bands.
  if (def.story) return 'vibration';
  if (def.klass === 'HE') return 'fouling';
  if (def.klass === 'VE') return 'corrosion';
  return 'default';
}

// ============================================================
// 10. Insights + work orders
// ============================================================
async function generateInsightsAndWorkOrders(sql, orgId, assetMap) {
  let insightCount = 0;
  let woCount = 0;

  for (const [tag, { id: assetId, def }] of assetMap) {
    if (!def.story) continue;

    // Get the latest RUL for this asset to link evidence.
    const [rul] = await sql`
      select id, rul_p50_days from rul_predictions
      where asset_id = ${assetId}
      order by generated_at desc limit 1
    `;

    const dueBy = new Date(simStart.getTime() + def.story.failedAtFrac * SIM_DURATION_SEC * 1000);

    const [insight] = await sql`
      insert into insights ${sql({
        org_id: orgId,
        asset_id: assetId,
        status: 'open',
        action_type: 'replace_component',
        headline: `Replace ${tag} drive end bearing within 24 hours`,
        rationale:
          `DE bearing vibration has entered ISO 20816 Stage 4 (>7.1 mm/s). ` +
          `Lube oil pressure is trending toward lo-lo alarm threshold, consistent with ` +
          `oil film collapse from filter bypass on day 14. RUL P50 is ${Number(rul?.rul_p50_days ?? 0).toFixed(1)} days ` +
          `with high confidence. Immediate replacement avoids trip and ~$1.2M production loss.`,
        confidence: 0.89,
        priority: 'critical',
        estimated_savings_usd: 1_150_000,
        estimated_cost_usd: 42_000,
        due_by: dueBy.toISOString(),
        rul_prediction_id: rul?.id ?? null,
      })}
      returning id
    `;
    insightCount++;

    // Three WOs spawned off this insight across disciplines.
    const wos = [
      {
        number: `WO-2026-00${401 + woCount}`,
        title: `${tag}: Replace DE bearing assembly`,
        discipline: 'mechanical', urgency: 'emergency',
        estimated_hours: 48, estimated_cost_usd: 38_000,
      },
      {
        number: `WO-2026-00${402 + woCount}`,
        title: `${tag}: Lube oil system flush + filter replacement`,
        discipline: 'operations', urgency: 'urgent',
        estimated_hours: 12, estimated_cost_usd: 3_500,
      },
      {
        number: `WO-2026-00${403 + woCount}`,
        title: `${tag}: DE vibration sensor recalibration post-repair`,
        discipline: 'instrument', urgency: 'scheduled',
        estimated_hours: 4, estimated_cost_usd: 800,
      },
    ];

    for (const wo of wos) {
      await sql`
        insert into work_orders ${sql({
          org_id: orgId,
          asset_id: assetId,
          insight_id: insight.id,
          number: wo.number,
          title: wo.title,
          status: 'planned',
          urgency: wo.urgency,
          strategy: 'predictive',
          discipline: wo.discipline,
          planned_start: dueBy.toISOString(),
          estimated_hours: wo.estimated_hours,
          estimated_cost_usd: wo.estimated_cost_usd,
        })}
        on conflict (org_id, number) do nothing
      `;
      woCount++;
    }
  }
  console.log(`[insights] generated ${insightCount} insights + ${woCount} work orders`);
}

// ============================================================
// 11. Runtime states + production log (ADR-032)
// ============================================================
// For each top-level asset with a production_weight > 0, generate:
//   - asset_runtime_states: one row per state transition
//   - production_log: one row per hour over the 28-day window
//
// State schedule reflects the failure stories: K-101 trips in the
// last 5 hours (matches baytown.js narrative -- "tripped at 2:03 AM,
// now 7 AM, still down"). Other assets run normally or with a minor
// degraded window in the last week.
async function seedRuntimeAndProduction(sql, assetMap) {
  const rng = createRng(SIM_SEED + 1); // separate RNG from sensor sim
  const hourMs = 3_600_000;
  const simEndMs = SIM_END.getTime();
  const simStartMs = simStart.getTime();

  // Align the first hour to the top of the hour for clean buckets.
  const firstHourMs = Math.ceil(simStartMs / hourMs) * hourMs;

  const stateBatch = [];
  const productionBatch = [];

  for (const [tag, { id, def }] of assetMap.entries()) {
    const design = ASSET_DESIGN[tag];
    if (!design || !design.weight) continue; // sub-components skip

    const schedule = stateScheduleFor(tag, simStartMs, simEndMs);

    for (const seg of schedule) {
      stateBatch.push({
        asset_id: id,
        ts: new Date(seg.startMs).toISOString(),
        state: seg.state,
        reason_code: seg.reasonCode ?? null,
        is_planned: !!seg.isPlanned,
      });
    }

    for (let t = firstHourMs; t < simEndMs; t += hourMs) {
      const seg = segmentAt(schedule, t);
      const hourly = hourlyProduction(design, seg, rng);
      productionBatch.push({
        asset_id: id,
        hour: new Date(t).toISOString(),
        ...hourly,
      });
    }
  }

  if (stateBatch.length) {
    for (let i = 0; i < stateBatch.length; i += BATCH_SIZE) {
      await sql`insert into asset_runtime_states ${sql(stateBatch.slice(i, i + BATCH_SIZE))} on conflict do nothing`;
    }
  }
  if (productionBatch.length) {
    for (let i = 0; i < productionBatch.length; i += BATCH_SIZE) {
      await sql`insert into production_log ${sql(productionBatch.slice(i, i + BATCH_SIZE))} on conflict do nothing`;
    }
  }

  console.log(`[runtime] wrote ${stateBatch.length} state transitions + ${productionBatch.length} hourly production rows`);
}

// Per-asset state schedule. Returns array of { startMs, state, reasonCode?, isPlanned? }.
// Segments are assumed to extend from startMs to the next segment's startMs.
function stateScheduleFor(tag, simStartMs, simEndMs) {
  const day = 86_400_000;
  const hour = 3_600_000;

  // K-101: running for 27 days, then trips 5 hours before SIM_END. Still down.
  if (tag === 'K-101') {
    const trippedAt = simEndMs - 5 * hour;
    return [
      { startMs: simStartMs, state: 'running' },
      { startMs: trippedAt,  state: 'down', reasonCode: 'BRD', isPlanned: false },
    ];
  }

  // Assets with linear/asymptotic degradation stories -- enter degraded state
  // in the final week but keep producing at reduced performance.
  if (tag === 'P-203' || tag === 'E-105' || tag === 'T-102' || tag === 'R-301') {
    const degradedAt = simEndMs - 7 * day;
    return [
      { startMs: simStartMs, state: 'running' },
      { startMs: degradedAt, state: 'degraded' },
    ];
  }

  // Everything else: healthy running the whole window.
  return [{ startMs: simStartMs, state: 'running' }];
}

function segmentAt(schedule, tsMs) {
  let current = schedule[0];
  for (const seg of schedule) {
    if (seg.startMs <= tsMs) current = seg;
    else break;
  }
  return current;
}

// Per-asset hourly production row. The numerators/denominators OEE reads.
function hourlyProduction(design, seg, rng) {
  let runSeconds = 0;
  let plannedSeconds = 3600;
  let perfFactor = 0;
  let defectRate = 0;

  if (seg.state === 'running') {
    runSeconds = 3600;
    perfFactor = 0.96 + rng() * 0.04;   // 0.96 - 1.00
    defectRate = 0.001 + rng() * 0.002; // ~99.8% good
  } else if (seg.state === 'degraded') {
    runSeconds = 3600;
    perfFactor = 0.78 + rng() * 0.10;   // 0.78 - 0.88
    defectRate = 0.010 + rng() * 0.008; // ~98.5% good
  } else if (seg.state === 'down') {
    runSeconds = 0;
    perfFactor = 0;
    defectRate = 0;
  } else if (seg.state === 'out_of_service') {
    // Planned outage -- excluded from availability denominator entirely.
    runSeconds = 0;
    plannedSeconds = 0;
    perfFactor = 0;
    defectRate = 0;
  } else if (seg.state === 'standby') {
    runSeconds = 0;
    perfFactor = 0;
    defectRate = 0;
  }

  const runHours = runSeconds / 3600;
  const unitsTheoretical = design.rate * runHours;
  const unitsProduced = unitsTheoretical * perfFactor;
  const unitsDefective = unitsProduced * defectRate;

  return {
    units_produced: Number(unitsProduced.toFixed(4)),
    units_theoretical: Number(unitsTheoretical.toFixed(4)),
    units_defective: Number(unitsDefective.toFixed(4)),
    run_seconds: runSeconds,
    planned_seconds: plannedSeconds,
  };
}

// Timescale views are non-materialized -- nothing to refresh. Placeholder
// left in case future iterations add caggs over production_log.
async function refreshKpiAggregates(_sql) {
  // no-op; asset_kpi_hourly and plant_kpi_hourly are views.
}

// Sync assets.status with the final segment of each asset's schedule so
// count(*) filter (status = ...) queries match the simulator outcome.
async function syncAssetStatuses(sql) {
  await sql`
    with latest as (
      select distinct on (asset_id) asset_id, state
      from asset_runtime_states
      order by asset_id, ts desc
    )
    update assets a
    set    status = latest.state, updated_at = now()
    from   latest
    where  a.id = latest.asset_id
  `;
  console.log('[status] synced assets.status to latest runtime state');
}

main();
