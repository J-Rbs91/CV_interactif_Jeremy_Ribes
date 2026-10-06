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
      "J’ai travaillé deux leviers en parallèle. Pour faire venir des clients : actions locales ciblées, référencement local et collecte d’avis Google. Pour préserver la marge de chaque vente : un outil d’aide au choix du produit, utilisé pendant la vente.",
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
    detailLabel: "Répartir la charge",
    tags: ["Procédures", "Back-office", "Nivellement de charge", "Priorisation"],
    enjeu:
      "Éviter les oublis et les « qui s’en occupe ? » du quotidien.",
    miseEnPlace:
      "Procédure de contrôle et de dispatch back-office, priorisation des dossiers complets et incomplets, organisation J+1 des montages et vérifications, cadrage des rendez-vous de livraison. Je priorise selon une logique inspirée du modèle de Kano : sécuriser d’abord ce qui crée de l’insatisfaction quand c’est absent, renforcer ensuite ce qui améliore l’expérience.",
    exemple:
      "Un même principe appliqué deux fois : <strong>répartir la charge au lieu de subir le pic</strong>. Les rendez-vous de livraison étalés sur la semaine ont supprimé la surcharge du samedi, et les plannings construits sur l’activité prévue ont ajusté les effectifs au flux de clients.",
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
    tags: ["Problème observé", "Adoption sans formation", "Google Apps Script", "Web", "Automatisation"],
    enjeu:
      "Donner au terrain des repères concrets quand la bonne décision dépend de plusieurs contraintes à la fois.",
    miseEnPlace:
      "Je conçois et je développe moi-même, sous Google Sheets et Apps Script comme en web : arbitrage produit en vente, calcul de dégression de verres techniques, suivi des devis et du tiers payant, brief quotidien, planification des effectifs, hub d’outils du magasin.",
    exemple:
      "Je conçois chaque outil à partir de ce que je vois l’équipe faire au quotidien, et je le veux utilisable sans formation : sinon, il n’est pas utilisé.",
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
      "Concevoir des indicateurs qui expliquent la performance et montrent où agir.",
    nature: "produit",
    detailLabel: "Constater ou agir",
    tags: ["Indicateurs avancés", "Contrôles automatisés", "Reporting"],
    enjeu:
      "Montrer où agir avant que le résultat soit joué.",
    miseEnPlace:
      "Je sépare les <strong>indicateurs retardés</strong>, qui constatent un résultat déjà joué, des <strong>indicateurs avancés</strong>, sur lesquels on peut encore agir : délais de traitement, discipline de relance, dossiers à risque, pertes évitables et santé du portefeuille. J’ai également mis en place des contrôles automatisés rapprochant le logiciel métier et les suivis internes.",
    exemple:
      "C’est la logique de PANUM : comprendre pourquoi une vente se perd, et quoi faire en priorité.",
    resultat:
      "Ces contrôles ont fait apparaître des dossiers absents des suivis internes, qui échappaient jusque-là au pilotage. Ils vérifient aussi mon propre outil : un dossier oublié dans le suivi des devis est repéré.",
    a4Rank: 4,
    a4Statement:
      "Construire des indicateurs qui montrent où agir.",
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
      "Je présente chaque nouvelle méthode par ce qu’elle retire du travail de l’équipe : moins d’oublis, moins de ressaisie, une charge mieux répartie. C’est ce gain immédiat qui la fait adopter.",
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
