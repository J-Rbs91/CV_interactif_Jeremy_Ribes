export const competences = [
  {
    id: "pilotage-commercial",
    title: "Pilotage commercial",
    summary:
      "Développer le flux clients tout en sécurisant la rentabilité de chaque vente.",
    color: "var(--accent)",
    tags: ["Flux clients", "Rentabilité", "Avis Google"],
    enjeu:
      "Relancer une activité commerciale dans un magasin en perte de vitesse sans sacrifier la rentabilité.",
    miseEnPlace:
      "J’ai travaillé à la fois sur le flux client et sur la qualité économique de chaque vente. J’ai combiné actions locales ciblées, optimisation du référencement local et des avis Google, et création d’un outil d’aide à la décision commerciale utilisé directement en vente.",
    exemple:
      "L’outil faisait ressortir le mix produit le plus pertinent selon le budget client, les contraintes techniques, les offres en cours et les réseaux de soins.",
    resultat:
      "En 2 mois, +83 % de chiffre d’affaires et +5,64 points de marge par rapport à la période de référence.",
  },
  {
    id: "organisation-methodes",
    title: "Organisation & méthodes",
    summary:
      "Mettre en place des processus de travail clairs pour rendre l’activité plus lisible et réduire les pertes de temps.",
    color: "var(--accent2)",
    tags: ["Processus", "Back-office", "Temps"],
    enjeu:
      "Réduire les pertes de temps, les flottements d’organisation et les zones d’incertitude dans le fonctionnement quotidien.",
    miseEnPlace:
      "J’ai conçu des méthodes de travail pour rendre l’activité plus lisible : procédure de contrôle et de dispatch back-office, priorisation des dossiers complets / incomplets, organisation J+1 pour les montages et vérifications, et cadrage des rendez-vous de livraison.",
    exemple:
      "Le lissage des rendez-vous de livraison a permis de réduire la surcharge du samedi et de mieux répartir la charge de travail sur la semaine.",
    resultat:
      "Un fonctionnement plus prévisible, plus fluide et plus sûr, sans rigidifier inutilement l’organisation du magasin.",
  },
  {
    id: "outils-aide-decision",
    title: "Outils d'aide à la décision",
    summary:
      "Créer des outils simples pour fiabiliser les choix de l’équipe et accélérer la bonne décision.",
    color: "var(--accent3)",
    tags: ["GAS", "Automatisation", "Mix produit"],
    enjeu:
      "Donner au terrain des repères concrets quand la bonne décision dépend de multiples contraintes métier.",
    miseEnPlace:
      "Je conçois des outils simples quand l’activité manque de lisibilité. J’ai développé un outil d’aide à la vente pour orienter le choix produit selon les contraintes métier et la marge, un outil de calcul pour fiabiliser la dégression de verres techniques, et un système de suivi structuré des devis / tiers payant.",
    exemple:
      "Ces outils permettent de savoir plus vite quoi proposer, quoi calculer, quoi traiter, quoi relancer ou quoi surveiller, sans dépendre d’un retraitement manuel lourd.",
    resultat:
      "Une décision plus rapide, plus fiable et plus homogène, avec moins d’erreurs, moins de ressaisie et moins d’hésitation dans l’action.",
  },
  {
    id: "interface-coordination",
    title: "Interface & coordination",
    summary:
      "Faire le lien entre direction, contraintes opérationnelles et réalité du terrain.",
    color: "var(--accent4)",
    tags: ["Direction", "Terrain", "Alignement"],
    enjeu:
      "Aligner des objectifs de performance avec les contraintes réelles du quotidien sans créer de rupture entre pilotage et terrain.",
    miseEnPlace:
      "Mon rôle n’est pas seulement de proposer des outils, mais de transformer des objectifs parfois abstraits en méthodes de travail compréhensibles et acceptables par l’équipe. J’interviens comme interface entre direction, contraintes opérationnelles et réalité du terrain.",
    exemple:
      "Mise en place de suivis quotidiens et de procédures adoptées par l’équipe pour fiabiliser la remontée d’information et mieux coordonner l’activité.",
    resultat:
      "Des priorités mieux partagées, une coordination plus lisible et un pilotage mieux connecté à la réalité opérationnelle.",
  },
  {
    id: "management-utilite",
    title: "Management par l'utilité",
    summary:
      "Faire adhérer au changement en démontrant l’intérêt immédiat des outils et des méthodes.",
    color: "var(--accent5)",
    tags: ["Adhésion", "Changement", "Utilité"],
    enjeu:
      "Faire adopter des méthodes et des outils dans des environnements où tout ce qui ajoute de la complexité est spontanément rejeté.",
    miseEnPlace:
      "Je fais adhérer plus facilement quand une méthode apporte un bénéfice visible tout de suite : moins d’oublis, moins de ressaisie, meilleure priorisation, charge mieux répartie.",
    exemple:
      "C’est cette logique qui m’a permis de faire adopter des procédures, des supports de suivi et des outils de coordination dans des contextes où l’adhésion ne peut pas reposer sur la seule injonction.",
    resultat:
      "Des usages réellement adoptés, parce que perçus comme utiles au quotidien, et non comme une couche administrative supplémentaire.",
  },
  {
    id: "suivi-reporting",
    title: "Suivi & reporting",
    summary:
      "Rendre visibles les indicateurs qui aident réellement à décider et à agir.",
    color: "var(--accent)",
    tags: ["KPI", "Concrétisation", "Délais"],
    enjeu:
      "Passer d’un reporting descriptif à un reporting utile pour comprendre les causes de la sous-performance et agir au bon endroit.",
    miseEnPlace:
      "Je conçois le reporting comme un outil d’action. Les indicateurs qui m’intéressent sont les délais de traitement, la discipline de relance, le taux de perte, les pertes évitables, la qualité du suivi et la santé du portefeuille.",
    exemple:
      "La logique de pilotage ne consiste pas seulement à voir ce qui s’est passé, mais à comprendre pourquoi la performance se dégrade et sur quel levier agir en priorité.",
    resultat:
      "Un pilotage plus factuel, plus réactif et plus utile pour objectiver les actions de coaching et les décisions de management.",
  },
];

