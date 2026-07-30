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

    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
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

  /* La camera est une transformation du plan. Le sosie du nom vit hors du
     plan — il doit donc reprendre a la main l'echelle qu'elle appliquait,
     sans quoi il apparaitrait a sa taille intrinseque. */
  function readPlaneScale(plane) {
    var transform = window.getComputedStyle(plane).transform;

    if (!transform || transform === "none") {
      return 1;
    }

    var values = transform.replace(/^matrix(3d)?\(/, "").replace(/\)$/, "").split(",");
    var a = parseFloat(values[0]);
    var b = parseFloat(values[1]);

    if (!isFinite(a) || !isFinite(b)) {
      return 1;
    }

    var scale = Math.sqrt(a * a + b * b);

    return scale > 0 ? scale : 1;
  }

  /* La boite du texte, pas celle de l'element. Le h1 du CV est un bloc :
     sa boite fait toute la largeur de la colonne, soit plus du double du
     nom qu'elle contient. Prendre cette largeur comme cible faisait
     atterrir le nom a plus de deux fois sa taille reelle. Un Range sur le
     contenu donne la boite du texte lui-meme, et les deux cotes sont
     mesures de la meme facon — les demi-interlignes se compensent. */
  function measureText(element) {
    if (typeof document.createRange === "function") {
      var range = document.createRange();

      range.selectNodeContents(element);

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
    var plane = overlay.querySelector(".intro-plane");
    var target = document.querySelector(".identity h1");

    if (!source || !plane || !target || typeof source.animate !== "function") {
      return false;
    }

    var from = measureText(source);
    var to = measureText(target);

    if (!from.width || !to.width) {
      return false;
    }

    var scale = readPlaneScale(plane);
    var fontSize =
      parseFloat(window.getComputedStyle(source).fontSize) * scale;

    /* Les deux textes sont identiques, dans la meme famille, la meme
       graisse et la meme chasse : le rapport des largeurs est celui des
       corps. Mesurer plutot que calculer evite de dependre des valeurs
       ecrites dans le CSS. */
    var ratio = to.width / from.width;

    if (!isFinite(fontSize) || !isFinite(ratio) || ratio <= 0) {
      return false;
    }

    var ghost = document.createElement("div");

    ghost.className = "intro-ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.textContent = source.textContent;
    ghost.style.left = from.left + "px";
    ghost.style.top = from.top + "px";
    ghost.style.fontSize = fontSize + "px";
    document.body.appendChild(ghost);

    /* Le sosie est place par sa boite de bordure, mais c'est sa boite de
       texte qui doit couvrir celle de l'original : l'ecart vient du
       demi-interligne. On mesure une fois, on corrige, et le depart est
       exact — sans quoi le nom sursaute au premier repere. */
    var placed = measureText(ghost);

    ghost.style.left = from.left + (from.left - placed.left) + "px";
    ghost.style.top = from.top + (from.top - placed.top) + "px";

    root.classList.add("intro-handoff");
    overlay.classList.add("is-handoff");
    raiseApp();

    var travel = ghost.animate(
      [
        { transform: "translate(0px, 0px) scale(1)" },
        {
          transform:
            "translate(" +
            (to.left - from.left) +
            "px, " +
            (to.top - from.top) +
            "px) scale(" +
            ratio +
            ")",
        },
      ],
      {
        duration: HANDOFF_DURATION,
        easing: "cubic-bezier(0.62, 0, 0.24, 1)",
        fill: "forwards",
      },
    );

    function land() {
      root.classList.remove("intro-handoff");

      if (ghost.parentNode) {
        ghost.parentNode.removeChild(ghost);
      }
    }

    if (travel.finished && typeof travel.finished.then === "function") {
      travel.finished.then(land, land);
    } else {
      window.setTimeout(land, HANDOFF_DURATION + 40);
    }

    return true;
  }

  function finish(overlay, options) {
    if (hasFinished) {
      return;
    }

    hasFinished = true;
    clearTimers();

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

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        finish(overlay);
      }
    });

    waitForPaintReady(overlay);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindOverlay);
  } else {
    bindOverlay();
  }
})();
