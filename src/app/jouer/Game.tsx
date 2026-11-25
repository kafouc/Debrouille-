"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionPicker } from "@/components/ActionPicker";
import { ActionScene } from "@/components/ActionScene";
import { Avatar } from "@/components/Avatar";
import { Cinematic } from "@/components/Cinematic";
import { CityScene } from "@/components/CityScene";
import { SHIRT } from "@/components/CreationForm";
import { EventView } from "@/components/EventView";
import { GaugesPanel } from "@/components/GaugesPanel";
import { LifeCard } from "@/components/LifeCard";
import { ResultView } from "@/components/ResultView";
import { YearSummary } from "@/components/YearSummary";
import type { ActionId } from "@/content/schema";
import {
  ackCinematic,
  availableActions,
  careerTitle,
  chooseActions,
  chooseOption,
  continueTurn,
  currentEvent,
  finishMinigame,
  formatAge,
  formatMoney,
  gradeFor,
  monthlySalary,
  type LifeState,
} from "@/engine";
import { loadLife, saveLife } from "@/lib/save";
import { situationLabel } from "@/lib/situation";
import { MinigameShell } from "@/minigames/MinigameShell";

export function Game() {
  const router = useRouter();
  const [state, setState] = useState<LifeState | null>(null);

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
    saveLife(next);
    setState(next);
  }

  const city = state.character.city;
  const shirt = SHIRT[city];
  const theme = city === "marseille" ? "theme-marseille" : undefined;
  const cinematic = state.cinematics[0];

  if (cinematic) {
    return (
      <div className={theme}>
        <Cinematic key={`${cinematic}-${state.cinematics.length}-${state.age}`} id={cinematic} state={state} shirt={shirt} onDone={() => apply(ackCinematic(state))} />
      </div>
    );
  }

  if (state.phase === "dead") {
    return (
      <div className={theme}>
        <LifeCard state={state} />
      </div>
    );
  }

  const card = state.phase === "event" ? currentEvent(state) : null;
  const salary = state.retired ? state.pension : monthlySalary(state);

  return (
    <div className={theme} style={{ background: "var(--bg)", color: "var(--text)" }}>
      <main className="screen" style={{ gap: 14 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 24, overflowWrap: "anywhere" }}>
              {state.character.name} · {formatAge(state.age)}
            </h1>
            <span className="muted" style={{ fontSize: 14, fontWeight: 700 }}>
              {state.retired ? "Retraite" : careerTitle(state)} · {formatMoney(salary)}/mois
            </span>
            <span className="situation">{situationLabel(state)}</span>
          </div>
          <span className="badge">{gradeFor(state.gauges)}</span>
        </header>

        {state.phase !== "summary" && state.phase !== "minigame" ? <GaugesPanel gauges={state.gauges} /> : null}

        {state.phase === "actions" ? (
          <>
            <CityScene city={city} height={150}>
              <Avatar skin={state.character.skin} shirt={shirt} age={state.age} size={112} />
            </CityScene>
            <ActionPicker key={`actions-${state.age}`} available={availableActions(state)} onConfirm={(ids: [ActionId, ActionId]) => apply(chooseActions(state, ids))} />
          </>
        ) : null}

        {state.phase === "scene" ? (
          <ActionScene
            key={`scene-${state.age}`}
            replays={state.yearActions}
            city={city}
            skin={state.character.skin}
            shirt={shirt}
            age={state.age}
            career={state.career}
            onDone={() => apply(continueTurn(state))}
          />
        ) : null}

        {state.phase === "minigame" && state.minigame ? (
          <MinigameShell key={`mg-${state.age}`} id={state.minigame} city={city} onFinish={(r) => apply(finishMinigame(state, r))} />
        ) : null}

        {state.phase === "event" && card ? (
          <EventView key={`event-${state.age}-${card.id}`} card={card} season={state.season} onChoose={(i) => apply(chooseOption(state, i))} />
        ) : null}

        {state.phase === "result" && state.lastResult ? (
          <ResultView key={`result-${state.age}-${state.lastResult.cardId}`} result={state.lastResult} onContinue={() => apply(continueTurn(state))} />
        ) : null}

        {state.phase === "summary" && state.lastYear ? (
          <YearSummary key={`summary-${state.age}`} summary={state.lastYear} name={state.character.name} situation={situationLabel(state)} onNext={() => apply(continueTurn(state))} />
        ) : null}
      </main>
    </div>
  );
}
