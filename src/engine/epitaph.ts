import { careerTitle } from "./careers";
import { formatMoney } from "./format";
import { gradeFor } from "./grades";
import type { LifeState } from "./types";

/** Version simple de la phrase de fin ; le plan 2 la remplace par une phrase construite avec la vie. */
export function buildEpitaph(state: LifeState): { title: string; sentence: string } {
  const grade = gradeFor(state.gauges);
  const money = formatMoney(state.gauges.money);
  const start = state.deathCause === "sante" && state.age < 50 ? `Parti(e) trop tôt, à ${state.age} ans…` : `Fin de vie à ${state.age} ans,`;
  return { title: careerTitle(state), sentence: `${start} ${grade}, avec ${money}.` };
}
