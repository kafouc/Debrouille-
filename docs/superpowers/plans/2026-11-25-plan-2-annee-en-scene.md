# La Débrouille — Plan 2 : l'année en scène, les cinématiques et la pêche

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre dans le vrai jeu ce que montrent les écrans 6 à 9 de la maquette : chaque action jouée en scène, les saisons, le bilan de fin d'année, les cinématiques des grands moments et le mini-jeu de la pêche, avec le minimum de « cas de la vie » qu'il faut pour les déclencher (couple, enfants, retraite).

**Architecture:** Le moteur (`src/engine/`) gagne de nouvelles phases (`scene`, `minigame`, `summary`), un livre de comptes de l'année, une situation de vie et une file de cinématiques ; il reste pur et testé. Les mini-jeux vivent dans `src/minigames/` (un registre + un composant par jeu) ; le moteur ne connaît que leur identifiant et le résultat qu'on lui rend. Les scènes et cinématiques sont des composants SVG + CSS dans `src/components/`.

**Tech Stack:** inchangée (Next.js 16, Vitest 5, Playwright 1.63).

**Spec:** `docs/superpowers/specs/2026-11-21-la-debrouille-design.md` (v3, §5.9 à §5.11, §6). Maquette : https://claude.ai/artifact/VtY4SfTiFbxKZY2coTWsbN (écrans 6 à 9).

## Global Constraints

- Contraintes du plan 1 inchangées (français, 360 px, cibles ≥ 44 px, couleurs, polices, pas de marque).
- Toute animation respecte `prefers-reduced-motion` (image fixe) et peut être passée d'une touche.
- Le moteur reste déterministe à graine égale ; seul le mini-jeu (adresse du joueur) utilise un hasard non reproductible, côté écran.
- Les anciennes sauvegardes (version 1) restent jouables : elles sont migrées, pas effacées.

## Hors de ce plan (plans suivants)

Logement, voiture, santé et chômage détaillés ; les 220 cartes ; l'équilibrage chiffré ; les 31 autres mini-jeux ; la cinématique « crémaillère » (elle dépend du logement).

## Review Focus

1. **Sauvegarde version 1** d'un joueur de la V1 → migrée, la partie continue (Task 1).
2. **Recharger la page pendant une scène, un mini-jeu, un bilan ou une cinématique** → on retrouve le même écran (Task 9).
3. **Double tap** sur « Continuer », « Année suivante », « Passer » → appliqué une fois (Tasks 2, 4).
4. **Mini-jeu qui renvoie des effets aberrants** (argent énorme, jauges ±100) → bornés par le moteur (Task 4).
5. **Une vie qui se termine pendant l'année** → pas de bilan, la vie qui défile puis la carte de vie (Tasks 2, 7).

---

### Task 1: Situation de vie, sauvegarde v2

**Files:** Modify `src/engine/types.ts`, `src/engine/life.ts`, `src/lib/save.ts` ; Test `src/lib/save.test.ts`, `src/engine/life.test.ts`

**Interfaces — Produces:**
- `LifeState.version: 2` et nouveaux champs : `relation: "celibataire" | "couple" | "marie"`, `childrenAges: number[]`, `retired: boolean`, `pension: number`, `season: Season | null`, `yearActions: ActionReplay[]`, `ledger: LedgerLine[]`, `lastYear: YearSummary | null`, `cinematics: CinematicId[]`, `milestones: { age: number; label: string }[]`, `minigame: MinigameId | null`, `lastMinigameAge: number | null`, `hadCrisis: boolean`.
- `type Season = "hiver" | "printemps" | "ete" | "automne"` ; `type CinematicId = "depart" | "premier-salaire" | "coup-de-foudre" | "mariage" | "bebe" | "promotion" | "galere" | "retraite" | "vie-qui-defile"` ; `type MinigameId = "peche"`.
- `interface ActionReplay { id: ActionId; text: string; effects: Effects }` ; `interface LedgerLine { label: string; amount: number }` ; `interface YearSummary { age: number; lines: LedgerLine[]; total: number }`.
- `newLife` : `relation "celibataire"`, `childrenAges []`, `cinematics ["depart"]`, `milestones [{ age: 18, label: "18 ans" }]`.
- `loadLife` accepte `version 1` et la migre (valeurs par défaut ci-dessus, `cinematics []`, phase conservée) ; sauvegarde toujours en `version 2`.

