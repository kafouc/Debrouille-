"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionPicker } from "@/components/ActionPicker";
import { Avatar } from "@/components/Avatar";
import { CityScene } from "@/components/CityScene";
import { SHIRT } from "@/components/CreationForm";
import { EventView } from "@/components/EventView";
import { GaugesPanel } from "@/components/GaugesPanel";
import { GradeUp } from "@/components/GradeUp";
import { LifeCard } from "@/components/LifeCard";
import { ResultView } from "@/components/ResultView";
import type { ActionId } from "@/content/schema";
import {
  availableActions,
  careerTitle,
  chooseActions,
  chooseOption,
  continueTurn,
  currentEvent,
  formatAge,
  formatMoney,
  GRADES,
  gradeFor,
  monthlySalary,
  type Grade,
  type LifeState,
} from "@/engine";
import { loadLife, saveLife } from "@/lib/save";

export function Game() {
  const router = useRouter();
  const [state, setState] = useState<LifeState | null>(null);
  const [gradeUp, setGradeUp] = useState<Grade | null>(null);

  useEffect(() => {
    const life = loadLife();
    if (!life) {
      router.replace("/creer");
      return;
    }
    // Lecture du stockage local : uniquement côté navigateur, après le premier rendu.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(life);
  }, [router]);

  if (!state) return <main className="screen" aria-busy="true" />;

  function apply(next: LifeState) {
    if (!state) return;
    const before = gradeFor(state.gauges);
    const after = gradeFor(next.gauges);
    if (next.phase !== "dead" && GRADES.indexOf(after) > GRADES.indexOf(before)) setGradeUp(after);
    saveLife(next);
    setState(next);
  }

  if (state.phase === "dead") {
    return (
      <div className={state.character.city === "marseille" ? "theme-marseille" : undefined}>
        <LifeCard state={state} />
      </div>
    );
  }

  const card = state.phase === "event" ? currentEvent(state) : null;
  const grade = gradeFor(state.gauges);
  const salary = monthlySalary(state);

  return (
    <div className={state.character.city === "marseille" ? "theme-marseille" : undefined} style={{ background: "var(--bg)", color: "var(--text)" }}>
      <main className="screen" style={{ gap: 14 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 24, overflowWrap: "anywhere" }}>
              {state.character.name} · {formatAge(state.age)}
            </h1>
            <span className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
              {careerTitle(state)} · {formatMoney(salary)}/mois
            </span>
          </div>
          <span className="badge">{grade}</span>
        </header>

        <GaugesPanel gauges={state.gauges} />

        {state.phase === "actions" ? (
          <>
            <CityScene city={state.character.city} height={150}>
              <Avatar skin={state.character.skin} shirt={SHIRT[state.character.city]} age={state.age} size={112} />
            </CityScene>
            <ActionPicker
              key={`actions-${state.age}`}
              available={availableActions(state)}
              onConfirm={(ids: [ActionId, ActionId]) => apply(chooseActions(state, ids))}
            />
          </>
        ) : null}

        {state.phase === "event" && card ? (
          <EventView key={`event-${state.age}-${card.id}`} card={card} onChoose={(i) => apply(chooseOption(state, i))} />
        ) : null}

        {state.phase === "result" && state.lastResult ? (
          <ResultView key={`result-${state.age}-${state.lastResult.cardId}`} result={state.lastResult} onContinue={() => apply(continueTurn(state))} />
        ) : null}
      </main>
      {gradeUp ? <GradeUp grade={gradeUp} onClose={() => setGradeUp(null)} /> : null}
    </div>
  );
}
