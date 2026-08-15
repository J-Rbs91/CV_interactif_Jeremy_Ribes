# Audit UX — navigation et présentation, sous l'angle de la fatigue de lecture

Méthode : UXER, étapes 1 et 2 de `references/ux-review-framework.md`, format audit de
`references/output-formats.md`. Gravité selon les quatre niveaux de
`skills/ui-review-qa/references/severity-rules.md`.

**Mode de recherche : matière locale et mesure directe.** Aucune plateforme externe n'a été
consultée. Tous les chiffres de ce document proviennent du rendu réel de `index.html` dans
Chromium, à 1 440 px, 1 728 px et 390 px (DPR 2), mouvement réduit sauf mention contraire.
Les mesures sont reproductibles ; la méthode est donnée en fin de document.

---

## Contexte

CV interactif publié à une URL, envoyée à des recruteurs, des dirigeants et des cabinets.
Application d'une page, six sections exclusives, deux couches d'accordéons, séquence
d'ouverture animée, vue d'impression montée à la demande.

**Hypothèses sur l'utilisateur — confiance moyenne, à corriger si tu as des retours réels :**

| Question | Hypothèse retenue |
|---|---|
| Utilisateur principal | Recruteur ou dirigeant qui reçoit un lien, ne connaît pas le profil |
| Tâche principale | Décider en moins de 90 secondes si ce profil mérite un entretien |
| Fréquence | **Une seule visite.** Aucune habitude ne s'acquiert, aucun raccourci d'expert ne sert |
| Contexte matériel | Bureau en majorité, mobile fréquent (lien reçu par LinkedIn ou SMS) |
| Comportement par défaut | Lecture en diagonale, de haut en bas, arrêt sur les chiffres et les noms propres |

## Tâche principale

Un lecteur qui ne te connaît pas doit pouvoir décider, en moins de 90 secondes et sans cliquer,
que ce profil vaut un entretien — puis trouver, s'il continue, de quoi vérifier cette décision.

---

## Le fait central

**Le document pèse environ 3 400 mots, soit ~15 minutes de lecture linéaire, pour un budget
d'attention initial de 30 à 90 secondes.** Rapport de 10 à 30 pour 1.

| Source | Mots |
|---|---|
| `js/data/outils.js` | 1 461 |
| `js/data/competences.js` | 584 |
| `js/data/experiences.js` | 433 |
| `js/data/profile.js` | 416 |
| `js/data/projets.js` | 358 |
| `js/data/contact.js` | 119 |
| **Total** | **~3 371** |

Ce n'est pas un défaut : c'est ce qui fait la valeur du CV, et c'est exactement ce que tu veux
que le lecteur découvre. Le problème n'est donc **jamais de supprimer** — c'est que la
stratification existante ne se lit pas comme une stratification.

Le CV a déjà trois couches : les six sections, les résumés de carte, les accordéons. Elles sont
techniquement là. Mais **aucune n'est complète en soi**, et la première n'est pas dimensionnée
pour 45 secondes. Un lecteur pressé n'obtient donc pas une version courte du CV : il obtient un
fragment arbitraire du CV long, et il le sait.

Les constats ci-dessous sont classés par gravité. Les cinq premiers sont ceux qui coûtent
directement de la lecture.

---

## Bloquants

### B1 — Sur mobile, changer de section dépose le lecteur au milieu du contenu

**Constat.** Le conteneur de défilement mobile est `#app.app-mobile`, qui n'est pas remplacé au
rendu : son `scrollTop` survit au changement de section, borné à la nouvelle hauteur.

Mesure à 390 × 844 : défilement à 1 400 px dans Outils, clic sur Compétences →
`scrollTop = 993`, et le haut de la section se retrouve à **−140 px**. Le titre « Compétences »
n'est nulle part à l'écran, la première carte est coupée en deux, et le lecteur atterrit dans le
résumé de la deuxième.

`js/main.js:614` ne restaure la position que sur le rendu large
(`if (!state.isMobileView) restoreDesktopScrollPosition()`) ; en étroit, rien ne remet la
position en tête — ni volontairement, ni du tout.

