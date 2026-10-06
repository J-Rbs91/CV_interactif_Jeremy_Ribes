/* Chaque fiche suit la même chaîne : situation → décision → réponse →
   résultat (le champ `arbitrage` porte la case « Décision »). La décision est
   la case qui porte la valeur : c'est là que se décide ce qu'on change dans la
   façon de travailler, et ce qui ne peut pas tenir sans outil. Le résultat ne
   dit que ce qui est établi.

   Registre : des phrases simples, sans tournure « pas X, mais Y » à chaque
   fiche ni maxime de conclusion. Répétées d'une fiche à l'autre, elles
   donnaient au texte l'allure d'un gabarit rédigé par une machine. */
export const outils = [
  {
    id: "optiprofit",
    title: "Opti’Profit",
    category: "Aide à la décision commerciale",
    nature: "produit",
    status: "Transmis à la demande du directeur régional GrandVision",
    detailLabel: "Pourquoi pas une formation",
    chips: ["Arbitrage en vente", "Réseaux de soins", "Rentabilité", "Temps réel", "Google Apps Script"],
    summary:
      "Outil utilisé pendant la vente pour trouver le meilleur compromis entre besoin technique, budget du client et marge du magasin.",
    context:
      "Le bon produit dépend du besoin technique, du budget, des contraintes du réseau de soins et de la marge. L’information est répartie entre les catalogues fournisseurs et les grilles tarifaires des mutuelles, et la décision se prend en quelques secondes, avec le client en face.",
    arbitrage:
      "Une formation ou une grille écrite ne suffisaient pas : les catalogues et les accords changent souvent, et ce qu’on apprend à l’avance est oublié ou dépassé au moment de vendre. J’ai donc choisi d’apporter l’information au moment de la vente, au lieu de demander au vendeur de la retenir.",
    action:
      "Rassemblement des catalogues fournisseurs et des grilles mutuelles en une source unique, filtrage des produits compatibles avec le besoin et le budget, et mise en évidence de l’écart de marge entre deux solutions équivalentes pour le client. Développé sous Google Apps Script.",
    results:
      "Les vendeurs n’ont plus eu à comparer les catalogues devant le client, et le choix du produit est devenu clair au moment de la vente. Utilisé pendant toute la durée de mon poste. Conçu sur mon temps personnel, l’outil m’appartient. Je l’ai transmis à la demande du directeur régional de GrandVision, qui l’envisageait pour le réseau de magasins franchisés de la Générale d’Optique.",
  },
  {
    id: "briefmaker",
    title: "Brief’Maker",
    category: "Organisation quotidienne du magasin",
    nature: "produit",
    status: "En usage quotidien depuis sa conception",
    detailLabel: "Nommer qui fait quoi",
    chips: ["Coordination d’équipe", "Attribution des tâches", "Priorisation", "Back-office", "Agrégation", "Agenda Google"],
    summary:
      "Le brief du début de journée : planning, agenda et dossiers en cours sur une seule vue, et les tâches réparties nommément entre les collaborateurs.",
    context:
      "L’information se perdait d’une équipe à l’autre, et les tâches de back-office n’apparaissaient nulle part : chaque équipe pensait que l’autre s’en était occupée. Il en résultait des oublis, et une vision floue de l’activité pour la direction.",
    arbitrage:
      "Il fallait d’abord un moment dans la journée où chaque tâche est attribuée à quelqu’un. C’est cette décision qui résout le problème. Mais aucun responsable n’allait rassembler quatre sources d’information à la main chaque matin : c’est pour cela qu’un outil est devenu nécessaire.",
    action:
      "Une feuille de brief qui rassemble automatiquement les informations du jour (planning de l’équipe, rendez-vous de l’agenda, suivi des dossiers, devis et tiers payant), puis attribue les tâches à chaque collaborateur et permet de saisir les indicateurs et les informations managériales.",
    results:
      "Utilisé chaque jour dans le magasin où je travaille aujourd’hui. Personne ne l’avait demandé : l’équipe l’a adopté parce qu’il lui servait.",
  },
  {
    id: "hub-opticien",
    title: "Hub Outils Opticien",
    category: "Outillage du quotidien en magasin",
    nature: "produit",
    status: "En usage quotidien en magasin",
    detailLabel: "Supprimer la ressaisie",
    chips: ["Tâches récurrentes", "Fiabilisation des calculs", "Standardisation", "Données locales", "Application web"],
    /* Exclu du bandeau « Produits en ligne » (cf. getLiveProducts). */
    liveProduct: false,
    link: {
      label: "Découvrir le hub",
      url: "https://j-rbs91.github.io/Hub_Tools_N_Templates/",
    },
    summary:
      "Un point d’entrée unique pour les tâches courtes et répétées du magasin (demande au médecin, clôture de caisse, calcul d’épaisseur), paramétrées une fois et utilisables sans formation.",
    context:
      "Ces tâches s’appuyaient sur des documents dispersés, des calculs refaits à la main et les mêmes informations ressaisies chaque fois. Chacune paraît mineure, mais répétées chaque jour, elles prennent du temps et laissent passer des erreurs.",
    arbitrage:
      "Une procédure n’aurait rien changé : les collaborateurs travaillaient bien, c’est la tâche qui était mal outillée. Un mode opératoire aurait ajouté une lecture à une tâche de deux minutes, et personne ne l’aurait suivi. J’ai préféré ne rien demander de plus à l’équipe et supprimer la ressaisie, ce qui supprime aussi les écarts entre collaborateurs.",
    action:
      "Regroupement de ces usages en un point d’entrée unique : demandes et comptes rendus au médecin normalisés avec export PDF et envoi par mail, clôture de caisse reprenant le comptage de la veille et contrôlant l’écart avec le logiciel métier, calcul d’épaisseur et de décentrement avec représentation à l’échelle 1:1 du verre taillé et monté. Les coordonnées du magasin sont saisies une fois et alimentent tous les outils ; les données restent sur le poste, sans transmission serveur.",
    results:
      "En service dans le magasin : les documents sont identiques quel que soit le collaborateur qui les produit, et les calculs récurrents ne se refont plus à la main.",
  },
  {
    id: "suivi-devis",
    title: "Suivi des devis & tiers payant",
    category: "Suivi commercial en magasin",
    nature: "produit",
    status: "En usage quotidien par toute l’équipe",
    detailLabel: "Ce que l’équipe saisit",
    chips: ["Suivi de dossiers", "Tiers payant", "Relances", "Google Apps Script"],
    summary:
      "Suivi partagé qui tient chaque devis de son édition à sa conclusion : statut du tiers payant, prochaine action datée, motif de perte et historique des échanges avec le client.",
    context:
      "Un devis se perd rarement d’un coup : il traîne. Il manque une pièce, l’accord de prise en charge n’aboutit pas, ou personne ne fait la relance. Sans suivi commun, chacun redécouvre le dossier à chaque fois, et le magasin ne sait ni ce qu’il perd, ni pourquoi.",
    arbitrage:
      "Avant de construire quoi que ce soit, il fallait décider à partir de quand un dossier devient à risque, qui en est responsable, et surtout ce que l’équipe accepterait de saisir. Un suivi plus détaillé aurait été plus précis, mais personne ne l’aurait rempli. J’ai choisi le niveau de détail que l’équipe peut tenir au quotidien.",
    action:
      "Matérialisation de ces règles en un suivi partagé : neuf statuts de tiers payant, plateforme et mutuelle, date de prochaine action, motif de blocage ou de perte, profil d’achat, collaborateur en charge, et historique daté des échanges avec le client.",
    results:
      "Rempli chaque jour par l’équipe, sans que personne ait eu à l’imposer. Ses colonnes ont servi de base à PANUM : statuts de financement, motifs, profils d’achat et historiques y sont repris tels quels.",
  },
  {
    id: "panum",
    title: "PANUM",
    category: "Suivi commercial & pilotage de la performance",
    nature: "produit",
    status: "Abouti · en attente de déploiement pilote",
    detailLabel: "Pourquoi quitter le tableur",
    chips: ["Priorisation des relances", "Causes de perte", "Périmètres de visibilité", "Aide à la décision"],
    link: { label: "Découvrir PANUM", url: "https://panum.fr/" },
    summary:
      "Solution de suivi commercial et de pilotage de la performance : centraliser les dossiers, prioriser les relances et rendre visibles les causes de sous-performance.",
    context:
      "Le suivi des devis et du tiers payant repose souvent sur des pratiques hétérogènes. Résultat : des dossiers qui stagnent, des relances oubliées, et un management qui ne sait pas précisément pourquoi les ventes se perdent.",
    arbitrage:
      "Le suivi partagé fonctionnait pour l’équipe, mais pas pour piloter un réseau. Un tableur ne permet pas de donner à chacun une vue adaptée à son niveau hiérarchique, ni de garder l’historique d’un blocage pour en comprendre la cause. Il fallait donc un vrai logiciel, construit autour des responsabilités de chaque niveau.",
    action:
      "Modélisation de la hiérarchie d’un réseau direction, management, collaborateurs avec les périmètres de visibilité correspondants, historisation des épisodes de blocage pour en mesurer les causes, et traitement des données personnelles intégré dès la conception.",
    results:
      "Le produit est terminé et testé. Le déploiement pilote en magasin servira à valider la priorisation sur des données réelles ; il attend la création de la structure juridique qui permettra de signer avec les points de vente.",
  },
  {
    id: "planning",
    title: "Gestionnaire de Planning",
    category: "Planification des effectifs",
    nature: "produit",
    status: "Resté en service après mon départ",
    detailLabel: "Revoir les horaires",
    chips: ["Charge et effectifs", "Contraintes d’ouverture", "Planification", "Ressources", "Flux client"],
    summary:
      "Outil de construction de planning alignant les effectifs présents sur la charge réelle et les contraintes d’ouverture du point de vente.",
    context:
      "On attribuait les tensions d’organisation aux personnes. Elles venaient en fait d’un décalage entre les effectifs présents, la charge de travail et les contraintes d’ouverture du magasin.",
    arbitrage:
      "La vraie décision était de revoir les règles : horaires d’ouverture, plages de présence et répartition des créneaux. L’outil ne décide rien à la place du responsable : il permet d’appliquer ces règles chaque semaine, au lieu de tout refaire de tête et de renégocier chaque planning.",
    action:
      "Développement d’un outil de construction de planning ajustant les effectifs à l’activité attendue à partir des contraintes d’exploitation du point de vente.",
    results:
      "Les conflits d’organisation récurrents ont cessé pendant la durée de mon poste, et le coût du personnel s’est aligné sur le flux réel. Après mon départ, un collaborateur l’a repris pour construire ses plannings. Une version simplifiée, qui affiche le planning type selon la date, est intégrée à Brief’Maker pour montrer le planning du jour.",
  },
];