- [ ] Tests : nouvelle vie → `cinematics` = `["depart"]` ; une sauvegarde v1 (objet du plan 1) se charge avec `version 2`, `relation "celibataire"`, `childrenAges []` ; une v0 → `null`.
- [ ] Implémenter, `npm test` vert, commit `feat(moteur): situation de vie et sauvegarde v2`.

### Task 2: Phases scène et bilan, livre de comptes, saisons

**Files:** Modify `src/engine/actions.ts`, `src/engine/turn.ts`, `src/engine/year.ts` ; Test `src/engine/turn.test.ts`, `src/engine/simulate.test.ts`

**Règles :**
- `chooseActions` : après les actions, phase `scene` ; `yearActions` contient les 2 actions avec leur texte et leurs effets réels (différence des jauges) ; `ledger` repart à zéro et reçoit une ligne par action qui change l'argent (libellé = libellé de l'action).
- `continueTurn` en phase `scene` → mini-jeu si prévu (Task 4), sinon premier événement, sinon fin d'année.
- Quand un événement devient courant : `season` = `card.season` si la carte en a une, sinon tirée au hasard ; les événements de l'année sont présentés dans l'ordre hiver → automne.
- Les effets d'argent des résultats d'événements s'ajoutent au livre de comptes sous « Événements » (une seule ligne cumulée).
- `endYear` : ajoute les lignes « Salaire » (ou « Retraite »), « Loyer », « Vie courante », « Enfants » (si enfants mineurs, 4 000 € par enfant de moins de 18 ans), vieillit les enfants d'un an ; puis phase `summary` avec `lastYear = { age, lines, total }` — ou `dead` (pas de bilan, cinématique `vie-qui-defile`).
- `continueTurn` en phase `summary` → phase `actions`. Toute fonction appelée dans une autre phase renvoie l'état inchangé.

- [ ] Tests : après `chooseActions` → phase `scene` et 2 `yearActions` ; `continueTurn` deux fois en `scene` ne saute pas d'étape ; un livreur à Paris 18e sans événement → `lastYear.lines` contient Salaire +13 800, Loyer −7 800, Vie courante −6 600 et `total` = somme des lignes ; un couple avec deux enfants de 3 et 19 ans → ligne Enfants −4 000 et enfants à 4 et 20 ans ; mort en fin d'année → phase `dead`, pas de `lastYear` nouveau, `cinematics` finit par `vie-qui-defile`. Mettre à jour la simulation (300 vies) pour les nouvelles phases.
- [ ] Implémenter, `npm test` vert, commit `feat(moteur): scène, saisons et bilan de l'année`.

### Task 3: Cas de la vie et cinématiques

**Files:** Modify `src/content/schema.ts`, `src/engine/turn.ts`, `src/engine/actions.ts`, `src/content/actions.ts` ; Create `src/content/events/vie.ts`, `src/engine/cinematics.ts` ; Test `src/engine/vie.test.ts`, `src/content/content.test.ts`

