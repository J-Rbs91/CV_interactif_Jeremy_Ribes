/* `a4Summary` — le recto A4 est un CV en competences : la chronologie n'y
   occupe qu'un cinquieme de la page, et sa fonction n'est plus de raconter
   les postes mais de donner la profondeur de terrain qui rend credibles les
   competences enoncees au-dessus. Chaque poste tient donc en une ligne de
   reperes, sans puces.

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
      "Rédaction et mise en place des procédures de back-office : contrôle des commandes, dispatch, traitement des retards. Lissage des rendez-vous de livraison pour répartir la charge sur la semaine.",
      "Conception et envoi d’une campagne e-mail sur une base de plus de mille clients segmentée, consentements vérifiés avant envoi, 96,5 % de délivrabilité. Attribution suivie jusqu’à la prise de rendez-vous en magasin.",
      "Contrôle croisé de deux sources indépendantes le logiciel métier et le suivi interne pour identifier les dossiers non tracés et mesurer l’écart. Y compris quand l’écart vient de l’outil que j’ai conçu.",
      "Outillage des tâches courantes du magasin, regroupées en un point d’entrée unique pour supprimer les ressaisies et uniformiser les documents produits.",
      "Le suivi des devis et le brief quotidien conçus dans mon poste précédent sont utilisés ici par l’équipe.",
    ],
    a4Summary:
      "Organisation back-office · outils métiers · suivi de l’activité · procédures · optimisation des flux",
    /* Les quatre chiffres de la campagne vivaient au milieu d'une puce, en
       deuxième ligne : au même corps, à la même couleur et dans le même flux
       que le reste. Or le chiffre est le plus fort aimant visuel d'une page
       de texte, et le seul élément d'un CV qu'un lecteur en diagonale
       s'arrête pour vérifier — celui-là ne se voyait pas.

       Ils prennent donc le traitement déjà en place sur la fiche suivante,
       qui est le seul endroit du CV qu'on ne peut pas rater. La puce garde
       ce que les chiffres ne disent pas : la segmentation, la vérification
       des consentements, la délivrabilité, l'attribution suivie.

       Deux valeurs et non quatre. La règle de rareté de la flamme plafonne
       à cinq taches par page, et la fiche suivante en porte déjà deux :
       quatre ici les auraient banalisées, et c'est leur rareté qui fait tout
       leur poids. On garde le volume traité et le résultat commercial, les
       deux bouts de la chaîne. */
    statsLabel: "Campagne e-mail conçue et envoyée depuis la base clients",
    stats: [
      { value: "771", label: "envois" },
      { value: "9 RDV", label: "pris en magasin" },
    ],
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
      "Redynamisation commerciale · organisation du point de vente · recrutement et formation · pilotage · conception d’outils",
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
      "Onze ans de terrain dans trois enseignes et trois organisations : vente, dossiers complexes, puis évolution vers l’organisation et la fiabilisation des méthodes.",
  },
];
