"use client";

import { useState } from "react";
import { ACTIONS } from "@/content/actions";
import type { ActionId } from "@/content/schema";

interface ActionPickerProps {
  available: ActionId[];
  onConfirm: (ids: [ActionId, ActionId]) => void;
}

export function ActionPicker({ available, onConfirm }: ActionPickerProps) {
  const [selected, setSelected] = useState<ActionId[]>([]);
  const [sent, setSent] = useState(false);
  const actions = ACTIONS.filter((a) => available.includes(a.id));

  function toggle(id: ActionId) {
    setSelected((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= 2) return [cur[1], id];
      return [...cur, id];
    });
  }

  function confirm() {
    if (sent || selected.length !== 2) return;
    setSent(true);
    onConfirm([selected[0], selected[1]]);
  }

  const left = 2 - selected.length;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 10 }} aria-label="Actions de l'année">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 className="subtitle">Choisis 2 actions</h2>
        <span className="muted" style={{ fontWeight: 800, fontSize: 14 }}>
          {selected.length}/2
        </span>
      </div>
      <div className="actions-grid">
        {actions.map((a) => (
          <button key={a.id} type="button" className="action-btn" aria-pressed={selected.includes(a.id)} onClick={() => toggle(a.id)}>
            <span style={{ fontWeight: 800, fontSize: 15 }}>{a.label}</span>
            <span className="hint">{a.hint}</span>
          </button>
        ))}
      </div>
      {left > 0 ? (
        <p className="muted small" style={{ margin: 0, textAlign: "center", fontWeight: 700 }}>
          Choisis encore {left} action{left > 1 ? "s" : ""}
        </p>
      ) : null}
      <button type="button" className="btn-sun" disabled={selected.length !== 2 || sent} onClick={confirm}>
        Vivre cette année
      </button>
    </section>
  );
}
