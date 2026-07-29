# CV interactif

## Structure
- `index.html` : point d'entrée statique.
- `css/` : styles globaux et par section.
- `js/data/` : contenus et métadonnées affichés.
- `js/render/` : fonctions de rendu HTML.
- `js/ui/` : interactions UI simples.
- `assets/img/` : ressources image du projet.

## Landing animée (séquence d'ouverture)
- Direction : planche technique. Papier, encre noire, un seul rouge de
  repère, grille millimétrée, filets capillaires, repères d'angle et cotes.
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
