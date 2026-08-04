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
      "Suppression du temps passé à comparer les catalogues et arbitrage rendu explicite au moment où il se joue. L’outil a été l’un des leviers du redressement obtenu chez Générale d’Optique. Je l’ai ensuite cédé au directeur régional de GrandVision, pour qu’il soit développé à l’échelle du réseau de magasins franchisés de la Générale d’Optique.",
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
    id: "suivi-devis",
    title: "Suivi des devis & tiers payant",
    category: "Suivi commercial en magasin",
    nature: "produit",
    status: "En usage quotidien par toute l’équipe",
    chips: ["Google Apps Script", "Tiers payant", "Relances"],
    summary:
      "Suivi partagé qui tient chaque devis de son édition à sa conclusion : statut du tiers payant, prochaine action datée, motif de perte et historique des échanges avec le client.",
    context:
      "Un devis se perd rarement d’un coup : il s’enlise. Une pièce qui manque, une prise en charge qui ne revient pas, une relance que personne ne s’attribue. Sans trace commune, chacun redécouvre le dossier à chaque fois, et le magasin ne sait ni ce qu’il perd, ni pourquoi.",
    action:
      "Conception sous Google Sheets et Apps Script d’un suivi partagé par toute l’équipe : neuf statuts de tiers payant, plateforme et mutuelle, date de prochaine action, motif de blocage ou de perte, profil d’achat, collaborateur en charge et historique daté des échanges avec le client. Conçu dans un magasin puis reproposé dans un autre, il y a gagné un code couleur quand l’équipe s’est agrandie — à plusieurs, il faut retrouver son dossier d’un coup d’œil.",
    results:
      "Utilisé plusieurs fois par jour par toute l’équipe, sans que personne ait eu à l’imposer. Ses colonnes sont devenues les référentiels de PANUM : statuts de financement, motifs, profils d’achat et historiques y sont repris tels quels. Le produit n’a pas été imaginé puis confronté au terrain — il est né de ce que le terrain remplissait déjà.",
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
      "Extension du suivi ci-dessus en solution complète, là où le tableur atteignait sa limite : le pilotage. Le produit modélise la hiérarchie d’un réseau — direction, management, collaborateurs — avec les périmètres de visibilité correspondants, historise les épisodes de blocage pour en mesurer les causes plutôt que les compter, et intègre le traitement des données personnelles dès la conception.",
    results:
      "Le produit est fonctionnellement abouti et éprouvé en conditions de test. Le moteur de priorisation, lui, n’a pas encore été confronté à des données d’exploitation réelles — c’est précisément l’objet du pilote. Le déploiement en points de vente attend la structure juridique qui permettra de contractualiser.",
  },
  {
    id: "planning",
    title: "Gestionnaire de Planning",
    category: "Planification des effectifs",
    nature: "produit",
    status: "Resté en service après mon départ",
    chips: ["Planification", "Ressources", "Flux client"],
    summary:
      "Outil de planification alignant les effectifs présents sur la charge réelle et les contraintes d’ouverture.",
    context:
      "Les tensions d’organisation venaient d’un écart entre les effectifs présents, la charge réelle de travail et les contraintes d’ouverture du magasin.",
    action:
      "Développement d’un outil de construction de planning ajustant les effectifs à l’activité attendue à partir des contraintes d’exploitation du point de vente.",
    results:
      "Conflits d’organisation récurrents réglés, coût du personnel ajusté au flux réel. L’outil est resté au magasin après mon départ : un collaborateur a continué de s’en servir pour construire ses plannings. Une version simplifiée — un planning type restitué selon la date — reste par ailleurs intégrée à Brief’Maker pour afficher le planning du jour.",
  },
];
