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
  `renderPrintDocument()` sert désormais deux consommateurs : la commande
  d'impression, et le bloc de texte intégral d'`index.html` (voir plus bas).
- `scripts/build-cv-integral.mjs` + `package.json` : génération du bloc de
  texte intégral. `npm run build` l'écrit dans `index.html`, `npm run verify`
  échoue s'il est désynchronisé. Aucune dépendance : `type: module` sert
  seulement à ce que Node lise `js/**/*.js` comme des modules ES.
- `robots.txt`, `sitemap.xml` : autorisation explicite des robots, y compris
  ceux des modèles de langage, qui se taisent souvent sans règle les nommant.
- `assets/img/` : ressources image du projet.
- `assets/img/portrait/` : la photo affichée dans le CV. Elle est distincte
  du favicon et de l'`og:image`, qui ont leurs propres contraintes de
  cadrage — les confondre ferait dépendre trois usages d'un seul fichier.
- `docs/charte-couleurs.md` : charte colorimétrique sémantique.
- `.github/workflows/deploy-pages.yml` : publication sur GitHub Pages. Le
  déploiement ne passe plus par le workflow géré par GitHub, qui n'était pas
  modifiable et traînait des actions sur une version de Node dépréciée. Le
  job vérifie d'abord que le texte intégral est à jour (`npm run verify`),
  puis recopie `index.html`, `robots.txt`, `sitemap.xml`, `css/`, `js/` et
  `assets/` dans `_site` avant de téléverser : toute ressource ajoutée hors
  de ces six entrées doit être déclarée là, sinon elle ne sera pas publiée.

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
- **Raccord final** (`startHandoff` dans `js/ui/intro.js`). La séquence se
  terminait sur un fondu : le nom disparaissait à 6,4 vmin au centre et
  réapparaissait à 22 px en haut à gauche du CV. Ni la taille, ni la
  position, ni le rythme ne se répondaient — un faux raccord, au sens du
  montage, et c'est lui qu'on voyait quand on disait « il y a une rupture ».
  À 8,65 s, un sosie du nom (`.intro-ghost`, posé sur le document, hors du
  plan donc hors caméra et hors fondu) rejoint la boîte de `.identity h1`
  en 780 ms, pendant que l'overlay s'efface et que le CV monte
  (`.app.is-entering`).
- Les deux boîtes se mesurent au `Range`, pas au `getBoundingClientRect` de
  l'élément : le `h1` du CV est un bloc, sa boîte fait toute la largeur de
  la colonne et le nom atterrissait à plus du double de sa taille. On prend
  la **première ligne** (`getClientRects()[0]`) et non l'union : sur un
  texte replié, l'union donne la largeur de la ligne la plus longue et la
  hauteur de toutes, ce qui ne décrit plus aucune boîte réelle.
- Le rapport d'échelle se mesure **sur le sosie**, pas sur l'original :
  c'est le sosie qui voyage, lui seul dit ce qui sera réellement dessiné,
  et la largeur d'arrivée devient celle du `h1` par construction. Le
  comparer à l'original supposait que les deux aient la même forme —
  hypothèse fausse dès que la composition en replie un et pas l'autre.
- L'échelle s'applique au coin de la boîte de bordure du sosie, pas à son
  texte : l'écart entre les deux se dilate avec elle et doit être reporté
  sur la translation, sinon le nom rate sa place d'autant.
- **Le nom ne se replie jamais** (`.intro-mot.is-nom .intro-nom` en
  `nowrap` en portrait). C'est la seule forme commune aux deux plans. Il
  héritait du `white-space: normal` de la règle portrait et sa boîte de
  référence est un plan de largeur nulle : il se coupait en
  « Jérémy » / « Ribes », soit la moitié de sa largeur réelle, et le
  raccord arrivait à plus de quatre fois la taille du `h1`, hors écran par
  la droite, avant de sauter à sa place. Les trois autres énoncés se
  replient, eux, et le doivent.
- L'espace avant chaque `<br />` des énoncés n'est pas une coquille : le
  portrait retire la coupure forcée (`.intro-mot br { display: none }`) et
  c'est cette espace qui reste pour séparer les deux mots. Sans elle on
  lisait « 14 annéesde terrain ». En paysage elle tombe en fin de ligne,
  où elle ne se voit pas.
- Le raccord renvoie `false` et laisse le fondu d'origine reprendre la main
  si le nom, le plan ou le `h1` manquent, ou en `prefers-reduced-motion`.
  Ne jamais le rendre obligatoire : le CV doit rester lisible sans lui.
