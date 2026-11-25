import type { ActionId } from "@/content/schema";

export type City = "paris" | "marseille";
export type FamilyStart = "modeste" | "moyenne" | "aisee";
export type Grade = "Galérien" | "Débrouillard" | "Petit patron" | "Boss" | "Légende";

export interface Gauges {
  money: number;
  health: number;
  morale: number;
  reputation: number;
  family: number;
}

export type Effects = Partial<Gauges>;

export interface Character {
  name: string;
  city: City;
  district: string;
  /** Couleur de peau, en hexadécimal. */
  skin: string;
}

export type CareerId =
  | "etudiant"
  | "livreur"
  | "vendeur"
  | "bureau"
  | "artisan"
  | "restauration"
  | "foodtruck"
  | "influenceur"
  | "startup"
  | "immobilier"
  | "fonctionnaire";

export type Phase = "actions" | "scene" | "minigame" | "event" | "result" | "summary" | "dead";

export type Relation = "celibataire" | "couple" | "marie";
export type Season = "hiver" | "printemps" | "ete" | "automne";
export type CinematicId =
  | "depart"
  | "premier-salaire"
  | "coup-de-foudre"
  | "mariage"
  | "bebe"
  | "promotion"
  | "galere"
  | "retraite"
  | "vie-qui-defile";
export type MinigameId = "peche";

export interface ActionReplay {
  id: ActionId;
  text: string;
  effects: Effects;
}

export interface LedgerLine {
  label: string;
  amount: number;
}

export interface YearSummary {
  age: number;
  lines: LedgerLine[];
  total: number;
}

export interface OutcomeResult {
  cardId: string;
  choiceLabel: string;
  text: string;
  effects: Effects;
}

export interface LifeState {
  version: 2;
  seed: string;
  rngState: number;
  character: Character;
  familyStart: FamilyStart;
  age: number;
  gauges: Gauges;
  career: CareerId;
  careerLevel: number;
  formations: number;
  flags: string[];
  seenEvents: string[];
  eventQueue: string[];
  currentEventId: string | null;
  lastResult: OutcomeResult | null;
  phase: Phase;
  deathCause: "sante" | "vieillesse" | null;
  history: { age: number; text: string }[];
  relation: Relation;
  childrenAges: number[];
  retired: boolean;
  pension: number;
  season: Season | null;
  yearActions: ActionReplay[];
  ledger: LedgerLine[];
  lastYear: YearSummary | null;
  cinematics: CinematicId[];
  milestones: { age: number; label: string }[];
  minigame: MinigameId | null;
  lastMinigameAge: number | null;
  hadCrisis: boolean;
}
