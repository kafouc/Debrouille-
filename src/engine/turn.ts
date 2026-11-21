import { EVENTS, getEvent } from "@/content";
import type { ActionId, EventCard } from "@/content/schema";
import { applyActions } from "./actions";
import { applyEffects } from "./apply";
import { drawEvents } from "./events";
import { Rng } from "./rng";
import type { LifeState } from "./types";
import { endYear } from "./year";

export function currentEvent(state: LifeState): EventCard | null {
  return state.currentEventId ? getEvent(state.currentEventId) : null;
}

export function chooseActions(state: LifeState, ids: [ActionId, ActionId], cards: EventCard[] = EVENTS): LifeState {
  if (state.phase !== "actions") return state;
  const rng = Rng.fromState(state.rngState);
  const s = applyActions(state, ids, rng);
  s.lastResult = null;
  const count = rng.next() < 0.6 ? 1 : 2;
  const drawn = drawEvents(s, cards, rng, count);
  if (drawn.length === 0) return endYear(s, rng);
  s.currentEventId = drawn[0];
  s.eventQueue = drawn.slice(1);
  s.phase = "event";
  s.rngState = rng.getState();
  return s;
}

export function chooseOption(state: LifeState, choiceIndex: number): LifeState {
  if (state.phase !== "event" || !state.currentEventId) return state;
  const card = getEvent(state.currentEventId);
  const choice = card.choices[choiceIndex];
  if (!choice) throw new Error("CHOIX_INVALIDE");
  const rng = Rng.fromState(state.rngState);
  const outcome = rng.weightedPick(choice.outcomes);
  const s = structuredClone(state);
  s.gauges = applyEffects(s.gauges, outcome.effects);
  for (const flag of outcome.setFlags ?? []) if (!s.flags.includes(flag)) s.flags.push(flag);
  if (!s.seenEvents.includes(card.id)) s.seenEvents.push(card.id);
  s.lastResult = { cardId: card.id, choiceLabel: choice.label, text: outcome.text, effects: { ...outcome.effects } };
  s.history.push({ age: s.age, text: outcome.text });
  s.phase = "result";
  s.rngState = rng.getState();
  return s;
}

export function continueTurn(state: LifeState): LifeState {
  if (state.phase !== "result") return state;
  if (state.eventQueue.length > 0) {
    const s = structuredClone(state);
    s.currentEventId = s.eventQueue.shift() ?? null;
    s.lastResult = null;
    s.phase = "event";
    return s;
  }
  return endYear(state, Rng.fromState(state.rngState));
}