- **Le raccord est interruptible** (`cancelHandoff`). Toute sortie anticipée
  passe par lui avant de retirer l'overlay. Sans cela, « Passer » cliqué
  entre 8,65 s et 9,43 s retirait la classe `intro-handoff` — donc
  l'effacement du `h1` — pendant que le sosie continuait sa course : le nom
  s'affichait deux fois, à deux endroits, pendant un tiers de seconde. Toute
  nouvelle porte de sortie doit appeler `finish()`, jamais `removeOverlay()`
  directement.
- **`raiseApp()` émet `cv:intro-raccord` sur le document.** C'est le seul
  point de contact entre la séquence et le CV, et il va dans ce sens-là :
  `js/main.js` met son entrée en escalier en réserve tant que `intro-armed`
  est posée, et la joue à la réception. Sans ce report, l'entrée partait à
  l'analyse du document et se déroulait entièrement derrière l'overlay —
  elle était finie depuis six secondes quand on découvrait la page, c'est-à-
  dire qu'elle n'existait pas. L'évènement part de `raiseApp()` et non du
  retrait de l'overlay parce que c'est là que le CV se découvre ; il part
  aussi quand l'overlay est absent, sinon le CV n'entrerait jamais.
- Le nom vit dans son propre `<span class="intro-nom">` : mesurer
  `.intro-mot.is-nom` donnerait la largeur du sous-titre, plus long.
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

## Le CV parle la langue de la séquence
La séquence était une composition, le CV une interface : c'est ce qui
créait la rupture, bien avant les questions de style. Sept décisions la
referment, et aucune ne doit être défaite isolément — c'est leur ensemble
qui tient.

- **Aucun cadre.** `.app` n'a plus ni rayon, ni ombre, ni bordure, ni
  `backdrop-filter`, et `body` n'a plus de marge : le CV occupe la page
  comme la séquence occupe l'écran. Ne pas remettre le CV dans une fenêtre.
- **Un axe, pas des rails.** Un filet d'un pixel (`--ink-200`) court sur
  toute la hauteur, posé par `.panel-right::before` en large et
  `.mobile-main::before` en étroit. Les blocs s'y accrochent à
  `--axis + --rail-gap`. Les huit rails de 2 px colorés ont disparu : un
  trait qui se répète est une décoration, pas une structure.
- **La nature se dit par le texte.** Ce que portait le rail passe à la
  couleur du titre (`--n-ink`), comme un énoncé de la séquence est
  lui-même encre ou forêt. Un composant ne pose plus de barre teintée.
- **La photo est dans l'identité, à droite du nom.** Elle ouvrait le Profil
  parce que la colonne de gauche porte 810 px de contenu fixe et déborde
  déjà sous cette hauteur de fenêtre : tout ce qu'on y **empile** pousse la
  navigation sous la ligne de flottaison. À côté du nom elle ne s'empile
  pas — `.identity-head` est une grille de deux colonnes, la photo occupe
  la seconde sur les deux premières lignes de titre, et le bloc ne grandit
  que de ce que le premier sous-titre reprend en se resserrant : 19 px,
  contre 96 pour une photo posée dessous. Elle est visible depuis toutes
  les sections, ce que sa place dans le Profil ne donnait pas.
- **96 px, et la deuxième ligne de titre repasse dessous.** C'est la plus
  grande mesure qui laisse au nom les 181 px qu'il demande sur une ligne
  dans les 307 de la colonne — et il doit y tenir : le raccord de la
  séquence mesure `getClientRects()[0]`, donc la première ligne seule, et
  un nom replié le ferait atterrir à la largeur de « Jérémy ».
  `role2` reprend la largeur entière (`grid-column: 1 / -1`) : coupé court
  il tombait à quatre lignes de six mots, il en fait deux, et le bloc
  gagne les 29 px de la différence.
- **En étroit, la photo descend d'un cran.** Le nom y est en 32 px et
  demande 264 px : sous 380 px de fenêtre il ne peut plus partager sa ligne
  avec la photo sans se replier. Elle longe donc les deux sous-titres
  (`grid-row: 2 / 4`) et le nom garde la largeur entière — c'est la même
  contrainte de raccord, résolue par la ligne du dessous plutôt que par la
  taille de la photo, qu'aucune valeur ne sauvait sous 360 px.
