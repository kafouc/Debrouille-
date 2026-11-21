# La Débrouille

Simulateur de vie humoristique, Paris contre Marseille. Pars de rien à 18 ans, deviens une légende.

- Fiche du jeu : `docs/superpowers/specs/2026-11-21-la-debrouille-design.md`
- Plans de construction : `docs/superpowers/plans/`
- Maquette des écrans : https://claude.ai/artifact/VtY4SfTiFbxKZY2coTWsbN

## Lancer le jeu en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Tests

```bash
npm test        # moteur du jeu (Vitest)
npm run e2e     # parcours complets dans le navigateur (Playwright)
npm run build   # vérifie la compilation
```

Astuce : `/creer?seed=ma-graine` crée toujours la même vie (pratique pour tester).

## Organisation du code

- `src/engine/` : moteur du jeu, sans interface (hasard reproductible, jauges, actions, événements, fin d'année, grades, score).
- `src/content/` : le contenu (actions, quartiers, cartes événement). Ajouter une carte = ajouter un objet dans `src/content/events/`.
- `src/components/` et `src/app/` : les écrans (accueil, création, année, événement, carte de vie).
- `src/lib/save.ts` : sauvegarde de la vie dans le téléphone.

## En ligne

Le projet Vercel `la-debrouille` est relié à ce dépôt : chaque push crée une version en ligne.