**Impact.** Le lecteur a demandé une section et reçoit un morceau du milieu d'une autre. C'est
le contrôle 4 (repérage de la position) et le contrôle 14 (conservation de l'état) de l'audit de
navigation, et la conservation joue ici contre lui : on préserve un état qui n'a plus de sens
puisque le contenu a changé. Sur un document qu'on veut faire lire, c'est l'endroit exact où on
ferme l'onglet.

**Gravité : bloquant.** Une fonction — atteindre une section — ne produit pas le résultat
demandé.

**Modification technique.** Dans `render()`, `js/main.js`, remettre le conteneur mobile en tête
au changement de section, symétriquement à `restoreDesktopScrollPosition()` :

```js
if (state.isMobileView && sectionHasChanged) {
  document.querySelector("#app.app-mobile")?.scrollTo({ top: 0 });
}
```

À distinguer du re-rendu de bascule large ↔ étroit, qui doit continuer à conserver la position —
c'est la seule raison pour laquelle `preserveDesktopScrollPosition()` existe.

**Critère de validation.** En 390 px, après n'importe quel changement de section, le titre de la
section demandée est visible sans défiler.

---

### B2 — La modale de contact est atteignable au clavier alors qu'elle est fermée

**Constat.** Au chargement, `.contact-modal-overlay` est en `display: flex`, `opacity: 0`,
`aria-hidden="true"`, **sans `inert`**, et contient 5 éléments focalisables.

Douzième tabulation depuis le haut de la page : le focus atterrit sur `.contact-modal-close`,
rectangle 13 × 26 px à (914, 227), invisible, avec `outline-width: 0px`. Le lecteur au clavier
se retrouve à piloter un formulaire qu'il ne voit pas, et l'indicateur de focus a disparu — il ne
sait même pas où il est.

**Impact.** Focus dans une zone `aria-hidden`, ce que WCAG interdit explicitement : un lecteur
d'écran annonce du vide pendant que le focus est réel. Critères 2.4.3 (ordre du focus) et 2.4.7
(visibilité du focus). C'est aussi la seule anomalie d'accessibilité trouvée dans tout le
parcours — le reste tient.

**Gravité : bloquant.** Violation rattachée à un critère normatif.

**Modification technique.** Quand la modale est fermée : ajouter `inert` sur l'overlay
(il retire l'ensemble du parcours clavier et de l'arbre d'accessibilité d'un seul attribut), et
retirer `aria-hidden`, qui devient redondant et fautif dès qu'un descendant est focalisable.
`js/ui/modal.js`. Surtout pas `visibility: hidden` seul : la transition d'ouverture y perdrait
son état de départ, exactement comme pour les panneaux d'accordéon.

**Critère de validation.** Tabuler du haut de la page jusqu'au dernier élément : le focus ne
quitte jamais le contenu visible, et reste visible à chaque arrêt.

---

## Problèmes importants

### I1 — 90 à 136 signes par ligne dans les deux sections les plus denses

**Constat.** `--mesure` (74ch) borne les deux accordéons, comme le prévoit `AGENTS.md`. Elle ne
borne ni les puces d'Expériences, ni celles de Projets, ni le contexte des postes, ni le
chapeau d'Outils. Ce sont précisément les blocs les plus longs.

Mesures à 1 440 px, puis à 1 728 px :

| Bloc | Signes/ligne | Largeur 1 440 | Largeur 1 728 |
|---|---|---|---|
| `li` — « Bascule progressive vers les sujets d'organisation… » | 136 | 872 px | — |
| `li` — « Conception et envoi d'une campagne e-mail… » | 121 | 959 px | 1 131 px |
| `li` — « Détermination des prix de vente par régression… » | 129 | 823 px | — |
| `p.tl-context` — « Reprise d'un magasin en difficulté… » | 129 | 849 px | — |
| `div.card-text` — chapeau d'Outils | 140 | 981 px | — |
| Cartes Outils / Compétences (bornées) | 77 – 89 | ~600 px | ~600 px |
| Grille de Formation | 42 – 67 | ~470 px | ~470 px |

La plage de confort admise est 45 à 75 signes. Au-delà, le retour à la ligne cesse d'être
automatique : l'œil doit **chercher** le début de la ligne suivante, une saccade
supplémentaire par ligne. Sur les 19 blocs d'Expériences, c'est le coût le plus élevé et le plus
mécanique de tout le document — et il frappe la section qu'un recruteur lit en premier.

Deux remarques qui comptent pour le correctif :

1. **`74ch` ne donne pas 74 signes.** Le `ch` vaut la largeur du « 0 », plus étroite que la
   moyenne des lettres de Manrope : la borne actuelle produit 85 à 89 signes réels, déjà
   au-dessus de la plage. Viser ~62ch pour atterrir sous 75.
2. **Formation prouve que le projet sait faire.** Sa grille à deux colonnes tient 42 à 67
   signes par ligne, et c'est la section la plus reposante du CV. Le patron existe déjà.

**Gravité : important.** Dégrade la tâche principale sans l'empêcher.

**Modification technique.** Étendre `--mesure` aux conteneurs de prose de `css/sections.css` :
`.tl-context`, les `ul` de la chronologie, les puces de Projets, et le `div.card-text` de tête
d'Outils. Recalibrer `--mesure` de `74ch` à `62ch` en tête de `css/base.css`, ce qui resserre
aussi les deux accordéons sans toucher à leur structure. Rien à relâcher côté impression : la
neutralisation existante reste valable.

**Critère de validation.** Aucun bloc de prose au-delà de 78 signes par ligne, mesuré à 1 440 px
et à 1 728 px, dans les six sections.

---

### I2 — La vue « tout le CV » existe déjà et n'a aucune porte d'entrée

**Constat.** `renderPrintDocument()` produit le CV entier, toutes fiches dépliées. Il sert deux
consommateurs : le bloc `#cv-integral` destiné aux robots, et l'impression. L'impression n'est
déclenchée que par `beforeprint` — `js/ui/print.js:31`. **Aucun bouton, nulle part.**

Un lecteur humain qui veut voir l'ensemble doit donc : cliquer les 6 sections, puis ouvrir les
5 cartes d'Outils et les 6 de Compétences. **17 interactions minimum** pour atteindre un contenu
que le document sait déjà produire d'un bloc — et que les moteurs de recherche, eux, reçoivent
gratuitement.

**Impact.** C'est le constat le plus rentable de l'audit, parce que le travail est déjà fait.
Deux comportements très courants ne sont pas servis : le recruteur qui veut un PDF à joindre au
dossier, et le lecteur qui préfère faire défiler plutôt que cliquer — celui-là même qui lirait
le plus, et qui aujourd'hui abandonne parce que chaque paragraphe supplémentaire se paie d'un
clic.

**Gravité : important.**

**Modification technique.** Poser une commande visible dans la colonne d'identité, à côté de
« Partager » et « Me contacter » : « CV complet · PDF », qui appelle `window.print()`. Le reste
de la chaîne existe. Une deuxième version, plus ambitieuse : monter `renderPrintDocument()` à
l'écran comme septième vue « Tout le CV », ce qui donne une page défilable sans aucun clic — la
vue d'impression est déjà lisible à l'écran, c'est le même document.

**Critère de validation.** Depuis n'importe quelle section, une commande visible donne accès à
l'intégralité du CV en une action.

---

### I3 — Tes meilleures preuves sont composées dans le registre réservé au contexte

**Constat.** `AGENTS.md` pose la règle : « Tout ce qui donne du contexte sans être le message
passe en mono. » Le registre mono cumule quatre facteurs de ralentissement : 11 px, capitales,
`letter-spacing: 0.16em`, et contraste à **4,76:1** — juste au-dessus du seuil AA de 4,5, donc
conforme, mais au plancher. Les capitales suppriment en plus la silhouette du mot, qui est ce
qui permet la lecture rapide.

Or ce registre porte, entre autres :

- `TRANSMIS À LA DEMANDE DU DIRECTEUR RÉGIONAL GRANDVISION`
- `EN USAGE QUOTIDIEN DEPUIS SA CONCEPTION`
- `SUR LES DEUX MOIS QUI ONT SUIVI, CES ACTIONS ONT CONTRIBUÉ À`

Ces trois énoncés ne donnent pas du contexte. **Ce sont les arguments les plus forts du
document** : un outil réclamé par une direction régionale, un outil encore utilisé après le
départ de son auteur, et la base de comparaison qui rend le +83 % défendable. Ils sont
typographiés comme des métadonnées.

Part de signes dans ce registre, par section : Profil 21 %, Compétences 17 %, Outils 13 %,
Expériences 4 %.

**Impact.** Inversion de hiérarchie : ce que le lecteur doit retenir est ce qu'il lit le moins
bien. Sur la section Outils, il s'agit de la seule preuve d'adoption par des tiers — la
différence entre « il a fait des outils » et « ses outils sont utilisés sans lui ».

**Gravité : important.**

**Modification technique.** Séparer deux choses aujourd'hui confondues sous `.tool-status` et
consorts. Ce qui **classe** (catégories, dates, étiquettes de taxonomie) reste en mono. Ce qui
**affirme un fait vérifiable** — adoption, transmission, usage en cours — passe dans la police
de lecture, en bas de casse, au corps du texte courant. `css/sections.css`, règles
`.tool-status`, `.tl-outcome-label`, `.project-sub`.

**Critère de validation.** Tout énoncé affirmant un usage, une adoption ou une transmission par
un tiers est composé dans la police de lecture, en bas de casse.

---

### I4 — Les chiffres sont noyés dans la prose, sauf un — et c'est celui qui marche

**Constat.** La fiche « Responsable de magasin » sort ses chiffres du texte : `+83 % CA` et
`+5,6 pts` en grand, en flamme, avec leur libellé et leur base de comparaison. C'est le seul
endroit du CV qu'on ne peut pas rater en lisant en diagonale, et c'est le traitement le plus
réussi du document.

Partout ailleurs, les chiffres restent dans la phrase. Dans la fiche Krys : « base de plus de
mille clients segmentée, 771 envois après vérification des consentements, 96,5 % de
délivrabilité, 9 rendez-vous pris en magasin » — quatre chiffres, tous en deuxième ligne d'une
puce de 121 signes de large.

**Impact.** Le chiffre est le plus fort aimant visuel d'une page de texte, et le seul élément
d'un CV qu'un lecteur en diagonale s'arrête pour vérifier. Ici il ne se voit pas : il est au
même corps, à la même couleur et dans le même flux que le reste. Une campagne à 96,5 % de
délivrabilité avec attribution suivie jusqu'au rendez-vous est un résultat de professionnel, et
il passe pour un détail de phrase.

**Gravité : important.**

**Modification technique.** Généraliser le champ `stats` / `statsLabel` / `statsBase` de
`js/data/experiences.js`, déjà rendu par `js/render/renderExperiences.js`, aux fiches qui portent
un résultat mesuré. La fiche Krys est la première concernée. Le mécanisme, le style et la règle
de rareté de la flamme existent — il n'y a rien à concevoir.

**Critère de validation.** Chaque expérience portant un résultat mesuré expose au moins un
chiffre hors du corps de texte.

---

### I5 — Sur mobile, la navigation arrive après 673 px et ses libellés sont coupés

**Constat.** À 390 × 844, au chargement : le bandeau de navigation commence à **y = 673**, et le
premier contenu de section à **y = 853** — soit sous la ligne de flottaison, de 9 px. Le premier
écran est donc intégralement consacré à l'identité : nom, trois sous-titres, lieu, deux
commandes, trois liens produits, et l'accroche de six lignes en 20 px.

Le rail de navigation ne montre que trois entrées sur six, et les coupe : on lit
« transverses » et « Formatio ». La mention « Balayer pour voir les autres sections » a dû être
ajoutée pour compenser — c'est le symptôme, pas la correction : quand une affordance a besoin
d'une notice, c'est l'affordance qu'il faut reprendre.

**Impact.** Deux effets qui s'additionnent. Le lecteur mobile ne voit aucun contenu de CV sans
défiler, et il ne peut pas dénombrer les sections : il ignore l'étendue de ce qui l'attend.
Contrôles 1 (clarté de la navigation principale) et 11 (navigation mobile, qui doit être une
structure propre et non une réduction du bureau).

**Gravité : important.**

**Modification technique.** Sur `max-width: 900px`, resserrer le bloc d'identité : nom, un seul
sous-titre, photo, et l'accroche repliée sous le fold — elle est déjà reprise en tête du Profil.
Objectif : ramener le bandeau de navigation au-dessus de 500 px. Et couper les libellés du rail
au premier mot (« Projets » plutôt que « Projets transverses »), ce qui fait tenir cinq entrées
sur six dans 390 px. `css/layout.css`, requêtes étroites.

**Critère de validation.** À 390 px, au chargement, la navigation est visible et ses six entrées
sont dénombrables sans défiler.

---

### I6 — Onze cartes fermées, une seule et même invitation

**Constat.** Compétences aligne 6 cartes fermées, Outils en aligne 5. Toutes portent le même
libellé, `DÉPLIER LE DÉTAIL`, dans la même pastille.

`AGENTS.md` documente le choix de ne rien déplier à l'arrivée, et l'argument tient : un panneau
ouvert d'office masque le fait que les autres s'ouvrent aussi. Le battement de la pastille
résout, lui aussi correctement, la question **« y a-t-il quelque chose dessous ? »**.

Aucun des deux ne répond à la question suivante, qui est celle du lecteur pressé :
**« laquelle vaut mon clic ? »** Devant onze portes identiques, la réponse rationnelle est de
n'en ouvrir aucune. C'est le point où ton enjeu — plus il lit, plus il découvre — se joue et se
perd : le contenu le plus dense du CV (1 461 mots dans Outils) est derrière ces portes.

**Impact.** La couche de profondeur est construite, écrite, et jamais atteinte.

**Gravité : important.**

**Modification technique.** Faire porter au libellé fermé ce qu'il y a derrière, depuis les
données déjà présentes dans `js/data/` : « Situation, décision, effet », « Ce que ça a changé »,
« 3 exemples chiffrés ». `renderDiscloseCommand()` prend déjà ses deux libellés en paramètre ;
il s'agit d'ajouter un champ aux données, pas de toucher au composant. Deux cartes voisines ne
doivent jamais porter la même invitation.

**Critère de validation.** Dans Outils comme dans Compétences, deux cartes adjacentes ne portent
pas le même libellé de dépliage.

---

## Améliorations

### A1 — Le résumé des compétences est rendu en Arial

**Constat.** `.comp-desc` vit dans un `<button>`. Les boutons n'héritent pas de la famille
typographique, et `css/sections.css:63` ne la déclare pas : le résumé de chaque carte de
Compétences est rendu en **Arial**, quand tout le reste est en Manrope. Mesuré sur le rendu :
`font-family: Arial` sur `span.comp-desc`, contre `Manrope` sur `span.tool-summary-text`, qui
est son équivalent dans Outils.

C'est six blocs sur la section, soit la ligne la plus répétée de l'écran. À ce corps l'écart ne
se nomme pas, mais il se sent : la texture change sans raison, et une texture qui change sans
raison est lue comme un défaut d'affichage.

**Gravité : amélioration** — invisible à la nomination, réel à la lecture.

**Modification technique.** `font-family: inherit` sur `.comp-desc`, ou `font: inherit` sur le
bouton porteur, comme `css/components.css:188` le fait déjà ailleurs.

**Critère de validation.** `getComputedStyle(document.querySelector('.comp-desc')).fontFamily`
retourne Manrope.

---

### A2 — 45 % de la largeur perdue là où le lecteur défile le plus

**Constat.** À 1 440 px, la colonne de contenu fait 1 080 px. Les cartes de Compétences et
d'Outils en occupent ~600 : le reste est vide sur toute la hauteur. Les six cartes de
Compétences occupent 872 px de haut en une colonne, et la section déborde de l'écran.

Ce n'est **pas** un argument pour élargir les cartes : la mesure de 600 px est bonne, c'est I1
qui demande de la tenir. C'est un argument pour utiliser la largeur autrement. Formation le fait
déjà, et sa grille à deux colonnes est la plus reposante du document.

**Impact.** Défilement supplémentaire sur un écran à moitié vide. Sur un document dont l'enjeu
est qu'on aille jusqu'au bout, chaque écran de défilement évité est un lecteur retenu.

**Gravité : amélioration.**

**Modification technique.** Grille à deux colonnes au-delà de 1 200 px pour `.comp-card`, sur le
modèle de la grille de Formation, chaque colonne conservant `--mesure`. Compétences passe de
trois écrans à un et demi. À ne pas appliquer à Outils, dont les cartes sont numérotées : la
numérotation impose une lecture séquentielle, que deux colonnes casseraient.

**Critère de validation.** À 1 440 px, la section Compétences tient en un écran et demi, sans
qu'aucune carte ne dépasse 78 signes par ligne.

---

### A3 — Le gras intra-paragraphe ne compose aucun énoncé lisible

**Constat.** Dans le Profil, la mise en gras est dispersée : « organisation de l'activité »,
« outils », « irritant précis », « le support qui manquait », « sans attendre qu'on me la
demande ». Lus seuls — ce que fait exactement un lecteur en diagonale — ces fragments ne forment
pas une phrase.

Le gras crée une deuxième couche de lecture, qu'on le veuille ou non. Quand cette couche ne dit
rien, elle coûte l'attention qu'elle attire sans rien rendre, et elle hache la lecture continue
de ceux qui, eux, lisent tout.

**Gravité : amélioration.**

**Modification technique.** Dans `js/data/profile.js`, choisir les passages en gras de façon que
leur lecture isolée, dans l'ordre, forme un énoncé complet. Le test est mécanique : masquer tout
sauf le gras, relire. Si ça ne se lit pas, réduire — un seul passage en gras par paragraphe est
un bon plancher.

**Critère de validation.** La lecture des seuls passages en gras d'un paragraphe forme un
énoncé compréhensible.

---

### A4 — Les séparateurs d'étiquettes tombent en début de ligne sur mobile

**Constat.** À 390 px, les listes d'étiquettes se replient en laissant le point médian ouvrir la
ligne suivante :

```
PROCÉDURES  ·  BACK-OFFICE
·  NIVELLEMENT DE CHARGE
·  PRIORISATION
```

Un séparateur en début de ligne se lit comme une puce. Le lecteur voit trois listes là où il y a
une énumération, sur une section qui répète le motif six fois.

**Gravité : amélioration.**

**Modification technique.** Rendre le séparateur solidaire de l'étiquette qui le précède —
pseudo-élément `::after` sur `.chip`, plutôt que caractère autonome dans le flux —, et
`white-space: nowrap` sur l'ensemble étiquette + séparateur. `css/components.css`.

**Critère de validation.** À 390 px, aucun séparateur n'ouvre une ligne, dans aucune section.

---

### A5 — Le bouton « Passer » de la séquence est à 9 px

**Constat.** La séquence d'ouverture dure 9,1 s, plus une attente de polices bornée à 1,2 s
(`FONT_WAIT_LIMIT`, `js/ui/intro.js:20`) : au pire 10,3 s avant le premier mot de CV. Elle ne
joue qu'une fois par session et respecte `prefers-reduced-motion` — les deux garde-fous qui
comptent sont en place.

La porte de sortie, elle, est un bouton de **9 px** posé à (1 353, 858), c'est-à-dire dans
l'angle inférieur droit, le dernier endroit qu'un œil explore. Sur un budget d'attention initial
de 30 à 90 s, la séquence en consomme 10 à 30 %, et le seul moyen de la couper est le plus petit
texte de tout le document.

Le **contenu** de la séquence n'est pas en cause : son parti pris est documenté, tenu, et il
sert le CV. C'est le coût de sortie qui est mal réglé.

**Gravité : amélioration.**

**Modification technique.** Porter le libellé à 11 px minimum — le corps `--fs-label` du
document, qui est déjà le plancher assumé ailleurs — et le remonter dans l'angle supérieur
droit, où la convention le place et où on le cherche. `css/intro.css`.

**Critère de validation.** Le bouton Passer est lisible et trouvé en moins de deux secondes par
quelqu'un qui n'a jamais vu la page.

---

## Préférences visuelles

Section obligatoire, y compris vide. Elle sert à ne pas faire passer un goût pour un défaut.

- **Le battement de la pastille d'accordéon.** Rapport documenté d'un dixième de cycle, arrêt
  définitif à la première ouverture, décalage entre cartes. Je n'ai aucun élément objectif à
  opposer, et le raisonnement d'`AGENTS.md` tient. Si le battement te gêne, c'est une préférence
  — pas un constat.
- **La séquence d'ouverture elle-même.** Sa durée est mesurable et traitée en A5 ; qu'elle
  plaise ou non ne relève pas de cet audit. Un parti pris tenu qui déplaît reste une préférence.
- **La photo en tenue de sport.** Aucune règle UX ne tranche. C'est un choix de positionnement,
  il t'appartient.

---

## Ce qui tient — vérifié, à ne pas défaire

Périmètre réellement contrôlé, et qui passe :

- **Contraste.** Aucun texte sous son seuil, sur les six sections. Le plancher observé est
  4,76:1 pour un seuil de 4,5. C'est juste, et c'est conforme.
- **Ordre de tabulation.** Logique et complet : commandes de contact, liens produits, puis les
  six entrées de navigation dans l'ordre visuel. Contour de focus à 2 px, visible partout —
  sauf le cas B2.
- **Sémantique de la navigation.** Vrais `<button>` avec `aria-pressed`, pas des `<div>`
  cliquables. `js/render/renderHeader.js:26`.
- **Accordéons.** `aria-expanded`, `aria-controls`, panneau `inert` replié à `0fr`, bascule sans
  re-rendu qui préserve le focus. C'est correct, et c'est rare.
- **Défilement en large.** Le changement de section repart en tête. Vérifié y compris après un
  redimensionnement de fenêtre en cours de lecture, où la logique de conservation aurait pu
  fuiter : elle ne fuit pas.
- **Position de la section active.** Marquée dans la navigation, dans les deux mises en page.
- **Lisibilité par les lecteurs automatiques.** Le bloc `#cv-integral` est en tête de `<body>`,
  généré depuis les données, masqué par une règle CSS et non par un attribut — le raisonnement
  est juste et la mise en œuvre suit.
- **La grille de Formation.** 42 à 67 signes par ligne, deux colonnes, aucun accordéon : c'est
  la section la plus reposante du CV et le patron à reprendre ailleurs.
- **Le traitement des chiffres de la fiche Générale d'Optique.** Valeur sortie du texte, libellé
  d'attribution, base de comparaison. Rien à corriger, tout à généraliser.

---

## Tests restants

Ce que cet audit n'a pas pu couvrir, et comment le couvrir :

| Non vérifié | Comment le vérifier |
|---|---|
| Rendu sur appareil réel (iOS Safari, Android Chrome) | Les mesures viennent de Chromium émulé ; l'inertie de défilement et les barres d'adresse dynamiques changent les hauteurs utiles |
| Lecteurs d'écran (NVDA, VoiceOver) | Annonces au changement de section, à l'ouverture d'accordéon, et à l'ouverture de la modale |
| Zoom 200 % et 320 px de large | Deux exigences d'accessibilité non couvertes ici |
| Métriques de terrain (Core Web Vitals) | Le seul axe qui se mesure vraiment ; GoatCounter est en place, mais aucune donnée de parcours n'a été consultée |
| Le rendu PDF réel | `css/print.css` a été lu, jamais imprimé |
| Taux de dépliage réel des accordéons | I6 repose sur un raisonnement, pas sur une mesure d'usage. Un compteur d'événement sur `syncAccordion` trancherait en deux semaines |

---

## Si tu ne fais que trois choses

Dans cet ordre, pour le rapport effort / lecture gagnée :

1. **B1** — le lecteur mobile ne doit plus atterrir au milieu d'une section. Quelques lignes
   dans `render()`, et c'est le défaut qui fait fermer l'onglet.
2. **I2** — exposer la vue complète. Le travail est fait ; il manque un bouton, et il sert
   exactement le lecteur que tu veux garder.
3. **I1** — borner la mesure dans Expériences et Projets. Une variable CSS étendue à quatre
   sélecteurs, sur les deux sections lues en premier.

I3, I4 et I6 forment le second lot : ils ne réduisent pas la fatigue, ils augmentent ce que le
lecteur emporte à effort constant.

---

## Méthode de mesure

Rendu réel de `index.html` servi en local, Chromium 1194 piloté par Playwright, mouvement réduit
sauf pour la mesure de la séquence d'ouverture. Trois fenêtres : 1 440 × 900, 1 728 × 1 000 et
390 × 844 en DPR 2.

- **Signes par ligne** : `Range.getClientRects()` sur chaque bloc de texte terminal, longueur du
  texte divisée par le nombre de rectangles de ligne. Plus fiable qu'un calcul depuis la largeur,
  qui ignore les coupures réelles.
- **Contraste** : luminance relative WCAG, couleur calculée du texte contre le premier ancêtre
  au fond opaque, seuil ajusté selon corps et graisse.
- **Défilement** : lecture directe de `scrollTop` sur le conteneur réel — `#app.app-mobile` en
  étroit, `.content-body` en large. Une mesure sur `window.scrollY` aurait donné 0 partout et
  masqué B1.
- **Clavier** : douze tabulations depuis le chargement, relevé de `document.activeElement` et de
  son contour calculé à chaque arrêt.
- **Volume de texte** : extraction des chaînes de plus de 25 signes dans `js/data/*.js`, à 220
  mots par minute.
