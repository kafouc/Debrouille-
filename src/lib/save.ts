import type { LifeState } from "@/engine";
import { lifeDefaults } from "@/engine/life";

export const SAVE_KEY = "debrouille.vie.v1";

const PHASES = ["actions", "scene", "minigame", "event", "result", "summary", "dead"];
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
    s.version === 2 &&
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
    Array.isArray(s.history) &&
    Array.isArray(s.childrenAges) &&
    Array.isArray(s.cinematics) &&
    Array.isArray(s.ledger) &&
    Array.isArray(s.yearActions)
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
    let parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && (parsed as { version?: unknown }).version === 1) {
      parsed = { ...lifeDefaults(), ...(parsed as object), version: 2 };
    }
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
