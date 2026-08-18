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
export const experiences = [
  {
    role: "Opticien collaborateur",
    company: "Krys",
    date: "2025 → aujourd’hui",
    recency: "now",
    context:
      "Poste de vente sur lequel j’ai pris en charge une part croissante de l’organisation et de l’outillage du magasin.",
    bullets: [
      "Système opérationnel reliant dossier, statut, prochaine action, priorité du jour, charge visible en magasin et attribution nommée au brief : pas un outil de suivi et un outil de brief juxtaposés, mais une chaîne où chaque étape alimente la suivante jusqu’à la responsabilité explicite.",
      "Workflows automatisés pour détecter les irrégularités de saisie dans l’outil de suivi, complétés par un contrôle croisé avec le logiciel métier pour identifier les dossiers non tracés et mesurer l’écart. Y compris quand l’écart vient de l’outil que j’ai conçu.",
      "Rédaction et mise en place des procédures de back-office : contrôle des commandes, dispatch, traitement des retards. Lissage des rendez-vous de livraison pour répartir la charge sur la semaine.",
      "Outillage des tâches courantes du magasin, regroupées en un point d’entrée unique pour supprimer les ressaisies et uniformiser les documents produits.",
      "Conception et envoi d’une campagne e-mail sur une base de plus de mille clients segmentée, consentements vérifiés avant envoi, 96,5 % de délivrabilité. Attribution suivie jusqu’à la prise de rendez-vous en magasin.",
      "Le suivi des devis et le brief quotidien conçus dans mon poste précédent sont repris ici par l’équipe et intégrés à ce système.",
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

       Ce résultat n'est donc plus chiffré : il est décrit, et c'est le seul
       endroit de la fiche où la chaîne complète du système est énoncée
       comme telle, plutôt que reconstituée à partir de puces séparées. */
    result:
      "Le suivi des dossiers, le brief quotidien et le hub d’outils ne sont pas trois outils juxtaposés : ils forment un système où le statut d’un dossier détermine sa prochaine action, alimente la priorité du jour, rend la charge visible en magasin et se retrouve nommément attribué au brief — jusqu’à la responsabilité explicite. Repris par l’équipe, ce système comble un manque d’outillage que je retrouve même dans une enseigne aussi structurée que Krys.",
  },
  {
    role: "Responsable de magasin",
    company: "Générale d’Optique",
    date: "2024 → 2025",
    recency: "recent",
    context:
      "Reprise d’un magasin en difficulté : relance commerciale, réorganisation du fonctionnement quotidien et constitution de l’équipe.",
    bullets: [
      "Rédaction de l’offre d’emploi, conduite des entretiens et formation des deux collaborateurs recrutés.",
      "Stratégie de présence locale proposée et mise en place : actions ciblées, référencement local et collecte d’avis Google.",
      "Formalisation des procédures de contrôle, de dispatch et de traitement des retards. Refonte des horaires et des règles de présence pour aligner les effectifs sur la charge réelle.",
      "Instauration d’un brief de début de journée et d’un suivi commun des devis : tâches de back-office attribuées nommément, dossiers à reprendre visibles de toute l’équipe.",
      "Conception d’Opti’Profit pour amener l’arbitrage produit besoin technique, budget, réseaux de soins, marge au moment de la vente, plutôt que de demander qu’il soit appris à l’avance.",
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
    role: "Opticien collaborateur",
    company: "GrandOptical · Krys · Lissac",
    date: "2012 → 2023",
    recency: "past",
    context:
      "Onze ans en magasin, sur trois enseignes et trois organisations différentes.",
    bullets: [
      "Vente conseil et traitement des dossiers complexes : contraintes techniques, réseaux de soins, tiers payant.",
      "Trois enseignes, trois politiques commerciales et trois manières d’organiser un magasin : c’est de là que vient ma lecture des contraintes réelles d’un point de vente.",
      "Bascule progressive vers les sujets d’organisation : méthodes de travail, fiabilisation des calculs récurrents et du suivi des dossiers.",
    ],
    a4Summary:
      "Onze ans de terrain, trois enseignes, trois organisations : vente, dossiers complexes, puis organisation et fiabilisation des méthodes.",
  },
];
