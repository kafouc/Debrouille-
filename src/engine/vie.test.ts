import { describe, expect, test } from "vitest";
import { EVENTS } from "@/content";
import { VIE } from "@/content/events/vie";
import { ackCinematic, availableActions, chooseActions, chooseOption, eligibleEvents, newLife } from "./index";
import { queueCinematics } from "./cinematics";
import type { LifeState } from "./types";

const base = newLife({ name: "Inès", city: "paris", district: "Paris 18e", skin: "#C68A62" }, "vie");

function surCarte(id: string, over: Partial<LifeState> = {}): LifeState {
  return { ...base, cinematics: [], phase: "event", currentEventId: id, age: 30, ...over };
}

describe("cas de la vie", () => {
  test("un coup de foudre met en couple et lance la cinématique", () => {
    const s = chooseOption(surCarte("rencontre-parc"), 0);
    expect(s.relation).toBe("couple");
    expect(s.cinematics).toContain("coup-de-foudre");
    expect(s.milestones.map((m) => m.label)).toContain("Coup de foudre");
  });

  test("le mariage coûte et marie", () => {
    const s = chooseOption(surCarte("demande-en-mariage", { relation: "couple" }), 0);
    expect(s.relation).toBe("marie");
    expect(s.cinematics).toContain("mariage");
    expect(s.gauges.money).toBe(base.gauges.money - 4000);
  });

  test("un bébé arrive", () => {
    const s = chooseOption(surCarte("projet-bebe", { relation: "marie" }), 0);
    expect(s.childrenAges).toEqual([0]);
    expect(s.cinematics).toContain("bebe");
  });

  test("le projet bébé n'existe que pour un couple de 22 à 45 ans", () => {
    const ids = (s: LifeState) => eligibleEvents(s, EVENTS).map((c) => c.id);
    expect(ids({ ...base, age: 30 })).not.toContain("projet-bebe");
    expect(ids({ ...base, age: 30, relation: "couple" })).toContain("projet-bebe");
    expect(ids({ ...base, age: 50, relation: "marie" })).not.toContain("projet-bebe");
    expect(ids({ ...base, age: 30, relation: "marie", childrenAges: [1, 3, 5] })).not.toContain("projet-bebe");
  });

  test("les cartes d'enfants dépendent de leur âge", () => {
    const ids = (s: LifeState) => eligibleEvents(s, EVENTS).map((c) => c.id);
    expect(ids({ ...base, age: 35, childrenAges: [5] })).toContain("enfant-dessin-mur");
    expect(ids({ ...base, age: 35, childrenAges: [14] })).not.toContain("enfant-dessin-mur");
    expect(ids({ ...base, age: 45, childrenAges: [14] })).toContain("enfant-ado-telephone");
  });

  test("la retraite à partir de 62 ans", () => {
    expect(availableActions({ ...base, age: 61 })).not.toContain("retraite");
    expect(availableActions({ ...base, age: 62 })).toContain("retraite");
    const s = chooseActions({ ...base, cinematics: [], age: 63, career: "bureau", careerLevel: 1 }, ["retraite", "repos"]);
    expect(s.retired).toBe(true);
    expect(s.pension).toBe(1300);
    expect(s.cinematics).toContain("retraite");
    expect(availableActions(s)).not.toContain("retraite");
  });
});

describe("cinématiques", () => {
  test("promotion quand le grade monte", () => {
    const apres = queueCinematics(base, { ...base, gauges: { ...base.gauges, money: 40_000 } });
    expect(apres.cinematics.at(-1)).toBe("promotion");
  });

  test("premier salaire au premier vrai job, une seule fois", () => {
    const job = queueCinematics(base, { ...base, career: "livreur" });
    expect(job.cinematics).toContain("premier-salaire");
    const encore = queueCinematics({ ...job, career: "vendeur" }, { ...job, career: "etudiant" });
    expect(encore.cinematics.filter((c) => c === "premier-salaire").length).toBe(1);
  });

  test("la galère n'arrive qu'une fois", () => {
    const une = queueCinematics(base, { ...base, gauges: { ...base.gauges, money: -6000 } });
    expect(une.cinematics.filter((c) => c === "galere").length).toBe(1);
    expect(une.hadCrisis).toBe(true);
    const deux = queueCinematics(une, { ...une, gauges: { ...une.gauges, money: -9000 } });
    expect(deux.cinematics.filter((c) => c === "galere").length).toBe(1);
  });

  test("ackCinematic retire la première", () => {
    expect(ackCinematic(base).cinematics).toEqual([]);
    expect(ackCinematic({ ...base, cinematics: [] }).cinematics).toEqual([]);
  });
});

test("contenu : au moins 12 cartes de vie et 4 de saison", () => {
  expect(VIE.length).toBeGreaterThanOrEqual(12);
  expect(EVENTS.filter((c) => c.season).length).toBeGreaterThanOrEqual(4);
});
