import { describe, expect, test } from "vitest";
import { newLife } from "./life";
import { applyActions, availableActions } from "./actions";
import { applyEffects } from "./apply";
import { Rng } from "./rng";
import type { LifeState } from "./types";

const input = { name: "Inès", city: "paris" as const, district: "Paris 18e", skin: "#C68A62" };

describe("newLife", () => {
  test("même graine, même vie de départ", () => {
    const a = newLife(input, "s1");
    expect(newLife(input, "s1")).toEqual(a);
    expect(a.age).toBe(18);
    expect(a.phase).toBe("actions");
    expect(a.career).toBe("etudiant");
    expect(a.careerLevel).toBe(0);
    expect(a.gauges).toMatchObject({ health: 90, morale: 60, reputation: 5, family: 60 });
    expect([300, 2000, 10000]).toContain(a.gauges.money);
    const attendu = { modeste: 300, moyenne: 2000, aisee: 10000 }[a.familyStart];
    expect(a.gauges.money).toBe(attendu);
  });

  test("une vie commence par la cinématique du départ et sans situation", () => {
    const v = newLife(input, "c1");
    expect(v.version).toBe(2);
    expect(v.cinematics).toEqual(["depart"]);
    expect(v.relation).toBe("celibataire");
    expect(v.childrenAges).toEqual([]);
    expect(v.retired).toBe(false);
    expect(v.milestones).toEqual([{ age: 18, label: "18 ans" }]);
    expect(v.minigame).toBeNull();
  });

  test("les trois familles de départ existent", () => {
    const familles = new Set(Array.from({ length: 60 }, (_, i) => newLife(input, `f${i}`).familyStart));
    expect(familles).toEqual(new Set(["modeste", "moyenne", "aisee"]));
  });

  test("prénom vide, trop long, avec emoji", () => {
    expect(newLife({ ...input, name: "   " }, "s").character.name).toBe("Toi");
    expect(newLife({ ...input, name: "A".repeat(30) }, "s").character.name).toBe("A".repeat(16));
    const brut = "<b>Léa</b> 😀😀😀😀😀";
    const nom = newLife({ ...input, name: brut }, "s").character.name;
    expect(nom).toBe(Array.from(brut).slice(0, 16).join(""));
    expect(Array.from(nom).length).toBe(16);
    expect(nom.startsWith("<b>Léa</b>")).toBe(true);
  });

  test("quartier inconnu pour la ville", () => {
    expect(() => newLife({ ...input, district: "Le Panier" }, "s")).toThrow("QUARTIER_INCONNU");
  });
});

function avecArgent(state: LifeState, money: number): LifeState {
  return { ...state, gauges: { ...state.gauges, money } };
}

describe("actions", () => {
  test("business et investir demandent de l'argent", () => {
    const base = newLife(input, "s1");
    const pauvre = availableActions(avecArgent(base, 500));
    expect(pauvre).not.toContain("business");
    expect(pauvre).not.toContain("investir");
    const riche = availableActions(avecArgent(base, 5000));
    expect(riche).toContain("business");
    expect(riche).toContain("investir");
  });

  test("applyEffects borne les jauges sauf l'argent", () => {
    const g = { money: 100, health: 95, morale: 3, reputation: 50, family: 50 };
    expect(applyEffects(g, { health: 10, morale: -10, money: -500 })).toEqual({
      money: -400,
      health: 100,
      morale: 0,
      reputation: 50,
      family: 50,
    });
  });

  test("actions invalides", () => {
    const base = avecArgent(newLife(input, "s1"), 500);
    const rng = new Rng(1);
    expect(() => applyActions(base, ["sport", "sport"], rng)).toThrow("ACTIONS_INVALIDES");
    expect(() => applyActions(base, ["business", "sport"], rng)).toThrow("ACTIONS_INVALIDES");
  });

  test("sport + famille", () => {
    const base = newLife(input, "s1");
    const apres = applyActions(base, ["sport", "famille"], new Rng(1));
    expect(apres.gauges.health).toBe(96);
    expect(apres.gauges.morale).toBe(63);
    expect(apres.gauges.family).toBe(68);
    expect(apres.gauges.money).toBe(base.gauges.money - 200);
    expect(apres.history.length).toBe(base.history.length + 2);
    expect(base.gauges.health).toBe(90);
  });

  test("un étudiant sans formation ne devient jamais employé de bureau", () => {
    for (let i = 0; i < 100; i++) {
      const base = newLife(input, `job${i}`);
      const apres = applyActions(base, ["job", "repos"], new Rng(`r${i}`));
      expect(apres.career).not.toBe("bureau");
      expect(apres.career).not.toBe("etudiant");
    }
  });

  test("bosser rapporte deux mois de salaire", () => {
    const base = { ...newLife(input, "s1"), career: "livreur" as const };
    const apres = applyActions(base, ["bosser", "sport"], new Rng(1));
    expect(apres.gauges.money).toBe(base.gauges.money + 2300);
    expect(apres.gauges.health).toBe(base.gauges.health - 4 + 6);
  });
});