export const outils = [
  {
    id: "optiprofit",
    title: "Opti'Profit",
    category: "Aide à la décision commerciale",
    accent: "var(--accent3)",
    status: "Déployé en situation réelle",
    chips: ["Google Apps Script", "Rentabilité", "Temps réel"],
    summary:
      "Outil d'aide à la décision capable d'identifier rapidement le meilleur compromis entre contraintes techniques, budget client et rentabilité magasin.",
    context:
      "En situation de vente, l'enjeu est d'identifier instantanément le produit offrant le meilleur compromis entre les besoins techniques du client, son budget et les contraintes des réseaux de soins, tout en maximisant la rentabilité du point de vente.",
    action:
      "Développement d'un algorithme sous Google Apps Script intégrant catalogues fournisseurs et grilles tarifaires mutuelles. L'outil filtre en temps réel les produits compatibles et met en évidence ceux qui dégagent la marge la plus élevée.",
    results:
      "Dans un magasin en perte de vitesse, cet outil a contribué à un gain de +5,64 points de marge et grace à des actions conjointes une hausse de +83 % du chiffre d'affaires en deux mois.",
  },
  {
    id: "devflow",
    title: "DeV'Flow",
    category: "Solution SaaS de pilotage de la concrétisation commerciale",
    accent: "var(--accent5)",
    status: "Développement & déploiement en cours",
    chips: ["SaaS", "KPI causaux", "KPI croisés"],
    summary:
      "Cadre commun de pilotage des devis et du tiers payant visant à rendre visibles les causes réelles de sous-performance commerciale.",
    context:
      "Le suivi des devis et du tiers payant repose souvent sur des pratiques hétérogènes. Cela crée des zones grises : dossiers stagnants, relances oubliées et impossibilité pour le management de comprendre précisément pourquoi des ventes sont perdues.",
    action:
      "Centralisation des flux dans un cadre commun et conception d'un moteur de KPI causal incluant l'Indice de Fiabilité Commerciale (IFC), afin d'analyser non seulement les résultats, mais aussi les mécanismes de sous-performance : vitesse de traitement, intensité des relances, pertes évitables et instabilité des parcours.",
    results:
      "Passage d'un suivi dispersé à un pilotage structuré sur le plan fonctionnel et analytique. Identification des pertes évitables et objectivation du coaching commercial. La solution SaaS n'est pas encore hébergée ni déployée en production à ce stade ; cette phase est en cours.",
  },
  {
    id: "briefmaker",
    title: "Brief'Maker",
    category: "Support d'organisation quotidienne",
    accent: "var(--accent2)",
    status: "Conçu pour le pilotage quotidien",
    chips: ["Coordination", "Back-office", "Priorisation"],
    summary:
      "Support de brief connecté pour répartir dynamiquement les missions prioritaires et fiabiliser la continuité d'information entre les shifts.",
    context:
      "Le manque de coordination quotidienne, la perte d'information entre les shifts et la difficulté à prioriser les tâches de back-office créent des oublis et une lecture floue de l'activité.",
    action:
      "Conception d'un support de brief connecté permettant une répartition dynamique des missions prioritaires et un suivi des indicateurs de performance en temps réel : chiffre d'affaires, objectifs journaliers, SAV, relances, vérifications.",
    results:
      "Amélioration de la coordination d'équipe, réduction drastique des oublis administratifs et meilleure lisibilité de l'activité pour la direction.",
  },
  {
    id: "planning",
    title: "Gestionnaire de Planning",
    category: "Optimisation RH",
    accent: "var(--accent4)",
    status: "Outil d'optimisation organisationnelle",
    chips: ["Planification", "Ressources", "Flux client"],
    summary:
      "Outil de planification permettant d'adapter les ressources aux besoins réels et de limiter les tensions d'organisation.",
    context:
      "Les tensions organisationnelles proviennent souvent d'une inadéquation entre les effectifs présents, la charge réelle de travail et les contraintes d'ouverture.",
    action:
      "Développement d'un outil de planification automatisé capable d'ajuster les ressources aux besoins réels et de fluidifier le parcours client à partir des contraintes d'activité.",
    results:
      "Résolution de conflits d'organisation et optimisation du coût du personnel par rapport au flux d'activité.",
  },
  {
    id: "ortabels",
    title: "L'Ortabels 3.0",
    category: "Pilotage de production complexe",
    accent: "var(--accent)",
    status: "Projet transverse structurant",
    chips: ["Gantt dynamiques", "Prévision", "Coordination"],
    summary:
      "Architecture de gestion complète pour piloter une exploitation maraîchère pédagogique impliquant plusieurs intervenants.",
    context:
      "La planification de cultures maraîchères implique rotations, semis, récoltes, météo et coordination de multiples intervenants dans un cadre associatif.",
    action:
      "Création d'une architecture complète de gestion combinant diagrammes de Gantt dynamiques, modèles prédictifs fondés sur les données météo locales et outils de coordination collective.",
    results:
      "Structuration complète de l'exploitation, permettant une planification rigoureuse et un pilotage agile des projets pédagogiques.",
  },
];
