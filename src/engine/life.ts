import { DISTRICTS } from "@/content/districts";
import { Rng } from "./rng";
import type { City, FamilyStart, LifeState } from "./types";

export interface NewLifeInput {
  name: string;
  city: City;
  district: string;
  skin: string;
}

const START_MONEY: Record<FamilyStart, number> = { modeste: 300, moyenne: 2000, aisee: 10000 };
const MAX_NAME = 16;

export function cleanName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "Toi";
  return Array.from(trimmed).slice(0, MAX_NAME).join("");
}

export function newLife(input: NewLifeInput, seed: string): LifeState {
  if (!DISTRICTS[input.city]?.some((d) => d.name === input.district)) {
    throw new Error("QUARTIER_INCONNU");
  }
  const rng = new Rng(seed);
  const familyStart = rng.pick<FamilyStart>(["modeste", "moyenne", "aisee"]);
  return {
    version: 1,
    seed,
    rngState: rng.getState(),
    character: { name: cleanName(input.name), city: input.city, district: input.district, skin: input.skin },
    familyStart,
    age: 18,
    gauges: { money: START_MONEY[familyStart], health: 90, morale: 60, reputation: 5, family: 60 },
    career: "etudiant",
    careerLevel: 0,
    formations: 0,
    flags: [],
    seenEvents: [],
    eventQueue: [],
    currentEventId: null,
    lastResult: null,
    phase: "actions",
    deathCause: null,
    history: [],
  };
}
