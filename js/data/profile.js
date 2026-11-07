/* Le gras crée une deuxième couche de lecture, qu'on le veuille ou non : un
   lecteur en diagonale ne lit qu'elle. Elle doit donc composer un énoncé
   complet quand on ne lit qu'elle — le test est mécanique, on masque tout
   sauf le gras et on relit.
   Il était dispersé sur des fragments (« outils », « procédures », « irritant
   précis ») qui ne formaient aucune phrase : la couche attirait l'attention
   sans rien rendre, et hachait la lecture continue de ceux qui lisent tout.
   Un seul passage fort par bloc, lisible isolément et nettement minoritaire.
   Le texte éditorial reste la source de vérité pour le site et les exports. */
export const profileContent = {
  /* Accroche courte pour le site. La citation complète reste dans le PDF. */
  headline: "De l’optique à l’organisation.",
  quote:
    "Rendre une activité plus lisible et plus facile à piloter, sans l’alourdir.",
  intro:
    "Opticien de formation et ancien responsable de magasin, <strong>j’ai progressivement élargi mon activité à l’organisation et au pilotage</strong> : procédures, suivi des dossiers, plannings, indicateurs et outils métiers. Ce travail, d’abord complémentaire à la vente, est devenu celui que je souhaite exercer à titre principal.",
  cards: [
    {
      title: "Positionnement",
      nature: "cadre",
      text: "Je fais le lien entre la direction, qui fixe les objectifs, et l’équipe, qui vit les contraintes du quotidien. Je traduis les objectifs en méthodes applicables, et je fais remonter à la direction ce que le terrain voit et qu’elle ne voit pas.",
    },
    {
      title: "Méthode",
      nature: "produit",
      text: "<strong>Je pars d’un problème précis</strong> (une ressaisie, un oubli, un calcul refait à la main) et je cherche d’où il vient. <strong>Puis je choisis la réponse</strong> : changer une pratique, nommer un responsable, supprimer une étape ou, si cela ne suffit pas, créer l’outil qui manque. Je n’attends pas qu’on me le demande, et je vérifie dès la première utilisation que la réponse fonctionne.",
    },
  ],
  expertise:
    "<strong>Concevoir les outils et les procédures qui manquent</strong> pour piloter une activité, et supprimer le travail refait à la main.",
  contributionTags: [
    { label: "Procédures écrites", nature: "cadre" },
    { label: "Outils de suivi", nature: "produit" },
    { label: "Tableaux de pilotage", nature: "produit" },
    { label: "Contrôles automatisés", nature: "produit" },
    { label: "Organisation d’équipe", nature: "cadre" },
    { label: "Conduite du changement", nature: "cadre" },
  ],
  target: {
    context: "L’optique est le secteur dans lequel j’ai acquis ma légitimité. C’est aussi celui où les possibilités d’évolution vers les fonctions qui m’intéressent sont limitées dans mon rayon de mobilité.",
    ambition: "<strong>Je veux faire de l’organisation, du pilotage et des outils métiers le cœur de mon prochain poste</strong>, dans l’optique ou dans un autre secteur.",
    roles: [
      "Coordinateur opérationnel ou de performance",
      "Chargé de projet organisation et méthodes",
      "Chef de projet outils métiers",
    ],
    limits: "Je n’ai pas encore occupé ces fonctions sous ces intitulés. Je présente ici les responsabilités effectivement assumées, les résultats auxquels j’ai contribué et les compétences que je pourrais transposer, en apprenant les spécificités d’un nouvel environnement.",
  },
};

/* Contenus propres au recto A4 (js/render/renderCv.js). Ils vivent ici et non
   dans le rendu : le recto choisit ce qu'il montre, il ne redige pas, sans
   quoi une phrase du CV finirait par dire autre chose que la meme phrase du
   site sans que rien ne le signale.

   Ce qui est ici n'existe nulle part ailleurs, et c'est normal : ce sont des
   enonces de synthese que le site n'a pas a faire — il demontre section par
   section, le recto doit trancher. Les trois preuves en sont l'exemple :
   aucune fiche ne les porte, elles se lisent en croisant les statuts des six
   outils et le resultat d'un poste. */
