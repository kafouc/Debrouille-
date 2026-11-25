"use client";

import { useState } from "react";
import type { EventCard } from "@/content/schema";
import type { Season } from "@/engine";

export const SEASON_STYLE: Record<Season, { label: string; color: string }> = {
  hiver: { label: "Hiver", color: "#8FD8F5" },
  printemps: { label: "Printemps", color: "#9BE29B" },
  ete: { label: "Été", color: "#FFC93C" },
  automne: { label: "Automne", color: "#FF9D6B" },
};

interface EventViewProps {
  card: EventCard;
  season?: Season | null;
  onChoose: (index: number) => void;
}

export function EventView({ card, season, onChoose }: EventViewProps) {
  const [sent, setSent] = useState(false);

  function choose(i: number) {
    if (sent) return;
    setSent(true);
    onChoose(i);
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 14 }} aria-label="Événement de l'année">
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {season ? (
          <span className="season-badge" style={{ background: SEASON_STYLE[season].color }}>
            {SEASON_STYLE[season].label}
          </span>
        ) : null}
        <span style={{ color: "var(--highlight)", fontFamily: "var(--font-titre)", fontWeight: 600, fontSize: 16 }}>Événement de l&apos;année</span>
      </div>
      <div className="event-card">
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24, lineHeight: 1.15 }}>{card.text}</h2>
        {card.detail ? <p style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>{card.detail}</p> : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {card.choices.map((c, i) => (
          <button key={c.label} type="button" className="choice-btn" data-testid="choix" disabled={sent} onClick={() => choose(i)}>
            {c.label}
          </button>
        ))}
      </div>
    </section>
  );
}
