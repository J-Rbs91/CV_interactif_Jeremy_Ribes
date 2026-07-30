/* Chaque section porte la nature de ce qu'elle démontre : cadre (encre),
   produit (forêt), preuve (flamme). La Formation est en socle — retrait
   assumé, l'argument du dossier n'est pas le diplôme de 2012. */
export const sections = [
  {
    id: "profil",
    icon: "user",
    label: "Profil",
    sub: "Positionnement & méthode",
    nature: "cadre",
  },
  {
    id: "competences",
    icon: "check",
    label: "Compétences",
    sub: "7 domaines clés",
    nature: "cadre",
  },
  {
    id: "realisations",
    icon: "trending-up",
    label: "Réalisations",
    sub: "+83% CA · +5,6 pts marge",
    nature: "preuve",
  },
  {
    id: "outils",
    icon: "wrench",
    label: "Outils",
    sub: "4 dispositifs détaillés",
    nature: "produit",
  },
  {
    id: "experience",
    icon: "clock",
    label: "Expériences",
    sub: "14 ans · 3 expériences",
    nature: "cadre",
  },
  {
    id: "projet",
    icon: "sprout",
    label: "Projets transverses",
    sub: "3 projets détaillés",
    nature: "produit",
  },
  {
    id: "formation",
    icon: "cap",
    label: "Formation",
    sub: "BTS OL — 2012",
    nature: "socle",
  },
];

/* Bandeau de preuve du panneau gauche. « 14 ans » est un fait (encre) ;
   les deux deltas sont mesurés, donc en flamme — règle de rareté. */
export const kpiItems = [
  { value: "14", label: "Ans terrain", nature: "cadre" },
  { value: "+83%", label: "CA", nature: "preuve" },
  { value: "+5,6", label: "Pts marge", nature: "preuve" },
];
