import { expect, test } from "vitest";
import { CATCHES, pecheResult, pickCatch } from "./peche";

const byId = (id: string) => CATCHES.find((c) => c.id === id)!;

test("bredouille", () => {
  expect(pecheResult([])).toEqual({ effects: { morale: 3 }, text: "Bredouille. Tu achèteras du poisson en rentrant." });
});

test("un poisson et une chaussure", () => {
  expect(pecheResult([byId("daurade"), byId("chaussure")])).toEqual({
    effects: { morale: 6, reputation: 1, money: 20 },
    text: "Tu rentres avec 1 vrai poisson et 1 objet étrange.",
  });
});

test("trois poissons", () => {
  const r = pecheResult([byId("daurade"), byId("loup"), byId("daurade")]);
  expect(r.effects).toEqual({ morale: 12, reputation: 3, money: 60 });
  expect(r.text).toBe("Tu rentres avec 3 vrais poissons. Les anciens du port sont jaloux.");
});

test("que des objets", () => {
  expect(pecheResult([byId("trottinette")]).text).toBe("Aucun poisson, mais une belle collection d'objets étranges.");
});

test("pickCatch couvre toutes les prises", () => {
  const vus = new Set<string>();
  for (let i = 0; i < 1000; i++) vus.add(pickCatch(i / 1000).id);
  expect(vus.size).toBe(CATCHES.length);
});
