/* `id` et `short` — les projets se presentent en onglets (voir
   js/render/renderProjets.js).

   `id` relie l'onglet a son panneau (`aria-controls`, `aria-labelledby`).
   `short` est le libelle de l'onglet : le nom du produit, sans sa
   description.

   Les deux sont declares, jamais derives du `title`. Le titre se decoupe a
   « : » — `getLiveProducts()` le fait deja pour la ligne « Produits en
   ligne » — mais ce decoupage suppose que chaque titre suive la meme forme.
   Le jour ou un titre n'en a plus, l'onglet afficherait une phrase entiere,
   et rien dans le code ne le signalerait. */
export const projetsTransverses = [
  {
    id: "ortabels",
    short: "L’Ortabels",
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
