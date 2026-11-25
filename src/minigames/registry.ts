import type { ComponentType } from "react";
import type { City, Effects, MinigameId } from "@/engine";
import { Peche } from "./Peche";

export interface MinigameResult {
  effects: Effects;
  text: string;
}

export interface MinigameProps {
  city: City;
  onDone: (result: MinigameResult) => void;
}

export interface MinigameDef {
  title: string;
  instruction: string;
  place: (city: City) => string;
  Component: ComponentType<MinigameProps>;
}

export const MINIGAMES: Record<MinigameId, MinigameDef> = {
  peche: {
    title: "La pêche",
    instruction: "Ferre pile quand le bouchon plonge. Ni trop tôt, ni trop tard.",
    place: (city) => (city === "marseille" ? "Marseille, au port" : "Paris, sur les quais"),
    Component: Peche,
  },
};
