import type { City } from "@/engine/types";

export const DISTRICTS: Record<City, { name: string; rent: number }[]> = {
  paris: [
    { name: "Paris 11e", rent: 750 },
    { name: "Paris 18e", rent: 650 },
    { name: "Paris 20e", rent: 650 },
    { name: "Paris 15e", rent: 800 },
    { name: "Montreuil", rent: 600 },
  ],
  marseille: [
    { name: "Le Panier", rent: 520 },
    { name: "La Plaine", rent: 480 },
    { name: "Castellane", rent: 600 },
    { name: "Noailles", rent: 450 },
    { name: "Les Goudes", rent: 550 },
  ],
};
