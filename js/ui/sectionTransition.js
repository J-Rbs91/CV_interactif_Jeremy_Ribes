import { sections } from "../data/sections.js";

/* Le passage d'une section a l'autre.

   C'est le seul geste du CV qui remplace l'ecran entier. Jusqu'ici le
   remplacement etait sec — l'ancien contenu disparaissait a l'image pres,
   le nouveau montait en escalier —, et il manquait la moitie de la phrase :
   on voyait arriver sans avoir vu partir, donc sans savoir d'ou l'on
   venait ni dans quel sens on s'etait deplace dans le sommaire.

   La duree se decide a la frequence de l'action, pas au gout. Consulter un
   CV, c'est six clics de navigation dans une visite : une action
   occasionnelle, pour laquelle la fourchette tenable est de 250 a 400 ms.
   On s'y tient, en deux temps qui ne se recouvrent pas — 130 ms pour
   partir, 240 ms pour arriver — parce que le DOM est reconstruit entre les
   deux. Le premier ecran est lisible a 370 ms, le dernier bloc a poser
   arrive avant la demi-seconde.

   Le mouvement porte une orientation et rien de plus : on sort du cote ou
   l'on va, on entre du cote d'ou l'on vient. Cette direction se lit dans
   l'ordre du sommaire, pas dans la geometrie de l'ecran. Deux proprietes
   seulement sont animees, `opacity` et `transform`, celles qui ne
   redemandent pas de calcul de mise en page.

   Ce qu'on s'interdit ici : le zoom, la rotation, le flou, le rebond, le
   glissement horizontal en plein ecran. Ces effets se justifient sur une
   page de vitrine, ou le mouvement fait partie du message. Un CV n'a pas
   ce mandat : celui qui le consulte cherche une information, et tout ce
   qui la retarde joue contre le document. */

/* Le nom de l'animation de sortie, tel qu'il est ecrit dans css/base.css.
   `animationend` remonte aussi depuis les enfants — il faut pouvoir
   distinguer celle-ci de l'ouverture d'un accordeon. */
const leaveAnimationName = "bloc-sort";

/* Un filet, pas une horloge. La fin de la sortie est lue sur l'evenement
   qui l'annonce ; ce delai ne sert qu'aux cas ou cet evenement ne viendra
   jamais — onglet passe en arriere-plan pendant que le navigateur gele les
   animations, moteur qui refuse la keyframe. S'il se declenche, c'est que
   plus personne ne regarde.

   La marge s'ajoute a la duree lue sur l'element, jamais a une duree
   recopiee ici : une constante figee redeviendrait un piege des que
   `--t-section-leave` changerait dans css/base.css — c'est ce couplage,
   observe en ralenti, qui coupait la sortie a mi-parcours. */
const sectionLeaveFallbackMargin = 300;

/* `animation-duration` peut lister plusieurs valeurs ; seule la premiere
   nous concerne, l'element ne porte qu'une animation a la sortie. */
function readAnimationDurationMs(element) {
  if (!element) {
    return 0;
  }

  const [declared = "0s"] = getComputedStyle(element).animationDuration.split(",");
  const value = parseFloat(declared);

  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return declared.trim().endsWith("ms") ? value : value * 1000;
}

/* Au-dela de ce rang, les blocs entrent ensemble. L'escalier donne un
   ordre de lecture sur les premiers ; passe le cinquieme, il ne donne plus
   qu'une attente — l'oeil a fini de descendre avant que le dernier soit
   la. Le raccord d'intro, lui, a le droit d'aller plus loin : on ne le
   voit qu'une fois. */
const sectionEntryStaggerCap = 5;
const firstEntryStaggerCap = 8;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* Le sens du deplacement se lit dans le sommaire : descendre la liste
   renvoie +1, la remonter -1. Une section inconnue, ou un retour sur
   celle qu'on affiche deja, retombe sur +1 — la valeur neutre, celle de
   la premiere entree. */
export function resolveSectionDirection(fromSectionId, toSectionId) {
  const fromIndex = sections.findIndex(({ id }) => id === fromSectionId);
  const toIndex = sections.findIndex(({ id }) => id === toSectionId);

  if (fromIndex < 0 || toIndex < 0 || toIndex >= fromIndex) {
    return 1;
  }

  return -1;
}

/* Pose sur `#app`, qui survit au rendu : `render()` remplace ses enfants,
   jamais l'element lui-meme, donc la direction reste lisible par les
   blocs qui viennent d'etre construits. */
export function setSectionDirection(direction) {
  const appElement = document.getElementById("app");

  appElement?.style.setProperty("--section-dir", String(direction));
}

/* Le rendu ne peut pas etre commande par un minuteur lance au clic. Entre
   l'appui et la premiere image de l'animation, le navigateur recalcule les
   styles : une quarantaine de millisecondes pendant lesquelles le compte a
   rebours tourne dans le vide. Mesure sur Chromium, la sortie etait coupee
   a mi-parcours — l'ecran partant disparaissait encore visible a 40 %, et
   c'est exactement la substitution seche qu'on voulait supprimer.

   On lit donc la fin reelle de l'animation. Renvoie de quoi l'annuler :
   un re-rendu peut survenir avant l'echeance, et l'ecouteur poserait alors
   une seconde section par-dessus la premiere. */
export function playSectionLeave(onLeaveComplete) {
  const contentHead = document.querySelector(".content-head");
  const contentBody = document.querySelector(".content-body");

  contentHead?.classList.add("is-leaving");
  contentBody?.classList.add("is-leaving");

  let hasSettled = false;
  let fallbackTimeoutId = 0;

  const settle = (shouldNotify) => {
    if (hasSettled) {
      return;
    }

    hasSettled = true;
    window.clearTimeout(fallbackTimeoutId);
    contentBody?.removeEventListener("animationend", handleAnimationEnd);

    if (shouldNotify) {
      onLeaveComplete();
    }
  };

  function handleAnimationEnd(event) {
    if (
      event.target === contentBody &&
      event.animationName === leaveAnimationName
    ) {
      settle(true);
    }
  }

  contentBody?.addEventListener("animationend", handleAnimationEnd);

  /* Une duree nulle veut dire qu'il n'y a rien a attendre : contenu absent,
     keyframe desactivee, mouvement reduit. Le filet se resserre alors a la
     boucle suivante plutot que de laisser un ecran immobile. */
  const leaveDuration = readAnimationDurationMs(contentBody);

  fallbackTimeoutId = window.setTimeout(
    () => settle(true),
    leaveDuration > 0 ? leaveDuration + sectionLeaveFallbackMargin : 0,
  );

  return () => settle(false);
}

export function playSectionEntry({ isFirstEntry = false } = {}) {
  const contentHead = document.querySelector(".content-head");
  const contentBody = document.querySelector(".content-body");
  const staggerCap = isFirstEntry ? firstEntryStaggerCap : sectionEntryStaggerCap;

  if (contentHead) {
    contentHead.classList.add("is-entering");

    if (isFirstEntry) {
      contentHead.classList.add("is-entering-first");
    }
  }

  if (!contentBody) {
    return;
  }

  Array.from(contentBody.children).forEach((block, index) => {
    block.style.setProperty("--i", String(Math.min(index, staggerCap)));
  });

  contentBody.classList.add("is-entering");

  if (isFirstEntry) {
    contentBody.classList.add("is-entering-first");
  }
}
