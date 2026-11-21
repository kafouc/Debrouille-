import type { LifeState } from "@/engine";

/** Remplacée par la vraie carte de vie à la tâche 10. */
export function LifeCard({ state }: { state: LifeState }) {
  return (
    <main className="screen">
      <h1 className="title">Fin de vie à {state.age} ans</h1>
    </main>
  );
}
