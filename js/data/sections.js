/* Chaque section porte la nature de ce qu'elle démontre : cadre (encre),
   produit (forêt), preuve (flamme). La Formation est en socle — retrait
   assumé, l'argument du dossier n'est pas le diplôme de 2012.

   Ordre revu. Les compétences déclaratives arrivaient avant le parcours,
   c'est-à-dire l'ordre d'un CV qui cherche à faire oublier son historique —
   alors que cet historique est justement ce qui rend les compétences
   crédibles. Le parcours passe en deuxième, les compétences après les preuves
   qui les soutiennent.

   « Cas concret » a disparu : la section racontait le mandat 2024-2025, qui a
   par ailleurs sa propre entrée dans Expériences. Le contenu y est revenu.

   Les sous-titres ne comptent plus (« 5 dispositifs détaillés », « 7 domaines
   clés ») : un décompte invite à juger le volume, pas la valeur. */
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
    sub: "BTS OL 2012 · acquis en autodidacte",
    nature: "socle",
  },
];
