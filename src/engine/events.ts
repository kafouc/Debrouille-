import type { EventCard } from "@/content/schema";
import type { Rng } from "./rng";
import type { LifeState } from "./types";

function conditionsMet(state: LifeState, card: EventCard): boolean {
  const c = card.conditions;
  if (!c) return true;
  const money = state.gauges.money;
  if (c.minAge !== undefined && state.age < c.minAge) return false;
  if (c.maxAge !== undefined && state.age > c.maxAge) return false;
  if (c.cities && !c.cities.includes(state.character.city)) return false;
  if (c.careers && !c.careers.includes(state.career)) return false;
  if (c.requiresFlags && !c.requiresFlags.every((f) => state.flags.includes(f))) return false;
  if (c.forbidsFlags && c.forbidsFlags.some((f) => state.flags.includes(f))) return false;
  if (c.minMoney !== undefined && money < c.minMoney) return false;
  if (c.maxMoney !== undefined && money > c.maxMoney) return false;
  return true;
}

export function eligibleEvents(state: LifeState, cards: EventCard[]): EventCard[] {
  return cards.filter((card) => (card.repeatable || !state.seenEvents.includes(card.id)) && conditionsMet(state, card));
}

/** Tire `count` cartes différentes, au poids, parmi les cartes éligibles. */
export function drawEvents(state: LifeState, cards: EventCard[], rng: Rng, count: number): string[] {
  const pool = [...eligibleEvents(state, cards)].filter((c) => (c.weight ?? 1) > 0);
  const picked: string[] = [];
  while (picked.length < count && pool.length > 0) {
    const card = rng.weightedPick(pool);
    picked.push(card.id);
    pool.splice(pool.indexOf(card), 1);
  }
  return picked;
}
