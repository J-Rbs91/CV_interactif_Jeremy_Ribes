/* Le gras crée une deuxième couche de lecture, qu'on le veuille ou non : un
   lecteur en diagonale ne lit qu'elle. Elle doit donc composer un énoncé
   complet quand on ne lit qu'elle — le test est mécanique, on masque tout
   sauf le gras et on relit.
   Il était dispersé sur des fragments (« outils », « procédures », « irritant
   précis ») qui ne formaient aucune phrase : la couche attirait l'attention
   sans rien rendre, et hachait la lecture continue de ceux qui lisent tout.
   Un passage par bloc, et il se suffit. Aucun texte métier n'a changé :
   seules les bornes du gras ont bougé.

   Un passage, pas deux, et c'est une contrainte de proportion autant que de
   sens : un premier réglage tenait la phrase mais mettait 40 à 47 % du bloc
   en gras. Une seconde couche qui couvre la moitié de la première ne
   hiérarchise plus rien — elle rend seulement le bloc entier plus lourd.
   Sous 30 %, le gras redevient un relief. */
export const profileContent = {
  quote:
    "« Rendre une activité plus lisible et plus pilotable, sans l’alourdir. »",
  intro:
    "J’ai <strong>déplacé ma valeur du face à face client vers l’organisation de l’activité</strong> : procédures, suivi des dossiers, plannings, accompagnement et repères de pilotage. Ce qui était une part annexe de mon travail est devenu un levier de développement, et j’ai construit les outils qui manquaient pour le tenir.",
  cards: [
    {
      title: "Positionnement",
      nature: "cadre",
      text: "Je fais l’interface entre une direction qui porte des objectifs et une équipe qui vit les contraintes d’exécution. Traduire l’objectif en méthode acceptable, et faire remonter ce que le terrain sait et que le pilotage ignore.",
    },
    {
      title: "Méthode",
      nature: "produit",
      text: "<strong>Je pars d’un irritant précis</strong> (une ressaisie, un oubli, un calcul refait à la main), je cherche ce qui le produit, <strong>puis je tranche</strong> : une pratique à changer, une responsabilité à nommer, une étape à supprimer et, quand rien de tout cela ne suffit, le support qui manquait. La réponse se vérifie au premier usage, et sans attendre qu’on me la demande.",
    },
  ],
  expertise:
    "<strong>Concevoir les outils et les procédures qui manquent</strong> à une activité pour être pilotée : ce qu’il faut décider, ce qu’il faut suivre, et ce qu’il faut cesser de refaire à la main.",
  contributionTags: [
    { label: "Procédures écrites", nature: "cadre" },
    { label: "Outils de suivi", nature: "produit" },
    { label: "Tableaux de pilotage", nature: "produit" },
    { label: "Contrôles automatisés", nature: "produit" },
    { label: "Organisation d’équipe", nature: "cadre" },
    { label: "Conduite du changement", nature: "cadre" },
  ],
  target:
    "<strong>Un rôle transverse dédié à la structuration de l’activité</strong> : formaliser les process, outiller le suivi et rendre le pilotage possible. Je me positionne sur les fonctions organisation, process et outils métiers, au sein d’un réseau commercial ou de service client, ou dans un environnement en croissance soumis à de fortes contraintes opérationnelles.",
};

export const formationContent = {
  year: "2012",
  title: "BTS Opticien Lunetier",
  subtitle: "Diplôme professionnel · Optique",
  continuousSkills: [
    {
      title: "Formalisation de process",
      nature: "cadre",
      text: "Procédures de back-office et guides de traitement, priorisés selon une logique inspirée du modèle de Kano : sécuriser d’abord ce qui crée de l’insatisfaction quand c’est absent.",
    },
    {
      title: "Attribution des responsabilités",
      nature: "cadre",
      text: "Nommer qui traite quoi, et à quelle échéance. Une tâche partagée sans responsable identifié n’est traitée par personne c’est ce que règlent le brief quotidien et le suivi des devis.",
    },
    {
      title: "Indicateurs avancés & retardés",
      nature: "produit",
      text: "Séparer ce qui constate un résultat déjà joué de ce sur quoi on peut encore agir : délais de traitement, discipline de relance, dossiers à risque, causes de perte. C’est la logique qui structure PANUM.",
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
      text: "Hub d’outils magasin, interfaces d’aide à la vente, application de suivi commercial.",
    },
    {
      title: "Mise en production",
      nature: "cadre",
      text: "Environnements, contrôles qualité et déploiements automatisés sur KuT, PANUM et L’Ortabels.",
    },
  ],
  quote:
    "« Mon apprentissage est continu et orienté vers des problèmes concrets du terrain. »",
};
