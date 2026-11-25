import { expect, test } from "vitest";
import { availableActions, chooseActions, chooseOption, continueTurn, currentEvent, finishMinigame, newLife } from "./index";
import { Rng } from "./rng";
import type { ActionId } from "@/content/schema";

test("300 vies automatiques se terminent toutes", () => {
  for (let i = 0; i < 300; i++) {
    const joueur = new Rng(`joueur-${i}`);
    const city = i % 2 === 0 ? "paris" : "marseille";
    let s = newLife({ name: "Sim", city, district: city === "paris" ? "Paris 11e" : "Noailles", skin: "#8D5A3B" }, `sim-${i}`);
    let appels = 0;
    while (s.phase !== "dead") {
      if (appels++ > 800) throw new Error(`vie ${i} trop longue`);
      if (s.phase === "actions") {
        const dispo = availableActions(s);
        const a = joueur.pick(dispo);
        const b = joueur.pick(dispo.filter((x) => x !== a));
        s = chooseActions(s, [a, b] as [ActionId, ActionId]);
      } else if (s.phase === "minigame") {
        s = finishMinigame(s, null);
      } else if (s.phase === "event") {
        s = chooseOption(s, joueur.int(0, currentEvent(s)!.choices.length - 1));
      } else {
        s = continueTurn(s);
      }
    }
    expect(s.age).toBeGreaterThanOrEqual(19);
    expect(s.age).toBeLessThanOrEqual(100);
  }
}, 60_000);
