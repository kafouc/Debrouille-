# La Débrouille — fiche du jeu (design)

*Version 1 — 21 novembre 2026 — statut : à valider*

## 1. L'idée et pourquoi

**La Débrouille** est un simulateur de vie humoristique qui se passe en France. Le joueur part de rien à 18 ans, enchaîne galères et opportunités, et essaie de devenir « Légende » avant la fin de sa vie. Il joue sur son téléphone, dans le navigateur, sans rien installer.

**Pourquoi maintenant :** *Lagos Life*, un simulateur de vie nigérian jouable dans le navigateur, a dépassé le million de joueurs quelques jours après sa sortie (1er octobre 2026). Des imitations sont déjà apparues au Nigeria. Nous n'avons rien trouvé d'équivalent en français. La fenêtre est ouverte, mais elle va se refermer.

**Pourquoi ça peut marcher en France :** les galères du quotidien (loyer, RER, CAF, Parcoursup, patron, coloc) sont un sujet d'humour partagé par toute une génération. La rivalité Paris–Marseille donne une raison de jouer et de partager.

**Objectif business :** gagner une audience rapidement en France à coût quasi nul, puis la monétiser (achats dans le jeu, pubs choisies) une fois que l'on a vérifié que les joueurs reviennent.

**Ce n'est pas une copie** de Lagos Life : univers, villes, règles, textes et visuels sont originaux.

## 2. Objectifs, non-objectifs, anti-objectifs

**Objectifs de la V1**
- Un jeu complet et drôle, jouable en entier sur mobile, sorti environ 3 semaines après validation de cette fiche.
- Une partie (une vie) dure **10 à 15 minutes** : assez court pour rejouer, assez long pour s'attacher.
- Chaque vie se termine par une **carte de vie** partageable (image + lien) sur TikTok, Snapchat, Instagram et WhatsApp.
- Un **classement Paris contre Marseille** chaque semaine.
- Mesurer : combien reviennent le lendemain, combien de parties par joueur, combien partagent.

**Non-objectifs de la V1** (prévus plus tard)
- Paiements et achats dans le jeu.
- Comptes utilisateurs, connexion.
- Multijoueur en temps réel, interactions entre joueurs.
- Autres villes (Lyon, Lille, Toulouse…).
- Applications Android et iOS sur les stores.
- Afrique, autres pays.

**Anti-objectifs** (ce qui ferait de la V1 un échec même si elle « marche »)
- De l'humour qui se moque d'un groupe de personnes (origine, religion, quartier, handicap…) ou qui enchaîne les clichés.
- Une partie trop longue ou ennuyeuse au milieu : on doit avoir envie de voir la fin.
- Un jeu qu'on peut « casser » (devenir milliardaire en 5 tours, mourir à chaque fois à 25 ans).
- Un jeu lourd qui rame sur un petit téléphone ou en 4G moyenne.
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

**Choix :** A. Les applis store (B) viendront quand le jeu aura prouvé qu'il plaît, en réutilisant le même jeu. Le multijoueur (C) est une piste pour la V2.

## 5. Le jeu

### 5.1 Début de partie
- Le joueur choisit un **prénom** (affiché sur la carte de vie), sa **ville** (Paris ou Marseille) et un **quartier** parmi une courte liste par ville (quartiers réels, présentés sans cliché ; ils changent quelques événements et le loyer de départ).
- Le **point de départ** est tiré au hasard : famille modeste, moyenne ou aisée. Ça change l'argent et le soutien familial de départ. Ça montre que tout le monde ne part pas avec les mêmes cartes, et ça rend chaque vie différente.
- Le joueur commence à **18 ans**.

### 5.2 Le temps
- **Un tour = une année** de la vie (18 ans → mort). Une vie fait environ 50 à 65 tours, soit 10 à 15 minutes.
- *(Changement par rapport à l'idée de départ « un tour = une journée » : une journée par tour donnerait des vies interminables. Une année par tour permet de voir toute une vie et d'arriver à la carte de vie, ce qui est le moteur du partage.)*

### 5.3 Les jauges
| Jauge | Plage | Rôle |
|---|---|---|
| 💰 Argent | en €, peut être négatif (dettes) | Payer loyer et dépenses, investir. Dettes trop longues → événements de crise. |
| ❤️ Santé | 0–100 | À 0 : mort. Baisse avec l'âge, le stress, les excès. |
| 😊 Moral | 0–100 | Bas : événements de déprime, moins bon au travail. |
| ⭐ Réputation | 0–100 | Débloque des opportunités (business, influence, réseau). |
| 👨‍👩‍👧 Famille | 0–100 | Soutien en cas de coup dur, ou sollicitations. Influence la fin de vie. |

Chaque année, des dépenses fixes (loyer selon ville/quartier, vie courante) sont prélevées automatiquement.

### 5.4 Les actions de l'année
Chaque année, le joueur choisit **2 actions** parmi une liste d'environ 9 :
travailler plus · se former / étudier · chercher un (meilleur) job · lancer ou développer un business · sortir / vie sociale · sport et santé · s'occuper de la famille · investir · se reposer.

Certaines actions ne sont disponibles qu'à certaines conditions (âge, argent, carrière, réputation).

