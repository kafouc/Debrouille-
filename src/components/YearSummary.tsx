"use client";

import { useState } from "react";
import { formatMoney, type YearSummary as Summary } from "@/engine";

interface YearSummaryProps {
  summary: Summary;
  name: string;
  situation: string;
  onNext: () => void;
}

function signed(amount: number) {
  return `${amount > 0 ? "+" : ""}${formatMoney(amount)}`;
}

/** Le bilan de fin d'année : anniversaire et argent de l'année. */
export function YearSummary({ summary, name, situation, onNext }: YearSummaryProps) {
  const [sent, setSent] = useState(false);

  function next() {
    if (sent) return;
    setSent(true);
    onNext();
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 14 }} aria-label="Bilan de l'année">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
        <svg viewBox="0 0 200 150" width="180" height="135" aria-hidden="true">
          <rect x="30" y="80" width="140" height="56" rx="12" fill="#FF5C8A" />
          <rect x="30" y="80" width="140" height="16" rx="8" fill="#FFF6E8" />
          <rect x="20" y="134" width="160" height="10" rx="5" fill="#3A4680" />
          <rect x="72" y="52" width="10" height="30" rx="3" fill="#FFC93C" />
          <rect x="95" y="46" width="10" height="36" rx="3" fill="#8FD8F5" />
          <rect x="118" y="52" width="10" height="30" rx="3" fill="#FFC93C" />
          <path className="flame" d="M77 52 c-6 -8 0 -16 0 -16 c0 0 6 8 0 16 z" fill="#FF9D3C" />
          <path className="flame" d="M100 46 c-6 -8 0 -16 0 -16 c0 0 6 8 0 16 z" fill="#FF9D3C" />
          <path className="flame" d="M123 52 c-6 -8 0 -16 0 -16 c0 0 6 8 0 16 z" fill="#FF9D3C" />
        </svg>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 30, color: "var(--highlight)", overflowWrap: "anywhere" }}>Joyeux anniversaire, {name}&nbsp;!</h2>
        <span style={{ fontWeight: 800, fontSize: 17 }}>Tu as maintenant {summary.age} ans.</span>
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="subtitle">L&apos;argent de ton année</span>
        {summary.lines.map((l) => (
          <div key={l.label} className="ledger-line">
            <span>{l.label}</span>
            <span style={{ fontWeight: 800 }}>{signed(l.amount)}</span>
          </div>
        ))}
        <div style={{ borderTop: "2px solid var(--border)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>Total de l&apos;année</span>
          <span style={{ fontFamily: "var(--font-titre)", fontWeight: 700, fontSize: 24, color: "var(--highlight)" }}>{signed(summary.total)}</span>
        </div>
      </div>

      <div className="card" style={{ fontSize: 14, fontWeight: 700, padding: "12px 14px" }}>
        <span style={{ color: "var(--highlight)", fontWeight: 800 }}>Ta situation : </span>
        {situation}
      </div>

      <button type="button" className="btn-primary" onClick={next} disabled={sent}>
        Année suivante
      </button>
    </section>
  );
}
