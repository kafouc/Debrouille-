import { DISTRICTS } from "@/content/districts";
import { monthlySalary } from "./careers";
import type { Rng } from "./rng";
import type { LifeState } from "./types";

const LIVING_COST = 550;
export const CHILD_COST = 4000;

function healthDecay(age: number): number {
  if (age < 40) return 1;
  if (age < 60) return 2;
  if (age < 75) return 3;
  return 5;
}

/** Ajoute une somme au livre de comptes, en cumulant les lignes de même libellé. */
export function addToLedger(state: LifeState, label: string, amount: number) {
  if (amount === 0) return;
  const line = state.ledger.find((l) => l.label === label);
  if (line) line.amount += amount;
  else state.ledger.push({ label, amount });
}

/** Passe à l'année suivante : argent, enfants, vieillissement, mort éventuelle, puis bilan. */
export function endYear(state: LifeState, rng: Rng): LifeState {
  const s = structuredClone(state);
  const rent = DISTRICTS[s.character.city].find((d) => d.name === s.character.district)?.rent ?? 0;
  const yearly: [string, number][] = [
    [s.retired ? "Retraite" : "Salaire", 12 * (s.retired ? s.pension : monthlySalary(s))],
    ["Loyer", -12 * rent],
    ["Vie courante", -12 * LIVING_COST],
    ["Enfants", -CHILD_COST * s.childrenAges.filter((a) => a < 18).length],
  ];
  for (const [label, amount] of yearly) {
    s.gauges.money += amount;
    addToLedger(s, label, amount);
  }
  s.childrenAges = s.childrenAges.map((a) => a + 1);
  const loss = healthDecay(s.age) + (s.gauges.morale < 20 ? 2 : 0);
  s.gauges.health = Math.max(0, s.gauges.health - loss);
  s.age += 1;
  s.currentEventId = null;
  s.eventQueue = [];
  s.eventSeasons = [];
  s.season = null;
  s.minigame = null;
  if (s.gauges.health <= 0) {
    s.phase = "dead";
    s.deathCause = "sante";
  } else if (s.age >= 100 || (s.age >= 75 && rng.next() < (s.age - 74) * 0.04)) {
    s.phase = "dead";
    s.deathCause = "vieillesse";
  } else {
    s.phase = "summary";
    s.lastYear = { age: s.age, lines: s.ledger.map((l) => ({ ...l })), total: s.ledger.reduce((t, l) => t + l.amount, 0) };
  }
  if (s.phase === "dead") s.cinematics.push("vie-qui-defile");
  s.rngState = rng.getState();
  return s;
}