### 5.5 Les cartes événement
- Après les actions, **1 à 2 cartes événement** tombent.
- Chaque carte : un petit texte drôle, **2 ou 3 choix**, chacun avec des effets sur les jauges, parfois de l'aléatoire (« 50 % de chances que… »).
- Les cartes ont des **conditions** (ville, quartier, âge, carrière, jauges, événements passés). Elles peuvent poser des **marqueurs** qui déclenchent des suites plus tard (ex. : un associé louche revient 5 ans après).
- Exemple : *« Ton proprio augmente le loyer de 80 €. »* → Tu paies / Tu cherches une coloc / Tu lui envoies un recommandé avec la loi en pièce jointe.

### 5.6 Les carrières
Environ 10 carrières avec 3 à 4 niveaux chacune (salaire, stress, réputation) :
étudiant · livreur · serveur/vendeur · employé de bureau · artisan · kebab / restauration · food truck · influenceur · start-up · immobilier · fonctionnaire.

On change de carrière via les actions et les événements.

### 5.7 Les grades
Calculés à partir de la richesse et de la réputation, ils évoluent pendant la vie :
**Galérien → Débrouillard → Petit patron → Boss → Légende.**
Chaque montée de grade est un petit moment de fête à l'écran.

### 5.8 Fin de vie et carte de vie
- La vie se termine par la mort (santé à 0 ou vieillesse). Le joueur peut aussi partir à la retraite pour finir plus tôt.
- La **carte de vie** est une image verticale (format story) avec : prénom, ville, âge au décès, grade final, un **titre drôle** et une **épitaphe** construits à partir de ce qui s'est passé dans la vie (ex. : *« Mort riche à 71 ans, propriétaire de 3 food trucks, toujours fâché avec son proprio »*), et le score.
- Boutons : partager (partage natif du téléphone), télécharger l'image, rejouer.
- Le lien partagé ouvre une page avec la carte et un bouton « Joue ta vie ».

### 5.9 Classement Paris contre Marseille
- À la fin d'une vie, le joueur peut envoyer son score au classement avec un **pseudo** (sans compte).
- Deux vues : **la ville qui mène cette semaine** (moyenne des meilleurs scores de chaque ville, pour que la ville la plus peuplée ne gagne pas automatiquement) et **le top 50 des joueurs** de la semaine.
- Remise à zéro chaque lundi.

## 6. Le contenu

- **Environ 220 cartes en V1** : ~120 communes à toute la France, ~50 propres à Paris, ~50 propres à Marseille (expressions, lieux, galères locales).
- Ton : humour bienveillant, autodérision, situations vécues. On rit des situations, pas des gens.
- Les cartes sont rédigées comme des **données** (pas dans le code), pour pouvoir en ajouter sans toucher au jeu.
- Relecture par des joueurs de chaque ville avant la sortie (voir §9).

## 7. L'équilibrage

- Un programme simule **des milliers de vies automatiques** avec des joueurs fictifs (prudent, risqué, au hasard) pour vérifier :
  - qu'une vie dure bien 50 à 65 tours en moyenne ;
  - que chaque grade est atteignable, « Légende » étant rare (≈ 5 % des vies) ;
  - qu'aucun choix ne gagne à tous les coups ;
  - que peu de vies se terminent avant 30 ans.

## 8. Technique (choix du constructeur)

- Application web en **Next.js**, hébergée sur **Vercel**.
- **Supabase** (base de données) uniquement pour le classement et les cartes de vie partagées.
- Partie sauvegardée **dans le téléphone** (on peut fermer et reprendre).
- Installable sur l'écran d'accueil, jouable hors-ligne une fois chargée.
- Images des cartes de vie générées côté serveur pour les liens partagés.
- Mesure d'audience sans cookie.
- Protection minimale du classement : limite d'envois, rejet des scores impossibles.

## 9. Lancement et mesures

**Calendrier indicatif (après validation de cette fiche)**
1. Semaine 1 : version jouable avec les règles et une première série de cartes.
2. Semaine 2 : tout le contenu, l'équilibrage, la carte de vie et le classement ; tests avec 20 à 30 joueurs par ville.
3. Semaine 3 : corrections, puis lancement (vidéos TikTok, partages, petits créateurs).

**Rôle du porteur du projet :** trouver les testeurs à Paris et à Marseille, valider l'humour, publier les premières vidéos.

**Indicateurs suivis :**
- part des joueurs qui reviennent le lendemain ;
- nombre de vies jouées par joueur ;
- part des vies terminées qui sont partagées.

**Seuil de décision** (deux semaines après le lancement) : si moins de 20 % des joueurs reviennent le lendemain **et** moins de 5 % des vies sont partagées, on revoit le jeu en profondeur avant d'investir plus. Au-dessus, on prépare la monétisation et les nouvelles villes.

## 10. Laissé au constructeur

- L'écriture des cartes (dans le cadre du ton défini).
- Les chiffres précis (salaires, loyers, effets des cartes), réglés par l'équilibrage.
- La direction visuelle : simple, colorée, lisible, sans dessins complexes.
- Les noms de quartiers proposés au départ.

## 11. Choix faits par le constructeur (à vérifier)

1. Un tour = une année (et non une journée).
2. 2 actions par an, 1 à 2 événements.
3. Pas de paiements ni de comptes en V1 : on mesure d'abord si le jeu plaît.
4. Départ tiré au hasard (famille modeste / moyenne / aisée).
5. Classement ville contre ville basé sur la moyenne des meilleurs scores.
6. Pas de marques, clubs ou personnes réelles nommés.
7. Seuil de décision : 20 % de retour le lendemain, 5 % de partage.
