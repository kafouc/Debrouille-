import { describe, expect, test } from "vitest";
import { EVENTS } from "@/content";
import { chooseActions, chooseOption, continueTurn, currentEvent, newLife } from "./index";
import { endYear } from "./year";
import { Rng } from "./rng";
import type { LifeState } from "./types";

const paris = { name: "Inès", city: "paris" as const, district: "Paris 18e", skin: "#C68A62" };
const SEASON_ORDER = ["hiver", "printemps", "ete", "automne"];

/** Joue jusqu'au prochain événement (actions puis scène). */
function jouerJusquaEvenement(seed: string): LifeState {
  return continueTurn(chooseActions(newLife(paris, seed), ["sport", "famille"]));
}

/** Avance (premier choix, continuer) jusqu'au bilan ou à la mort. */
function finirAnnee(s: LifeState): LifeState {
  let garde = 0;
  while (s.phase !== "summary" && s.phase !== "dead" && garde++ < 20) {
    s = s.phase === "event" ? chooseOption(s, 0) : continueTurn(s);
  }
  return s;
}

describe("l'année en scène", () => {
  test("après les actions vient la scène, avec les 2 actions rejouées", () => {
    const s = chooseActions(newLife(paris, "sc1"), ["sport", "famille"]);
    expect(s.phase).toBe("scene");
    expect(s.yearActions.map((a) => a.id)).toEqual(["sport", "famille"]);
    expect(s.yearActions[0].effects).toEqual({ health: 6, morale: 3 });
    expect(s.yearActions[1].effects).toEqual({ family: 8, money: -200 });
    expect(s.ledger).toEqual([{ label: "Voir la famille", amount: -200 }]);
  });

  test("continuer depuis la scène mène à un événement de saison", () => {
    const s = jouerJusquaEvenement("t1");
    expect(s.phase).toBe("event");
    expect(currentEvent(s)).not.toBeNull();
    expect(SEASON_ORDER).toContain(s.season);
  });

  test("les événements de l'année vont de l'hiver vers l'automne", () => {
    for (let i = 0; i < 100; i++) {
      let s = jouerJusquaEvenement(`ordre${i}`);
      const vues: number[] = [];
      let garde = 0;
      while (s.phase !== "summary" && s.phase !== "dead" && garde++ < 20) {
        if (s.phase === "event") vues.push(SEASON_ORDER.indexOf(s.season!));
        s = s.phase === "event" ? chooseOption(s, 0) : continueTurn(s);
      }
      expect([...vues].sort((a, b) => a - b)).toEqual(vues);
    }
  });

  test("jamais de carte Marseille pour un perso parisien", () => {
    for (let i = 0; i < 200; i++) {
      const s = chooseActions(newLife(paris, `v${i}`), ["sport", "famille"]);
      for (const id of s.eventQueue) {
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
    expect(() => chooseOption(jouerJusquaEvenement("t4"), 9)).toThrow("CHOIX_INVALIDE");
  });

  test("aucune carte possible : scène puis bilan", () => {
    const base = newLife(paris, "t5");
    const scene = chooseActions(base, ["sport", "famille"], []);
    expect(scene.phase).toBe("scene");
    const bilan = continueTurn(scene);
    expect(bilan.phase).toBe("summary");
    expect(bilan.age).toBe(19);
    expect(bilan.lastYear?.age).toBe(19);
    const suite = continueTurn(bilan);
    expect(suite.phase).toBe("actions");
    expect(suite.age).toBe(19);
    expect(continueTurn(suite)).toEqual(suite);
  });

  test("l'argent des événements est noté dans le bilan", () => {
    const s = finirAnnee(jouerJusquaEvenement("t6"));
    expect(s.phase).toBe("summary");
    const total = s.lastYear!.lines.reduce((t, l) => t + l.amount, 0);
    expect(s.lastYear!.total).toBe(total);
    expect(s.lastYear!.lines.filter((l) => l.label === "Événements").length).toBeLessThanOrEqual(1);
  });

  test("même graine et mêmes choix : même partie", () => {
    const jouer = () => {
      let s = newLife(paris, "repro");
      const etats: LifeState[] = [];
      for (let i = 0; i < 30 && s.phase !== "dead"; i++) {
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

  test("le bilan détaille salaire, loyer et vie courante", () => {
    const s = { ...base, career: "livreur" as const, gauges: { ...base.gauges, money: 1000 }, ledger: [] };
    const apres = endYear(s, new Rng(1));
    expect(apres.phase).toBe("summary");
    expect(apres.gauges.money).toBe(1000 + 12 * (1150 - 650 - 550));
    expect(apres.lastYear).toEqual({
      age: 19,
      lines: [
        { label: "Salaire", amount: 13800 },
        { label: "Loyer", amount: -7800 },
        { label: "Vie courante", amount: -6600 },
      ],
      total: -600,
    });
    expect(apres.age).toBe(19);
    expect(apres.gauges.health).toBe(base.gauges.health - 1);
  });

  test("les enfants mineurs coûtent et grandissent", () => {
    const s = { ...base, age: 40, relation: "marie" as const, childrenAges: [3, 19], ledger: [] };
    const apres = endYear(s, new Rng(1));
    expect(apres.lastYear!.lines).toContainEqual({ label: "Enfants", amount: -4000 });
    expect(apres.childrenAges).toEqual([4, 20]);
  });

  test("à 99 ans, la vie se termine de vieillesse, sans bilan", () => {
    const s = { ...base, age: 99, gauges: { ...base.gauges, health: 80 } };
    const apres = endYear(s, new Rng(1));
    expect(apres.phase).toBe("dead");
    expect(apres.deathCause).toBe("vieillesse");
    expect(apres.cinematics.at(-1)).toBe("vie-qui-defile");
  });

  test("santé à zéro : mort", () => {
    const apres = endYear({ ...base, age: 45, gauges: { ...base.gauges, health: 1 } }, new Rng(1));
    expect(apres.phase).toBe("dead");
    expect(apres.deathCause).toBe("sante");
  });

  test("le moral bas abîme la santé", () => {
    const s = { ...base, age: 30, gauges: { ...base.gauges, health: 50, morale: 10 } };
    expect(endYear(s, new Rng(1)).gauges.health).toBe(47);
  });
});
