"use client";

import { useState } from "react";
import { formatMoney, type Effects, type OutcomeResult } from "@/engine";

const LABELS: Record<keyof Effects, string> = {
  money: "Argent",
  health: "Santé",
  morale: "Moral",
  reputation: "Réputation",
  family: "Famille",
};

export function effectChips(effects: Effects): { text: string; up: boolean }[] {
  return (Object.keys(effects) as (keyof Effects)[])
    .filter((k) => (effects[k] ?? 0) !== 0)
    .map((k) => {
      const v = effects[k] ?? 0;
      const amount = k === "money" ? formatMoney(Math.abs(v)) : String(Math.abs(v));
      return { text: `${LABELS[k]} ${v > 0 ? "+" : "−"}${amount}`, up: v > 0 };
    });
}

interface ResultViewProps {
  result: OutcomeResult;
  onContinue: () => void;
}

export function ResultView({ result, onContinue }: ResultViewProps) {
  const [sent, setSent] = useState(false);
  const chips = effectChips(result.effects);

  function next() {
    if (sent) return;
    setSent(true);
    onContinue();
  }

  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }} aria-live="polite">
      <h2 className="subtitle" style={{ color: "var(--sun)", fontSize: 19 }}>
        {result.choiceLabel}
      </h2>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{result.text}</p>
      {chips.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {chips.map((c) => (
            <span key={c.text} className={`delta ${c.up ? "up" : "down"}`}>
              {c.text}
            </span>
          ))}
        </div>
      ) : null}
      <button type="button" className="btn-sun" onClick={next} disabled={sent}>
        Continuer
      </button>
    </section>
  );
}
