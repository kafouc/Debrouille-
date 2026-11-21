import { formatMoney, type Gauges } from "@/engine";

const BARS: { key: Exclude<keyof Gauges, "money">; label: string }[] = [
  { key: "health", label: "Santé" },
  { key: "morale", label: "Moral" },
  { key: "reputation", label: "Réputation" },
  { key: "family", label: "Famille" },
];

export function GaugesPanel({ gauges }: { gauges: Gauges }) {
  return (
    <section className="card" aria-label="Tes jauges" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: 15, color: "var(--sun)" }} className="money-label">
          Argent
        </span>
        <span style={{ fontFamily: "var(--font-titre)", fontWeight: 700, fontSize: 26, color: "var(--sun)" }} className="money-value">
          {formatMoney(gauges.money)}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px 16px" }}>
        {BARS.map((b) => (
          <div key={b.key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800 }}>
              <span>{b.label}</span>
              <span>{gauges[b.key]}</span>
            </span>
            <div
              className="gauge-track"
              role="meter"
              aria-label={b.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={gauges[b.key]}
            >
              <div className={`gauge-fill${gauges[b.key] < 25 ? " low" : ""}`} style={{ width: `${gauges[b.key]}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
