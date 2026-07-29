/* Chaque section porte la nature de ce qu'elle démontre.
   Profil = graphite (l'identité, la voix), Formation = socle (le prérequis,
   volontairement en retrait : l'argument n'est pas le diplôme de 2012). */
export const sections = [
  {
    id: "profil",
    icon: "👤",
    label: "Profil",
    sub: "Positionnement & méthode",
    nature: "graphite",
  },
  {
    id: "competences",
    icon: "✔",
    label: "Compétences",
    sub: "7 domaines clés",
    nature: "structure",
  },
  {
    id: "realisations",
    icon: "📈",
    label: "Réalisations",
    sub: "+83% CA · +5,6 pts marge",
    nature: "performance",
  },
  {
    id: "outils",
    icon: "🛠️",
    label: "Outils",
    sub: "4 dispositifs détaillés",
    nature: "decision",
  },
  {
    id: "experience",
    icon: "🕒",
    label: "Expériences",
    sub: "13 ans · 3 expériences",
    nature: "coordination",
  },
  {
    id: "projet",
    icon: "🌱",
    label: "Projets transverses",
    sub: "3 projets détaillés",
    nature: "exploration",
  },
  {
    id: "formation",
    icon: "🎓",
    label: "Formation",
    sub: "BTS OL — 2012",
    nature: "socle",
  },
];

export const kpiItems = [
  { value: "13", label: "Ans terrain" },
  { value: "+83%", label: "CA" },
  { value: "+5,6", label: "Pts marge" },
];
