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
      "Développer l’activité commerciale en surveillant la marge.",
    nature: "produit",
    detailLabel: "Relance commerciale et marge",
    tags: ["Flux clients", "Marge", "Référencement local"],
    enjeu:
      "Relancer la fréquentation d’un magasin en difficulté et améliorer la rentabilité des ventes.",
    miseEnPlace:
      "J’ai mis en place des actions locales pour faire venir des clients, travaillé le référencement du magasin et développé Opti’Profit pour mieux choisir les produits pendant la vente.",
    exemple:
      "Opti’Profit classe les dix produits compatibles les plus rentables, en tenant compte du besoin technique, du réseau de soins, des préférences et du budget du client.",
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
      "Écrire des procédures de back-office et les faire appliquer par l’équipe.",
    nature: "cadre",
    detailLabel: "Répartir la charge",
    tags: ["Procédures", "Back-office", "Nivellement de charge", "Priorisation"],
    enjeu:
      "Clarifier le traitement des commandes, les retards et les responsabilités de chacun.",
    miseEnPlace:
      "J’ai formalisé les contrôles de commandes, le traitement des dossiers incomplets et des retards, les vérifications à J+1 et l’organisation des rendez-vous de livraison. Pour prioriser les améliorations, je me suis appuyé sur le modèle de Kano.",
    exemple:
      "<strong>J’ai réparti les rendez-vous de livraison sur la semaine</strong> pour réduire la surcharge du samedi. J’ai également revu les plannings selon l’activité prévue du magasin.",
    a4Rank: 1,
    a4Statement:
      "Formaliser les procédures de magasin et organiser leur application.",
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
      "Développer des outils à partir des besoins rencontrés en magasin.",
    nature: "produit",
    detailLabel: "Partir de l’usage",
    tags: ["Problème observé", "Adoption sans formation", "Google Apps Script", "Web", "Automatisation"],
    enjeu:
      "Réduire les ressaisies et faciliter les décisions qui nécessitent plusieurs informations.",
    miseEnPlace:
      "Je conçois et je développe moi-même, sous Google Sheets et Apps Script comme en web : arbitrage produit en vente, calcul de dégression de verres techniques, suivi des devis et du tiers payant, brief quotidien, planification des effectifs, Hub Outils Opticien.",
    exemple:
      "Je teste les outils sur les tâches habituelles de l’équipe et j’ajuste l’interface en fonction des retours.",
    a4Rank: 2,
    a4Statement:
      "Concevoir des outils qui sécurisent une décision et suppriment les ressaisies.",
    a4Proofs: [
      "Opti’Profit : arbitrage produit et marge",
      "Brief’Maker : planning, dossiers, tâches",
      "Suivi devis & tiers payant : statut et relance",
      "Hub Outils Opticien : caisse, documents, calculs",
    ],
  },
  {
    id: "pilotage-donnee",
    title: "Pilotage par la donnée",
    summary:
      "Suivre les dossiers, les délais et les causes de perte commerciale.",
    nature: "produit",
    detailLabel: "Constater ou agir",
    tags: ["Indicateurs avancés", "Contrôles automatisés", "Reporting"],
    enjeu:
      "Repérer les dossiers à risque avant qu’ils ne soient perdus.",
    miseEnPlace:
      "Je distingue les <strong>résultats constatés</strong> (ventes conclues ou perdues) des données qui permettent encore d’agir : délais, relances prévues, dossiers bloqués. J’ai aussi automatisé des contrôles entre le logiciel métier et les suivis internes.",
    exemple:
      "Dans PANUM, les motifs de blocage et l’historique des dossiers servent à organiser les relances.",
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
      "Faire le lien entre les objectifs de la direction et les contraintes de terrain.",
    nature: "cadre",
    detailLabel: "Faire adopter",
    tags: ["Direction", "Terrain", "Adhésion"],
    enjeu:
      "Faire évoluer les pratiques sans ajouter de saisies ni compliquer le travail quotidien.",
    miseEnPlace:
      "Je présente les changements à l’équipe, j’explique ce qu’ils modifient concrètement et j’adapte les procédures à ses retours.",
    exemple:
      "Suivis quotidiens et procédures de back-office adoptés par les équipes, dans deux enseignes différentes.",
    resultat:
      "Chez Générale d’Optique, la réorganisation et mon implication ont été saluées par la direction régionale.",
    a4Rank: 5,
    a4Statement:
      "Relier les objectifs de la direction aux contraintes du magasin.",
    a4Proofs: [
      "Tâches et responsabilités nominatives",
      "Brief quotidien commun à l’équipe",
      "Deux collaborateurs recrutés et formés",
      "Méthodes adoptées dans deux enseignes",
    ],
  },
];
