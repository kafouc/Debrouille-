"use client";

import { useEffect, useRef, useState } from "react";
import type { CinematicId, LifeState } from "@/engine";

export const CINEMATIC_TEXT: Record<CinematicId, { title: string; caption: string; sky: string }> = {
  depart: { title: "Le départ du nid", caption: "18 ans : tu quittes la maison avec 3 cartons. Ta mère pleure à la fenêtre, un tupperware à la main.", sky: "#8FD8F5" },
  "premier-salaire": { title: "Le premier salaire", caption: "Ton premier salaire tombe ! Le loyer, les courses et l'abonnement repartent aussitôt.", sky: "#232C5A" },
  "coup-de-foudre": { title: "Le coup de foudre", caption: "Un regard. Un pigeon atterrit entre vous deux. C'est le destin.", sky: "#8FD8F5" },
  mariage: { title: "Le mariage", caption: "Le grand jour. Tonton danse déjà, alors que la musique n'a pas commencé.", sky: "#8FD8F5" },
  bebe: { title: "Le bébé", caption: "Bienvenue au bébé ! Fin des grasses matinées pour les 18 prochaines années.", sky: "#232C5A" },
  promotion: { title: "La montée de grade", caption: "Tu montes en grade ! Ta nouvelle carte de visite tient sur deux lignes.", sky: "#141A38" },
  galere: { title: "La galère", caption: "Les dettes s'accumulent. Un nuage te suit partout. Ton parapluie est troué, évidemment.", sky: "#3A4680" },
  retraite: { title: "La retraite", caption: "La retraite ! Tu jettes ton réveil. Il ne t'a jamais aimé de toute façon.", sky: "#FF9D6B" },
  "vie-qui-defile": { title: "Ta vie défile", caption: "Toute une vie… Place à ta carte de vie.", sky: "#232C5A" },
};

const DURATION_MS = 5000;

