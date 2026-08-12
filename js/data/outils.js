/* Chaque fiche suit la même chaîne : situation observée → arbitrage →
   réponse → constat. L'arbitrage est la case qui porte la valeur c'est là
   que se décide ce qu'on change dans la façon de travailler, et ce qui ne
   peut pas tenir sans support. L'outil n'est que la matérialisation de cette
   décision, et le constat ne dit que ce qui est établi. */
export const outils = [
  {
    id: "optiprofit",
    title: "Opti’Profit",
    category: "Aide à la décision commerciale",
    nature: "produit",
    status: "Cédé à GrandVision pour son réseau franchisé",
    chips: ["Arbitrage en vente", "Réseaux de soins", "Rentabilité", "Temps réel", "Google Apps Script"],
    summary:
      "Support d’arbitrage qui identifie, pendant la vente, le meilleur compromis entre besoin technique, budget du client et rentabilité du magasin.",
    context:
      "Le bon produit dépend du besoin technique, du budget, des contraintes du réseau de soins et de la marge. L’information est répartie entre les catalogues fournisseurs et les grilles tarifaires des mutuelles, et la décision se prend en quelques secondes, avec le client en face.",
    arbitrage:
      "Ni la formation ni une grille écrite ne tiennent ici : les catalogues et les accords changent, et rien de ce qui doit être appris à l’avance ne survit au moment où l’arbitrage se joue réellement. J’ai donc décidé de déplacer la décision plutôt que de l’enseigner l’amener à l’instant de la vente, au lieu de demander au vendeur de la porter de mémoire.",
    action:
      "Rassemblement des catalogues fournisseurs et des grilles mutuelles en une source unique, filtrage des produits compatibles avec le besoin et le budget, et mise en évidence de l’écart de marge entre deux solutions équivalentes pour le client. Développé sous Google Apps Script.",
    results:
      "La comparaison de catalogues en situation de vente a disparu, et l’arbitrage est devenu explicite au moment où il se prend. Utilisé pendant toute la durée de mon poste. Je l’ai ensuite cédé au directeur régional de GrandVision, pour le réseau de magasins franchisés de la Générale d’Optique ; ce qu’il en a fait ensuite, je ne le sais pas.",
  },
  {
    id: "briefmaker",
    title: "Brief’Maker",
    category: "Organisation quotidienne du magasin",
    nature: "produit",
    status: "En usage quotidien depuis sa conception",
    chips: ["Coordination d’équipe", "Attribution des tâches", "Priorisation", "Back-office", "Agrégation", "Agenda Google"],
    summary:
      "Point de départ de journée : une vue unique du planning, de l’agenda et des dossiers en cours, et la répartition nominative des tâches entre les collaborateurs.",
    context:
      "L’information se perdait entre les shifts et les tâches de back-office n’étaient portées par personne. Non par négligence : elles ne sont visibles nulle part, et chaque équipe suppose que l’autre s’en est chargée. Résultat, des oublis, et une lecture floue de l’activité pour la direction.",
    arbitrage:
      "Ce qui manquait n’était pas un support mais un moment et un responsable : un instant de la journée où les tâches sont nommées et attribuées à quelqu’un. C’est cette décision qui règle le problème. Restait qu’aucun responsable n’allait consolider quatre sources d’information à la main chaque matin c’est ce qui a rendu le support nécessaire.",
    action:
      "Une feuille de brief qui agrège automatiquement les sources du jour planning de l’équipe, rendez-vous de l’agenda, suivi des dossiers, devis et tiers payant puis attribue les tâches par collaborateur et ouvre la saisie des indicateurs et des informations managériales.",
    results:
      "Utilisé dans le magasin où je travaille aujourd’hui, alors que rien ne l’y avait prévu : il a été repris parce qu’il servait, pas parce qu’on l’avait demandé. Ce qu’il est devenu chez mon précédent employeur, je ne peux pas l’établir.",
  },
  {
    id: "hub-opticien",
    title: "Hub Outils Opticien",
    category: "Outillage du quotidien en magasin",
    nature: "produit",
    status: "En usage quotidien en magasin",
    chips: ["Tâches récurrentes", "Fiabilisation des calculs", "Standardisation", "Données locales", "Application web"],
    /* Exclu du bandeau « Produits en ligne » (cf. getLiveProducts). */
    liveProduct: false,
    link: {
      label: "Découvrir le hub",
      url: "https://j-rbs91.github.io/Hub_Tools_N_Templates/",
    },
    summary:
      "Point d’entrée unique pour les tâches courtes et répétées du magasin demande au médecin, clôture de caisse, calcul d’épaisseur paramétrées une fois et utilisables sans formation.",
    context:
      "Ces tâches s’appuyaient sur des documents dispersés, des calculs refaits à la main et les mêmes informations ressaisies chaque fois. Isolées, elles paraissent mineures ; répétées, elles consomment du temps et laissent passer des erreurs.",
    arbitrage:
      "Aucune procédure ne corrige cela : le problème n’est pas que les collaborateurs travaillent mal, c’est que la tâche elle-même est mal outillée. Rédiger un mode opératoire aurait ajouté une lecture à une tâche de deux minutes, et n’aurait été suivi par personne. J’ai choisi de ne rien demander de plus à l’équipe et de supprimer l’écart entre collaborateurs en supprimant la ressaisie.",
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
    chips: ["Suivi de dossiers", "Tiers payant", "Relances", "Google Apps Script"],
    summary:
      "Suivi partagé qui tient chaque devis de son édition à sa conclusion : statut du tiers payant, prochaine action datée, motif de perte et historique des échanges avec le client.",
    context:
      "Un devis se perd rarement d’un coup : il s’enlise. Une pièce qui manque, une prise en charge qui ne revient pas, une relance que personne ne s’attribue. Sans trace commune, chacun redécouvre le dossier à chaque fois, et le magasin ne sait ni ce qu’il perd, ni pourquoi.",
    arbitrage:
      "Avant tout support, il fallait trancher trois choses : à partir de quand un dossier devient réellement à risque, qui en porte la responsabilité, et surtout ce que l’équipe accepterait de saisir. Une granularité plus fine aurait été plus juste et n’aurait jamais été remplie. J’ai retenu le niveau de détail que le travail quotidien peut porter, pas celui que le pilotage aurait préféré.",
    action:
      "Matérialisation de ces règles en un suivi partagé : neuf statuts de tiers payant, plateforme et mutuelle, date de prochaine action, motif de blocage ou de perte, profil d’achat, collaborateur en charge, et historique daté des échanges avec le client.",
    results:
      "Rempli quotidiennement par l’équipe, sans que personne ait eu à l’imposer. Ses colonnes sont devenues les référentiels de PANUM : statuts de financement, motifs, profils d’achat et historiques y sont repris tels quels. Le produit n’a pas été imaginé puis confronté au terrain ; il est né de ce que le terrain remplissait déjà.",
  },
  {
    id: "panum",
    title: "PANUM",
    category: "Suivi commercial & pilotage de la performance",
    nature: "produit",
    status: "Abouti · en attente de déploiement pilote",
    chips: ["Priorisation des relances", "Causes de perte", "Périmètres de visibilité", "Aide à la décision"],
    link: { label: "Découvrir PANUM", url: "https://panum.fr/" },
    summary:
      "Solution de suivi commercial et de pilotage de la performance : centraliser les dossiers, prioriser les relances et rendre visibles les causes de sous-performance.",
    context:
      "Le suivi des devis et du tiers payant repose souvent sur des pratiques hétérogènes. Cela crée des zones grises : dossiers stagnants, relances oubliées, et un management qui ne sait pas précisément pourquoi les ventes se perdent.",
    arbitrage:
      "Le suivi partagé ci-dessus fonctionnait ; c’est le pilotage qui butait. Un tableur ne sait pas porter des périmètres de visibilité distincts selon le niveau hiérarchique, ni historiser un blocage pour en mesurer la cause plutôt que la compter. Ce qui manquait n’était donc plus un support d’équipe, mais un modèle de responsabilité à l’échelle d’un réseau et cela ne pouvait plus tenir dans l’outil existant.",
    action:
      "Modélisation de la hiérarchie d’un réseau direction, management, collaborateurs avec les périmètres de visibilité correspondants, historisation des épisodes de blocage pour en mesurer les causes, et traitement des données personnelles intégré dès la conception.",
    results:
      "Le produit est fonctionnellement abouti et éprouvé en conditions de test. Le moteur de priorisation, lui, n’a pas encore été confronté à des données d’exploitation réelles : c’est précisément l’objet du pilote. Le déploiement en points de vente attend la structure juridique qui permettra de contractualiser.",
  },
  {
    id: "planning",
    title: "Gestionnaire de Planning",
    category: "Planification des effectifs",
    nature: "produit",
    status: "Resté en service après mon départ",
    chips: ["Charge et effectifs", "Contraintes d’ouverture", "Planification", "Ressources", "Flux client"],
    summary:
      "Outil de construction de planning alignant les effectifs présents sur la charge réelle et les contraintes d’ouverture du point de vente.",
    context:
      "Les tensions d’organisation se lisaient comme un problème de personnes. Elles venaient d’un écart entre les effectifs présents, la charge réelle de travail et les contraintes d’ouverture du magasin.",
    arbitrage:
      "La décision n’était pas de construire un outil mais de rouvrir les règles : horaires d’ouverture, plages de présence et répartition des shifts. C’est là que le problème se règle. L’outil ne prend aucune de ces décisions il rend seulement tenable, chaque semaine, un arbitrage qui autrement se refaisait de tête et se renégociait à chaque planning.",
    action:
      "Développement d’un outil de construction de planning ajustant les effectifs à l’activité attendue à partir des contraintes d’exploitation du point de vente.",
    results:
      "Les conflits d’organisation récurrents ont cessé pendant la durée de mon poste, et le coût du personnel s’est aligné sur le flux réel. Après mon départ, un collaborateur l’a repris pour construire ses plannings. Une version simplifiée un planning type restitué selon la date reste intégrée à Brief’Maker pour afficher le planning du jour.",
  },
];
