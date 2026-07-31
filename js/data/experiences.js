export const realisations = {
  stats: [
    /* « à peine » fait tout le travail : les deux mois disent la VITESSE à
       laquelle les effets sont apparus, pas une mesure qu'on aurait bornée à
       deux mois — ce qui passerait pour un échantillon court, donc un
       résultat fragile. C'est l'argument, pas une réserve. La durée du poste
       est portée par le badge de section, jamais ici. */
    { value: "+83% CA", label: "en 2 mois à peine" },
    { value: "+5,6 pts", label: "de marge" },
  ],
  /* La note fait le contrepoids du titre ET de l'étiquette. Du titre : ce cas
     est un exemple, pas le total. De l'étiquette : « deux mois » cadre la
     redynamisation du point de vente, pas la durée de vie des dispositifs.
     Trois des cinq cartes décrivent des outils qui existent hors de ce poste
     — PANUM a son propre site et son propre déploiement — et les enfermer
     dans une expérience passée les ferait passer pour des bricolages de
     circonstance. */
  note: "Ce cas n'est qu'un exemple, et les dispositifs qu'il présente ne s'y limitent pas : plusieurs ont continué à servir et à évoluer au-delà de ce poste. Leur détail est dans la section Outils ; les autres réalisations que j'ai conçues et menées sont dans Projets transverses.",
  items: [
    {
      icon: "trending-up",
      text: "Déploiement d'une politique commerciale offensive et développement du trafic par actions locales ciblées, optimisation du référencement local et valorisation des avis Google (Uberall/Yext).",
      nature: "produit",
    },
    {
      icon: "wrench",
      text: "Création d'un outil d'aide à la décision (Google Apps Script) identifiant en temps réel le meilleur mix produit selon les contraintes métier et le budget client.",
      nature: "produit",
    },
    {
      icon: "coins",
      text: "Sécurisation de la marge, suppression des ressaisies administratives chronophages et fluidification du parcours client.",
      nature: "produit",
    },
    {
      icon: "clipboard",
      text: "Système de suivi automatisé des devis, améliorant la concrétisation, les délais et la coordination entre collaborateurs.",
      nature: "produit",
    },
    {
      icon: "calendar",
      text: "Outil de planning permettant d'adapter les effectifs aux besoins réels et de résoudre les tensions organisationnelles.",
      nature: "produit",
    },
  ],
};

export const experiences = [
  {
    role: "Opticien collaborateur",
    company: "Krys",
    date: "2025 → aujourd'hui",
    recency: "now",
    bullets: [
      "Normalisation opérationnelle : procédures de gestion back-office (contrôle, dispatch, retards) et lissage des flux de livraison (RDV livraison).",
      "Pilotage : outils de suivi quotidien pour fiabiliser la remontée d'informations et coordonner l'équipe.",
      "Interface opérationnelle : traduction des objectifs de la direction en méthodes de travail, facilitant l'adhésion de l'équipe.",
      "Développement commercial & CRM : conception et déploiement d'une campagne e-mail automatisée auprès de plus d'un millier de clients, incluant la segmentation de la base, le contrôle des consentements, la personnalisation des communications et le suivi des conversions.",
      "Fiabilisation des données commerciales : conception de contrôles automatisés rapprochant les données du logiciel métier et les suivis internes afin d'identifier les dossiers non tracés, quantifier les écarts et orienter les actions correctives.",
      "Développement d'outils Desktop et Web d'aide à la vente.",
    ],
  },
  {
    role: "Responsable de magasin",
    company: "Générale d'Optique",
    date: "2024 → 2025",
    recency: "recent",
    bullets: [
      "Pilotage de l'activité commerciale, opérationnelle et organisationnelle du point de vente.",
      "Management de proximité, accompagnement de l'équipe et suivi du fonctionnement quotidien.",
      "Coordination entre besoins terrain, exigences de performance et attentes de la direction.",
      "Contribution à l'amélioration de l'organisation, de la lisibilité de l'activité et du pilotage.",
    ],
    tags: [
      { label: "+83% CA", nature: "preuve" },
      { label: "+5,6 pts marge", nature: "preuve" },
    ],
  },
  {
    role: "Opticien collaborateur",
    company: "GrandOptical · Krys · Lissac",
    date: "2012 → 2023",
    recency: "past",
    bullets: [
      "Relation client, vente conseil et gestion des situations complexes.",
      "Bonne connaissance des contraintes terrain en magasin : charge, temps, priorités et qualité de service.",
      "Évolution progressive vers des sujets d'organisation et d'amélioration du fonctionnement quotidien.",
    ],
  },
];