function Person({ x, y, skin, shirt, hair = "#1F1A17" }: { x: number; y: number; skin: string; shirt: string; hair?: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M14 120 C14 92 26 82 40 82 C54 82 66 92 66 120 Z" fill={shirt} />
      <circle cx="40" cy="58" r="22" fill={skin} />
      <path d="M18 56 C16 36 30 30 42 30 C56 30 66 40 62 56 C56 46 48 44 40 44 C30 44 22 48 18 56 Z" fill={hair} />
      <circle cx="33" cy="60" r="2.6" fill="#1F1A17" />
      <circle cx="47" cy="60" r="2.6" fill="#1F1A17" />
      <path d="M33 68 Q40 74 47 68" stroke="#1F1A17" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Scene({ id, skin, shirt, milestones, age }: { id: CinematicId; skin: string; shirt: string; milestones: LifeState["milestones"]; age: number }) {
  switch (id) {
    case "depart":
      return (
        <>
          <svg className="stage" viewBox="0 0 350 380" aria-hidden="true">
            <rect x="0" y="300" width="350" height="80" fill="#2E3870" />
            <rect x="18" y="160" width="130" height="140" fill="#F2E6CF" />
            <path d="M8 164 L83 100 L158 164 Z" fill="#FF5C8A" />
            <rect x="40" y="190" width="40" height="40" rx="4" fill="#CFE7F3" />
            <circle cx="60" cy="214" r="12" fill="#8D5A3B" />
            <circle className="cin-tear" cx="54" cy="220" r="2.5" fill="#1679B5" />
            <rect x="64" y="224" width="12" height="8" rx="2" fill="#FFFFFF" />
            <rect x="100" y="240" width="30" height="60" fill="#5A3825" />
          </svg>
          <svg className="stage" viewBox="0 0 350 380" aria-hidden="true">
            <g className="cin-walk">
              <g className="cin-sway">
                <Person x={150} y={190} skin={skin} shirt={shirt} />
                <rect x="196" y="262" width="40" height="30" rx="3" fill="#C9A26B" />
              </g>
              <rect className="cin-drop" x="200" y="230" width="30" height="24" rx="3" fill="#E3C79A" />
            </g>
          </svg>
        </>
      );
    case "premier-salaire":
      return (
        <svg className="stage" viewBox="0 0 350 380" aria-hidden="true">
          <rect x="110" y="60" width="130" height="230" rx="20" fill="#141A38" />
          <rect x="120" y="80" width="110" height="190" rx="10" fill="#F6F1E9" />
          <text x="175" y="140" textAnchor="middle" fontFamily="var(--font-titre), sans-serif" fontWeight="700" fontSize="30" fill="#1679B5">
            +1 150 €
          </text>
          <text className="cin-coin-out" x="150" y="190" fontFamily="var(--font-titre), sans-serif" fontWeight="700" fontSize="16" fill="#FF5C8A">
            −650 loyer
          </text>
          <text className="cin-coin-out d2" x="150" y="215" fontFamily="var(--font-titre), sans-serif" fontWeight="700" fontSize="16" fill="#FF5C8A">
            −300 courses
          </text>
          <text className="cin-coin-out d3" x="150" y="240" fontFamily="var(--font-titre), sans-serif" fontWeight="700" fontSize="16" fill="#FF5C8A">
            −15 abonnement
          </text>
          <Person x={20} y={230} skin={skin} shirt={shirt} />
        </svg>
      );
    case "coup-de-foudre":
      return (
        <>
          <svg className="stage" viewBox="0 0 350 380" aria-hidden="true">
            <rect x="0" y="290" width="350" height="90" fill="#5FB36A" />
            <circle cx="290" cy="70" r="26" fill="#FFC93C" />
            <rect x="80" y="262" width="190" height="12" rx="4" fill="#8D5A3B" />
            <Person x={70} y={150} skin={skin} shirt={shirt} />
            <Person x={190} y={150} skin="#E8B796" shirt="#1679B5" hair="#B5651D" />
            <path className="cin-heart" d="M175 200 c-8 -12 -24 -2 -14 10 l14 12 l14 -12 c10 -12 -6 -22 -14 -10 z" fill="#FF5C8A" />
            <path className="cin-heart d2" d="M150 210 c-6 -9 -18 -2 -11 8 l11 9 l11 -9 c7 -10 -5 -17 -11 -8 z" fill="#FF9DB8" />
            <path className="cin-heart d3" d="M200 215 c-6 -9 -18 -2 -11 8 l11 9 l11 -9 c7 -10 -5 -17 -11 -8 z" fill="#FF9DB8" />
          </svg>
          <svg className="stage" viewBox="0 0 350 380" aria-hidden="true">
            <g className="cin-pigeon">
              <ellipse cx="176" cy="250" rx="20" ry="14" fill="#9AA3B5" />
              <circle cx="192" cy="238" r="9" fill="#7D879C" />
              <circle cx="195" cy="236" r="2" fill="#141A38" />
              <path d="M200 239 l7 2 l-7 2 z" fill="#FFC93C" />
            </g>
          </svg>
        </>
      );
    case "mariage":
      return (
        <svg className="stage" viewBox="0 0 350 380" aria-hidden="true">
          <rect x="0" y="300" width="350" height="80" fill="#5FB36A" />
          <path d="M100 300 L100 150 Q175 70 250 150 L250 300" fill="none" stroke="#FFF6E8" strokeWidth="12" />
          <circle cx="110" cy="140" r="9" fill="#FF9DB8" />
          <circle cx="140" cy="110" r="9" fill="#FFC93C" />
          <circle cx="175" cy="100" r="9" fill="#FF9DB8" />
          <circle cx="210" cy="110" r="9" fill="#FFC93C" />
          <circle cx="240" cy="140" r="9" fill="#FF9DB8" />
          <Person x={118} y={180} skin={skin} shirt="#141A38" />
          <Person x={176} y={180} skin="#E8B796" shirt="#FFFFFF" hair="#B5651D" />
          <g className="cin-dance">
            <Person x={262} y={206} skin="#8D5A3B" shirt="#FFC93C" hair="#D9D6E4" />
          </g>
          {[40, 90, 160, 230, 300].map((x, i) => (
            <rect key={x} className="cin-confetti" x={x} y={-20 * i} width="8" height="8" fill={["#FF5C8A", "#FFC93C", "#1679B5"][i % 3]} style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </svg>
      );
    case "bebe":
      return (
        <svg className="stage" viewBox="0 0 350 380" aria-hidden="true">
          <circle cx="280" cy="70" r="24" fill="#FFE3A3" />
          <rect x="0" y="300" width="350" height="80" fill="#283266" />
          <rect x="190" y="230" width="120" height="70" rx="12" fill="#FFF6E8" />
          <circle className="cin-cry" cx="250" cy="250" r="16" fill="#F6D7C3" />
          <text className="cin-cry" x="226" y="200" fontFamily="var(--font-titre), sans-serif" fontWeight="700" fontSize="26" fill="#FFC93C">
            OUIN !
          </text>
          <g className="cin-wobble">
            <Person x={60} y={180} skin={skin} shirt={shirt} />
            <rect x="122" y="270" width="18" height="22" rx="3" fill="#FFFFFF" />
          </g>
          <rect x="24" y="40" width="96" height="40" rx="10" fill="#1F2750" />
          <text x="72" y="68" textAnchor="middle" fontFamily="var(--font-titre), sans-serif" fontWeight="700" fontSize="22" fill="#FF5C8A">
            03:00
          </text>
        </svg>
      );
    case "promotion":
      return (
        <svg className="stage" viewBox="0 0 350 380" aria-hidden="true">
          <path d="M175 0 L90 300 L260 300 Z" fill="#FFE3A3" opacity="0.25" />
          <rect x="0" y="300" width="350" height="80" fill="#1F2750" />
          <rect x="125" y="250" width="100" height="50" fill="#FFC93C" />
          <text x="175" y="285" textAnchor="middle" fontFamily="var(--font-titre), sans-serif" fontWeight="700" fontSize="28" fill="#141A38">
            1
          </text>
          <rect x="40" y="272" width="85" height="28" fill="#AEB5D9" />
          <rect x="225" y="280" width="85" height="20" fill="#C9A26B" />
          <Person x={135} y={130} skin={skin} shirt={shirt} />
          <path d="M210 164 h24 v10 a12 12 0 0 1 -24 0 z" fill="#FFC93C" />
          <path className="cin-spark" d="M90 120 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill="#FFC93C" />
          <path className="cin-spark d2" d="M260 100 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill="#FFFFFF" />
          <path className="cin-spark d3" d="M240 200 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" fill="#FFC93C" />
        </svg>
      );
    case "galere":
      return (
        <svg className="stage" viewBox="0 0 350 380" aria-hidden="true">
          <rect x="0" y="300" width="350" height="80" fill="#2E3870" />
          <g transform="translate(120,40)">
            <ellipse cx="60" cy="40" rx="70" ry="34" fill="#5A6280" />
            <ellipse cx="20" cy="50" rx="40" ry="26" fill="#5A6280" />
            <ellipse cx="100" cy="52" rx="40" ry="24" fill="#5A6280" />
            <g className="cin-rain">
              <path d="M10 80 v14 M40 84 v14 M70 80 v14 M100 84 v14" stroke="#8FD8F5" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
          <Person x={135} y={180} skin={skin} shirt="#7D879C" />
          <path d="M210 270 L218 150" stroke="#141A38" strokeWidth="4" />
          <path d="M180 156 Q218 120 256 156 Z" fill="#FF5C8A" />
          <circle cx="206" cy="146" r="6" fill="#3A4680" />
          <circle cx="232" cy="148" r="5" fill="#3A4680" />
        </svg>
      );
    case "retraite":
      return (
        <svg className="stage" viewBox="0 0 350 380" aria-hidden="true">
          <circle cx="175" cy="250" r="70" fill="#FFC93C" />
          <rect x="0" y="280" width="350" height="100" fill="#3B2A20" />
          <rect x="40" y="130" width="14" height="150" fill="#5A3825" />
          <circle cx="47" cy="120" r="40" fill="#2F7A4A" />
          <rect x="296" y="130" width="14" height="150" fill="#5A3825" />
          <circle cx="303" cy="120" r="40" fill="#2F7A4A" />
          <g className="cin-hammock">
            <path d="M54 170 Q175 260 296 170" fill="none" stroke="#FF5C8A" strokeWidth="10" />
            <circle cx="132" cy="206" r="18" fill={skin} />
            <path d="M116 200 C118 188 146 188 148 200 Z" fill="#D9D6E4" />
            <path d="M150 214 Q200 236 250 206" stroke={shirt} strokeWidth="16" strokeLinecap="round" fill="none" />
          </g>
          <g className="cin-clock">
            <circle cx="76" cy="266" r="14" fill="#FFFFFF" />
            <path d="M76 258 v8 l6 4" stroke="#141A38" strokeWidth="2.5" fill="none" />
          </g>
        </svg>
      );
    case "vie-qui-defile": {
      const photos = [...milestones, { age, label: `${age} ans` }];
      const looped = [...photos, ...photos];
      return (
        <div className="cin-photos" style={{ position: "absolute", left: 24, top: "14%", display: "flex", gap: 18 }}>
          {looped.map((m, i) => (
            <div
              key={`${m.label}-${i}`}
              style={{ width: 140, background: "#FFFFFF", padding: "10px 10px 14px", borderRadius: 6, transform: `rotate(${i % 2 ? 2 : -3}deg)`, display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}
            >
              <div style={{ height: 130, borderRadius: 4, background: ["#8FD8F5", "#FFE3A3", "#FF9DB8", "#CFE7F3"][i % 4], display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                <svg viewBox="0 0 80 120" width="64" height="96" aria-hidden="true">
                  <Person x={0} y={0} skin={skin} shirt={shirt} hair={m.age >= 60 ? "#D9D6E4" : "#1F1A17"} />
                </svg>
              </div>
              <span style={{ color: "#141A38", fontFamily: "var(--font-titre)", fontWeight: 700, fontSize: 14, textAlign: "center" }}>
                {m.label} · {m.age} ans
              </span>
            </div>
          ))}
        </div>
      );
    }
  }
}

interface CinematicProps {
  id: CinematicId;
  state: LifeState;
  shirt: string;
  onDone: () => void;
}

/** Une cinématique plein écran ; se ferme seule, ou en touchant l'écran. */
export function Cinematic({ id, state, shirt, onDone }: CinematicProps) {
  const [closed, setClosed] = useState(false);
  const closedRef = useRef(false);
  const text = CINEMATIC_TEXT[id];

  useEffect(() => {
    try {
      navigator.vibrate?.(40);
    } catch {
      // vibration indisponible
    }
    const t = setTimeout(() => close(), id === "vie-qui-defile" ? DURATION_MS + 2500 : DURATION_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function close() {
    if (closedRef.current) return;
    closedRef.current = true;
    setClosed(true);
    onDone();
  }

  return (
    <div className="cinematic" role="dialog" aria-modal="true" aria-label={text.title} onClick={close}>
      <div className="cinematic-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#AEB5D9" }}>Moment de vie</span>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: "auto", minHeight: 44, padding: "0 16px", color: "#F6F1E9", borderColor: "#3A4680" }}
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            disabled={closed}
          >
            Passer
          </button>
        </div>
        <div className="cinematic-stage" style={{ background: text.sky }}>
          <Scene id={id} skin={state.character.skin} shirt={shirt} milestones={state.milestones} age={state.age} />
          <span className="scene-label">{text.title}</span>
        </div>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.4, textAlign: "center" }}>{text.caption}</p>
      </div>
    </div>
  );
}