- **Aucun aplat.** Étiquettes, puces, badges, liens et navigation n'ont
  plus ni fond, ni bordure, ni rayon de 999 px : mono, capitales, `0.16em`,
  séparées par un point médian — la règle que `css/print.css` appliquait
  déjà au papier. La couleur est de l'encre, jamais une surface.
- **Une seule voix pour les titres.** Archivo à chasse élargie sur tous les
  titres de bloc, plus seulement sur le nom et les titres de section.
- **Un seul grain.** `--grain`, posé sur `body::after` et consommé aussi
  par `.intro-grain`. C'est la seule matière commune aux deux moitiés, et
  elle suffit à les faire tenir sur le même support. Le fond lui-même est
  déclaré une fois (`--fond-page`) et repris à l'identique par la séquence.
- **Un seul mouvement.** `--e-move` est la courbe de la caméra ; tout ce
  qui bouge dans le CV l'utilise. Au changement de section, les blocs
  entrent décalés (`playSectionEntry` dans `js/main.js`) — au changement
  de section seulement, jamais sur l'ouverture d'un accordéon.

## Les deux accordéons — Outils et Compétences
Même composant, mêmes règles. Trois d'entre elles se sont perdues une fois
et se reperdront : elles ne se voient pas dans le code, seulement à l'écran.

- **Une bascule ne re-rend pas sa section.** `js/ui/accordion.js` expose
  `syncAccordion(famille, idOuvert)`, qui ne touche que les classes et les
  attributs des cartes déjà montées. Repasser par `render()` recréerait la
  carte déjà ouverte : le panneau naîtrait à `grid-template-rows: 1fr` sans
  jamais être passé par `0fr`, donc **aucune transition n'aurait d'état de
  départ** — le dépliage redeviendrait instantané et le chevron ne
  tournerait plus, sans qu'une seule ligne de CSS ait bougé. Le bouton qui
  portait le focus disparaîtrait avec le reste, et le clavier repartirait du
  haut de la page à chaque ouverture.
- **Le panneau est toujours dans le document**, replié à `0fr`. `inert` le
  retire du parcours clavier et de l'arbre d'accessibilité ; surtout pas
  `hidden`, qui pose `display: none` et coupe la transition pour la même
  raison. Retrait, filet et marges intérieures ne se posent qu'à
  l'ouverture : la ligne de grille vaut bien zéro, mais un padding ou une
  bordure horizontale s'ajouteraient quand même à sa hauteur.
- **Le résumé est un `<button>`**, avec `aria-expanded` et `aria-controls`.
  Il ne contient donc que du contenu de phrasé : pas de `<div>`, pas de
  `<a>` — le lien d'un outil vit à côté, hors du bouton. C'est pourquoi
  `renderAccentTags` prend une option `element`.
- **L'affordance est une pastille nommée, pas un chevron.**
  `renderDiscloseCommand(libellé)` pose le libellé fermé de la carte et
  « Replier », plus le chevron, dans la langue de la seconde couche. Le
  chevron seul, à
  l'extrémité droite d'une colonne large, ne se lisait pas comme une
  commande — c'était le défaut signalé : on ne voyait pas qu'il y avait
  quelque chose à déplier. Le mot souligné qui a suivi se lisait, mais
  comme un lien de plus au milieu des autres commandes soulignées de la
  carte. Il est maintenant posé sur un aplat translucide de la nature de la
  carte (`color-mix` sur `--n-mark`), cerclé d'un filet de la même teinte :
  assez pâle pour ne pas concurrencer le titre, assez coloré pour se lire
  comme une chose qu'on presse. Les deux libellés sont posés ensemble et
  CSS n'en montre qu'un : la bascule ne touche alors qu'une classe. Le
  couple est `aria-hidden`, l'état étant déjà porté par `aria-expanded`.
- **Aucune carte n'est dépliée à l'arrivée.** Un panneau ouvert d'office
  prenait la moitié de l'écran avant qu'on ait lu la liste, et masquait le
  fait que les autres cartes s'ouvrent aussi : ce qui est déjà ouvert ne
  montre pas qu'on peut ouvrir. Revenir dans une section la retrouve
  repliée — l'état d'ouverture appartient à la visite en cours, pas au
  document.
