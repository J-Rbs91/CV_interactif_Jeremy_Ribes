/* Orchestration de la landing animée.
   Script classique chargé de façon bloquante dans <head> : la décision de
   jouer ou non la séquence doit être prise avant le premier rendu pour
   éviter tout clignotement. Le déroulé visuel reste porté par css/intro.css,
   ce fichier ne gère que l'armement, le skip, les compteurs et le retrait. */
(function () {
  "use strict";

  var STORAGE_KEY = "cv-intro-played";
  var TOTAL_DURATION = 7900;
  var COUNTER_START = 3700;
  var COUNTER_DURATION = 900;
  var FADE_OUT_DURATION = 420;
  var FONT_WAIT_LIMIT = 1200;

  var root = document.documentElement;
  var timers = [];
  var hasFinished = false;

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
    root.classList.remove("intro-armed", "intro-lock");

    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
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

    schedule(function () {
      finish(overlay, { immediate: true });
    }, TOTAL_DURATION);
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
