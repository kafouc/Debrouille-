"use client";

import { useState } from "react";
import { effectChips } from "@/components/ResultView";
import type { City, MinigameId } from "@/engine";
import { MINIGAMES, type MinigameResult } from "./registry";

interface MinigameShellProps {
  id: MinigameId;
  city: City;
  onFinish: (result: MinigameResult | null) => void;
}

/** Base commune des mini-jeux : intro, jeu, résultat. */
export function MinigameShell({ id, city, onFinish }: MinigameShellProps) {
  const def = MINIGAMES[id];
  const [step, setStep] = useState<"intro" | "play" | "result">("intro");
  const [result, setResult] = useState<MinigameResult | null>(null);
  const [sent, setSent] = useState(false);

  function finish(r: MinigameResult | null) {
    if (sent) return;
    setSent(true);
    onFinish(r);
  }

  const Game = def.Component;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12 }} aria-label={`Mini-jeu : ${def.title}`}>
      <div>
        <span className="muted" style={{ fontWeight: 800, fontSize: 13 }}>
          Mini-jeu · {def.place(city)}
        </span>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>{def.title}</h2>
      </div>

      {step === "intro" ? (
        <>
          <p className="card" style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>
            {def.instruction}
          </p>
          <button type="button" className="btn-primary" onClick={() => setStep("play")}>
            Jouer
          </button>
        </>
      ) : null}

      {step === "play" ? (
        <Game
          city={city}
          onDone={(r) => {
            setResult(r);
            setStep("result");
          }}
        />
      ) : null}

      {step === "result" && result ? (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }} aria-live="polite">
          <p style={{ margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.4 }}>{result.text}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {effectChips(result.effects).map((c) => (
              <span key={c.text} className={`delta ${c.up ? "up" : "down"}`}>
                {c.text}
              </span>
            ))}
          </div>
          <button type="button" className="btn-sun" onClick={() => finish(result)} disabled={sent}>
            Continuer
          </button>
        </div>
      ) : null}

      {step !== "result" ? (
        <button
          type="button"
          onClick={() => finish(null)}
          disabled={sent}
          style={{ minHeight: 44, border: "none", background: "transparent", color: "var(--muted)", fontWeight: 800, fontSize: 14, cursor: "pointer" }}
        >
          Passer le mini-jeu
        </button>
      ) : null}
    </section>
  );
}
