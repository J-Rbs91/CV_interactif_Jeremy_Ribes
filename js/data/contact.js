export const contact = {
  name: "Jérémy Ribes",
  role: "Structuration de l’activité & outils métiers",
  secondaryRole:
    "14 ans en réseau d’optique · Organisation & process · Outils d’aide à la décision · Pilotage par la donnée",
  intro:
    "Professionnel de terrain avec 14 ans d’expérience en environnement commercial, j’ai progressivement orienté mon parcours vers ce qui me mobilise le plus : concevoir des outils concrets pour fiabiliser les décisions, structurer l’activité et fluidifier le travail au quotidien.",
  /* Le portrait accompagne le nom, à l'écran comme sur le papier : il est
     déclaré ici, avec le reste de l'identité, plutôt que dans chacune des
     vues qui l'affichent. `width` et `height` sont ceux du fichier — ils
     réservent la place avant le chargement, le CSS impose la taille rendue. */
  portrait: {
    src: "./assets/img/portrait/me.jpg",
    width: 405,
    height: 405,
  },
  items: [
    { icon: "pin", text: "Montferrier-sur-Lez (34)" },
    { icon: "mail", text: "Me contacter", type: "contact-form" },
  ],
};
