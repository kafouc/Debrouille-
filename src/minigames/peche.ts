import type { Effects } from "@/engine";

export interface Catch {
  id: string;
  title: string;
  text: string;
  fish: boolean;
  weight: number;
}

export const CATCHES: Catch[] = [
  { id: "daurade", title: "Une daurade !", text: "Belle prise. Les anciens hochent la tête.", fish: true, weight: 30 },
  { id: "loup", title: "Un loup de mer !", text: "Tu le prends en photo sous tous les angles.", fish: true, weight: 25 },
  { id: "chaussure", title: "Une chaussure.", text: "Taille 43. Il ne manque que la deuxième.", fish: false, weight: 18 },
  { id: "trottinette", title: "Une trottinette.", text: "Elle est encore en location. Le compteur tourne.", fish: false, weight: 14 },
  { id: "poisson-voiture", title: "Un poisson « gros comme une voiture » !", text: "Il s'échappe au dernier moment. Personne ne te croira.", fish: false, weight: 8 },
  { id: "poulpe", title: "Un poulpe vexé.", text: "Il t'arrose d'encre et repart dignement.", fish: false, weight: 5 },
];

/** Tire une prise à partir d'un nombre entre 0 et 1. */
export function pickCatch(random: number): Catch {
  const total = CATCHES.reduce((s, c) => s + c.weight, 0);
  let x = random * total;
  for (const c of CATCHES) {
    if (x < c.weight) return c;
    x -= c.weight;
  }
  return CATCHES[CATCHES.length - 1];
}

/** Effets et phrase de fin d'une partie de pêche. */
export function pecheResult(catches: Catch[]): { effects: Effects; text: string } {
  const fish = catches.filter((c) => c.fish).length;
  const objects = catches.length - fish;
  const effects: Effects = { morale: 3 + 3 * fish };
  if (fish > 0) {
    effects.reputation = fish;
    effects.money = 20 * fish;
  }
  let text: string;
  if (fish >= 3) text = "Tu rentres avec 3 vrais poissons. Les anciens du port sont jaloux.";
  else if (fish > 0) {
    const poissons = `${fish} vrai${fish > 1 ? "s" : ""} poisson${fish > 1 ? "s" : ""}`;
    const objets = objects > 0 ? ` et ${objects} objet${objects > 1 ? "s" : ""} étrange${objects > 1 ? "s" : ""}` : "";
    text = `Tu rentres avec ${poissons}${objets}.`;
  }
  else if (catches.length > 0) text = "Aucun poisson, mais une belle collection d'objets étranges.";
  else text = "Bredouille. Tu achèteras du poisson en rentrant.";
  return { effects, text };
}
