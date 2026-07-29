# Charte colorimétrique — CV interactif Jérémy Ribes

## Le principe

La couleur ne décore pas, elle **classe**. Chaque élément du CV porte la couleur
de sa **nature d'activité**, pas la couleur de la case où il est rangé.

Conséquence directe : quand deux éléments partagent une couleur, c'est un signal,
pas un hasard. Trois compétences en corail disent « cet homme travaille beaucoup
sur l'humain ». Un arc-en-ciel ne dit rien.

## Les 5 natures

Elles reprennent les cinq verbes du parcours.

| Nature           | Ce qu'elle désigne                          | Teinte       |
| ---------------- | ------------------------------------------- | ------------ |
| **structure**    | organiser, cadrer, écrire les process       | bleu ardoise |
| **decision**     | outiller, calculer, éclairer un choix       | ambre        |
| **performance**  | le résultat mesuré (CA, marge, KPI)         | émeraude     |
| **coordination** | l'humain : interface, adhésion, équipe      | corail       |
| **exploration**  | ce qui est construit hors mandat            | indigo       |

## Les 2 neutres de hiérarchie

| Neutre       | Rôle                                                   | Teinte       |
| ------------ | ------------------------------------------------------ | ------------ |
| **graphite** | l'identité, la voix — le Profil                        | encre        |
| **socle**    | le prérequis, volontairement en retrait — la Formation | gris-ardoise |

Le **socle** est un choix éditorial : le BTS de 2012 n'est pas l'argument du
dossier. On ne l'éteint pas, on ne l'illumine pas.

## La règle de rareté

**L'émeraude est réservée à la preuve chiffrée.** `+83 % CA`, `+5,6 pts de
marge`, la section Réalisations, l'outil PANUM, et le rôle affiché sous le nom.
C'est le seul endroit du CV où l'œil doit être happé — et c'est le seul aplat
plein autorisé. Plus une couleur est rare, plus elle pèse.

## Hiérarchie de lecture

Trois niveaux d'intensité, disponibles pour chaque nature :

| Token     | Usage                       | Contrainte                     |
| --------- | --------------------------- | ------------------------------ |
| `-ink`    | texte                       | contraste ≥ 4.5:1 sur blanc    |
| `-mark`   | pastille, filet, puce       | contraste ≥ 3:1 (non-texte)    |
| `-surf`   | aplat ~10 %                 | support de `-ink`              |
| `-line`   | bordure                     | —                              |

Ce qui donne, en pratique :

1. **La preuve** — chiffres émeraude, mono, corps large, sur aplat.
2. **La structure** — titres de section et de carte en `-ink` plein.
3. **Le support** — tags, chips, labels en `-surf` + `-ink`, discrets par
   construction.

## Le cas de la timeline

Les expériences ne changent pas de nature — elles changent d'**intensité**.
La récence est encodée par la vivacité de la pastille et des puces :

- `tl-now` (2025 → aujourd'hui) : corail vif
- `tl-recent` (2024 → 2025) : graphite
- `tl-past` (2012 → 2023) : socle

Le regard descend naturellement du présent vers le passé.

## Accessibilité

Toutes les valeurs `-ink` passent **WCAG AA** (≥ 4.5:1) sur fond blanc et sur
leur propre `-surf`. C'était une correction nécessaire : l'ancienne palette
échouait sur 4 accents sur 5, appliqués à du texte de 13 à 16 px.

| Ancien              | Nouveau                     |
| ------------------- | --------------------------- |
| `#0f9f8c` — 3.30:1 ❌ | `--performance-ink` — 6.19:1 ✅ |
| `#c77d1f` — 3.29:1 ❌ | `--decision-ink` — 6.17:1 ✅    |
| `#d14f72` — 4.14:1 ❌ | `--coordination-ink` — 6.13:1 ✅ |
| `#6470f5` — 4.06:1 ❌ | `--exploration-ink` — 7.11:1 ✅ |
| `#7d8aa5` — 3.47:1 ❌ | `--text-muted` — 4.98:1 ✅      |

## Comment l'utiliser

Les données portent une **nature**, jamais une couleur :

```js
{ title: "Outils d'aide à la décision", nature: "decision", ... }
```

Le rendu pose une classe `n-<nature>` sur l'élément. Cette classe définit
`--n-ink`, `--n-mark`, `--n-surf`, `--n-line`, et tous les composants enfants
consomment ces variables **sans jamais connaître la couleur qu'ils portent**.

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
