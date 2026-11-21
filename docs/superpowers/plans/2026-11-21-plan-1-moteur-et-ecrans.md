# La Débrouille — Plan 1 : moteur du jeu et écrans jouables

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Une vie complète jouable sur téléphone, de la création du personnage (18 ans) à la carte de vie, avec ~30 cartes de départ et une sauvegarde locale.

**Architecture:** Un moteur de jeu pur en TypeScript (`src/engine/`), sans React, déterministe à partir d'une graine, testé avec Vitest. Le contenu (actions, cartes) est de la donnée typée dans `src/content/`. Une application Next.js (App Router) affiche les écrans de la maquette et appelle le moteur. Aucune base de données dans ce plan.

**Tech Stack:** Next.js 16 (App Router, TypeScript), Vitest 5, Playwright (`@playwright/test` 1.63.0, la version déjà installée sur la machine), polices Google Fredoka + Nunito via `next/font`.

**Spec:** `docs/superpowers/specs/2026-11-21-la-debrouille-design.md` (version 2). Maquette : https://claude.ai/artifact/VtY4SfTiFbxKZY2coTWsbN

## Découpage du projet en plans

La fiche couvre plusieurs sous-systèmes. Chaque plan produit un jeu qui fonctionne :

1. **Plan 1 (ce document)** — moteur, ~30 cartes, écrans création → année → événement → carte de vie, sauvegarde locale, aperçu en ligne.
2. **Plan 2** — contenu complet (~220 cartes, ~100 fins, suites d'événements, événements rares), équilibrage par simulation, phrase de fin riche, album des fins, héritage.
3. **Plan 3** — les 6 mini-jeux.
4. **Plan 4** — défi du jour, défi entre potes, classement Paris contre Marseille (Supabase), carte de vie partageable (image + lien).
5. **Plan 5** — installable sur l'écran d'accueil + hors-ligne, mesure d'audience, finitions, tests joueurs, lancement.

## Global Constraints

- Tout le texte affiché est en **français**. Aucune marque, club ou personne réelle nommé.
- Mobile d'abord : tout l'écran doit tenir et être utilisable à **360 px** de large ; cibles tactiles **≥ 44 px**.
- Un tour = **une année**. Départ à **18 ans**. **2 actions** par an, **1 ou 2 événements** par an.
- Villes : `paris` | `marseille`. Grades, dans l'ordre : **Galérien, Débrouillard, Petit patron, Boss, Légende** (orthographe exacte).
- Jauges santé, moral, réputation, famille bornées à **0–100** ; l'argent est en euros, entier, peut être négatif.
- Couleurs Paris : fond `#141A38`, carte `#1F2750`, texte `#F6F1E9`, texte secondaire `#AEB5D9`, bordure `#3A4680`, rose `#FF5C8A`, jaune `#FFC93C`. Couleurs Marseille : fond `#EAF6FC`, carte `#FFFFFF`, texte `#0B2E45`, secondaire `#4A6478`, bleu `#1679B5`, jaune `#FFC93C`.
- Polices : titres **Fredoka**, texte **Nunito**.
- Pas de cookie, pas de compte, pas de donnée envoyée à un serveur dans ce plan.
- Les chiffres de jeu de ce plan sont des **valeurs de départ** ; le plan 2 les règle par simulation. Les tests de ce plan vérifient les règles, pas l'équilibre.

## Review Focus

1. **Sauvegarde abîmée ou d'une ancienne version** dans le téléphone → le jeu ne plante pas, propose une nouvelle vie (test : Task 7).
2. **Prénom vide, très long, avec emoji ou balises HTML** → affiché tel quel sans casser l'écran ; vide devient « Toi » ; coupé à 16 caractères (test : Task 5).
3. **Double tap sur un choix ou sur « Continuer »** → l'effet n'est appliqué qu'une fois (test : Task 6).
4. **Aucune carte possible cette année** (toutes vues ou conditions non remplies) → l'année se termine normalement, sans écran vide (test : Task 6).
5. **Rechargement de la page au milieu d'un événement** → on revient sur le même événement, avec le même tirage (test : Task 10).

---

### Task 1: Projet Next.js, tests et thème

**Files:**
- Create: projet Next.js à la racine du dépôt (`package.json`, `next.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`)
- Create: `vitest.config.ts`, `playwright.config.ts`, `src/engine/sanity.test.ts`, `e2e/accueil.spec.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: scripts npm `dev`, `build`, `test` (Vitest, une passe), `e2e` (Playwright) ; variables CSS du thème dans `globals.css` : `--bg`, `--card`, `--text`, `--muted`, `--border`, `--accent` (rose), `--sun` (jaune), plus une classe `.theme-marseille` qui redéfinit les mêmes variables avec les couleurs Marseille.

- [ ] **Step 1:** Créer le projet : `npx create-next-app@16.4.6 . --ts --app --src-dir --eslint --no-tailwind --import-alias "@/*" --use-npm --yes` (le dossier contient déjà `docs/`, garder ce dossier). Installer `vitest@5.1.1` et `@playwright/test@1.63.0` en dépendances de dev.
- [ ] **Step 2:** Écrire `e2e/accueil.spec.ts` : la page `/` affiche un titre de niveau 1 « La Débrouille » et le texte « Pars de rien. Deviens une légende. ». Écrire `src/engine/sanity.test.ts` : `expect(1 + 1).toBe(2)`.
- [ ] **Step 3:** Lancer `npm run e2e`. Attendu : ÉCHEC (titre absent).
- [ ] **Step 4:** Configurer `playwright.config.ts` (serveur `npm run dev` sur le port 3000, projet unique mobile 390×844 ; `--trace off` dans le script `e2e`). Charger Fredoka (500, 600, 700) et Nunito (500, 700, 800) avec `next/font/google` dans `layout.tsx`, `lang="fr"`. Écrire le thème dans `globals.css`. Page `/` minimale avec le titre et la phrase.
- [ ] **Step 5:** Lancer `npm test` puis `npm run e2e`. Attendu : les deux PASSENT. Lancer `npm run build`. Attendu : build réussi.
- [ ] **Step 6:** Commit `chore: projet Next.js, Vitest, Playwright et thème`.

### Task 2: Hasard reproductible et mise en forme

**Files:**
- Create: `src/engine/rng.ts`, `src/engine/rng.test.ts`, `src/engine/format.ts`, `src/engine/format.test.ts`

**Interfaces:**
- Produces:
  - `class Rng { constructor(seed: string | number); next(): number /* [0,1) */; int(min: number, max: number): number /* bornes incluses */; chance(p: number): boolean; pick<T>(items: readonly T[]): T; weightedPick<T extends { weight?: number }>(items: readonly T[]): T; getState(): number; static fromState(state: number): Rng }`
  - `formatMoney(amount: number): string`
  - `formatAge(age: number): string` → `"23 ans"`

- [ ] **Step 1: Tests**
  - `new Rng("abc")` et `new Rng("abc")` donnent les 5 mêmes `next()` ; `new Rng("abd")` donne une suite différente.
  - `Rng.fromState(r.getState())` continue exactement la même suite que `r`.
  - `int(1, 6)` sur 1 000 tirages reste dans [1, 6] et sort au moins une fois 1 et 6.
  - `weightedPick` avec poids `{a:0},{b:1}` renvoie toujours `b` ; poids absent = 1.
  - `formatMoney(340)` → `"340 €"` ; `formatMoney(18750)` → `"18 750 €"` ; `formatMoney(-1234)` → `"−1 234 €"` ; `formatMoney(1_200_000)` → `"1,2 M€"` ; `formatMoney(1_000_000)` → `"1 M€"` ; `formatMoney(0)` → `"0 €"`.
- [ ] **Step 2:** `npm test -- rng format`. Attendu : ÉCHEC (modules absents).
- [ ] **Step 3:** Implémenter. Graine texte → nombre avec un hachage 32 bits (xmur3), suite avec mulberry32 ; l'état est l'entier 32 bits de mulberry32. `formatMoney` : séparateur de milliers U+202F, espace U+00A0 avant `€`, signe moins U+2212 ; à partir de 1 000 000 en valeur absolue, une décimale avec virgule et `M€`, sans `,0`.
- [ ] **Step 4:** `npm test -- rng format`. Attendu : PASS.
- [ ] **Step 5:** Commit `feat(moteur): hasard reproductible et formats`.

### Task 3: Types, carrières, grades et score

**Files:**
- Create: `src/engine/types.ts`, `src/engine/careers.ts`, `src/engine/grades.ts`, `src/engine/grades.test.ts`

**Interfaces:**
- Produces (`types.ts`) :
  - `type City = "paris" | "marseille"` ; `type FamilyStart = "modeste" | "moyenne" | "aisee"` ; `type Grade = "Galérien" | "Débrouillard" | "Petit patron" | "Boss" | "Légende"`
  - `interface Gauges { money: number; health: number; morale: number; reputation: number; family: number }`
  - `type Effects = Partial<Gauges>`
  - `interface Character { name: string; city: City; district: string; skin: string /* couleur hex */ }`
  - `type CareerId = "etudiant" | "livreur" | "vendeur" | "bureau" | "artisan" | "restauration" | "foodtruck" | "influenceur" | "startup" | "immobilier" | "fonctionnaire"`
  - `type Phase = "actions" | "event" | "result" | "dead"`
  - `interface OutcomeResult { cardId: string; choiceLabel: string; text: string; effects: Effects }`
  - `interface LifeState { version: 1; seed: string; rngState: number; character: Character; familyStart: FamilyStart; age: number; gauges: Gauges; career: CareerId; careerLevel: number; formations: number; flags: string[]; seenEvents: string[]; eventQueue: string[]; currentEventId: string | null; lastResult: OutcomeResult | null; phase: Phase; deathCause: "sante" | "vieillesse" | null; history: { age: number; text: string }[] }`
- Produces (`careers.ts`) : `CAREERS: Record<CareerId, { label: string; levels: { title: string; monthly: number }[] }>` ; `BUSINESS_CAREERS: CareerId[] = ["restauration", "foodtruck", "startup", "immobilier"]` ; `careerTitle(state: Pick<LifeState, "career" | "careerLevel">): string` ; `monthlySalary(...)` même paramètre, renvoie un nombre.
- Produces (`grades.ts`) : `gradeFor(g: Gauges): Grade` ; `scoreFor(state: LifeState): number`.

Valeurs des carrières (titre / salaire mensuel en €) :
etudiant : Étudiant 400 · livreur : Livreur à vélo 1 150, Livreur en scooter 1 500, Chef d'équipe livraison 2 000 · vendeur : Vendeur 1 400, Responsable de rayon 1 900, Gérant de boutique 2 600 · bureau : Employé de bureau 1 700, Chef de projet 2 600, Directeur 4 500 · artisan : Apprenti 900, Artisan 2 200, Patron d'atelier 4 000 · restauration : Commis de cuisine 1 400, Patron de kebab 2 800, Chaîne de kebabs 7 000 · foodtruck : Food truck 2 000, 2 food trucks 4 500, Flotte de food trucks 9 000 · influenceur : Petit compte 300, Influenceur 2 500, Star du web 12 000 · startup : Fondateur fauché 0, Start-up qui lève 5 000, Licorne 25 000 · immobilier : Agent immobilier 1 800, Investisseur 4 000, Magnat de l'immobilier 15 000 · fonctionnaire : Fonctionnaire 1 800, Chef de service 2 600, Haut fonctionnaire 4 200.

- [ ] **Step 1: Tests (`grades.test.ts`)**
  - `gradeFor({money: 1_000_000, reputation: 80, ...})` → `"Légende"` ; `money: 1_000_000, reputation: 79` → `"Boss"`.
  - `money: 250_000, reputation: 0` → `"Boss"` ; `money: 100_000, reputation: 60` → `"Boss"`.
  - `money: 30_000` → `"Petit patron"` ; `money: 0, reputation: 50` → `"Petit patron"`.
  - `money: 3_000` → `"Débrouillard"` ; `money: 0, reputation: 25` → `"Débrouillard"` ; `money: -5_000, reputation: 0` → `"Galérien"`.
  - `scoreFor` d'un état `money 18_750, reputation 41, family 58` (grade Débrouillard) → `188 + 2050 + 1160 + 500` = `3898`. Argent négatif compte 0.
  - `careerTitle({career: "foodtruck", careerLevel: 1})` → `"2 food trucks"`.
- [ ] **Step 2:** `npm test -- grades`. Attendu : ÉCHEC.
- [ ] **Step 3:** Implémenter. Règles des grades, testées dans cet ordre : Légende si argent ≥ 1 000 000 **et** réputation ≥ 80 ; Boss si argent ≥ 250 000 ou (argent ≥ 100 000 et réputation ≥ 60) ; Petit patron si argent ≥ 30 000 ou réputation ≥ 50 ; Débrouillard si argent ≥ 3 000 ou réputation ≥ 25 ; sinon Galérien. Score = `round(max(argent,0)/100) + réputation×50 + famille×20 + bonus` avec bonus Galérien 0, Débrouillard 500, Petit patron 1 500, Boss 4 000, Légende 10 000.
- [ ] **Step 4:** `npm test -- grades`. Attendu : PASS.
- [ ] **Step 5:** Commit `feat(moteur): types, carrières, grades et score`.

### Task 4: Format du contenu et premières cartes

**Files:**
- Create: `src/content/schema.ts`, `src/content/actions.ts`, `src/content/districts.ts`, `src/content/events/commun.ts`, `src/content/events/paris.ts`, `src/content/events/marseille.ts`, `src/content/index.ts`, `src/content/content.test.ts`

**Interfaces:**
- Consumes: `City`, `CareerId`, `Effects` (Task 3).
- Produces (`schema.ts`) :
  - `interface Conditions { minAge?: number; maxAge?: number; cities?: City[]; careers?: CareerId[]; requiresFlags?: string[]; forbidsFlags?: string[]; minMoney?: number; maxMoney?: number }`
  - `interface Outcome { weight?: number; text: string; effects: Effects; setFlags?: string[] }`
  - `interface Choice { label: string; outcomes: Outcome[] }`
  - `interface EventCard { id: string; text: string; detail?: string; conditions?: Conditions; weight?: number; repeatable?: boolean; choices: Choice[] }`
  - `type ActionId = "bosser" | "formation" | "job" | "business" | "sortir" | "sport" | "famille" | "investir" | "repos"`
  - `interface ActionDef { id: ActionId; label: string; hint: string; minMoney?: number }`
- Produces (`districts.ts`) : `DISTRICTS: Record<City, { name: string; rent: number /* € par mois */ }[]>`.
- Produces (`index.ts`) : `ACTIONS: ActionDef[]` ; `EVENTS: EventCard[]` (les trois fichiers réunis) ; `getEvent(id: string): EventCard` (lève une erreur si l'id est inconnu).

Données fixées :
- Quartiers et loyers : Paris — Paris 11e 750, Paris 18e 650, Paris 20e 650, Paris 15e 800, Montreuil 600 ; Marseille — Le Panier 520, La Plaine 480, Castellane 600, Noailles 450, Les Goudes 550.
- Actions (libellé / indice) : bosser « Bosser plus » / « + argent · − santé » ; formation « Me former » / « + avenir · − argent » ; job « Chercher un job » / « meilleur salaire ? » ; business « Lancer un business » / « gros risque, gros gain » (minMoney 2 000) ; sortir « Sortir » / « + moral · + réseau » ; sport « Faire du sport » / « + santé · + moral » ; famille « Voir la famille » / « + famille » ; investir « Investir » / « placer ses sous » (minMoney 1 000) ; repos « Me reposer » / « + santé · − argent ».
- Cartes : 15 communes, 8 Paris (`cities: ["paris"]`), 7 Marseille (`cities: ["marseille"]`), écrites selon les règles d'humour du §8 de la fiche. Elles incluent obligatoirement : `loyer-hausse` (texte de la maquette, 3 choix et résultats de la maquette), `rer-bloque` (Paris), `maman-tu-manges` , `patron-augmentation` (avec le choix « Je lance un podcast sur lui »), `mistral-parasol` (Marseille), `console-voisin` (pose le marqueur `console-vendue`) — sa suite viendra au plan 2.

- [ ] **Step 1: Tests (`content.test.ts`)**
  - Les ids des cartes sont uniques et en minuscules avec tirets (`/^[a-z0-9-]+$/`).
  - Chaque carte a 2 ou 3 choix ; chaque choix a au moins un résultat ; `text` ≤ 160 caractères ; chaque `text` de résultat ≤ 160 caractères.
  - Les 6 ids obligatoires existent ; il y a au moins 15 cartes sans condition de ville, 8 Paris, 7 Marseille.
  - Chaque clé d'`effects` est une clé de `Gauges` ; les effets sur les jauges 0–100 sont entre −30 et +30.
  - Aucun texte ne contient les mots interdits de la liste `BANNED_WORDS` déclarée dans le test (`"PSG"`, `"OM"`, `"Olympique"`, `"Uber"`, `"Deliveroo"`, `"McDo"`, `"RATP"`), en mots entiers.
  - `ACTIONS` contient exactement les 9 ids, dans l'ordre donné ci-dessus.
- [ ] **Step 2:** `npm test -- content`. Attendu : ÉCHEC.
- [ ] **Step 3:** Écrire le schéma, les actions, les quartiers et les 30 cartes.
- [ ] **Step 4:** `npm test -- content`. Attendu : PASS.
- [ ] **Step 5:** Commit `feat(contenu): format des cartes et 30 premières cartes`.

### Task 5: Nouvelle vie et actions de l'année

**Files:**
- Create: `src/engine/life.ts`, `src/engine/actions.ts`, `src/engine/apply.ts`, `src/engine/life.test.ts`

**Interfaces:**
- Consumes: `Rng` (Task 2), types et carrières (Task 3), `ACTIONS`, `DISTRICTS`, `ActionId` (Task 4).
- Produces:
  - `interface NewLifeInput { name: string; city: City; district: string; skin: string }`
  - `newLife(input: NewLifeInput, seed: string): LifeState`
  - `availableActions(state: LifeState): ActionId[]`
  - `applyEffects(gauges: Gauges, effects: Effects): Gauges` (bornes 0–100 sauf argent, entiers)
  - `applyActions(state: LifeState, ids: [ActionId, ActionId], rng: Rng): LifeState` (interne au moteur, utilisé par la Task 6)

Valeurs de départ : famille tirée avec `rng.pick(["modeste","moyenne","aisee"])` ; argent de départ modeste 300, moyenne 2 000, aisée 10 000 ; santé 90, moral 60, réputation 5, famille 60 ; carrière `etudiant` niveau 0 ; âge 18 ; phase `actions`.

Effets des actions (valeurs de départ) : bosser argent + 2 mois de salaire, santé −4, moral −3 · formation argent −1 500, `formations` +1, moral −1 · job : si étudiant, devient `livreur`, `vendeur` ou `bureau` (bureau seulement si `formations` ≥ 1) ; sinon promotion d'un niveau avec probabilité `min(0.35 + 0.1 × formations, 0.75)`, sans dépasser le dernier niveau · business : coûte 2 000 ; hors carrière d'affaires, devient `foodtruck` ou `restauration` niveau 0 ; dans une carrière d'affaires, probabilité 0,4 de monter d'un niveau, sinon argent −3 000 et moral −8 · sortir moral +8, réputation +3, argent −400 · sport santé +6, moral +3 · famille famille +8, argent −200 · investir : place la moitié de l'argent, rendement tiré entre −30 % et +40 % · repos santé +4, moral +4, argent −300. Chaque action ajoute une ligne à `history`.

- [ ] **Step 1: Tests (`life.test.ts`)**
  - `newLife({name:"Inès", city:"paris", district:"Paris 18e", skin:"#C68A62"}, "s1")` deux fois → états identiques ; âge 18, phase `actions`, carrière `etudiant`.
  - Prénom `"   "` → `"Toi"` ; prénom de 30 caractères → coupé à 16 ; `"<b>Léa</b> 😀"` est gardé tel quel (pas d'échappement dans le moteur) puis coupé à 16 caractères sans couper un emoji en deux.
  - Quartier inconnu pour la ville → erreur `"QUARTIER_INCONNU"`.
  - `availableActions` d'un état avec 500 € ne contient ni `business` ni `investir` ; avec 5 000 € les contient.
  - `applyEffects` : santé 95 + 10 → 100 ; moral 3 − 10 → 0 ; argent 100 − 500 → −400.
  - `applyActions` avec deux fois la même action ou une action non disponible → erreur `"ACTIONS_INVALIDES"`.
  - `applyActions(["sport","famille"])` sur l'état de départ → santé 96, moral 63, famille 68, argent −200 par rapport au départ.
  - `job` pour un étudiant avec `formations` 0 ne donne jamais `bureau` (100 graines).
- [ ] **Step 2:** `npm test -- life`. Attendu : ÉCHEC.
- [ ] **Step 3:** Implémenter. La graine de départ initialise `Rng` ; `rngState` est toujours l'état après le dernier tirage. Coupe du prénom avec `Array.from(name)` pour ne pas casser les emoji.
- [ ] **Step 4:** `npm test -- life`. Attendu : PASS.
- [ ] **Step 5:** Commit `feat(moteur): nouvelle vie et actions de l'année`.

### Task 6: Événements, fin d'année et mort

**Files:**
- Create: `src/engine/events.ts`, `src/engine/year.ts`, `src/engine/turn.ts`, `src/engine/turn.test.ts`, `src/engine/simulate.test.ts`
- Modify: `src/engine/index.ts` (création : exporte l'API publique du moteur)

**Interfaces:**
- Consumes: Tasks 2 à 5.
- Produces (API publique, `src/engine/index.ts`) :
  - `newLife` (Task 5), `availableActions` (Task 5)
  - `chooseActions(state: LifeState, ids: [ActionId, ActionId], cards: EventCard[] = EVENTS): LifeState` (le paramètre `cards` sert aux tests)
  - `chooseOption(state: LifeState, choiceIndex: number): LifeState`
  - `continueTurn(state: LifeState): LifeState`
  - `currentEvent(state: LifeState): EventCard | null`
  - `gradeFor`, `scoreFor`, `careerTitle`, `formatMoney`, `formatAge`
  - `eligibleEvents(state: LifeState, cards: EventCard[]): EventCard[]` (exporté pour les tests)

Règles :
- `chooseActions` (phase `actions` seulement) : applique les actions, puis tire le nombre d'événements (1 si `rng.next() < 0.6`, sinon 2) parmi les cartes éligibles, sans remise, au poids ; place le premier dans `currentEventId`, le reste dans `eventQueue`, phase `event`. Si aucune carte n'est éligible : fin d'année directe, phase `actions` (ou `dead`).
- Carte éligible : conditions toutes remplies, et pas déjà dans `seenEvents` sauf si `repeatable`.
- `chooseOption` (phase `event` seulement, sinon renvoie l'état **inchangé**) : tire un résultat au poids, applique les effets, ajoute les marqueurs, ajoute l'id à `seenEvents`, remplit `lastResult`, phase `result`. Index hors limites → erreur `"CHOIX_INVALIDE"`.
- `continueTurn` (phase `result` seulement, sinon inchangé) : s'il reste un événement dans la file, il devient l'événement courant (phase `event`) ; sinon fin d'année.
- Fin d'année : argent += 12 × (salaire − loyer du quartier − 550) ; santé −1 avant 40 ans, −2 de 40 à 59, −3 de 60 à 74, −5 à partir de 75 ; −2 de plus si moral < 20 ; âge +1. Mort si santé ≤ 0 (cause `sante`), ou âge ≥ 75 et `rng.next() < (âge − 74) × 0.04`, ou âge ≥ 100 (cause `vieillesse`) → phase `dead`. Sinon phase `actions`.

- [ ] **Step 1: Tests (`turn.test.ts`)**
  - Après `chooseActions`, la phase est `event` et `currentEvent` n'est pas nul ; une carte Marseille n'est jamais tirée pour un perso parisien (200 graines).
  - `chooseOption` appelé deux fois de suite : le second appel renvoie un état identique au premier résultat (double tap).
  - `continueTurn` appelé en phase `event` renvoie l'état inchangé.
  - `chooseActions(etat, ["sport","famille"], [])` (aucune carte) termine l'année : âge 19, phase `actions`, `currentEventId` nul. Même résultat avec `EVENTS` et un état où `seenEvents` contient tous les ids.
  - Fin d'année d'un livreur à vélo (1 150 €) à Paris 18e (650 €) : argent += 12 × (1 150 − 650 − 550) = −600.
  - Un état de 99 ans en fin d'année → phase `dead`, cause `vieillesse`.
  - Un état avec santé 1 et 45 ans → `dead`, cause `sante`.
  - Même graine et mêmes choix → même suite d'états (deux parties jouées en parallèle, 20 tours).
- [ ] **Step 2: Test (`simulate.test.ts`)** : 300 vies jouées automatiquement (actions et choix tirés avec une `Rng` à part, graines `sim-0` à `sim-299`) se terminent toutes en phase `dead`, à un âge entre 19 et 100, sans erreur, en moins de 400 appels au moteur chacune.
- [ ] **Step 3:** `npm test -- turn simulate`. Attendu : ÉCHEC.
- [ ] **Step 4:** Implémenter `events.ts`, `year.ts`, `turn.ts` et `index.ts`. Chaque fonction publique part d'une copie de l'état (`structuredClone`) et ne modifie jamais l'état reçu.
- [ ] **Step 5:** `npm test`. Attendu : toutes les suites PASSENT.
- [ ] **Step 6:** Commit `feat(moteur): événements, fin d'année et mort`.

### Task 7: Sauvegarde dans le téléphone

**Files:**
- Create: `src/lib/save.ts`, `src/lib/save.test.ts`

**Interfaces:**
- Consumes: `LifeState` (Task 3).
- Produces: `SAVE_KEY = "debrouille.vie.v1"` ; `saveLife(state: LifeState, storage?: Storage): void` ; `loadLife(storage?: Storage): LifeState | null` ; `clearLife(storage?: Storage): void`. `storage` vaut `window.localStorage` par défaut ; toute erreur d'accès est ignorée.

- [ ] **Step 1: Tests (`save.test.ts`)** avec un faux `Storage` en mémoire :
  - Sauvegarder puis charger → état égal.
  - Valeur non JSON (`"{oups"`) → `null`, sans erreur levée.
  - JSON avec `version: 0` ou sans `gauges` → `null`.
  - Un `Storage` dont `getItem` et `setItem` lèvent une erreur → `loadLife` renvoie `null`, `saveLife` ne lève rien.
  - Après `clearLife`, `loadLife` → `null`.
- [ ] **Step 2:** `npm test -- save`. Attendu : ÉCHEC.
- [ ] **Step 3:** Implémenter. Validation au chargement : `version === 1`, présence et type des champs `seed`, `rngState`, `character`, `gauges` (5 nombres), `age`, `phase` parmi les 4 valeurs.
- [ ] **Step 4:** `npm test -- save`. Attendu : PASS.
- [ ] **Step 5:** Commit `feat: sauvegarde locale de la vie`.

### Task 8: Accueil et création du personnage

**Files:**
- Create: `src/components/Avatar.tsx`, `src/components/CityScene.tsx`, `src/components/CreationForm.tsx`, `src/app/creer/page.tsx`
- Modify: `src/app/page.tsx`
- Test: `e2e/creation.spec.ts`

**Interfaces:**
- Consumes: `newLife`, `DISTRICTS`, `saveLife`, `loadLife`.
- Produces:
  - `<Avatar skin: string; shirt: string; age: number; size?: number />` : dessin SVG de la maquette ; cheveux gris et lunettes à partir de 60 ans.
  - `<CityScene city: City; height?: number>{children}</CityScene>` : décor Paris (nuit, toits, tour) ou Marseille (soleil, calanques, mer, voilier), avec le personnage posé dessus.
  - Route `/creer` ; à la validation : `saveLife(newLife(...))` puis navigation vers `/jouer`. Graine = `?seed=` de l'URL si présent (pour les tests), sinon `crypto.randomUUID()`.

Écrans : reprendre la maquette (artboards « 1 · Accueil » et « 2 · Création du perso »). L'accueil de ce plan n'a pas le tableau des scores (plan 4) : titre, phrase, illustration Paris contre Marseille, bouton « Joue ta vie » → `/creer`, et bouton « Reprendre ma vie » → `/jouer` affiché seulement si une sauvegarde vivante existe. Création : prénom (`<label>` « Ton prénom », 16 caractères max), ville (Paris / Marseille, change les quartiers et le décor), quartier, 5 couleurs de peau (`#F6D7C3`, `#E8B796`, `#C68A62`, `#8D5A3B`, `#5A3825`, chacune avec un `aria-label`), phrase « Ta famille de départ est tirée au sort : modeste, moyenne ou aisée. », bouton « Commencer ma vie à 18 ans ». En mode Marseille, la classe `.theme-marseille` est appliquée.

- [ ] **Step 1: Test (`creation.spec.ts`)** : depuis `/`, cliquer « Joue ta vie » ; remplir « Ton prénom » avec « Inès » ; choisir « Marseille » ; vérifier que le quartier « Le Panier » apparaît et que « Paris 18e » n'apparaît plus ; choisir « Noailles » ; cliquer « Commencer ma vie à 18 ans » ; l'URL devient `/jouer` ; revenir sur `/` → le bouton « Reprendre ma vie » est visible. Vérifier aussi qu'à 360 px de large la page n'a pas de défilement horizontal (`document.documentElement.scrollWidth <= 360`).
- [ ] **Step 2:** `npm run e2e -- creation`. Attendu : ÉCHEC.
- [ ] **Step 3:** Implémenter les composants et les deux pages (`/jouer` peut être une page vide pour l'instant).
- [ ] **Step 4:** `npm run e2e -- creation`. Attendu : PASS.
- [ ] **Step 5:** Commit `feat(écrans): accueil et création du personnage`.

### Task 9: L'écran de l'année et les événements

**Files:**
- Create: `src/components/GaugesPanel.tsx`, `src/components/ActionPicker.tsx`, `src/components/EventView.tsx`, `src/components/ResultView.tsx`, `src/components/GradeUp.tsx`, `src/app/jouer/page.tsx`, `src/app/jouer/Game.tsx`
- Test: `e2e/annee.spec.ts`

**Interfaces:**
- Consumes: API publique du moteur (Task 6), `loadLife`, `saveLife` (Task 7), `Avatar`, `CityScene` (Task 8).
- Produces: `<Game />` (composant client) qui charge la vie sauvegardée (sinon redirige vers `/creer`), affiche l'écran selon `phase`, et sauvegarde après **chaque** appel au moteur.

Écrans : reprendre la maquette (« 3 · Ton année » et « 4 · Un événement »).
- Phase `actions` : en-tête « {prénom} · {âge} » + titre de carrière et salaire (« Livreur à vélo · 1 150 €/mois ») ; badge du grade ; jauges (argent en grand, 4 barres avec la valeur en chiffres) ; décor de la ville avec le personnage ; titre « Choisis 2 actions » et compteur « n/2 » ; les actions disponibles en boutons (`aria-pressed`) ; une 3e sélection remplace la plus ancienne ; bouton « Vivre cette année » actif seulement avec 2 actions.
- Phase `event` : carte crème `#FFF6E8` avec le texte et le détail de la carte, puis un bouton par choix.
- Phase `result` : titre (libellé du choix), texte du résultat, pastilles d'effets avec signe et chiffre (« Argent −960 € », « Moral +10 ») — le sens ne repose jamais sur la couleur seule ; bouton « Continuer ».
- Montée de grade (comparer le grade avant/après chaque appel) : bandeau « Tu passes {grade} ! » avec confettis CSS, refermable.
- Les boutons de choix et « Continuer » sont désactivés dès le premier appui jusqu'au rendu suivant.

- [ ] **Step 1: Test (`annee.spec.ts`)** : créer une vie avec `/creer?seed=e2e-1` ; sur `/jouer`, vérifier « Choisis 2 actions » et « 0/2 » ; le bouton « Vivre cette année » est désactivé ; choisir « Faire du sport » et « Voir la famille » → « 2/2 » et bouton actif ; cliquer « Vivre cette année » ; un événement s'affiche avec au moins 2 boutons de choix ; cliquer le premier choix **deux fois rapidement** ; un écran de résultat avec « Continuer » s'affiche ; cliquer « Continuer » jusqu'à revoir « Choisis 2 actions » ; l'en-tête affiche « 19 ans ». Refaire 5 années ; aucune erreur dans la console du navigateur.
- [ ] **Step 2:** `npm run e2e -- annee`. Attendu : ÉCHEC.
- [ ] **Step 3:** Implémenter.
- [ ] **Step 4:** `npm run e2e -- annee`. Attendu : PASS.
- [ ] **Step 5:** Commit `feat(écrans): année, événements et résultats`.

### Task 10: Carte de vie, rejouer et reprise

**Files:**
- Create: `src/engine/epitaph.ts`, `src/engine/epitaph.test.ts`, `src/components/LifeCard.tsx`
- Modify: `src/app/jouer/Game.tsx`, `src/engine/index.ts`
- Test: `e2e/vie-complete.spec.ts`

**Interfaces:**
- Consumes: moteur, `clearLife`, `Avatar`.
- Produces: `buildEpitaph(state: LifeState): { title: string; sentence: string }` (version simple ; le plan 2 la remplacera par la phrase riche) ; `<LifeCard state: LifeState />`.

Règles de la version simple : `title` = titre de la carrière finale (« Flotte de food trucks ») ; `sentence` = « Fin de vie à {âge} ans, {grade}, avec {argent formaté}. » ; si la cause est `sante` et l'âge < 50 : « Parti(e) trop tôt, à {âge} ans… » remplace le début. Écran de fin repris de la maquette (« 5 · Carte de vie ») : grade en badge, personnage vieilli, « {prénom} · {quartier} · 18 → {âge} ans », titre, phrase entre guillemets, 3 stats (Fortune, Réputation, Famille), « +{score} pts pour {Paris|Marseille} » (le score n'est pas envoyé dans ce plan), bouton « Rejouer une vie » → `clearLife()` puis `/creer`. Pas encore de bouton « Partager » (plan 4).

- [ ] **Step 1: Tests (`epitaph.test.ts`)** : un état mort à 71 ans, carrière `foodtruck` niveau 2, argent 1 200 000, réputation 50 → `title` « Flotte de food trucks », `sentence` « Fin de vie à 71 ans, Boss, avec 1,2 M€. » ; un état mort de `sante` à 34 ans commence par « Parti(e) trop tôt, à 34 ans… ».
- [ ] **Step 2: Test (`vie-complete.spec.ts`)** : avec `/creer?seed=e2e-vie`, jouer automatiquement (toujours les 2 premières actions disponibles et le premier choix) jusqu'à l'écran de fin ; vérifier qu'il affiche un des 5 grades, le texte « pts pour Paris » et le bouton « Rejouer une vie ». Second test : au milieu d'un événement, noter le texte de la carte, recharger la page → la même carte est affichée. Troisième test : écrire `"{oups"` dans `localStorage["debrouille.vie.v1"]`, ouvrir `/jouer` → redirection vers `/creer` sans erreur.
- [ ] **Step 3:** `npm test -- epitaph` et `npm run e2e -- vie-complete`. Attendu : ÉCHEC.
- [ ] **Step 4:** Implémenter.
- [ ] **Step 5:** `npm test` et `npm run e2e`. Attendu : tout PASSE. `npm run build` réussi.
- [ ] **Step 6:** Commit `feat(écrans): carte de vie, rejouer et reprise`.

### Task 11: Aperçu en ligne

**Files:**
- Modify: `README.md` (création : comment lancer le jeu, les tests et l'aperçu)

- [ ] **Step 1:** Mettre en ligne un aperçu sur Vercel (outils Vercel de la session ; si l'accès au compte Vercel de l'utilisateur n'est pas disponible, s'arrêter et lui demander de connecter Vercel ou de créer le projet depuis le dépôt GitHub).
- [ ] **Step 2:** Ouvrir l'adresse de l'aperçu en navigateur mobile 390×844 et jouer une année complète. Attendu : aucun écran cassé, aucune erreur dans la console.
- [ ] **Step 3:** Commit `docs: README et aperçu en ligne` et pousser `main`.
