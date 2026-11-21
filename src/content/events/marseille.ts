import type { EventCard } from "../schema";

const marseille = { cities: ["marseille" as const] };

/** Cartes propres à Marseille. */
export const MARSEILLE: EventCard[] = [
  {
    id: "mistral-parasol",
    text: "Le mistral a encore emporté ton parasol. Pour la 4e fois cette année.",
    conditions: marseille,
    choices: [
      {
        label: "J'en rachète un",
        outcomes: [{ text: "Tu l'attaches avec une corde. Le mistral emporte la corde aussi.", effects: { money: -35 } }],
      },
      {
        label: "Je cours après",
        outcomes: [{ text: "Tu le rattrapes au bout de la plage. Applaudissements.", effects: { health: 3, morale: 2 } }],
      },
      {
        label: "J'arrête les parasols",
        outcomes: [{ text: "Tu bronzes. Beaucoup. Trop.", effects: { health: -2, morale: 1 } }],
      },
    ],
  },
  {
    id: "petanque-anciens",
    text: "Des anciens te défient à la pétanque. Ils jouent ensemble depuis 40 ans.",
    conditions: marseille,
    choices: [
      {
        label: "J'accepte",
        outcomes: [
          { weight: 3, text: "Tu gagnes. Tout le quartier parle de toi.", effects: { reputation: 10, morale: 6 } },
          { weight: 7, text: "Tu perds 13 à 0. Tu dois embrasser la Fanny devant tout le monde.", effects: { morale: -3, reputation: 3 } },
        ],
      },
      {
        label: "Je refuse poliment",
        outcomes: [{ text: "Ils murmurent que tu dois être « de Paris ».", effects: { reputation: -2 } }],
      },
      {
        label: "Je propose d'être l'arbitre",
        outcomes: [{ text: "Tu mesures au mètre ruban. Tout le monde conteste. Tu adores.", effects: { reputation: 4, morale: 2 } }],
      },
    ],
  },
  {
    id: "calanques-bateau",
    text: "Un ami te propose une sortie en bateau dans les calanques.",
    conditions: marseille,
    choices: [
      {
        label: "Je viens",
        outcomes: [{ text: "Eau turquoise, poulpe croisé, coup de soleil garanti.", effects: { money: -40, morale: 8, health: 2 } }],
      },
      {
        label: "Je viens, mais je ne sais pas nager",
        outcomes: [
          { weight: 7, text: "Tu restes au fond du bateau avec trois gilets. Super journée quand même.", effects: { morale: 5 } },
          { weight: 3, text: "Tu tombes à l'eau. Tu apprends à nager en 4 secondes.", effects: { health: -3, reputation: 5 } },
        ],
      },
      {
        label: "Je préfère la plage",
        outcomes: [{ text: "Tu vois passer le bateau. Ils te font coucou. Tu boudes.", effects: { morale: 3 } }],
      },
    ],
  },
  {
    id: "poisson-voiture",
    text: "Ton voisin te raconte qu'il a pêché un poisson « gros comme une voiture ».",
    conditions: marseille,
    choices: [
      {
        label: "Je le crois",
        outcomes: [{ text: "Le lendemain, le poisson fait la taille d'un camion.", effects: { morale: 3 } }],
      },
      {
        label: "Je demande une photo",
        outcomes: [{ text: "Il n'a pas de photo. « Le poisson était timide. »", effects: { reputation: -3 } }],
      },
      {
        label: "J'en raconte une encore plus grosse",
        outcomes: [{ text: "Ton poisson à toi a avalé le bateau. Respect total du quartier.", effects: { reputation: 5, morale: 4 } }],
      },
    ],
  },
  {
    id: "soir-de-match",
    text: "Soir de match au stade : la ville entière ne parle que de ça.",
    conditions: marseille,
    choices: [
      {
        label: "J'y vais",
        outcomes: [{ text: "Tu chantes si fort que tu n'as plus de voix pendant trois jours.", effects: { money: -60, morale: 8, reputation: 3 } }],
      },
      {
        label: "Je regarde chez moi",
        outcomes: [{ text: "Tes voisins crient avant toi. Leur télé a 5 secondes d'avance.", effects: { morale: 3 } }],
      },
      {
        label: "Je dis que le foot ne m'intéresse pas",
        outcomes: [{ text: "Tu l'as dit à voix haute. Le quartier s'en souviendra.", effects: { reputation: -6, morale: 1 } }],
      },
    ],
  },
  {
    id: "parisien-palier",
    text: "Un Parisien emménage sur ton palier. Il trouve que « l'accent, c'est mignon ».",
    conditions: marseille,
    choices: [
      {
        label: "Je lui fais visiter le quartier",
        outcomes: [{ text: "Tu lui apprends à dire « fada ». Il le dit mal. Tu l'adoptes quand même.", effects: { reputation: 4, morale: 3 } }],
      },
      {
        label: "Je lui dis du mal de Paris",
        outcomes: [{ text: "Il est d'accord avec tout. Il est venu pour ça.", effects: { morale: 4, reputation: 2 } }],
      },
      {
        label: "Je l'ignore",
        outcomes: [{ text: "Il te salue tous les matins. Tu craques au bout d'un an.", effects: { reputation: -2 } }],
      },
    ],
  },
  {
    id: "bus-bouchon",
    text: "Embouteillage monstre : ton bus n'a pas bougé depuis 20 minutes.",
    conditions: marseille,
    choices: [
      {
        label: "J'attends",
        outcomes: [{ text: "Le chauffeur coupe le moteur et sort son journal.", effects: { morale: -4 } }],
      },
      {
        label: "Je descends et je marche",
        outcomes: [{ text: "Tu arrives avant le bus. Tu fais un petit signe au chauffeur.", effects: { health: 3, morale: 1 } }],
      },
      {
        label: "Je râle avec tout le bus",
        outcomes: [{ text: "Ça ne sert à rien. Mais ensemble, ça fait du bien.", effects: { reputation: 2, morale: 3 } }],
      },
    ],
  },
];
