export const projetsTransverses = [
  {
    title: "KuT : logiciel de gestion pour salons et activités de bien-être",
    subtitle: "Conception produit & pilotage · en ligne, développement continu",
    bullets: [
      "Traduction des besoins d’un salon à prestations récurrentes en parcours, règles métier et fonctionnalités : clients, réservations, planning, fidélité, campagnes commerciales et indicateurs. Module de caisse et exports comptables en cours.",
      "Formalisation des règles métier, des invariants, des scénarios limites et des plans de tests nécessaires au contrôle déterministe des fonctionnalités sensibles.",
      "Pilotage du projet : cadrage fonctionnel, priorisation des évolutions, validation des usages et préparation du déploiement.",
    ],
    link: { label: "Découvrir KuT", url: "https://kut.panum.fr/" },
    transferableSkills: [
      {
        title: "Conception produit",
        nature: "produit",
        text: "Partir d’un besoin métier réel et le traduire en parcours, règles fonctionnelles et priorités claires.",
      },
      {
        title: "Sécurisation fonctionnelle",
        nature: "cadre",
        text: "Écrire les invariants et les cas limites avant le code, pour que le comportement des fonctions sensibles soit vérifiable.",
      },
    ],
  },
  {
    title: "L’Ortabels : projet maraîcher et outil d’aide à la décision",
    subtitle: "Modélisation agronomique · en ligne, développement continu",
    bullets: [
      "Planifier des cultures suppose d’anticiper des stades de développement qui dépendent des températures, pas du calendrier : un semis se pilote en degrés-jours cumulés, pas en semaines.",
      "Conception d’un outil exploitant les températures locales, les degrés-jours et les modèles de croissance thermique pour estimer les fenêtres de semis, les stades de développement et les périodes de récolte.",
      "Structuration du projet maraîcher lui-même : planification des cultures, organisation des rotations et suivi des séries.",
    ],
    link: { label: "Découvrir L’Ortabels", url: "https://app.ortabels.fr/" },
    transferableSkills: [
      {
        title: "Modèles prédictifs",
        nature: "produit",
        text: "Transformer une série de données brutes en repères de décision datés et directement utilisables.",
      },
      {
        title: "Architecture de gestion",
        nature: "cadre",
        text: "Même logique qu’un back-office structuré : séquencer, planifier, rendre visible et coordonner.",
      },
    ],
  },
  {
    title: "Renta Menu : pilotage de la rentabilité en restauration",
    subtitle: "Outil décisionnel · Rentabilité en restauration",
    bullets: [
      "Modélisation du coût matière par composante de menu et calcul automatisé des marges brutes.",
      "Détermination des prix de vente par régression (linéaire inverse et logarithmique), à partir du coût et de l’élasticité observée.",
      "Calcul du besoin en effectifs et du coût employeur réel selon le volume de couverts prévisionnel.",
      "Seuil de rentabilité, marge nette par couvert et projections de résultat calculés en continu.",
    ],
    transferableSkills: [
      {
        title: "Ingénierie de la donnée",
        nature: "produit",
        text: "Traduire des flux de données hétérogènes en indicateurs de performance immédiatement actionnables.",
      },
      {
        title: "Optimisation de la rentabilité",
        nature: "produit",
        text: "Identifier les leviers de profitabilité qui sécurisent la marge sans casser le positionnement commercial.",
      },
    ],
  },
];
