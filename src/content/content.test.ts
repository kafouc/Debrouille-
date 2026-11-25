import { describe, expect, test } from "vitest";
import { ACTIONS, EVENTS, getEvent } from "./index";
import { DISTRICTS } from "./districts";

const GAUGE_KEYS = ["money", "health", "morale", "reputation", "family"];
const BANNED_WORDS = ["PSG", "OM", "Olympique", "Uber", "Deliveroo", "McDo", "RATP"];

function allTexts(): string[] {
  return EVENTS.flatMap((c) => [
    c.text,
    c.detail ?? "",
    ...c.choices.flatMap((ch) => [ch.label, ...ch.outcomes.map((o) => o.text)]),
  ]);
}

describe("cartes événement", () => {
  test("ids uniques et bien formés", () => {
    const ids = EVENTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  test("2 ou 3 choix, au moins un résultat, textes courts", () => {
    for (const c of EVENTS) {
      expect(c.choices.length, c.id).toBeGreaterThanOrEqual(2);
      expect(c.choices.length, c.id).toBeLessThanOrEqual(3);
      expect(c.text.length, c.id).toBeLessThanOrEqual(160);
      for (const ch of c.choices) {
        expect(ch.outcomes.length, c.id).toBeGreaterThanOrEqual(1);
        for (const o of ch.outcomes) expect(o.text.length, `${c.id}: ${o.text}`).toBeLessThanOrEqual(160);
      }
    }
  });

  test("les cartes obligatoires existent et la répartition par ville", () => {
    for (const id of ["loyer-hausse", "rer-bloque", "maman-tu-manges", "patron-augmentation", "mistral-parasol", "console-voisin"]) {
      expect(() => getEvent(id)).not.toThrow();
    }
    const sansVille = EVENTS.filter((c) => !c.conditions?.cities);
    const paris = EVENTS.filter((c) => c.conditions?.cities?.length === 1 && c.conditions.cities[0] === "paris");
    const marseille = EVENTS.filter((c) => c.conditions?.cities?.length === 1 && c.conditions.cities[0] === "marseille");
    expect(sansVille.length).toBeGreaterThanOrEqual(15);
    expect(paris.length).toBeGreaterThanOrEqual(8);
    expect(marseille.length).toBeGreaterThanOrEqual(7);
    expect(getEvent("rer-bloque").conditions?.cities).toEqual(["paris"]);
    expect(getEvent("mistral-parasol").conditions?.cities).toEqual(["marseille"]);
    expect(getEvent("patron-augmentation").choices.map((c) => c.label)).toContain("Je lance un podcast sur lui");
    const console = getEvent("console-voisin");
    expect(console.choices.some((ch) => ch.outcomes.some((o) => o.setFlags?.includes("console-vendue")))).toBe(true);
  });

  test("effets valides et raisonnables", () => {
    for (const c of EVENTS) {
      for (const ch of c.choices) {
        for (const o of ch.outcomes) {
          for (const [k, v] of Object.entries(o.effects)) {
            expect(GAUGE_KEYS, `${c.id}: ${k}`).toContain(k);
            if (k !== "money") {
              expect(v, `${c.id}: ${k}`).toBeGreaterThanOrEqual(-30);
              expect(v, `${c.id}: ${k}`).toBeLessThanOrEqual(30);
            }
          }
        }
      }
    }
  });

  test("aucune marque ni club nommé", () => {
    for (const t of allTexts()) {
      for (const w of BANNED_WORDS) {
        expect(new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, "u").test(t), `« ${w} » dans : ${t}`).toBe(false);
      }
    }
  });

  test("getEvent lève une erreur pour un id inconnu", () => {
    expect(() => getEvent("n-existe-pas")).toThrow();
  });
});

describe("actions et quartiers", () => {
  test("les 10 actions dans l'ordre", () => {
    expect(ACTIONS.map((a) => a.id)).toEqual(["bosser", "formation", "job", "business", "sortir", "sport", "famille", "investir", "repos", "retraite"]);
    expect(ACTIONS.find((a) => a.id === "business")?.minMoney).toBe(2000);
    expect(ACTIONS.find((a) => a.id === "investir")?.minMoney).toBe(1000);
  });

  test("5 quartiers par ville avec leur loyer", () => {
    expect(DISTRICTS.paris.map((d) => d.name)).toEqual(["Paris 11e", "Paris 18e", "Paris 20e", "Paris 15e", "Montreuil"]);
    expect(DISTRICTS.marseille.find((d) => d.name === "Noailles")?.rent).toBe(450);
    expect(DISTRICTS.paris.find((d) => d.name === "Paris 18e")?.rent).toBe(650);
  });
});
