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
    detailLabel: "Le choix des produits",
    chips: ["Arbitrage en vente", "Réseaux de soins", "Rentabilité", "Temps réel", "Google Apps Script"],
    summary:
      "Pendant la vente, l’outil affiche les 10 produits à plus forte marge parmi ceux qui respectent les contraintes techniques, les préférences et le budget du client.",
    context:
      "En magasin, il faut rapprocher les contraintes techniques, les souhaits du client, son budget et les accords de prise en charge. Les informations sont dispersées entre les catalogues fournisseurs et les grilles des mutuelles.",
    arbitrage:
      "J’ai choisi de regrouper ces informations dans l’outil utilisé au moment de la vente. Les catalogues et les accords changent régulièrement : une grille imprimée aurait demandé des mises à jour constantes.",
    action:
      "Développement sous Google Apps Script d’un classement des produits compatibles avec le besoin du client et son budget. Les dix premières propositions sont triées selon la marge. Le prix final et la remise restent visibles pendant la vente.",
    results:
      "Utilisé pendant toute la durée de mon poste pour éviter les comparaisons manuelles de catalogues. Je l’ai conçu sur mon temps personnel et transmis à la demande du directeur régional de GrandVision, qui envisageait de le proposer aux magasins franchisés de Générale d’Optique.",
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
      "Chaque matin, Brief’Maker regroupe le planning, les rendez-vous, les dossiers à suivre et les tâches attribuées à chaque collaborateur.",
    context:
      "Au changement d’équipe, certaines tâches de back-office n’étaient pas reprises. Le planning, les rendez-vous et les suivis étaient consultés séparément, sans liste commune des tâches à traiter.",
    arbitrage:
      "J’ai mis en place un brief quotidien avec une attribution nominative des tâches. Pour qu’il soit utilisable chaque matin, j’ai automatisé la récupération des informations déjà disponibles.",
    action:
      "La feuille rassemble le planning, l’agenda, les devis et les dossiers de tiers payant. Elle permet de répartir les tâches, puis de consigner les indicateurs et les informations utiles au suivi de l’équipe.",
    results:
      "Utilisé quotidiennement dans mon magasin actuel, après avoir été conçu pour mon poste précédent.",
  },
  {
    id: "hub-opticien",
    title: "Hub Outils Opticien",
    category: "Outillage du quotidien en magasin",
    nature: "produit",
    status: "En usage quotidien en magasin",
    detailLabel: "Supprimer la ressaisie",
    chips: ["Tâches récurrentes", "Fiabilisation des calculs", "Standardisation", "Données locales", "Application web"],
    link: {
      label: "Découvrir le hub",
      url: "https://j-rbs91.github.io/Hub_Tools_N_Templates/",
      printLabel: "Hub Outils Opticien",
    },
    summary:
      "Un hub web utilisé chaque jour en magasin : demandes aux médecins, clôture de caisse et calculs optiques réunis dans une même interface pour éviter les ressaisies.",
    context:
      "Les documents destinés aux médecins, les calculs optiques et la clôture de caisse utilisaient plusieurs fichiers. Les coordonnées du magasin étaient ressaisies et certains calculs repris à la main.",
    arbitrage:
      "J’ai réuni ces tâches dans une interface unique, avec les informations du magasin renseignées une seule fois. Les collaborateurs conservent leurs habitudes, avec moins de saisies à refaire.",
    action:
      "Regroupement de ces usages en un point d’entrée unique : demandes et comptes rendus au médecin normalisés avec export PDF et envoi par mail, clôture de caisse reprenant le comptage de la veille et contrôlant l’écart avec le logiciel métier, calcul d’épaisseur et de décentrement avec représentation à l’échelle 1:1 du verre taillé et monté. Les coordonnées du magasin sont saisies une fois et alimentent tous les outils ; les données restent sur le poste, sans transmission serveur.",
    results:
      "L’équipe utilise le hub chaque jour. Les documents suivent le même modèle pour tous les collaborateurs et les calculs sont effectués dans l’application.",
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
      "Certains devis restaient sans suite : pièce manquante, prise en charge en attente ou relance oubliée. L’équipe n’avait pas de vue commune des dossiers et de leur prochaine échéance.",
    arbitrage:
      "J’ai défini les statuts utiles au suivi, la prochaine action et le collaborateur responsable. J’ai limité les saisies à ce que l’équipe peut réellement renseigner chaque jour.",
    action:
      "Matérialisation de ces règles en un suivi partagé : neuf statuts de tiers payant, plateforme et mutuelle, date de prochaine action, motif de blocage ou de perte, profil d’achat, collaborateur en charge, et historique daté des échanges avec le client.",
    results:
      "Le suivi est renseigné quotidiennement par l’équipe. Ses statuts, motifs, profils d’achat et historiques ont ensuite servi de base à PANUM.",
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
      "D’un magasin à l’autre, les devis et les prises en charge ne sont pas suivis de la même manière. Il devient difficile de repérer les relances oubliées et de comprendre pourquoi certains dossiers n’aboutissent pas.",
    arbitrage:
      "Le tableur répondait aux besoins d’une équipe. Pour un réseau de magasins, j’ai conçu une application avec des vues adaptées aux collaborateurs, aux managers et à la direction, ainsi qu’un historique des blocages.",
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
      "Les plannings provoquaient des tensions régulières. Certains créneaux étaient trop chargés et d’autres manquaient de personnel au regard de l’activité du magasin.",
    arbitrage:
      "J’ai revu les horaires et la répartition des effectifs en fonction de l’activité du magasin, puis développé un outil pour établir les plannings sur cette base.",
    action:
      "Le gestionnaire prend en compte les horaires d’ouverture, les règles de présence et les besoins en effectifs par créneau.",
    results:
      "Les tensions récurrentes sur les plannings ont cessé pendant mon poste et la présence des équipes a été ajustée à l’activité. Après mon départ, un collaborateur a continué à utiliser le gestionnaire. Une version simplifiée affiche aussi le planning du jour dans Brief’Maker.",
  },
];