- **Deux cartes voisines ne portent jamais le même libellé fermé.** Les onze
  cartes affichaient « Déplier le détail ». Le battement répond à « y a-t-il
  quelque chose dessous ? » ; il ne répond pas à « laquelle vaut mon
  clic ? ». Devant onze portes identiques, la réponse rationnelle est de
  n'en ouvrir aucune — et c'est le contenu le plus dense du CV qui restait
  derrière. Le libellé vient du champ `detailLabel` des données et nomme
  l'arbitrage de la fiche, qui est ce qu'elle a de propre. Une fiche ajoutée
  sans `detailLabel` retombe sur « Déplier le détail » : elle reste
  utilisable, mais elle rouvre le défaut — le libellé fait partie de la
  fiche, pas de la mise en forme.
- **C'est la pastille qui porte l'invitation**, par un battement
  (`accordion-appel`, `css/sections.css`). Il tient dans un dixième du
  cycle : six secondes d'immobilité pour une demi-seconde de mouvement de
  deux pixels — c'est ce rapport qui fait la différence entre un appel et
  un tic, l'œil étant rattrapé par ce qui bouge après être resté immobile,
  jamais par ce qui vibre en continu. Les cartes sont décalées de trois
  temps (`--appel-retard`), sinon la page frémit d'un bloc et se lit comme
  un défaut d'affichage. Le battement s'arrête sur une carte ouverte, sous
  la souris, et **définitivement à la première bascule** :
  `markAccordionAsDiscovered()` pose `accordion-decouvert` sur `<html>` —
  le seul élément que `render()` ne reconstruit pas, donc la marque survit
  aux changements de section. La démonstration faite, le mouvement n'apprend plus rien à
  personne et devient du bruit. Les règles de survol reprennent ce préfixe
  `html:not(.accordion-decouvert)` : sans lui elles passent sous celle du
  battement, qui compte une classe de plus.

## L'accroche se tape (`js/ui/typewriter.js`)
Le paragraphe de la colonne d'identité s'écrit lettre à lettre, comme sous
une frappe. Quatre décisions le tiennent, et aucune ne se voit dans le code
— seulement à l'écran quand elle manque.

- **Le texte est posé entier avant d'être tapé.** Le module ne l'ajoute pas
  au fur et à mesure : il le redécoupe en caractères, les éteint tous
  (`opacity: 0`) et les rallume un par un. La composition est donc celle du
  texte complet dès la première image. L'inverse — le procédé habituel —
  recalcule les coupures de ligne à chaque caractère : le paragraphe grandit
  d'une ligne d'un coup, la colonne tremble, et sur quatre lignes ça se voit
  huit fois. Le repli quand rien ne se joue est le paragraphe lui-même,
  intact dans le document.
- **Le curseur est de largeur nulle**, son trait peint hors de sa boîte par
  `::before`. Il se glisse entre le texte tapé et celui qui ne l'est pas
  encore : un curseur qui occuperait sa place décalerait toute la suite à
  chaque caractère, et on retomberait exactement sur le défaut que le point
  précédent évite.
- **La frappe ne joue qu'une fois par chargement.** Le CV se re-rend à chaque
  changement de section : la rejouer ferait de l'accroche une animation
  permanente. Le drapeau se lève avant la première image, pour qu'un
  re-rendu survenu en pleine frappe retrouve simplement le texte entier.
- **Elle attend `cv:intro-raccord`** quand la séquence d'ouverture est armée,
  puis 480 ms de plus. Sans cette attente elle se déroulerait derrière
  l'overlay et serait finie depuis cinq secondes quand on découvre la page —
  le même défaut que l'entrée en escalier des blocs, pour la même raison.
  Les 480 ms laissent le CV finir de monter : deux mouvements simultanés sur
  le même bloc n'en font lire aucun.
- La couche animée est `aria-hidden` et le texte réel est restitué à côté,
  hors champ visuel (`.tw-text-sr`) : un texte éclaté en spans d'un caractère
  se fait épeler par certains lecteurs d'écran. En
  `prefers-reduced-motion: reduce`, rien ne se joue et le paragraphe reste
  tel quel — la règle globale de `css/base.css` ne couvre que le CSS, et
  cette animation est en JavaScript.
- **Cadence : 30 ms par caractère plus une dérive de 0 à 24 ms**, et des
  arrêts aux ponctuations — une dizaine de secondes en tout. Le premier
  réglage était à 12 ms de moyenne, soit 5 000 signes par minute : aucune
  main n'écrit à cette vitesse, et on lisait un texte qui se déroule plutôt
  que quelqu'un qui tape. C'est le défaut le plus facile à réintroduire, en
  voulant raccourcir. Les 42 ms de moyenne restent au-dessus d'une frappe
  humaine ordinaire, et c'est assumé : au plausible strict, l'accroche
  mettrait une demi-minute à se poser. La dérive vaut 80 % de la base, une
  cadence régulière se reconnaissant immédiatement comme calculée.

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
  ligne étaient séparées par un `::before` sous `@media print` : hors
  impression elles se lisaient « panum.frkut.panum.fr ». Le séparateur est
  maintenant écrit dans le document.
