import type { LifeState } from "@/engine";

export const SAVE_KEY = "debrouille.vie.v1";

const PHASES = ["actions", "event", "result", "dead"];
const GAUGES = ["money", "health", "morale", "reputation", "family"];

function defaultStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

function isLifeState(v: unknown): v is LifeState {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  const g = s.gauges as Record<string, unknown> | undefined;
  const c = s.character as Record<string, unknown> | undefined;
  return (
    s.version === 1 &&
    typeof s.seed === "string" &&
    typeof s.rngState === "number" &&
    typeof s.age === "number" &&
    typeof s.phase === "string" &&
    PHASES.includes(s.phase) &&
    !!c &&
    typeof c.name === "string" &&
    typeof c.city === "string" &&
    typeof c.district === "string" &&
    !!g &&
    GAUGES.every((k) => typeof g[k] === "number" && Number.isFinite(g[k])) &&
    Array.isArray(s.flags) &&
    Array.isArray(s.seenEvents) &&
    Array.isArray(s.eventQueue) &&
    Array.isArray(s.history)
  );
}

export function saveLife(state: LifeState, storage: Storage | undefined = defaultStorage()): void {
  try {
    storage?.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Stockage plein ou bloqué : le jeu continue sans sauvegarde.
  }
}

export function loadLife(storage: Storage | undefined = defaultStorage()): LifeState | null {
  try {
    const raw = storage?.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isLifeState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearLife(storage: Storage | undefined = defaultStorage()): void {
  try {
    storage?.removeItem(SAVE_KEY);
  } catch {
    // ignoré
  }
}
