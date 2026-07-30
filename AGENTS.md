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
- Principe : **plan-séquence**. Il n'y a pas d'écrans qui se succèdent.
  Tout le contenu est posé une fois pour toutes sur un plan unique
  (`.intro-plane`) et une seule caméra le traverse sans jamais couper.
  Les mentions déjà lues ne disparaissent pas : la caméra les quitte, et
  le recul final les révèle alignées sur deux axes.
- Ne jamais réintroduire d'écrans qui se remplacent : c'est le défaut
  qu'on a corrigé, il se voit immédiatement.
- Pas de chiffres dans la séquence. Un résultat sans son contexte ne
  vaut rien, et le contexte ne tient pas dans le budget de texte : les
  chiffres restent dans le CV, où ils sont expliqués. La séquence porte
  le point fort du profil — son caractère hybride — pas la performance.
- Budget de texte : **~10 mots au total**. Un visiteur lit environ 2 mots
  par seconde sur un texte qu'il découvre ; au-delà, il décroche. Toute
  mention ajoutée doit en remplacer une autre.
- Rythme dicté par la lecture : arrêts de 1,25 à 2 s, déplacements de
  0,55 à 0,65 s. Les arrêts dérivent lentement (timing linéaire) pour que
  la caméra ne soit jamais figée ; les déplacements utilisent `--e-move`.
- Géométrie en `vmin` : la composition est proportionnelle à l'écran,
  donc aucune typographie responsive à régler. Le portrait a ses propres
  coordonnées et sa propre passe de caméra.
- Pilotage : `js/ui/intro.js` est le seul script classique bloquant du
  projet (décision avant premier rendu, donc sans clignotement). Il arme
  la séquence, lance la lecture après chargement des polices, gère le
  skip et retire l'overlay. Il sait aussi animer un compteur
  (`data-count-to`), capacité inutilisée depuis que les chiffres sont
  sortis de la séquence.
- Toutes les classes de la séquence sont cantonnées sous `.intro` : le CV
  utilise des noms voisins (`.proof-value`, `.dim`) et les écraserait.
- La séquence est ignorée si `prefers-reduced-motion: reduce` est actif ou
  si elle a déjà été jouée dans la session ; `#intro` force la relecture.
- Vérification : `cadrage.js` contrôle qu'à chaque arrêt le texte à lire
  tient dans l'écran, sur huit formats. Un contrôle de débordement global
  n'a pas de sens ici, une partie du plan est volontairement hors champ.

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
