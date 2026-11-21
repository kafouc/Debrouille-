"use client";

import { useRouter } from "next/navigation";
import { buildEpitaph, formatMoney, gradeFor, scoreFor, type LifeState } from "@/engine";
import { clearLife } from "@/lib/save";
import { Avatar } from "./Avatar";
import { SHIRT } from "./CreationForm";

const CITY_NAME = { paris: "Paris", marseille: "Marseille" } as const;

export function LifeCard({ state }: { state: LifeState }) {
  const router = useRouter();
  const { title, sentence } = buildEpitaph(state);
  const grade = gradeFor(state.gauges);
  const score = scoreFor(state);
  const city = state.character.city;

  function replay() {
    clearLife();
    router.push("/creer");
  }

  const stats = [
    { label: "Fortune", value: formatMoney(state.gauges.money) },
    { label: "Réputation", value: String(state.gauges.reputation) },
    { label: "Famille", value: String(state.gauges.family) },
  ];

  return (
    <main className="screen" style={{ gap: 14, background: city === "paris" ? "#0E1330" : "var(--bg)" }}>
      <article
        aria-label="Ta carte de vie"
        style={{ background: city === "paris" ? "#232C5A" : "var(--card)", borderRadius: 28, overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        <div style={{ position: "relative", height: 220, background: city === "paris" ? "#FF5C8A" : "#8FD8F5", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: 16,
              background: "#141A38",
              color: "#FFC93C",
              padding: "6px 14px",
              borderRadius: 14,
              fontFamily: "var(--font-titre)",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {grade}
          </span>
          <span style={{ position: "absolute", right: 16, top: 18, color: "#141A38", fontFamily: "var(--font-titre)", fontWeight: 700, fontSize: 15 }}>
            Carte de vie
          </span>
          <Avatar skin={state.character.skin} shirt={SHIRT[city]} age={state.age} size={176} />
        </div>
        <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="stack" style={{ gap: 2 }}>
            <span className="muted" style={{ fontSize: 14, fontWeight: 800, overflowWrap: "anywhere" }}>
              {state.character.name} · {state.character.district} · 18 → {state.age} ans
            </span>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 30, lineHeight: 1.05, color: "var(--sun)" }}>{title}</h1>
          </div>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.4 }}>« {sentence} »</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: city === "paris" ? "#1B2245" : "var(--bg)", borderRadius: 14, padding: 10, display: "flex", flexDirection: "column", gap: 2 }}>
                <span className="muted" style={{ fontSize: 12, fontWeight: 800 }}>
                  {s.label}
                </span>
                <span style={{ fontFamily: "var(--font-titre)", fontWeight: 700, fontSize: 18, overflowWrap: "anywhere" }}>{s.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid var(--border)", paddingTop: 12, gap: 8 }}>
            <span style={{ fontFamily: "var(--font-titre)", fontWeight: 700, fontSize: 18, color: city === "paris" ? "#FF5C8A" : "var(--accent)" }}>
              +{score.toLocaleString("fr-FR")} pts pour {CITY_NAME[city]}
            </span>
            <span className="muted" style={{ fontSize: 13, fontWeight: 800 }}>
              La Débrouille
            </span>
          </div>
        </div>
      </article>
      <button type="button" className="btn-primary" onClick={replay}>
        Rejouer une vie
      </button>
    </main>
  );
}
