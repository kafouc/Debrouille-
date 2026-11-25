import type { LifeState } from "@/engine";

const RELATION = { celibataire: "célibataire", couple: "en couple", marie: "marié(e)" } as const;

/** « en couple · 2 enfants · retraité(e) » */
export function situationLabel(state: Pick<LifeState, "relation" | "childrenAges" | "retired">): string {
  const parts: string[] = [RELATION[state.relation]];
  const n = state.childrenAges.length;
  if (n > 0) parts.push(`${n} enfant${n > 1 ? "s" : ""}`);
  if (state.retired) parts.push("retraité(e)");
  return parts.join(" · ");
}
