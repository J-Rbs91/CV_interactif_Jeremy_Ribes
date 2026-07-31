export const outils = [
  {
    id: "optiprofit",
    title: "Opti'Profit",
    category: "Aide à la décision commerciale",
    nature: "produit",
    status: "Déployé en situation réelle",
    chips: ["Google Apps Script", "Rentabilité", "Temps réel"],
    summary:
      "Outil d'aide à la décision capable d'identifier rapidement le meilleur compromis entre contraintes techniques, budget client et rentabilité magasin.",
    context:
      "En situation de vente, l'enjeu est d'identifier instantanément le produit offrant le meilleur compromis entre les besoins techniques du client, son budget et les contraintes des réseaux de soins, tout en maximisant la rentabilité du point de vente.",
    action:
      "Développement d'un algorithme sous Google Apps Script intégrant catalogues fournisseurs et grilles tarifaires mutuelles. L'outil filtre en temps réel les produits compatibles et met en évidence ceux qui dégagent la marge la plus élevée.",
    results:
      "Dans un magasin en perte de vitesse, cet outil a contribué à un gain de +5,64 points de marge et grâce à des actions conjointes une hausse de +83 % du chiffre d'affaires en deux mois.",
  },
  {
    id: "panum",
    title: "PANUM",
    category: "Suivi commercial & pilotage de la performance",
    nature: "produit",
    /* Le statut disait « développement en cours » là où le produit est
       fonctionnellement abouti : ce qui manque est la structure juridique
       permettant de contractualiser avec des points de vente, pas du code.
       Un blocage administratif annoncé comme un chantier technique fait
       passer un produit fini pour un prototype. */
    status: "Abouti · en attente de déploiement pilote",
    chips: ["Priorisation", "KPI causaux", "Aide à la décision"],
    link: { label: "Découvrir PANUM", url: "https://panum.fr/" },
    summary:
      "Solution de suivi commercial et de pilotage de la performance permettant de centraliser les dossiers, prioriser les relances et rendre visibles les causes de sous-performance.",
    context:
      "Le suivi des devis et du tiers payant repose souvent sur des pratiques hétérogènes. Cela crée des zones grises : dossiers stagnants, relances oubliées et impossibilité pour le management de comprendre précisément pourquoi des ventes sont perdues.",
    /* L'origine terrain n'apparaissait nulle part : la fiche décrivait un
       produit sorti de rien, quand il prolonge un suivi outillé qui a produit
       des résultats mesurés en magasin et tourne encore aujourd'hui. C'est
       ce qui sépare un produit éprouvé d'une intuition de développeur. */
    action:
      "Prolongement d'un suivi outillé conçu en magasin sous Google Sheets, toujours en usage aujourd'hui, étendu en solution complète : conception d'indicateurs de suivi en temps réel, de tableaux de bord multi-niveaux et de mécanismes d'aide à la décision adaptés aux collaborateurs, managers et responsables de réseau.",
    results:
      "Passage d'un suivi dispersé à un pilotage structuré sur le plan fonctionnel et analytique : identification des pertes évitables et objectivation du coaching commercial. L'outil est aujourd'hui fonctionnellement abouti et éprouvé en conditions de test. Son déploiement en points de vente pilotes, qui permettra les derniers ajustements, constitue la prochaine étape.",
  },
  {
    id: "briefmaker",
    title: "Brief'Maker",
    category: "Support connecté d'organisation quotidienne",
    nature: "produit",
    /* « Conçu pour » décrivait une intention de conception là où l'outil est
       en service tous les jours, dans un autre point de vente que celui où
       il a été construit. Un usage qui survit au contexte d'origine est la
       seule preuve d'utilité qu'un lecteur ne peut pas mettre en doute — la
       taire pour annoncer une intention était le plus mauvais échange. */
    status: "En usage quotidien depuis sa conception",
    chips: ["Agrégation", "Agenda Google", "Priorisation", "Back-office"],
    summary:
      "Feuille de brief quotidienne agrégeant le planning, l'agenda et le suivi des dossiers en une seule vue, et répartissant les tâches du jour entre les collaborateurs.",
    context:
      "Le manque de coordination quotidienne, la perte d'information entre les shifts et la difficulté à prioriser les tâches de back-office créent des oublis et une lecture floue de l'activité.",
    /* « Support connecté » ne disait pas connecté à quoi, et se lisait donc
       comme un document partagé. L'outil est un point d'agrégation : il
       consomme le planning et le suivi des dossiers — deux dispositifs de
       cette même section — et l'agenda de l'enseigne. C'est ce qui fait
       système plutôt que collection. */
    action:
      "Conception d'un support de brief agrégeant automatiquement les sources du jour : planning des effectifs, rendez-vous de l'agenda Google et suivi des dossiers, devis et tiers payant. S'y ajoutent une attribution des tâches par collaborateur, pour dispatcher et hiérarchiser le back-office, et des espaces de saisie libre pour les indicateurs de performance et les informations managériales.",
    results:
      "Amélioration de la coordination d'équipe, réduction drastique des oublis administratifs et meilleure lisibilité de l'activité pour la direction. Conçu pour piloter un point de vente, il est resté en service quotidien au-delà de ce contexte et sert encore aujourd'hui dans mon poste actuel.",
  },
  {
    id: "planning",
    title: "Gestionnaire de Planning",
    category: "Optimisation RH",
    nature: "produit",
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
    id: "hub-opticien",
    title: "Hub Outils Opticien",
    category: "Outillage du quotidien en magasin",
    nature: "produit",
    status: "En usage quotidien en magasin",
    chips: ["Application web", "Standardisation", "Données locales"],
    /* Volontairement hors du bandeau « Produits en ligne » : le hub sert
       la démonstration d'utilité, pas la vitrine produit. */
    liveProduct: false,
    link: {
      label: "Découvrir le hub",
      url: "https://j-rbs91.github.io/Hub_Tools_N_Templates/",
    },
    summary:
      "Point d'entrée unique regroupant les outils récurrents du magasin — demande au médecin, clôture de caisse, calcul d'épaisseur de verres — paramétrés une seule fois et utilisables sans formation.",
    context:
      "Les tâches courtes et répétées du magasin s'appuyaient sur des documents dispersés, des calculs refaits à la main et les mêmes informations ressaisies à chaque fois. Prises isolément elles paraissent mineures ; répétées chaque jour, elles consomment du temps de vente et laissent passer des erreurs.",
    action:
      "Conception et développement d'un hub web réunissant ces usages : demandes et comptes rendus au médecin normalisés avec export PDF et envoi par mail, clôture de caisse avec reprise du comptage de la veille et contrôle de l'écart avec le logiciel métier, calcul d'épaisseur et de décentrement des verres avec visualisation. Les coordonnées du magasin sont saisies une fois et alimentent tous les outils ; les données restent sur le poste, sans transmission serveur.",
    results:
      "Dispositif adopté et utilisé quotidiennement : documents homogènes quel que soit le collaborateur, calculs fiabilisés et ressaisies supprimées. Illustration directe de la méthode appliquée aux projets plus lourds — partir d'un irritant concret et livrer une réponse simple, dont l'utilité se vérifie dès le premier usage.",
  },
];
