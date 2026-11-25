import type { CareerId, City, Effects, Relation, Season } from "@/engine/types";

export interface Conditions {
  minAge?: number;
  maxAge?: number;
  cities?: City[];
  careers?: CareerId[];
  requiresFlags?: string[];
  forbidsFlags?: string[];
  minMoney?: number;
  maxMoney?: number;
  relations?: Relation[];
  minChildren?: number;
  maxChildren?: number;
  /** Au moins un enfant dont l'âge est dans l'intervalle [min, max]. */
  childAge?: [number, number];
}

export type LifeChange = "couple" | "mariage" | "bebe" | "rupture";

export interface Outcome {
  weight?: number;
  text: string;
  effects: Effects;
  setFlags?: string[];
  life?: LifeChange;
}

export interface Choice {
  label: string;
  outcomes: Outcome[];
}

export interface EventCard {
  id: string;
  text: string;
  detail?: string;
  conditions?: Conditions;
  weight?: number;
  repeatable?: boolean;
  /** Saison imposée (soldes en hiver, vacances en été…). Sinon tirée au hasard. */
  season?: Season;
  choices: Choice[];
}

export type ActionId =
  | "bosser"
  | "formation"
  | "job"
  | "business"
  | "sortir"
  | "sport"
  | "famille"
  | "investir"
  | "repos"
  | "retraite";

export interface ActionDef {
  id: ActionId;
  label: string;
  hint: string;
  minMoney?: number;
  minAge?: number;
}
