import { ACTIONS } from "@/content/actions";
import type { ActionId } from "@/content/schema";
import { applyEffects } from "./apply";
import { BUSINESS_CAREERS, maxLevel, monthlySalary } from "./careers";
import type { Rng } from "./rng";
import type { CareerId, Effects, Gauges, LifeState } from "./types";

const WORK_ACTIONS: ActionId[] = ["bosser", "job"];

export function availableActions(state: LifeState): ActionId[] {
  return ACTIONS.filter((a) => {
    if (a.minMoney !== undefined && state.gauges.money < a.minMoney) return false;
    if (a.minAge !== undefined && state.age < a.minAge) return false;
    if (state.retired && (a.id === "retraite" || WORK_ACTIONS.includes(a.id))) return false;
    return true;
  }).map((a) => a.id);
}

function note(state: LifeState, text: string) {
  state.history.push({ age: state.age, text });
}

function promote(state: LifeState) {
  state.careerLevel = Math.min(state.careerLevel + 1, maxLevel(state.career));
}

function changeCareer(state: LifeState, career: CareerId) {
  state.career = career;
  state.careerLevel = 0;
}

function applyOne(state: LifeState, id: ActionId, rng: Rng) {
  const g = (effects: Parameters<typeof applyEffects>[1]) => {
    state.gauges = applyEffects(state.gauges, effects);
  };
  switch (id) {
    case "bosser":
      g({ money: 2 * monthlySalary(state), health: -4, morale: -3 });
      note(state, "Tu as bossé comme jamais.");
      break;
    case "formation":
      g({ money: -1500, morale: -1 });
      state.formations += 1;
      note(state, "Tu t'es formé.");
      break;
    case "job": {
      if (state.career === "etudiant") {
        const options: CareerId[] = state.formations >= 1 ? ["livreur", "vendeur", "bureau"] : ["livreur", "vendeur"];
        changeCareer(state, rng.pick(options));
        note(state, "Tu as trouvé ton premier vrai job.");
      } else if (rng.chance(Math.min(0.35 + 0.1 * state.formations, 0.75))) {
        promote(state);
        note(state, "Tu as décroché une promotion.");
      } else {
        note(state, "Tu as cherché un meilleur job, sans succès.");
      }
      break;
    }
    case "business":
      g({ money: -2000 });
      if (!BUSINESS_CAREERS.includes(state.career)) {
        changeCareer(state, rng.pick<CareerId>(["foodtruck", "restauration"]));
        note(state, "Tu as lancé ton business.");
      } else if (rng.chance(0.4)) {
        promote(state);
        note(state, "Ton business a grandi.");
      } else {
        g({ money: -3000, morale: -8 });
        note(state, "Ton business a pris l'eau.");
      }
      break;
    case "sortir":
      g({ morale: 8, reputation: 3, money: -400 });
      note(state, "Tu es sorti avec tes potes.");
      break;
    case "sport":
      g({ health: 6, morale: 3 });
      note(state, "Tu as fait du sport.");
      break;
    case "famille":
      g({ family: 8, money: -200 });
      note(state, "Tu as passé du temps en famille.");
      break;
    case "investir": {
      const placed = Math.floor(Math.max(state.gauges.money, 0) / 2);
      const rate = -0.3 + rng.next() * 0.7;
      g({ money: Math.round(placed * rate) });
      note(state, rate >= 0 ? "Tes placements ont rapporté." : "Tes placements ont fondu.");
      break;
    }
    case "repos":
      g({ health: 4, morale: 4, money: -300 });
      note(state, "Tu t'es reposé.");
      break;
    case "retraite":
      state.retired = true;
      state.pension = Math.round(monthlySalary(state) / 2);
      g({ morale: 10 });
      state.cinematics.push("retraite");
      state.milestones.push({ age: state.age, label: "La retraite" });
      note(state, "Départ à la retraite.");
      break;
  }
}

/** Applique les deux actions de l'année. Lève "ACTIONS_INVALIDES" si elles sont identiques ou indisponibles. */
export function applyActions(state: LifeState, ids: [ActionId, ActionId], rng: Rng): LifeState {
  const available = availableActions(state);
  if (ids.length !== 2 || ids[0] === ids[1] || !ids.every((id) => available.includes(id))) {
    throw new Error("ACTIONS_INVALIDES");
  }
  const next = structuredClone(state);
  next.yearActions = [];
  next.ledger = [];
  for (const id of ids) {
    const before = { ...next.gauges };
    applyOne(next, id, rng);
    const effects: Effects = {};
    for (const key of Object.keys(before) as (keyof Gauges)[]) {
      const diff = next.gauges[key] - before[key];
      if (diff !== 0) effects[key] = diff;
    }
    next.yearActions.push({ id, text: next.history.at(-1)?.text ?? "", effects });
    if (effects.money) next.ledger.push({ label: ACTIONS.find((a) => a.id === id)!.label, amount: effects.money });
  }
  next.rngState = rng.getState();
  return next;
}
