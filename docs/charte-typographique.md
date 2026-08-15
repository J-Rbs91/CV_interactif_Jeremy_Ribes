# Charte typographique — CV interactif Jérémy Ribes

Compagnon de [`charte-couleurs.md`](charte-couleurs.md). La doctrine complète,
avec ses raisons, est dans `AGENTS.md` § Typographie ; ce fichier est la fiche
qu'on relit avant d'écrire une règle.

## Le principe

**Trois familles, trois rôles. Rien d'autre.**

| Famille                                | Ce qu'elle porte                                                       | Graisses servies |
| -------------------------------------- | ---------------------------------------------------------------------- | ---------------- |
| **Archivo**, chasse élargie (125 %)    | l'identité et **tous les titres** — c'est le lien avec la séquence d'ouverture | 700, 800    |
| **Manrope**                            | la lecture : prose, résumés, énoncés, amorces de paragraphe             | 400 → 800        |
| **JetBrains Mono**                     | la seconde couche — libellés, étiquettes, dates, catégories, adresses    | 400, 500, 700    |

La frontière du registre mono est **« ce qui classe »**, pas « ce qui est
court ». Il cumule quatre facteurs de ralentissement — petit corps, capitales,
interlettrage, contraste au plancher de AA — et les capitales suppriment la
silhouette du mot. On n'y met que ce qui ne se lit pas en continu.

Une règle en découle, et elle vaut sur les trois surfaces : **le même contenu
ne change pas de famille selon le document.** La ligne de positionnement est
en mono à l'écran, elle l'est aussi dans la présentation complète. Un titre de
bloc est en Archivo sur le site, il l'est aussi sur le papier.

## Les trois surfaces

| Surface                    | Fichiers                                   | Ce qui lui est propre                              |
| -------------------------- | ------------------------------------------ | -------------------------------------------------- |
| **Site**                   | `base` · `layout` · `components` · `sections` · `export` | neuf paliers de taille, `--fs-display` → `--fs-label` |
| **Présentation complète**  | `print.css`, règles `.print-*`             | ses propres tailles en points ; mono en 700         |
| **Recto A4**               | `print.css`, règles `.cv1-*`               | idem, plus la contrainte d'une page                 |

`print.css` a son propre système de **tailles**, et lui seul. Il consomme les
mêmes familles, les mêmes interlettrages et la même chasse : un document qui
titrerait dans une autre police que la page qui le produit ne serait pas un
autre système, seulement une divergence.

## Les paliers d'écran

```
--fs-display  54 px   titre de section
--fs-metric   32 px   chiffre de preuve, titre de section en étroit
--fs-quote    26 px   citation détachée
--fs-lead     22 px   nom, titre de fenêtre, année
--fs-title    19 px   titre de bloc
--fs-body     15 px   texte courant — seule taille de lecture
--fs-sm     13,5 px   texte secondaire
--fs-xs       12 px   mention
--fs-label    11 px   libellé en mono
```

Aucune taille en dur : toute nouvelle règle consomme un palier.

## L'interlettrage des capitales

Une valeur unique serait fausse quelque part : l'espace entre les lettres
grandit avec le corps, si bien que ce qui est juste à 11 px est disloqué à
7 pt et serré à 19 px.

```
--track-cap        0.16em   libellé mono en capitales, écran (11-12 px)
--track-cap-print  0.1em    le même au papier (5,6-7,5 pt)
--track-cap-title  0.14em   titre en capitales, écran et papier
```

## Les graisses

Une seule graisse forte à la fois dans un même écran. La seconde couche est en
**500** à l'écran et en **700** au papier — à 7 pt, une graisse de plus rend au
libellé ce que la taille lui retire, et l'encre ne s'épaissit pas comme un
pixel allumé.

**Une graisse absente ne rate pas, elle glisse.** Demander un 600 à JetBrains
Mono, qui n'est servie qu'en 400, 500 et 700, donne un 700 — et le CSS continue
d'afficher 600. Toute valeur hors du tableau ci-dessus est un défaut
silencieux.

## Deux pièges qui ne s'écrivent nulle part

**Un bouton n'hérite pas la famille du document.** Sans réglage, il sort dans
la police d'interface du système. `base.css` pose `font: inherit` sur
`button, input, select, textarea`, sur le nom d'élément — à la spécificité la
plus faible, pour que toute classe la reprenne sans lutter. Ne pas reposer ce
réglage sur une classe : il gagnerait alors contre des familles voulues.

**La chasse élargie se déclare partout où `--font-display` est consommé**, même
là où elle paraît redondante. Le service de polices ne sert qu'une chasse
d'Archivo, donc le titre sort élargi sans rien demander — mais le lecteur qui a
une Archivo installée sur son poste a l'axe complet, et la même règle lui rend
un titre à 100 %.

## Ça se vérifie, ça ne s'estime pas

```bash
npm run check:typo   # les trois surfaces, rendues, relevées, comparées
npm run check:cv     # le recto tient en une page, avec les vraies polices
```

Le premier échoue sur les deux pièges ci-dessus et imprime l'inventaire complet
des combinaisons famille / graisse / corps / interlettrage réellement
composées. C'est ce qui rend une dérive visible avant qu'elle ne devienne une
règle.
