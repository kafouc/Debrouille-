# La Débrouille — fiche du jeu (design)

*Version 3 — 25 novembre 2026 — statut : à valider*

*Changements depuis la version 2 : les cas de la vie (couple, enfants, logement, voiture, santé, travail, retraite) ; « ton année en scène » (animation des actions, saisons, bilan de fin d'année) ; 32 mini-jeux au lieu de 6, sortis en 4 vagues de 8 ; objectif de difficulté chiffré ; calendrier revu. La version 1 du jeu (moteur, 31 cartes, écrans) est en ligne.*

*Changements de la version 2 : défi du jour, album des fins, héritage, défi entre potes ; règles d'humour ; plateformes.*

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
- **Une vie qui change** : couple, enfants, logement, voiture, santé, travail, retraite (§5.9).
- **Des actions qu'on voit** : chaque action est jouée en petite scène animée, l'année défile en saisons et se termine par un bilan (§5.10).
- **32 mini-jeux** courts intégrés à la vie (§6), dont 8 au lancement et les autres en vagues.
- Un jeu qui reste un **défi** (§10).
- Mesurer : combien reviennent le lendemain, combien de parties par joueur, combien partagent.

**Non-objectifs de la V1** (prévus plus tard)
- Paiements et achats dans le jeu.
- Comptes utilisateurs, connexion.
- Les vagues 2 à 4 de mini-jeux : ajoutées après le lancement, une par semaine environ, pour donner des nouveautés.
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

### 5.9 Les cas de la vie
Le personnage a une **situation** qui évolue au fil des événements et s'affiche en petites icônes sous son nom (ex. : « en couple · 2 enfants · propriétaire ») :

| Domaine | États possibles | Comment ça change | Ce que ça coûte ou rapporte |
|---|---|---|---|
| Amour | célibataire · en couple · marié(e) · séparé(e) · veuf(ve) | rencontres (soirée, travail, appli, voisin), demande en mariage, disputes, rupture | moral, famille ; mariage = dépense ; séparation = argent et moral en baisse |
| Enfants | aucun, puis chaque enfant avec son âge (bébé, enfant, ado, adulte) | naissance possible en couple entre 22 et 45 ans ; les enfants grandissent d'un an par tour | ~4 000 €/an par enfant mineur ; famille en hausse ; événements d'enfants selon l'âge |
| Logement | chez les parents (option de départ) · locataire · coloc · propriétaire | déménagement, coloc, crédit pour acheter | loyer ou mensualité de crédit ; propriétaire : plus de loyer une fois le crédit fini |
| Voiture | aucune · voiture | achat, panne, accident, revente | achat + ~1 800 €/an d'entretien ; débloque des événements et mini-jeux |
| Santé | en forme · blessure · maladie | accidents, excès, âge ; soins | santé, argent, moral |
| Travail | en poste · au chômage · en reconversion · à la retraite | licenciement, burn-out, reconversion (formation), retraite possible à partir de 62 ans | chômage : ~60 % du salaire pendant 2 ans ; retraite : ~50 % du dernier salaire |

Les événements et les mini-jeux peuvent dépendre de cette situation (ex. : « la rando avec les enfants » seulement avec un enfant de 6 à 14 ans).

### 5.10 Ton année en scène
1. **Les actions sont jouées en scène** : après « Vivre cette année », chaque action s'anime 2 à 3 secondes avec le personnage dans son décor (il pédale, court, danse, dîne en famille, dort, ouvre son food truck…). Les effets s'envolent au-dessus de lui (« +6 santé », « −400 € ») et les jauges bougent en direct. On peut toucher l'écran pour accélérer.
2. **L'année défile en saisons** : chaque événement est rattaché à une saison (hiver, printemps, été, automne), affichée en haut de la carte. Certaines cartes n'existent qu'à une saison (soldes en janvier, vacances en été, rentrée en septembre, Noël en hiver).
3. **Le bilan de fin d'année** : gâteau d'anniversaire avec le nouvel âge, puis le détail de l'argent de l'année (salaire, loyer ou crédit, vie courante, enfants, voiture, chômage ou retraite) et le total. Si la vie se termine, le bilan laisse place à la carte de vie.
4. Respect de « réduire les animations » sur le téléphone : les scènes deviennent des images fixes.

### 5.11 Les cinématiques des grands moments
Les moments forts de la vie ont leur propre cinématique de 4 à 6 secondes, avec une phrase drôle, une vibration et un son court. On peut toujours toucher pour passer. Chacune se déclenche une seule fois par vie (sauf la montée de grade).

| Cinématique | Quand | Ce qu'on voit |
|---|---|---|
| Le départ du nid | début de la vie, ou départ de chez les parents | Le perso part avec ses cartons, un carton tombe, sa mère pleure à la fenêtre (avec un tupperware). |
| Le premier salaire | premier vrai job | Le salaire tombe sur le compte… puis le loyer, les courses et l'abonnement repartent aussitôt. |
| Le coup de foudre | début d'une relation | Un regard au parc, des cœurs s'envolent, un pigeon atterrit entre les deux. |
| Le mariage | mariage | Arche de fleurs, confettis ; tonton danse avant que la musique commence. |
| Le bébé | naissance d'un enfant | Un berceau, des pleurs à 3 h du matin, le perso tient debout grâce au café. |
| La crémaillère | achat d'un logement | Les clés, la porte qui s'ouvre, un meuble en kit qui s'effondre. |
| La promotion / montée de grade | montée de grade ou de carrière | Le perso sur un podium sous un projecteur, avec un trophée et des étincelles. |
| La galère | chômage, faillite, grosse dette | Un nuage de pluie qui suit le perso partout ; il sort un parapluie… troué. |
| La retraite | départ à la retraite | Le perso jette son réveil, s'installe dans un hamac au coucher du soleil. |
| La vie qui défile | fin de vie, juste avant la carte de vie | Des photos de la vie du perso glissent à l'écran (18 ans, premier job, mariage…), construites avec ses vrais moments marquants. |

## 6. Les mini-jeux

Principe commun : **20 à 30 secondes**, une seule main, liés à une action, un métier, un lieu ou une situation de vie, **le score change le résultat** (ex. : plus de livraisons = plus d'argent), **toujours facultatifs** (« passer » donne un résultat moyen). Chaque mini-jeu se termine par un **résultat drôle** (ex. : « Tu as pêché une trottinette »). Fréquence : au plus un mini-jeu par année de vie, en évitant de reproposer le même deux années de suite. Chaque mini-jeu a **3 niveaux de difficulté** selon l'âge ou le niveau de carrière.

Tous les mini-jeux reposent sur une **base commune** : écran d'intro (titre, consigne en une phrase, bouton « passer »), chrono, score, écran de résultat avec effets sur les jauges.

**32 mini-jeux, en 4 vagues de 8 :**

**Vague 1 — au lancement**
| Mini-jeu | Quand | Principe et côté drôle |
|---|---|---|
| La livraison | livreur, « bosser plus » | À vélo, esquiver trottinettes, piétons et nids-de-poule. |
| Le rush de midi | food truck, kebab, restauration | Préparer les commandes avant que les clients s'énervent. |
| La pétanque | Marseille, « sortir » | Viser le cochonnet ; perdre 13-0 = embrasser la Fanny. |
| Le métro à 8 h | Paris, travail | Se glisser dans la rame avant la fermeture des portes. |
| La pêche | « sortir », « se reposer » ; port ou calanques à Marseille, quais à Paris | Ferrer pile quand le bouchon plonge ; on peut remonter une chaussure, une trottinette ou le poisson « gros comme une voiture ». |
| La mouette voleuse (Marseille) / le pigeon du parc (Paris) | pause déjeuner, plage, parc | Protéger son sandwich en tapant sur les oiseaux. |
| L'entretien d'embauche | « chercher un job » | Choisir vite la bonne réponse parmi des réponses pièges. |
| La caisse | vendeur, caisse | Rendre la monnaie juste, le plus vite possible. |

**Vague 2 — le quotidien**
| Mini-jeu | Quand | Principe et côté drôle |
|---|---|---|
| Le marchandage | brocante, loyer, achats | Arrêter une aiguille au bon moment pour négocier. |
| Le tri du courrier | à partir de 20 ans | Glisser chaque lettre vers la bonne pile (CAF, impôts, pub, facture). |
| Le barbecue de tonton | été, famille | Retourner les saucisses au bon moment ; tonton commente chaque erreur. |
| La sieste au bureau | employé de bureau, fonctionnaire | Dormir quand le chef regarde ailleurs, se réveiller quand il se retourne. |
| Les courses de dernière minute | n'importe quand | Remplir le caddie avec la liste avant la fermeture. |
| Le permis de conduire | 18–30 ans, achat de voiture | Passer les vitesses et freiner au bon moment ; l'examinateur soupire. |
| Les soldes | janvier ou juillet | Attraper les articles en promo avant les autres clients. |
| Le foot à 5 | « sortir », « faire du sport » | Viser la lucarne au bon moment ; le gardien adverse est ton patron. |

**Vague 3 — l'amour et les grandes étapes**
| Mini-jeu | Quand | Principe et côté drôle |
|---|---|---|
| Le speed-dating | célibataire, 20–50 ans | Choisir la bonne réplique en 5 secondes. |
| La fête foraine en couple | en couple | Chamboule-tout, pêche aux canards, tir : gagner la peluche géante… puis rentrer avec dans le métro. |
| Le dîner chez les beaux-parents | en couple | Répondre aux questions pièges sans gaffer avant que la jauge de malaise explose. |
| Le karaoké du mariage | mariage (le tien ou celui d'un proche) | Taper en rythme pour sauver la fête. |
| Le bouquet de la mariée | mariage d'un proche, célibataire | Attraper le bouquet au vol sans bousculer mamie. |
| Le déménagement | changement de logement | Faire rentrer tous les meubles dans la camionnette. |
| Le meuble en kit | emménagement | Remettre les étapes de montage dans l'ordre avant la crise de nerfs. |
| La photo de famille | fêtes de famille | Déclencher quand tout le monde sourit et que tonton a les yeux ouverts. |

**Vague 4 — les enfants, la ville et la retraite**
| Mini-jeu | Quand | Principe et côté drôle |
|---|---|---|
| Le bébé à 3 h du matin | enfant de 0 à 2 ans | Deviner ce qu'il veut (biberon, couche, câlin, chanson) avant que les voisins tapent au mur. |
| La rando avec les enfants | enfant de 6 à 14 ans | Éviter flaques et ronces en répondant vite aux « J'ai faim ! », « On arrive quand ? », « Porte-moi ! ». |
| Les devoirs des enfants | enfant de 8 à 16 ans | Résoudre l'exercice de maths… que tu ne sais plus faire. |
| La place de parking | Marseille, avec une voiture | Un créneau au millimètre entre un scooter et une voiture en double file. |
| La plage bondée | été | Trouver une place pour ta serviette avant que le sable brûle. |
| La course sous la pluie | automne, Paris | Courir d'abri en abri sans être trempé. |
| La file d'attente au guichet | démarches administratives | Garder sa place sans se faire doubler. |
| Le potager de la retraite | retraité | Arroser et récolter au bon moment ; les limaces sont tes ennemies. |

Les mini-jeux ne dépendant pas d'une situation de vie (vague 1, une partie de la vague 2) peuvent sortir avant les cas de la vie ; ceux des vagues 3 et 4 en ont besoin.

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

Constat de la V1 en ligne : en jouant au hasard, 92 % des vies finissent Boss. Le jeu est trop facile, car l'argent s'accumule sans vraies dépenses ni crises. Les cas de la vie (§5.9) ajoutent les dépenses et les coups durs qui manquent.

Objectif pour un joueur qui joue **au hasard** : environ 25 % Galérien, 35 % Débrouillard, 25 % Petit patron, 12 % Boss, 3 % Légende. Un joueur qui fait de bons choix doit nettement mieux s'en sortir.

Un programme simule **des milliers de vies automatiques** (joueur prudent, risqué, au hasard ; mini-jeux réussis, ratés ou passés) pour vérifier :
- qu'une vie dure bien 50 à 65 tours en moyenne ;
- que la répartition des grades est proche de l'objectif ci-dessus ;
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

**Calendrier indicatif**
1. ✅ Fait : le moteur du jeu, 31 cartes, les écrans, la sauvegarde, la mise en ligne.
2. Les cas de la vie, ton année en scène (scènes d'actions, saisons, bilan), les cinématiques des grands moments, ~220 cartes, ~100 fins, l'équilibrage : environ 2 semaines.
3. La base des mini-jeux et la vague 1 (8 mini-jeux) : environ 1 semaine et demie.
4. L'album des fins, l'héritage, le défi du jour, le défi entre potes, le classement, la carte de vie partageable : environ 1 semaine et demie.
5. Tests avec 20 à 30 joueurs par ville, corrections, puis lancement (vidéos TikTok, partages, petits créateurs).
6. Après le lancement : les vagues 2, 3 et 4 de mini-jeux, environ une par semaine.

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
10. Les 10 mini-jeux en plus des 22 demandés (permis, soldes, foot à 5, speed-dating, bouquet de la mariée, déménagement, photo de famille, devoirs des enfants, plage bondée, course sous la pluie, file d'attente, potager… pour arriver à 32) et leur répartition en vagues.
11. Les chiffres des cas de la vie (coût d'un enfant, chômage, retraite, voiture) : valeurs de départ, réglées par l'équilibrage.
12. Objectif de répartition des grades en jeu au hasard (25/35/25/12/3 %).
13. La liste des 10 cinématiques (§5.11) et leurs déclencheurs.
