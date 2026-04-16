// ============================================================
// physics.mjs — degradation models, noise, RUL band math
// Pure functions, no I/O. Deterministic via seeded PRNG.
// ============================================================

// ---- Seeded PRNG (mulberry32) ----
// Fast, small-state, good enough for monte-carlo + gaussian sampling.
export function createRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller gaussian sampler; returns N(0, 1).
export function gaussian(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Clamped gaussian noise scaled by sigma, bounded at ±3σ.
export function noise(rng, sigma) {
  const g = gaussian(rng);
  const clamped = Math.max(-3, Math.min(3, g));
  return clamped * sigma;
}

// ============================================================
// DEGRADATION MODELS
// All models take (t, duration, params) where:
//   t        = elapsed seconds since start
//   duration = total simulation seconds
//   params   = model-specific knobs
// Return: signal value in engineering units (no noise; caller adds).
// ============================================================

// Flat baseline. Healthy asset, no drift.
export function flat({ baseline }) {
  return () => baseline;
}

// Linear drift from baseline to final over full duration.
export function linear({ baseline, final, startFrac = 0, endFrac = 1 }) {
  return (t, duration) => {
    const frac = t / duration;
    if (frac <= startFrac) return baseline;
    if (frac >= endFrac) return final;
    const p = (frac - startFrac) / (endFrac - startFrac);
    return baseline + (final - baseline) * p;
  };
}

// Asymptotic fouling: value approaches asymptote with 1 - e^(-kt) shape.
// Good for heat exchanger fouling factor.
export function asymptotic({ baseline, asymptote, tau }) {
  return (t) => {
    const k = 1 / tau;
    return baseline + (asymptote - baseline) * (1 - Math.exp(-k * t));
  };
}

// Power-law growth (pit depth, erosion).
// value = baseline + k * (t/duration)^exponent * (final - baseline)
export function powerLaw({ baseline, final, exponent = 0.33 }) {
  return (t, duration) => {
    const frac = Math.max(0, Math.min(1, t / duration));
    return baseline + (final - baseline) * Math.pow(frac, exponent);
  };
}

// Sawtooth: linear rise with periodic drops (cleaning cycles, ASV openings).
export function sawtooth({ baseline, peak, periodSec }) {
  return (t) => {
    const phase = (t % periodSec) / periodSec;
    return baseline + (peak - baseline) * phase;
  };
}

// ============================================================
// 4-stage bearing degradation (P-F exponential hockey-stick).
// Based on DESK-RESEARCH-023:
//   Stage 1: 60-80% of life, flat baseline
//   Stage 2: 10-20% of life, slow linear rise
//   Stage 3: 5-15% of life, exponential knee
//   Stage 4: 1-5% of life, rapid exponential to failure
// ============================================================
export function bearingFourStage({
  baseline,   // e.g. 1.0 mm/s
  stage2Start,// fraction of duration, e.g. 0.50 (day 14 of 28)
  stage3Start,// fraction of duration, e.g. 0.78 (day 22)
  stage4Start,// fraction of duration, e.g. 0.96 (day 27)
  stage2End,  // value at end of stage 2, e.g. 2.0
  stage3End,  // value at end of stage 3, e.g. 5.5
  stage4End,  // value at failure, e.g. 8.2
}) {
  return (t, duration) => {
    const frac = t / duration;
    if (frac < stage2Start) return baseline;
    if (frac < stage3Start) {
      const p = (frac - stage2Start) / (stage3Start - stage2Start);
      return baseline + (stage2End - baseline) * p;
    }
    if (frac < stage4Start) {
      // Exponential knee: y = a * e^(k*x)
      const p = (frac - stage3Start) / (stage4Start - stage3Start);
      const k = Math.log(stage3End / stage2End);
      return stage2End * Math.exp(k * p);
    }
    // Stage 4: rapid exponential to failure value
    const p = (frac - stage4Start) / (1 - stage4Start);
    const k = Math.log(stage4End / stage3End);
    return stage3End * Math.exp(k * Math.min(p, 1));
  };
}

// ============================================================
// RUL CONFIDENCE BANDS
// Based on DESK-RESEARCH-023 confidence ranges.
// Band widens with sqrt(projection distance).
// ============================================================
const BAND_BASE = {
  vibration: 0.32, // ±32%
  oil:       0.40,
  corrosion: 0.20,
  fouling:   0.28,
  thermal:   0.30,
  default:   0.35,
};

export function rulBand({ p50Days, method = 'default', horizonDays = 30 }) {
  const base = BAND_BASE[method] ?? BAND_BASE.default;
  // Widen with sqrt(horizon/30). Closer predictions → tighter bands.
  const widen = Math.sqrt(Math.max(horizonDays, 1) / 30);
  const spread = base * widen;
  return {
    p10: Math.max(0, p50Days * (1 - spread)),
    p50: p50Days,
    p90: p50Days * (1 + spread),
  };
}

// Confidence decreases as RUL shrinks (system less sure near end of life).
export function rulConfidence({ p50Days }) {
  if (p50Days > 90) return 0.82;
  if (p50Days > 30) return 0.76;
  if (p50Days > 14) return 0.68;
  if (p50Days > 7)  return 0.59;
  return 0.52;
}

// ============================================================
// ALARM THRESHOLD CROSSING DETECTOR
// Given a sensor definition and a value, returns the worst crossed
// threshold kind, or 'normal'.
// Order of precedence: hi_hi > lo_lo > hi > lo > normal.
// ============================================================
export function classifyThreshold(sensor, value) {
  const { lo, lo_lo, hi, hi_hi } = sensor;
  if (hi_hi != null && value >= hi_hi) return 'hi_hi';
  if (lo_lo != null && value <= lo_lo) return 'lo_lo';
  if (hi    != null && value >= hi)    return 'hi';
  if (lo    != null && value <= lo)    return 'lo';
  return 'normal';
}

export const PRIORITY_FOR_THRESHOLD = {
  lo_lo: 'critical',
  hi_hi: 'critical',
  lo:    'high',
  hi:    'high',
};
