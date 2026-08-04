/* Orchestration de la landing animée.
   Script classique chargé de façon bloquante dans <head> : la décision de
   jouer ou non la séquence doit être prise avant le premier rendu pour
   éviter tout clignotement. Le déroulé visuel reste porté par css/intro.css,
   ce fichier ne gère que l'armement, le skip, les compteurs, le raccord
   final et le retrait.

   Le raccord est la seule partie du déroulé qui ne peut pas être écrite en
   CSS : il faut mesurer, à l'exécution, la boîte du nom telle que la caméra
   l'affiche et celle du h1 du CV, puis interpoler de l'une à l'autre. Tout
   ce qui pouvait rester déclaratif l'est resté dans css/intro.css. */
(function () {
  "use strict";

  var STORAGE_KEY = "cv-intro-played";
  var TOTAL_DURATION = 9100;
  var COUNTER_START = 3700;
  var COUNTER_DURATION = 900;
  var FADE_OUT_DURATION = 420;
  var FONT_WAIT_LIMIT = 1200;

  /* Le raccord part a l'instant ou le fondu partait : la pause finale de
     1,5 s a deja fait son travail, les trois enonces ont ete vus alignes.
     Il dure un peu plus que ce fondu (780 ms contre 450), parce qu'un
     deplacement doit se lire alors qu'une disparition peut etre brusque.
     La camera, elle, n'est pas touchee : de 78,57 % a 100 % elle est
     pratiquement immobile et son etat final se prolonge tout seul. */
  var HANDOFF_START = 8650;
  var HANDOFF_DURATION = 780;
  var APP_RISE_DURATION = 720;

  var root = document.documentElement;
  var timers = [];
  var hasFinished = false;
  var hasRaisedApp = false;
  /* Le raccord en cours, s'il y en a un : { ghost, travel }. Il faut pouvoir
     l'interrompre — voir cancelHandoff. */
  var handoff = null;
  var keydownHandler = null;

  function readSessionFlag() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function writeSessionFlag() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (error) {
      /* stockage indisponible : la séquence pourra se rejouer, sans impact */
    }
  }

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function shouldPlay() {
    if (window.location.hash === "#intro") {
      return true;
    }

    return !prefersReducedMotion() && !readSessionFlag();
  }

  if (!shouldPlay()) {
    return;
  }

  root.classList.add("intro-armed", "intro-lock");
  writeSessionFlag();

  function clearTimers() {
    for (var index = 0; index < timers.length; index += 1) {
      window.clearTimeout(timers[index]);
    }

    timers.length = 0;
  }

  function schedule(callback, delay) {
    timers.push(window.setTimeout(callback, delay));
  }

  function removeOverlay(overlay) {
    root.classList.remove("intro-armed", "intro-lock", "intro-handoff");

    /* L'ecouteur vivait aussi longtemps que la page : la sequence finie, il
       continuait d'intercepter Echap, Entree et Espace pour ne rien en
       faire. Il part avec ce qu'il servait. */
    if (keydownHandler) {
      document.removeEventListener("keydown", keydownHandler);
      keydownHandler = null;
    }

    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  /* Retire le sosie et rend sa place au h1 du CV.

     Appelee a l'arrivee du voyage, mais aussi quand on sort en cours de
     raccord : sans cela, « Passer » clique entre 8,65 s et 9,43 s retirait
     l'overlay — donc la classe `intro-handoff`, donc l'effacement du h1 —
     pendant que le sosie continuait sa course. Le nom s'affichait deux fois,
     a deux endroits, pendant un tiers de seconde. */
  function cancelHandoff() {
    if (!handoff) {
      return;
    }

    var current = handoff;

    handoff = null;
    root.classList.remove("intro-handoff");

    if (current.travel && typeof current.travel.cancel === "function") {
      try {
        current.travel.cancel();
      } catch (error) {
        /* animation deja terminee : rien a interrompre */
      }
    }

    if (current.ghost && current.ghost.parentNode) {
      current.ghost.parentNode.removeChild(current.ghost);
    }
  }

  /* Le CV monte au moment ou la sequence le decouvre, au lieu d'apparaitre
     tel quel derriere un fondu. C'est la moitie du raccord : meme si le
     nom ne peut pas voyager, ce mouvement-la relie les deux plans. */
  function raiseApp() {
    if (hasRaisedApp) {
      return;
    }

    hasRaisedApp = true;

    /* Le signal attendu par js/main.js : l'entree en escalier des blocs se
       joue maintenant, au moment ou le CV se decouvre, et non a l'analyse du
       document — ou elle se serait deroulee derriere l'overlay. */
    document.dispatchEvent(new CustomEvent("cv:intro-raccord"));

    var app = document.getElementById("app");

    if (!app) {
      return;
    }

    app.classList.add("is-entering");

    /* La classe doit repartir : son animation est en `backwards`, mais la
       laisser en place ferait rejouer la montee a chaque re-rendu du CV. */
    window.setTimeout(function () {
      app.classList.remove("is-entering");
    }, APP_RISE_DURATION + 120);
  }

  /* La boite du texte, pas celle de l'element. Le h1 du CV est un bloc :
     sa boite fait toute la largeur de la colonne, soit plus du double du
     nom qu'elle contient. Prendre cette largeur comme cible faisait
     atterrir le nom a plus de deux fois sa taille reelle. Un Range sur le
     contenu donne la boite du texte lui-meme, et les deux cotes sont
     mesures de la meme facon — les demi-interlignes se compensent.

     La premiere ligne, et non l'union : si le texte se replie, l'union
     donne la largeur de la ligne la plus longue et la hauteur de toutes,
     ce qui ne decrit plus aucune boite reelle. Le sosie, lui, tient
     toujours sur une ligne. */
  function measureText(element) {
    if (typeof document.createRange === "function") {
      var range = document.createRange();

      range.selectNodeContents(element);

      var rects =
        typeof range.getClientRects === "function" ? range.getClientRects() : null;

      if (rects && rects.length && rects[0].width) {
        return rects[0];
      }

      var rect = range.getBoundingClientRect();

      if (rect && rect.width) {
        return rect;
      }
    }

    return element.getBoundingClientRect();
  }

  /* Le raccord. Le nom est le dernier objet lu de la sequence et le premier
     du CV : c'est le seul point ou les deux plans ont quelque chose en
     commun. On le fait voyager de l'un a l'autre plutot que de le faire
     disparaitre puis reapparaitre ailleurs, a une autre taille.

     On ne deplace pas l'original : il est enfant du plan, donc soumis a la
     camera et au fondu. On lui substitue un sosie pose sur le document, a
     la taille et a la place exactes qu'il occupait a l'ecran.

     Renvoie false si le raccord n'est pas jouable — le fondu d'origine
     reprend alors la main, tel quel. */
  function startHandoff(overlay) {
    if (hasFinished || prefersReducedMotion()) {
      return false;
    }

    var source = overlay.querySelector(".intro-nom");
    var target = document.querySelector(".identity h1");

    if (!source || !target || typeof source.animate !== "function") {
      return false;
    }

    /* Les deux boites a l'ecran : celle que la camera donne au nom, celle
       que le CV donne au h1. Le raccord n'a besoin de rien d'autre. */
    var from = measureText(source);
    var to = measureText(target);

    if (!from.width || !to.width) {
      return false;
    }

    var nominal = parseFloat(window.getComputedStyle(source).fontSize);

    if (!isFinite(nominal) || nominal <= 0) {
      return false;
    }

    var ghost = document.createElement("div");

    ghost.className = "intro-ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.textContent = source.textContent;
    ghost.style.left = "0px";
    ghost.style.top = "0px";
    ghost.style.fontSize = nominal + "px";
    document.body.appendChild(ghost);

    /* Le sosie est pose a un corps arbitraire, puis mesure : ses deux
       echelles se deduisent de cette mesure. Le depart vaut exactement la
       boite que la camera montre, l'arrivee exactement celle du h1 — les
       deux par construction, sans jamais interroger la camera.

       C'est ce qui remplace l'ancienne lecture de la matrice du plan. Une
       animation CSS peut tourner sur le compositeur, et ce que
       `getComputedStyle` en rapporte pendant qu'elle tourne depend du
       moteur : la ou il rendait 1 au lieu de l'echelle reelle, le nom
       naissait au double de sa taille apparente. Mesurer ne depend
       d'aucun moteur. */
    var text = measureText(ghost);
    var border = ghost.getBoundingClientRect();

    if (!text.width) {
      ghost.parentNode.removeChild(ghost);
      return false;
    }

    var startScale = from.width / text.width;
    var endScale = to.width / text.width;

    if (!isFinite(startScale) || !isFinite(endScale) || endScale <= 0) {
      ghost.parentNode.removeChild(ghost);
      return false;
    }

    /* L'echelle s'applique au coin de la boite de bordure, pas au texte :
       l'ecart entre les deux se dilate avec elle et doit etre reporte sur
       la translation, a chaque bout. Sans ce report, le nom rate sa place
       d'autant — peu en largeur, franchement en hauteur des que les
       interlignes different. */
    var offsetX = text.left - border.left;
    var offsetY = text.top - border.top;

    function step(box, factor) {
      return (
        "translate(" +
        (box.left - border.left - offsetX * factor) +
        "px, " +
        (box.top - border.top - offsetY * factor) +
        "px) scale(" +
        factor +
        ")"
      );
    }

    /* Pose l'etat de depart avant meme d'armer l'animation : le sosie a ete
       ajoute a son corps nominal en haut a gauche, et rien ne doit pouvoir
       s'intercaler pour le peindre ainsi. */
    ghost.style.transform = step(from, startScale);

    root.classList.add("intro-handoff");
    overlay.classList.add("is-handoff");
    raiseApp();

    var travel = ghost.animate(
      [{ transform: step(from, startScale) }, { transform: step(to, endScale) }],
      {
        duration: HANDOFF_DURATION,
        easing: "cubic-bezier(0.62, 0, 0.24, 1)",
        fill: "forwards",
      },
    );

    handoff = { ghost: ghost, travel: travel };

    if (travel.finished && typeof travel.finished.then === "function") {
      travel.finished.then(cancelHandoff, cancelHandoff);
    } else {
      window.setTimeout(cancelHandoff, HANDOFF_DURATION + 40);
    }

    return true;
  }

  function finish(overlay, options) {
    if (hasFinished) {
      return;
    }

    hasFinished = true;
    clearTimers();
    cancelHandoff();

    if (options && options.immediate) {
      removeOverlay(overlay);
      return;
    }

    /* Sortie anticipee (Passer, clic, touche) : le nom n'a pas forcement
       ete pose, donc pas de voyage — mais le CV monte quand meme. */
    raiseApp();
    overlay.classList.add("is-done");
    window.setTimeout(function () {
      removeOverlay(overlay);
    }, FADE_OUT_DURATION);
  }

  function formatCount(value, decimals) {
    var fixed = value.toFixed(decimals);

    return decimals > 0 ? fixed.replace(".", ",") : fixed;
  }

  function animateCounter(element) {
    var target = parseFloat(element.getAttribute("data-count-to"));

    if (!isFinite(target)) {
      return;
    }

    var decimals = parseInt(element.getAttribute("data-count-decimals"), 10) || 0;
    var prefix = element.getAttribute("data-count-prefix") || "";
    var suffix = element.getAttribute("data-count-suffix") || "";
    var startedAt = 0;

    function step(now) {
      if (!startedAt) {
        startedAt = now;
      }

      var progress = Math.min(1, (now - startedAt) / COUNTER_DURATION);
      var eased = 1 - Math.pow(1 - progress, 3);

      element.textContent = prefix + formatCount(target * eased, decimals) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    element.textContent = prefix + formatCount(0, decimals) + suffix;
    window.requestAnimationFrame(step);
  }

  function startCounters(overlay) {
    var counters = overlay.querySelectorAll("[data-count-to]");

    for (var index = 0; index < counters.length; index += 1) {
      animateCounter(counters[index]);
    }
  }

  function startPlayback(overlay) {
    if (hasFinished) {
      return;
    }

    clearTimers();
    overlay.classList.add("is-playing");

    schedule(function () {
      startCounters(overlay);
    }, COUNTER_START);

    /* Le retrait de l'overlay suit celui des deux scenarios qui s'est
       joue : le raccord, qui dure plus longtemps que le fondu, ou le
       fondu d'origine si le raccord n'etait pas jouable. */
    schedule(function () {
      var delay = startHandoff(overlay)
        ? HANDOFF_DURATION + 140
        : TOTAL_DURATION - HANDOFF_START;

      schedule(function () {
        finish(overlay, { immediate: true });
      }, delay);
    }, HANDOFF_START);
  }

  function waitForPaintReady(overlay) {
    var hasStarted = false;

    function begin() {
      if (hasStarted) {
        return;
      }

      hasStarted = true;
      window.requestAnimationFrame(function () {
        startPlayback(overlay);
      });
    }

    if (document.fonts && typeof document.fonts.ready === "object") {
      document.fonts.ready.then(begin, begin);
    }

    /* Filet de securite : polices lentes ou indisponibles */
    schedule(begin, FONT_WAIT_LIMIT);
  }

  function bindOverlay() {
    var overlay = document.querySelector("[data-intro]");

    if (!overlay) {
      root.classList.remove("intro-armed", "intro-lock");
      /* La classe etait posee : js/main.js a mis son entree en reserve et
         attend le signal. Sans overlay il n'y aura pas de raccord, mais le
         CV se decouvre tout de suite — donc le signal est du maintenant. */
      raiseApp();
      return;
    }

    var skipButton = overlay.querySelector("[data-intro-skip]");

    if (skipButton) {
      skipButton.addEventListener("click", function (event) {
        event.stopPropagation();
        finish(overlay);
      });
    }

    overlay.addEventListener("click", function () {
      finish(overlay);
    });

    keydownHandler = function (event) {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        finish(overlay);
      }
    };

    document.addEventListener("keydown", keydownHandler);

    waitForPaintReady(overlay);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindOverlay);
  } else {
    bindOverlay();
  }
})();
