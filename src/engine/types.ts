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

export type Phase = "actions" | "event" | "result" | "dead";

export interface OutcomeResult {
  cardId: string;
  choiceLabel: string;
  text: string;
  effects: Effects;
}

export interface LifeState {
  version: 1;
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
}
