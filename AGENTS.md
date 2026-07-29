# CV interactif

## Structure
- `index.html` : point d'entrée statique.
- `css/` : styles globaux et par section.
- `js/data/` : contenus et métadonnées affichés.
- `js/render/` : fonctions de rendu HTML.
- `js/ui/` : interactions UI simples.
- `assets/img/` : ressources image du projet.
- `docs/charte-couleurs.md` : charte colorimétrique sémantique.

## Règles de modification
- Conserver les textes métier validés sans en modifier le sens.
- Préserver la compatibilité GitHub Pages avec des chemins relatifs.
- Privilégier des changements minimaux et sûrs.

## Couleur
- Un contenu porte une `nature`, jamais une couleur : `structure`, `decision`,
  `performance`, `coordination`, `exploration`, `graphite`, `socle`.
- Le rendu pose une classe `n-<nature>` ; les composants consomment
  `--n-ink` / `--n-mark` / `--n-surf` / `--n-line`.
- Aucune couleur en dur dans `js/`. Référentiel : en tête de `css/base.css`.
- L'émeraude (`performance`) reste réservée à la preuve chiffrée.
