import type { EventCard } from "../schema";

const paris = { cities: ["paris" as const] };

/** Cartes propres à Paris. */
export const PARIS: EventCard[] = [
  {
    id: "rer-bloque",
    text: "Ton RER est bloqué « pour une durée indéterminée ».",
    conditions: paris,
    choices: [
      {
        label: "J'attends",
        outcomes: [{ text: "47 minutes plus tard, il repart. Sans annonce. Sans excuse.", effects: { morale: -5 } }],
      },
      {
        label: "Je marche 6 km",
        outcomes: [{ text: "Tu arrives en retard, en sueur, mais héroïque.", effects: { health: 4, morale: -2 } }],
      },
      {
        label: "Je deviens ami avec les gens bloqués avec moi",
        outcomes: [{ text: "Vous créez un groupe de discussion. Il est toujours actif 20 ans plus tard.", effects: { reputation: 6, morale: 4 } }],
      },
    ],
  },
  {
    id: "visite-appart",
    text: "Visite d'un 12 m² à 900 € par mois. Vous êtes 40 candidats dans l'escalier.",
    conditions: { ...paris, maxAge: 40 },
    choices: [
      {
        label: "Je donne mon dossier",
        outcomes: [
          { weight: 2, text: "Ton dossier est retenu ! Tu vis dans un placard, mais un placard parisien.", effects: { morale: 8, money: -1200 } },
          { weight: 8, text: "Le proprio choisit un dentiste. Il y a toujours un dentiste.", effects: { morale: -6 } },
        ],
      },
      {
        label: "J'apporte des croissants au proprio",
        outcomes: [
          { text: "Ça marche ! Il adore les croissants. Moins les locataires, mais bon.", effects: { morale: 6, money: -1200, reputation: 2 } },
          { text: "Il mange les croissants et choisit le dentiste.", effects: { morale: -4, money: -12 } },
        ],
      },
      {
        label: "Je pars vivre en banlieue",
        outcomes: [{ text: "Deux fois plus grand, moitié moins cher. Et 40 minutes de RER.", effects: { money: 2400, morale: 2, health: -1 } }],
      },
    ],
  },
  {
    id: "metro-sandwich",
    text: "Métro à 8 h. Tu es collé à un inconnu qui mange un sandwich au thon.",
    conditions: paris,
    choices: [
      {
        label: "Je retiens ma respiration",
        outcomes: [{ text: "Tu tiens 4 stations. Record personnel.", effects: { health: -2, morale: -3 } }],
      },
      {
        label: "Je descends et j'attends le suivant",
        outcomes: [{ text: "Le suivant est pire. Il y a deux sandwichs.", effects: { morale: -4 } }],
      },
      {
        label: "Je lui demande où il l'a acheté",
        outcomes: [{ text: "Il te donne l'adresse. Le meilleur sandwich de Paris. Tu y vas tous les jours.", effects: { reputation: 4, morale: 3, money: -200 } }],
      },
    ],
  },
  {
    id: "cafe-terrasse",
    text: "Un café en terrasse à 6,50 €. Le serveur soupire quand tu commandes.",
    conditions: paris,
    choices: [
      {
        label: "Je paie, c'est Paris",
        outcomes: [{ text: "Tu bois ton café très lentement pour le rentabiliser.", effects: { money: -7, morale: 2 } }],
      },
      {
        label: "Je fais une remarque sur le prix",
        outcomes: [{ text: "Le serveur soupire encore plus fort. Respect mutuel.", effects: { reputation: -2, morale: 3 } }],
      },
      {
        label: "Je deviens serveur moi aussi pour l'été",
        outcomes: [{ text: "Tu travailles en terrasse tout l'été. Maintenant, toi aussi tu soupires.", effects: { money: 600, health: -3 } }],
      },
    ],
  },
  {
    id: "touristes-photo",
    text: "Des touristes te demandent de les prendre en photo devant la tour Eiffel.",
    conditions: paris,
    choices: [
      {
        label: "Je fais une belle photo",
        outcomes: [{ text: "Ils t'invitent à venir les voir au Brésil. Tu gardes précieusement le numéro.", effects: { reputation: 3, morale: 2 } }],
      },
      {
        label: "Je leur coupe la tête sur la photo",
        outcomes: [{ text: "Ils ne le verront qu'à l'aéroport. Trop tard.", effects: { morale: 3, reputation: -2 } }],
      },
      {
        label: "Je leur propose une visite guidée payante",
        outcomes: [{ text: "Tu inventes la moitié de l'histoire de Paris. Ils adorent.", effects: { money: 80, reputation: 2 } }],
      },
    ],
  },
  {
    id: "canicule-sous-les-toits",
    text: "Canicule : il fait 38 °C dans ton appart sous les toits.",
    conditions: paris,
    choices: [
      {
        label: "J'achète un ventilateur",
        outcomes: [{ text: "Il brasse de l'air chaud. Mais avec conviction.", effects: { money: -40, health: 2 } }],
      },
      {
        label: "Je dors dans la baignoire",
        outcomes: [{ text: "Au réveil, tu ne sens plus tes jambes. Mais tu as eu frais.", effects: { health: -2, morale: 2 } }],
      },
      {
        label: "Je m'installe chez un ami qui a la clim",
        outcomes: [{ text: "Tu restes trois semaines. Il ne t'a jamais réinvité.", effects: { reputation: -2, morale: 5 } }],
      },
    ],
  },
  {
    id: "rat-cuisine",
    text: "Un rat traverse ta cuisine avec l'assurance d'un locataire.",
    conditions: paris,
    choices: [
      {
        label: "Je le chasse",
        outcomes: [{ text: "Il revient le lendemain. Avec sa famille.", effects: { health: -1, morale: -2 } }],
      },
      {
        label: "Je l'appelle Gérard et je l'adopte",
        outcomes: [{ text: "Tes invités ne viennent plus. Gérard, lui, est fidèle.", effects: { morale: 4, reputation: -3 } }],
      },
      {
        label: "J'appelle un dératiseur",
        outcomes: [{ text: "Le rat part. Le dératiseur reste deux heures à te raconter sa vie.", effects: { money: -150, morale: 3 } }],
      },
    ],
  },
  {
    id: "cousins-de-province",
    text: "Tes cousins de province te disent que Paris, « c'est sale et c'est cher ».",
    conditions: paris,
    choices: [
      {
        label: "Je défends Paris",
        outcomes: [{ text: "Tu parles musées et culture. Tu n'as pas mis les pieds dans un musée depuis des années.", effects: { reputation: 2, family: -3 } }],
      },
      {
        label: "Je leur donne raison",
        outcomes: [{ text: "Ils t'invitent chez eux. Leur grand jardin te fait rêver toute la nuit.", effects: { family: 4, morale: -2 } }],
      },
      {
        label: "Je leur dis que Marseille, c'est pire",
        outcomes: [{ text: "Le débat dure jusqu'à 2 h du matin. Personne n'est jamais allé à Marseille.", effects: { family: 2, reputation: 3 } }],
      },
    ],
  },
];
