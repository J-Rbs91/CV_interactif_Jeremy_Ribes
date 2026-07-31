# Charte colorimétrique — CV interactif Jérémy Ribes

## Le principe

**Deux couleurs porteuses et un accent. Rien d'autre.**

Un système de couleurs qui a besoin de sa notice pour être lu a raté. Celui-ci
s'énonce en une phrase :

| Couleur    | Ce qu'elle dit  | Ce qu'elle porte                                    |
| ---------- | --------------- | --------------------------------------------------- |
| **Encre**  | ce qui **cadre**   | identité, titres, structure, méthode, process     |
| **Forêt**  | ce qui **produit** | compétences, outils, projets, réalisations       |
| **Flamme** | ce qui **prouve**  | les chiffres mesurés et les produits en ligne    |

La hiérarchie ne vient pas de la teinte mais de la **nuance**. Chaque couleur a
sa gamme complète, de 900 (texte le plus dense) à 50 (filet le plus ténu). Deux
teintes, beaucoup de niveaux — c'est ce qui permet de hiérarchiser sans
multiplier les couleurs.

## La règle de rareté

La flamme n'apparaît que sur la preuve : `+83 % CA`, `+5,6 pts de marge`, la
section Réalisations, et les trois adresses en ligne. **Trois à cinq taches
d'orange sur une page, pas davantage.** C'est leur rareté qui leur donne leur
poids — dès qu'on en met partout, elles ne signalent plus rien.

Un titre de compétence n'est pas une preuve : il est en forêt. Un outil n'est
pas une preuve : il est en forêt. Seul le chiffre, et l'URL qu'on peut aller
vérifier, sont en flamme.

## Les gammes

```
ENCRE   900 #0C2740   800 #123553   700 #1A4874   600 #255E92   500 #3D7BAE
        300 #8FB2CE   200 #C2D6E6   100 #DEE9F2    50 #F1F6FA

FORÊT   900 #0B3527   800 #0F4634   700 #155E45   600 #1C7756   500 #2E9670
        300 #84C3AB   200 #BCDED0   100 #DBEDE5    50 #F0F8F4

FLAMME  700 #9C3A06   600 #BF4A08   500 #DE5E0E   400 #F07A22
        200 #F8C9A8   100 #FCE4D4    50 #FEF3EA
```

Le socle — la Formation — n'a pas de couleur propre : c'est de l'encre en
retrait. Choix éditorial assumé, le BTS de 2012 n'est pas l'argument du dossier.

Un cran, pas quatre : `ink-700` en texte, `ink-600` en marque — le cadre est à
`ink-800` / `ink-600`. Le socle avait glissé dans le gris (`text-muted`) et sur
`ink-300` pour l'année : la section se lisait comme désactivée, et l'année ne se
lisait plus du tout. Le retrait se joue sur une nuance et sur la composition —
pas de carte, pas de fond, pas de pastille — jamais sur la lisibilité.

## Le cas de la timeline

Les expériences ne changent pas de famille, elles changent de **nuance**. La
récence se lit dans l'intensité de la pastille : `ink-700` pour le poste
actuel, `ink-500` pour le précédent, `ink-300` pour les onze premières années.
Le regard descend du présent vers le passé.

La pastille seule. Les chevrons de puces l'ont suivie un temps, et sur la plus
ancienne expérience ils tombaient à 1,8:1 — six lignes de contenu sans bord
gauche. Un jalon pâle se lit encore comme « plus loin » ; une liste illisible
ne se lit pas. La récence est portée par le jalon et par la date.

## Accessibilité

Tous les tons employés en texte passent **WCAG AA**. Vérifié au navigateur,
contraste composité réel, sur les sept sections et le panneau latéral.

**La référence est le bas du dégradé, pas le blanc.** Le fond de page est un
dégradé en `background-attachment: fixed` : il se résout sur la fenêtre, donc
un même mot change de fond en défilant. Mesuré coin par coin, il va de
`#f6f8fa` à `#dee7f1`. Un ton validé sur blanc ne prouve rien — c'est ce qui
avait laissé passer `--text-muted` à 5,04:1 sur blanc et 4,03:1 sur la page.
**Tout ton de texte se vérifie sur `#dde8f2`** (`--fond-page-base`).

Corollaire sur les gammes : à ce niveau d'exigence, **le cran 600 ne suffit pas
pour du texte** — `forest-600` donne 4,4:1 et `flame-600` 4,0:1. Un rôle de
texte prend le cran 700, quelle que soit sa taille apparente. `--n-mark` reste
ce qu'il est : une marque — filet, icône, jalon.

## Comment l'utiliser

Les données déclarent une **nature**, jamais une couleur :

```js
{ title: "Opti'Profit", nature: "produit", ... }
```

Quatre valeurs possibles : `cadre`, `produit`, `preuve`, `socle`.

Le rendu pose une classe `n-<nature>` sur l'élément. Cette classe définit
`--n-ink`, `--n-mark`, `--n-surf`, `--n-line`, et tous les composants enfants
consomment ces variables **sans jamais connaître la couleur qu'ils portent** :

```css
.tag {
  background: var(--n-surf);
  color: var(--n-ink);
  border: 1px solid var(--n-line);
}
```

Ajouter un contenu = lui donner une `nature`. Rien d'autre. Aucune couleur ne
doit être écrite en dur dans un fichier `js/`.

Le référentiel des valeurs est en tête de `css/base.css`.

## Le papier n'est pas un écran rétréci

`css/print.css` ne rétrécit pas la page : il recompose le document.

- Bandeau à deux colonnes — identité à gauche, les trois chiffres à droite.
- Les adresses en ligne une seule fois, en tête, pas répétées après chaque lien.
- Sections numérotées, titre sur filet pleine mesure.
- Une seule grille pour tout le document : colonne de libellés à 30 mm,
  matière à droite. Les dates d'expérience et les numéros d'outils tombent dans
  cette même colonne.
- Ni cartes, ni rayons, ni ombres, ni pastilles : les étiquettes redeviennent du
  texte séparé par des points médians.

Les mêmes trois familles s'appliquent, en aplat plein sur papier.
