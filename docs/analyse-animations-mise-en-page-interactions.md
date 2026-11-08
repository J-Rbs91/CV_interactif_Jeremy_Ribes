# Analyse — animations, mise en page, interactions, parcours du lecteur et cohérence de la DA

Novembre 2026. Périmètre : la page (`css/site.css`, `js/render/renderSite.js`, `js/ui/site.js`), l'ouverture, le tiroir « Partager & Exporter », la modale « Me contacter », aux largeurs de téléphone, tablette, portable et grand écran. Le papier (recto A4, présentation complète) est hors périmètre.

Ce document a servi à **choisir** les modifications. Chaque constat porte une case ; cochée, le correctif est appliqué (voir « F. Suite donnée » en fin de document).

---

## Comment lire

- **Identifiant** : lettre du relevé + numéro (A animations, B mise en page, C interactions, D parcours, E direction artistique, F robustesse). Quand plusieurs relevés ont trouvé le même défaut, les identifiants sont groupés et le constat n'apparaît qu'une fois.
- **Gravité** : *bloquant* (une fonction ne rend pas ce qu'elle promet, ou une information est perdue), *majeur* (coûte de la lecture ou de la confiance au lecteur cible), *mineur* (gêne ponctuelle), *détail* (finition).
- **Type** : *défaut* (écart entre l'intention documentée et l'écran), *choix à revisiter* (contredit une décision écrite dans `AGENTS.md` : c'est une décision à prendre, pas une correction), *amélioration*.
- **Effort** : S (moins d'une heure), M (une demi-journée), L (plus).
- **Vérif.** : comment le constat a été établi. *Re-mesuré* : rejoué dans Chromium par la synthèse. *Recoupé ×n* : trouvé indépendamment par n relevés. *Contradictoire* : soumis à un vérificateur sceptique qui a tenté de le réfuter (verdict : confirmé, nuancé ou réfuté). *Relevé seul* : une seule source, non rejoué. *Analyse de code* : non exécutable ici (Safari, Firefox, appareil réel). *Critique* : constat ajouté par la critique de complétude, qui a mesuré ce qu'aucun relevé n'avait regardé ; rejoué par la synthèse quand c'est indiqué.

Les constats sont groupés en **lots** : des modifications qui se décident et se font ensemble, parce qu'elles touchent le même mécanisme ou la même décision.

---

## Méthode et limites

Tout a été **mesuré dans Chromium** (Playwright, polices Google réelles), jamais estimé à l'œil : positions au pixel, chronologie de l'ouverture image par image, animations en cours, styles calculés, parcours clavier, longueur de l'historique, inventaire des couleurs, tailles et courbes.

Largeurs couvertes : 360×740, 390×844, 390×660, 740×900, 820×1180 (souris et tactile), 1024×768 (souris et tactile), 1280×720, 1366×640, 1440×900, 1920×1080, 844×390 (téléphone couché), 720×450 (zoom 200 %). États : première visite avec ouverture, visite suivante, lien profond, mouvement réduit, sans JavaScript, schéma clair forcé, réseau lent émulé.

Limites. Chromium seulement : ce qui concerne Safari, Firefox et le toucher réel sur iPhone est une analyse de code, signalée comme telle. Serveur local non compressé : les durées de chargement liées au débit sont pessimistes, celles liées aux allers-retours sont réalistes. Le rendu effectif des cartes de partage LinkedIn et WhatsApp n'a pas été observé.

Lecteur cible retenu, hypothèses du projet (`docs/audit-ux-lecture.md`) : recruteur ou dirigeant qui reçoit le lien, une visite, 30 à 90 secondes pour décider, bureau majoritaire et téléphone fréquent, lecture en diagonale, arrêt sur les chiffres et les noms propres.

---

## Verdict d'ensemble

**Ce qui tient.** La mécanique documentée fonctionne comme annoncée. L'ouverture finit exactement sur la page au repos (0 pixel d'écart sur téléphone). Le remplissage des titres suit la promesse 80 % → 20 % de l'écran à 0,1 % près. Les six sections remplacent l'entrée d'historique, les couches l'empilent et la consomment, `npm run check:nav` passe 18 contrôles sur 18. Le défilement tient 60 images par seconde avec les titres animés. La palette est tenue : un fond, un accent, un cuivre qui porte un chiffre dans 7 cas sur 7 à l'écran, les trois familles servies dans les graisses déclarées, `font-stretch` à 125 % sur les 73 éléments en Archivo, aucune fuite des anciennes feuilles sur la page ni sur les tiroirs. Les quatre contrôles du dépôt passent. La critique de complétude a aussi vérifié ce qui tient : le titre « Formation » se remplit et s'élit bien en bas de page sur six fenêtres, la barre passe proprement d'une à deux rangées à 1100 px, le hero reste équilibré à 1920 et 2560, le tiroir survit à un redimensionnement 1440 → 390 → 1440 avec une fiche ouverte, la modale défile sur un écran de 500 px de haut.

**Ce qui casse, par ordre.**

1. **Sur téléphone, la page perd son information.** Sous 760 px les deux colonnes latérales des lignes d'index sont masquées : les dates des trois postes, la pastille « +83 % CA · +5,6 pts de marge », les six statuts d'adoption des outils et les cinq résumés de compétence quittent l'écran. Douze de ces textes ne réapparaissent nulle part, même fiche ouverte. Un recruteur sur téléphone lit un CV sans dates et sans chiffre. C'est le seul bloquant, et il se corrige en une règle CSS.
2. **Cinq défauts de mécanique à effort S.** Toute fermeture d'un tiroir ou de la modale, par n'importe quel geste, ramène la page en haut de la section courante (saut de 689 px au bureau, 371 px sur téléphone) et fait tomber le focus sur le corps de page : la fiche qu'on lisait est hors écran. « Voir le poste » et tout défilement vers une fiche la calent sous la barre fixe. Les deux dialogues `aria-modal` ne retiennent pas le focus, ce qui permet d'ouvrir une couche sur elle-même ou la modale derrière le tiroir. Fermer la modale de contact efface le message en cours, à l'inverse de ce que le code promet. Entre 761 et 820 px, les mots longs des titres de fiche s'impriment par-dessus les statuts de la colonne de droite.
3. **L'arrivée coûte 4 à 4,5 secondes** avant le premier mot sur le poste : écran noir d'environ 1,3 s (scripts puis délai), puis une ouverture dont près de la moitié du temps ne change aucun pixel. Et le raccourci clavier de l'ouverture reste branché toute la session : après une première visite, Échap et Entrée coupent toutes les transitions en cours.
4. **Le téléphone ouvre « Exporter » sur six réseaux sociaux** : les documents sont à 905 px pour un écran de 844.
5. **Les signes sont la zone la moins maîtrisée de la DA** : les flèches → et ↗, répétées 50 fois, sont rendues par des polices système de repli ; un même geste (fermer, sortir, ouvrir ailleurs) a deux ou trois dessins ; la pilule sert à 53 étiquettes passives et à trois commandes ; les champs du formulaire ont un filet à 1,57:1, invisible à vide ; la carte de partage porte le favicon, une photo couleur hors de la page noire.
6. **Plusieurs choix d'« affiche » sont à arbitrer** à la lumière du lecteur de 30 à 90 secondes : la fonction visée n'est dite sur le premier écran qu'en 12 px mono gris ; l'index affiche 19 à 51 mots par écran ; le seul chiffre de la page est en 12 px à un demi-écran du poste ; la photo recouvre deux lettres du nom et se lit comme une tache sombre.

Aucune correction ne demande de réécrire la page. Sur 95 entrées, 81 sont à effort S (moins d'une heure chacune) ; les points 1, 2 et 4 se corrigent entièrement à ce niveau d'effort.

---

## Le parcours du lecteur, chiffré

Hypothèses : défilement 1,5 s par écran, lecture 220 mots par minute, ouverture mesurée.

| Scénario | Bureau 1440×900 | Téléphone 390×844 | Verdict |
|---|---|---|---|
| **Arrivée** (première visite) | Noir ~1,3 s, nom seul jusqu'à ~2,8 s, ligne de poste lisible à ~3,5 s, défilement libre à ~4,4 s | Mêmes jalons, verrou ~4,1 s | Friction : 4 s sans information sur le poste, « Passer » 83×30 px en bas à gauche |
| **Premier écran au repos** | 26 mots : barre, nom, deux lignes de 12 px au pied. L'accroche de 86 px est 63 px sous le pli | 23 mots, ligne de poste sur 4 lignes, 41 % d'écran vide au-dessus du nom | Friction : la fonction visée est le texte le moins lisible de l'écran |
| **Trois écrans suivants** | Bandeau, accroche, chapeau, deux blocs, repli « Mon parcours », titre Expériences à 1,0 écran, première enseigne à 1,2, pastille +83 % à 1,4 | Titre Expériences à 1,3 écran, enseignes à 1,45, **aucune date, aucun chiffre** | Fluide au bureau, friction sur téléphone |
| **« Je cherche la preuve »** (+83 % et sa base) | 3 gestes : nav Expériences, clic sur la ligne, un défilement (la base arrive après 140 mots) | 3 à 4 gestes, sans pastille pour signaler qu'un chiffre existe | Friction / rupture partielle |
| **« Je veux le PDF »** | 3 gestes : « Partager & Exporter », document, fenêtre d'impression | 4 gestes : « Exporter », défiler 562 px dans le tiroir, document, aperçu système | Friction ; sur téléphone le tiroir s'ouvre sur les réseaux |
| **« Je veux le contacter »** | 1 geste vers le formulaire (barre ou pied) ; ni e-mail ni téléphone | Idem | Fluide pour le formulaire, rupture pour qui veut appeler ou transférer |
| **Lien profond, deuxième visite** | Pas d'ouverture, titre sous la barre, hash qui suit | Idem, 44 % d'écran sans contenu sous la barre à l'atterrissage | Fluide |
| **Sortie d'un tiroir ou de la modale** | La page saute en haut de la section (689 px), le focus tombe sur le corps de page | Idem, 371 px | Rupture : la position de lecture est perdue |
| **Clavier, lecteur d'écran** | Premier Tab saute le nom et « Profil » ; 6 titres pour 3 000 mots ; focus qui sort des dialogues | Idem | Friction |
| **Partage** | Carte LinkedIn / WhatsApp : titre et description justes, image = favicon couleur de 256 px | Idem | Rupture de DA avant le clic |
| **Coût de lecture** | 423 mots visibles lignes fermées (≈ 2 min), 2 594 mots derrière 19 portes (≈ 12 min) | 300 mots visibles | — |

**Ce que le lecteur emporte.** À 30 s, bureau comme téléphone : le nom, « opticien depuis 2012 », le projet de coordination et outils métiers, trois intitulés de fonction, sans enseigne ni chiffre. À 90 s au bureau : trois enseignes datées, le +83 %, quatre statuts d'adoption. À 90 s sur téléphone : trois enseignes sans dates et six noms d'outils. À 5 minutes : quatre ou cinq fiches ouvertes au bureau, trois sur téléphone.

---

## Constats à valider, par lots

### Lot 1 — Téléphone : l'information perdue des lignes fermées

*Pourquoi ensemble* : une seule règle CSS (`site.css`, bloc `@media (max-width: 760px)`) et la hiérarchie du même écran. Effort global : S à M.

- [x] **B1 · D1 · D2 · E2 — Sous 760 px, dates, pastille, statuts et résumés disparaissent.**
  Constat : `.s-n` et `.s-s` passent en `display: none` : 30 éléments, 123 mots. Douze textes ne réapparaissent nulle part, fiches ouvertes comprises : deux dates de poste sur trois, cinq statuts d'outil sur six, quatre résumés de compétence sur cinq. Le seul chiffre de la page n'existe plus sur la ligne fermée.
  Pourquoi : la grille passe de quatre colonnes à deux en retirant les colonnes au lieu de les replier. Conséquence : le recruteur sur téléphone ne peut ni dater le poste de responsable, ni savoir que Krys est le poste actuel, ni voir une preuve d'adoption.
  Proposition : replier au lieu de masquer. `.s-row summary { grid-template-columns: 1fr 28px; grid-template-areas: "t pm" "n pm" "s pm"; row-gap: 6px }`, `.s-n`/`.s-s` en `display: block`, alignés à gauche, 12 à 13 px, sans `max-width`. Coût : environ 20 px par ligne. Variante : date au-dessus du titre (zone « n » en premier).
  Gravité bloquant · défaut · effort S · Vérif. : contradictoire confirmé (B1) · contradictoire confirmé (D1) · contradictoire confirmé (D2) · contradictoire confirmé (E2) · re-mesuré (30 éléments masqués, 123 mots, 12 textes absents fiches ouvertes) · recoupé ×4 (B1, D1, D2, E2)

- [x] **D16 — Les libellés de commande (« Le système de pilotage », « La reprise du magasin »…) sont dans le corps de la fiche, pas sur la ligne fermée.**
  Constat : `experiences.js` les documente comme « le libellé de la commande fermée » ; le rendu les met en petit libellé mono à l'intérieur. La ligne fermée de Krys dit « Opticien collaborateur ».
  Conséquence : le poste actuel se lit comme un poste de vente ordinaire ; sur téléphone, sans date ni pastille, la ligne ne dit plus rien de ce qui la distingue.
  Proposition : sur Expériences, `sub` = « rôle · detailLabel » ; sur Compétences, `sub` = detailLabel ; retirer le libellé du corps.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **B16 — Hiérarchie téléphone : titre de section 31 px, titre de fiche 25 px, accroche 30 px.**
  Constat : rapport section/fiche de 1,25 contre 1,54 au bureau ; le h2 fluo n'est guère plus grand que la ligne qu'il coiffe, sous 110 px de vide.
  Proposition : `.s-sec > h2 { font-size: clamp(40px, 11vw, 128px) }` (43 px à 390), `.s-t { clamp(20px, 5.6vw, 40px) }`. Vérifier que « COMPÉTENCES » tient en 43 px sur 350 px.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

- [x] **B10 · D14 · C10 — Rail de navigation étroit : 3 à 4 entrées sur 6 visibles, « PROJETS » coupé en pleine lettre à 360, « Formation » active à moitié sous le fondu.**
  Constat : rail de 320 à 350 px pour 554 px de contenu ; masque à 88 %. Quatre entrées sur six lisibles à 390, trois à 360 où l'on lit « PROJE » (tranché par la critique). Quand Formation est active, 40 de ses 80 px sont sous le fondu, qui annonce une suite inexistante. Le lecteur ne peut pas dénombrer les sections.
  Proposition : (a) `scroll-padding-inline-end: 48px` et retrait du masque en butée (classe `is-end`) — effort S ; (b) deux rangées de trois sans défilement (`flex-wrap`, +26 px de barre) — effort M ; (c) retirer « Profil » du rail en étroit, le nom y mène déjà.
  Gravité mineur · B10/C10 défaut, D14 choix à revisiter (le masque de débord est documenté) · effort S à M · Vérif. : recoupé ×3 (B10, D14, C10)

- [x] **B9 — Téléphone : nom centré et photo ancrée au bas dérivent selon la hauteur d'écran.**
  Constat : écart nom → photo de 95 px à 390×844, 58 px à 360×740, 3 px à 390×660 (barre d'adresse visible) ; 41 % de noir au-dessus du nom à 390×844 ; ligne de poste sur quatre lignes.
  Proposition : composer en flux sous 760 px (`grid-template-rows: 1fr auto auto auto 1fr`, photo et tag en position statique) pour des écarts constants ; ramener le tag à deux ou trois lignes.
  Gravité mineur · défaut · effort M · Vérif. : relevé seul

- [x] **F12 — Téléphone couché (844×390) et zoom 200 % : la photo recouvre « RIBES », la ligne de poste passe sous le pli.**
  Constat : hero de 490 px pour 390 d'écran ; photo à 212–362 sur un nom à 204–381.
  Proposition : `@media (max-height: 520px) { .s-name { font-size: min(14vh, 150px) } .s-photo { width: min(26vh, 150px); bottom: 96px } }`.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **CR5 — Sur téléphone, 36 % des mots visibles de la page fermée sont en JetBrains Mono 12 px capitales espacées, et ce registre porte le rôle de chaque poste et la catégorie de chaque outil.**
  Constat : à 390×844, 108 des 300 mots visibles sont en mono 12 px capitales (hauteur de capitale 9 px) : barre, ligne de poste du hero, 18 sous-titres de fiche (« OPTICIEN COLLABORATEUR », « RESPONSABLE DE MAGASIN »…), en-têtes de section, méta du pied. Au bureau, 33 %, mais avec les colonnes latérales en Manrope 14 px qui manquent sur téléphone.
  Pourquoi : `AGENTS.md` réserve le mono à « ce qui classe » ; sur téléphone, faute de colonne latérale, il porte aussi ce qui affirme (le rôle occupé). Conséquence : la lecture en diagonale ralentit sur l'information de tri n° 1.
  Proposition : sous 760 px, rôle et catégorie (`.s-t small`) en Manrope 13–14 px, casse de phrase ; mono conservé pour les en-têtes, la barre et les dates.
  Gravité mineur · **choix à revisiter** (registre mono documenté) · effort S · Vérif. : critique (comptage par TreeWalker, 390×844 et 1440×900)

### Lot 2 — Calage sous la barre fixe et atterrissage

*Pourquoi ensemble* : tout ce qui déplace la page sans le lecteur. Une variable de hauteur de barre (`--s-bar-h` : 79 px / 104 px) consommée partout où la page se cale, et la restauration de la position à la fermeture d'une couche. Effort global : S.

- [x] **CR1 — Toute fermeture d'un tiroir ou de la modale ramène la page en haut de la section courante et fait tomber le focus sur le corps de page.**
  Constat : lecteur au milieu d'Outils (cinquième fiche au centre de l'écran), il ouvre « Partager & Exporter » ou « Contact », puis referme par Échap, « Fermer », clic sur le fond, geste retour ou clic sur un document : la page saute au haut de la section (3 217 → 2 528 px au bureau, 2 684 → 2 313 sur téléphone), la fiche lue est hors écran, le focus est sur `body`. Re-mesuré par la synthèse : 6 gestes sur 6, aux deux largeurs. Le saut disparaît avec `history.scrollRestoration = 'manual'` (re-mesuré).
  Pourquoi : la fermeture consomme l'entrée d'historique par `history.go(-1)` ; l'entrée porte `#outils` et le navigateur, en y revenant, défile vers le fragment au lieu de restaurer la position. Le focus est rendu au déclencheur avant la traversée, puis perdu par ce défilement. Les relevés C et D avaient mesuré « focus rendu » avant la fin de la traversée : la promesse d'`AGENTS.md` n'est tenue que dans le code.
  Conséquence : à chaque sortie d'un tiroir, le lecteur perd sa position et doit retrouver la fiche qu'il lisait ; c'est la friction la plus fréquente du parcours après l'ouverture, et personne ne l'avait vue.
  Proposition : `history.scrollRestoration = 'manual'` au démarrage (une ligne dans `backNavigation.js`). Re-mesuré avec ce seul réglage : saut de 0 px et focus rendu au bouton déclencheur. Ajouter le cas à `check-navigation.mjs` (position et focus lus après le `popstate`).
  Gravité majeur · défaut · effort S · Vérif. : critique, re-mesuré (6/6 gestes à 1440 et 390 ; correctif vérifié)

- [x] **B2 · C1 · CR4 — « Voir le poste » et tout défilement vers une fiche déposent le titre sous la barre fixe.**
  Constat : `.s-sec` a un `scroll-margin-top`, `.s-row` n'en a pas. Après le renvoi depuis Opti'Profit, 40 à 61 px du titre sont sous la barre à 1440 ; à 390 les deux lignes « Générale / d'Optique » sont entièrement sous les 83 px opaques, seul « Responsable de magasin » dépasse. Même cause au clavier : une ligne d'index atteinte par Maj+Tab depuis le bas arrive avec son haut à y = 0, entièrement sous la barre (CR4).
  Conséquence : le seul renvoi interne du CV, celui qui relie l'outil à la preuve, arrive sur une fiche dont on ne lit pas le nom.
  Proposition : `.s-row { scroll-margin-top: calc(var(--s-bar-h) + 20px) }`, même variable pour `.s-sec`.
  Gravité majeur · défaut · effort S · Vérif. : contradictoire confirmé (B2) · contradictoire confirmé (C1) · constaté sur les captures de référence · recoupé ×3 (B2, C1, CR4)

- [x] **C9 — Une fiche ouverte en bas d'écran ne montre que 11 px de son contenu.**
  Constat : cas courant (les lignes font 96 à 219 px de haut) ; le + tourne, le filet s'allume, rien ne défile.
  Proposition : écouteur `toggle` : si le corps dépasse le bas de l'écran, `scrollIntoView` de la fiche avec la marge du lot.
  Gravité mineur · amélioration · effort S · Vérif. : relevé seul

- [x] **B12 · D20 — Atterrissage sur une section : 160 px (bureau) / 180 px (téléphone) de noir avant la première ligne ; une seule fiche visible à 1366×640.**
  Constat : marge de défilement 20 px + padding 140 px ; le h2 arrive à 184 px, la première fiche à 334.
  Proposition : dissocier l'espace inter-sections (`margin-top`) de la position d'atterrissage (`scroll-margin-top: calc(var(--s-bar-h) + 24px)`) ; `@media (max-height: 720px)` : h2 plafonné à 96 px.
  Gravité mineur · choix à revisiter (le grand titre et sa course sont une intention) · effort S · Vérif. : recoupé ×2 (B12, D20)

- [x] **B18 — La barre n'est opaque que sur 41 des 79 px : bandeau et titres de 75 px passent sous les libellés de navigation pendant 38 px de course.**
  Proposition : dégradé opaque jusqu'à 62 % (49 px), ou padding bas 26 px au lieu de 34.
  Gravité détail · choix à revisiter (la borne du dégradé n'est pas documentée) · effort S · Vérif. : relevé seul

- [x] **B15 — À 1920, la barre reste pleine largeur alors que le contenu est inséré à 231 px : deux fers à gauche à 203 px l'un de l'autre.**
  Proposition : `.s-top { padding-inline: max(28px, calc((100% - 1500px) / 2 + 28px)) }`.
  Gravité détail · défaut · effort S · Vérif. : relevé seul

- [x] **C20 — Clic « Profil » en premier geste : l'adresse reste sans fragment, le même clic plus tard écrit `#profil`.**
  Proposition : dans `goTo`, appeler `poserSection` même si la section est déjà active.
  Gravité détail · défaut · effort S · Vérif. : relevé seul

### Lot 3 — Ouverture : noir initial, rythme, touches, « Passer »

*Pourquoi ensemble* : `css/site.css` (bloc Ouverture), `js/ui/site.js` (`bindIntro`), `js/ui/intro.js`. Deux décisions documentées y sont en jeu (durée, attente des polices) ; les autres entrées sont des défauts.

- [x] **A3 · F16 — Écran noir d'environ 1,3 s avant le premier pixel.**
  Constat : les classes sont posées avant tout rendu ; rien ne s'affiche tant que `main.js` et ses 25 modules (profondeur 6) n'ont pas tourné, puis 0,25 s de délai et une bande de fondu de 45 % retardent le premier pixel : 746 à 875 ms d'attente, puis 506 à 674 ms avant la première lettre (serveur local). En Slow 4G émulé, première image à 2,9 s, fin d'ouverture à 7,5 s. Seul « Passer » est visible.
  Conséquence : le lecteur qui ouvre le lien depuis LinkedIn ou WhatsApp voit une page noire sans indicateur ; ce temps s'ajoute aux 3,7 s de l'ouverture.
  Proposition : supprimer le délai de 0,25 s et démarrer le masque à --r ≈ 20 % ; `<link rel="modulepreload">` pour les modules (générable par le script de build) ; laisser la barre hors de la pause pour qu'un cadre apparaisse à la première image. F16 (noir pendant l'attente des polices) est le prix documenté de « tout démarre après les polices » : à conserver mais à raccourcir par F2.
  Gravité majeur · A3 défaut, F16 choix à revisiter · effort M · Vérif. : contradictoire nuancé (A3) : durées confirmées ; l'attente des polices compte aussi dans le noir (0,3 à 0,6 s), d'où les correctifs de F2 · recoupé ×2 (A3, F16)

- [x] **A2 · D4 — L'ouverture verrouille la page 4,1 à 4,5 s, dont près de la moitié sans qu'aucun pixel ne change ; la première information lisible arrive après 3,5 s.**
  Constat : nom visuellement complet à +1,57 s, photo à +2,2 s (0,77 s de page figée entre les deux), ligne de poste +2,8 → 3,5 s, barre +3,0 → 3,6 s, flèche +3,1 → 3,7 s, verrou levé +3,74 s. Part statique du verrou : 47 % au bureau, 44 % sur téléphone. Les 3,7 s documentées deviennent 4,1 à 4,5 s vécues.
  Conséquence : 5 à 15 % du budget d'un lecteur de 30 à 90 s, sans autre geste possible qu'une pilule grise en bas à gauche.
  Proposition, à forme constante : caler la suite sur la fin visible du nom (photo à 1,5 s, ligne de poste 1,9 s, barre et flèche ensemble à 2,2 s) → verrou ≈ 2,8 s au lieu de 3,7. Option plus franche : ne verrouiller que le temps du nom (≈ 1,6 s) et laisser le reste arriver pendant que le lecteur défile déjà.
  Gravité majeur · **choix à revisiter** (`AGENTS.md` : « 3,7 s » et « le verrou ne peut pas se lever avant la fin ») · effort S · Vérif. : contradictoire confirmé (A2) · contradictoire nuancé (D4) : chronologie confirmée (verrou 4,26 à 4,31 s après la navigation) ; Passer à déplacer en haut à droite, 44 px · recoupé ×2 (A2, D4)

- [x] **A5 — Temps mort de 0,77 s au milieu de l'ouverture : le masque court jusqu'à 145 % alors que le nom est complet à 125 %.**
  Proposition : `@property --r { initial-value: 125% }` et photo à 1,6 s ; ou caler les délais suivants sur la fin visible (voir A2). Compatible avec « la photo n'arrive qu'une fois le nom entièrement révélé ».
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **A1 · C21 · F17 — Le raccourci « Passer » reste branché toute la session : après une première visite, Échap et Entrée finissent instantanément toutes les transitions en cours.**
  Constat : `skip()` exécute `animation.finish()` sur toute animation finie sans vérifier que l'ouverture est en cours, et l'écouteur n'est jamais retiré. Mesuré : tiroir fermé par Échap → opacité 0 et feuille à 32 px dès la première image, contre un fondu de 0,3 s au clic sur « Fermer » ; fiche ouverte au clavier sans son apparition ; filet de survol qui saute. Dans une session sans ouverture, rien de tout cela (l'écouteur n'est pas posé) : le comportement diffère selon la visite.
  Proposition : `if (!root.classList.contains("intro-lock")) return;` en tête de `skip()`, et retirer l'écouteur dans `end()`. Au passage, ne finir que les animations du hero et de la barre plutôt que `document.getAnimations()`.
  Gravité mineur, revue à la vérification (majeur au relevé) · défaut · effort S · Vérif. : contradictoire nuancé (A1) : finition sans perte d'information ; correctif = garde dans skip() et retrait de l'écouteur · re-mesuré (voile à opacité 0 dès la première image après Échap en session avec ouverture ; fondu de 0,3 s au clic et en session sans ouverture) · recoupé ×3 (A1, C21, F17)

- [x] **A7 · C11 — La barre est cliquable à opacité 0 pendant tout le verrou : un clic précoce projette dans une page qu'on ne peut pas faire défiler.**
  Constat : `.s-top > * { pointer-events: auto }` sans condition ; `scrollIntoView` contourne `overflow: hidden`. Clic à +1,2 s → page à 2 525 px, hash `#outils`, verrou toujours posé, « Passer » encore affiché.
  Proposition : `html.intro-lock .s-top { pointer-events: none; visibility: hidden }` jusqu'à la fin du fondu ; ou lever le verrou quand la barre devient visible (ce qui raccourcit aussi de 0,7 s).
  Gravité mineur · défaut · effort S · Vérif. : recoupé ×2 (A7, C11)

- [x] **A6 — Erreur de script quand le pointeur quitte le hero pendant l'ouverture.**
  Constat : `pointerleave` n'a pas la garde `intro-lock` de `pointermove` et appelle `paint()` alors que les centres ne sont pas mesurés : `TypeError: undefined is not iterable`.
  Proposition : `if (centers.length !== letters.length) return;` dans `paint()`.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **A15 — Après « Passer », flèche et respiration gardent leur délai absolu : le hero reste immobile 2 à 3 s.**
  Proposition : retirer `intro-play` dans `end()` ou remettre les délais à zéro.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

- [x] **E7 · D4 · CR8 — « Passer » et « Fermer » : deux commandes de sortie, deux positions, deux formes.**
  Constat : « Passer » = pilule 83×30 px, texte --s-dim, bordure #333 (1,57:1), en bas à gauche, survol vers le blanc ; « Fermer » = texte + croix SVG en haut à droite, survol vers l'accent. `docs/audit-ux-lecture.md` (A5) dit « angle supérieur droit » : la position actuelle revient sur cette décision. À 360×740, la pilule est à 2 px du texte de la ligne de poste (CR8).
  Proposition : unifier sur la forme du tiroir (en haut à droite, texte + croix, accent au survol) ou garder la pilule mais au même endroit et avec le même survol ; 44 px de haut.
  Gravité mineur · défaut · effort S · Vérif. : contradictoire nuancé (D4) : chronologie confirmée (verrou 4,26 à 4,31 s après la navigation) ; Passer à déplacer en haut à droite, 44 px · recoupé ×3 (E7, D4, CR8)

- [x] **F1 — Réseau lent : la course de 2,5 s démarre la révélation en police de repli, puis Archivo recompose le nom en pleine animation.**
  Constat : polices retardées de 3 s → le masque révèle un nom de 910 px en Liberation Sans, puis Archivo arrive 0,7 s plus tard : 1 224 px, les lettres déjà visibles sautent (décalage de mise en page 0,048). C'est le cas précis que l'ouverture devait rendre impossible.
  Proposition : demander les polices dès `intro.js` (`document.fonts.load('800 1em Archivo')`…) pour gagner la course dans la quasi-totalité des cas ; porter le délai à 5 s ; à terme auto-héberger les trois woff2 et les précharger.
  Gravité mineur, revue à la vérification (majeur au relevé) · défaut · effort S · Vérif. : contradictoire nuancé (F1) : reproduit ; correctif = celui de F2 (fonts.load dans intro.js), écarter le délai à 5 s

- [x] **F2 — Les polices ne sont demandées qu'après le rendu JavaScript, derrière 9 feuilles bloquantes et 25 modules.**
  Constat : `#app` est vide et `#cv-integral` masqué : aucun texte n'utilise Archivo avant `renderSite()`. Sans bride, polices demandées à 500 ms alors que la feuille Google est prête à 334 ms ; en Slow 4G, demandées à 2,8 s, ouverture finie à 7,5 s.
  Proposition : `document.fonts.load` dès `intro.js` ; `modulepreload` ; `print.css` en `media="print"` après déplacement de `#print-view { display: none }` dans `site.css`.
  Gravité mineur, revue à la vérification (majeur au relevé) · défaut · effort M · Vérif. : contradictoire nuancé (F2) : chiffres reproduits à moins de 4 % ; fonts.load et modulepreload confirmés

- [x] **A11 · F15 — Le verrou repose sur `overflow: hidden`, qui ne bloque pas le défilement au doigt sur iOS Safari.**
  Proposition : `html.intro-lock { touch-action: none; overscroll-behavior: none }`, et vérifier sur un iPhone réel.
  Gravité mineur · défaut · effort S · Vérif. : analyse de code, non testable ici

- [x] **A12 · F14 — Replis Safari et Firefox : `@property` est le seul point qui dégrade l'expérience.**
  Constat : sans `@property` (Safari < 16.4, Firefox < 128), `--r` n'est pas interpolable : le nom apparaît d'un coup à mi-course, les lettres sautent par paliers, la respiration devient un clignotement toutes les 3 s. `animation-timeline` a son repli par script, `color-mix` dégrade en gris, `scrollbar-gutter` manque sous Safari < 18.2 avec barres classiques.
  Proposition : détection JS (`'registerProperty' in CSS`) → classe `no-property` qui remplace le balayage par un fondu et coupe la respiration ; ne surveiller la fin que sur les animations du hero et de la barre.
  Gravité mineur · amélioration · effort M · Vérif. : analyse de code

- [x] **A14 — Courbes : une famille cohérente, une courbe orpheline (révélation) et trois fondus trop rapprochés (2,8 / 3,0 / 3,1 s).**
  Proposition : jeton `--s-e-soft` pour la révélation ; faire arriver ligne de poste, barre et flèche ensemble, ou à 0,3 s d'écart au moins.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

### Lot 4 — Tiroir « Partager & Exporter » et modale « Me contacter »

*Pourquoi ensemble* : `js/ui/exportPanel.js`, `js/ui/contactForm.js`, `js/ui/backNavigation.js`, `css/panels.css`. Effort global : S à M.

- [x] **C2 · F3 — Les deux dialogues `aria-modal` ne retiennent pas le focus.**
  Constat : tiroir ouvert, le 9e Tab tombe sur `body` puis parcourt la barre et les fiches derrière le voile flouté, toutes activables (Entrée sur une entrée de nav défile la page derrière). Modale : 4e Tab. Rien n'est rendu inerte derrière une couche ouverte.
  Conséquence : au clavier ou au lecteur d'écran, le focus disparaît derrière un voile ; `aria-modal` promet un confinement que l'écran ne tient pas. C'est la racine de C6 et C7.
  Proposition : poser `inert` sur `main`, `.s-top`, `#skip` et l'autre couche dans `ouvrirCouche`, le retirer dans `fermerCouche` avant de rendre le focus. Ajouter un contrôle à `check-navigation.mjs` (20 Tab ne quittent jamais la couche). Variante M : `<dialog>` + `showModal()`.
  Gravité majeur · défaut · effort S · Vérif. : contradictoire confirmé (C2) · contradictoire confirmé (F3) · recoupé ×2 (C2, F3)

- [x] **C6 — Une couche peut être ouverte par-dessus elle-même : deuxième `pushState`, puis un appui retour « qui ne fait rien ».**
  Proposition : `if (isOpen()) return;` en tête de `openPanel` et `openContactModal`.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **C7 — La modale de contact s'ouvre derrière le tiroir d'export : on tape dans un champ invisible.**
  Proposition : corriger C2 ; en défense, fermer la couche ouverte avant d'en ouvrir une autre.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **C8 · F5 — Molette sur le fond flouté : la page défile derrière le tiroir, l'adresse change, puis tout saute à la fermeture.**
  Constat : 1 628 → 4 028 px pendant l'ouverture, hash `#experience` → `#projet` ; Échap restaure l'adresse et la page saute de 2 400 px.
  Proposition : `html.couche-ouverte { overflow: hidden }` posé par `ouvrirCouche` (sans décalage grâce à `scrollbar-gutter: stable`, mesuré), ou suspendre le suivi tant qu'une couche est ouverte.
  Gravité mineur · défaut · effort S · Vérif. : recoupé ×2 (C8, F5)

- [x] **C5 — « Fermer » occupe invisiblement toute la largeur du tiroir (603×54 px) : un double-clic sur le déclencheur ouvre puis referme.**
  Constat : le bouton est à la fois le bandeau dégradé collant et la commande ; le centre de « Partager & Exporter » tombe dessus une fois le tiroir ouvert.
  Proposition : séparer le bandeau (`.p-bar`) et le bouton (`width: auto; margin-left: auto`).
  Gravité mineur · défaut · effort S · Vérif. : vérifié dans le code (.p-close pleine largeur)

- [x] **C4 · D5 · CR7 — Sur téléphone, « Exporter » ouvre un tiroir dont la partie Exporter est entièrement hors écran ; sur les portables courants, elle est sous le pli.**
  Constat : six canaux en colonne, lien, QR : « 02 Exporter » à 905 px pour 844 d'écran, premier document à 936, note sur la fenêtre d'impression à 1 315. La composition du tiroir est la même à toutes les hauteurs : « 02 Exporter » est à 768 px, donc sous le pli à 1280×720 (48 px) et à 1366×640 (128 px), les portables les plus courants (CR7) ; à 900 px de haut le second document est coupé et la note invisible.
  Conséquence : le lecteur qui a tapé « Exporter » voit LinkedIn, WhatsApp, Facebook, X : il peut conclure que le CV ne s'exporte pas. C'est le geste le plus engageant du site, et le plus caché sur téléphone.
  Proposition : placer « Exporter » en 01 et « Partager le lien » en 02 (la décision documentée classe lien et documents, elle n'impose pas l'ordre) ; sous 700 px, canaux sur deux colonnes ; remonter la note sous le titre « Exporter » en une ligne.
  Gravité majeur · défaut · effort S · Vérif. : contradictoire nuancé (C4) : téléphone confirmé ; les chiffres bureau du relevé venaient d'un tiroir déjà défilé, corrigés par CR7 ; canaux en deux colonnes validés sans débordement (15 px, sans flèche) · contradictoire nuancé (D5) : voir C4 · recoupé ×3 (C4, D5, CR7)

- [x] **C3 — Fermer la modale de contact efface le message en cours, y compris après une erreur d'envoi.**
  Constat : `closeContactModal` appelle `form.reset()` pour toutes les fermetures (bouton, Échap, fond, geste retour) ; le commentaire du code promet l'inverse. Après « Réessayez », fermer détruit précisément ce qu'on invite à renvoyer.
  Proposition : retirer `form.reset()` de la fermeture, garder celui du succès ; ne vider que le feedback.
  Gravité majeur · défaut · effort S · Vérif. : contradictoire confirmé (C3) · vérifié dans le code (form.reset() dans closeContactModal)

- [x] **D6 — Le repli d'erreur du formulaire renvoie vers « LinkedIn », qui n'existe nulle part sur le site.**
  Constat : aucun lien de profil LinkedIn dans la page, le pied, les tiroirs ni les données ; le seul « LinkedIn » est le canal de partage. Le formulaire est le seul canal de contact.
  Proposition : déclarer `contact.linkedin` dans les données et le rendre dans le pied, le sous-titre des tiroirs et le message d'erreur (en lien) ; ou remplacer le repli par un canal qui existe (voir D7).
  Gravité majeur · défaut · effort S · Vérif. : contradictoire confirmé (D6) · vérifié dans le code (message en dur ; aucun lien de profil LinkedIn dans js/)

- [x] **E3 — Les champs du formulaire n'ont qu'un filet #333 à 1,57:1 : à vide, on ne voit pas où écrire.**
  Constat : seul le champ focalisé passe au fluo ; le Message vide est une zone noire de 140 px sans limite visible. C'est le seul endroit du site où le lecteur agit.
  Proposition : jeton `--s-line-ui: #606060` (3,15:1) pour les bordures de contrôles, distinct de `--s-line` (#222) pour les séparateurs.
  Gravité mineur, revue à la vérification (majeur au relevé) · défaut · effort S · Vérif. : contradictoire nuancé (E3) : contraste 1,57:1 confirmé ; jeton --s-line-ui #606060

- [x] **C15 — Après « Envoyer », le focus tombe sur `body` et la confirmation est le plus petit texte du tiroir (12 px mono capitales).**
  Proposition : refocaliser le feedback (`tabindex=-1`) ou le bouton ; feedback en Manrope 15 px sans capitales.
  Gravité mineur · amélioration · effort S · Vérif. : relevé seul

- [x] **E6 — Le cuivre marque une erreur d'envoi : seule occurrence du cuivre sans chiffre.**
  Constat : filet gauche 2 px cuivre, même forme que le bloc de preuve. `AGENTS.md` : « le cuivre est réservé aux chiffres mesurés ».
  Proposition : filet en `--s-fg`, ou jeton `--s-alert` explicite.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **E18 — Pendant l'envoi, « ENVOI… ↗ » garde la flèche de sortie sur un bouton désactivé.**
  Proposition : `.p-submit:disabled::after { content: none }`.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

- [x] **E16 — « Copier » → « Lien copié » élargit le bouton de 35,5 px et re-tronque l'URL.**
  Proposition : `.p-copy { min-width: 150px; justify-content: center }`.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

- [x] **C22 — L'adresse affichée dans le tiroir est tronquée sur téléphone (217 px pour 338 px de texte).**
  Proposition : sous 700 px, deux lignes (`word-break: break-all`) ou hôte seul.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

- [x] **E11 — Entre 701 et 760 px, la page est en mode téléphone mais le tiroir garde 680 px et son bord gauche.**
  Constat : à 740 px, feuille de 680 px à x = 45 sur une page à une colonne ; bande de voile résiduelle de 21 à 60 px.
  Proposition : aligner `panels.css` sur 760 px.
  Gravité mineur · défaut · effort S · Vérif. : re-mesuré (740 px : feuille de 680 px à x = 45, page en une colonne)

- [x] **E17 — Sur téléphone, le titre du tiroir (34,3 px) dépasse les titres de section (31,2 px) et l'accroche (30 px).**
  Proposition : `.p-title { font-size: clamp(28px, 7.6vw, 60px) }`.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

- [x] **F8 — Le voile `backdrop-filter: blur(10px)` tombe à 19–20 images par seconde en rendu logiciel, 61 sans flou.**
  Constat : mesuré en Chromium headless (rastérisation logicielle) ; sur GPU dédié le coût chute, sur GPU intégré et écran HiDPI il reste la charge la plus lourde de la page.
  Proposition : `blur(4px)` et voile à 0,82 ; ou désactiver le flou sous `prefers-reduced-transparency` et au-delà de 1 700 px ; mesurer sur deux machines réelles avant de trancher.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **C14 — Promesse « PDF ↓ », réponse : fenêtre d'impression.**
  Constat : clés « PDF · 1 page », flèche ↓ de 28 px (codes du téléchargement) ; le clic ouvre le dialogue d'impression. La phrase qui l'explique est en 13,5 px, hors écran à 1440×900. Sur mobile, « Enregistrer en PDF » demande deux ou trois gestes de plus et le document n'est pas nommé.
  Proposition, à décision constante : icône imprimante, clé « Imprimer · 1 page », note remontée sous le titre. À décision révisée : PDF du recto pré-généré dans `assets/` avec `download`.
  Gravité mineur · **choix à revisiter** (`AGENTS.md` : « Deux documents sortent par la même commande d'impression ») · effort S · Vérif. : relevé seul

- [x] **C19 — Déclencheurs sans `aria-expanded` ni `aria-controls` ; liens externes sans annonce « nouvelle fenêtre ».**
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

### Lot 5 — Pied de page et fin de parcours

- [x] **B7 · CR6 — Le bouton « Me contacter » centre son texte et la méta se replie dessous à toutes les largeurs.**
  Constat : `.s-contact` à 144 px ne tient pas sur une ligne ; `text-align: center` (défaut des boutons, jamais réinitialisé) indente « ME » de 545 px dans une page fer à gauche. La méta passe sous le bouton dès 820 px, dans une boîte de 391 px collée à gauche avec `text-align: right` : nom et lieu calés à droite d'une boîte à gauche, liens produits à gauche. L'exploration composait ce lien avec un `<a>` : le passage au `<button>` a changé l'alignement sans le déclarer. À 360 px le libellé tient sur trois lignes, la flèche seule sur la troisième (CR6).
  Conséquence : le dernier écran du CV, celui de l'appel à l'action, se lit comme une erreur de composition.
  Proposition : `.s-contact { display: block; width: 100%; text-align: left }`, `.s-foot { flex-direction: column; align-items: flex-start; gap: 28px }`, méta à gauche à toutes largeurs.
  Gravité mineur · défaut · effort S · Vérif. : re-mesuré (text-align center ; « ME » à x = 573 pour un contenu à x = 28 ; méta sous le bouton à 1440 et 1920) · recoupé ×2 (B7, CR6)

- [x] **D19 — Le pied sert le lecteur convaincu mais n'offre ni PDF ni rappel au lecteur pressé.**
  Constat : à 7,4 écrans (bureau) ou 5,4 (téléphone), le geste « télécharger le CV » n'est pas sous les yeux ; il faut remonter vers un libellé qui ne dit ni « CV » ni « PDF ».
  Proposition : deux commandes mono dans la méta du pied (« CV · recto A4 » via `printDocument`, « Partager » via le tiroir) ; ajouter « CV » au libellé court de la barre.
  Gravité mineur · amélioration · effort S · Vérif. : relevé seul

- [x] **E9 — Deux survols vont vers le blanc (« Me contacter », « Passer ») quand les huit autres vont vers l'accent.**
  Constat : fluo → blanc = 1,05:1 de différence de luminance ; le plus gros bouton du site s'éteint quand on le touche. Hérité de l'exploration, non documenté comme décision.
  Proposition : garder le mouvement d'interlettrage sans changer la couleur ; « Passer » vers l'accent comme Copier et Fermer.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **C23 — La flèche ↓ de l'accueil a l'allure d'une commande et ne fait rien.**
  Proposition : `<a href="#profil" data-section-link="profil">` qui défile vers l'accroche, ou la rendre plus discrète.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

### Lot 6 — Signes, formes et jetons de la DA

*Pourquoi ensemble* : un jeu de jetons dans `:root` de `site.css` consommé par `panels.css`, et un seul système d'icônes. L'apparence voulue ne change pas ; les écarts se résorbent.

- [x] **E1 — Les flèches → et ↗ sont rendues par des polices système de repli.**
  Constat : aucune des trois familles Google ne couvre U+2192 ni U+2197 (mesuré par CDP : Inter, Liberation Sans, DejaVu Sans Mono ici ; Segoe UI Symbol, Apple Symbols attendus ailleurs). 39 puces →, 8 ↗, 3 → de dates, 2 → de canaux : le signe le plus répété de la page change de dessin et de graisse selon l'appareil. À 144 px, le ↗ de « ME CONTACTER » est un glyphe Regular d'une autre famille à côté d'un Archivo 800. Seuls ↓ (Manrope) et + (JetBrains Mono) viennent des polices chargées.
  Proposition : SVG en `currentColor` via `boldIcon()` (Phosphor Bold : arrow-right, arrow-up-right, arrow-down), tailles en `em` ; puces `.s-list li::before` en `mask-image` ; dates « → » remplacées par « – » ou un SVG inline.
  Gravité mineur, revue à la vérification (majeur au relevé) · défaut · effort M · Vérif. : contradictoire nuancé (E1) : polices de repli confirmées par CDP ; option supplémentaire : sous-ensemble woff2 auto-hébergé des deux flèches pour les contextes texte, SVG pour les grands corps

- [x] **E14 — Trois signes pour « fermer / replier » (croix SVG 14 px, « + » mono 22 px tourné, « − ») et un ↗ en quatre corps et trois polices.**
  Proposition : un seul jeu Phosphor Bold en SVG pour x, plus, flèches ; trois paliers en `em` ; la flèche de document calée sur la ligne de titre plutôt qu'au centre de trois lignes.
  Gravité détail · amélioration · effort M · Vérif. : relevé seul

- [x] **C13 — Le glyphe ↗ a quatre sens : nouvel onglet, saut interne (« Voir le poste »), ouvrir un tiroir (« Me contacter »), envoyer.**
  Constat : le tiroir tient une grammaire nette (↗ onglet, → application, ↓ document) ; le reste de la page la casse.
  Proposition : réserver ↗ aux liens externes ; → pour le saut interne ; « Me contacter » et « Envoyer » sans flèche ou avec le signe des fiches ; `<span class="sr-only">(nouvelle fenêtre)</span>` sur les liens externes.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **C12 · E8 — La pilule sert à 53 étiquettes passives (chips) et à trois commandes (Copier, Envoyer, Passer) ; « Passer » est indiscernable d'une chip.**
  Constat : même rayon 99 px, même bordure #333, même mono 12 px, même gris. Le lecteur apprend avec « Passer » qu'une pilule se clique, puis tape une chip et rien ne répond.
  Proposition : retirer la pilule aux chips (liste mono séparée par « · », ou fond plein sans bordure) ; réserver bordure + rayon aux commandes, en `--s-line-ui`.
  Gravité mineur · défaut · effort S · Vérif. : recoupé ×2 (C12, E8)

- [x] **E5 — Les lignes des tiroirs annoncent « la même mécanique que les lignes d'index » mais mesurent une autre grammaire.**
  Constat : page = indent 14 px + filet 2 px qui grandit en 0,55 s ; tiroir = indent 10 px + flèche qui glisse, pas de filet.
  Proposition : aligner (14 px + filet) ou assumer la différence et corriger le commentaire de `panels.css`.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **E10 — Le repli « Mon parcours et ma façon de travailler » est un troisième idiome de ligne : accent au repos, mono 13 px bas de casse, aucun retour de survol.**
  Proposition : registre mono de la page (12 px, capitales, 0,14 em), blanc au repos, accent au survol et à l'ouverture.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **E12 — L'échelle de corps a dérivé : six corps Manrope de 13,5 à 18 px par pas de 0,5 px.**
  Constat : 13,5 (×3), 14 (×11), 14,5 (×2), 15 (×2), 16 (×138), 18 (×2) ; mono 12 (×202), 13 (×1), 22 (×18). L'exploration en avait quatre.
  Proposition : `--s-fs-mono 12px`, `--s-fs-small 14px`, `--s-fs-body 16px`, `--s-fs-lead 18px` ; 13, 13,5, 14,5 et 15 rejoignent 14.
  Gravité mineur · amélioration · effort S · Vérif. : relevé seul

- [x] **E13 — Valeurs orphelines : quatre #333, trois #d6d7d4, cinq #000, quatre interlettrages mono, treize combinaisons de transition.**
  Proposition : quatorze jetons dans `:root` de `site.css` : `--s-text` (#d6d7d4), `--s-on-acc` (#000), `--s-veil`, `--s-line` / `--s-line-ui` / `--s-line-acc`, `--s-t-fast` 0,2 s / `--s-t-move` 0,35 s / `--s-t-slow` 0,55 s, les quatre corps, `--s-track-mono` 0,14 em, `--s-r-pill` 99 px / `--s-r-tile` 6 px ; remapper les règles listées dans le relevé E13.
  Gravité détail · amélioration · effort M · Vérif. : relevé seul

- [ ] **B17 — Rythme vertical : 23 valeurs d'espacement distinctes, un nuage plutôt qu'une échelle.**
  Constat : entre 10 et 36 px, douze valeurs par pas de 2 à 4 px ; 46/48 et 140/150 sont des doublons perceptifs. Le grand rythme (140–170 entre sections) est lisible, la petite échelle est floue.
  Proposition : jetons 4, 6, 10, 14, 18, 24, 28, 36, 46, 64, 90, 110, 140 et remappage.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

- [x] **E15 — Le focus clavier d'une fiche est un cadre de 2 px autour de toute la ligne (1 369 px) alors que le survol est un filet qui s'allume.**
  Proposition : `.s-row summary:focus-visible` = même rendu que le survol (accent, indent, filet), cadre conservé pour les boutons isolés.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

- [x] **A9 · C16 · A10 — Aucun état pressé nulle part, et les déplacements au survol ne sont pas bornés à `@media (hover: hover)`.**
  Constat : zéro règle `:active` dans `site.css` et `panels.css`. Sur tactile, un appui sur un canal ou un document ne produit aucun retour avant la réponse externe (application, fenêtre d'impression) : le lecteur retape. Les `padding-left` et `letter-spacing` de survol collent sur appareil réel après un appui (analyse de code : l'émulation ne reproduit pas le survol collant).
  Proposition : `:active` miroir des survols (couleur accent) ; envelopper les survols qui déplacent dans `@media (hover: hover)`.
  Gravité mineur · amélioration (A9/C16) et défaut (A10) · effort S · Vérif. : recoupé ×3 (A9, C16, A10)

- [x] **F20 — Finitions : bordures #333/#222 sous 3:1, sections sans nom accessible, `aria-current="true"` plutôt que `location`, Copier sans `aria-live`.**
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

### Lot 7 — Premier écran

*Pourquoi ensemble* : `.s-hero`, `.s-name`, `.s-photo`, `.s-tag` et la requête `(hover: none), (max-width: 760px)`. Trois décisions documentées y sont en jeu.

- [x] **B4 · D3 — Le nom occupe 35 % de l'écran ; la seule ligne qui dit la fonction est en 12 px mono gris au pied ; l'accroche de 86 px est sous le pli.**
  Constat : à 1440×900, 26 mots visibles ; `.s-tag` à y 820–856, seconde ligne en --s-dim ; « ORGANISATION ET OUTILS MÉTIERS. » commence 63 px sous le pli ; première fiche à 2,5 écrans. Sur téléphone, tag sur quatre lignes avec « MANAGEMENT » orphelin. Le premier mot est « Opticien » : le profil se présente par son métier d'origine avant sa cible.
  Conséquence : pendant les dix premières secondes utiles, le lecteur a un nom, une photo et une ligne de 12 px à lire au pied ; ce qui range le dossier est l'élément le moins lisible.
  Proposition, cumulable : (1) `.s-tag` en Manrope 15–16 px, casse de phrase, --s-fg, ligne de poste d'abord ; (2) la fonction visée sous le nom en Archivo 20–28 px (`contact.a4.targetRole` existe déjà) ; (3) hero à `calc(100dvh - 120px)` pour que l'accroche affleure.
  Gravité mineur, revue à la vérification (majeur au relevé) · **choix à revisiter** (`AGENTS.md` : « le site, qu'on lit en entier, se présente par ce qu'il démontre ») · effort M · Vérif. : contradictoire nuancé (B4) : mesures confirmées ; retenir la ligne de projet d'abord et hors du mono, écarter l'ajout d'une ligne sous le nom · contradictoire nuancé (D3) : mesures confirmées ; même remède que B4 · recoupé ×2 (B4, D3)

- [x] **B8 — Les tablettes tactiles (820×1180, 1024×768) reçoivent la composition « téléphone » du hero.**
  Constat : `(hover: none)` s'applique aux iPad : nom plafonné à 150 px sur 48 à 60 % de la largeur, 34 à 39 % d'écran vide au-dessus, et à 1024×768 la photo chevauche le pied de « RIBES » de 9 px. La même largeur sans tactile montre l'affiche.
  Proposition : réserver `(hover: none)` à la respiration des lettres, et la composition (taille du nom, photo en bas) à `(max-width: 760px)`.
  Gravité mineur · défaut · effort S · Vérif. : re-mesuré (1024×768 tactile : nom 150 px, photo à 490 px pour un nom qui finit à 499)

- [x] **B13 — La photo recouvre le second É de JÉRÉMY à 63 % et le B de RIBES à 53 % (1440).**
  Constat : le nom reste lisible par complétion ; il est répété en 12 px dans la barre. À 1920, 47 % / 40 %.
  Proposition : si le chevauchement est conservé, le limiter (`clamp(120px, 15vw, 240px)`) ou poser le cercle sur l'interligne ; sinon l'écrire dans `AGENTS.md` comme décision.
  Gravité mineur · choix à revisiter · effort S · Vérif. : relevé seul

- [x] **E19 — La photo bichrome est très sombre : 62 % des pixels sous 10 % de luminance, 17 % des pixels teintés.**
  Constat : le sujet se distingue à peine du fond ; l'effet « la photo suit le lettrage » est présent mais faible.
  Proposition : `brightness(1.35) contrast(1.15)` et mix à 35–40 % ; cible mesurable : luminance moyenne ≥ 0,2, pixels teintés ≥ 25 %. La photo elle-même est hors périmètre par décision explicite ; seul son réglage est en question.
  Gravité mineur · **choix à revisiter** (`AGENTS.md` : mix à 25 %) · effort S · Vérif. : relevé seul

- [ ] **F6 — Portrait 405 px agrandi de 1,35 à 1,48 fois sur les écrans Retina, sans `srcset`.**
  Constat : 274 px CSS à 1440, 300 à 1920 ; à DPR 2 il faut 548 à 600 pixels. Le seul visage de la page est le seul élément flou d'un écran vectoriel.
  Proposition : exporter `me-810.jpg` et `srcset` ; sinon plafonner la largeur à 270 px.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **A13 — Les lettres qui suivent le pointeur pincent le nom de 15 % et imposent environ 80 mises en page par seconde.**
  Constat : lettre sous le pointeur wdth 125 → 73 ; nom 1 224 → 1 034 px ; 145 layouts pour 60 déplacements ; 60 images par seconde tenues ici.
  Proposition : si l'effet est conservé, réduire l'amplitude de chasse (125 → 95) ou n'animer que la graisse ; `contain: layout` sur le hero.
  Gravité détail · choix à revisiter · effort S · Vérif. : relevé seul

### Lot 8 — Index et fiches au bureau et sur tablette

- [x] **CR2 — Entre 761 et 820 px (iPad portrait compris), les mots longs des titres de fiche débordent de leur colonne et s'impriment par-dessus les statuts et résumés de la colonne de droite.**
  Constat : à 761 px, « ORGANISATION & FORMALISATION DES PROCESS » court 136 px par-dessus « Écrire des procédures de back-office… » ; « COORDINATION & CONDUITE DU CHANGEMENT » 102 px ; « GESTIONNAIRE DE PLANNING » 77 px ; « PILOTAGE COMMERCIAL » 51 px. À 820 px : 109 / 73 / 47 / 19 px. Re-mesuré par la synthèse aux deux largeurs ; à 1024 la critique relève encore 16 px, non reproduit ici.
  Pourquoi : la grille à quatre colonnes du bureau s'applique dès 761 px avec une colonne de titre de 256 à 330 px, trop étroite pour un mot de 13 lettres en Archivo 800 à 125 %. Conséquence : sur iPad, deux titres de compétence et un titre d'outil sont illisibles et masquent leur résumé.
  Proposition : sous 1024 px, passer à la grille à zones proposée pour le téléphone (titre pleine largeur, statut en dessous) ou plafonner `.s-t` à `clamp(26px, 4.4vw, 76px)` dans cette bande ; vérifier à 761, 820 et 1024.
  Gravité majeur · défaut · effort S · Vérif. : critique, re-mesuré (761 et 820 px)

- [x] **B3 — Le corps des fiches compose 105 à 113 signes par ligne (84ch = 820 px) ; trois mesures différentes sur la page.**
  Constat : paragraphe 105, puces 111 à 113, identiques de 1024 à 1920 ; `.s-lead` 79 à 80 ; `.s-block` 76. Le texte le plus lu, celui qu'on ouvre pour vérifier, a la mesure la plus large, 50 % au-dessus du plafond de confort (45 à 75) qu'`AGENTS.md` a fait respecter sur le papier.
  Proposition : `.s-in { max-width: 56ch }` (≈ 75 signes), `.s-lead { 54ch }`, `.s-block { 56ch }` ; vérifier en comptant une ligne rendue.
  Gravité mineur, revue à la vérification (majeur au relevé) · défaut · effort S · Vérif. : contradictoire nuancé (B3) : mesures identiques ; cible révisée : .s-in 60ch, .s-lead 56ch, .s-block inchangé · re-mesuré (105 et 113 signes dans la fiche Krys, 80 dans le chapeau)

- [x] **B6 — La pastille +83 % (12 px) et les statuts d'outil (14 px) sont à 330–660 px du titre qu'ils qualifient, alignés à droite.**
  Constat : distance titre → statut à 1440 : Générale d'Optique 428 px, PANUM 596 ; statuts sur deux lignes pour 3 outils sur 6 et 5 compétences sur 5. Le seul chiffre de la page a la taille d'une date.
  Proposition : (a) rapprocher le statut du titre (`auto minmax(0, 30ch) 1fr`, aligné à gauche) ; (b) ou le descendre sous le sous-titre ; (c) `.s-pchip` à 15 px dans tous les cas.
  Gravité mineur, revue à la vérification (majeur au relevé) · **choix à revisiter** (« pastille discrète sur la ligne fermée », en tension avec « le chiffre est le plus fort aimant visuel d'une page ») · effort M · Vérif. : contradictoire nuancé (B6) : distances confirmées ; garder la colonne de droite, l'élargir à 36ch au-dessus de 1100 px, pastille à 13 px au plus

- [x] **B5 — Index : 19 à 51 mots par écran de 900 px, 12 à 35 à 1366×640 ; 18 titres de fiche sur 5 600 px de défilement.**
  Constat : 9 écrans à 1440, 12 à 1366×640 ; le rôle occupé (« Responsable de magasin »), information de tri n° 1, est au quatrième niveau visuel, en 12 px mono atténué sous une enseigne de 75 px.
  Proposition par paliers : `.s-t { clamp(26px, 3.6vw, 56px) }` et `summary { padding: 16px 0 }` (4 à 5 fiches par écran) ; `.s-t small` en 13–14 px --s-fg ; h2 réduit sous 720 px de haut.
  Gravité majeur · **choix à revisiter** (direction « Affiche ») · effort M · Vérif. : contradictoire nuancé (B5) : chiffres confirmés à 6 % près ; appliquer d'abord le rôle en 13 px --s-fg et le h2 réduit sous 720 px de haut, avant de toucher la taille des titres

- [ ] **B14 — Deux axes verticaux : les titres de fiche commencent 155 px à droite du titre de section ; la gouttière de 10 % ne tient pas « 2025 → aujourd'hui » sur une ligne, même à 1920.**
  Constat : la gouttière porte un numéro à deux chiffres pour 15 fiches sur 18 et une date pour 3 ; la méta est calée 48 px sous le haut du titre ; dans une fiche ouverte elle reste vide sur 567 px.
  Proposition : `minmax(96px, 12ch)` pour tenir la date ; ou raccourcir la donnée (« depuis 2025 ») ; ou réserver la gouttière aux dates et mettre le numéro dans le titre ailleurs.
  Gravité mineur · choix à revisiter · effort S · Vérif. : relevé seul

- [x] **B11 — Citation de Formation : six lignes de 88 px dont deux d'un seul mot ; la mise en valeur `<em>` prévue ne s'affiche jamais.**
  Constat : `max-width: 18ch` découpe « … / besoins / rencontrés en / magasin. » ; 13 mots coûtent trois quarts d'écran. `renderFormation` remplace « problèmes » par `<em>problèmes</em>` mais la phrase ne contient pas ce mot : les « deux citations » annoncées sont sans accent, le remplacement est du code mort.
  Proposition : `#formation .s-big { max-width: 24ch; font-size: clamp(28px, 4.6vw, 64px) }` ; corriger ou retirer le `replace`.
  Gravité mineur · défaut · effort S · Vérif. : vérifié dans le code (la citation ne contient pas « problèmes »)

- [x] **CR3 — Une fois les titres de section remplis, l'accent du É d'EXPÉRIENCES et de COMPÉTENCES reste en contour creux.**
  Constat : en mouvement non réduit (le cas de presque tous les lecteurs), le remplissage par `background-clip: text` ne couvre que la boîte de ligne ; avec un interligne de 0,9, l'accent aigu dépasse de la boîte et reste un trait de 1,5 px au-dessus de lettres pleines, à 1440 comme à 390. Invisible sur les captures en mouvement réduit, où les titres sont pleins par une autre règle. Vérifié sur capture par la synthèse.
  Proposition : `padding-top` compensé par une `margin-top` négative sur `.s-sec > h2` (même technique que les mots du nom), pour que la boîte de fond couvre l'accent.
  Gravité mineur · défaut · effort S · Vérif. : critique, vérifié sur capture

- [x] **A8 — Une fiche s'ouvre en 0,5 s et se ferme en une image : 568 px retirés d'un coup.**
  Proposition : `::details-content` avec transition de hauteur (`interpolate-size: allow-keywords`, Chromium 131+, les autres gardent le comportement actuel), sans script ; désactivé en mouvement réduit.
  Gravité mineur · amélioration · effort M · Vérif. : relevé seul

- [x] **D10 — La base de comparaison du +83 % est le huitième bloc de la fiche : 140 mots et un défilement après l'ouverture.**
  Proposition : rendre `${proof}` juste après le contexte, avant les puces.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **D11 — La phrase de preuve se lit « ces actions ont contribué à — Écarts mesurés… » : le libellé est coupé de sa valeur.**
  Constat : `statsLabel` est écrit pour précéder les valeurs ; le rendu le met après, suivi d'un tiret. Le passage le plus lu du CV se lit comme une phrase inachevée. La fiche Opti'Profit l'assemble correctement.
  Proposition : libellé au-dessus des valeurs, base en dessous, comme dans `renderOptiProfitContext`.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

### Lot 9 — Contenu, ordre et promesses

- [x] **D9 — Ordre des sections : « Compétences » arrive quatrième, à 4,4 écrans, après deux projets hors optique.**
  Constat : un lecteur linéaire rencontre le maraîchage et la restauration avant les cinq domaines que le recto A4 place, lui, en tête (« la matière différenciante est dans les compétences »). À 90 s au bureau, le lecteur est entre Outils et Projets.
  Proposition : remonter Compétences en 02 ; ou lier les cinq intitulés de compétence depuis le Profil. Vérifier `check:nav`.
  Gravité mineur, revue à la vérification (majeur au relevé) · amélioration (l'ordre n'est pas motivé dans `AGENTS.md`) · effort S · Vérif. : contradictoire nuancé (D9) : jalons confirmés ; permuter Projets et Compétences, index dérivé de la position · vérifié dans le code (ordre des appels section())

- [ ] **D15 — Le poste visé a sept formulations et trois intitulés selon la surface.**
  Constat : hero « Projet professionnel : coordination et outils métiers » ; accroche « Organisation et outils métiers. » ; tiroirs, partage et JSON-LD « Organisation opérationnelle & outils métiers » ; recto A4 « Coordination opérationnelle & projets métiers » ; og:description « coordination opérationnelle ou de projets métiers ». Le titre que le partage et les moteurs enregistrent est un domaine, pas une fonction, et diffère du papier.
  Proposition : aligner `contact.role` sur `contact.a4.targetRole` (une chaîne pour tiroirs, partage, JSON-LD, papier) et faire commencer `hero.target` par ce même intitulé.
  Gravité mineur · amélioration · effort S · Vérif. : relevé seul

- [ ] **D17 — Le Hub Outils Opticien apparaît deux fois : Outils 03 et Projets 01 (« Hub optique »).**
  Constat : les Projets « transverses » sont annoncés hors optique ; le premier est de l'optique. Le lecteur qui compte « 6 outils, 3 projets » croit à neuf réalisations.
  Proposition : retirer l'entrée des projets (compteur « 2 projets ») ou renommer la section.
  Gravité mineur · amélioration · effort S · Vérif. : vérifié dans le code (id hub-opticien dans outils.js et projets.js)

- [x] **D18 — 19 portes pour 2 594 mots derrière 423 mots visibles : aucune commande ne déplie une section.**
  Proposition : commande mono « Tout ouvrir / Tout fermer » dans l'en-tête de chaque section (sans historique) ; ou ouvrir par défaut la fiche qui porte la preuve.
  Gravité mineur · amélioration · effort S · Vérif. : relevé seul

- [x] **D13 — Structure de titres : Profil sans h2, 19 fiches sans titre.**
  Constat : un lecteur d'écran navigue sur six titres pour 3 000 mots ; Profil, la section de décision, n'existe pas dans le plan.
  Proposition : accroche en `<h2 class="s-big">`, titre de ligne en `<h3 class="s-t">` dans le summary ; lien d'évitement vers `main`.
  Gravité mineur · défaut · effort S · Vérif. : vérifié dans le code (.s-big en <p>, titres de ligne en <span>)

- [x] **D12 · F4 — Le premier Tab saute le nom et « Profil » ; chaque changement de section téléporte le Tab suivant vers la barre.**
  Constat : `setActive` appelle `scrollIntoView` sur l'entrée active, ce qui déplace le point de départ de la tabulation.
  Proposition : ne faire défiler que le rail, quand il déborde, par `nav.scrollTo`.
  Gravité mineur · défaut · effort S · Vérif. : recoupé ×2 (D12, F4)

- [x] **A4 — Le bandeau défilant porte seul, à l'écran, les quatre territoires et « 14 ans », mais il est `aria-hidden` et figé sur un seul item au téléphone en mouvement réduit.**
  Constat : `contact.secondaryRole` n'est rendu que dans le bandeau. Lecteur d'écran : jamais entendu. Mouvement réduit : un item visible à 390, trois au bureau dont le troisième coupé.
  Proposition : copie accessible statique ; en mouvement réduit, une ligne qui replie au lieu d'une piste figée.
  Gravité mineur, revue à la vérification (majeur au relevé) · défaut · effort S · Vérif. : contradictoire nuancé (A4) : faits confirmés ; gravité ramenée à mineur · vérifié dans le code (secondaryRole rendu seulement dans le bandeau aria-hidden)

- [x] **C18 — La mention « Voir le poste » documentée n'existe pas : le lien dit « Poste où il a servi : … ».**
  Proposition : aligner `AGENTS.md` et `renderSite.js` (ou renommer le lien).
  Gravité détail · défaut · effort S · Vérif. : relevé seul

- [x] **DOC — Quatre énoncés de la documentation et un commentaire de code sont faux et se corrigent avec le code.**
  « Voir le poste » n'existe pas (C18) ; les « deux citations » en `<em>` n'en ont aucune (B11) ; « le panneau d'export et la modale consomment `editorial-signal.css` » : zéro occurrence (F10) ; la liste des graisses d'Archivo (« 700 et 800 ») alors que la page charge l'axe variable 100 à 900 (F9) ; le commentaire « le message en cours de rédaction reste » de `contactForm.js` (C3).
  Gravité détail · défaut · effort S · Vérif. : vérifié dans le code

### Lot 10 — Partage, contact et robustesse

- [x] **D8 · E4 · F13 — La carte de partage porte le favicon : photo de loisir en couleur sur anneau clair, 256 px, 103 Ko.**
  Constat : `og:image` et `rel=icon` pointent sur le même fichier ; pas de `og:image:width/height/alt` ni `twitter:card`. LinkedIn recommande 1200×627 ; en dessous, vignette carrée. `AGENTS.md` veut au contraire favicon et og:image distincts. Le premier contact visuel du recruteur contredit la page noire qu'il va ouvrir.
  Proposition : `assets/img/og-cv.png` 1200×630 dans la DA (fond #0a0a0a, nom Archivo fluo, fonction, portrait bichrome), métadonnées complètes ; favicon recompressé (≈ 20 Ko) ou monogramme dans la DA.
  Gravité majeur · défaut · effort M · Vérif. : contradictoire confirmé (D8) · contradictoire confirmé (E4) · recoupé ×3 (D8, E4, F13)

- [ ] **D7 — Ni e-mail ni téléphone : le recruteur qui veut appeler, verser le profil à un dossier ou répondre depuis sa messagerie n'a aucune voie.**
  Constat : contact exclusivement par formulaire (trois champs obligatoires, service tiers). `AGENTS.md` : « le jour où un e-mail existe, il vient à côté, pas à la place ».
  Proposition : un alias e-mail dédié dans `contact.items`, rendu dans le pied, le sous-titre des tiroirs et le recto A4 à côté du QR ; formulaire conservé comme premier canal.
  Gravité majeur · **choix à revisiter** · effort S · Vérif. : contradictoire confirmé (D7)

- [x] **F7 — Les axes variables du nom déclenchent une mise en page complète à chaque image : respiration permanente sur téléphone, même hero hors écran.**
  Constat : 60 layouts par seconde, 137 à 182 ms de layout par seconde, hero visible ou défilé à 2 500 px : un cinquième du processeur pendant toute la lecture.
  Proposition : `IntersectionObserver` sur le hero → `animation-play-state: paused` hors écran ; au bureau, une image sur deux.
  Gravité mineur · défaut · effort S · Vérif. : relevé seul

- [x] **F9 — `check:typo` et `check:cv` chargent une autre adresse de polices que la page (Archivo statique 700/800 contre l'axe variable 62..125, 100..900).**
  Constat : les contrôles certifient un fichier que la page ne charge jamais ; `AGENTS.md` impose au contraire l'alignement des trois adresses.
  Proposition : aligner les deux scripts (ou lire l'adresse depuis `index.html`) ; mettre à jour la liste des graisses dans `AGENTS.md`.
  Gravité mineur · défaut · effort S · Vérif. : vérifié dans le code (adresses différentes dans index.html et les deux scripts)

- [x] **F10 — 81 % du CSS transféré sert l'ancien affichage et le papier, en chargement bloquant.**
  Constat : six feuilles = 138 Ko bruts / 40 Ko gzip contre 28,5 / 9,4 pour `site.css` + `panels.css` ; les tiroirs ne consomment aucun jeton d'`editorial-signal.css` (0 occurrence).
  Proposition : `print.css` en `media="print"` ; `layout/components/sections` en `media="print"` + `<noscript>` ; vérifier par `check:cv`, `check:typo` et une capture sans JavaScript.
  Gravité mineur · amélioration (contredit partiellement `AGENTS.md` : « le panneau d'export et la modale s'en servent ») · effort M · Vérif. : relevé seul

- [ ] **F11 — Sans JavaScript, la page est noire mais le bloc intégral parle une autre charte (Manrope en titre, filets bleutés, commandes d'accordéon en texte, « En ligne » sans liens).**
  Proposition : h1/h2 en `--font-display`, filet `--s-line`, commandes masquées, liens dans les produits en ligne ; ou documenter le bloc comme « pour les robots ».
  Gravité mineur · amélioration · effort S · Vérif. : relevé seul

- [x] **F18 — `style-src 'unsafe-inline'` n'est requis que par 26 attributs `style=` (11 lettres, 15 tailles du bloc intégral).**
  Proposition : `--i` par `setProperty`, classes pour les tailles ; retirer `'unsafe-inline'`.
  Gravité détail · amélioration · effort S · Vérif. : relevé seul

- [x] **C17 · F19 — Cibles de la barre et du pied sous 44 px (27 px de haut ; conformes au minimum de 24 px).**
  Proposition : `padding: 10px 0` sous 1100 px ; liens du pied avec `padding: 8px 0`.
  Gravité détail · amélioration · effort S · Vérif. : recoupé ×2 (C17, F19)

---

## Décisions à prendre (choix délibérés, pas des corrections)

Ces constats contredisent une décision écrite dans `AGENTS.md` ou dans l'audit précédent. Ils demandent un arbitrage de l'auteur. Le reste du document se corrige sans décision nouvelle.

| Décision | Constats | Ce qui est en jeu | Options |
|---|---|---|---|
| Durée et verrou de l'ouverture | A2 · D4 · F16 | 4,1 à 4,5 s avant de lire le poste, dont près de la moitié statique | Resserrer à ≈ 2,8 s à forme constante ; ou ne verrouiller que le nom (≈ 1,6 s) |
| Ce que dit le premier écran | B4 · D3 | La fonction visée en 12 px gris au pied, l'accroche sous le pli | Ligne de poste lisible ; fonction visée sous le nom ; hero plus court que l'écran |
| Densité et colonne latérale de l'index | B5 · B6 · B14 · B12 | 19 à 51 mots par écran ; le seul chiffre en 12 px à un demi-écran du poste | Titres de fiche plus petits ; statut rapproché du titre ; gouttière revue |
| Photo et lettres | B13 · E19 · A13 | Nom recouvert à 63 % / 53 % ; portrait très sombre ; nom pincé de 15 % | Cercle plus petit ou sur l'interligne ; réglage de la bichromie ; amplitude réduite |
| E-mail ou téléphone | D7 (et D6) | Le recruteur pressé n'a que le formulaire ; le repli d'erreur renvoie vers un LinkedIn absent | Alias e-mail dans les données ; ou lien de profil LinkedIn |
| PDF ou impression | C14 | « PDF ↓ » promet un fichier, la réponse est un dialogue | Icône et libellé d'impression ; ou PDF du recto pré-généré |
| Rail de navigation étroit | D14 (B10 · C10) | 3 à 4 sections sur 6 visibles | Deux rangées de trois ; ou retrait de « Profil » du rail |
| Registre mono sur téléphone | CR5 | 36 % des mots visibles en mono 12 px capitales, dont le rôle de chaque poste | Rôle et catégorie en Manrope sous 760 px, mono gardé pour ce qui classe |
| Feuilles historiques bloquantes | F10 | 81 % du CSS pour le papier | `media="print"` + `noscript` |

---

## Annexes

### A. Mesures de référence

| Mesure | Valeur |
|---|---|
| Barre fixe | 79 px au-dessus de 1100 px (opaque sur 41 px), 104 px en deçà (opaque sur 83 px) |
| Verrou d'ouverture | 4 355–4 496 ms à 1440×900, 4 077 ms à 390×844 (serveur local) ; 3,74 s après le départ des animations |
| Chronologie après le départ | premier pixel du nom +0,5 à 0,67 s ; nom complet +1,57 s ; photo +2,2 → 3,15 s ; ligne de poste +2,8 → 3,5 s ; barre +3,0 → 3,6 s ; flèche +3,1 → 3,7 s |
| Image de fin vs page au repos | 0 px sur téléphone ; 54 px au bureau, tous dans la zone de la photo (rastérisation) |
| Remplissage des titres | 0 % quand le haut du titre est à 80 % de l'écran, 50 % à 50 %, 100 % à 20 % ; linéaire |
| Hauteur du document | 8 056 px à 1440 (9 écrans) ; 7 669 à 1366×640 (12 écrans) ; 5 720 à 390 (6,8 écrans) |
| Mots visibles lignes fermées | 423 au bureau, 300 sur téléphone ; 2 594 dans les 19 fiches |
| Signes par ligne | fiches 105–113 ; chapeau 79–80 ; blocs 76 |
| Contrastes sur #0a0a0a | texte 17,6 ; #d6d7d4 13,7 ; atténué 7,3 ; accent 16,8 ; cuivre 9,7 ; filet #333 1,57 ; filet #222 1,24 |
| Défilement | 60 images/s avec les titres animés ; pointeur sur le nom 61 images/s mais 84 layouts/s |
| Transfert première visite | 550 Ko bruts, 43 requêtes (CSS 166, JS 158 en 34 fichiers, polices 145, HTML 59) |
| Contrôles du dépôt | `verify` OK ; `check:nav` 18/18 ; `check:typo` OK ; `check:cv` OK, 21 mm de réserve |

### B. Matrice de compatibilité (analyse de code, non exécutée)

| Technique | Repli | Effet si absent |
|---|---|---|
| `@property` (--w, --wg, --r) | aucun | révélation sèche à mi-course, lettres par paliers, respiration en clignotement (Safari < 16.4, Firefox < 128) |
| `animation-timeline: view()` | script `no-timeline` + `--p` | identique |
| `mask-image` | préfixe fourni | — |
| `color-mix` | aucun | photo grise sans teinte (Safari < 16.2) |
| `scrollbar-gutter: stable` | aucun | décalage à la levée du verrou avec barres classiques (Safari < 18.2) |
| `100dvh` | `100vh` déclaré avant | — |
| `inert` | aucun | couche fermée tabulable (Safari < 15.5) |
| `backdrop-filter` | préfixe fourni | — |
| `overscroll-behavior` | aucun | chaînage du défilement du tiroir (Safari < 16) |

### C. Reproduire les mesures

Serveur statique à la racine du dépôt, Chromium via Playwright, polices Google réelles. Page au repos : poser `sessionStorage.cv-intro-played = 1` avant le chargement, ou `prefers-reduced-motion: reduce`. Ouverture : contexte neuf, `reducedMotion: 'no-preference'`, attendre le retrait de la classe `intro-lock`. Boutons d'export : remplacer `window.print` par un compteur. Positions par `getBoundingClientRect`, styles par `getComputedStyle`, animations par `document.getAnimations()`, signes par ligne par `Range`.

Les six relevés complets (115 constats avec protocoles, chiffres et chemins de captures) et les scripts de mesure ont été produits dans le dossier de travail de la session ; les chiffres de ce document en sont tirés et, pour les constats marqués *re-mesuré*, rejoués une seconde fois.

### E. Captures jointes

Dans `docs/analyse-captures/`, nommées par le constat qu'elles illustrent :

| Fichier | Ce qu'on y voit |
|---|---|
| `B1-telephone-experiences-sans-dates.png` | 390 px : trois enseignes, aucune date, aucune pastille |
| `B1-bureau-experiences-reference.png` | 1440 px : les mêmes lignes avec dates et pastille cuivre |
| `B2-telephone-voir-le-poste-sous-la-barre.png` | après « Voir le poste », l'enseigne est sous la barre |
| `B2-B3-bureau-fiche-ouverte.png` | fiche calée sous la barre ; lignes de 105 à 113 signes |
| `B7-bureau-pied-de-page.png` | « ME » centré, méta calée à droite sous le bouton |
| `C4-telephone-tiroir-exporter.png` | « Exporter » ouvre sur les six réseaux |
| `C2-bureau-focus-derriere-le-voile.png` | le focus clavier sur une fiche derrière le tiroir |
| `E3-bureau-modale-contact-champs.png` | champs à filet #333, seul le champ focalisé se voit |
| `B8-tablette-tactile-1024-hero.png` | iPad paysage : composition téléphone, photo contre le nom |
| `B4-telephone-premier-ecran.png` | premier écran téléphone : ligne de poste sur quatre lignes |
| `B4-B13-bureau-premier-ecran.png` | premier écran bureau : fonction en 12 px au pied, photo sur É et B |
| `A2-ouverture-1100ms.png` | ouverture à 1,1 s : le masque monte sur le nom |
| `F1-polices-lentes-3500ms-police-de-repli.png` | polices lentes : révélation en police de repli |
| `F1-polices-lentes-3600ms-archivo-recompose.png` | 100 ms plus tard : Archivo recompose le nom |
| `E11-740px-tiroir-680px.png` | 740 px : tiroir de bureau sur une page en mode téléphone |

### D. État de la vérification

Six relevés indépendants ont produit 115 constats (A 15, B 18, C 23, D 20, E 19, F 20). Une critique de complétude en a ajouté huit (CR1 à CR8) et vérifié huit hypothèses qui ne donnent rien. Après fusion des doublons, ce document compte 95 entrées.

Les 30 constats bloquants et majeurs des relevés ont été soumis à une vérification contradictoire, chacun rejoué dans Chromium par un agent chargé de le réfuter : 14 confirmés, 16 nuancés, 0 réfuté. Les nuances portent presque toutes sur la gravité (dix constats ramenés de majeur à mineur, signalés dans leur ligne) ou sur le détail du correctif ; aucune mesure n'a été contredite de plus de 10 %.

La synthèse a rejoué elle-même neuf mesures dans Chromium (six constats des relevés et les trois constats CR1, CR2 et CR3 ajoutés par la critique, correctif de CR1 compris) et vérifié neuf constats dans le code. 19 constats ont été trouvés indépendamment par deux relevés ou plus. Les constats mineurs et de détail reposent sur un seul relevé et n'ont pas été rejoués, sauf mention dans leur ligne « Vérif. ».

Quatre désaccords entre relevés ont été tranchés par la mesure : Échap coupe bien le fondu du tiroir dans une session où l'ouverture a joué (A1 a raison, C21 avait mesuré une session sans ouverture) ; les canaux du tiroir tiennent sur deux colonnes à 360 et 390 px à 15 px sans flèche (C4), pas à 18 px avec flèche (D5) ; le rail montre quatre entrées sur six à 390 et trois à 360 (B10 et D14 avaient chacun une des deux largeurs) ; la promesse « le focus est rendu au déclencheur » n'est tenue que dans le code, le `popstate` qui suit la renverse (CR1).

### F. Suite donnée

Les correctifs des dix lots ont été appliqués sur la branche, sauf ce qui demande une décision de contenu ou un fichier qui n'existe pas. Chaque entrée cochée a été rejouée dans Chromium après correction ; les contrôles `check:nav` (25), `check:cv`, `check:typo` et `verify` passent.

**Appliqué avec un choix de mise en œuvre à connaître** (le document proposait plusieurs options) :

| Constat | Ce qui a été fait |
|---|---|
| A2 · A5 · D4 | Ouverture resserrée à ≈ 3,3 s au lieu de 3,7 : `--r` à 125 %, délais calés sur la fin visible du nom. Forme et ordre inchangés ; image de fin comparée à la page au repos : 0 pixel (téléphone et bureau). |
| A3 · F16 · F2 | Polices demandées dès `intro.js`, `modulepreload` généré par le script de build, feuilles historiques en `media="print"`. L'attente des polices avant le départ reste (décision documentée). |
| E7 | « Passer » reste en bas à gauche (en haut à droite il recouvrirait « Contact » pendant le fondu de la barre) mais prend la forme de « Fermer » : texte mono, croix, accent au survol, 44 px de haut. |
| B4 · D3 | La ligne de poste vient d'abord, en police de lecture, blanche ; le parcours passe dessous en mono. Aucune ligne ajoutée sous le nom. |
| B5 · B6 | Rôle remonté d'un niveau (13 px, ton de prose), statut limité à 36ch, pastille +83 % à 13 px. Taille des titres de fiche et colonne de droite inchangées. |
| B13 · E19 | Photo à `17vw` (260 px au plus) au lieu de `19vw` (300) ; luminance moyenne de la photo 0,13 → 0,18, bichromie à 25 % conservée. |
| A13 | Chasse des lettres 93–125 % au lieu de 73–125 %. |
| B10 · C10 · D14 | Rail : 44 px de réserve en fin de course et fondu retiré en butée ; il reste un rail qui défile (pas de seconde rangée). |
| C4 · D5 · CR7 | Le tiroir commence par « 01 Exporter », « 02 Partager le lien » ; libellé de la barre « Exporter & Partager », « CV · PDF » sur téléphone. |
| C14 | Note d'impression remontée sous le titre ; la flèche ↓ et la clé « PDF » restent. |
| D9 | Compétences passe avant Projets. |
| E1 · E14 · C13 | Flèches, plus et croix en SVG ; ↗ réservé aux liens externes ; dates « → » devenues « – » à l'écran seulement. |
| A8 | `::details-content` : 17 images de fermeture mesurées. |
| F18 | `style-src` sans `'unsafe-inline'`, console propre. |

**Non appliqué** :

| Constat | Raison |
|---|---|
| D7 | Aucun e-mail ni lien de profil dans les données, et il n'est pas à inventer. Le message d'erreur du formulaire ne renvoie plus vers un LinkedIn absent. |
| D15 | Changer `contact.role` modifie aussi le papier et le texte intégral : décision de contenu. |
| D17 | L'entrée « Hub optique » porte ses propres compétences transférables, également dans le papier. |
| F6 | Pas de source portrait plus grande que 405 px. |
| F11 | Amélioration du seul rendu sans JavaScript, réservé aux robots. |
| B14 · B17 | Gouttière et échelle d'espacement : retouches larges de risque visuel, sans gain mesuré. |

Un défaut est apparu en cours de route et a été corrigé dans la foulée : le second clic d'un double-clic sur le déclencheur pouvait tomber sur un document du tiroir (donc lancer une impression). Le tiroir et la modale ignorent désormais les clics, « Fermer » excepté, pendant leur mise en place.
