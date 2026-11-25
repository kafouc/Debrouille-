"use client";

import { useEffect, useState } from "react";
import { ACTIONS } from "@/content/actions";
import type { ActionId } from "@/content/schema";
import { formatMoney, type ActionReplay, type CareerId, type City, type Effects } from "@/engine";
import { Avatar } from "./Avatar";
import { CityScene } from "./CityScene";

const LABELS: Record<keyof Effects, string> = { money: "", health: "Santé", morale: "Moral", reputation: "Réputation", family: "Famille" };
const STEP_MS = 2600;

function chips(effects: Effects) {
  return (Object.keys(effects) as (keyof Effects)[]).map((k) => {
    const v = effects[k] ?? 0;
    const text = k === "money" ? `${v > 0 ? "+" : "−"}${formatMoney(Math.abs(v))}` : `${LABELS[k]} ${v > 0 ? "+" : "−"}${Math.abs(v)}`;
    return { key: k, text, up: v > 0 };
  });
}

/** Petit accessoire dessiné à côté du personnage, selon l'action. */
function Prop({ id, career }: { id: ActionId; career: CareerId }) {
  const common = { "aria-hidden": true as const, width: 64, height: 64, viewBox: "0 0 64 64" };
  switch (id) {
    case "bosser":
      return career === "livreur" ? (
        <svg {...common}>
          <circle cx="14" cy="48" r="11" fill="none" stroke="#F6F1E9" strokeWidth="4" />
          <circle cx="50" cy="48" r="11" fill="none" stroke="#F6F1E9" strokeWidth="4" />
          <path d="M14 48 L28 30 L46 30 L50 48 M28 30 L34 48 L14 48" fill="none" stroke="#FF5C8A" strokeWidth="4" strokeLinejoin="round" />
          <rect x="30" y="8" width="24" height="20" rx="3" fill="#FFC93C" />
        </svg>
      ) : (
        <svg {...common}>
          <rect x="8" y="22" width="48" height="34" rx="6" fill="#5A3825" />
          <rect x="24" y="14" width="16" height="10" rx="3" fill="none" stroke="#5A3825" strokeWidth="4" />
          <rect x="8" y="34" width="48" height="4" fill="#FFC93C" />
        </svg>
      );
    case "formation":
      return (
        <svg {...common}>
          <path d="M6 14 L32 20 L58 14 L58 52 L32 58 L6 52 Z" fill="#8FD8F5" />
          <path d="M32 20 V58" stroke="#141A38" strokeWidth="3" />
        </svg>
      );
    case "job":
      return (
        <svg {...common}>
          <rect x="12" y="6" width="40" height="52" rx="4" fill="#FFFFFF" />
          <path d="M20 20 h24 M20 30 h24 M20 40 h16" stroke="#3A4680" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "business":
      return (
        <svg {...common}>
          <rect x="4" y="18" width="44" height="30" rx="4" fill="#FFC93C" />
          <rect x="10" y="24" width="22" height="10" rx="2" fill="#141A38" />
          <path d="M48 28 h8 l6 10 v10 h-14 z" fill="#FF5C8A" />
          <circle cx="16" cy="52" r="6" fill="#141A38" />
          <circle cx="50" cy="52" r="6" fill="#141A38" />
        </svg>
      );
    case "sortir":
      return (
        <svg {...common} className="scene-bounce">
          <path d="M22 46 V12 L50 6 V40" fill="none" stroke="#FFC93C" strokeWidth="5" />
          <circle cx="16" cy="46" r="8" fill="#FFC93C" />
          <circle cx="44" cy="40" r="8" fill="#FFC93C" />
        </svg>
      );
    case "sport":
      return (
        <svg {...common}>
          <path d="M6 40 Q16 26 30 34 L50 36 Q60 38 58 48 L8 50 Z" fill="#FF5C8A" />
          <path d="M6 50 h52" stroke="#F6F1E9" strokeWidth="5" />
        </svg>
      );
    case "famille":
      return (
        <svg {...common} className="scene-bounce">
          <path d="M32 54 C10 40 6 26 16 18 C24 12 32 18 32 24 C32 18 40 12 48 18 C58 26 54 40 32 54 Z" fill="#FF5C8A" />
        </svg>
      );
    case "investir":
      return (
        <svg {...common}>
          <path d="M6 54 h52 M10 50 L24 36 L34 44 L54 18" fill="none" stroke="#FFC93C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M44 16 h12 v12" fill="none" stroke="#FFC93C" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    case "repos":
      return (
        <svg {...common} className="scene-bounce">
          <text x="10" y="44" fontFamily="var(--font-titre), sans-serif" fontWeight="700" fontSize="26" fill="#F6F1E9">
            Zzz
          </text>
        </svg>
      );
    case "retraite":
      return (
        <svg {...common}>
          <path d="M4 20 Q32 52 60 20" fill="none" stroke="#FF5C8A" strokeWidth="6" />
          <circle cx="50" cy="12" r="8" fill="#FFC93C" />
        </svg>
      );
  }
}

interface ActionSceneProps {
  replays: ActionReplay[];
  city: City;
  skin: string;
  shirt: string;
  age: number;
  career: CareerId;
  onDone: () => void;
}

/** Les actions de l'année, jouées l'une après l'autre en petite scène. */
export function ActionScene({ replays, city, skin, shirt, age, career, onDone }: ActionSceneProps) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const last = step >= replays.length - 1;

  useEffect(() => {
    if (last) return;
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [step, last]);

  function next() {
    if (done) return;
    if (!last) {
      setStep((s) => s + 1);
      return;
    }
    setDone(true);
    onDone();
  }

  const replay = replays[Math.min(step, replays.length - 1)];
  if (!replay) return null;
  const label = ACTIONS.find((a) => a.id === replay.id)?.label ?? "";
  const moving = replay.id === "bosser" && career === "livreur";

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12 }} aria-label="Ton année en scène">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="muted" style={{ fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>
          Action {step + 1}/{replays.length}
        </span>
        <div className="progress-dots" style={{ flexGrow: 1 }}>
          {replays.map((r, i) => (
            <span key={r.id} className={i <= step ? "on" : undefined} />
          ))}
        </div>
      </div>
      <div className="scene-box" onClick={next}>
        <CityScene city={city} height={300}>
          <div className={moving ? "scene-ride" : undefined} style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
            <div className={replay.id === "sport" || replay.id === "sortir" ? "scene-bounce" : undefined}>
              <Avatar skin={skin} shirt={shirt} age={age} size={130} />
            </div>
            <Prop id={replay.id} career={career} />
          </div>
        </CityScene>
        <span className="scene-label">{label}</span>
        {chips(replay.effects).map((c, i) => (
          <span
            key={`${step}-${c.key}`}
            className={`scene-chip ${c.up ? "up" : "down"}`}
            style={{ left: `${12 + ((i * 31) % 60)}%`, top: `${26 + (i % 2) * 12}%`, animationDelay: `${i * 0.5}s` }}
          >
            {c.text}
          </span>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, textAlign: "center", lineHeight: 1.4 }} aria-live="polite">
        {replay.text}
      </p>
      <button type="button" className="btn-sun" onClick={next} disabled={done}>
        {last ? "Continuer" : "Action suivante"}
      </button>
      <span className="muted small" style={{ textAlign: "center", fontWeight: 700 }}>
        Touche la scène pour accélérer
      </span>
    </section>
  );
}
