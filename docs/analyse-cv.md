# Analyse rédactionnelle du CV — Jérémy Ribes

Périmètre analysé : `js/data/profile.js`, `js/data/experiences.js`, `js/data/competences.js`,
`js/data/outils.js`, `js/data/projets.js`, `js/data/sections.js`, `js/data/contact.js`,
et la version `<noscript>` d'`index.html`.

Ce document est une analyse et une proposition. Il ne modifie aucun fichier de données :
plusieurs corrections dépendent d'informations que je n'ai pas (voir section F).

---

## A. Diagnostic général

### Ce qui est solide

**La matière est réelle.** Ce CV ne décrit pas des intentions, il décrit des objets qui
existent : six outils nommés, trois projets dont deux en ligne, un résultat commercial
chiffré, une méthode identifiable. Beaucoup de CV n'ont pas ça.

**La preuve la plus forte est là.** Deux outils conçus chez un employeur sont encore
utilisés aujourd'hui chez un autre. C'est le fait le plus difficile à contester du dossier :
il prouve l'utilité par l'usage, pas par l'affirmation. Un recruteur ne peut rien opposer
à ça.

**Le positionnement est cohérent.** Le fil « je déplace ma valeur de la vente vers
l'organisation de l'activité » tient sur toute la durée du parcours, et les outils le
documentent. Ce n'est pas une reconversion annoncée, c'est une trajectoire visible.

### Ce qui bloque

