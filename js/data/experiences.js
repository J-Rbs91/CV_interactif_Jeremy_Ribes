/* `a4Summary` — le recto A4 est un CV en competences : la chronologie n'y
   occupe qu'un cinquieme de la page, et sa fonction n'est plus de raconter
   les postes mais de donner la profondeur de terrain qui rend credibles les
   competences enoncees au-dessus. Chaque poste tient donc en une ligne de
   reperes, sans puces.

   Une ligne par poste, jamais deux : trois postes qui se replient, ce sont
   trois lignes prises a l'aeration de la page. Toute reformulation se
   remesure.

   Un resume ecrit plutot qu'une selection de puces : ces lignes ne disent pas
   la meme chose que `bullets` en plus court, elles disent autre chose — le
   territoire du poste, pas ses realisations, qui sont deja portees par les
   competences. Un rang de puce n'aurait pas pu produire ca. */
/* `id` et `detailLabel` — les experiences deviennent depliables (voir
   js/ui/accordion.js, famille « experience »).

   `id` : un identifiant stable, pas un rang. Il sert de cle au bouton
   (`data-experience`), a `aria-controls` et a l'etat d'ouverture. Derive de
   la position, il changerait en meme temps que l'ordre de la chronologie, et
   un panneau ouvert se refermerait sur une autre fiche.

   `detailLabel` : le libelle de la commande fermee. Meme regle que pour les
   outils — deux cartes voisines ne portent jamais le meme libelle, sinon la
   commande dit « il y a quelque chose dessous » sans dire laquelle vaut le
   clic. Chacun nomme ce que la fiche a de propre : le systeme pour Krys, la
   reprise pour Generale d'Optique, la duree pour les onze ans de terrain.

   Pas de champ `span` (annees de debut et de fin). Le lavis de la ligne
   module son intensite par `recency`, que les trois entrees portent deja ;
   une longueur proportionnelle a la duree aurait ajoute une donnee a tenir
   d'accord avec `date`, pour un ecart de trente pixels. */
export const experiences = [
  {
    id: "krys",
    detailLabel: "Le système de pilotage",
    role: "Opticien collaborateur",
    company: "Krys",
    date: "2025 → aujourd’hui",
    recency: "now",
    context:
      "En parallèle de la vente, j’organise le suivi des dossiers et développe des outils utilisés par l’équipe.",
    bullets: [
      "J’ai relié le suivi des devis et du tiers payant au brief quotidien. Chaque dossier à reprendre apparaît avec sa prochaine action et le collaborateur chargé de la traiter. La direction peut consulter les retards et la charge de l’équipe.",
      "Contrôles automatisés des saisies dans le suivi des devis, et comparaison avec le logiciel métier pour repérer les dossiers non suivis et mesurer l’écart.",
      "J’ai fait adopter chez Krys des méthodes déjà utilisées chez Générale d’Optique : contrôle des commandes, répartition des dossiers, traitement des retards, vérifications à J+1 et rendez-vous de livraison répartis sur la semaine.",
      "Conception du Hub Outils Opticien : documents pour les médecins, clôture de caisse et calculs optiques regroupés dans une interface commune pour limiter les ressaisies et uniformiser les documents.",
      "Conception et envoi d’une campagne e-mail sur une base de plus de mille clients segmentée, consentements vérifiés avant envoi, 96,5 % de délivrabilité. Attribution suivie jusqu’à la prise de rendez-vous en magasin.",
    ],
    a4Summary:
      "Organisation back-office · outils métiers · suivi de l’activité · procédures · optimisation des flux",
    /* La campagne portait deux chiffres en flamme (771 envois, 9 RDV) : un
       volume d'envoi et une conversion CRM ordinaire, pas ce dont ce poste
       tire sa fierté. Les faire vivre au même corps que le résultat de
       Générale d'Optique (+83 % CA) les mettait en concurrence avec un
       chiffre qui, lui, mérite la flamme — et brouillait ce qui distingue
       vraiment ce poste : des outils utilisés, imbriqués en système, et
       fiabilisés par des contrôles automatiques.

       Ce résultat n'est donc plus chiffré, mais il reste un fait : l'usage
       quotidien et la reprise sans demande. La chaîne du système est énoncée
       une seule fois, par la première puce ; le résultat ne la redit pas, il
       établit qu'elle sert. */
    result:
      "Le suivi des devis, Brief’Maker et le Hub Outils Opticien sont utilisés chaque jour par l’équipe. Les deux premiers avaient été conçus chez Générale d’Optique.",
  },
  {
    id: "generale-optique",
    detailLabel: "La reprise du magasin",
    role: "Responsable de magasin",
    company: "Générale d’Optique",
    date: "2024 → 2025",
    recency: "recent",
    context:
      "Responsable d’un magasin en difficulté, j’ai travaillé sur l’activité commerciale, l’organisation et le recrutement.",
    bullets: [
      "Rédaction de l’offre d’emploi, conduite des entretiens et formation des deux collaborateurs recrutés.",
      "Mise en place d’actions commerciales locales, amélioration du référencement du magasin et collecte d’avis Google.",
      "Formalisation des procédures de contrôle, de dispatch et de traitement des retards. Refonte des horaires et des règles de présence pour aligner les effectifs sur la charge réelle.",
      "Instauration d’un brief de début de journée et d’un suivi commun des devis : tâches de back-office attribuées nommément, dossiers à reprendre visibles de toute l’équipe.",
      "Conception d’Opti’Profit : pendant la vente, l’outil affiche les dix produits compatibles offrant la meilleure marge, selon les contraintes techniques, le réseau de soins, les préférences et le budget du client. Prix final et remise restent visibles pour ajuster l’offre.",
    ],
    a4Summary:
      "Redynamisation commerciale · organisation du point de vente · recrutement et formation · conception d’outils",
    /* Un écart chiffré sans sa base de comparaison se lit comme une
       affirmation invérifiable, et c'est la première question posée en
       entretien. La base est donc portée par la fiche elle-même, au même
       titre que le chiffre. Le libellé attribue une contribution, pas une
       causalité : relance commerciale, constitution de l'équipe et
       réorganisation ont joué ensemble — aucun de ces leviers n'explique
       l'écart à lui seul. */
    statsLabel: "Sur les deux mois qui ont suivi, ces actions ont contribué à",
    stats: [{ value: "+83 % CA" }, { value: "+5,6 pts", label: "de marge" }],
    statsBase:
      "Écarts mesurés par rapport à la moyenne des seize mois précédents.",
    result:
      "Réorganisation et implication saluées par la direction régionale. Le brief quotidien et le suivi des devis conçus pour ce poste sont aujourd’hui utilisés par mon équipe, dans une autre enseigne.",
  },
  {
    id: "terrain",
    detailLabel: "Onze ans, trois organisations",
    role: "Opticien collaborateur",
    company: "GrandOptical · Krys · Lissac",
    date: "2012 → 2023",
    recency: "past",
    context:
      "Onze ans en magasin, dans trois enseignes.",
    bullets: [
      "Vente conseil et traitement des dossiers complexes : contraintes techniques, réseaux de soins, tiers payant.",
      "Expérience de trois organisations de magasin, de leurs procédures commerciales et du traitement des dossiers.",
      "Premières améliorations des méthodes de travail, des calculs récurrents et du suivi des dossiers.",
    ],
    a4Summary:
      "Onze ans de terrain, trois enseignes, trois organisations : vente, dossiers complexes, puis organisation et fiabilisation des méthodes.",
  },
];
