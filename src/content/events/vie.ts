import type { EventCard } from "../schema";

/** Cartes des cas de la vie (amour, enfants) et des saisons. */
export const VIE: EventCard[] = [
  {
    id: "rencontre-parc",
    text: "Au parc, quelqu'un te sourit depuis le banc d'en face.",
    conditions: { relations: ["celibataire"], minAge: 20, maxAge: 50 },
    repeatable: true,
    choices: [
      {
        label: "Je souris aussi",
        outcomes: [{ text: "Un sourire, un café, puis un deuxième. Vous ne vous quittez plus.", effects: { morale: 10 }, life: "couple" }],
      },
      {
        label: "Je fais semblant de lire",
        outcomes: [{ text: "Tu lis le même paragraphe 14 fois. L'occasion passe.", effects: { morale: -2 } }],
      },
      {
        label: "Je lui parle du pigeon entre nous",
        outcomes: [
          { weight: 6, text: "Le pigeon vous a réunis. Il sera témoin au mariage.", effects: { morale: 8 }, life: "couple" },
          { weight: 4, text: "Le pigeon s'envole avec ton sandwich. Cette personne rit. Toi, moins.", effects: { morale: 2 } },
        ],
      },
    ],
  },
  {
    id: "rencontre-appli",
    text: "Ton appli de rencontre t'annonce un « match parfait » à 300 mètres.",
    conditions: { relations: ["celibataire"], minAge: 20, maxAge: 55 },
    repeatable: true,
    choices: [
      {
        label: "J'y vais",
        outcomes: [
          { text: "Le match était vraiment parfait. Seul défaut : son rire, qu'on entend depuis la rue.", effects: { morale: 8 }, life: "couple" },
          { text: "Sa photo datait d'il y a 10 ans. Vous rigolez quand même toute la soirée.", effects: { morale: 3 } },
        ],
      },
      {
        label: "Je supprime l'appli",
        outcomes: [{ text: "Paix intérieure retrouvée. Ta mère, elle, désespère.", effects: { morale: 4, family: -2 } }],
      },
    ],
  },
  {
    id: "demande-en-mariage",
    text: "Tu as très envie de faire ta demande en mariage.",
    conditions: { relations: ["couple"], minAge: 22 },
    choices: [
      {
        label: "Je fais ma demande",
        outcomes: [{ text: "Oui ! La fête est prévue. Tonton s'entraîne déjà à danser.", effects: { morale: 12, family: 8 }, life: "mariage" }],
      },
      {
        label: "J'attends encore un peu",
        outcomes: [{ text: "Tu attends. Ta future belle-mère, elle, n'attend plus.", effects: { family: -3 } }],
      },
      {
        label: "Je fais ma demande au stade, sur l'écran géant",
        outcomes: [
          { weight: 7, text: "Oui ! Devant 40 000 personnes. Tu passes au journal du soir.", effects: { reputation: 10, morale: 10 }, life: "mariage" },
          { weight: 3, text: "Réponse filmée par 40 000 personnes : « On en reparle à la maison. »", effects: { reputation: 3, morale: -8 } },
        ],
      },
    ],
  },
  {
    id: "projet-bebe",
    text: "Vous parlez sérieusement d'avoir un enfant.",
    conditions: { relations: ["couple", "marie"], minAge: 22, maxAge: 45, maxChildren: 2 },
    repeatable: true,
    weight: 1.5,
    choices: [
      {
        label: "On se lance !",
        outcomes: [{ text: "C'est un bébé ! Tu découvres qu'on peut vivre avec 4 heures de sommeil.", effects: { family: 12, morale: 6 }, life: "bebe" }],
      },
      {
        label: "Pas tout de suite",
        outcomes: [{ text: "Vous adoptez un cactus pour vous entraîner. Il n'a pas survécu à mars.", effects: { morale: -1 } }],
      },
    ],
  },
  {
    id: "dispute-vaisselle",
    text: "Dispute : la vaisselle s'empile dans l'évier depuis 6 jours.",
    conditions: { relations: ["couple", "marie"] },
    repeatable: true,
    choices: [
      {
        label: "Je fais la vaisselle",
        outcomes: [{ text: "Tu fais la vaisselle en chantant. La paix revient à la maison.", effects: { morale: 2, family: 3 } }],
      },
      {
        label: "Je dis que ce n'est pas mon tour",
        outcomes: [
          { weight: 7, text: "Un tableau des tâches apparaît sur le frigo. Vous signez un traité de paix.", effects: { morale: -3 } },
          { weight: 3, text: "C'était la vaisselle de trop. Vous vous séparez. Tu gardes l'éponge.", effects: {}, life: "rupture" },
        ],
      },
      {
        label: "J'achète des assiettes en carton",
        outcomes: [{ text: "Problème réglé. La planète, elle, te regarde de travers.", effects: { money: -40, morale: 3 } }],
      },
    ],
  },
  {
    id: "enfant-dessin-mur",
    text: "Ton enfant a fait une fresque au feutre sur le mur du salon.",
    conditions: { childAge: [3, 8] },
    choices: [
      {
        label: "Je gronde",
        outcomes: [{ text: "Ton enfant boude trois heures. La fresque, elle, reste.", effects: { family: -3 } }],
      },
      {
        label: "Je prends une photo et je l'encadre",
        outcomes: [{ text: "Ton salon est maintenant une galerie d'art. Entrée gratuite.", effects: { family: 6, morale: 4 } }],
      },
      {
        label: "Je repeins tout",
        outcomes: [{ text: "Deux jours de peinture. Le lendemain, une nouvelle fresque apparaît.", effects: { money: -150, health: -1 } }],
      },
    ],
  },
  {
    id: "enfant-ado-telephone",
    text: "Ton ado réclame le dernier téléphone, « sinon je suis un paria ».",
    conditions: { childAge: [12, 17] },
    choices: [
      {
        label: "Je l'achète",
        outcomes: [{ text: "Ton ado te dit merci. Une fois. C'était beau.", effects: { money: -900, family: 4 } }],
      },
      {
        label: "Je refuse",
        outcomes: [{ text: "Porte claquée. Silence radio pendant trois jours.", effects: { family: -5 } }],
      },
      {
        label: "Je propose de travailler pour se l'offrir",
        outcomes: [{ text: "Ton ado fait du baby-sitting et découvre enfin ce qu'est la fatigue.", effects: { family: -1, reputation: 3 } }],
      },
    ],
  },
  {
    id: "soldes",
    text: "C'est les soldes d'hiver : moins 70 % sur tout !",
    season: "hiver",
    repeatable: true,
    weight: 0.7,
    choices: [
      {
        label: "Je reste raisonnable",
        outcomes: [{ text: "Un pull. Un seul. Quelle maîtrise.", effects: { money: -150, morale: 3 } }],
      },
      {
        label: "Je dévalise les magasins",
        outcomes: [{ text: "Tu rentres avec 14 sacs et un appareil à raclette. Tu n'aimes pas la raclette.", effects: { money: -900, morale: 8 } }],
      },
      {
        label: "Je n'y vais pas",
        outcomes: [{ text: "Tes potes postent leurs achats. Tu tiens bon. Héroïque.", effects: { morale: -1 } }],
      },
    ],
  },
  {
    id: "vacances-ete",
    text: "Les vacances d'été arrivent enfin.",
    season: "ete",
    repeatable: true,
    weight: 0.7,
    choices: [
      {
        label: "Camping",
        outcomes: [{ text: "Tente montée à l'envers, voisins à la guitare. Souvenirs inoubliables.", effects: { money: -400, morale: 6, health: 2 } }],
      },
      {
        label: "Hôtel tout compris",
        outcomes: [{ text: "Tu reviens avec un beau bronzage et 3 kilos de buffet en plus.", effects: { money: -2000, morale: 10 } }],
      },
      {
        label: "Je reste bosser",
        outcomes: [{ text: "Ville déserte, bureau climatisé. Tu as presque aimé.", effects: { money: 800, morale: -6 } }],
      },
    ],
  },
  {
    id: "rentree",
    text: "C'est la rentrée : tout le monde reprend le rythme.",
    season: "automne",
    repeatable: true,
    weight: 0.6,
    choices: [
      {
        label: "Je prends de bonnes résolutions",
        outcomes: [{ text: "Agenda neuf, stylos neufs. Ça tient jusqu'au 15 septembre.", effects: { health: 3, morale: 2 } }],
      },
      {
        label: "Je fais comme si les vacances continuaient",
        outcomes: [{ text: "Ton chef remarque tes tongs en réunion.", effects: { morale: 4, reputation: -3 } }],
      },
    ],
  },
  {
    id: "noel-belle-famille",
    text: "Noël chez ta belle-famille. Quatre jours.",
    season: "hiver",
    conditions: { relations: ["couple", "marie"] },
    repeatable: true,
    weight: 0.6,
    choices: [
      {
        label: "Je participe à tout",
        outcomes: [{ text: "Quatre repas, trois desserts, deux débats animés. Tu as survécu.", effects: { family: 8, health: -2 } }],
      },
      {
        label: "J'offre un livre de cuisine à ma belle-mère",
        outcomes: [{ text: "Elle l'a très mal pris. Le dessert a été servi en silence.", effects: { family: -4, morale: 3 } }],
      },
      {
        label: "Je prétexte une garde de nuit",
        outcomes: [{ text: "Noël en jogging devant un film. Le vrai bonheur.", effects: { family: -6, morale: 6 } }],
      },
    ],
  },
  {
    id: "tomates-balcon",
    text: "Le printemps est là : envie de faire pousser des tomates sur ton balcon.",
    season: "printemps",
    repeatable: true,
    weight: 0.6,
    choices: [
      {
        label: "Je me lance",
        outcomes: [{ text: "Récolte : 3 tomates. Prix de revient : 14 € la tomate. Fierté totale.", effects: { money: -40, morale: 5 } }],
      },
      {
        label: "J'achète des tomates",
        outcomes: [{ text: "Moins poétique. Beaucoup plus rentable.", effects: { morale: 1 } }],
      },
    ],
  },
];
