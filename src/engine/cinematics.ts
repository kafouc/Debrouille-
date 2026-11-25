import { GRADES, gradeFor } from "./grades";
import type { CinematicId, LifeState } from "./types";

const CRISIS_THRESHOLD = -5000;

/** Ajoute les cinématiques déclenchées entre deux états (montée de grade, premier job, galère). */
export function queueCinematics(before: LifeState, after: LifeState): LifeState {
  const added: CinematicId[] = [];
  const s = structuredClone(after);
  const dead = s.phase === "dead";
  if (!dead && GRADES.indexOf(gradeFor(s.gauges)) > GRADES.indexOf(gradeFor(before.gauges))) {
    added.push("promotion");
    s.milestones.push({ age: s.age, label: gradeFor(s.gauges) });
  }
  if (before.career === "etudiant" && s.career !== "etudiant" && !s.milestones.some((m) => m.label === "Premier job")) {
    added.push("premier-salaire");
    s.milestones.push({ age: s.age, label: "Premier job" });
  }
  if (!s.hadCrisis && s.gauges.money < CRISIS_THRESHOLD) {
    s.hadCrisis = true;
    added.push("galere");
  }
  if (added.length === 0) return after;
  const endIndex = s.cinematics.indexOf("vie-qui-defile");
  if (endIndex >= 0) s.cinematics.splice(endIndex, 0, ...added);
  else s.cinematics.push(...added);
  return s;
}

/** Retire la cinématique qui vient d'être vue. */
export function ackCinematic(state: LifeState): LifeState {
  if (state.cinematics.length === 0) return state;
  return { ...state, cinematics: state.cinematics.slice(1) };
}
