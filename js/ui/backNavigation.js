/* Contrat de navigation arriere — ce que fait le geste retour.

   Le bouton retour d'Android, le bouton du navigateur et le glissement
   lateral d'iOS rejouent tous la meme chose : la pile d'historique, c'est-a-
   dire la chronologie des visites a l'envers. Personne ne se represente un
   document comme une chronologie. On se le represente comme un arbre, et
   « retour » veut dire remonter d'un niveau.

   Un seul invariant tient tout :

       la pile d'historique est toujours le chemin de la racine a l'ecran
       courant.

   Sous cet invariant, le geste retour remonte l'arbre de lui-meme, sans une
   ligne d'interception — et c'est important : intercepter le retour casserait
   le glissement lateral d'iOS, qui est un geste continu et reversible, et
   entrerait en concurrence avec les gestes systeme d'Android.

   Ce CV a deux natures de noeuds, et c'est tout :

   - Les six sections sont des FRERES a la racine. Un frere ne consomme aucune
     profondeur : passer de Profil a Outils REMPLACE l'entree courante. On sort
     donc du document en un appui, qu'on ait parcouru une section ou les six.
     L'adresse est mise a jour au passage, ce qui rend un rechargement et un
     lien partage fideles a ce qui est affiche.

   - Les couches — panneau d'export, modale de contact — sont posees par-dessus
     l'arbre. Elles EMPILENT une entree a l'ouverture, et la consomment a la
     fermeture. Sans cela, le geste retour quittait le CV au lieu de refermer
     le panneau, ce qui est le defaut le plus courant et le moins visible : il
     ne se constate pas sur un ordinateur, ou personne n'appuie sur retour.

   Toutes les fermetures — bouton, Echap, clic sur le fond, geste systeme —
   passent par le meme chemin. C'est la seule facon que le retour de
   l'interface et celui du systeme aboutissent au meme endroit.

   La procedure de verification est dans docs/navigation-retour.md : elle se
   fait sur un telephone, parce qu'un geste retour ne se lit pas dans du code. */

const MARQUE = "cvCouche";

const pile = [];
let aIgnorer = 0;

/* Une traversee d'historique ne leve qu'un seul `popstate`, quelle que soit sa
   profondeur : on n'en ignore donc qu'un par appel, pas un par entree. */
function traverser(entrees) {
  if (!entrees) {
    return;
  }

  aIgnorer += 1;

  try {
    window.history.go(-entrees);
  } catch (error) {
    aIgnorer -= 1;
  }
}

window.addEventListener("popstate", () => {
  if (aIgnorer > 0) {
    aIgnorer -= 1;
    return;
  }

  const couche = pile.pop();

  if (couche) {
    couche.fermer();
  }
});

/* Rechargement pendant qu'une couche etait ouverte : l'entree empilee survit,
   la couche non. Sans ce rattrapage, le premier appui sur retour tomberait
   dans le vide — et un appui qui ne fait rien se lit comme une page bloquee. */
if (window.history.state?.[MARQUE]) {
  try {
    window.history.back();
  } catch (error) {
    /* historique indisponible : rien a rattraper */
  }
}

/* `fermer` est la fonction qui remet reellement l'interface en etat. Elle
   n'est jamais appelee directement ailleurs : c'est la pile qui l'appelle. */
export function ouvrirCouche(nom, fermer) {
  let empile = false;

  try {
    window.history.pushState({ [MARQUE]: nom }, "");
    empile = true;
  } catch (error) {
    empile = false;
  }

  pile.push({ nom, fermer, empile });
}

/* Fermeture demandee par l'interface. On ferme d'abord — l'ordre des
   operations reste celui d'avant l'historique — puis on consomme l'entree
   empilee. Sans entree empilee, parce que pushState a ete refuse, on ferme
   quand meme : mieux vaut une couche sans historique qu'une couche captive. */
export function fermerCouche() {
  const couche = pile.pop();

  if (!couche) {
    return false;
  }

  couche.fermer();
  traverser(couche.empile ? 1 : 0);
  return true;
}

export function coucheOuverte() {
  return pile.length > 0;
}

/* Une section n'est pas une profondeur : on remplace l'entree courante au lieu
   d'en ajouter une. Le nombre d'appuis sur retour pour sortir ne depend donc
   pas du nombre de sections consultees, ce qui est exactement ce qu'on cherche
   a garantir.

   L'adresse est mise a jour au passage. Ce n'est pas un ornement : c'est ce
   qui fait qu'un rechargement, un partage de lien ou une reprise d'onglet
   retrouvent la section affichee au lieu de renvoyer en tete. */
export function poserSection(sectionId) {
  if (!sectionId) {
    return;
  }

  try {
    window.history.replaceState(window.history.state, "", `#${sectionId}`);
  } catch (error) {
    /* adresse non modifiable (page ouverte depuis le disque, par exemple) :
       la navigation reste correcte, seule l'adresse cesse d'etre fidele */
  }
}

/* Section demandee par l'adresse, si elle existe. Un fragment inconnu — lien
   tronque, ancre d'une ancienne version — ne doit pas produire un ecran vide :
   on retombe sur la section par defaut. */
export function sectionDeLAdresse(sectionsConnues) {
  const fragment = decodeURIComponent(window.location.hash.replace(/^#/, ""));

  return sectionsConnues.includes(fragment) ? fragment : null;
}
