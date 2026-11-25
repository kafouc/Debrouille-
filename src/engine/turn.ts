import { EVENTS, getEvent } from "@/content";
import type { ActionId, EventCard } from "@/content/schema";
import { applyActions } from "./actions";
import { applyEffects } from "./apply";
import { drawEvents } from "./events";
import { Rng } from "./rng";
import type { Effects, LifeState, Season } from "./types";
import { addToLedger, endYear } from "./year";
import { queueCinematics } from "./cinematics";
import { clampMinigameEffects, pickMinigame } from "./minigames";
import type { LifeChange } from "@/content/schema";

const LIFE_MILESTONE: Record<Exclude<LifeChange, "rupture">, string> = {
  couple: "Coup de foudre",
  mariage: "Le mariage",
  bebe: "Bébé !",
};

function applyLifeChange(s: LifeState, change: LifeChange) {
  switch (change) {
    case "couple":
      if (s.relation !== "celibataire") return;
      s.relation = "couple";
      s.cinematics.push("coup-de-foudre");
      break;
    case "mariage":
      s.relation = "marie";
      s.gauges.money -= 4000;
      addToLedger(s, "Mariage", -4000);
      s.cinematics.push("mariage");
      break;
    case "bebe":
      s.childrenAges.push(0);
      s.cinematics.push("bebe");
      break;
    case "rupture":
      s.relation = "celibataire";
      s.gauges.morale = Math.max(0, s.gauges.morale - 15);
      return;
  }
  s.milestones.push({ age: s.age, label: LIFE_MILESTONE[change] });
}

export const SEASONS: Season[] = ["hiver", "printemps", "ete", "automne"];

export function currentEvent(state: LifeState): EventCard | null {
  return state.currentEventId ? getEvent(state.currentEventId) : null;
}

/** Passe à l'événement suivant de l'année, ou termine l'année. */
function nextStep(state: LifeState, rng: Rng): LifeState {
  if (state.eventQueue.length === 0) return endYear(state, rng);
  const s = structuredClone(state);
  s.currentEventId = s.eventQueue.shift() ?? null;
  s.season = s.eventSeasons.shift() ?? null;
  s.lastResult = null;
  s.phase = "event";
  s.rngState = rng.getState();
  return s;
}

function chooseActionsRaw(state: LifeState, ids: [ActionId, ActionId], cards: EventCard[] = EVENTS): LifeState {
  if (state.phase !== "actions") return state;
  const rng = Rng.fromState(state.rngState);
  const s = applyActions(state, ids, rng);
  s.lastResult = null;
  s.currentEventId = null;
  const count = rng.next() < 0.6 ? 1 : 2;
  const drawn = drawEvents(s, cards, rng, count).map((id) => ({ id, season: getEventSeason(id, cards, rng) }));
  drawn.sort((a, b) => SEASONS.indexOf(a.season) - SEASONS.indexOf(b.season));
  s.eventQueue = drawn.map((d) => d.id);
  s.eventSeasons = drawn.map((d) => d.season);
  s.minigame = pickMinigame(state, ids, rng);
  s.phase = "scene";
  s.rngState = rng.getState();
  return s;
}

function getEventSeason(id: string, cards: EventCard[], rng: Rng): Season {
  const card = cards.find((c) => c.id === id);
  return card?.season ?? rng.pick(SEASONS);
}

function chooseOptionRaw(state: LifeState, choiceIndex: number): LifeState {
  if (state.phase !== "event" || !state.currentEventId) return state;
  const card = getEvent(state.currentEventId);
  const choice = card.choices[choiceIndex];
  if (!choice) throw new Error("CHOIX_INVALIDE");
  const rng = Rng.fromState(state.rngState);
  const outcome = rng.weightedPick(choice.outcomes);
  const s = structuredClone(state);
  const before = s.gauges.money;
  s.gauges = applyEffects(s.gauges, outcome.effects);
  addToLedger(s, "Événements", s.gauges.money - before);
  for (const flag of outcome.setFlags ?? []) if (!s.flags.includes(flag)) s.flags.push(flag);
  if (outcome.life) applyLifeChange(s, outcome.life);
  if (!s.seenEvents.includes(card.id)) s.seenEvents.push(card.id);
  s.lastResult = { cardId: card.id, choiceLabel: choice.label, text: outcome.text, effects: { ...outcome.effects } };
  s.history.push({ age: s.age, text: outcome.text });
  s.phase = "result";
  s.rngState = rng.getState();
  return s;
}

function continueTurnRaw(state: LifeState): LifeState {
  const rng = Rng.fromState(state.rngState);
  switch (state.phase) {
    case "scene":
      if (state.minigame) return { ...structuredClone(state), phase: "minigame" };
      return nextStep(state, rng);
    case "result":
      return nextStep(state, rng);
    case "summary":
      return { ...structuredClone(state), phase: "actions", ledger: [], yearActions: [] };
    default:
      return state;
  }
}

/** Termine le mini-jeu (null = passé) et reprend le fil de l'année. */
function finishMinigameRaw(state: LifeState, result: { effects: Effects; text: string } | null): LifeState {
  if (state.phase !== "minigame") return state;
  const s = structuredClone(state);
  const effects = result ? clampMinigameEffects(result.effects) : { morale: 2 };
  const before = s.gauges.money;
  s.gauges = applyEffects(s.gauges, effects);
  addToLedger(s, "Mini-jeu", s.gauges.money - before);
  if (result) s.history.push({ age: s.age, text: result.text });
  s.minigame = null;
  s.lastMinigameAge = s.age;
  return nextStep(s, Rng.fromState(state.rngState));
}

function withCinematics<A extends unknown[]>(fn: (state: LifeState, ...args: A) => LifeState) {
  return (state: LifeState, ...args: A): LifeState => {
    const next = fn(state, ...args);
    return next === state ? state : queueCinematics(state, next);
  };
}

export const chooseActions = withCinematics(chooseActionsRaw);
export const chooseOption = withCinematics(chooseOptionRaw);
export const continueTurn = withCinematics(continueTurnRaw);
export const finishMinigame = withCinematics(finishMinigameRaw);
