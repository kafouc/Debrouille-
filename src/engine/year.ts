import { DISTRICTS } from "@/content/districts";
import { monthlySalary } from "./careers";
import type { Rng } from "./rng";
import type { LifeState } from "./types";

const LIVING_COST = 550;

function healthDecay(age: number): number {
  if (age < 40) return 1;
  if (age < 60) return 2;
  if (age < 75) return 3;
  return 5;
}

/** Passe à l'année suivante : argent, vieillissement, mort éventuelle. */
export function endYear(state: LifeState, rng: Rng): LifeState {
  const s = structuredClone(state);
  const rent = DISTRICTS[s.character.city].find((d) => d.name === s.character.district)?.rent ?? 0;
  s.gauges.money += 12 * (monthlySalary(s) - rent - LIVING_COST);
  const loss = healthDecay(s.age) + (s.gauges.morale < 20 ? 2 : 0);
  s.gauges.health = Math.max(0, s.gauges.health - loss);
  s.age += 1;
  s.currentEventId = null;
  s.eventQueue = [];
  if (s.gauges.health <= 0) {
    s.phase = "dead";
    s.deathCause = "sante";
  } else if (s.age >= 100 || (s.age >= 75 && rng.next() < (s.age - 74) * 0.04)) {
    s.phase = "dead";
    s.deathCause = "vieillesse";
  } else {
    s.phase = "actions";
  }
  s.rngState = rng.getState();
  return s;
}
