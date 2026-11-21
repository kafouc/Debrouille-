# La Débrouille — fiche du jeu (design)

*Version 2 — 21 novembre 2026 — statut : à valider*

*Changements depuis la version 1 : ajout du défi du jour, de l'album des fins, de l'héritage, du défi entre potes et de 6 mini-jeux ; règles d'humour ; plateformes ; calendrier passé de 3 à environ 5 semaines.*

Maquette des écrans : https://claude.ai/artifact/VtY4SfTiFbxKZY2coTWsbN

## 1. L'idée et pourquoi

**La Débrouille** est un simulateur de vie humoristique qui se passe en France. Le joueur part de rien à 18 ans, enchaîne galères et opportunités, et essaie de devenir « Légende » avant la fin de sa vie. Il joue sur son téléphone, dans le navigateur, sans rien installer.

**Pourquoi maintenant :** *Lagos Life*, un simulateur de vie nigérian jouable dans le navigateur, a dépassé le million de joueurs quelques jours après sa sortie (1er octobre 2026). Des imitations sont déjà apparues au Nigeria. Nous n'avons rien trouvé d'équivalent en français. La fenêtre est ouverte, mais elle va se refermer.

**Pourquoi ça peut marcher en France :** les galères du quotidien (loyer, RER, CAF, Parcoursup, patron, coloc) sont un sujet d'humour partagé par toute une génération. La rivalité Paris–Marseille donne une raison de jouer et de partager.

**Objectif business :** gagner une audience rapidement en France à coût quasi nul, puis la monétiser (achats dans le jeu, pubs choisies) une fois que l'on a vérifié que les joueurs reviennent.

**Ce n'est pas une copie** de Lagos Life : univers, villes, règles, textes et visuels sont originaux.

## 2. Objectifs, non-objectifs, anti-objectifs

**Objectifs de la V1**
- Un jeu complet et **drôle**, jouable en entier sur mobile, sorti environ 5 semaines après validation de cette fiche.
- Une partie (une vie) dure **10 à 15 minutes** (voir §5.2), sauvegardée à tout moment.
- Chaque vie se termine par une **carte de vie** partageable (image + lien) sur TikTok, Snapchat, Instagram et WhatsApp.
- Des raisons de **revenir** : défi du jour, album des fins, héritage, défi entre potes, classement Paris contre Marseille de la semaine.
- **6 mini-jeux** courts intégrés à la vie.
- Mesurer : combien reviennent le lendemain, combien de parties par joueur, combien partagent.

**Non-objectifs de la V1** (prévus plus tard)
- Paiements et achats dans le jeu.
- Comptes utilisateurs, connexion.
- Saisons à thème (Noël, soldes, canicule…) et nouveaux mini-jeux : ajoutés après le lancement, au fil des semaines.
- Multijoueur en temps réel, interactions entre joueurs.
- Autres villes (Lyon, Lille, Toulouse…).
- Applications Android et iOS sur les stores (étapes 2 et 3, §9).
- Afrique, autres pays.

**Anti-objectifs** (ce qui ferait de la V1 un échec même si elle « marche »)
- De l'humour qui se moque d'un groupe de personnes (origine, religion, quartier, handicap, physique) ou qui enchaîne les clichés.
- Une partie trop longue ou ennuyeuse au milieu : on doit avoir envie de voir la fin.
- Un jeu qu'on peut « casser » (devenir milliardaire en 5 tours, mourir à chaque fois à 25 ans).
- Un jeu lourd qui rame sur un petit téléphone ou en 4G moyenne.
- Des mécaniques qui manipulent : notifications harcelantes, coffres-surprises payants, payer pour gagner.
- Collecter des données personnelles inutiles.

## 3. Contraintes

- **Mobile d'abord**, en français, utilisable à une main, lisible sur un écran de 360 px de large.
- Fonctionne dans le navigateur, **installable sur l'écran d'accueil**, jouable même si le réseau coupe en cours de partie.
- Budget de départ quasi nul : hébergement gratuit ou presque, un nom de domaine (~10 €/an).
- Public **15–30 ans**. Contenu adapté dès 12 ans : pas de sexe explicite, pas de drogue présentée de façon positive, pas de violence graphique.
- **Pas de marques ni de personnes réelles** dans les textes et visuels (pas de logos de clubs, pas de politiciens). On peut parler de « supporters » ou du « club de la ville » sans le nommer.
- RGPD : pas de compte, pas d'email. Seul un pseudo choisi par le joueur est stocké pour le classement. Mesure d'audience sans cookie.

