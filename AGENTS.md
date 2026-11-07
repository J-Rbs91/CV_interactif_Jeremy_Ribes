# CV interactif

## Structure
- `index.html` : point d'entrée statique.
- `css/` : styles globaux et par section.
- `js/data/` : contenus et métadonnées affichés.
- `js/render/` : fonctions de rendu HTML.
- `js/ui/` : interactions UI simples.
- `js/render/renderSite.js` + `css/site.css` + `js/ui/site.js` + `js/ui/intro.js` :
  **la page**, son ouverture et sa navigation (voir « La page » et
  « L'ouverture »). `js/main.js` la monte une fois.
- `explorations/` : pages autonomes qui comparent des directions de design sur
  le contenu réel, **non publiées** (le déploiement ne copie que `index.html`,
  `css/`, `js/` et `assets/`). Sources dans `explorations/src/` ;
  `node scripts/build-explorations.mjs` injecte les données de `js/data/*.js` et
  la photo. Elles ne partagent aucun CSS avec le CV : ce sont des maquettes. La
  direction retenue (B, « Affiche ») est celle de la page.
- `css/layout.css`, `components.css`, `sections.css` : l'ancien affichage. **Ils ne
  gouvernent plus l'écran principal** mais restent chargés : la vue d'impression,
  le panneau d'export et la modale de contact s'en servent. Les renderers
  `renderOutils/Experiences/Competences/Projets.js` ne servent plus que le papier
  et le texte intégral (`expandAll`).
- `js/ui/icons.js` : **deux** jeux d'icônes en `currentColor`. `icon()` rend
  la grille 24 en trait de 1,8, pour les repères posés dans une ligne de
  texte. `boldIcon()` rend la grille 256 en aplat — les logos de réseaux et
  les marques du panneau de partage, qu'un contour rendrait
  indifférenciables. Ces glyphes-là viennent de Phosphor Icons (MIT), copiés
  plutôt qu'installés, mention de licence en tête du fichier.
- `js/render/renderPrint.js` + `js/ui/print.js` + `css/print.css` : vue
  d'impression, montée à la demande car le SPA n'affiche qu'une section.
  `renderPrintDocument()` sert désormais deux consommateurs : la commande
  d'impression, et le bloc de texte intégral d'`index.html` (voir plus bas).
- `js/render/renderCv.js` : le **recto A4**, second document servi par la même
  commande d'impression. `js/ui/print.js` choisit entre les deux selon le mode
  demandé (voir « Deux documents », plus bas).
- `js/render/renderExport.js` + `js/ui/exportPanel.js` + `css/export.css` : le
  panneau **« Partager & Exporter »**, seule porte vers le lien et vers les
  deux documents (voir la section dédiée).
- `js/ui/share.js` : la charge de partage, les six canaux et la copie du lien.
  L'URL vient de `contact.site` — le recto la porte aussi, et deux copies
  d'une même adresse finissent par diverger.
- `scripts/check-cv-a4.mjs` : `npm run check:cv` imprime le recto avec le
  Chromium local et échoue s'il sort en plus d'une page. Il rapatrie les
  polices réelles avant de mesurer — il demande donc le réseau, et n'est pas
  dans le workflow de déploiement pour cette raison.
- `scripts/check-navigation.mjs` : `npm run check:nav` conduit le CV dans le
  Chromium local et déclenche de vrais retours d'historique. Il échoue si un
  pas de côté entre sections empile une entrée, si une couche survit au geste
  retour, ou si une couche fermée ressuscite. Contrairement à `check:cv` et
  `check:typo`, il ne demande **aucun réseau** : la navigation ne dépend pas
  des polices.
- `scripts/check-typo.mjs` : `npm run check:typo` rend les trois surfaces —
  site, présentation complète, recto A4 — dans le Chromium local et relève
  ce que le navigateur a **réellement** composé, famille par famille et
  graisse par graisse. Il échoue sur les deux défauts qui ne s'écrivent nulle
  part : une famille absente (un bouton retombe sur la police du système) et
  une graisse absente (le navigateur en prend une autre sans le dire). Comme
  `check:cv`, il demande le réseau et n'est pas dans le déploiement.
- `scripts/build-cv-integral.mjs` + `package.json` : génération du bloc de
  texte intégral. `npm run build` l'écrit dans `index.html`, `npm run verify`
  échoue s'il est désynchronisé. Aucune dépendance : `type: module` sert
  seulement à ce que Node lise `js/**/*.js` comme des modules ES.
- `robots.txt`, `sitemap.xml` : autorisation explicite des robots, y compris
  ceux des modèles de langage, qui se taisent souvent sans règle les nommant.
- `assets/img/` : ressources image du projet.
- `assets/img/qr-cv.svg` : le code QR du recto A4, vers `contact.site.url`.
  Fichier figé, pas un rendu : il ne change que si l'adresse change, et se
  régénère alors à la main —
  `python3 -c "import segno; segno.make('<url>', error='m').save('assets/img/qr-cv.svg', scale=1, border=2, dark='#0c2740', light=None, xmldecl=False, omitsize=True)"`
  (segno installé hors projet : le dépôt reste sans dépendance). Symbole 4-M,
  37 modules ; à 18 mm de côté chaque module fait 0,49 mm, au-dessus du seuil
  de lecture d'un téléphone. Le réduire le rendrait décoratif.
- `assets/img/portrait/` : la photo affichée dans le CV. Elle est distincte
  du favicon et de l'`og:image`, qui ont leurs propres contraintes de
  cadrage — les confondre ferait dépendre trois usages d'un seul fichier.
- `docs/charte-couleurs.md` : charte colorimétrique sémantique.
- `docs/charte-typographique.md` : les trois familles, les dix paliers, les
  trois interlettrages et les deux pièges qui ne s'écrivent nulle part.
- `.github/workflows/deploy-pages.yml` : publication sur GitHub Pages. Le
  déploiement ne passe plus par le workflow géré par GitHub, qui n'était pas
  modifiable et traînait des actions sur une version de Node dépréciée. Le
  job vérifie d'abord que le texte intégral est à jour (`npm run verify`),
  puis recopie `index.html`, `robots.txt`, `sitemap.xml`, `css/`, `js/` et
  `assets/` dans `_site` avant de téléverser : toute ressource ajoutée hors
  de ces six entrées doit être déclarée là, sinon elle ne sera pas publiée.

## La page — un document qui défile, noir, un seul accent
Le CV est **une page unique** (`js/render/renderSite.js`, `css/site.css`), pas une
application à six écrans exclusifs. Elle vient d'une exploration (`explorations/
b-affiche.html`) calquée sur des portfolios de 21st.dev. Ce qui suit ne se voit
pas dans le code — seulement à l'écran, quand ça manque.

- **Montée une fois.** `main.js` rend la page puis branche. Plus rien ne la
  reconstruit : le focus, les fiches ouvertes et la position de défilement ne se
  perdent donc jamais en cours de lecture. Une fiche est un `<details>` natif :
  clavier, lecteur d'écran et recherche dans la page sont gérés par le
  navigateur, et il n'y a plus de `syncAccordion` ni de panneau `inert` à tenir.
- **Tout est préfixé `s-`.** `components.css`, `sections.css` et `layout.css`
  restent chargés — la vue d'impression, le panneau d'export et la modale s'en
  servent — et un nom commun laisserait l'ancien style s'appliquer à la nouvelle
  page. Ces trois feuilles ne gouvernent plus l'écran principal ; elles sont de la
  dette à purger par morceaux, pas à étendre.
- **`renderSite.js` ne rédige rien.** Chaque chaîne vient de `js/data/`. Trois
  exceptions, toutes des phrases d'appui : la mise en valeur d'un groupe de mots
  dans les deux citations (`<em>`, sans effet si la phrase change), « Voir le
  poste », et la phrase d'Opti'Profit (voir plus bas).
- **Un seul accent : le fluo (`--s-acc`).** Le cuivre (`--s-hot`) est réservé aux
  chiffres mesurés. La page est **noire quel que soit le réglage de l'appareil** :
  c'est son parti pris. `editorial-signal.css` porte les jetons sombres sous
  `@media screen` (et non plus `prefers-color-scheme`) pour que le panneau
  d'export et la modale, qui les consomment, lui ressemblent. Le papier n'a pas de
  thème : la borne `screen` empêche d'imprimer du texte clair sur du blanc.
- **La preuve est rattachée au poste, pas jetée en tête de page.** Le +83 % vit
  dans la fiche Générale d'Optique : pastille discrète sur la ligne fermée,
  paragraphe avec sa base de comparaison dans la fiche. Un chiffre sans son
  contexte ne vaut rien.
- **Opti'Profit rappelle le chiffre comme CONTEXTE, jamais comme résultat.** Les
  données disent que relance, équipe et réorganisation ont joué ensemble : la
  fiche renvoie au poste (« Voir le poste ») et le dit en une phrase. Cette
  phrase est la seule qui ne vient pas des données ; la retirer ferait attribuer
  +83 % à un outil, ce qu'aucun entretien ne tiendrait.
- **Les enseignes ne se coupent qu'entre elles** — mais seulement quand il y en a
  plusieurs (`company()`). Un nom à une seule enseigne en `nowrap` débordait sur
  la colonne voisine à toute largeur.
- **Les titres de section se remplissent au défilement**, de 80 % à 20 % de la
  hauteur d'écran. Les bornes sont posées sur la position du **haut** du titre
  (`view(block 20% 20%)`, `entry 0%` → `contain 100%`), pas sur un pourcentage de
  `cover` : celui-ci dépend de la hauteur du titre, donc de la largeur d'écran.
  Un remplissage sur 28 % de l'écran était « trop rapide », et dans la moitié
  basse il n'était pas remarqué. Repli par script (`--p`) pour les navigateurs
  sans `animation-timeline`, même plage ; mouvement réduit : titres pleins.
- **Les lettres du nom suivent le pointeur** : chasse (62–125 %) et graisse
  d'Archivo varient avec la distance. C'est ce qui impose de charger Archivo
  **à axes variables** (`wdth,wght@62..125,100..900`) dans `index.html`. Les
  centres des lettres se mesurent une fois, au repos : mesurés en mouvement, ils
  bougeraient avec l'effet. Souris seulement, jamais pendant l'ouverture. Sur
  téléphone, où il n'y a pas de pointeur, le nom respire seul, peu.
- **La photo est une bichromie qui suit le lettrage** : niveaux de gris, puis
  l'accent mélangé à 25 % à un blanc cassé, multiplié. Multiplier l'accent pur
  saturait les clairs (81 %) ; à 25 % ils tombent à 23 %.
- **Le gras est fixé à 700.** `<strong>` dans un paragraphe en 700 devient `bolder`,
  donc 900 — une graisse que la police ne charge pas, et que `npm run
  check:typo` fait échouer.
- **Deux rangées de navigation sous 1100 px.** Le nom, six entrées et deux
  commandes ne tiennent pas sur une rangée en deçà : les entrées passent sur une
  seconde, qui défile, avec un masque de débord.

## L'ouverture — jouée sur la vraie page
**Il n'y a pas de séquence séparée.** L'ancienne ouverture était une scène qui se
fondait vers le CV par un sosie du nom qui voyageait : un raccord à mesurer, donc
un raccord qui pouvait se décaler. La nouvelle joue **sur la page d'accueil
elle-même** — les lettres, la photo, la ligne de poste, la barre sont les éléments
définitifs, animés de leur départ à leur repos. La dernière image est la page :
il n'y a rien à raccorder.

- **Révélation par balayage en dégradé.** Les lettres sont à leur forme définitive
  dès la première image ; seul un masque (`mask-image`, bord de 45 % de la hauteur)
  monte du pied des lettres, mot par mot. La photo n'arrive qu'une fois le nom
  entièrement révélé, puis la ligne de poste, la barre et la flèche. 3,7 s.
- **`backwards`, jamais `forwards`.** L'état d'arrivée est celui que la feuille
  déclare déjà ; seuls les `from` sont écrits. Une valeur recopiée dans une
  keyframe finale divergerait au premier réglage, et ce serait un saut d'une image.
- **Chaque mot porte une marge intérieure compensée par une marge négative**, en
  colonne flex : le masque rogne tout ce qui sort de sa boîte, et sans cela
  l'accent du É et le crochet du J étaient coupés. En flex, car les marges
  négatives de deux blocs adjacents fusionnent.
- **Tout démarre après les polices** (`intro-wait`, animations en pause) : sinon le
  nom serait recomposé en pleine animation quand Archivo remplace la police de
  repli. La **fin se lit sur les animations finies** de la page : la durée n'est
  écrite nulle part dans le script, et le verrou de défilement ne peut pas se
  lever avant la fin.
- **`scrollbar-gutter: stable`** : sans place réservée, rendre le défilement à la
  fin décalerait la page de la largeur de la barre.
- **`js/ui/intro.js` est un script bloquant du `<head>`** qui pose `js-actif`,
  `intro-play`, `intro-wait`, `intro-lock` avant le premier rendu. **Les animations
  ne s'appliquent que sous `html.intro-play`** : sans elle (deuxième visite, lien
  profond, mouvement réduit) la page est à son repos dès la première image. Elles
  s'appliquaient d'abord en permanence et rejouaient à chaque visite, seul le
  verrou étant conditionnel. Garde-fou : classes retirées d'office à 8 s si le
  module principal ne charge jamais.
- **Jouée une fois par session** (`cv-intro-played`), ignorée sur lien profond
  (`#outils`) et en mouvement réduit ; `#intro` la force. « Passer », Échap et
  Entrée sautent à l'état final.
- **Mesuré, pas estimé** : l'image de fin est comparée à la page au repos
  (mouvement réduit = aucune animation) — 0 pixel de différence sur grand écran,
  et 0 pixel au premier instant de la respiration sur téléphone. **Le verrou se
  teste avec une vraie molette**, jamais avec `scrollTo` : un défilement
  programmé contourne `overflow: hidden` et « prouvait » un verrou qui n'en était
  pas un.

## Lisibilité par les lecteurs automatiques

Un CV est lu par des machines avant de l'être par une personne : moteurs,
agrégateurs, outils de tri de candidatures, et surtout les IA auxquelles un
recruteur donne l'URL. Presque aucun de ces lecteurs n'exécute de
JavaScript. Or le document livré ne contient qu'un `#app` vide.

- **Le bloc `#cv-integral`, en tête de `<body>`, porte le CV entier** —
  toutes sections, toutes fiches dépliées. Il est **généré** par
  `scripts/build-cv-integral.mjs` depuis `js/data/*.js`, via
  `renderPrintDocument()`. Il ne se modifie pas à la main : on modifie les
  données, puis on relance `npm run build`. La CI refuse un `index.html`
  désynchronisé.
- **Le repli manuel en `<noscript>` a été supprimé.** Il portait la consigne
  de rester aligné sur les données et ne l'était plus : un tiers du contenu
  affiché à l'écran n'y figurait pas. Une copie manuelle d'une source de
  vérité finit toujours par mentir. Ne pas en réintroduire.
- **Le masquage passe par une règle CSS**, `html.js-actif #cv-integral`, et
  non par `hidden` ou `aria-hidden` : ces deux attributs sont interprétés par
  les extracteurs de contenu, qui écarteraient alors le seul endroit où le CV
  leur est accessible. La classe est posée par `js/ui/intro.js`, script
  bloquant du `<head>`, donc avant le premier rendu — le bloc n'apparaît
  jamais à qui a JavaScript. Une règle de feuille de style retire bien le
  bloc de l'arbre d'accessibilité : les lecteurs d'écran suivent
  l'application, pas la copie.
- **Le bloc reste hors de `#app`.** Placé dedans, `render()` l'effacerait au
  premier rendu et les robots qui exécutent le JavaScript perdraient tout
  sauf la section active.
- **Les identifiants du bloc généré sont préfixés `cv-`.** Le document
  imprimable et l'application décrivent les mêmes fiches et portent donc les
  mêmes `id` ; ils coexistent ici dans un seul document.
- **Rien de décoratif ne doit précéder le CV dans le texte du document.** Les
  mots de la séquence d'ouverture vivaient en clair dans `<body>` : les
  extracteurs les lisaient à la place du CV, et en tiraient un titre de poste
  qui n'est pas celui du CV. Ils sont désormais dans un `<template>`, dont le
  contenu est un fragment inerte absent de l'arbre du document. `bindOverlay`
  les met en place au chargement, avant que `.is-playing` n'arme quoi que ce
  soit.
- **Une séparation portée par le CSS n'est jamais extraite.** Les adresses en
  ligne doivent conserver un séparateur textuel, y compris hors impression,
  pour rester lisibles par les extracteurs sans mise en page.
- Le JSON-LD `Person` du `<head>` reste un filet, pas la solution : beaucoup
  d'extracteurs l'ignorent. Il doit néanmoins rester cohérent avec les
  données lorsqu'on modifie un intitulé, une date ou un chiffre.

## Circulation — ce qui se casse sans se voir

Quatre mécanismes de navigation n'ont aucun symptôme visible dans le code
quand ils sont défaits. Ils se constatent à l'usage, et seulement là.

- **Le geste retour rejoue la pile d'historique, jamais l'arbre du
  document.** Les six sections sont des **frères** : aller de l'une à l'autre — au
  clic comme au défilement — **remplace** l'entrée courante (`poserSection`) au
  lieu d'en ajouter une, sinon quitter le CV coûterait autant d'appuis que de
  sections lues. Le panneau d'export et la modale de contact sont des **couches** :
  elles empilent une entrée à l'ouverture et la consomment à la fermeture, sinon le
  geste retour quitte la page au lieu de refermer le panneau — défaut invisible sur
  un ordinateur, où personne n'appuie sur retour. Rien n'est intercepté : c'est le
  navigateur qui dépile. Toutes les fermetures — bouton, Échap, clic sur le fond,
  geste système — passent par `fermerCouche()`. Le contrat est dans
  `js/ui/backNavigation.js` ; `npm run check:nav` le vérifie dans un vrai
  navigateur (ses sélecteurs visent `.s-nav-item`, ses assertions n'ont pas changé).
- **L'adresse suit le défilement, et elle commande.** `js/ui/site.js` élit comme
  section affichée la dernière dont le haut a franchi le tiers supérieur de
  l'écran, et réécrit `#section`. Pendant un défilement lancé par un clic, ce suivi
  est suspendu : sinon la navigation clignoterait sur chaque section traversée. Une
  adresse modifiée à la main est suivie (`hashchange`) ; **un fragment inconnu
  retombe sur Profil** à l'arrivée *et* en cours de session — sans quoi la barre
  d'adresse annoncerait une section que l'écran ne montre pas (c'est
  `check:nav` qui l'a détecté).
- **Une fiche n'est pas une destination.** Ouvrir ou fermer un `<details>` n'écrit
  aucune entrée d'historique : le geste retour doit quitter la section, pas
  refermer une fiche.
- **La modale fermée porte `inert`, jamais `aria-hidden`.** Elle reste dans
  le document en `opacity: 0` pour que sa transition d'ouverture ait un état
  de départ — même raison que les panneaux d'accordéon. Mais elle contient
  cinq éléments focalisables : avec le seul `aria-hidden`, la douzième
  tabulation déposait le focus sur sa croix de fermeture, invisible et sans
  contour, et un lecteur d'écran annonçait du vide pendant que le focus
  était réel. `inert` retire d'un seul attribut le parcours clavier et
  l'arbre d'accessibilité ; `aria-hidden` en plus rouvrirait la
  contradiction. La fermeture **rend le focus avant** de poser `inert` : un
  élément qui devient inerte en portant le focus le perd au profit du
  `<body>`, et le clavier repartirait du haut de la page.
- **Les documents ont une porte visible**, et c'est le panneau « Partager &
  Exporter ». `renderPrintDocument()` produit le CV entier ; il n'était
  atteignable que par la commande d'impression du navigateur, soit dix-sept
  interactions pour un lecteur qui voulait tout voir.
- **Le document exporté s'appelle « Présentation complète », jamais
  « CV complet ».**
  Un CV est un recto A4 : le mot promet une forme, et le document en fait
  six pages, toutes fiches dépliées. L'écart ne se constate qu'après le clic,
  quand le geste est déjà engagé, et ce qui s'ouvre alors n'est pas un CV
  trop long — c'est un autre objet, un dossier. « CV complet · PDF » désigne
  le recto A4, et lui seul.
- **La navigation porte `short`, pas `label`.** En étroit elle défile sur une
  seconde rangée ; des libellés longs la rendraient interminable, et `aria-label`
  garde le nom complet pour les lecteurs d'écran.

## Règles de modification
- Conserver les textes métier validés sans en modifier le sens.
- Préserver la compatibilité GitHub Pages avec des chemins relatifs.
- Privilégier des changements minimaux et sûrs.
- **Le gras compose une deuxième couche de lecture**, qu'on le veuille ou
  non : un lecteur en diagonale ne lit qu'elle. Elle doit former un énoncé
  complet quand on ne lit qu'elle — le test est mécanique, on masque tout
  sauf le gras et on relit — et rester **sous 30 % du bloc**. Au-delà, elle
  ne hiérarchise plus rien, elle alourdit. Un passage par bloc suffit.
- **Un résultat mesuré sort du corps de texte.** Le chiffre est le plus fort
  aimant visuel d'une page, et le seul élément qu'un lecteur en diagonale
  s'arrête pour vérifier ; laissé dans la phrase, il ne se voit pas. Les
  champs `stats` / `statsLabel` / `statsBase` existent pour ça. La règle de
  rareté de la flamme les plafonne : trois à cinq valeurs par section, pas
  davantage — au-delà elles se banalisent, et c'est leur rareté qui fait
  tout leur poids.

## Typographie
**Portée.** Les règles de cette section décrivent le système des feuilles
historiques (`base.css`, `components.css`, `sections.css`, `export.css`) — donc le
panneau d'export, la modale et le papier. **La page (`site.css`) a sa propre
échelle**, fluide (`clamp()` en `vw` pour les titres), dans les mêmes trois
familles. Elle garde trois règles de cette section : une graisse hors de la liste
servie est un défaut silencieux (`npm run check:typo`), `<strong>` est fixé à 700,
et `font-stretch: 125%` se déclare partout où Archivo est consommé.
- Dix paliers déclarés en tête de `css/base.css` (`--fs-display` →
  `--fs-label`, dont `--fs-wordmark`, le nom d'employeur : un plafond, la taille
  réelle suit la colonne), un rôle chacun. **Aucune taille en dur** dans
  `layout.css`, `components.css` ni `sections.css` : toute nouvelle règle
  consomme un palier. Le CV avait dix valeurs approximatives dont
  soixante-douze éléments au même corps — la hiérarchie retombait sur les
  cadres au lieu de l'échelle.
- Le titre de section est à 54 px, contre 38 auparavant. L'échelle était
  déclarée mais pas visible : 90 % de la surface tenait entre 11 et 18 px.
  La séquence oppose 45 px à 17 px sur un écran vide — le titre de section
  reprend ce rapport. Ne pas le redescendre sans redescendre aussi
  `--space-5` / `--space-6`, qui lui donnent le vide dont il a besoin.
- Une seule graisse forte à la fois. Il y avait jusqu'à douze objets en 800
  sur un même écran : plus rien ne hiérarchisait. La seconde couche (mono)
  est en 500, pas en 700.
- Trois familles, trois rôles : `--font-display` (Archivo à chasse
  élargie) pour l'identité et les titres de section, c'est le lien visuel
  avec la séquence d'ouverture ; `--font-sans` (Manrope) pour la lecture ;
  `--font-mono` (JetBrains Mono) pour la seconde couche — libellés,
  étiquettes, dates, catégories. Tout ce qui donne du contexte sans être le
  message passe en mono.
- **La frontière est « ce qui classe », pas « ce qui est court ».** Le
  registre mono cumule quatre facteurs de ralentissement : 11 px, capitales,
  `0.16em` d'interlettrage, et un contraste au plancher du seuil AA. Les
  capitales suppriment en plus la silhouette du mot, qui est ce qui permet
  la lecture rapide. On n'y met donc que ce qui ne se lit pas en continu.
  Les statuts d'outil en sont sortis (`.tool-status`, `.tl-outcome-label`) :
  « Transmis à la demande du directeur régional GrandVision » et « Resté en
  service après mon départ » ne donnent pas de contexte, ce sont les seules
  preuves d'adoption par des tiers du document — la différence entre « il a
  fait des outils » et « ses outils sont utilisés sans lui ». Avant de poser
  du mono sur un contenu, se demander s'il classe ou s'il affirme.
- **Une mesure de lecture, `--mesure` (62ch).** La fenêtre monte à 1 600 px
  et la colonne de contenu à plus de 1 100 : un résumé d'outil y tenait sur
  une seule ligne de plus de cent quarante signes, et le statut, poussé au
  bord droit par un `margin-left: auto`, se retrouvait à neuf cents pixels
  du titre qu'il qualifie. En `ch` et non en pixels : une mesure suit le
  corps du texte qu'elle borne. Elle est neutralisée à l'impression, où la
  page borne déjà la colonne.
- **62ch et non 74, et le `ch` est un piège.** Il vaut la largeur du « 0 »,
  plus étroite que la moyenne des lettres de Manrope : à 74ch la borne
  rendait 85 à 89 signes par ligne, déjà au-dessus de la plage de confort de
  45 à 75. La valeur n'était pas fausse, son unité ne dit pas ce qu'on croit
  qu'elle dit. Toute modification de `--mesure` se vérifie sur le rendu, en
  comptant les signes d'une ligne, jamais sur le nombre écrit dans le CSS.
- **Elle borne toute la prose.** (Règle de l'ancien affichage, encore vraie pour le
  papier et le panneau d'export ; la page a ses propres mesures dans `site.css`.)
  Elle ne tenait que les accordéons — bouton, résumé et panneau ensemble, sinon
  le contour de focus encadre du vide. Les puces d'expérience et de projet,
  le contexte de poste et le chapeau d'Outils couraient pendant ce temps
  jusqu'à 136 signes, soit le double, dans les sections qu'un lecteur ouvre
  en premier. Une mesure qui ne s'applique qu'à une partie des textes ne
  repose pas l'œil : elle lui demande de se recalibrer d'un bloc à l'autre.
  Tout nouveau conteneur de prose la consomme, et `css/print.css` la relâche
  dans la même liste — une borne d'écran oubliée là rogne la colonne pendant
  que le bloc du dessous prend toute la largeur.
- **Trois interlettrages de capitales, déclarés dans `base.css`.** Une
  capitale espacée n'a plus de silhouette de mot : l'espacement est ce qui
  lui rend une forme. Le projet en portait sept valeurs — de 0.08 à 0.2 —
  réparties dans six fichiers, et aucune ne distinguait un rôle d'un autre.
  `--track-cap` (0.16em) pour le libellé mono à l'écran, `--track-cap-print`
  (0.1em) pour le même au papier, où la page ne peut pas payer la largeur et
  où l'encre rend ce que l'espacement donnait, `--track-cap-title` (0.14em)
  pour les capitales de titre. Une valeur unique serait fausse quelque part :
  l'espace grandit avec le corps, et ce qui est juste à 11 px est disloqué à
  7 pt.
- **La chasse élargie se déclare partout où `--font-display` est consommé**,
  même là où elle paraît redondante. Google ne sert qu'une seule chasse
  d'Archivo (125 %), donc un titre sans `font-stretch` sort quand même
  élargi — tant que la police vient de là. Le lecteur qui a une Archivo
  installée sur son poste, lui, a l'axe complet : la même règle lui rend un
  titre à 100 %, et la page change de voix sans qu'aucun test local ne le
  montre.
- **Un contrôle de formulaire n'hérite pas la famille du document.** Un
  `button` sans réglage sort dans la police d'interface du système. Le
  panneau d'export a composé pendant des mois le titre et le résumé de
  chaque document en Arial, à côté de titres Archivo, dans la même fenêtre :
  la règle qui manquait ne s'écrivait nulle part, donc il n'y avait rien à
  relire. `base.css` pose `font: inherit` sur `button, input, select,
  textarea` — sur le **nom d'élément**, à la spécificité la plus faible, pour
  que toute classe la reprenne sans lutter. Ne pas reposer ce réglage sur une
  classe : `.contact-row button` le faisait, gagnait contre
  `.contact-form-trigger`, et rendait à la police de lecture les deux
  commandes que le CV voulait en mono.
- **Une graisse absente ne rate pas, elle glisse.** Demander un 600 à
  JetBrains Mono, chargée en 400, 500 et 700, donne un 700 — et le CSS
  continue d'afficher 600. Les graisses réellement servies sont celles de
  l'adresse de `index.html`, et rien d'autre : Archivo 700 et 800, JetBrains
  Mono 400, 500 et 700, Manrope de 400 à 800. Elles ne coûtent pas un fichier
  chacune, les trois familles étant servies en variable — le nombre n'est
  donc pas un budget, mais toute valeur hors liste est un défaut silencieux.
  `npm run check:typo` en fait échouer le contrôle.
- `css/print.css` a son propre système de **tailles** : il ne consomme pas
  ces paliers. Il consomme en revanche les familles, les interlettrages et
  la chasse — un document qui titrerait dans une autre police que la page
  qui le produit ne serait pas un autre système, seulement une divergence.
  C'était le cas : la présentation complète titrait en Manrope pendant que
  l'écran et le recto titraient en Archivo.
- **Le registre mono est en 500 à l'écran et en 700 au papier**, et cette
  différence-là est voulue : à 7 pt, une graisse de plus rend au libellé ce
  que la taille lui retire, et l'encre ne s'épaissit pas comme un pixel
  allumé. Ce qui n'allait pas n'était pas la valeur, c'était qu'elle ne
  couvrait que la moitié des libellés du document.

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
- **La page est noire, à un accent.** `css/site.css` porte ses propres jetons
  (`--s-bg`, `--s-fg`, `--s-dim`, `--s-acc` fluo, `--s-hot` cuivre). Contrastes
  sur le fond (#0a0a0a) : texte courant 13,7:1, atténué 7,3:1, accent 16,8:1,
  cuivre 9,7:1. Le panneau d'export et la modale consomment, eux, les jetons
  d'`editorial-signal.css` (échelle d'encre retournée, sous `@media screen`).
  Les paragraphes « forêt / flamme » ci-dessus décrivent le modèle de données et le
  papier ; à l'écran, `nature` n'a plus de couleur.
- Pas d'emoji dans l'interface : ils sont multicolores et contredisent la
  charte. Ajouter un tracé à `js/ui/icons.js` et appeler `icon("nom")`.

## Deux documents sortent par la même commande

Les deux lignes d'export du panneau appellent `printDocument(mode)`, exporté
par `js/ui/print.js`. Elles ne diffèrent que par le mode demandé — `cv` ou
`integral`.

- **Une fonction exportée, pas un `[data-print]` relié à chaque rendu.** Le
  panneau doit se fermer avant d'imprimer : la fenêtre d'impression prend la
  main sur toute la page, et le lecteur qui en revient retrouverait l'écran
  qu'il venait de quitter. Un attribut relié en aveugle imposerait l'ordre
  inverse.
- **La commande monte la vue elle-même, elle n'attend pas `beforeprint`.**
  C'était l'inverse. Tant qu'il n'y avait qu'un document à sortir, l'événement ne
  pouvait rien rendre d'autre que le bon, et son absence ne coûtait qu'une
  impression vide. Avec deux documents il porte le choix de l'utilisateur, et
  le remettre à un événement que ce fichier documente déjà comme non garanti
  — le repli Safari est là depuis le début — fait dépendre ce qui sort du
  navigateur plutôt que du bouton pressé. Monter depuis le bouton ne duplique
  rien : `mountPrintView()` est idempotent.
- **Deux variables d'état, `requestedMode` et `mountedMode`, et pas une.**
  Elles peuvent diverger, et c'est ce cas qui casse : une vue montée puis
  jamais démontée — un navigateur qui n'émet pas `afterprint` suffit — restait
  servie telle quelle à l'impression suivante, le second bouton renonçant à la
  reconstruire parce que `printView` existait déjà. Il sortait alors le
  document de l'autre. Comparer les modes plutôt que tester la présence de la
  vue rend l'état impossible à désynchroniser.
- **Le mode demandé survit au cycle d'impression.** Il revenait au défaut au
  démontage, pour qu'un Ctrl+P — qui n'a traversé aucune commande du site,
  donc n'a rien pu déclarer — sorte la présentation complète. Cette remise à
  zéro partait d'un cycle en une passe. **Chrome sous Android en fait deux** :
  il émet `afterprint` dès qu'il passe la main au service d'impression du
  système, puis rend la page une seconde fois pour fabriquer le PDF. La
  première passe rendait la main au défaut, la seconde sortait la
  présentation complète à un lecteur qui avait demandé le recto. Le mode reste
  donc posé jusqu'à ce qu'une autre commande en déclare un autre ; la commande
  du navigateur sert le dernier document demandé.
- **Rien n'étire le document imprimé à la hauteur de la page.** `base.css`
  pose `min-height: 100vh` sur `html` et `body` ; en pagination, `vh` vaut la
  zone imprimable, et la boîte du document faisait donc exactement une page
  quel que soit son contenu — 260 mm de recto étirés à 266. Rien ne s'y
  voyait, mais la tolérance était nulle : un arrondi inframillimétrique
  suffisait à faire basculer ce trop-plein de blanc en une seconde page vide.
  `print.css` remet donc `min-height: 0`, et tout ajout au recto se mesure
  contre les 266 mm réels, pas contre une page qui se remplit toute seule.
- **Les deux jeux de règles CSS ne se croisent jamais.** Le recto préfixe tout
  en `cv1-` et ne réutilise aucune classe de la vue intégrale. C'est délibéré :
  les règles de la présentation recomposent des composants d'écran étalés sur
  plusieurs pages, celles du recto composent une page unique dont la hauteur
  est la contrainte principale. Mélangées, un réglage pris pour la pagination
  de l'une casserait la tenue en une page de l'autre sans qu'aucun sélecteur
  ne le laisse voir.

## Partager & Exporter

La ligne de contact portait quatre commandes de front : partager, le recto A4,
la présentation complète, me contacter. Trois répondaient à la même question —
comment j'emporte ce CV — et se disputaient la même ligne, chacune payant le
prix d'une décision à prendre avant d'avoir compris ce qu'elle offrait. Sur un
téléphone, elles occupaient quatre lignes pleines au-dessus du premier mot du
CV. Elles sont maintenant derrière une porte unique.

- **Le panneau classe, il n'énumère pas.** D'un côté le lien, qui circule ; de
  l'autre les documents, qui se déposent. C'est la seule distinction dont le
  lecteur a besoin, et elle se lit avant de cliquer.
- **Il est composé comme le recto A4, pas comme une modale de site.** Même
  gouttière de libellé en mono capitale, mêmes filets fins, même titre sous un
  trait épais, aucune carte, aucun rayon. Le panneau donne accès au document :
  autant qu'il en ait déjà l'air. La gouttière est constante sur tout le
  panneau — une gouttière qui se décale d'un bloc à l'autre n'est plus une
  colonne.
- **`css/export.css` ne partage aucune classe avec `css/print.css`**, pour la
  raison qui sépare déjà le recto de la présentation complète : l'un compose
  du papier sous contrainte de hauteur en millimètres, l'autre un écran sous
  contrainte de pouce en pixels.
- **Six canaux, et pas un de plus.** LinkedIn d'abord — le seul dont le
  partage vaut recommandation professionnelle ; WhatsApp et SMS ensuite, parce
  qu'un lien de CV se transfère d'un téléphone à l'autre plus souvent qu'il ne
  se publie ; l'e-mail parce que c'est encore ce qu'un recruteur verse à un
  dossier. Facebook et X ferment la liste.
- **`mailto:` et `sms:` n'ouvrent pas d'onglet.** Ils passent la main à une
  application du système : une nouvelle fenêtre laisserait un onglet vide
  derrière le client de messagerie. Seuls les canaux web portent `target`.
- **Le partage du système n'apparaît que là où il existe.** Sur un poste de
  travail, `navigator.share` est absent et le bouton serait une promesse sans
  suite. C'est le seul élément du panneau dont la présence dépend de
  l'appareil.
- **La copie rattrape le refus, elle ne se contente pas de tester l'API.** Le
  presse-papiers moderne existe mais rejette sa promesse quand la permission
  manque ou que le document n'a pas le focus : sans rattrapage, le repli par
  champ temporaire n'était jamais tenté et le lecteur lisait « Échec » devant
  une copie qui aurait abouti par l'autre voie. La confirmation se dit sur le
  bouton lui-même, là où le geste a eu lieu — pas dans une bulle flottante que
  le regard a déjà quittée.
- **Fermer, puis imprimer, et dans cet ordre.** Le panneau se ferme d'abord,
  le document part au cadre suivant. L'inverse rouvrirait le lecteur, au
  retour de la fenêtre d'impression, sur l'écran qu'il venait de quitter.
- **Panneau fermé : `inert`, et le focus rendu avant.** Même règle et même
  raison que la modale de contact, plus haut.
- **Les logos de réseaux sont des aplats, pas des contours.** Un LinkedIn et
  un Facebook en trait de 1,8 sur vingt pixels sont interchangeables. D'où
  `boldIcon()` et la grille 256 de Phosphor : c'est une seconde grille, pas un
  réglage de la première. Les redessiner à la main aurait été plus long, moins
  fidèle et sans meilleure licence.

## Le recto A4 — un CV en compétences
- **Ce n'est pas une miniature du site.** C'est la règle dont tout le reste
  découle. Le site démontre et explique — chaque fiche déroule situation,
  arbitrage, réponse, constat ; le recto sélectionne. Une page qui réduirait
  chaque section d'un facteur six rendrait tout égal, donc rien lisible.
- **La matière différenciante est dans les compétences et leurs preuves**, pas
  dans le nombre de réalisations. Les compétences occupent donc le tiers de la
  page, et la chronologie un cinquième : le parcours ne raconte plus les
  postes, il donne la profondeur de terrain qui rend les compétences
  crédibles. Une ligne de repères par poste, sans puces.
- **Hiérarchie de la page**, et elle n'est pas celle du site : nom, fonction
  visée et territoires, accroche en un paragraphe, cinq compétences prouvées,
  résultats et adoption, parcours condensé, puis projets / méthodes /
  formation en mentions de pied.
- **La fonction visée précède les territoires**, et c'est le seul endroit du
  projet qui la porte. Le bandeau disait très bien ce que je sais faire et pas
  une fois quel poste je cherche : un lecteur qui trie des candidatures veut
  d'abord ranger le dossier quelque part, et quatre domaines de compétence ne
  rangent rien. Elle prend donc la capitale, l'interlettrage et la forêt ; les
  territoires descendent d'un cran, en encre — deux lignes fortes côte à côte
  ne hiérarchisent rien. Le site, qu'on lit en entier, se présente par ce
  qu'il démontre ; une feuille lue en trente secondes se présente par ce
  qu'elle vise.
- **`renderCv.js` ne rédige rien.** Chaque chaîne vient de `js/data/`. Une
  phrase composée dans le fichier de rendu serait une copie qui dérive au
  premier ajustement des données — c'est le défaut du `<noscript>` supprimé.
- **La sélection appartient aux données.** `a4Rank` donne l'ordre des
  compétences sur le papier — l'organisation d'abord, qui est le territoire
  revendiqué, et non la performance commerciale, qui en est un résultat.
  `a4Statement` énonce la compétence pour un lecteur sans le site sous les
  yeux, `a4Proofs` porte les faits qui l'établissent, `a4Summary` la ligne de
  repères d'un poste, et `a4Content` les synthèses que le site n'a pas à
  faire.
- **Trois preuves, dans cet ordre : impact économique, adoption terrain,
  transférabilité.** Elles répondent à « ça marche ? », « c'est utilisé ? »,
  « ça survit à son auteur ? ». Une quatrième diluerait la première, seule à
  porter un chiffre — et seule, pour cette raison, à prendre la flamme.
- **Deux registres de titre, et deux seulement.** Les trois blocs qui portent
  la démonstration prennent la pleine largeur sous un filet ; les trois
  mentions de pied prennent la gouttière de libellé en mono. Ce n'est pas une
  variation de style : c'est ce qui dit où s'arrête la démonstration.
- **L'accroche n'a pas de libellé.** Posée sous le bandeau, sa place dit ce
  qu'elle est, et la gouttière de 30 mm lui coûtait deux lignes de repli pour
  un mot que personne ne lit. C'est le seul bloc du document dans ce cas.
- **Un paragraphe d'accroche, pas deux.** Le déplacement du profil et la
  méthode disaient juste et tenaient six lignes en tête de page. Un lecteur
  qui accorde trente secondes à une feuille n'en dépense pas cinq sur une
  profession de foi. Les deux idées restent, une phrase chacune ; ce qui est
  parti était de la redite — deux des cinq compétences qui suivent, et
  l'énumération des formes de réponse que le verbe portait déjà.
- **Le blanc rendu par une coupe va aux intervalles, pas au contenu.** C'est
  toute la différence entre alléger et faire de la place : une page qu'on
  vide de 48 mots pour y remettre autre chose n'a rien gagné. Les 15 % de
  texte retirés sur cette passe sont allés aux marges entre compétences,
  entre blocs et sous l'accroche — et le reste au blanc de pied, qui est la
  tolérance d'impression du document.
- **Un code QR, pas des adresses en ligne.** Les quatre URL qui occupaient le
  bandeau ne servaient à rien : le lecteur arrive du site, lui rendre le chemin
  par lequel il est venu ne lui apprend pas grand-chose, et c'était le seul
  élément technique d'un en-tête par ailleurs calme. Mais une feuille se
  détache de son support — imprimée, versée à un dossier, transférée — et n'a
  alors plus aucune voie de retour, faute d'e-mail ou de téléphone dans les
  données. Le QR résout les deux : il ne se lit pas, donc ne coûte aucune
  ligne, et il rouvre le chemin depuis le papier. Le jour où un e-mail existe,
  il vient à côté, pas à la place.
- **La photo reprend son rond avec `!important`.** La règle `*` en tête de
  `print.css` pose `border-radius: 0 !important` pour retirer les arrondis
  d'écran, et elle emportait la photo. C'est le seul endroit du document qui a
  une raison de le reprendre : l'identité est un portrait, pas une vignette.
- **Le positionnement est une liste, pas une chaîne.** Assemblée, la ligne se
  repliait au milieu d'un item — on lisait « Pilotage par la / donnée ». En
  items déclarés séparément et rendus insécables, la coupure ne peut tomber
  qu'entre deux, où elle se lit.
- **Ça se vérifie en imprimant, jamais à l'œil.** `npm run check:cv`.
  `#print-view` est masqué hors impression, et un débordement de trois
  millimètres sort une seconde page presque vide sans rien changer à ce qu'on
  voit dans le navigateur. Le contrôle charge les vraies polices avant de
  mesurer : avec les polices de substitution de Chromium, les lignes se
  replient ailleurs et il certifierait une page qui n'est pas celle qui sort.
- **Il mesure aussi la réserve, parce que « ça tient » ne dit pas de combien.**
  Le recto a tenu des mois avec 0,7 mm de blanc sous la dernière ligne : le
  contrôle passait, et le fichier sortait quand même en deux pages sur un
  téléphone. Un test binaire ne pouvait pas le voir. La réserve se mesure sans
  rien mesurer dans le document — on réimprime le même contenu sur des pages
  de plus en plus courtes, par dichotomie, et la dernière qui tient encore en
  un feuillet donne le blanc disponible. En dessous de six millimètres, le
  contrôle échoue.
- **Quand la page déborde, on retire de la matière — on ne réduit pas le
  corps.** Le recto est déjà à 8,4 pt. Le premier tri est la redite : une
  preuve énoncée deux fois prend la place de celle qui manque. C'est ce qui a
  fait tomber la catégorie de chaque projet transverse, qui nommait ce que le
  texte juste après décrivait déjà, et les résumés de compétences, qui
  redisaient l'accroche et les postes. Le second tri est la longueur des
  preuves : ce sont des syntagmes de repérage, pas des phrases — « Procédures
  de contrôle, dispatch, retards » vaut « Procédures de contrôle, de dispatch
  et de retards » et tient sur une ligne au lieu de deux.
- **La réserve de pied se mesure, elle ne s'estime pas.** Elle est aujourd'hui
  de dix millimètres — le document fait 255,6 mm dans une zone imprimable de
  266. C'est le budget de tout ajout, et c'est aussi ce qui absorbe les écarts
  de rendu d'un appareil à l'autre : à zéro, la page sort juste ici et en deux
  pages ailleurs.

## Impression
- `css/print.css` recompose le document, il ne rétrécit pas la page : bandeau
  à deux colonnes, sections numérotées, grille libellé (30 mm) / matière.
- Le portrait est dans le bandeau, à 26 mm, au bord opposé du nom — la même
  composition qu'à l'écran, à la mesure du papier. La règle `*` du haut de
  fichier coupe les images de fond, pas les `<img>` ; elle lui retire en
  revanche son rayon, et la photo redevient carrée sur le papier.
- L'écran a rejoint le papier sur les étiquettes et les cadres : ces deux
  systèmes se ressemblent désormais beaucoup, mais restent séparés. Une
  règle d'écran n'a pas à être répétée ici, et `print.css` garde ses
  propres tailles en points.
- Toute nouvelle section doit être ajoutée à `renderSectionBody()` dans
  `js/render/renderPrint.js`, sinon elle disparaît du PDF.
- Les renderers historiques (Outils, Compétences, Expériences, Projets)
  acceptent `{ expandAll: true }` : tout est déplié, sans onglets. **Ils ne servent
  plus que le papier et `#cv-integral`** — la page écran est `renderSite.js`, qui
  lit les mêmes données. Un texte ajouté aux données paraît donc aux trois
  endroits ; un texte ajouté à un seul renderer, à un seul. Le papier et `#cv-integral` partagent ces rendus : un texte absent
  du papier est absent des robots.
- **Se vérifie sur le texte du PDF, sans tenir compte de la casse.** Le papier
  met catégories, étiquettes et sous-titres en capitales par `text-transform` :
  une extraction qui compare la casse déclare « absents » des textes présents.
  Deux fausses alertes l'ont montré pendant la refonte du registre.
- Toute borne de largeur posée pour l'écran doit être relâchée ici. Le
  papier a déjà sa colonne ; une mesure oubliée sur un conteneur de tête
  rogne son contenu pendant que le bloc juste dessous prend toute la
  largeur — l'écart se voit tout de suite sur le PDF, jamais à l'écran.
- Pas de cartes ni de pastilles sur papier : les étiquettes redeviennent du
  texte.