export const a4Content = {
  /* Un paragraphe, et c'est un resserrage assume. Il y en avait deux —
     le deplacement du profil, puis la methode — qui disaient juste et
     tenaient six lignes en tete de page. Le recto doit désormais annoncer
     à la fois la compétence construite sur le terrain et la transition vers
     des fonctions transverses, sans revendiquer un poste déjà exercé.

     Le gras, relu seul, doit toujours former un énoncé intelligible. */
  pitch: [
    "Opticien de formation et ancien responsable de magasin, j’ai <strong>développé des compétences en organisation, pilotage et outils métiers</strong>. Les perspectives locales dans l’optique sont limitées : je vise des fonctions transversales de coordination ou de projet, dans l’optique ou ailleurs.",
  ],
  /* Trois preuves, et trois seulement : impact economique, adoption terrain,
     transferabilite. Elles ne se remplacent pas l'une l'autre — c'est leur
     enchainement qui repond a « ça marche ? », « c'est utilise ? », « ça
     survit a son auteur ? ». Une quatrieme diluerait la premiere, qui est la
     seule a porter un chiffre. */
  proofs: [
    {
      nature: "preuve",
      value: "+83 % CA · +5,6 pts de marge",
      text: "Redynamisation d’un magasin en difficulté.",
      note: "Sur les deux mois qui ont suivi, comparés à la moyenne des seize mois précédents.",
    },
    {
      nature: "produit",
      value: "3 outils en usage quotidien",
      text: "Suivi des devis, Brief’Maker et Hub Outils Opticien, utilisés chaque jour en magasin.",
    },
    /* Deux formulations ecartees avant celle-ci. « Repris hors de leur
       contexte » disait un concept, pas un fait, et se lisait comme un
       intitule de rubrique. « Utilises sans moi » disait le fait, mais sur un
       registre trop familier pour un CV.

       L'ordre des trois cas suit l'intitule : les deux qui parlent
       litteralement d'un depart ouvrent la phrase, celui du brief et du suivi
       — repris par une equipe ou je travaille encore — la ferme. Un titre qui
       generalise doit au moins etre porte par ce qui le suit directement. */
    {
      nature: "produit",
      value: "Maintenus après mon départ",
      text: "Gestionnaire de planning resté en service après mon départ, Opti’Profit transmis à une direction régionale, brief et suivi repris dans une autre enseigne.",
    },
  ],
  /* Un seul bloc de projets transverses dans le recto A4 : L’Ortabels et
     Renta Menu démontrent que la méthode de modélisation et d’aide à la
     décision se transfère hors de l’optique. Leur détail reste accessible
     dans le CV interactif. */
  projects: [
    {
      title: "L’Ortabels · Renta Menu",
      text: "Données métier transformées en outils de décision.",
    },
  ],
  /* Une ligne, et rien de plus. Detaillee, elle ferait basculer le document
     vers un CV de developpeur, alors que le profil est organisation, process
     et outils metiers — l'outil y est un moyen, pas le metier. */
  methods: [
    "Formalisation de process",
    "Analyse de données & modélisation",
    "Google Apps Script",
    "Développement web",
    "Conception fonctionnelle",
    "Automatisation",
  ],
};

export const formationContent = {
  year: "2012",
  title: "BTS Opticien Lunetier",
  subtitle: "Diplôme professionnel · Optique",
  /* Une ligne, avec l'intitule et l'annee devant. Repliee, elle tombait en
     derniere ligne de page, la position la moins sure du document. */
  a4Note:
    "En autodidacte : process, data, automatisation.",
  continuousSkills: [
    {
      title: "Formalisation de process",
      nature: "cadre",
      text: "Procédures de back-office et guides de traitement, priorisés selon le modèle de Kano.",
    },
    {
      title: "Attribution des responsabilités",
      nature: "cadre",
      text: "Nommer qui traite quoi, et pour quand. Une tâche sans responsable n’est traitée par personne : le brief quotidien et le suivi des devis règlent ce problème.",
    },
    {
      title: "Indicateurs avancés & retardés",
      nature: "produit",
      text: "Distinguer les chiffres qui constatent un résultat de ceux sur lesquels on peut encore agir (délais, relances, dossiers à risque). C’est la logique de PANUM.",
    },
    {
      title: "Analyse de données & modélisation",
      nature: "produit",
      text: "Indicateurs causaux (PANUM), modèles de croissance thermique (L’Ortabels), régressions de prix (Renta Menu).",
    },
    {
      title: "Google Apps Script",
      nature: "produit",
      text: "Développement des outils internes présentés en section Outils.",
    },
    {
      title: "Développement web & desktop",
      nature: "produit",
      text: "Hub Outils Opticien, interfaces d’aide à la vente, application de suivi commercial.",
    },
    {
      title: "Mise en production",
      nature: "cadre",
      text: "Environnements, contrôles qualité et déploiements automatisés sur PANUM et L’Ortabels.",
    },
  ],
  quote:
    "J’apprends à partir des problèmes que je rencontre sur le terrain.",
};