## 4. Approches envisagées

| Approche | Avantages | Inconvénients |
|---|---|---|
| **A. Jeu web installable** (choisie) | Un simple lien à partager, pas de validation des stores ni de frais, sortie la plus rapide, mises à jour instantanées | Moins visible que sur les stores, paiements plus tard via le web |
| B. Applis Android/iOS dès le départ | Visibilité sur les stores, paiements intégrés | Plus lent (validation Apple/Google), frais, chaque mise à jour doit être revalidée |
| C. Multijoueur en temps réel (comme un monde partagé) | Très engageant | Beaucoup plus long et coûteux, modération nécessaire, risqué pour une V1 |

**Choix :** A. Les applis store (B) viendront ensuite en réutilisant le même jeu (§9). Le multijoueur (C) est une piste pour plus tard.

## 5. Le jeu

### 5.1 Début de partie
- Le joueur choisit un **prénom** (affiché sur la carte de vie), sa **ville** (Paris ou Marseille), un **quartier** parmi une courte liste par ville (quartiers réels, présentés sans cliché ; ils changent quelques événements et le loyer de départ) et la **couleur de peau** de son personnage.
- Le **point de départ** est tiré au hasard : famille modeste, moyenne ou aisée. Ça change l'argent et le soutien familial de départ.
- Le joueur commence à **18 ans**.

### 5.2 Le temps et la durée d'une vie
- **Un tour = une année** de la vie (18 ans → mort). Une vie fait environ 50 à 65 tours, soit **10 à 15 minutes**.
- Pourquoi cette durée : la carte de vie (le moteur du partage) n'arrive qu'à la fin, donc il faut pouvoir finir une vie dans un temps de jeu mobile normal (transports, pause). Plus court, il n'y a pas d'histoire ni d'attachement ; plus long, beaucoup abandonnent avant la carte. Une vie courte donne aussi envie de rejouer.
- La partie est **sauvegardée en continu** : on peut s'arrêter et reprendre plus tard.

### 5.3 Les jauges
| Jauge | Plage | Rôle |
|---|---|---|
| Argent | en €, peut être négatif (dettes) | Payer loyer et dépenses, investir. Dettes trop longues → événements de crise. |
| Santé | 0–100 | À 0 : mort. Baisse avec l'âge, le stress, les excès. |
| Moral | 0–100 | Bas : événements de déprime, moins bon au travail. |
| Réputation | 0–100 | Débloque des opportunités (business, influence, réseau). |
| Famille | 0–100 | Soutien en cas de coup dur, ou sollicitations. Influence la fin de vie. |

Chaque année, des dépenses fixes (loyer selon ville/quartier, vie courante) sont prélevées automatiquement.

### 5.4 Les actions de l'année
Chaque année, le joueur choisit **2 actions** parmi une liste d'environ 9 :
bosser plus · se former · chercher un (meilleur) job · lancer ou développer un business · sortir · faire du sport · voir la famille · investir · se reposer.

Certaines actions ne sont disponibles qu'à certaines conditions (âge, argent, carrière, réputation). Certaines déclenchent un **mini-jeu** (§6).

