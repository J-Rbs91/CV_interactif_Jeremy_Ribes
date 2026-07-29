/* Chaque section porte la nature de ce qu'elle démontre.
   Profil = graphite (l'identité, la voix), Formation = socle (le prérequis,
   volontairement en retrait : l'argument n'est pas le diplôme de 2012). */
export const sections = [
  {
    id: "profil",
    icon: "user",
    label: "Profil",
    sub: "Positionnement & méthode",
    nature: "graphite",
  },
  {
    id: "competences",
    icon: "check",
    label: "Compétences",
    sub: "7 domaines clés",
    nature: "structure",
  },
  {
    id: "realisations",
    icon: "trending-up",
    label: "Réalisations",
    sub: "+83% CA · +5,6 pts marge",
    nature: "performance",
  },
  {
    id: "outils",
    icon: "wrench",
    label: "Outils",
    sub: "4 dispositifs détaillés",
    nature: "decision",
  },
  {
    id: "experience",
    icon: "clock",
    label: "Expériences",
    sub: "13 ans · 3 expériences",
    nature: "coordination",
  },
  {
    id: "projet",
    icon: "sprout",
    label: "Projets transverses",
    sub: "3 projets détaillés",
    nature: "exploration",
  },
  {
    id: "formation",
    icon: "cap",
    label: "Formation",
    sub: "BTS OL — 2012",
    nature: "socle",
  },
];

/* Bandeau de preuve du panneau gauche. « 13 ans » est un fait (graphite),
   les deux deltas sont le résultat mesuré (émeraude, règle de rareté). */
export const kpiItems = [
  { value: "13", label: "Ans terrain", nature: "graphite" },
  { value: "+83%", label: "CA", nature: "performance" },
  { value: "+5,6", label: "Pts marge", nature: "performance" },
];
