import { expect, test } from "vitest";
import { chooseActions, continueTurn, finishMinigame, newLife } from "./index";
import type { LifeState } from "./types";

const base = { ...newLife({ name: "Léa", city: "marseille", district: "Noailles", skin: "#8D5A3B" }, "mg"), cinematics: [] };

function jusquAuMiniJeu(): LifeState {
  for (let i = 0; i < 200; i++) {
    const s = continueTurn(chooseActions({ ...base, seed: `p${i}`, rngState: 1000 + i }, ["sortir", "sport"]));
    if (s.phase === "minigame") return s;
  }
  throw new Error("pas de pêche trouvée");
}

test("la pêche apparaît avec « sortir », jamais deux années de suite", () => {
  let vues = 0;
  for (let i = 0; i < 200; i++) {
    const s = chooseActions({ ...base, rngState: 5000 + i }, ["sortir", "sport"]);
    if (s.minigame === "peche") vues++;
    const sansSortir = chooseActions({ ...base, rngState: 5000 + i }, ["sport", "famille"]);
    expect(sansSortir.minigame).toBeNull();
    const anneeApres = chooseActions({ ...base, rngState: 5000 + i, lastMinigameAge: base.age - 1 }, ["sortir", "sport"]);
    expect(anneeApres.minigame).toBeNull();
  }
  expect(vues).toBeGreaterThan(20);
});

test("la scène mène au mini-jeu", () => {
  const s = jusquAuMiniJeu();
  expect(s.minigame).toBe("peche");
});

test("les effets d'un mini-jeu sont bornés", () => {
  const s = jusquAuMiniJeu();
  const fini = finishMinigame(s, { effects: { morale: 80, money: 999999, health: -50 }, text: "triche" });
  expect(fini.gauges.morale).toBe(Math.min(100, s.gauges.morale + 15));
  expect(fini.gauges.money).toBe(s.gauges.money + 1000);
  expect(fini.gauges.health).toBe(Math.max(0, s.gauges.health - 15));
  expect(fini.minigame).toBeNull();
  expect(fini.lastMinigameAge).toBe(s.age);
  expect(fini.ledger).toContainEqual({ label: "Mini-jeu", amount: 1000 });
  expect(["event", "summary", "dead"]).toContain(fini.phase);
  expect(finishMinigame(fini, null)).toEqual(fini);
});

test("passer le mini-jeu donne un petit bonus de moral", () => {
  const s = jusquAuMiniJeu();
  expect(finishMinigame(s, null).gauges.morale).toBe(Math.min(100, s.gauges.morale + 2));
});
