# Charte colorimétrique — CV interactif Jérémy Ribes

## Principe — Editorial Signal

La couleur n'encode plus la taxonomie interne du CV.

Le lecteur n'a pas à apprendre que « cadre » signifie bleu et « produit » vert. Ces natures restent utiles dans les données, mais elles ne constituent pas une légende visuelle.

Le système courant suit désormais une règle plus directe :

| Rôle visuel | Couleur | Fonction |
| --- | --- | --- |
| **Encre** | bleu nuit | tout ce qui se lit, structure et organise |
| **Secondaire** | slate dérivé | contexte, dates, métadonnées, libellés |
| **Preuve** | cuivre sombre | résultats qui doivent arrêter le regard |
| **Forêt** | vert profond | landing uniquement, pour raconter l'hybridité du profil |

La hiérarchie principale vient d'abord de la typographie, de l'espace, des axes, des retraits et de la graisse. La couleur n'est plus chargée de différencier des catégories de contenu que le lecteur ne connaît pas.

## Doctrine de lecture

Le CV doit pouvoir être compris sans connaître sa charte.

La lecture visuelle attendue est :

1. **Encre** : information à lire.
2. **Slate** : information qui documente ou contextualise.
3. **Cuivre** : preuve rare qui mérite un arrêt du regard.

Une couleur de preuve n'est pas une couleur d'action. Les liens conservent donc l'Encre ; leur affordance est portée par le soulignement, la flèche, le focus et le comportement du contrôle.

## Palette courante

```text
ENCRE   900 #0B1F33   800 #112D47   700 #193F5E   600 #2C5F86
        500 #467C9F   300 #8FA9BB   200 #C8D2DB   100 #E0E6EA
         50 #F2F5F7

PREUVE  700 #A84512   600 #B9531C   500 #C96632   400 #D88055
        200 #EFC4AE   100 #F7DFD3    50 #FCF2ED

TEXTE   principal   #0B1F33
        secondaire #40566A
        métadonnée #56697A

PAPIER  haut       #F7F8FA
        milieu     #F3F5F7
        bas        #EEF2F5
```

La gamme Forêt historique reste disponible dans `css/base.css` pour la landing. Elle n'est plus une couleur structurelle du CV courant.

## La règle de rareté

Le cuivre n'est pas un thème ; c'est un signal.

Il est réservé aux preuves qui doivent modifier l'évaluation du profil :

- résultat mesuré ;
- métrique forte ;
- conclusion objectivable d'une expérience ;
- élément explicitement qualifié comme preuve dans le contenu.

Il ne doit pas servir simplement parce qu'un élément est cliquable, qu'un produit existe en ligne ou qu'un bloc appartient à une catégorie donnée.

Plus le cuivre apparaît, moins il signifie.

## Les natures de données restent conservées

Les contenus continuent à déclarer :

```text
cadre
produit
preuve
socle
```

Cette information reste utile pour le modèle métier, l'impression, l'analyse ou de futurs traitements.

En revanche, le rendu écran n'établit plus la correspondance :

```text
cadre   = bleu
produit = vert
```

`cadre` et `produit` partagent désormais la même famille Encre. La différence entre eux est portée par les mots, la structure et la composition.

`preuve` conserve un traitement cuivre rare.

`socle` reste une Encre légèrement moins appuyée ; le retrait ne doit jamais se transformer en manque de contraste.

## Landing

La landing constitue un cas différent du CV courant.

Elle montre quelques grands énoncés sur un écran presque vide. Dans ce contexte précis, Encre + Forêt peut matérialiser l'hybridité du profil sans demander au lecteur d'apprendre une légende.

Le vert est donc conservé pour cet usage uniquement.

La landing ne possède toujours pas sa propre palette : elle consomme les tokens globaux. Le fond papier est commun à la landing et au CV afin de préserver le raccord.

## Fond

Le précédent fond bleu consommait en permanence une partie du budget chromatique.

Le fond courant est un papier froid très léger :

```text
#F7F8FA → #F3F5F7 → #EEF2F5
```

Il reste suffisamment matérialisé pour ne pas donner un blanc générique, mais assez neutre pour laisser l'Encre, la photo et le cuivre porter la hiérarchie.

## Contraste

Les valeurs ont été choisies sur le point le plus défavorable du nouveau fond, `#EEF2F5`.

Ordres de grandeur :

| Token | Contraste sur `#EEF2F5` | Usage |
| --- | ---: | --- |
| `#0B1F33` | ~14,8:1 | texte principal |
| `#40566A` | ~6,8:1 | texte secondaire |
| `#56697A` | ~5,0:1 | petits libellés / métadonnées |
| `#A84512` | ~5,3:1 | texte de preuve |
| `#B9531C` | ~4,3:1 | marque de preuve, focus, filet ; pas le petit texte courant |

Le principe reste le même : un cran de marque n'est pas automatiquement un cran de texte.

## Affordance

La couleur seule ne doit jamais dire qu'un élément est interactif.

Les contrôles doivent rester reconnaissables par au moins un autre signifiant persistant :

- soulignement ;
- flèche ;
- trait d'état ;
- forme de contrôle ;
- focus visible ;
- libellé d'action.

Les produits en ligne sont donc rendus en Encre, même s'ils restent des éléments vérifiables au niveau des données.

## Impression

Le papier suit la même doctrine :

- titres et contenu : Encre ;
- contexte : Encre/slate en retrait ;
- preuves fortes : cuivre ;
- liens en ligne : Encre, pas cuivre ;
- pas de vert structurel dans le document imprimé.

## Implémentation

`css/editorial-signal.css` est la passe de direction colorimétrique UXER.

Elle est chargée avant le premier rendu par `js/ui/intro.js` et vient après les feuilles historiques. Cette couche permet de modifier la direction chromatique sans réécrire les composants ni supprimer la sémantique `nature` des données.

Les feuilles historiques restent la base fonctionnelle ; la couche Editorial Signal porte la décision visuelle actuelle.
