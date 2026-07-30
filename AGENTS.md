# CV interactif

## Structure
- `index.html` : point d'entrée statique.
- `css/` : styles globaux et par section.
- `js/data/` : contenus et métadonnées affichés.
- `js/render/` : fonctions de rendu HTML.
- `js/ui/` : interactions UI simples.
- `js/ui/icons.js` : jeu d'icônes SVG monochromes (`currentColor`).
- `js/render/renderPrint.js` + `js/ui/print.js` + `css/print.css` : vue
  d'impression, montée à la demande car le SPA n'affiche qu'une section.
- `assets/img/` : ressources image du projet.
- `docs/charte-couleurs.md` : charte colorimétrique sémantique.

## Landing animée (séquence d'ouverture)
- Direction : planche technique. Papier (matière et lumière, sans motif
  répété), encre noire, un seul rouge de repère, cadre, marge tracée,
  filets capillaires, repères d'angle et cotes.
  Display en Archivo 125 % (chasse élargie), annotations en JetBrains Mono.
  Ne pas ajouter de dégradés, de halos ni de couleurs supplémentaires.
- Balisage : bloc `.intro` dans `index.html`, un `.intro-plan` par planche
  (5 planches). Le contenu est statique pour éviter tout clignotement.
- Chronologie : `css/intro.css` porte tout le déroulé (7,9 s) via les
  variables `--in` / `--out` de chaque planche. Une planche doit être
  totalement sortie avant l'entrée de la suivante : `--in` de la planche
  N+1 = `--out` de la planche N + `--out-dur`.
- La plaque encrée de la planche 03 laisse deux bandes de papier
  (`--band`) en haut et en bas du cadre : elles portent les métadonnées et
  le bouton, qui restent donc lisibles. Toute modification de `--band` doit
  garder ces éléments hors de la plaque.
- Pilotage : `js/ui/intro.js` est le seul script classique bloquant du
  projet (décision avant premier rendu, donc sans clignotement). Il arme la
  séquence, lance la lecture après chargement des polices, anime les
  compteurs, gère le skip et retire l'overlay.
- La séquence est ignorée si `prefers-reduced-motion: reduce` est actif ou
  si elle a déjà été jouée dans la session ; `#intro` force la relecture.

## Règles de modification
- Conserver les textes métier validés sans en modifier le sens.
- Préserver la compatibilité GitHub Pages avec des chemins relatifs.
- Privilégier des changements minimaux et sûrs.

## Couleur
- Deux porteuses et un accent : encre (ce qui cadre), forêt (ce qui produit),
  flamme (ce qui prouve). La hiérarchie se fait en nuances, pas en teintes.
- Un contenu porte une `nature`, jamais une couleur : `cadre`, `produit`,
  `preuve` ou `socle`.
- Le rendu pose une classe `n-<nature>` ; les composants consomment
  `--n-ink` / `--n-mark` / `--n-surf` / `--n-line`.
- Aucune couleur en dur dans `js/`. Référentiel : en tête de `css/base.css`.
- La flamme est réservée aux chiffres mesurés et aux adresses en ligne. Un
  titre de compétence ou un nom d'outil n'est pas une preuve.
- Pas d'emoji dans l'interface : ils sont multicolores et contredisent la
  charte. Ajouter un tracé à `js/ui/icons.js` et appeler `icon("nom")`.

## Impression
- `css/print.css` recompose le document, il ne rétrécit pas la page : bandeau
  à deux colonnes, sections numérotées, grille libellé (30 mm) / matière.
- Toute nouvelle section doit être ajoutée à `renderSectionBody()` dans
  `js/render/renderPrint.js`, sinon elle disparaît du PDF.
- Un accordéon doit accepter `{ expandAll: true }` pour être imprimable.
- Pas de cartes ni de pastilles sur papier : les étiquettes redeviennent du
  texte.
