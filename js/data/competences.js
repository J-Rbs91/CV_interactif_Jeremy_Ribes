/* Champs `a4*` — le recto A4 est un CV en competences, pas une chronologie :
   c'est ce bloc qui y occupe le plus de place, et l'ordre d'ecran ne lui
   convient pas. `a4Rank` le rejoue en partant de l'organisation, qui est le
   territoire revendique, et non de la performance commerciale, qui en est un
   resultat.

   `a4Statement` enonce la competence pour un lecteur qui n'a pas le site sous
   les yeux : `summary` s'appuie sur la fiche depliee juste dessous, le recto
   n'a rien dessous. Il tient sur **une ligne**, intitule compris — a deux, les
   cinq competences prenaient cinq lignes de plus et la page se refermait sur
   elle-meme. Toute reformulation se remesure. `a4Proofs` porte les faits qui l'etablissent, chacun
   verifiable, aucun explicatif — le detail du raisonnement est ce que la
   presentation complete a de plus et que le recto n'essaie pas d'avoir. */
export const competences = [
  {
    id: "pilotage-commercial",
    title: "Pilotage commercial & rentabilité",
    summary:
      "Développer le flux clients en tenant la marge sur chaque vente.",
    nature: "produit",
    detailLabel: "Relancer sans remise",
    tags: ["Flux clients", "Marge", "Référencement local"],
    enjeu:
      "Relancer un magasin en difficulté sans acheter le chiffre par la remise.",
    miseEnPlace:
      "J’ai travaillé les deux côtés en même temps. Le flux, par des actions locales ciblées, le référencement local et la collecte d’avis Google. La qualité économique de chaque vente, par un outil d’arbitrage produit utilisé directement en situation de vente.",
    exemple:
      "L’outil fait ressortir le mix produit le plus pertinent selon le budget du client, les contraintes techniques, les offres en cours et les réseaux de soins.",
    resultat:
      "Chez Générale d’Optique, ces actions ont contribué à +83 % de chiffre d’affaires et +5,6 points de marge sur les deux mois qui ont suivi, mesurés par rapport à la moyenne des seize mois précédents.",
    a4Rank: 3,
    a4Statement:
      "Développer l’activité tout en maintenant la qualité économique des ventes.",
    a4Proofs: [
      "Actions commerciales locales",
      "Trafic et marge travaillés ensemble",
      "Arbitrage produit en situation de vente",
    ],
  },
  {
    id: "organisation-process",
    title: "Organisation & formalisation des process",
    summary:
      "Transformer des pratiques implicites en procédures écrites et réellement utilisées.",
    nature: "cadre",
    detailLabel: "Niveler la charge",
    tags: ["Procédures", "Back-office", "Nivellement de charge", "Priorisation"],
    enjeu:
      "Réduire les flottements d’organisation et les zones d’incertitude du fonctionnement quotidien.",
    miseEnPlace:
      "Procédure de contrôle et de dispatch back-office, priorisation des dossiers complets et incomplets, organisation J+1 des montages et vérifications, cadrage des rendez-vous de livraison. Je priorise selon une logique inspirée du modèle de Kano : sécuriser d’abord ce qui crée de l’insatisfaction quand c’est absent, renforcer ensuite ce qui améliore l’expérience.",
    exemple:
      "Deux applications du même principe : <strong>niveler la charge plutôt que dimensionner sur le pic</strong>. Les rendez-vous de livraison répartis sur la semaine ont fait tomber la surcharge du samedi ; les plannings construits sur l’activité attendue, plutôt que sur un roulement fixe, ont aligné les effectifs sur le flux réel.",
    a4Rank: 1,
    a4Statement:
      "Transformer les pratiques implicites en méthodes claires et utilisables.",
    a4Proofs: [
      "Procédures de contrôle, dispatch, retards",
      "Vérifications en J+1",
      "Livraisons lissées sur la semaine",
      "Plannings construits sur l’activité attendue",
    ],
  },
  {
    id: "outils-metiers",
    title: "Conception d’outils métiers",
    summary:
      "Concevoir et développer moi-même les outils qui manquent à l’activité.",
    nature: "produit",
    detailLabel: "Partir de l’usage",
    tags: ["Irritant observé", "Adoption sans formation", "Google Apps Script", "Web", "Automatisation"],
    enjeu:
      "Donner au terrain des repères concrets quand la bonne décision dépend de plusieurs contraintes à la fois.",
    miseEnPlace:
      "Je conçois et je développe moi-même, sous Google Sheets et Apps Script comme en web : arbitrage produit en vente, calcul de dégression de verres techniques, suivi des devis et du tiers payant, brief quotidien, planification des effectifs, hub d’outils du magasin.",
    exemple:
      "Je pars de l’usage observé, pas de la spécification. Un outil qui demande une formation pour être utilisé ne sera pas utilisé.",
    a4Rank: 2,
    a4Statement:
      "Concevoir des outils qui sécurisent une décision et suppriment les ressaisies.",
    a4Proofs: [
      "Opti’Profit : arbitrage produit et marge",
      "Brief’Maker : planning, dossiers, tâches",
      "Suivi devis & tiers payant : statut et relance",
      "Hub magasin : calculs et documents standardisés",
    ],
  },
  {
    id: "pilotage-donnee",
    title: "Pilotage par la donnée",
    summary:
      "Concevoir des indicateurs qui expliquent la performance, pas seulement qui la décrivent.",
    nature: "produit",
    detailLabel: "Constater ou agir",
    tags: ["Indicateurs avancés", "Contrôles automatisés", "Reporting"],
    enjeu:
      "Passer d’un reporting qui constate à un reporting qui dit où agir.",
    miseEnPlace:
      "Je sépare les <strong>indicateurs retardés</strong>, qui constatent un résultat déjà joué, des <strong>indicateurs avancés</strong>, sur lesquels on peut encore agir : délais de traitement, discipline de relance, dossiers à risque, pertes évitables et santé du portefeuille. J’ai également mis en place des contrôles automatisés rapprochant le logiciel métier et les suivis internes.",
    exemple:
      "C’est la logique qui structure PANUM : comprendre pourquoi une vente se perd, et sur quel levier agir en priorité.",
    resultat:
      "Ces contrôles ont fait apparaître des dossiers absents des suivis internes, qui échappaient jusque-là au pilotage. Ils rapprochent deux sources indépendantes, dont l’une est l’outil que j’ai conçu : le contrôle peut établir qu’il n’a pas été renseigné.",
    a4Rank: 4,
    a4Statement:
      "Construire des indicateurs qui orientent l’action, pas seulement qui la constatent.",
    a4Proofs: [
      "Indicateurs avancés séparés des retardés",
      "Délais, relances, dossiers à risque",
      "Rapprochement automatisé de deux sources",
      "PANUM : causes de sous-performance",
    ],
  },
  {
    id: "coordination-changement",
    title: "Coordination & conduite du changement",
    summary:
      "Traduire des objectifs en méthodes de travail que l’équipe accepte.",
    nature: "cadre",
    detailLabel: "Faire adopter",
    tags: ["Direction", "Terrain", "Adhésion"],
    enjeu:
      "Faire adopter des méthodes dans des environnements où tout ce qui ajoute de la complexité est rejeté d’office.",
    miseEnPlace:
      "Je traduis les objectifs de la direction en méthodes concrètes, et je fais remonter ce que le terrain sait et que le pilotage ignore. L’adhésion vient du bénéfice immédiat : moins d’oublis, moins de ressaisie, charge mieux répartie.",
    exemple:
      "Suivis quotidiens et procédures de back-office adoptés par les équipes, dans deux enseignes différentes.",
    resultat:
      "Chez Générale d’Optique, la réorganisation et mon implication ont été saluées par la direction régionale.",
    a4Rank: 5,
    a4Statement:
      "Relier les objectifs de la direction aux contraintes concrètes des équipes.",
    a4Proofs: [
      "Tâches et responsabilités nominatives",
      "Brief quotidien commun à l’équipe",
      "Deux collaborateurs recrutés et formés",
      "Méthodes adoptées dans deux enseignes",
    ],
  },
];
