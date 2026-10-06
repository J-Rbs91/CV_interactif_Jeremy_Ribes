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
      "Mise en place d’un système de pilotage reliant suivi des devis et du tiers payant, prochaine action, charge par collaborateur et brief quotidien. Les outils s’alimentent entre eux : les dossiers à reprendre deviennent des priorités visibles, puis des actions attribuées à chacun. La direction voit où l’activité bloque et qui doit agir.",
      "Workflows automatisés pour détecter les irrégularités de saisie dans l’outil de suivi, complétés par un contrôle croisé avec le logiciel métier pour identifier les dossiers non tracés et mesurer l’écart. Y compris quand l’écart vient de l’outil que j’ai conçu.",
      "Méthode de back-office éprouvée chez Générale d’Optique, adaptée à l’organisation Krys : procédures de contrôle des commandes, de dispatch et de traitement des retards, vérifications à J+1, rendez-vous de livraison lissés sur la semaine.",
      "Outillage des tâches courantes du magasin, regroupées en un point d’entrée unique pour supprimer les ressaisies et uniformiser les documents produits.",
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
      "Trois outils utilisés chaque jour par l’équipe : suivi des devis, brief quotidien et hub d’outils du magasin. Les deux premiers, conçus dans mon poste précédent, ont été repris ici parce qu’ils servaient, sans que personne ne les ait demandés.",
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
      "Conception d’Opti’Profit pour amener l’arbitrage produit (besoin technique, budget, réseaux de soins, marge) au moment de la vente, plutôt que de demander qu’il soit appris à l’avance.",
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
