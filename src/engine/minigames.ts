import type { ActionId } from "@/content/schema";
import type { Rng } from "./rng";
import type { Effects, LifeState, MinigameId } from "./types";

const MAX_GAUGE = 15;
const MAX_MONEY = 1000;

/** Choisit un mini-jeu pour l'année, ou null. Au plus un par an, jamais deux années de suite. */
export function pickMinigame(state: LifeState, ids: ActionId[], rng: Rng): MinigameId | null {
  if (state.lastMinigameAge === state.age - 1) return null;
  if (!ids.includes("sortir") && !ids.includes("repos")) return null;
  return rng.next() < 0.35 ? "peche" : null;
}

/** Borne les effets renvoyés par un mini-jeu. */
export function clampMinigameEffects(effects: Effects): Effects {
  const out: Effects = {};
  for (const [key, value] of Object.entries(effects) as [keyof Effects, number][]) {
    const limit = key === "money" ? MAX_MONEY : MAX_GAUGE;
    out[key] = Math.round(Math.max(-limit, Math.min(limit, value)));
  }
  return out;
}
