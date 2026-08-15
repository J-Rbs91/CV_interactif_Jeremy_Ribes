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
  /* Le recto A4 n'ouvre pas sur le meme registre que l'ecran. `role` et
     `secondaryRole` sont faits pour une colonne d'identite qu'on lit posement,
     avec le CV entier autour ; le papier n'a qu'une ligne pour dire le
     territoire, et elle doit se lire comme une adresse de poste, pas comme une
     presentation. `experience` sort du sous-titre le seul fait qui date le
     profil : quatorze ans, avant que le lecteur n'ait rien lu d'autre. */
  a4: {
    /* La fonction visee, et elle precede les territoires. Le bandeau disait
       tres bien ce que je sais faire et pas une fois quel poste je cherche :
       un lecteur qui trie des candidatures cherche d'abord a ranger le
       dossier quelque part, et quatre domaines de competence ne rangent
       rien. La fonction le fait en trois mots, les domaines disent ensuite
       ce qu'elle recouvre ici.

       Elle n'existe que sur le recto : le site, qu'on lit en entier, se
       presente par ce qu'il demontre. Une feuille lue en trente secondes se
       presente par ce qu'elle vise. */
    targetRole: "Coordinateur performance & organisation",
    /* Quatre territoires, declares separement et non en une chaine. Assemblee,
       la ligne se repliait au milieu de l'un d'eux — on lisait « Pilotage par
       la / donnee ». En items, la coupure ne peut tomber qu'entre deux, ou
       elle se lit.

       Raccourcis depuis que la fonction les surmonte : ils ne portent plus
       l'annonce, ils la qualifient, et quatre syntagmes complets sous un
       intitule en capitales faisaient deux lignes pour une. */
    positioning: [
      "Structuration de l’activité",
      "Process",
      "Outils métiers",
      "Pilotage par la donnée",
    ],
    experience: "14 ans d’expérience en environnement commercial",
  },
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