### 5.5 Les cartes événement
- Après les actions, **1 à 2 cartes événement** tombent.
- Chaque carte : un petit texte drôle, **2 ou 3 choix**, chacun avec des effets sur les jauges, parfois de l'aléatoire.
- Chaque carte a si possible un choix « raisonnable » et un choix **absurde**.
- Les cartes ont des **conditions** (ville, quartier, âge, carrière, jauges, événements passés). Elles peuvent poser des **marqueurs** qui déclenchent des **suites des années plus tard** (ex. : la console vendue 30 € au voisin à 22 ans, qu'il revend 8 000 € quand tu as 45 ans).
- Quelques **événements très rares** (1 vie sur plusieurs centaines) dont les joueurs parleront.

### 5.6 Les carrières
Environ 10 carrières avec 3 à 4 niveaux chacune (salaire, stress, réputation) :
étudiant · livreur · serveur/vendeur · employé de bureau · artisan · kebab / restauration · food truck · influenceur · start-up · immobilier · fonctionnaire.

### 5.7 Les grades
Calculés à partir de la richesse et de la réputation, ils évoluent pendant la vie :
**Galérien → Débrouillard → Petit patron → Boss → Légende.**
Chaque montée de grade est un moment de fête à l'écran (confettis, vibration).

### 5.8 Fin de vie et carte de vie
- La vie se termine par la mort (santé à 0 ou vieillesse). Le joueur peut aussi partir à la retraite pour finir plus tôt.
- La **carte de vie** est une image verticale (format story) avec : prénom, ville, âges, personnage vieilli, grade final, un **titre drôle** et une **phrase de fin** construits à partir des moments marquants de la vie (ex. : *« Morte riche à 71 ans, propriétaire de 3 food trucks, toujours fâchée avec son proprio »*), quelques stats, et les points rapportés à la ville.
- Boutons : partager (partage natif du téléphone), télécharger l'image, rejouer, **jouer mon enfant** (§7.3).
- Le lien partagé ouvre une page avec la carte et un bouton « Joue ta vie ».

## 6. Les mini-jeux

Principe commun : **20 à 30 secondes**, une seule main, liés à une action ou un métier, **le score change le résultat** (ex. : plus de livraisons = plus d'argent), **toujours facultatifs** (« passer » donne un résultat moyen). Fréquence : au plus un mini-jeu par année de vie, pour ne pas casser le rythme.

| Mini-jeu | Déclencheur | Principe | Effet |
|---|---|---|---|
| **La livraison** | métier livreur, action « bosser plus » | À vélo, esquiver trottinettes, piétons et nids-de-poule | Argent, santé |
| **Le rush de midi** | food truck, kebab, restauration | Préparer les commandes avant que les clients s'énervent | Argent, réputation |
| **La pétanque** | Marseille, action « sortir » | Viser le cochonnet | Moral, réputation |
| **Le métro à 8 h** | Paris, trajets / travail | Se glisser dans la rame avant la fermeture des portes | Moral, travail |
| **L'entretien d'embauche** | action « chercher un job » | Choisir vite la bonne réponse parmi des réponses pièges et drôles | Obtenir (ou non) le job |
| **Le marchandage** | brocante, loyer, achats, business | Arrêter une aiguille au bon moment pour négocier | Argent |

Chaque mini-jeu a **3 niveaux de difficulté** qui augmentent avec le niveau de carrière ou l'âge.

## 7. Faire revenir les joueurs

### 7.1 Le défi du jour
Chaque jour, une **vie de départ identique pour tous** (même ville, même famille, même suite d'événements, à partir d'une graine commune). Classement du jour et carte « J'ai fini Boss avec la vie du jour ». Une seule tentative classée par jour, rejouable hors classement.

### 7.2 L'album des fins
Environ **100 fins** à découvrir (type de mort, carrière, richesse, événements marquants), dont certaines très rares. L'album montre les fins trouvées et des silhouettes pour celles qui restent.

### 7.3 L'héritage
À la mort, le joueur peut **jouer son enfant** : il hérite d'une partie de l'argent, de la réputation et des dettes, et de quelques marqueurs (le nom de famille, une rancune, un commerce). Les cartes peuvent faire référence au parent.

### 7.4 Le défi entre potes
*(Choix du constructeur, presque gratuit une fois le défi du jour fait.)* Le joueur envoie sa vie par lien : « Fais mieux que moi avec la même vie. » L'ami joue la même graine ; les deux scores sont comparés.

### 7.5 Le classement Paris contre Marseille
- À la fin d'une vie, le joueur peut envoyer son score avec un **pseudo** (sans compte).
- **La ville qui mène cette semaine** (moyenne des meilleurs scores de chaque ville, pour que la ville la plus peuplée ne gagne pas automatiquement) et **le top 50 des joueurs** de la semaine. Remise à zéro chaque lundi.

### 7.6 Ce qu'on s'interdit
Pas de notifications répétées, pas de coffres-surprises payants, pas d'avantages payants dans le classement.

## 8. Le contenu et l'humour

- **Environ 220 cartes en V1** : ~120 communes à toute la France, ~50 propres à Paris, ~50 propres à Marseille. Plus les textes des ~100 fins et des mini-jeux.
- **Ressorts d'humour :** galères vécues poussées un cran plus loin ; un choix absurde à côté du choix raisonnable ; conséquences qui reviennent des années plus tard ; phrase de fin construite avec la vie du joueur ; clins d'œil gentils Paris contre Marseille.
- **Règles :** on rit des situations, jamais des gens ; pas d'humour lourd sur le sexe ou la drogue ; une carte se lit en 5 secondes.
- Les cartes sont rédigées comme des **données** (pas dans le code), pour en ajouter sans toucher au jeu.
- Relecture et tests par des joueurs de chaque ville ; les cartes qui ne font pas sourire sont réécrites ou retirées.

## 9. Plateformes

1. **Au lancement : le web.** Un lien qui marche sur iPhone, Android et ordinateur, installable sur l'écran d'accueil. Aucune validation de store, mises à jour immédiates, partage direct depuis TikTok.
2. **2 à 3 semaines après, si les chiffres sont bons : Google Play** (même jeu emballé en appli ; compte 25 $ une fois).
3. **Ensuite : App Store** (validation plus stricte ; compte 99 $/an ; construction de l'appli via des outils en ligne, sans Mac).
- La version web reste disponible même après les stores (paiements moins chers plus tard : ~2 % de frais contre 15 % de commission sur les stores pour un petit développeur).
- Option à étudier après le lancement : sites de jeux en ligne (ex. CrazyGames), en vérifiant leurs conditions d'exclusivité.

## 10. L'équilibrage

Un programme simule **des milliers de vies automatiques** (joueur prudent, risqué, au hasard ; mini-jeux réussis, ratés ou passés) pour vérifier :
- qu'une vie dure bien 50 à 65 tours en moyenne ;
- que chaque grade est atteignable, « Légende » étant rare (≈ 5 % des vies) ;
- qu'aucun choix ne gagne à tous les coups ;
- que peu de vies se terminent avant 30 ans ;
- que les mini-jeux comptent sans tout décider (passer un mini-jeu ne doit pas ruiner une vie).

## 11. Technique (choix du constructeur)

- Application web en **Next.js**, hébergée sur **Vercel**.
- **Supabase** (base de données) pour le classement, le défi du jour et les cartes de vie partagées.
- Partie, album des fins et héritage sauvegardés **dans le téléphone**.
- Les vies sont tirées d'une **graine** : la même graine donne la même vie (défi du jour, défi entre potes, tests d'équilibrage).
- Mini-jeux en dessin 2D léger dans le navigateur, sans moteur de jeu lourd.
- Installable sur l'écran d'accueil, jouable hors-ligne une fois chargée.
- Images des cartes de vie générées côté serveur pour les liens partagés.
- Mesure d'audience sans cookie.
- Protection minimale du classement : limite d'envois, rejet des scores impossibles.

## 12. Lancement et mesures

**Calendrier indicatif (après validation de cette fiche)**
1. Semaine 1 : le moteur du jeu (jauges, actions, cartes, carrières, grades, sauvegarde) et les écrans de la maquette.
2. Semaine 2 : le contenu (cartes, fins), l'équilibrage, l'album des fins, l'héritage, le défi du jour et le défi entre potes.
3. Semaine 3 : les mini-jeux livraison, rush de midi et pétanque.
4. Semaine 4 : les mini-jeux métro, entretien d'embauche et marchandage ; la carte de vie partageable et le classement.
5. Semaine 5 : tests avec 20 à 30 joueurs par ville, corrections, puis lancement (vidéos TikTok, partages, petits créateurs).

**Rôle du porteur du projet :** trouver les testeurs à Paris et à Marseille, valider l'humour, proposer des galères vécues, publier les premières vidéos.

**Indicateurs suivis :**
- part des joueurs qui reviennent le lendemain ;
- nombre de vies jouées par joueur ;
- part des vies terminées qui sont partagées ;
- part des joueurs qui font le défi du jour ;
- mini-jeux joués ou passés.

**Seuil de décision** (deux semaines après le lancement) : si moins de 20 % des joueurs reviennent le lendemain **et** moins de 5 % des vies sont partagées, on revoit le jeu en profondeur avant d'investir plus. Au-dessus, on prépare Google Play, la monétisation et les nouvelles villes.

## 13. Laissé au constructeur

- L'écriture des cartes, des fins et des textes des mini-jeux (dans le cadre du ton défini).
- Les chiffres précis (salaires, loyers, effets, difficulté des mini-jeux), réglés par l'équilibrage.
- La direction visuelle, dans l'esprit de la maquette : simple, colorée, lisible.
- Les noms de quartiers proposés au départ.

## 14. Choix faits par le constructeur (à vérifier)

1. Un tour = une année (et non une journée).
2. 2 actions par an, 1 à 2 événements, au plus un mini-jeu par an.
3. Pas de paiements ni de comptes en V1 : on mesure d'abord si le jeu plaît.
4. Départ tiré au hasard (famille modeste / moyenne / aisée).
5. Classement ville contre ville basé sur la moyenne des meilleurs scores.
6. Pas de marques, clubs ou personnes réelles nommés.
7. Défi entre potes ajouté (il réutilise le défi du jour).
8. Défi du jour : une seule tentative classée par jour.
9. Seuil de décision : 20 % de retour le lendemain, 5 % de partage.
