import { expect, test } from "vitest";
import { buildEpitaph } from "./epitaph";
import { formatMoney } from "./format";
import { newLife } from "./life";
import type { LifeState } from "./types";

const base = newLife({ name: "Inès", city: "paris", district: "Paris 18e", skin: "#C68A62" }, "epi");

function mort(over: Partial<LifeState>): LifeState {
  return { ...base, phase: "dead", deathCause: "vieillesse", ...over };
}

test("titre de la carrière et phrase de fin", () => {
  const s = mort({ age: 71, career: "foodtruck", careerLevel: 2, gauges: { ...base.gauges, money: 1_200_000, reputation: 50 } });
  expect(buildEpitaph(s)).toEqual({
    title: "Flotte de food trucks",
    sentence: `Fin de vie à 71 ans, Boss, avec ${formatMoney(1_200_000)}.`,
  });
});

test("mort jeune à cause de la santé", () => {
  const s = mort({ age: 34, deathCause: "sante", gauges: { ...base.gauges, money: -2000, reputation: 0 } });
  expect(buildEpitaph(s).sentence.startsWith("Parti(e) trop tôt, à 34 ans…")).toBe(true);
});