**1. La trajectoire descend pendant que le discours monte.** C'est le problème
principal. Le CV parle de rôle transverse, de pilotage, de coordination — pendant que la
chronologie affiche : Responsable de magasin (2024-2025) → Opticien collaborateur
(2025-aujourd'hui). Une régression hiérarchique, après un an seulement comme responsable,
et juste après avoir annoncé +83 % de CA. Rien n'explique ce mouvement. Un recruteur le
verra en quinze secondes, et il en tirera ses propres conclusions, qui seront pires que la
réalité. Tant que ce point n'est pas traité de front, le reste du CV travaille contre un
doute qu'il ne lève pas.

**2. Le titre affiché n'a jamais été occupé.** « Coordinateur de la Performance
Commerciale » n'apparaît nulle part dans les expériences. Les intitulés réels sont
Opticien collaborateur et Responsable de magasin. Afficher un titre-cible est une
convention admise en France, mais ici l'écart est trop grand et rien ne le signale : le
lecteur passe du titre aux expériences et constate un décalage. L'effet est l'inverse de
celui recherché.

**3. Un seul résultat chiffré, répété cinq fois.** Le couple +83 % / +5,6 pts apparaît
dans `realisations.stats`, dans le tag de l'expérience Générale d'Optique, dans
`competences[pilotage-commercial].resultat`, dans `outils[optiprofit].results` et dans le
`<noscript>`. Répété, un chiffre cesse d'être une preuve pour devenir une insistance — et
il souligne surtout qu'il est le seul. Quatorze ans de carrière, six outils, trois
projets : un seul chiffre.

**4. Une signature stylistique qui trahit le texte.** Deux figures reviennent en
permanence :

- la triade — « plus lisible, plus fluide et plus pilotable », « structurer sans alourdir,
  outiller sans compliquer, faire adopter », « plus rapide, plus fiable et plus homogène »,
  « moins d'erreurs, moins de ressaisie et moins d'hésitation », « cadrage, priorisation,
  coordination, validation » ;
- l'antithèse en *sans* — « sans la rigidifier », « sans alourdir », « sans compliquer »,
  « sans rigidifier inutilement », « sans dégrader la compétitivité », « sans dépendre d'un
  retraitement manuel ».

Prises isolément, ces phrases sont bonnes. Répétées trente fois sur un document, elles
produisent exactement l'effet que vous voulez éviter : un texte qui sonne fabriqué. C'est
le défaut le plus diffus et le plus coûteux du CV.

**5. Les résultats des compétences sont des auto-évaluations.** « Un fonctionnement plus
prévisible », « une décision plus fiable », « une coordination plus lisible », « un
pilotage plus factuel ». Cinq rubriques *Résultat observable* sur sept ne contiennent
aucun élément observable. Le label promet un fait et livre un adjectif. C'est plus
dommageable que de ne rien mettre.

**6. Onze ans en trois lignes.** La période 2012-2023 — la majorité de la carrière — tient
en trois puces génériques, sans dates par enseigne, sans progression, sans un seul fait.
Un recruteur y lit onze ans indifférenciés, donc onze ans sans évolution. C'est faux, mais
c'est ce que le CV donne à lire.

**7. Le même poste est raconté deux fois.** L'expérience Générale d'Optique
(`experiences[1]`) et la section « Cas concret » décrivent le même mandat 2024-2025. La
substance a migré vers le Cas concret ; il ne reste dans l'expérience que quatre puces de
fiche de poste. Résultat : le poste le plus élevé du parcours est aussi le plus mal
décrit à l'endroit où le lecteur le cherche.

**8. Le CV explique sa propre architecture.** La `note` de `realisations.js` — « Ce cas
n'est qu'un exemple : les dispositifs qu'il mobilise ne sont qu'une partie de ceux
détaillés dans Outils… » — est un mode d'emploi du document. Qu'il ait fallu l'écrire est
le symptôme : les sections se recouvrent, et la note tente de réparer par le commentaire
ce qui devrait l'être par la structure.

**9. On ne sait pas si vous codez.** « Développement d'un algorithme sous Google Apps
Script » suggère oui. « Coordination du développement » (KuT) suggère non. Le CV ne
tranche jamais. C'est la première question technique d'un recruteur, et l'ambiguïté sera
lue comme une esquive.

### Verdict

Le CV a un problème de **hiérarchie et de preuve**, pas de fond. Le fond est là. Il est
enterré sous une architecture qui met les compétences déclaratives avant le parcours, qui
raconte le même outil dans trois sections, et qui remplace les faits manquants par des
adjectifs comparatifs. Trois chantiers dans l'ordre : traiter la régression de poste,
réordonner les sections, remplacer les adjectifs par des faits ou les supprimer.

---

## B. Problèmes prioritaires

| Priorité | Section | Problème identifié | Conséquence | Correction recommandée |
|---|---|---|---|---|
| **Critique** | Expériences | Régression Responsable de magasin → Opticien collaborateur (2025) non expliquée | Le lecteur suppose un échec, un licenciement ou une rupture. Doute non levé sur tout le reste du CV | Une ligne factuelle de contexte sur le poste actuel + reformuler son intitulé par son contenu réel |
| **Critique** | Titre | « Coordinateur de la Performance Commerciale » n'a jamais été occupé | Décalage immédiat entre titre et expériences ; perte de crédibilité dès la première section | Titre ancré dans le réel + mention explicite du poste visé |
| **Critique** | Expériences | 2012-2023 : 11 ans en 3 puces vagues, sans dates par enseigne | Lu comme onze ans de stagnation | Décomposer par enseigne avec dates et au moins un fait par période |
| **Critique** | Compétences | 5 rubriques *Résultat observable* sur 7 ne contiennent aucun fait observable | Le label promet une preuve et livre un adjectif : effet contre-productif | Remplacer par un fait, un usage constaté ou un volume — sinon supprimer la rubrique |
| **Important** | Transversal | +83 % / +5,6 pts répété 5 fois, avec deux précisions différentes (5,6 / 5,64) | Le chiffre s'use, et sa répétition signale qu'il est le seul | Une seule occurrence canonique (l'expérience), un rappel maximum ; unifier sur +5,6 pts |
| **Important** | Transversal | Triades et antithèses en *sans* omniprésentes | Le texte sonne généré ; perte de naturel et de crédibilité | Casser deux triades sur trois ; limiter les *sans* à deux occurrences sur tout le CV |
| **Important** | Cas concret / Expériences | Le mandat 2024-2025 est décrit dans deux sections | Doublon visible ; l'expérience réduite à une fiche de poste creuse | Fusionner : l'expérience porte le contenu, le Cas concret devient son développement explicite |
| **Important** | Cas concret / Outils | Opti'Profit, Brief'Maker, Planning, suivi des devis décrits deux à trois fois | Le lecteur croit voir plus de dispositifs qu'il n'y en a, puis s'aperçoit du contraire | Le Cas concret nomme les outils sans les redécrire ; Outils reste le seul lieu de description |
| **Important** | Compétences | 7 domaines dont 3 paires largement redondantes | Dilution : sept compétences moyennes valent moins que quatre nettes | Consolider à 4-5 domaines (détail en C.4) |
| **Important** | Transversal | Ambiguïté sur le rôle technique réel (concepteur ? développeur ? pilote ?) | Première question du recruteur laissée sans réponse | Trancher explicitement, y compris pour dire « je conçois et je développe moi-même sous Apps Script, je coordonne le développement sur KuT » |
| **Important** | Contact | Aucun e-mail direct, aucun téléphone, aucun LinkedIn : uniquement un formulaire | Friction à l'endroit exact où le recruteur décide d'agir | Ajouter e-mail et LinkedIn en clair ; garder le formulaire en complément |
| **Important** | Réalisations | `note` expliquant l'articulation entre sections | Un CV qui commente sa propre structure affaiblit sa structure | Supprimer la note et résoudre le recouvrement par l'architecture |
| **Amélioration** | Profil | « Le pivot de la performance collective » | Auto-désignation grandiloquente, en ouverture de section | Garder la seconde moitié de la phrase, supprimer l'étiquette |
| **Amélioration** | Contact | Date de naissance affichée avec une icône gâteau | Information à risque de discrimination, registre informel | Supprimer |
| **Amélioration** | Formation | « Orchestration de workflows IA multi-agents » : 60 mots, aucun livrable | Lu comme du name-dropping | Raccourcir et rattacher à un produit réel |
| **Amélioration** | Projets | « Renta Menu 3.0 🍽️ », « modèles mathématiques avancés », « superprofit » | Registre décalé, superlatif non justifié, terme impropre | Retirer l'emoji et « avancés » ; remplacer « superprofit » par « résultat » |
| **Amélioration** | Sections | Sous-titres qui comptent (« 5 dispositifs détaillés », « 7 domaines clés ») | Annonce du volume, pas de la valeur | Sous-titres qui qualifient |
| **Amélioration** | `index.html` | La version `<noscript>` est désynchronisée des données (Hub absent, Brief'Maker obsolète) | Version dégradée servie aux lecteurs sans JS et aux aperçus de lien | Resynchroniser après validation de la réécriture |

---

## C. Analyse détaillée par section

### C.1 — Titre et sous-titre (`contact.js`)

> « Coordinateur de la Performance Commerciale »
> « Outils métiers | Appui à la Décision | Pilotage terrain | Structuration de l'activité »

**Constat.** Le titre décrit une cible, pas un état. Aucune ligne du parcours ne le porte.
Le sous-titre est une liste de mots-clés séparés par des barres verticales, avec des
majuscules incohérentes (« Décision » majuscule, « terrain » minuscule) et une casse
non standard en français (« Performance Commerciale »).

**À conserver.** Les quatre thèmes du sous-titre sont justes et couvrent bien le profil.

**À corriger.** Réconcilier le titre avec le parcours. Trois voies possibles :

- *Voie prudente* — intitulé réel + cible affichée comme cible :
  « Opticien · 14 ans en réseau — organisation de l'activité et outils métiers »,
  puis une ligne « Recherche : rôle transverse organisation / outils métiers ».
- *Voie fonctionnelle* — intitulé qui décrit ce que vous faites plutôt qu'un grade :
  « Structuration de l'activité & outils métiers — parcours retail optique ».
- *Voie assumée* — garder le titre-cible, mais l'accroche doit dire en une phrase d'où
  vous venez, sinon le décalage n'est jamais expliqué.

Je recommande la voie fonctionnelle : elle est honnête, elle est cherchable, et elle
n'oblige pas à revendiquer un grade.

Séparateurs : remplacer `|` par `·`, casse basse partout sauf initiale.

**À compléter.** Les intitulés de postes réellement visés. « Rôle transverse » ne
correspond à aucune offre. Chef de projet organisation ? Responsable process et outils ?
Business analyst métier ? Product owner ? Le recruteur doit pouvoir vous ranger.

---

### C.2 — Accroche (`contact.intro`)

> « Professionnel de terrain avec 14 ans d'expérience en environnement commercial, j'ai
> progressivement orienté mon parcours vers ce qui me mobilise le plus : concevoir des
> outils concrets pour fiabiliser les décisions, structurer l'activité et fluidifier le
> travail au quotidien. »

**Constat.** Trois problèmes. « Professionnel de terrain » ne dit pas le métier —
le mot *opticien* n'apparaît nulle part dans l'accroche, alors que c'est le socle. « Ce
qui me mobilise le plus » est une formulation d'affect, cousine de « passionné ». Et la
phrase se termine sur une triade d'infinitifs sans aucune preuve : l'accroche annonce une
posture, pas un fait.

**À conserver.** L'idée de bascule progressive — c'est le bon angle, et elle est vraie.
« 14 ans » est un bon ancrage.

**À corriger.** Une accroche de CV doit répondre à quatre questions en trois phrases :
qui je suis, ce que j'ai fait, ce que ça a produit, ce que je cherche. Ici il manque la
troisième et la quatrième. La preuve la plus forte du dossier — des outils encore
utilisés dans un magasin où vous ne les aviez pas déployés — doit être dans l'accroche,
pas au dixième paragraphe d'une fiche outil.

**À compléter.** Le nombre exact d'outils conçus et déployés.

---

### C.3 — Profil (`profile.js`)

> « Le pivot de la performance collective : rendre une activité plus lisible, plus fluide
> et plus pilotable, sans la rigidifier. »

**Constat.** « Le pivot de la performance collective » est une auto-désignation, placée en
ouverture de la première section de fond. La suite de la phrase, en revanche, est
excellente : concrète, tenue, vérifiable dans les outils. La citation contient donc le
meilleur et le pire du CV dans la même ligne.

Le reste de la section est bien construit — Positionnement, Méthode, Expertise, Ce que
j'apporte, Ce que je vise — mais souffre de deux choses :

- **surcharge de `<strong>`** : dans `intro`, sept groupes en gras sur une phrase de
  trente mots. Quand tout est en gras, plus rien ne l'est.
- **`contributionTags`** : six étiquettes abstraites (Structuration, Aide à la décision,
  Utilité terrain, Pilotage factuel, Coordination, Adhésion) sans un seul exemple. C'est
  la définition d'une liste de compétences sans preuve.

**À conserver.** La structure Positionnement / Méthode / Cible. « Structurer sans
alourdir » est une bonne formule — mais elle doit être la *seule* antithèse en *sans* du
CV, pas la première de six.

**À corriger.**
- Supprimer « Le pivot de la performance collective : », garder le reste.
- Réduire le gras à deux ou trois groupes par paragraphe.
- Les `contributionTags` : soit chaque étiquette porte un exemple d'un mot, soit la
  rubrique disparaît. En l'état elle n'ajoute rien à ce que les sections suivantes
  démontrent.

**Trop vague.** « Ce que je vise : un rôle transverse où je peux prendre en charge la
structuration d'une activité existante. » Quelle taille d'organisation ? Quel secteur —
optique uniquement, retail, tout secteur à réseau de points de vente ? Quelle mobilité ?
Sans ces éléments, la cible n'est pas actionnable.

**À compléter.** Secteur(s) visé(s), mobilité géographique, disponibilité.

---

### C.4 — Compétences (`competences.js`)

**Constat.** Sept domaines, chacun en cinq rubriques (résumé, tags, enjeu, mise en place,
exemple, résultat). C'est la section la plus longue du CV et la moins dense en faits.

**Redondances réelles.** Trois paires se recouvrent largement :

| Paire | Recouvrement |
|---|---|
| `organisation-methodes` / `redaction-process` | Les deux décrivent la formalisation de procédures. L'exemple de `redaction-process` — « procédures de back-office, supports de brief quotidien » — est mot pour mot le champ de `organisation-methodes` |
| `interface-coordination` / `management-utilite` | Les deux traitent de l'adhésion et de l'alignement direction/terrain. L'un finit sur « des priorités mieux partagées », l'autre sur « des usages réellement adoptés » : c'est la même idée |
| `outils-aide-decision` / `suivi-reporting` | Les deux décrivent la conception d'indicateurs et d'outils de suivi. PANUM sert d'illustration aux deux |

**Résultats non observables.** La rubrique s'appelle *Résultat observable*. Contenu réel :

| Domaine | Résultat annoncé | Observable ? |
|---|---|---|
| Pilotage commercial | +83 % CA, +5,64 pts marge | Oui |
| Organisation & méthodes | « plus prévisible, plus fluide et plus sûr » | Non |
| Outils d'aide à la décision | « plus rapide, plus fiable et plus homogène » | Non |
| Interface & coordination | « priorités mieux partagées, coordination plus lisible » | Non |
| Management par l'utilité | « des usages réellement adoptés » | Non — sauf à nommer lesquels |
| Suivi & reporting | « plus factuel, plus réactif et plus utile » | Non |
| Cadrage & sécurisation | « les process que je rédige sont utilisés parce qu'ils sont utiles » | Non — c'est une maxime |

Six sur sept sont des adjectifs comparatifs. Or vous *avez* des faits observables pour au
moins trois d'entre eux : le brief quotidien et le suivi des devis sont toujours en usage,
dans un magasin différent de celui où ils ont été conçus. C'est un résultat observable, et
il n'est pas dans la colonne.

**Incohérences de forme.**
- Six résumés commencent par un infinitif (« Développer », « Mettre en place », « Créer »,
  « Faire le lien », « Faire adhérer », « Rendre visibles ») ; le septième est nominal
  (« Transformation de contraintes métier… »). À aligner.
- Mélange de temps : passé composé (« J'ai travaillé », « J'ai conçu ») et présent de
  généralité (« Je conçois des outils simples quand l'activité manque de lisibilité »,
  « Je rédige les process avec une logique… »). Le présent de généralité transforme une
  expérience datée en posture permanente : il affaiblit au lieu de renforcer.
- `redaction-process` porte l'identifiant `redaction-process` mais s'intitule « Cadrage &
  sécurisation des décisions ». Divergence à corriger dans le code.

**Trop détaillé.** `redaction-process.miseEnPlace` fait 70 mots et développe le modèle de
Kano sur trois propositions. C'est une explication de méthode, pas une compétence de CV.
La référence à Kano est un bon signal — gardez-la, en une incise.

**Recommandation.** Consolider à cinq domaines :

1. **Pilotage commercial et rentabilité** — reprend `pilotage-commercial`
2. **Organisation et formalisation des process** — fusionne `organisation-methodes` +
   `redaction-process`
3. **Conception d'outils métiers** — reprend `outils-aide-decision`
4. **Pilotage par la donnée** — reprend `suivi-reporting`, recentré sur les indicateurs
   causaux, qui est votre angle différenciant
5. **Coordination direction / terrain et conduite du changement** — fusionne
   `interface-coordination` + `management-utilite`

Et pour chacun : une phrase de définition, un fait, point. Supprimer la rubrique
*Résultat observable* partout où elle ne peut pas contenir un fait.

**À compléter.** Pour chaque domaine, un élément mesurable : délai avant/après, nombre de
dossiers traités, temps gagné estimé, nombre d'utilisateurs des procédures.

---

### C.5 — Cas concret / Réalisations (`experiences.js` → `realisations`)

**Constat.** Section bien conçue sur le principe — un cas développé vaut mieux qu'un
inventaire — mais elle entre en collision avec deux autres sections.

**Doublon avec Expériences.** Le Cas concret *est* le poste Générale d'Optique 2024-2025,
qui a par ailleurs sa propre entrée dans `experiences[1]`. Le lecteur voit le même mandat
deux fois, avec deux niveaux de détail opposés : six puces riches ici, quatre puces creuses
là-bas.

**Doublon avec Outils.** Quatre des six puces redécrivent des outils qui ont chacun une
fiche complète dans la section Outils : Opti'Profit, le suivi des devis, Brief'Maker, le
Gestionnaire de Planning. Le lecteur lit deux fois la même chose, à quelques écrans
d'intervalle.

**La note.** Le champ `note` explique au lecteur comment articuler les sections entre
elles. C'est un aveu de structure. Un CV ne se commente pas : si une clarification est
nécessaire, c'est que l'organisation doit changer.

**À conserver.** Le principe du cas développé. Les deux statistiques. La mention
« Toujours en usage dans mon poste actuel » — c'est la meilleure ligne de tout le CV, et
elle apparaît deux fois en fin de puce, à l'endroit le moins lu.

**À corriger.**
- Fusionner avec l'expérience Générale d'Optique : un seul endroit où ce mandat est
  raconté, avec tout le contenu.
- Les outils sont *nommés* ici et *décrits* uniquement dans Outils.
- Supprimer la note.
- « oublis administratifs fortement réduits » : superlatif non mesuré. Remplacer par un
  fait ou supprimer l'adverbe.
- Unifier +5,6 / +5,64.

**Trop vague.** « Uberall/Yext » — deux produits concurrents séparés par une barre. Lequel
avez-vous utilisé ? Le slash donne l'impression d'une citation d'outils plutôt que d'un
usage.

**À compléter.** La base de comparaison des +83 %. Par rapport à N-1 ? Aux deux mois
précédents ? À un objectif ? Sans base, un pourcentage sur un magasin en perte de vitesse
peut être lu comme un effet de base faible. Préciser désamorce l'objection. Idem pour la
taille du magasin et l'effectif encadré.

---

### C.6 — Outils (`outils.js`)

**Constat.** C'est la section la mieux écrite du CV. Structure Contexte / Action /
Résultats systématique, statuts honnêtes, distinction claire entre ce qui tourne et ce qui
attend. La fiche **Hub Outils Opticien** est le meilleur texte du dossier : irritant précis,
réponse précise, résultat vérifiable, et une phrase de méthode qui tombe juste.

Le traitement des statuts mérite d'être souligné : « Abouti · en attente de déploiement
pilote » pour PANUM, et l'aveu que le Gestionnaire de Planning ne construit plus les
plannings aujourd'hui. Cette franchise vaut mieux que n'importe quelle formule de
valorisation — elle rend crédible tout le reste.

**À conserver.** Tout le squelette. Les statuts. Les liens.

**À corriger.**

*Opti'Profit — résultats.* Phrase mal construite et attribution confuse :

> « cet outil a contribué à un gain de +5,64 points de marge et grâce à des actions
> conjointes une hausse de +83 % du chiffre d'affaires en deux mois »

On ne sait pas si l'outil a produit les 5,64 points seul. La syntaxe est cassée (« et grâce
à des actions conjointes une hausse »). Et ce chiffre appartient à l'expérience, pas à la
fiche outil. Recommandation : décrire ici ce que fait l'outil, renvoyer le chiffre à
l'expérience.

*PANUM.* La fiche est la plus longue et la moins concrète : « tableaux de bord
multi-niveaux », « mécanismes d'aide à la décision adaptés aux collaborateurs, managers et
responsables de réseau ». Trois niveaux d'utilisateurs annoncés pour un produit qui n'a
pas encore de déploiement pilote — le contraste entre l'ambition décrite et le statut réel
travaille contre vous. Resserrer sur ce que le produit fait aujourd'hui.

*Brief'Maker — résultats.* « réduction drastique des oublis administratifs » : superlatif
non mesuré, dans une fiche qui contient par ailleurs la meilleure preuve possible (usage
quotidien maintenu hors du contexte d'origine). Le superlatif affaiblit le fait qui le
suit. Supprimer « drastique ».

*Gestionnaire de Planning.* Le contexte et l'action sont abstraits (« ajuster les
ressources aux besoins réels », « fluidifier le parcours client à partir des contraintes
d'activité ») là où les autres fiches sont concrètes. Sur quoi l'outil s'appuyait-il —
flux horaire, historique de fréquentation, amplitude d'ouverture ?

**Trop détaillé.** Rien. Les longueurs sont bien calibrées, à l'exception de PANUM.

**À compléter.**
- Combien de personnes utilisent chaque outil aujourd'hui ?
- Temps de conception de chacun — utile pour démontrer une capacité de livraison rapide.
- Pour le Hub : nombre d'outils regroupés, fréquence d'usage quotidienne.
- Pour PANUM : y a-t-il des points de vente identifiés pour le pilote ?

**Remarque de maintenance.** Les fichiers `outils.js` et `experiences.js` contiennent de
longs commentaires d'auto-justification rédactionnelle (une quarantaine de lignes au
total). Ils documentent des arbitrages passés et n'ont pas d'effet sur le rendu. À
déplacer dans un fichier de décisions éditoriales si vous voulez les garder, ou à
supprimer : dans les données, ils alourdissent la relecture.

---

### C.7 — Expériences (`experiences.js`)

**Constat.** C'est la section la plus déséquilibrée du CV, et elle arrive en cinquième
position sur sept — après Compétences, Cas concret et Outils. Un recruteur cherche le
parcours d'abord.

| Expérience | Durée | Puces | Densité |
|---|---|---|---|
| Krys (2025 →) | 1 an | 6 | Forte — campagne 1 000+ clients, contrôles automatisés |
| Générale d'Optique (2024-2025) | 1 an | 4 | Nulle — fiche de poste intégrale |
| GrandOptical · Krys · Lissac (2012-2023) | 11 ans | 3 | Très faible |

Onze ans obtiennent trois puces ; un an en obtient six. Le rapport est inversé.

**Problèmes de chronologie.**

- **Régression non expliquée.** Responsable de magasin → Opticien collaborateur. Voir le
  diagnostic général : c'est le point le plus coûteux du CV.
- **Krys apparaît deux fois** — dans la période 2012-2023 et en 2025. Un retour chez un
  ancien employeur est un signal plutôt positif, mais non signalé il se lit comme une
  erreur de saisie.
- **Absence de mois.** « 2024 → 2025 » peut couvrir treize mois comme deux. Sur un poste
  de responsable qui a duré environ un an, la précision joue en votre faveur.
- **Discontinuité apparente 2023 → 2024.** Rien ne relie la fin de 2023 au début de 2024.
  S'il y a une interruption, mieux vaut la nommer que la laisser deviner.
- Le sous-titre de section annonce « 3 expériences » alors que la troisième entrée
  regroupe trois enseignes. Le compte est faux.

**À conserver.** Les puces de Krys — ce sont les meilleures formulations « action +
contexte » du CV. La campagne e-mail auprès de plus d'un millier de clients avec contrôle
des consentements est un fait précis, vérifiable et transférable hors optique.

**À corriger.**
- Remonter la section en position 2, juste après le profil.
- Rééquilibrer : Générale d'Optique doit être la plus riche des trois, puisque c'est le
  poste le plus élevé et celui qui porte le résultat.
- Décomposer 2012-2023 par enseigne, avec dates et un fait par période.
- « Contribution à l'amélioration de l'organisation, de la lisibilité de l'activité et du
  pilotage » : « contribution à » vous efface de votre propre action, et la phrase est une
  triade d'abstractions. À réécrire à l'action.
- « Bonne connaissance des contraintes terrain en magasin » : une auto-évaluation
  (« bonne ») sur un fait qui va de soi après onze ans. À supprimer ou à remplacer par un
  fait.

**À compléter.**
- Dates par enseigne sur 2012-2023, et mois sur tous les postes.
- Effectif encadré chez Générale d'Optique, taille du magasin, CA géré.
- Raison du changement de poste en 2025.
- Sur 2012-2023 : responsabilités confiées au-delà de la vente (tutorat, ouverture,
  remplacement de responsable, référent technique), premiers outils construits et quand.

---

### C.8 — Projets transverses (`projets.js`)

**Constat.** Trois projets, traités de manière inégale.

**KuT.** Le plus abouti sur le papier. Bonne description fonctionnelle. Deux réserves :
« Conception produit de bout en bout » est une revendication forte qui appelle une preuve
d'usage, et « coordination du développement » laisse entendre que quelqu'un d'autre code —
ce qui contredit l'image de concepteur-développeur donnée ailleurs. À clarifier.

**L'Ortabels.** Le projet le plus intéressant techniquement — degrés-jours, modèles de
croissance thermique, fenêtres de semis — et le plus mal exploité. Trois puces, aucun
résultat, aucune indication d'usage. Un modèle prédictif appliqué à un domaine
inhabituel démontre exactement la compétence que le CV revendique : transformer de la
donnée en décision terrain. Il mérite plus de place que Renta Menu.

**Renta Menu 3.0.** Plusieurs problèmes de registre :
- l'emoji 🍽️ dans le titre, seul du CV, casse l'homogénéité ;
- ni lien ni statut, contrairement aux deux autres : on ne sait pas si l'outil existe ;
- « modèles mathématiques avancés (régressions linéaires inverses et logarithmiques) » —
  une régression linéaire n'est pas avancée. Le superlatif attire l'attention d'un lecteur
  technique au mauvais endroit. La description sans « avancés » est plus impressionnante ;
- « projections de superprofit » — le terme est impropre en gestion. Dire « projections de
  résultat ».

**Compétences transférables.** Douze cartes au total, quatre par projet, souvent
génériques (« Vision d'ensemble », « Coordination », « Priorisation ») et redondantes avec
la section Compétences. C'est la troisième fois que le CV énumère les mêmes qualités.
Réduire à deux par projet, et choisir celles qui sont spécifiques au projet.

**Trop vague.** Les statuts : « Projet en développement continu », « Projet en
développement ». Pour deux produits en ligne avec une URL publique, la question qui compte
est : qui les utilise ? Un projet avec trois utilisateurs réels vaut plus qu'un projet
« en développement continu ».

**À compléter.**
- Utilisateurs ou clients réels par projet, date de mise en service.
- Rôle exact : seul ou en équipe, et qui écrit le code.
- Statut de Renta Menu — utilisé, abandonné, prototype ?
- Volume traité pour L'Ortabels (surface, nombre de séries suivies).

---

### C.9 — Formation et compétences continues (`profile.js` → `formationContent`)

**Constat.** Un BTS de 2012 et six « compétences développées en continu ». La rubrique est
juste dans son intention — montrer un apprentissage autodidacte soutenu — mais elle est mal
nommée : placées sous *Formation*, ces compétences font chercher au lecteur un organisme,
une certification, une date. Il n'en trouve aucune.

**Deux items posent problème.**

*Orchestration de workflows IA multi-agents* — 60 mots, de loin l'item le plus long, et le
seul entièrement abstrait : « définition des rôles, des entrées, des critères de sortie,
des mécanismes de contrôle croisé et des étapes de validation ». Aucun livrable, aucun
outil nommé, aucun cas d'usage. Sur un sujet où les affirmations non étayées sont
devenues suspectes, c'est le pire format possible. Or vous avez un support concret : ce
CV lui-même est construit sur une chaîne d'agents (`.claude/agents/`, `AGENTS.md`). Le
dire vaut mieux que décrire une méthodologie en abstrait.

*Mise en production de produits numériques* — décrit une fonction (environnements,
contrôles qualité, déploiements automatisés, vérifications post-déploiement) sans dire sur
quel produit. Rattacher à KuT, PANUM ou L'Ortabels.

**À conserver.** Le principe de la rubrique. La citation de clôture est bonne et
sobre — c'est le bon registre.

**À corriger.**
- Renommer la rubrique : « Compétences acquises en autodidacte » plutôt que de la ranger
  sous Formation. L'autodidaxie assumée est un argument ; l'autodidaxie déguisée en
  formation est une faiblesse.
- Ancrer chaque item sur un produit ou un usage.
- Ramener les deux items longs au format des quatre autres.

**Ce qui manque complètement.**
- Aucune formation continue, aucune certification, aucun MOOC depuis 2012. S'il y en a,
  même courts, ils comblent un vide de quatorze ans.
- Aucune langue.
- Aucune mention de permis ou de mobilité.

---

### C.10 — Contact et informations pratiques (`contact.js`)

**Constat.** Trois éléments : ville, date de naissance, formulaire de contact.

**Problèmes.**
- **Aucun e-mail direct, aucun téléphone, aucun LinkedIn.** Un recruteur qui décide de
  vous contacter doit remplir un formulaire. C'est une friction posée exactement au point
  de conversion. Le code (`js/ui/contactForm.js`) mentionne pourtant LinkedIn dans un
  message d'erreur : le profil existe donc, mais n'est pas exposé.
- **Date de naissance affichée**, avec une icône gâteau. En France, l'âge est une donnée à
  risque de discrimination, et l'icône ajoute un registre informel qui détonne. À
  supprimer.

**À conserver.** La ville — utile, elle situe la mobilité.

**À compléter.** E-mail, LinkedIn, téléphone si vous le souhaitez, mobilité, disponibilité.

---

### C.11 — Architecture et navigation (`sections.js`)

**Constat.** Sept sections, dans cet ordre : Profil, Compétences, Cas concret, Outils,
Expériences, Projets transverses, Formation.

**Deux problèmes.**

*L'ordre.* Les compétences déclaratives arrivent avant le parcours. C'est l'ordre d'un CV
de reconversion qui cherche à faire oublier son historique — or votre historique est
justement ce qui rend les compétences crédibles. Ordre recommandé :

1. Profil
2. **Expériences** (avec le mandat 2024-2025 développé)
3. Outils
4. Projets transverses
5. Compétences (resserrées)
6. Formation

Le Cas concret disparaît comme section autonome et devient le développement de
l'expérience Générale d'Optique.

*Les sous-titres comptent au lieu de qualifier.* « 7 domaines clés », « 5 dispositifs
détaillés », « 3 projets détaillés », « 14 ans · 3 expériences ». Le lecteur est invité à
compter, donc à juger le volume. Préférer des sous-titres qui disent ce que la section
démontre.

---

### C.12 — Version `<noscript>` (`index.html`)

**Constat.** Version dégradée désynchronisée des données :

- **Hub Outils Opticien absent** — la section Outils n'en présente que quatre sur cinq ;
- **Brief'Maker obsolète** — « support de brief connecté permettant de répartir
  dynamiquement les missions prioritaires » ne correspond plus à la description actuelle ;
- statuts des outils absents ;
- mention « Uberall/Yext » supprimée dans le `<noscript>` mais présente dans les données.

**Conséquence.** C'est la version servie aux lecteurs sans JavaScript, et souvent celle que
lisent les aperçus de lien et les indexeurs. Un recruteur peut donc tomber sur une version
incomplète.

**À corriger.** Resynchroniser après validation de la réécriture. À terme, générer le
`<noscript>` depuis les données plutôt que le maintenir à la main — c'est la seule façon
d'éviter que la divergence revienne.

---

## D. Propositions de reformulation

### D.1 — Accroche

**Actuel**
> « Professionnel de terrain avec 14 ans d'expérience en environnement commercial, j'ai
> progressivement orienté mon parcours vers ce qui me mobilise le plus : concevoir des
> outils concrets pour fiabiliser les décisions, structurer l'activité et fluidifier le
> travail au quotidien. »

**Problème** — Le métier n'est pas nommé. « Ce qui me mobilise le plus » est une
formulation d'affect. Aucune preuve, aucune cible.

**Proposé**
> « Opticien depuis 2012, dont un an comme responsable de magasin. Au fil des postes, j'ai
> pris en charge ce qui relevait de l'organisation : procédures de back-office, suivi des
> dossiers, plannings, tableaux de pilotage. J'ai conçu pour cela cinq outils internes sous
> Google Sheets, Apps Script et en web ; deux sont encore utilisés tous les jours, dont un
> dans un magasin où je ne les avais pas déployés. Je cherche un poste où cette partie du
> travail devient le cœur du rôle. »

---

### D.2 — Citation de profil

**Actuel**
> « Le pivot de la performance collective : rendre une activité plus lisible, plus fluide
> et plus pilotable, sans la rigidifier. »

**Problème** — « Le pivot de la performance collective » est une auto-désignation, en
ouverture de la première section de fond.

**Proposé**
> « Rendre une activité plus lisible et plus pilotable, sans l'alourdir. »

---

### D.3 — Expérience Générale d'Optique

**Actuel**
> - Pilotage de l'activité commerciale, opérationnelle et organisationnelle du point de vente.
> - Management de proximité, accompagnement de l'équipe et suivi du fonctionnement quotidien.
> - Coordination entre besoins terrain, exigences de performance et attentes de la direction.
> - Contribution à l'amélioration de l'organisation, de la lisibilité de l'activité et du pilotage.

**Problème** — Fiche de poste intégrale. Aucune action, aucun contexte, aucun résultat.
« Contribution à » vous retire de votre propre travail. Quatre puces, quatre triades.

**Proposé**
> Reprise d'un magasin en perte de vitesse. Responsable de l'activité commerciale, de
> l'organisation et de l'équipe [À compléter : effectif].
> - Relance du trafic par actions locales ciblées, travail sur le référencement local et
>   la collecte d'avis Google.
> - Conception d'Opti'Profit, outil d'aide à la vente qui identifie le meilleur compromis
>   entre besoin technique, budget client, réseaux de soins et marge.
> - Mise en place d'un suivi automatisé des devis et d'un brief quotidien pour fiabiliser
>   les relances et coordonner l'équipe.
> - Refonte des plannings pour aligner les effectifs présents sur la charge réelle.
>
> Sur les deux mois qui ont suivi : +83 % de chiffre d'affaires et +5,6 points de marge
> par rapport à [À compléter : base de comparaison].

---

### D.4 — Expérience 2012-2023

**Actuel**
> - Relation client, vente conseil et gestion des situations complexes.
> - Bonne connaissance des contraintes terrain en magasin : charge, temps, priorités et qualité de service.
> - Évolution progressive vers des sujets d'organisation et d'amélioration du fonctionnement quotidien.

**Problème** — Onze ans en trois lignes, sans dates par enseigne, sans un seul fait. « Bonne
connaissance » est une auto-évaluation. La troisième puce annonce une évolution sans en
donner un seul exemple.

**Proposé**
> **Opticien collaborateur — GrandOptical, Krys, Lissac · 2012 → 2023**
> [À compléter : dates par enseigne]
> - Vente conseil et prise en charge des dossiers complexes : contraintes techniques,
>   réseaux de soins, tiers payant.
> - [À compléter : une responsabilité concrète par enseigne — tutorat, référent technique,
>   ouverture de magasin, remplacement du responsable]
> - Premiers outils internes construits pendant cette période pour fiabiliser les calculs
>   d'épaisseur et le suivi des dossiers. [À compléter : lesquels, à quelle date]

---

### D.5 — Résultat de compétence non observable

**Actuel** (`organisation-methodes.resultat`)
> « Un fonctionnement plus prévisible, plus fluide et plus sûr, sans rigidifier inutilement
> l'organisation du magasin. »

**Problème** — Trois adjectifs comparatifs et une antithèse en *sans*. Rien d'observable
sous un label qui s'appelle « Résultat observable ».

**Proposé**
> « Le lissage des rendez-vous de livraison a réduit la surcharge du samedi en répartissant
> la charge sur la semaine. Les procédures de contrôle et de dispatch sont restées en usage
> après mon départ du poste. [À compléter : temps gagné ou nombre de dossiers concernés] »

---

### D.6 — Résultat d'Opti'Profit

**Actuel**
> « Dans un magasin en perte de vitesse, cet outil a contribué à un gain de +5,64 points de
> marge et grâce à des actions conjointes une hausse de +83 % du chiffre d'affaires en deux
> mois. »

**Problème** — Syntaxe cassée. Attribution confuse entre l'outil et les actions
commerciales. Chiffre déjà présent trois fois ailleurs.

**Proposé**
> « Utilisé en situation de vente, l'outil supprime le temps passé à comparer les
> catalogues et rend visible l'écart de marge entre deux solutions équivalentes pour le
> client. Il a été l'un des leviers du redressement obtenu chez Générale d'Optique. »

---

### D.7 — Résultat de Brief'Maker

**Actuel**
> « Amélioration de la coordination d'équipe, réduction drastique des oublis administratifs
> et meilleure lisibilité de l'activité pour la direction. »

**Problème** — « Drastique » est un superlatif non mesuré, placé juste avant le fait le
plus fort de la fiche, qu'il affaiblit.

**Proposé**
> « L'outil est en service quotidien depuis sa conception. Il a suivi un changement
> d'employeur : conçu chez Générale d'Optique, il est aujourd'hui utilisé dans mon poste
> actuel, où je ne l'avais pas prévu au départ. [À compléter : nombre d'utilisateurs
> quotidiens] »

---

### D.8 — Compétences continues : workflows IA

**Actuel**
> « Conception de workflows reposant sur plusieurs agents spécialisés : exploration,
> analyse contradictoire, vérification factuelle, contrôle des sources, consolidation et
> validation humaine des livrables. Définition des rôles, des entrées, des critères de
> sortie, des mécanismes de contrôle croisé et des étapes de validation avant utilisation
> opérationnelle. »

**Problème** — 60 mots, aucun livrable, aucun outil nommé. Sur ce sujet précisément, une
description abstraite se lit comme du vocabulaire emprunté.

**Proposé**
> « Découpage de tâches de développement entre plusieurs agents spécialisés — analyse,
> cadrage, exécution, contrôle — avec critères de validation à chaque étape. Méthode
> appliquée au développement de [À compléter : KuT / PANUM / ce CV] : [À compléter : un
> effet concret — délai de livraison, réduction des reprises]. »

---

### D.9 — Renta Menu 3.0

**Actuel**
> « Développement de modèles mathématiques avancés (régressions linéaires inverses et
> logarithmiques) pour automatiser la détermination des prix de vente optimaux. »
> « […] projections de superprofit. »

**Problème** — « Avancés » est un superlatif que le contenu ne soutient pas : une
régression linéaire est un outil standard. « Superprofit » est un terme impropre en
gestion.

**Proposé**
> « Modélisation du prix de vente par régression (linéaire inverse et logarithmique) à
> partir du coût matière et de l'élasticité observée, pour automatiser la fixation des
> prix carte. »
> « […] projections de résultat. »

---

### D.10 — Note de la section Réalisations

**Actuel**
> « Ce cas n'est qu'un exemple : les dispositifs qu'il mobilise ne sont qu'une partie de
> ceux détaillés dans Outils, les autres relevant de contextes différents. Les autres
> réalisations que j'ai conçues et menées sont dans Projets transverses. »

**Problème** — Le CV explique sa propre structure. Le besoin de cette note signale un
recouvrement entre sections.

**Proposé** — Supprimer. Fusionner le Cas concret avec l'expérience correspondante ; la
question ne se pose plus.

---

## E. Version réécrite

Texte homogène et directement réutilisable. Les mentions `[À compléter : …]` marquent les
endroits où une information manquante empêche une formulation optimale — elles ne doivent
pas rester dans la version publiée.

Aucun chiffre ni aucune compétence n'a été ajouté : tout provient du contenu existant.

### E.1 — En-tête

> **Jérémy Ribes**
> Structuration de l'activité & outils métiers · parcours retail optique
>
> Organisation et process · Outils d'aide à la décision · Pilotage par la donnée · Coordination direction / terrain
>
> Montferrier-sur-Lez (34) · [À compléter : e-mail] · [À compléter : LinkedIn] · [À compléter : mobilité]

*Variante si vous préférez afficher la cible :*
> **Jérémy Ribes** — Opticien · 14 ans en réseau
> Recherche un poste en organisation, process et outils métiers

### E.2 — Accroche

> Opticien depuis 2012, dont un an comme responsable de magasin. Au fil des postes, j'ai
> pris en charge ce qui relevait de l'organisation : procédures de back-office, suivi des
> dossiers, plannings, tableaux de pilotage. J'ai conçu pour cela cinq outils internes sous
> Google Sheets, Apps Script et en web ; deux sont encore utilisés tous les jours, dont un
> dans un magasin où je ne les avais pas déployés. Je cherche un poste où cette partie du
> travail devient le cœur du rôle.

### E.3 — Profil

> « Rendre une activité plus lisible et plus pilotable, sans l'alourdir. »
>
> **Positionnement.** Je fais l'interface entre une direction qui porte des objectifs et
> une équipe qui vit les contraintes d'exécution. Concrètement : traduire un objectif en
> méthode de travail que l'équipe accepte, et faire remonter ce que le terrain sait et que
> le pilotage ignore.
>
> **Méthode.** Je pars d'un irritant précis — une ressaisie, un oubli, un calcul refait à
> la main — et je livre une réponse dont l'utilité se vérifie au premier usage. C'est ce
> qui fait qu'elle est adoptée : personne ne défend une procédure, tout le monde garde un
> outil qui fait gagner du temps.
>
> **Ce que je cherche.** Un rôle transverse sur la structuration d'une activité existante :
> formaliser les process, outiller le suivi, rendre l'activité pilotable. Secteur :
> [À compléter]. Taille d'organisation : [À compléter].

### E.4 — Expériences

> **Opticien collaborateur — Krys · [mois] 2025 → aujourd'hui**
> Poste de vente sur lequel j'ai pris en charge une part croissante de l'organisation et
> de l'outillage du magasin. [À compléter : une ligne de contexte sur le changement de
> poste — recentrage volontaire sur les sujets d'outils, mobilité géographique, autre]
>
> - Rédaction et mise en place des procédures de back-office : contrôle des commandes,
>   dispatch, traitement des retards. Lissage des rendez-vous de livraison pour répartir la
>   charge sur la semaine.
> - Conception et envoi d'une campagne e-mail auprès de plus de mille clients : segmentation
>   de la base, vérification des consentements, personnalisation des messages, suivi des
>   conversions. [À compléter : taux d'ouverture, rendez-vous générés]
> - Mise en place de contrôles automatisés rapprochant les données du logiciel métier et
>   les suivis internes, pour repérer les dossiers non tracés et chiffrer les écarts.
>   [À compléter : volume de dossiers contrôlés]
> - Développement d'outils d'aide à la vente, web et desktop, dont un hub regroupant les
>   tâches courantes du magasin.
> - Le suivi des devis et le brief quotidien conçus dans mon poste précédent sont utilisés
>   ici par l'équipe.
>
> ---
>
> **Responsable de magasin — Générale d'Optique · [mois] 2024 → [mois] 2025**
> Reprise d'un magasin en perte de vitesse. Responsable de l'activité commerciale, de
> l'organisation et de l'équipe. [À compléter : effectif encadré, taille du magasin]
>
> - Relance du trafic par actions locales ciblées, travail sur le référencement local et la
>   collecte d'avis Google.
> - Conception d'Opti'Profit, outil d'aide à la vente qui identifie le meilleur compromis
>   entre besoin technique, budget client, réseaux de soins et marge.
> - Mise en place d'un suivi automatisé des devis et d'un brief quotidien, pour fiabiliser
>   les relances et coordonner le back-office.
> - Refonte des plannings pour aligner les effectifs présents sur la charge réelle.
> - Formalisation des procédures de contrôle, de dispatch et de traitement des retards.
>
> **Résultat.** Sur les deux mois qui ont suivi ces actions : +83 % de chiffre d'affaires et
> +5,6 points de marge par rapport à [À compléter : base de comparaison]. Trois des outils
> conçus pour ce poste sont toujours en service, dont deux hors de leur contexte d'origine.
>
> ---
>
> **Opticien collaborateur — GrandOptical, Krys, Lissac · 2012 → 2023**
> [À compléter : dates par enseigne]
>
> - Vente conseil et prise en charge des dossiers complexes : contraintes techniques,
>   réseaux de soins, tiers payant.
> - [À compléter : une responsabilité concrète par enseigne — tutorat, référent technique,
>   ouverture, remplacement du responsable]
> - Premiers outils internes construits pendant cette période, pour fiabiliser les calculs
>   récurrents et le suivi des dossiers. [À compléter : lesquels, à quelle date]

### E.5 — Outils conçus

> **Opti'Profit** — aide à la décision commerciale · Google Apps Script · déployé en magasin
> En vente, le bon produit dépend du besoin technique, du budget, des contraintes du réseau
> de soins et de la marge. L'arbitrage se faisait de tête, catalogue par catalogue.
> J'ai développé un outil qui intègre les catalogues fournisseurs et les grilles mutuelles,
> filtre les produits compatibles en temps réel et met en évidence l'écart de marge entre
> deux solutions équivalentes pour le client.
> Il supprime le temps de comparaison manuelle et a été l'un des leviers du redressement
> obtenu chez Générale d'Optique.
>
> ---
>
> **Brief'Maker** — organisation quotidienne · Google Sheets et Apps Script · en usage quotidien
> L'information se perdait entre les shifts et les tâches de back-office n'étaient
> priorisées par personne.
> J'ai conçu une feuille de brief qui agrège automatiquement le planning de l'équipe, les
> rendez-vous de l'agenda Google et le suivi des dossiers, devis et tiers payant, puis
> répartit les tâches du jour entre les collaborateurs.
> L'outil est en service tous les jours depuis sa conception. Il a suivi un changement
> d'employeur : conçu chez Générale d'Optique, il est utilisé aujourd'hui dans mon poste
> actuel, où rien ne l'avait prévu. [À compléter : nombre d'utilisateurs quotidiens]
>
> ---
>
> **Hub Outils Opticien** — outillage du quotidien · application web · en usage quotidien
> Les tâches courtes et répétées du magasin s'appuyaient sur des documents dispersés, des
> calculs refaits à la main et les mêmes informations ressaisies chaque fois. Isolées, elles
> paraissent mineures ; répétées, elles consomment du temps de vente.
> J'ai développé un hub web qui les réunit : demandes et comptes rendus au médecin
> normalisés avec export PDF et envoi par mail, clôture de caisse avec reprise du comptage
> de la veille et contrôle de l'écart avec le logiciel métier, calcul d'épaisseur et de
> décentrement des verres avec visualisation. Les coordonnées du magasin sont saisies une
> fois et alimentent tous les outils ; les données restent sur le poste.
> Utilisé tous les jours : documents identiques quel que soit le collaborateur, calculs
> fiabilisés, ressaisies supprimées.
> → j-rbs91.github.io/Hub_Tools_N_Templates
>
> ---
>
> **PANUM** — suivi commercial et pilotage · abouti, en attente de déploiement pilote
> Le suivi des devis et du tiers payant repose souvent sur des pratiques hétérogènes :
> dossiers stagnants, relances oubliées, et un management qui ne sait pas pourquoi les
> ventes se perdent.
> J'ai étendu en solution complète le suivi outillé conçu en magasin sous Google Sheets, qui
> tourne toujours : indicateurs en temps réel, tableaux de bord par niveau de responsabilité,
> priorisation des relances et identification des pertes évitables.
> Le produit est fonctionnellement abouti et éprouvé en conditions de test. Le déploiement
> en points de vente pilotes est la prochaine étape ; il attend la mise en place de la
> structure juridique permettant de contractualiser.
> → panum.fr
>
> ---
>
> **Gestionnaire de Planning** — planification des effectifs · déployé en point de vente
> Les tensions d'organisation venaient d'un écart entre les effectifs présents, la charge
> réelle et les contraintes d'ouverture.
> J'ai développé un outil de construction de planning qui ajuste les effectifs à l'activité
> attendue à partir de [À compléter : historique de fréquentation, amplitude horaire, autre].
> Il a réglé des conflits d'organisation récurrents et ajusté le coût du personnel au flux
> réel. Il ne construit plus les plannings aujourd'hui, mais une version simplifiée reste
> intégrée à Brief'Maker pour afficher le planning du jour.

### E.6 — Projets transverses

> **KuT — logiciel de gestion pour salons et activités de bien-être**
> Conception produit et pilotage · en ligne, développement continu
> Traduction des besoins d'un salon à prestations récurrentes en parcours, règles métier et
> fonctionnalités : clients, réservations, planning, fidélité, campagnes commerciales,
> indicateurs. Caisse et exports comptables en cours.
> J'ai formalisé les règles métier, les invariants et les scénarios limites nécessaires au
> contrôle des fonctionnalités sensibles, et je pilote le cadrage, la priorisation et la
> validation des usages. [À compléter : seul ou en équipe, qui développe]
> [À compléter : utilisateurs ou clients réels, date de mise en service]
> → kut.panum.fr
>
> ---
>
> **L'Ortabels — projet maraîcher et outil d'aide à la décision**
> Modélisation agronomique · en ligne, développement continu
> Planifier des cultures suppose d'anticiper des stades de développement qui dépendent des
> températures, pas du calendrier.
> J'ai conçu un outil qui exploite les températures locales, les degrés-jours et les modèles
> de croissance thermique pour estimer les fenêtres de semis, les stades de développement et
> les périodes de récolte, et qui les restitue en repères directement utilisables pour la
> planification.
> [À compléter : surface ou nombre de séries suivies, utilisateurs]
> → app.ortabels.fr
>
> ---
>
> **Renta Menu — pilotage de la rentabilité en restauration**
> Outil décisionnel · Google Apps Script · [À compléter : statut réel]
> Modélisation du coût matière par composante de menu et calcul automatisé des marges
> brutes. Détermination des prix de vente par régression, à partir du coût et de
> l'élasticité observée. Calcul du besoin en effectifs et du coût employeur réel selon le
> volume de couverts prévisionnel. Seuil de rentabilité, marge nette par couvert et
> projections de résultat calculés en continu.
> [À compléter : utilisé par qui, ou prototype ?]

### E.7 — Compétences

> **Pilotage commercial et rentabilité**
> Développer le flux clients en tenant la marge sur chaque vente. Chez Générale d'Optique :
> actions locales, référencement local, avis Google et outil d'arbitrage produit en vente.
> +83 % de CA et +5,6 points de marge sur deux mois.
>
> **Organisation et formalisation des process**
> Transformer des pratiques implicites en procédures écrites et utilisées. Contrôle et
> dispatch back-office, priorisation des dossiers complets et incomplets, organisation J+1
> des montages, cadrage des rendez-vous de livraison. Je priorise selon une logique inspirée
> du modèle de Kano : sécuriser d'abord ce qui crée de l'insatisfaction quand c'est absent.
> Les procédures écrites chez Générale d'Optique sont restées en usage après mon départ.
>
> **Conception d'outils métiers**
> Concevoir et développer les outils moi-même, sous Google Sheets et Apps Script comme en
> web. Cinq outils déployés en situation réelle, dont deux encore utilisés quotidiennement.
> Je conçois à partir de l'usage observé, pas de la spécification : c'est ce qui fait la
> différence entre un outil adopté et un outil abandonné.
>
> **Pilotage par la donnée**
> Concevoir des indicateurs qui expliquent, pas seulement qui décrivent : délais de
> traitement, discipline de relance, taux de perte, pertes évitables, santé du portefeuille.
> Rapprochements automatisés entre logiciel métier et suivis internes pour identifier les
> dossiers non tracés et chiffrer les écarts. C'est la logique qui structure PANUM.
>
> **Coordination direction / terrain et conduite du changement**
> Traduire des objectifs en méthodes de travail acceptables par l'équipe, et faire remonter
> ce que le terrain sait. J'obtiens l'adhésion par le bénéfice immédiat — moins d'oublis,
> moins de ressaisie, charge mieux répartie — parce que dans ces environnements tout ce qui
> ajoute de la complexité est rejeté d'office. Les procédures et supports que j'ai mis en
> place ont été adoptés sans arbitrage hiérarchique.

### E.8 — Formation et compétences acquises

> **BTS Opticien Lunetier** — 2012
>
> **Compétences acquises en autodidacte**
> - **Google Apps Script** — développement des cinq outils internes présentés ci-dessus.
> - **Développement web et desktop** — hub d'outils magasin, interfaces d'aide à la vente.
> - **Analyse de données et modélisation** — indicateurs causaux (PANUM), modèles de
>   croissance thermique (L'Ortabels), régressions de prix (Renta Menu).
> - **Formalisation de process** — procédures opérationnelles, priorisation par le modèle
>   de Kano.
> - **Orchestration d'agents IA** — découpage de tâches de développement entre agents
>   spécialisés, avec critères de validation à chaque étape. Appliqué au développement de
>   [À compléter : KuT / PANUM / ce CV].
> - **Mise en production** — environnements, contrôles qualité et déploiements automatisés
>   sur [À compléter : KuT / PANUM / L'Ortabels].
>
> « Mon apprentissage est continu et orienté vers des problèmes concrets du terrain. »

---

## F. Informations manquantes

Par ordre d'impact sur la crédibilité du dossier.

**Bloquantes — sans elles, un doute reste ouvert**

1. **Raison du changement de poste en 2025** (Responsable → Opticien collaborateur). Une
   ligne factuelle suffit. C'est le point le plus coûteux du CV en l'état.
2. **Base de comparaison des +83 %** : par rapport à N-1, aux deux mois précédents, à un
   objectif ? Sans base, le chiffre est attaquable.
3. **Écrivez-vous le code vous-même ?** À trancher explicitement, y compris pour distinguer
   les cas (outils Apps Script développés seul vs KuT où vous coordonnez).

**Fortes — elles transforment des affirmations en preuves**

4. Dates par enseigne sur 2012-2023, et mois sur tous les postes.
5. Effectif encadré chez Générale d'Optique, taille et CA du magasin.
6. Nombre d'utilisateurs quotidiens de Brief'Maker et du Hub.
7. Utilisateurs ou clients réels de KuT et L'Ortabels, et date de mise en service.
8. Résultats de la campagne e-mail Krys : taux d'ouverture, rendez-vous générés, CA attribué.
9. Volume de dossiers traités par les contrôles automatisés, et écarts identifiés.
10. Une responsabilité concrète par enseigne sur 2012-2023, au-delà de la vente.

**Utiles — elles complètent le dossier**

11. E-mail, LinkedIn, mobilité, disponibilité.
12. Intitulés de postes réellement visés, et secteurs.
13. Temps de conception de chaque outil (démontre une capacité de livraison rapide).
14. Statut réel de Renta Menu.
15. Formations continues ou certifications depuis 2012, même courtes.
16. Langues.
17. Points de vente identifiés pour le pilote PANUM.
18. Pour le Gestionnaire de Planning : sur quelles données il s'appuyait.

---

## Ordre d'exécution recommandé

1. Rassembler les trois informations bloquantes (F1 à F3).
2. Réordonner les sections : Expériences en position 2, fusion du Cas concret avec
   l'expérience Générale d'Optique, suppression de la `note`.
3. Réécrire les trois blocs d'expérience (E.4) et l'accroche (E.2).
4. Consolider les compétences de 7 à 5 (E.7), en supprimant les résultats non observables.
5. Passe stylistique : casser les triades, limiter les antithèses en *sans*, retirer les
   superlatifs non mesurés (« drastique », « fortement », « avancés »).
6. Resynchroniser le `<noscript>` d'`index.html` avec les données.
