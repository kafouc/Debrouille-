import { describe, expect, test } from "vitest";
import { EVENTS } from "@/content";
import { chooseActions, chooseOption, continueTurn, currentEvent, newLife } from "./index";
import { endYear } from "./year";
import { Rng } from "./rng";
import type { LifeState } from "./types";

const paris = { name: "Inès", city: "paris" as const, district: "Paris 18e", skin: "#C68A62" };

function jouerJusquaEvenement(seed: string): LifeState {
  return chooseActions(newLife(paris, seed), ["sport", "famille"]);
}

describe("tour de jeu", () => {
  test("après les actions, un événement est proposé", () => {
    const s = jouerJusquaEvenement("t1");
    expect(s.phase).toBe("event");
    expect(currentEvent(s)).not.toBeNull();
  });

  test("jamais de carte Marseille pour un perso parisien", () => {
    for (let i = 0; i < 200; i++) {
      const s = jouerJusquaEvenement(`v${i}`);
      const ids = [s.currentEventId, ...s.eventQueue].filter(Boolean) as string[];
      for (const id of ids) {
        const card = EVENTS.find((c) => c.id === id)!;
        expect(card.conditions?.cities ?? ["paris"]).toContain("paris");
      }
    }
  });

  test("double tap sur un choix : appliqué une seule fois", () => {
    const s = jouerJusquaEvenement("t2");
    const une = chooseOption(s, 0);
    expect(une.phase).toBe("result");
    expect(chooseOption(une, 0)).toEqual(une);
  });

  test("continuer pendant un événement ne fait rien", () => {
    const s = jouerJusquaEvenement("t3");
    expect(continueTurn(s)).toEqual(s);
  });

  test("index de choix invalide", () => {
    const s = jouerJusquaEvenement("t4");
    expect(() => chooseOption(s, 9)).toThrow("CHOIX_INVALIDE");
  });

  test("aucune carte possible : l'année se termine", () => {
    const base = newLife(paris, "t5");
    const vide = chooseActions(base, ["sport", "famille"], []);
    expect(vide.age).toBe(19);
    expect(vide.phase).toBe("actions");
    expect(vide.currentEventId).toBeNull();
    const toutVu = { ...base, seenEvents: EVENTS.map((c) => c.id) };
    const sansRepetables = chooseActions(toutVu, ["sport", "famille"], EVENTS.filter((c) => !c.repeatable));
    expect(sansRepetables.age).toBe(19);
    expect(sansRepetables.phase).toBe("actions");
  });

  test("après le dernier résultat, on passe à l'année suivante", () => {
    let s = jouerJusquaEvenement("t6");
    let garde = 0;
    while (s.phase !== "actions" && garde++ < 10) {
      s = s.phase === "event" ? chooseOption(s, 0) : continueTurn(s);
    }
    expect(s.phase).toBe("actions");
    expect(s.age).toBe(19);
    expect(s.seenEvents.length).toBeGreaterThanOrEqual(1);
  });

  test("même graine et mêmes choix : même partie", () => {
    const jouer = () => {
      let s = newLife(paris, "repro");
      const etats: LifeState[] = [];
      for (let i = 0; i < 20 && s.phase !== "dead"; i++) {
        if (s.phase === "actions") s = chooseActions(s, ["sport", "famille"]);
        else if (s.phase === "event") s = chooseOption(s, 0);
        else s = continueTurn(s);
        etats.push(s);
      }
      return etats;
    };
    expect(jouer()).toEqual(jouer());
  });
});

describe("fin d'année", () => {
  const base = newLife(paris, "y1");

  test("salaire moins loyer moins vie courante", () => {
    const s = { ...base, career: "livreur" as const, gauges: { ...base.gauges, money: 1000 } };
    const apres = endYear(s, new Rng(1));
    expect(apres.gauges.money).toBe(1000 + 12 * (1150 - 650 - 550));
    expect(apres.age).toBe(19);
    expect(apres.gauges.health).toBe(base.gauges.health - 1);
  });

  test("à 99 ans, la vie se termine de vieillesse", () => {
    const s = { ...base, age: 99, gauges: { ...base.gauges, health: 80 } };
    const apres = endYear(s, new Rng(1));
    expect(apres.phase).toBe("dead");
    expect(apres.deathCause).toBe("vieillesse");
  });

  test("santé à zéro : mort", () => {
    const s = { ...base, age: 45, gauges: { ...base.gauges, health: 1 } };
    const apres = endYear(s, new Rng(1));
    expect(apres.phase).toBe("dead");
    expect(apres.deathCause).toBe("sante");
  });

  test("le moral bas abîme la santé", () => {
    const s = { ...base, age: 30, gauges: { ...base.gauges, health: 50, morale: 10 } };
    expect(endYear(s, new Rng(1)).gauges.health).toBe(47);
  });
});
