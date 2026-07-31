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
  /* « Cas concret » et non « Réalisations » : au pluriel et sans complément,
     le mot annonçait l'inventaire complet et reléguait de fait tout ce qui
     est conçu et mené ailleurs — Outils, Projets transverses. La section
     n'est pas la somme du travail, c'est UN cas : une prise de poste de
     responsable de magasin redressée en deux mois. Nommer le cas rend leur
     rang aux autres sections. */
  {
    id: "realisations",
    icon: "trending-up",
    label: "Cas concret",
    sub: "Responsable de magasin · 2 mois",
    nature: "preuve",
  },
  {
    id: "outils",
    icon: "wrench",
    label: "Outils",
    sub: "5 dispositifs détaillés",
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
