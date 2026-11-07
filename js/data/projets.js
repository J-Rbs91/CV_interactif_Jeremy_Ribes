/* `id` conserve une identité stable pour chaque projet ; `short` est
   le libellé court affiché dans le registre de la page. Les détails
   proviennent de ces données, également utilisées pour l'export complet.
   `liveProduct: false` évite de doubler dans le pied de page un lien
   déjà présent parmi les outils. */
export const projetsTransverses = [
  {
    id: "hub-opticien",
    short: "Hub optique",
    title: "Hub Outils Opticien : les tâches du magasin réunies dans une interface",
    subtitle: "Conception d’outil métier · en usage quotidien en magasin",
    bullets: [
      "Réunion des tâches courtes et répétées d’un magasin d’optique dans une seule application web : documents pour les médecins, clôture de caisse et calculs d’épaisseur et de décentrement des verres.",
      "Paramétrage unique des informations du magasin, documents standardisés, contrôle des écarts de caisse et calculs reproductibles pour limiter les ressaisies.",
      "L’équipe utilise ces outils chaque jour en magasin. Une interface commune permet d’y accéder sans multiplier les fichiers.",
    ],
    /* Déjà présent dans les Outils : éviter un doublon dans « Produits en ligne ». */
    liveProduct: false,
    link: {
      label: "Découvrir le Hub Outils Opticien",
      url: "https://j-rbs91.github.io/Hub_Tools_N_Templates/",
    },
    transferableSkills: [
      {
        title: "Conception produit",
        nature: "produit",
        text: "Regrouper des tâches différentes dans une application adaptée aux usages du magasin.",
      },
      {
        title: "Fiabilisation des pratiques",
        nature: "cadre",
        text: "Utiliser les mêmes modèles de documents et les mêmes calculs dans toute l’équipe.",
      },
    ],
  },
  {
    id: "ortabels",
    short: "L’Ortabels",
    title: "L’Ortabels : projet maraîcher et outil d’aide à la décision",
    subtitle: "Modélisation agronomique · en ligne, développement continu",
    bullets: [
      "Pour planifier les cultures, je prends en compte les températures accumulées (degrés-jours), qui influencent les dates de développement et de récolte.",
      "Conception d’un outil exploitant les températures locales, les degrés-jours et les modèles de croissance thermique pour estimer les fenêtres de semis, les stades de développement et les périodes de récolte.",
      "Structuration du projet maraîcher lui-même : planification des cultures, organisation des rotations et suivi des séries.",
    ],
    link: { label: "Découvrir L’Ortabels", url: "https://app.ortabels.fr/" },
    transferableSkills: [
      {
        title: "Modèles prédictifs",
        nature: "produit",
        text: "Estimer les périodes de semis et de récolte à partir des températures locales.",
      },
      {
        title: "Organisation",
        nature: "cadre",
        text: "Organiser les rotations, les séries et les différentes étapes des cultures.",
      },
    ],
  },
  {
    id: "renta-menu",
    short: "Renta Menu",
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
        text: "Rapprocher coûts, prix et volumes pour calculer les marges et le seuil de rentabilité.",
      },
      {
        title: "Rentabilité",
        nature: "produit",
        text: "Mesurer les effets du prix de vente, du coût matière et des effectifs sur la marge.",
      },
    ],
  },
];
