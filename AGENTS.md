# CV interactif

## Structure
- `index.html` : point d'entrée statique.
- `css/` : styles globaux et par section.
- `js/data/` : contenus et métadonnées affichés.
- `js/render/` : fonctions de rendu HTML.
- `js/ui/` : interactions UI simples.
- `assets/img/` : ressources image du projet.

## Landing animée (séquence d'ouverture)
- Balisage : bloc `.intro` dans `index.html`, un `.intro-beat` par plan.
- Chronologie : `css/intro.css` porte tout le déroulé (7,9 s) via les
  variables `--in` / `--out` de chaque plan. Un plan doit être totalement
  sorti avant l'entrée du suivant : `--in` du plan N+1 = `--out` du plan N
  + `--out-dur`.
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
