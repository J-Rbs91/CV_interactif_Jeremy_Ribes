export const projetsTransverses = [
  {
    title: "KuT : logiciel de gestion pour salons et activités de bien-être",
    subtitle: "Conception produit & pilotage · en ligne, développement continu",
    bullets: [
      "Traduction des besoins d’un salon à prestations récurrentes en parcours, règles métier et fonctionnalités : clients, réservations, planning, fidélité, campagnes commerciales et indicateurs. Module de caisse et exports comptables en cours.",
      "Écriture des règles métier, des cas limites et des plans de tests, pour vérifier de façon fiable le comportement des fonctions sensibles.",
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
        text: "Écrire les règles et les cas limites avant le code, pour pouvoir vérifier ensuite que tout fonctionne comme prévu.",
      },
    ],
  },
  {
    title: "L’Ortabels : projet maraîcher et outil d’aide à la décision",
    subtitle: "Modélisation agronomique · en ligne, développement continu",
    bullets: [
      "Le développement d’une culture dépend de la chaleur accumulée (les degrés-jours), et non du nombre de semaines écoulées. Le calendrier seul ne suffit donc pas pour planifier.",
      "Conception d’un outil exploitant les températures locales, les degrés-jours et les modèles de croissance thermique pour estimer les fenêtres de semis, les stades de développement et les périodes de récolte.",
      "Structuration du projet maraîcher lui-même : planification des cultures, organisation des rotations et suivi des séries.",
    ],
    link: { label: "Découvrir L’Ortabels", url: "https://app.ortabels.fr/" },
    transferableSkills: [
      {
        title: "Modèles prédictifs",
        nature: "produit",
        text: "Transformer des données brutes en dates concrètes pour décider quand semer et quand récolter.",
      },
      {
        title: "Organisation",
        nature: "cadre",
        text: "La même logique qu’un back-office bien organisé : planifier les étapes et rendre visible ce qui doit être fait.",
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
        title: "Analyse de données",
        nature: "produit",
        text: "Rassembler des données de sources différentes pour en tirer des indicateurs utilisables tout de suite.",
      },
      {
        title: "Rentabilité",
        nature: "produit",
        text: "Trouver comment protéger la marge sans changer le positionnement de l’établissement.",
      },
    ],
  },
];
