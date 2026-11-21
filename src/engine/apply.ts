import type { Effects, Gauges } from "./types";

const BOUNDED: (keyof Gauges)[] = ["health", "morale", "reputation", "family"];

/** Ajoute des effets aux jauges : santé, moral, réputation, famille restent entre 0 et 100. */
export function applyEffects(gauges: Gauges, effects: Effects): Gauges {
  const next = { ...gauges };
  for (const key of Object.keys(effects) as (keyof Gauges)[]) {
    next[key] = Math.round(next[key] + (effects[key] ?? 0));
  }
  for (const key of BOUNDED) next[key] = Math.min(100, Math.max(0, next[key]));
  return next;
}
