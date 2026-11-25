import type { ActionDef } from "./schema";

export const ACTIONS: ActionDef[] = [
  { id: "bosser", label: "Bosser plus", hint: "+ argent · − santé" },
  { id: "formation", label: "Me former", hint: "+ avenir · − argent" },
  { id: "job", label: "Chercher un job", hint: "meilleur salaire ?" },
  { id: "business", label: "Lancer un business", hint: "gros risque, gros gain", minMoney: 2000 },
  { id: "sortir", label: "Sortir", hint: "+ moral · + réseau" },
  { id: "sport", label: "Faire du sport", hint: "+ santé · + moral" },
  { id: "famille", label: "Voir la famille", hint: "+ famille" },
  { id: "investir", label: "Investir", hint: "placer ses sous", minMoney: 1000 },
  { id: "repos", label: "Me reposer", hint: "+ santé · − argent" },
  { id: "retraite", label: "Partir à la retraite", hint: "adieu le réveil", minAge: 62 },
];