**Interfaces:**
- `Outcome.life?: "couple" | "mariage" | "bebe" | "rupture"` ; `Conditions.relations?: Relation[]`, `Conditions.minChildren?`, `Conditions.maxChildren?`, `Conditions.childAge?: [number, number]` (au moins un enfant dans l'intervalle) ; `EventCard.season?: Season`.
- `queueCinematics(before: LifeState, after: LifeState): LifeState` (dans `cinematics.ts`) appelée par chaque fonction publique du moteur ; elle ajoute : `promotion` si le grade monte, `premier-salaire` si la carrière quitte `etudiant` pour la première fois, `galere` la première fois que l'argent passe sous −5 000 € (`hadCrisis`).
- `ackCinematic(state): LifeState` retire la première cinématique de la file.
- Effets de vie : `couple` → relation `couple`, cinématique `coup-de-foudre`, jalon « Coup de foudre » ; `mariage` → `marie`, `mariage`, jalon « Le mariage », argent −4 000 ; `bebe` → ajoute un enfant de 0 an, `bebe`, jalon « Bébé ! » ; `rupture` → `celibataire`, moral −15.
- Nouvelle action `retraite` « Partir à la retraite » / « adieu le réveil », disponible à partir de 62 ans si pas retraité : `retired`, `pension` = 50 % du dernier salaire, cinématique `retraite`, jalon « La retraite ». Le salaire de fin d'année devient la pension.
- Cartes de `vie.ts` (12 minimum) : `rencontre-parc` (célibataire, 20–50 ans, issue `couple`), `rencontre-appli` (célibataire), `demande-en-mariage` (couple), `projet-bebe` (couple ou marié, 22–45 ans, moins de 3 enfants, issue `bebe`), `dispute-vaisselle` (en couple, peut mener à `rupture`), `enfant-dessin-mur` (enfant 3–8 ans), `enfant-ado-telephone` (enfant 12–17 ans), `soldes` (hiver), `vacances-ete` (été), `rentree` (automne), `noel-belle-famille` (hiver, en couple), `jardinage-printemps` (printemps).

- [ ] Tests : une issue `couple` met la relation et la cinématique ; `projet-bebe` n'est jamais tiré pour un célibataire ; `retraite` absente à 61 ans, présente à 62 ; un grade qui monte ajoute `promotion` ; `galere` n'est ajoutée qu'une fois ; contenu : au moins 12 cartes de vie et 4 cartes de saison.
- [ ] Implémenter, `npm test` vert, commit `feat(moteur): cas de la vie et cinématiques`.

### Task 4: Mini-jeux dans le moteur

**Files:** Create `src/engine/minigames.ts` ; Modify `src/engine/turn.ts` ; Test `src/engine/minigames.test.ts`

**Règles :** dans `chooseActions`, si une action est `sortir` ou `repos`, que `lastMinigameAge` n'est pas l'âge précédent et que `rng.next() < 0.35`, alors `minigame = "peche"`. `continueTurn` en `scene` → phase `minigame` dans ce cas. `finishMinigame(state, result: { effects: Effects; text: string } | null): LifeState` (phase `minigame` seulement) : `null` = passé → moral +2 ; effets bornés à ±15 par jauge et ±1 000 € ; ligne « Mini-jeu » dans le livre si l'argent change ; `lastMinigameAge` = âge ; enchaîne sur les événements.

- [ ] Tests : sur 200 graines avec « sortir », la pêche apparaît au moins une fois et jamais deux années de suite ; `finishMinigame` avec `{ morale: 80, money: 999999 }` applique +15 et +1 000 ; double appel → inchangé.
- [ ] Implémenter, `npm test` vert, commit `feat(moteur): mini-jeux`.

### Task 5: La scène des actions (écran)

**Files:** Create `src/components/ActionScene.tsx`, `src/components/scene.css` ; Modify `src/app/jouer/Game.tsx`

Reprend l'écran « 6 · Ton année en scène » : les 2 actions l'une après l'autre (2,5 s chacune), le perso animé dans son décor avec un accessoire par action (vélo ou sacoche pour bosser, livre, CV, camion, notes de musique, baskets, cœur, graphique, « Zzz », hamac), les effets qui s'envolent, la phrase de l'action, « Action n/2 », bouton « Continuer » et toucher pour accélérer.

- [ ] Test e2e : après « Vivre cette année », le texte « Action 1/2 » est visible puis « Continuer » mène à un événement, un mini-jeu ou au bilan.
- [ ] Implémenter, e2e vert, commit `feat(écrans): l'année en scène`.

### Task 6: Saisons et bilan (écran)

**Files:** Create `src/components/YearSummary.tsx` ; Modify `src/components/EventView.tsx`, `src/app/jouer/Game.tsx`, en-tête de jeu (ligne de situation)

Bandeau de saison sur chaque événement ; écran « 7 · Bilan » : gâteau animé, « Joyeux anniversaire, {prénom} ! », « Tu as maintenant {âge} ans. », lignes du livre de comptes (signe + couleur + texte), total, situation (« célibataire · 2 enfants · retraité »), bouton « Année suivante ». L'en-tête du jeu affiche la même ligne de situation sous le métier.

- [ ] Test e2e : finir une année mène à « Joyeux anniversaire », la ligne « Total de l'année » est visible, « Année suivante » ramène à « Choisis 2 actions » avec l'âge +1.
- [ ] Implémenter, e2e vert, commit `feat(écrans): saisons et bilan de l'année`.

### Task 7: Les cinématiques (écran)

**Files:** Create `src/components/Cinematic.tsx`, `src/components/cinematics.css` ; Modify `src/app/jouer/Game.tsx`, `src/components/LifeCard.tsx` ; Delete `src/components/GradeUp.tsx`

Les 9 cinématiques de la maquette (« 9 · Les cinématiques »), plein écran par-dessus le jeu, titre + phrase + bouton « Passer » + toucher l'écran ; 5 s puis fin automatique ; vibration courte (`navigator.vibrate`) si disponible. `vie-qui-defile` utilise les jalons de la vie puis laisse place à la carte de vie. La promotion remplace l'ancien écran de montée de grade.

- [ ] Test e2e : une nouvelle vie commence par « Le départ du nid » ; « Passer » la ferme ; la vie complète se termine par « La vie qui défile » puis la carte de vie.
- [ ] Implémenter, e2e vert, commit `feat(écrans): cinématiques des grands moments`.

### Task 8: La pêche

**Files:** Create `src/minigames/registry.ts`, `src/minigames/MinigameShell.tsx`, `src/minigames/Peche.tsx`, `src/minigames/peche.ts`, `src/minigames/peche.test.ts` ; Modify `src/app/jouer/Game.tsx`

Base commune : intro (titre, consigne, « Jouer », « Passer le mini-jeu »), puis le jeu, puis résultat (phrase drôle, effets) et « Continuer » qui appelle `finishMinigame`. La pêche reprend l'écran 8 : 3 lancers, « Ferrer ! », trop tôt / trop tard / prise tirée parmi daurade, loup, chaussure, trottinette, poisson « gros comme une voiture », poulpe vexé. `peche.ts` contient la logique pure : `pecheResult(catches: Catch[]): { effects: Effects; text: string }` (moral +3 +3 par vrai poisson, réputation +1 par vrai poisson, argent +20 par vrai poisson vendu).

- [ ] Tests Vitest de `pecheResult` (0, 1 et 3 poissons) ; test e2e : forcer la pêche via `/creer?seed=` choisie pour qu'elle tombe, cliquer « Passer le mini-jeu » → la partie continue.
- [ ] Implémenter, tests verts, commit `feat(mini-jeux): base commune et la pêche`.

### Task 9: Parcours complet et mise en ligne

**Files:** Modify `e2e/helpers.ts`, `e2e/vie-complete.spec.ts`, `e2e/annee.spec.ts`

- [ ] Les aides e2e savent passer scène, mini-jeu, bilan et cinématiques ; une vie complète va jusqu'à la carte de vie ; recharger pendant une scène, un bilan et une cinématique retrouve le même écran ; tests de contraste toujours verts ; `npm run build` réussi.
- [ ] Fusionner dans `main`, pousser, vérifier la mise en ligne Vercel.