- Le JSON-LD `Person` du `<head>` reste un filet, pas la solution : beaucoup
  d'extracteurs l'ignorent. Il doit néanmoins rester cohérent avec les
  données lorsqu'on modifie un intitulé, une date ou un chiffre.

## Circulation — ce qui se casse sans se voir

Trois mécanismes de navigation n'ont aucun symptôme visible dans le code
quand ils sont défaits. Ils se constatent à l'usage, et seulement là.

- **En étroit, le conteneur qui défile est `#app` lui-même**, et `render()`
  remplace son contenu sans le remplacer, lui : son `scrollTop` survit au
  changement de section, borné à la nouvelle hauteur. Depuis 1 400 px dans
  Outils, un clic sur Compétences atterrissait à 993 — soit 140 px sous le
  haut de la section demandée, titre hors écran et première carte coupée en
  deux. `resetMobileScrollPosition()` cale sur le bandeau de navigation, pas
  sur le haut du document : le résumé d'identité occupe six cents pixels, y
  renvoyer ferait relire six fois le même en-tête. La mesure se prend
  **après avoir remis `scrollTop` à zéro** — le bandeau est collant, mesuré
  depuis une position défilée il rend sa position d'accroche, l'écart vaut
  zéro et rien ne bouge. En large le problème ne se pose pas :
  `.content-body` est reconstruit à chaque rendu. Le drapeau
  `shouldResetMobileScroll` distingue le changement de section de la bascule
  large ↔ étroit, qui doit conserver la position acquise.
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
- **La vue intégrale a une porte visible.** `renderPrintDocument()` produit
  le CV entier ; il n'était atteignable que par la commande d'impression du
  navigateur, soit dix-sept interactions pour un lecteur qui voulait tout
  voir. `[data-print]` appelle `window.print()` et rien d'autre : c'est
  `beforeprint` qui monte la vue, quel que soit le déclencheur, et la monter
  aussi depuis le bouton la monterait deux fois. Les déclencheurs se relient
  dans `bindUi()` — les écouteurs de fenêtre se posent une fois, les boutons
  sont reconstruits à chaque rendu.
- **Le rail étroit porte `short`, pas `label`.** À 390 px il n'affiche que
  trois entrées sur six et les coupe en pleine lettre. Le masque de débord
  dit qu'il y en a d'autres ; il ne dit pas combien. La mention du bandeau
  porte donc un repérage — « Section 3 sur 6 » — et non une consigne d'usage.
  Une affordance qui a besoin d'une notice se reprend, elle ne se commente
  pas.

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
- Neuf paliers déclarés en tête de `css/base.css` (`--fs-display` →
  `--fs-label`), un rôle chacun. **Aucune taille en dur** dans
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
- **Elle borne toute la prose, pas seulement les accordéons.** Elle ne
  tenait que les deux accordéons — bouton, résumé et panneau ensemble, sinon
  le contour de focus encadre du vide. Les puces d'expérience et de projet,
  le contexte de poste et le chapeau d'Outils couraient pendant ce temps
  jusqu'à 136 signes, soit le double, dans les sections qu'un lecteur ouvre
  en premier. Une mesure qui ne s'applique qu'à une partie des textes ne
  repose pas l'œil : elle lui demande de se recalibrer d'un bloc à l'autre.
  Tout nouveau conteneur de prose la consomme, et `css/print.css` la relâche
  dans la même liste — une borne d'écran oubliée là rogne la colonne pendant
  que le bloc du dessous prend toute la largeur.
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
- Un accordéon doit accepter `{ expandAll: true }` pour être imprimable.
- Toute borne de largeur posée pour l'écran doit être relâchée ici. Le
  papier a déjà sa colonne ; une mesure oubliée sur un conteneur de tête
  rogne son contenu pendant que le bloc juste dessous prend toute la
  largeur — l'écart se voit tout de suite sur le PDF, jamais à l'écran.
- Pas de cartes ni de pastilles sur papier : les étiquettes redeviennent du
  texte.
