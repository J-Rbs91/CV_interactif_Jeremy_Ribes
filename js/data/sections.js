/* Ordre de la navigation. Chaque section déclare sa nature — cadre, produit,
   preuve, socle — consommée par natureClass() (cf. css/base.css).

   `short` sert au seul rail étroit. En 390 px, la barre n'affichait que trois
   entrées sur six et les coupait en pleine lettre — on lisait « transverses »
   et « Formatio ». Un libellé tronqué ne se lit pas, et surtout le lecteur ne
   peut plus dénombrer les sections : il ignore l'étendue de ce qui l'attend,
   ce qui est exactement ce qu'une navigation doit dire.
   Le premier mot suffit à distinguer les six, et il est déjà celui que
   porte le titre de section une fois qu'on y est. */
export const sections = [
  {
    id: "profil",
    icon: "user",
    label: "Profil",
    short: "Profil",
    sub: "Positionnement & méthode",
    nature: "cadre",
  },
  {
    id: "experience",
    icon: "clock",
    label: "Expériences",
    short: "Expériences",
    sub: "14 ans en réseau d'optique",
    nature: "cadre",
  },
  {
    id: "outils",
    icon: "wrench",
    label: "Outils",
    short: "Outils",
    sub: "Conçus, déployés, en usage",
    nature: "produit",
  },
  {
    id: "projet",
    icon: "sprout",
    label: "Projets transverses",
    short: "Projets",
    sub: "Conception produit & modélisation",
    nature: "produit",
  },
  {
    id: "competences",
    icon: "check",
    label: "Compétences",
    short: "Compétences",
    sub: "Domaines de prédilection",
    nature: "cadre",
  },
  {
    id: "formation",
    icon: "cap",
    label: "Formation",
    short: "Formation",
    sub: "BTS OL 2012",
    nature: "socle",
  },
];
