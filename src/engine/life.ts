import { DISTRICTS } from "@/content/districts";
import { Rng } from "./rng";
import type { City, FamilyStart, LifeState } from "./types";

/** Champs ajoutés par la version 2 (situation de vie, année en scène). */
export function lifeDefaults(): Pick<
  LifeState,
  | "relation" | "childrenAges" | "retired" | "pension" | "season" | "yearActions" | "ledger"
  | "lastYear" | "cinematics" | "milestones" | "minigame" | "lastMinigameAge" | "hadCrisis"
> {
  return {
    relation: "celibataire",
    childrenAges: [],
    retired: false,
    pension: 0,
    season: null,
    yearActions: [],
    ledger: [],
    lastYear: null,
    cinematics: [],
    milestones: [],
    minigame: null,
    lastMinigameAge: null,
    hadCrisis: false,
  };
}

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
    version: 2,
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
    ...lifeDefaults(),
    cinematics: ["depart"],
    milestones: [{ age: 18, label: "18 ans" }],
  };
}
