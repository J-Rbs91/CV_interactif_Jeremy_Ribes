export const outils = [
  {
    id: "optiprofit",
    title: "Opti’Profit",
    category: "Aide à la décision commerciale",
    nature: "produit",
    status: "Cédé à GrandVision pour son réseau franchisé",
    chips: ["Google Apps Script", "Rentabilité", "Temps réel"],
    summary:
      "Outil d’aide à la décision qui identifie, en vente, le meilleur compromis entre besoin technique, budget client et rentabilité du magasin.",
    context:
      "En vente, le bon produit dépend du besoin technique, du budget, des contraintes du réseau de soins et de la marge. L’arbitrage se faisait de tête, catalogue par catalogue, avec le client en face.",
    action:
      "Développement d’un algorithme sous Google Apps Script intégrant les catalogues fournisseurs et les grilles tarifaires des mutuelles. L’outil filtre en temps réel les produits compatibles et met en évidence l’écart de marge entre deux solutions équivalentes pour le client.",
    results:
      "Suppression du temps passé à comparer les catalogues et arbitrage rendu explicite au moment où il se joue. L’outil a été l’un des leviers du redressement obtenu chez Générale d’Optique. Je l’ai ensuite cédé au directeur régional de GrandVision, qui en poursuit le développement pour le réseau de magasins franchisés de la Générale d’Optique.",
  },
  {
    id: "briefmaker",
    title: "Brief’Maker",
    category: "Organisation quotidienne du magasin",
    nature: "produit",
    status: "En usage quotidien depuis sa conception",
    chips: ["Agrégation", "Agenda Google", "Priorisation", "Back-office"],
    summary:
      "Feuille de brief quotidienne agrégeant le planning, l’agenda et le suivi des dossiers en une seule vue, et répartissant les tâches du jour entre les collaborateurs.",
    context:
      "L’information se perdait entre les shifts, et les tâches de back-office n’étaient priorisées par personne. Résultat : des oublis, et une lecture floue de l’activité pour la direction.",
    action:
      "Conception d’un support de brief qui agrège automatiquement les sources du jour — planning de l’équipe, rendez-vous de l’agenda Google, suivi des dossiers, devis et tiers payant. S’y ajoutent l’attribution des tâches par collaborateur et des espaces de saisie pour les indicateurs et les informations managériales.",
    results:
      "En service tous les jours depuis sa conception. L’outil a suivi un changement d’employeur : construit chez Générale d’Optique, il est utilisé aujourd’hui dans mon poste actuel, où rien ne l’avait prévu.",
  },
  {
    id: "hub-opticien",
    title: "Hub Outils Opticien",
    category: "Outillage du quotidien en magasin",
    nature: "produit",
    status: "En usage quotidien en magasin",
    chips: ["Application web", "Standardisation", "Données locales"],
    /* Exclu du bandeau « Produits en ligne » (cf. getLiveProducts). */
    liveProduct: false,
    link: {
      label: "Découvrir le hub",
      url: "https://j-rbs91.github.io/Hub_Tools_N_Templates/",
    },
    summary:
      "Point d’entrée unique regroupant les outils récurrents du magasin — demande au médecin, clôture de caisse, calcul d’épaisseur de verres — paramétrés une seule fois et utilisables sans formation.",
    context:
      "Les tâches courtes et répétées du magasin s’appuyaient sur des documents dispersés, des calculs refaits à la main et les mêmes informations ressaisies chaque fois. Isolées, elles paraissent mineures ; répétées, elles consomment du temps de vente et laissent passer des erreurs.",
    action:
      "Conception et développement d’un hub web réunissant ces usages : demandes et comptes rendus au médecin normalisés avec export PDF et envoi par mail, clôture de caisse avec reprise du comptage de la veille et contrôle de l’écart avec le logiciel métier, calcul d’épaisseur et de décentrement des verres avec représentation à l’échelle 1:1 du verre taillé et monté. Les coordonnées du magasin sont saisies une fois et alimentent tous les outils ; les données restent sur le poste, sans transmission serveur.",
    results:
      "Utilisé tous les jours : documents identiques quel que soit le collaborateur, calculs fiabilisés, ressaisies supprimées. Illustration directe de la méthode appliquée aux projets plus lourds — partir d’un irritant concret, livrer une réponse dont l’utilité se vérifie au premier usage.",
  },
  {
    id: "panum",
    title: "PANUM",
    category: "Suivi commercial & pilotage de la performance",
    nature: "produit",
    status: "Abouti · en attente de déploiement pilote",
    chips: ["Priorisation", "KPI causaux", "Aide à la décision"],
    link: { label: "Découvrir PANUM", url: "https://panum.fr/" },
    summary:
      "Solution de suivi commercial et de pilotage de la performance : centraliser les dossiers, prioriser les relances et rendre visibles les causes de sous-performance.",
    context:
      "Le suivi des devis et du tiers payant repose souvent sur des pratiques hétérogènes. Cela crée des zones grises : dossiers stagnants, relances oubliées, et un management qui ne sait pas précisément pourquoi les ventes se perdent.",
    action:
      "Extension en solution complète du suivi outillé conçu en magasin sous Google Sheets, qui tourne toujours à mon poste actuel : indicateurs en temps réel, tableaux de bord par niveau de responsabilité, priorisation des relances et identification des pertes évitables.",
    results:
      "Le produit est fonctionnellement abouti et éprouvé en conditions de test. Le déploiement en points de vente pilotes est la prochaine étape ; il attend la mise en place de la structure juridique permettant de contractualiser.",
  },
  {
    id: "planning",
    title: "Gestionnaire de Planning",
    category: "Planification des effectifs",
    nature: "produit",
    status: "Toujours en usage en point de vente",
    chips: ["Planification", "Ressources", "Flux client"],
    summary:
      "Outil de planification alignant les effectifs présents sur la charge réelle et les contraintes d’ouverture.",
    context:
      "Les tensions d’organisation venaient d’un écart entre les effectifs présents, la charge réelle de travail et les contraintes d’ouverture du magasin.",
    action:
      "Développement d’un outil de construction de planning ajustant les effectifs à l’activité attendue à partir des contraintes d’exploitation du point de vente.",
    results:
      "Conflits d’organisation récurrents réglés, coût du personnel ajusté au flux réel. Un ancien collaborateur du magasin s’en sert toujours pour construire ses plannings. Je ne l’utilise plus moi-même, mais une version simplifiée — un planning type restitué selon la date — reste intégrée à Brief’Maker pour afficher le planning du jour.",
  },
];
