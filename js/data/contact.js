export const contact = {
  name: "Jérémy Ribes",
  role: "Structuration de l’activité & outils métiers",
  secondaryRole:
    "14 ans en réseau d’optique · Organisation & process · Outils d’aide à la décision · Pilotage par la donnée",
  intro:
    "Professionnel de terrain avec 14 ans d’expérience en environnement commercial, j’ai progressivement orienté mon parcours vers ce qui me mobilise le plus : structurer l’activité, formaliser les procédures et rendre le pilotage possible  en construisant, quand il le fallait, les outils qui manquaient pour le tenir.",
  /* L'adresse du CV en ligne. Elle ne sert à rien à l'écran — on y est déjà —
     mais le recto A4 se détache de son support : imprimé ou versé à un
     dossier, il ne porte plus aucun chemin de retour, et le formulaire de
     contact, qui est le seul moyen de me joindre, reste derrière ce lien.
     Une feuille de papier sans adresse est une impasse.

     Déclarée ici et non dans `js/ui/share.js`, qui la portait en dur : deux
     copies d'une même URL finissent par diverger, et c'est celle du papier
     qu'on oublierait de corriger. */
  site: {
    host: "j-rbs91.github.io/CV_interactif_Jeremy_Ribes",
    url: "https://j-rbs91.github.io/CV_interactif_Jeremy_Ribes/",
  },
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
