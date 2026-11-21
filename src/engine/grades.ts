import type { Gauges, Grade, LifeState } from "./types";

export const GRADES: Grade[] = ["Galérien", "Débrouillard", "Petit patron", "Boss", "Légende"];

const GRADE_BONUS: Record<Grade, number> = {
  Galérien: 0,
  Débrouillard: 500,
  "Petit patron": 1500,
  Boss: 4000,
  Légende: 10000,
};

export function gradeFor(g: Gauges): Grade {
  if (g.money >= 1_000_000 && g.reputation >= 80) return "Légende";
  if (g.money >= 250_000 || (g.money >= 100_000 && g.reputation >= 60)) return "Boss";
  if (g.money >= 30_000 || g.reputation >= 50) return "Petit patron";
  if (g.money >= 3_000 || g.reputation >= 25) return "Débrouillard";
  return "Galérien";
}

export function scoreFor(state: LifeState): number {
  const { money, reputation, family } = state.gauges;
  return Math.round(Math.max(money, 0) / 100) + reputation * 50 + family * 20 + GRADE_BONUS[gradeFor(state.gauges)];
}
