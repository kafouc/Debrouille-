"use client";

import type { Grade } from "@/engine";

const COLORS = ["#FF5C8A", "#141A38", "#FFFFFF", "#1679B5"];

export function GradeUp({ grade, onClose }: { grade: Grade; onClose: () => void }) {
  return (
    <div className="grade-up" role="dialog" aria-modal="true" aria-label={`Tu passes ${grade} !`}>
      <div className="grade-up-card">
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="confetti"
            aria-hidden="true"
            style={{ left: `${(i * 37) % 100}%`, background: COLORS[i % COLORS.length], animationDelay: `${(i % 7) * 0.2}s` }}
          />
        ))}
        <span style={{ fontWeight: 800, fontSize: 15 }}>Montée de grade</span>
        <h2 style={{ margin: 0, fontSize: 32, lineHeight: 1.05 }}>Tu passes {grade} !</h2>
        <button type="button" className="btn-primary" style={{ background: "#141A38", color: "#FFC93C" }} onClick={onClose} autoFocus>
          Trop bien
        </button>
      </div>
    </div>
  );
}
