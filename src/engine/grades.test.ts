import { describe, expect, test } from "vitest";
import { gradeFor, scoreFor } from "./grades";
import { careerTitle, monthlySalary } from "./careers";
import type { Gauges, LifeState } from "./types";

const g = (over: Partial<Gauges>): Gauges => ({
  money: 0,
  health: 50,
  morale: 50,
  reputation: 0,
  family: 50,
  ...over,
});

function etat(over: Partial<LifeState> & { gauges: Gauges }): LifeState {
  return {
    version: 1,
    seed: "t",
    rngState: 1,
    character: { name: "Inès", city: "paris", district: "Paris 18e", skin: "#C68A62" },
    familyStart: "moyenne",
    age: 30,
    career: "etudiant",
    careerLevel: 0,
    formations: 0,
    flags: [],
    seenEvents: [],
    eventQueue: [],
    currentEventId: null,
    lastResult: null,
    phase: "actions",
    deathCause: null,
    history: [],
    ...over,
  };
}

describe("gradeFor", () => {
  test("Légende demande 1 M€ et 80 de réputation", () => {
    expect(gradeFor(g({ money: 1_000_000, reputation: 80 }))).toBe("Légende");
    expect(gradeFor(g({ money: 1_000_000, reputation: 79 }))).toBe("Boss");
  });
  test("Boss", () => {
    expect(gradeFor(g({ money: 250_000, reputation: 0 }))).toBe("Boss");
    expect(gradeFor(g({ money: 100_000, reputation: 60 }))).toBe("Boss");
  });
  test("Petit patron", () => {
    expect(gradeFor(g({ money: 30_000 }))).toBe("Petit patron");
    expect(gradeFor(g({ money: 0, reputation: 50 }))).toBe("Petit patron");
  });
  test("Débrouillard et Galérien", () => {
    expect(gradeFor(g({ money: 3_000 }))).toBe("Débrouillard");
    expect(gradeFor(g({ money: 0, reputation: 25 }))).toBe("Débrouillard");
    expect(gradeFor(g({ money: -5_000, reputation: 0 }))).toBe("Galérien");
  });
});

describe("scoreFor", () => {
  test("argent, réputation, famille et bonus de grade", () => {
    expect(scoreFor(etat({ gauges: g({ money: 18_750, reputation: 41, family: 58 }) }))).toBe(3898);
  });
  test("l'argent négatif compte zéro", () => {
    expect(scoreFor(etat({ gauges: g({ money: -40_000, reputation: 0, family: 0 }) }))).toBe(0);
  });
});

describe("carrières", () => {
  test("titre et salaire selon le niveau", () => {
    expect(careerTitle({ career: "foodtruck", careerLevel: 1 })).toBe("2 food trucks");
    expect(monthlySalary({ career: "livreur", careerLevel: 0 })).toBe(1150);
    expect(careerTitle({ career: "etudiant", careerLevel: 0 })).toBe("Étudiant");
  });
});
