import { COMMUN } from "./events/commun";
import { PARIS } from "./events/paris";
import { MARSEILLE } from "./events/marseille";
import { VIE } from "./events/vie";
import type { EventCard } from "./schema";

export { ACTIONS } from "./actions";
export { DISTRICTS } from "./districts";
export type { ActionDef, ActionId, Choice, Conditions, EventCard, LifeChange, Outcome } from "./schema";

export const EVENTS: EventCard[] = [...COMMUN, ...PARIS, ...MARSEILLE, ...VIE];

const BY_ID = new Map(EVENTS.map((c) => [c.id, c]));

export function getEvent(id: string): EventCard {
  const card = BY_ID.get(id);
  if (!card) throw new Error(`CARTE_INCONNUE: ${id}`);
  return card;
}
