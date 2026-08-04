/* Ordre de la navigation. Chaque section déclare sa nature — cadre, produit,
   preuve, socle — consommée par natureClass() (cf. css/base.css). */
export const sections = [
  {
    id: "profil",
    icon: "user",
    label: "Profil",
    sub: "Positionnement & méthode",
    nature: "cadre",
  },
  {
    id: "experience",
    icon: "clock",
    label: "Expériences",
    sub: "14 ans en réseau d'optique",
    nature: "cadre",
  },
  {
    id: "outils",
    icon: "wrench",
    label: "Outils",
    sub: "Conçus, déployés, en usage",
    nature: "produit",
  },
  {
    id: "projet",
    icon: "sprout",
    label: "Projets transverses",
    sub: "Conception produit & modélisation",
    nature: "produit",
  },
  {
    id: "competences",
    icon: "check",
    label: "Compétences",
    sub: "Domaines d'intervention",
    nature: "cadre",
  },
  {
    id: "formation",
    icon: "cap",
    label: "Formation",
    sub: "BTS OL 2012",
    nature: "socle",
  },
];
