"use client";

import { useEffect, useRef, useState } from "react";
import type { MinigameProps } from "./registry";
import { pecheResult, pickCatch, type Catch } from "./peche";

const CASTS = 3;
const BITE_MS = 900;

type Phase = "wait" | "bite" | "cast" | "over";

export function Peche({ onDone }: MinigameProps) {
  const [phase, setPhase] = useState<Phase>("wait");
  const [cast, setCast] = useState(1);
  const [catches, setCatches] = useState<Catch[]>([]);
  const [message, setMessage] = useState<{ title: string; text: string } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function endCast(msg: { title: string; text: string }, caught: Catch | null) {
    clearTimers();
    setMessage(msg);
    if (caught) setCatches((c) => [...c, caught]);
    setPhase(cast >= CASTS ? "over" : "cast");
  }

  const phaseRef = useRef<Phase>(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase !== "wait") return;
    timers.current.push(
      setTimeout(() => {
        setPhase("bite");
        timers.current.push(
          setTimeout(() => {
            if (phaseRef.current === "bite") endCast({ title: "Trop tard…", text: "Il est parti avec l'appât. Et ta dignité." }, null);
          }, BITE_MS),
        );
      }, 1500 + Math.random() * 2500),
    );
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, cast]);

  function strike() {
    if (phase === "wait") endCast({ title: "Trop tôt !", text: "Le poisson se moque de toi depuis le fond." }, null);
    else if (phase === "bite") {
      const c = pickCatch(Math.random());
      endCast({ title: c.title, text: c.text }, c);
    }
  }

  function relaunch() {
    setMessage(null);
    setCast((c) => c + 1);
    setPhase("wait");
  }

  const biting = phase === "bite";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <span className="card" style={{ padding: "6px 10px", fontWeight: 800, fontSize: 14 }}>
          Lancer {cast}/{CASTS}
        </span>
        <span style={{ background: "#FFC93C", color: "#0B2E45", padding: "6px 10px", borderRadius: 12, fontWeight: 800, fontSize: 14 }}>Prises {catches.length}</span>
      </div>
      <div className="mg-stage" onClick={strike}>
        <svg viewBox="0 0 350 380" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
          <circle cx="290" cy="60" r="26" fill="#FFC93C" />
          <path d="M0 120 L50 96 L90 106 L140 80 L190 118 L350 118 L350 150 L0 150 Z" fill="#F2E6CF" />
          <rect x="0" y="150" width="350" height="230" fill="#1679B5" />
          <rect x="0" y="300" width="120" height="80" fill="#C9B48A" />
          <rect x="0" y="292" width="120" height="10" fill="#A8926A" />
          <path d="M60 292 L60 250 M60 250 L230 170" stroke="#5A3825" strokeWidth="5" strokeLinecap="round" />
          <path d="M230 170 L236 228" stroke="#0B2E45" strokeWidth="1.5" />
          <g className="mg-waves">
            <path d="M0 158 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.7" />
          </g>
          <g className={`mg-bobber${biting ? " bite" : ""}`}>
            <circle cx="236" cy="232" r="10" fill="#FF5C8A" />
            <rect x="226" y="231" width="20" height="4" fill="#FFFFFF" />
          </g>
          <g transform="translate(22,196) scale(0.65)">
            <path d="M20 160 C20 118 38 104 60 104 C82 104 100 118 100 160 Z" fill="#FFFFFF" />
            <circle cx="60" cy="60" r="30" fill="#E8B796" />
            <rect x="20" y="48" width="80" height="8" rx="4" fill="#FFC93C" />
            <path d="M26 52 C26 40 40 30 60 30 C80 30 94 40 94 52 Z" fill="#FFC93C" />
            <circle cx="50" cy="64" r="3.2" fill="#1F1A17" />
            <circle cx="70" cy="64" r="3.2" fill="#1F1A17" />
          </g>
        </svg>
        {biting ? (
          <span style={{ position: "absolute", left: "50%", top: "44%", background: "#FFFFFF", color: "#0B2E45", padding: "4px 10px", borderRadius: 10, fontFamily: "var(--font-titre)", fontWeight: 700 }}>
            Ça mord !
          </span>
        ) : null}
        {message ? (
          <div className="mg-pop" role="status" style={{ position: "absolute", left: 14, right: 14, top: 14, background: "#FFFFFF", color: "#0B2E45", borderRadius: 18, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-titre)", fontWeight: 700, fontSize: 19 }}>{message.title}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#4A6478" }}>{message.text}</span>
          </div>
        ) : null}
      </div>
      {phase === "wait" || phase === "bite" ? (
        <button type="button" className="btn-primary" style={{ minHeight: 72, fontSize: 26 }} onClick={strike}>
          Ferrer !
        </button>
      ) : null}
      {phase === "cast" ? (
        <button type="button" className="btn-sun" style={{ minHeight: 72, fontSize: 24 }} onClick={relaunch}>
          Relancer la ligne
        </button>
      ) : null}
      {phase === "over" ? (
        <button type="button" className="btn-sun" style={{ minHeight: 64 }} onClick={() => onDone(pecheResult(catches))}>
          Voir le résultat
        </button>
      ) : null}
    </div>
  );
}
