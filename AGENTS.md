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
- Registre : des **énoncés de compétence**, pas des slogans. « L'expérience
  de 14 années de terrain », pas « Le terrain ». Chaque énoncé se suffit et
  reprend le vocabulaire du CV.
- Deux couches, jamais une seule. L'**énoncé** est ce qu'on lit : grand,
  encre ou forêt, contrasté. L'**habillage** (`.intro-sat`) est la matière
  qui l'entoure et le documente : mono, petit, en retrait, entrant et
  sortant par des bords variés. Sa taille et son ton doivent dire d'eux-mêmes
  qu'il n'est pas à lire. Un énoncé seul sur fond vide ne tient pas.
- Budget de lecture : **3 énoncés** d'environ 6 mots, ~1,8 s d'arrêt chacun.
  Un visiteur lit environ 2 mots par seconde sur un texte qu'il découvre.
  L'habillage ne compte pas dans ce budget, justement parce qu'on ne le lit
  pas — mais il ne doit jamais recouvrir l'énoncé.
- Rythme dicté par la lecture : arrêts de 1,75 à 1,95 s, déplacements de
  0,55 à 0,65 s. Les arrêts dérivent lentement (timing linéaire) pour que
  la caméra ne soit jamais figée ; les déplacements utilisent `--e-move`.
- **Pause finale de 1,5 s** entre la fin du recul (7,15 s) et le début du
  fondu (8,65 s). Le recul révèle les trois énoncés alignés : sans ce
  temps d'arrêt, la révélation passe sans être vue. Durée totale 9,1 s,
  au-delà des 8 s d'origine — c'est un arbitrage assumé en faveur du
  temps de lecture, le bouton Passer reste disponible à tout moment.
- Les instants sont absolus dans le CSS (`--entre`, `--sin`, `--trace`…)
  mais la caméra est en pourcentages de 9,1 s : toute modification de la
  durée totale impose de recalculer ses deux jeux de keyframes ET
  `TOTAL_DURATION` dans `js/ui/intro.js`.
- Couleur : la séquence ne définit aucune teinte, elle consomme la charte
  (`--ink-*`, `--forest-*`). Encre pour ce qui cadre, forêt pour ce qui
  produit — l'énoncé sur les solutions et outils est le seul en forêt.
  Un habillage reprend la couleur de l'énoncé qu'il documente.
  La flamme reste hors champ :
  sa règle de rareté la réserve aux chiffres, absents de la séquence.
  Ne pas réintroduire de palette propre à la séquence — une landing d'un
  ton étranger à son CV se lit comme un modèle plaqué.
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
- Vérification, trois contrôles complémentaires : `cadrage.js` (l'énoncé
  tient dans l'écran à chaque arrêt, huit formats), `sats.js` (aucun
  élément d'habillage hors champ pendant son arrêt) et `chevauche.js`
  (aucun habillage ne recouvre l'énoncé). Un contrôle de débordement
  global n'a pas de sens ici : une partie du plan est volontairement hors
  champ.
- L'habillage est volontairement à 4,2:1 et 3,4:1, sous le seuil AA pour
  du petit texte. C'est un choix : ce n'est pas du contenu, la scène est
  `aria-hidden` et le CV porte l'information. Les énoncés, eux, restent
  au-dessus de 7:1.

## Règles de modification
- Conserver les textes métier validés sans en modifier le sens.
- Préserver la compatibilité GitHub Pages avec des chemins relatifs.
- Privilégier des changements minimaux et sûrs.

## Typographie
- Huit paliers déclarés en tête de `css/base.css` (`--fs-display` →
  `--fs-label`), un rôle chacun. **Aucune taille en dur** dans
  `layout.css`, `components.css` ni `sections.css` : toute nouvelle règle
  consomme un palier. Le CV avait dix valeurs approximatives dont
  soixante-douze éléments au même corps — la hiérarchie retombait sur les
  cadres au lieu de l'échelle.
- Trois familles, trois rôles : `--font-display` (Archivo à chasse
  élargie) pour l'identité et les titres de section, c'est le lien visuel
  avec la séquence d'ouverture ; `--font-sans` (Manrope) pour la lecture ;
  `--font-mono` (JetBrains Mono) pour la seconde couche — libellés,
  étiquettes, dates, statuts, catégories. Tout ce qui donne du contexte
  sans être le message passe en mono.
- `css/print.css` a son propre système : il ne consomme pas ces paliers.

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
