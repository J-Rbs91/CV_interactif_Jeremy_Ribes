/* Décision d'ouverture — script classique, bloquant, dans <head>.

   Il ne fait que poser des classes sur <html>, AVANT le premier rendu : c'est
   ce qui évite qu'une page qui ne doit pas jouer l'ouverture clignote d'abord à
   l'état de départ, et qu'une page qui doit la jouer s'affiche d'abord à l'état
   d'arrivée. Le déroulé lui-même est du CSS (css/site.css) ; l'orchestration —
   attendre les polices, lire la fin des animations, libérer le défilement — est
   dans js/ui/site.js.

   Classes posées :
   - `js-actif` : l'application prend le relais, le bloc de texte intégral
     (#cv-integral, destiné aux lecteurs sans JavaScript) s'efface. Voir base.css ;
   - `intro-play` : l'ouverture a lieu. C'est elle qui porte les animations du
     CSS : sans elle (deuxième visite, lien profond, mouvement réduit), la page
     s'affiche directement à son état de repos. Elle n'est jamais retirée ;
   - `intro-wait` : les animations sont en pause, le temps que les polices
     arrivent ;
   - `intro-lock` : le défilement est verrouillé pendant l'ouverture.

   L'ouverture est jouée une fois par session. Elle est ignorée :
   - en `prefers-reduced-motion: reduce` ;
   - si elle a déjà été jouée dans la session ;
   - sur un lien profond vers une section (#outils…) : le lecteur vient pour une
     partie précise du CV, pas pour son ouverture. `#intro` force la relecture.

   Garde-fou : si le module principal ne se charge jamais (réseau coupé), les
   deux classes seraient posées pour toujours et la page resterait verrouillée.
   Elles sont donc retirées d'office au bout de 8 s. */
(function () {
  "use strict";

  var root = document.documentElement;

  root.classList.add("js-actif");

  var hash = "";

  try {
    hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  } catch (error) {
    hash = "";
  }

  var reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var played = false;

  try {
    played = window.sessionStorage.getItem("cv-intro-played") === "1";
  } catch (error) {
    played = false;
  }

  var deepLink = hash !== "" && hash !== "profil" && hash !== "intro";
  var shouldPlay = !reduced && (hash === "intro" || (!played && !deepLink));

  if (!shouldPlay) {
    return;
  }

  root.classList.add("intro-play", "intro-wait", "intro-lock");

  window.setTimeout(function () {
    root.classList.remove("intro-wait", "intro-lock");
  }, 8000);
})();
