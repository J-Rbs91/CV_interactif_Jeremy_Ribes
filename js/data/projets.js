export const projetsTransverses = [
  {
    title: "Hub Outils Opticien : plusieurs outils de magasin, un seul point d’entrée",
    subtitle: "Conception produit & pilotage · en ligne, utilisé en magasin",
    bullets: [
      "Regroupement des tâches courtes et répétées d’un magasin d’optique en un seul site : demande au médecin avec export PDF, clôture de caisse avec contrôle de l’écart, calcul d’épaisseur des verres avec vue 3D.",
      "Coordonnées du magasin saisies une seule fois et reprises par tous les outils. Aucun serveur, aucune donnée patient transmise : tout reste sur le poste. Déployable dans un autre magasin sans toucher au code.",
      "Choix assumé de ne pas ouvrir un outil terminé, la campagne e-mail : écrire à des clients engage la responsabilité du magasin. Les règles à réunir avant l’ouverture sont documentées.",
    ],
    link: { label: "Découvrir le hub", url: "https://j-rbs91.github.io/Hub_Tools_N_Templates/" },
    transferableSkills: [
      {
        title: "Conception produit",
        nature: "produit",
        text: "Partir des tâches réelles d’un magasin et les regrouper en outils que l’équipe utilise sans formation.",
      },
      {
        title: "Sécurisation fonctionnelle",
        nature: "cadre",
        text: "Fixer ce que l’outil ne fait pas (données patient, envoi commercial) avant de décider ce qu’il fait.",
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
