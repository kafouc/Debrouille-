import type { CareerId, LifeState } from "./types";

interface CareerDef {
  label: string;
  levels: { title: string; monthly: number }[];
}

/** Valeurs de départ ; réglées par l'équilibrage (plan 2). */
export const CAREERS: Record<CareerId, CareerDef> = {
  etudiant: { label: "Études", levels: [{ title: "Étudiant", monthly: 400 }] },
  livreur: {
    label: "Livraison",
    levels: [
      { title: "Livreur à vélo", monthly: 1150 },
      { title: "Livreur en scooter", monthly: 1500 },
      { title: "Chef d'équipe livraison", monthly: 2000 },
    ],
  },
  vendeur: {
    label: "Vente",
    levels: [
      { title: "Vendeur", monthly: 1400 },
      { title: "Responsable de rayon", monthly: 1900 },
      { title: "Gérant de boutique", monthly: 2600 },
    ],
  },
  bureau: {
    label: "Bureau",
    levels: [
      { title: "Employé de bureau", monthly: 1700 },
      { title: "Chef de projet", monthly: 2600 },
      { title: "Directeur", monthly: 4500 },
    ],
  },
  artisan: {
    label: "Artisanat",
    levels: [
      { title: "Apprenti", monthly: 900 },
      { title: "Artisan", monthly: 2200 },
      { title: "Patron d'atelier", monthly: 4000 },
    ],
  },
  restauration: {
    label: "Restauration",
    levels: [
      { title: "Commis de cuisine", monthly: 1400 },
      { title: "Patron de kebab", monthly: 2800 },
      { title: "Chaîne de kebabs", monthly: 7000 },
    ],
  },
  foodtruck: {
    label: "Food truck",
    levels: [
      { title: "Food truck", monthly: 2000 },
      { title: "2 food trucks", monthly: 4500 },
      { title: "Flotte de food trucks", monthly: 9000 },
    ],
  },
  influenceur: {
    label: "Influence",
    levels: [
      { title: "Petit compte", monthly: 300 },
      { title: "Influenceur", monthly: 2500 },
      { title: "Star du web", monthly: 12000 },
    ],
  },
  startup: {
    label: "Start-up",
    levels: [
      { title: "Fondateur fauché", monthly: 0 },
      { title: "Start-up qui lève", monthly: 5000 },
      { title: "Licorne", monthly: 25000 },
    ],
  },
  immobilier: {
    label: "Immobilier",
    levels: [
      { title: "Agent immobilier", monthly: 1800 },
      { title: "Investisseur", monthly: 4000 },
      { title: "Magnat de l'immobilier", monthly: 15000 },
    ],
  },
  fonctionnaire: {
    label: "Fonction publique",
    levels: [
      { title: "Fonctionnaire", monthly: 1800 },
      { title: "Chef de service", monthly: 2600 },
      { title: "Haut fonctionnaire", monthly: 4200 },
    ],
  },
};

export const BUSINESS_CAREERS: CareerId[] = ["restauration", "foodtruck", "startup", "immobilier"];

type CareerRef = Pick<LifeState, "career" | "careerLevel">;

function level(ref: CareerRef) {
  const levels = CAREERS[ref.career].levels;
  return levels[Math.min(Math.max(ref.careerLevel, 0), levels.length - 1)];
}

export function careerTitle(ref: CareerRef): string {
  return level(ref).title;
}

export function monthlySalary(ref: CareerRef): number {
  return level(ref).monthly;
}

export function maxLevel(career: CareerId): number {
  return CAREERS[career].levels.length - 1;
}
