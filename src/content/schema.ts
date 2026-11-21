import type { CareerId, City, Effects } from "@/engine/types";

export interface Conditions {
  minAge?: number;
  maxAge?: number;
  cities?: City[];
  careers?: CareerId[];
  requiresFlags?: string[];
  forbidsFlags?: string[];
  minMoney?: number;
  maxMoney?: number;
}

export interface Outcome {
  weight?: number;
  text: string;
  effects: Effects;
  setFlags?: string[];
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
  | "repos";

export interface ActionDef {
  id: ActionId;
  label: string;
  hint: string;
  minMoney?: number;
}
