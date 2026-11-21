"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DISTRICTS } from "@/content/districts";
import { newLife, type City } from "@/engine";
import { saveLife } from "@/lib/save";
import { Avatar } from "./Avatar";
import { CityScene } from "./CityScene";

export const SKINS = [
  { color: "#F6D7C3", label: "Peau très claire" },
  { color: "#E8B796", label: "Peau claire" },
  { color: "#C68A62", label: "Peau mate" },
  { color: "#8D5A3B", label: "Peau foncée" },
  { color: "#5A3825", label: "Peau très foncée" },
];

export const SHIRT: Record<City, string> = { paris: "#FF5C8A", marseille: "#FFC93C" };

/** Graine imposée par l'adresse (`/creer?seed=...`), utile pour les tests. */
function seedFromUrl(): string | null {
  const seed = new URLSearchParams(window.location.search).get("seed");
  return seed && seed.length <= 64 ? seed : null;
}

export function CreationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState<City>("paris");
  const [district, setDistrict] = useState(DISTRICTS.paris[0].name);
  const [skin, setSkin] = useState(SKINS[2].color);
  const [busy, setBusy] = useState(false);

  function pickCity(next: City) {
    setCity(next);
    setDistrict(DISTRICTS[next][0].name);
  }

  function start() {
    if (busy) return;
    setBusy(true);
    const life = newLife({ name, city, district, skin }, seedFromUrl() ?? crypto.randomUUID());
    saveLife(life);
    router.push("/jouer");
  }

  const shownName = name.trim() || "Toi";

  return (
    <div className={city === "marseille" ? "theme-marseille" : undefined} style={{ background: "var(--bg)", color: "var(--text)" }}>
      <main className="screen" style={{ gap: 16 }}>
        <h1 className="title">Crée ton perso</h1>

        <CityScene city={city} height={180}>
          <Avatar skin={skin} shirt={SHIRT[city]} age={18} size={130} />
        </CityScene>
        <p style={{ margin: "-8px 0 0", fontWeight: 800, fontSize: 14, overflowWrap: "anywhere" }}>
          {shownName}, 18 ans · {district}
        </p>

        <div className="stack">
          <label htmlFor="prenom" className="field-label">
            Ton prénom
          </label>
          <input
            id="prenom"
            className="text-input"
            type="text"
            maxLength={16}
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="stack">
          <span className="field-label">Ta ville</span>
          <div className="segmented">
            <button type="button" aria-pressed={city === "paris"} onClick={() => pickCity("paris")}>
              Paris
            </button>
            <button type="button" aria-pressed={city === "marseille"} onClick={() => pickCity("marseille")}>
              Marseille
            </button>
          </div>
        </div>

        <div className="stack">
          <span className="field-label">Ton quartier</span>
          <div className="chips">
            {DISTRICTS[city].map((d) => (
              <button key={d.name} type="button" className="chip" aria-pressed={district === d.name} onClick={() => setDistrict(d.name)}>
                {d.name}
              </button>
            ))}
          </div>
        </div>

        <div className="stack">
          <span className="field-label">Ta couleur de peau</span>
          <div style={{ display: "flex", gap: 10 }}>
            {SKINS.map((s) => (
              <button
                key={s.color}
                type="button"
                className="swatch"
                aria-label={s.label}
                aria-pressed={skin === s.color}
                style={{ background: s.color }}
                onClick={() => setSkin(s.color)}
              />
            ))}
          </div>
        </div>

        <div className="grow" />
        <p className="muted small" style={{ margin: 0, textAlign: "center" }}>
          Ta famille de départ est tirée au sort : modeste, moyenne ou aisée.
        </p>
        <button type="button" className="btn-primary" onClick={start} disabled={busy}>
          Commencer ma vie à 18 ans
        </button>
      </main>
    </div>
  );
}
