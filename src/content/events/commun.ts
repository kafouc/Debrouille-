import type { EventCard } from "../schema";

/** Cartes valables dans toutes les villes. */
export const COMMUN: EventCard[] = [
  {
    id: "loyer-hausse",
    text: "Ton proprio augmente le loyer de 80 € par mois.",
    detail: "« Avec l'inflation, vous comprenez… » Il vient pourtant de changer de voiture.",
    choices: [
      {
        label: "Je paie sans rien dire",
        outcomes: [{ text: "Tu paies. Ton banquier soupire. Ton proprio, lui, part au ski.", effects: { money: -960, morale: -5 } }],
      },
      {
        label: "Je cherche une coloc",
        outcomes: [
          {
            text: "Coloc trouvée ! Il paie la moitié du loyer… et joue de la batterie à 2 h du matin.",
            effects: { money: 1800, morale: -10 },
          },
        ],
      },
      {
        label: "Je lui envoie un recommandé avec la loi en pièce jointe",
        outcomes: [
          {
            weight: 6,
            text: "Il recule : la hausse était illégale. Tes voisins t'appellent maintenant « Maître ».",
            effects: { reputation: 10, morale: 10 },
          },
          {
            weight: 4,
            text: "Il ne lit jamais ses recommandés. Tu paies quand même, mais avec dignité.",
            effects: { money: -960, morale: 2 },
          },
        ],
      },
    ],
  },
  {
    id: "maman-tu-manges",
    text: "Ta mère t'appelle : « Tu manges bien ? »",
    conditions: { maxAge: 50 },
    choices: [
      {
        label: "Je mens",
        outcomes: [{ text: "« Oui maman, des légumes tous les jours. » Elle n'y croit pas une seconde.", effects: { family: -2, morale: 1 } }],
      },
      {
        label: "Je dis la vérité : pâtes depuis 3 semaines",
        outcomes: [{ text: "Elle débarque dimanche avec un plat pour douze personnes.", effects: { family: 6, health: 3 } }],
      },
      {
        label: "Je débarque chez elle avec un sac vide",
        outcomes: [{ text: "Tu repars avec 4 tupperwares et une leçon de morale.", effects: { family: 10, money: 40 } }],
      },
    ],
  },
  {
    id: "patron-augmentation",
    text: "Tu demandes une augmentation. Ton patron répond : « Ce n'est pas le moment. »",
    detail: "Ce n'est jamais le moment.",
    conditions: { careers: ["livreur", "vendeur", "bureau", "artisan", "fonctionnaire"] },
    choices: [
      {
        label: "J'accepte",
        outcomes: [{ text: "Tu retournes à ton poste. Le moment ne viendra jamais.", effects: { morale: -6 } }],
      },
      {
        label: "Je démissionne",
        outcomes: [{ text: "Tu claques la porte. Ça fait du bien… jusqu'au premier loyer.", effects: { morale: 10, money: -1500 } }],
      },
      {
        label: "Je lance un podcast sur lui",
        outcomes: [
          {
            text: "40 000 écoutes. Ton patron t'augmente pour que tu arrêtes.",
            effects: { money: 2400, reputation: 12 },
          },
          { text: "Trois auditeurs, dont ta mère. Ton patron, lui, l'a écouté en entier.", effects: { reputation: -5, morale: -8 } },
        ],
      },
    ],
  },
  {
    id: "console-voisin",
    text: "Ton voisin veut racheter ta vieille console de jeux pour 30 €.",
    conditions: { maxAge: 30 },
    choices: [
      {
        label: "Je vends",
        outcomes: [{ text: "30 € dans la poche. Tu te sens très malin.", effects: { money: 30 }, setFlags: ["console-vendue"] }],
      },
      {
        label: "Je la garde",
        outcomes: [{ text: "Elle retourne dans son carton. Elle prend la poussière avec fierté.", effects: { morale: 1 }, setFlags: ["console-gardee"] }],
      },
    ],
  },
  {
    id: "cagnotte-collegue",
    text: "Cagnotte pour l'anniversaire d'un collègue que tu n'as jamais vu.",
    conditions: { minAge: 20 },
    choices: [
      {
        label: "Je mets 10 €",
        outcomes: [{ text: "Tu signes « Bon anniv ! » sans savoir à qui tu parles.", effects: { money: -10, reputation: 2 } }],
      },
      {
        label: "Je mets 0 € mais je signe",
        outcomes: [
          { weight: 7, text: "Personne ne remarque rien. Tu es un génie.", effects: { morale: 3 } },
          { weight: 3, text: "Tout le monde a remarqué. Ambiance glaciale à la machine à café.", effects: { reputation: -6 } },
        ],
      },
      {
        label: "Je propose d'organiser la fête",
        outcomes: [
          { text: "Tu deviens la personne qui organise toutes les fêtes. Pour toujours.", effects: { reputation: 8, money: -150, morale: -2 } },
        ],
      },
    ],
  },
  {
    id: "velo-vole",
    text: "On t'a volé ton vélo. Il reste juste la roue avant, attachée au poteau.",
    choices: [
      {
        label: "Je rachète un vélo",
        outcomes: [{ text: "Tu le cadenasses avec trois antivols. Il pèse maintenant 40 kg.", effects: { money: -300 } }],
      },
      {
        label: "Je fais tout à pied",
        outcomes: [{ text: "Tes mollets sont en béton. Ton moral, un peu moins.", effects: { health: 5, morale: -4 } }],
      },
      {
        label: "Je mène l'enquête sur les sites de revente",
        outcomes: [
          { weight: 4, text: "Tu le retrouves en vente à deux rues de chez toi. Tu le rachètes 80 €.", effects: { money: -80, reputation: 4 } },
          { weight: 6, text: "Trois heures d'annonces. Tu achètes finalement une trottinette.", effects: { money: -250, morale: -3 } },
        ],
      },
    ],
  },
  {
    id: "mariage-cousin",
    text: "Ton cousin se marie. La fête dure trois jours et il faut un cadeau.",
    conditions: { minAge: 22 },
    choices: [
      {
        label: "Je fais un beau cadeau",
        outcomes: [{ text: "Toute la famille en parle. Ton compte en banque aussi.", effects: { money: -500, family: 8 } }],
      },
      {
        label: "J'offre un « bon pour un service »",
        outcomes: [{ text: "Il te demande de l'aider à déménager. Le lendemain.", effects: { family: -4, health: -2, morale: 2 } }],
      },
      {
        label: "Je deviens le DJ de la soirée",
        outcomes: [
          { weight: 6, text: "Tu passes la même chanson 6 fois. Personne ne s'en plaint.", effects: { family: 6, reputation: 6 } },
          { weight: 4, text: "Panne de son à 23 h. Tu chantes sans micro. Légendaire, mais pas dans le bon sens.", effects: { reputation: -4, family: 2 } },
        ],
      },
    ],
  },
  {
    id: "impots-courrier",
    text: "Courrier des impôts : « Vous devez régulariser votre situation. »",
    conditions: { minAge: 20 },
    choices: [
      {
        label: "J'ouvre tout de suite",
        outcomes: [
          { text: "Fausse alerte : ils te doivent 112 €. Tu relis trois fois.", effects: { money: 112, morale: 5 } },
          { text: "Tu dois 640 €. Tu relis trois fois aussi.", effects: { money: -640, morale: -4 } },
        ],
      },
      {
        label: "Je le cache sous une pile",
        outcomes: [{ text: "La pile grandit. La somme aussi : 10 % de majoration.", effects: { money: -700, morale: -6 } }],
      },
      {
        label: "J'appelle un ami qui « s'y connaît »",
        outcomes: [{ text: "Il ne s'y connaît pas. Mais il est très sûr de lui.", effects: { money: -640, morale: 2 } }],
      },
    ],
  },
  {
    id: "salle-de-sport",
    text: "Tu t'abonnes à la salle de sport, motivé comme jamais.",
    choices: [
      {
        label: "J'y vais vraiment",
        outcomes: [{ text: "Au bout de 3 mois, tu dis « ma salle » avec fierté.", effects: { money: -360, health: 10, morale: 4 } }],
      },
      {
        label: "J'y vais deux fois, puis plus jamais",
        outcomes: [{ text: "Tu paies 30 € par mois pour un porte-clés.", effects: { money: -360, morale: -3 } }],
      },
      {
        label: "Je fais du sport dehors, c'est gratuit",
        outcomes: [{ text: "Tu cours au parc. Les pigeons te respectent.", effects: { health: 6 } }],
      },
    ],
  },
  {
    id: "telephone-casse",
    text: "Ton téléphone tombe. L'écran ressemble maintenant à une carte routière.",
    choices: [
      {
        label: "Je le fais réparer",
        outcomes: [{ text: "Comme neuf. Tu le tiens maintenant comme un œuf.", effects: { money: -180, morale: 2 } }],
      },
      {
        label: "Je continue avec l'écran cassé",
        outcomes: [{ text: "Tu lis tes messages à travers les fissures. On s'habitue à tout.", effects: { morale: -3, reputation: -2 } }],
      },
      {
        label: "C'est l'excuse parfaite pour ne plus répondre",
        outcomes: [{ text: "Trois jours de paix totale. Ta mère a failli appeler la police.", effects: { family: -5, morale: 6 } }],
      },
    ],
  },
  {
    id: "heritage-grand-tante",
    text: "Une grand-tante dont tu ignorais l'existence te laisse un héritage.",
    conditions: { minAge: 30 },
    weight: 0.5,
    choices: [
      {
        label: "J'accepte",
        outcomes: [
          { weight: 6, text: "8 000 € et un perroquet qui insulte les invités.", effects: { money: 8000, morale: 6 } },
          { weight: 4, text: "Tu hérites de ses dettes. Et du perroquet.", effects: { money: -3000, morale: -6 } },
        ],
      },
      {
        label: "Je refuse, par prudence",
        outcomes: [{ text: "Tu ne sauras jamais. Le perroquet non plus.", effects: { morale: -2 } }],
      },
    ],
  },
  {
    id: "voisin-travaux",
    text: "Ton voisin fait des travaux tous les dimanches à 8 h.",
    choices: [
      {
        label: "Je vais lui parler",
        outcomes: [
          { weight: 6, text: "Il s'excuse et t'offre des croissants. Dimanche suivant, il recommence.", effects: { morale: 2, reputation: 3 } },
          { weight: 4, text: "Il te demande si tu peux tenir l'échelle.", effects: { health: -2, reputation: 4 } },
        ],
      },
      {
        label: "Je mets ma musique plus fort",
        outcomes: [{ text: "Guerre froide dans l'immeuble. Tu as gagné. Pour l'instant.", effects: { morale: 4, reputation: -5 } }],
      },
      {
        label: "Je pars courir à 8 h moi aussi",
        outcomes: [{ text: "Ton voisin a fait de toi une personne du matin. Tu lui en veux.", effects: { health: 5, morale: -1 } }],
      },
    ],
  },
  {
    id: "chaussettes-connectees",
    text: "Un ami te propose d'investir 1 000 € dans son idée révolutionnaire : des chaussettes connectées.",
    conditions: { minAge: 20, minMoney: 1000 },
    choices: [
      {
        label: "J'investis",
        outcomes: [
          { weight: 25, text: "Les chaussettes cartonnent. Tu ne comprends pas pourquoi, mais tu encaisses.", effects: { money: 6000, reputation: 5 } },
          { weight: 75, text: "Les chaussettes ne se connectent à rien. Ni à personne.", effects: { money: -1000, morale: -5 } },
        ],
      },
      {
        label: "Je refuse poliment",
        outcomes: [{ text: "Il ne t'en veut pas. Il a déjà une autre idée : des chaussettes pour chiens.", effects: { morale: 1 } }],
      },
    ],
  },
  {
    id: "resolution-janvier",
    text: "C'est le 1er janvier. Tu prends une grande résolution.",
    repeatable: true,
    weight: 0.5,
    choices: [
      {
        label: "Arrêter le sucre",
        outcomes: [{ text: "Tu tiens 11 jours. Un record.", effects: { health: 4, morale: -4 } }],
      },
      {
        label: "Économiser",
        outcomes: [{ text: "Tu fais tes comptes. Les comptes te font peur, mais tu tiens bon.", effects: { money: 800, morale: -2 } }],
      },
      {
        label: "Aucune : je suis parfait comme ça",
        outcomes: [{ text: "Une année entière sans culpabilité. Les autres te jalousent.", effects: { morale: 6 } }],
      },
    ],
  },
  {
    id: "greve-trains",
    text: "Grève des trains le jour où tu pars en vacances.",
    choices: [
      {
        label: "Je prends le car : 11 heures de trajet",
        outcomes: [{ text: "Tu connais maintenant toute la vie de ton voisin de siège.", effects: { money: -60, health: -3, morale: -2 } }],
      },
      {
        label: "Je fais du covoiturage avec un inconnu",
        outcomes: [
          { weight: 7, text: "Il chante faux tout le trajet. Mais il ne te fait pas payer l'essence.", effects: { money: -20, morale: 3 } },
          { weight: 3, text: "Vous devenez amis. Il t'invite à son mariage.", effects: { reputation: 4, morale: 4 } },
        ],
      },
      {
        label: "J'annule et je reste chez moi",
        outcomes: [{ text: "Vacances sur ton canapé. Le soleil, c'est surfait.", effects: { money: 200, morale: -6 } }],
      },
    ],
  },
  {
    id: "parcoursup",
    text: "Résultats de Parcoursup : tu es en liste d'attente, position 4 812.",
    conditions: { maxAge: 19 },
    choices: [
      {
        label: "J'attends",
        outcomes: [
          { text: "Miracle : une place se libère en septembre.", effects: { morale: 6 } },
          { text: "La liste ne bouge pas. Tu deviens expert en attente.", effects: { morale: -6 } },
        ],
      },
      {
        label: "Je pars bosser direct",
        outcomes: [{ text: "Tu gagnes ta vie à 18 ans. Tes potes de fac t'envient le 1er du mois.", effects: { money: 1500, morale: 2 } }],
      },
      {
        label: "Je prends une année sabbatique",
        outcomes: [{ text: "Tu « te cherches ». Tu te trouves surtout sur ton canapé.", effects: { morale: 8, money: -500 } }],
      },
    ],
  },
];
