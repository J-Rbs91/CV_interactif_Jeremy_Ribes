/* Comportements de la page : ouverture, navigation entre sections, repli du
   remplissage des titres, effet des lettres.

   La navigation est celle d'un document qui défile, avec le contrat de
   `js/ui/backNavigation.js` inchangé :
   - les six sections sont des FRÈRES. Aller de l'une à l'autre remplace
     l'entrée d'historique (`poserSection`), jamais n'en empile : quitter le CV
     coûte un appui sur retour, qu'on ait lu une section ou les six ;
   - le panneau d'export et la modale de contact sont des COUCHES (leurs propres
     modules). Rien ici ne les touche ;
   - l'adresse est un reflet de ce qu'on regarde : elle suit le défilement, et
     un lien partagé ou un rechargement retrouve la section.

   Rien n'est intercepté du geste retour. */
import { sections } from "../data/sections.js";
import { poserSection, sectionDeLAdresse } from "./backNavigation.js";

const root = document.documentElement;
const sectionIds = sections.map((section) => section.id);
const DEFAULT_SECTION = "profil";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Défilement vers une section -------------------------------- */

let activeId = null;
let programmaticUntil = 0;

function setActive(id, { updateAddress = true } = {}) {
  if (!id || id === activeId) {
    return;
  }

  activeId = id;

  document.querySelectorAll(".s-nav-item").forEach((item) => {
    const isActive = item.dataset.section === id;

    item.classList.toggle("active", isActive);

    if (isActive) {
      item.setAttribute("aria-current", "true");
      /* En étroit le rail défile : l'entrée courante doit rester visible. */
      item.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    } else {
      item.removeAttribute("aria-current");
    }
  });

  if (updateAddress) {
    poserSection(id);
  }
}

/* Pendant qu'un défilement lancé par un clic traverse d'autres sections, le
   suivi du défilement ne doit pas faire clignoter la navigation sur chacune. */
function goTo(id, { smooth = true } = {}) {
  const target = id === DEFAULT_SECTION ? null : document.getElementById(id);
  const instant = !smooth || prefersReducedMotion();

  setActive(id);
  programmaticUntil = performance.now() + (instant ? 150 : 1100);

  if (id === DEFAULT_SECTION) {
    window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
    return;
  }

  target?.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });
}

function bindNavigation() {
  document.querySelectorAll("[data-section]").forEach((item) => {
    item.addEventListener("click", () => goTo(item.dataset.section));
  });

  document.querySelectorAll("[data-section-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      goTo(link.dataset.sectionLink);
    });
  });

  /* « Voir le poste » : ouvre la fiche visée avant d'y aller. */
  document.querySelectorAll("a[data-open]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const row = document.getElementById(link.dataset.open);

      if (!row) {
        return;
      }

      row.open = true;
      row.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  });
}

/* La section affichée est la dernière dont le haut a franchi le tiers
   supérieur de l'écran. Une seule lecture par image. */
function bindScrollSpy() {
  const spied = [...document.querySelectorAll("[data-spy]")];
  let frame = 0;

  function update() {
    frame = 0;

    if (performance.now() < programmaticUntil) {
      return;
    }

    const line = window.innerHeight * 0.34;
    let current = DEFAULT_SECTION;

    spied.forEach((element) => {
      if (element.getBoundingClientRect().top <= line) {
        current = element.id;
      }
    });

    setActive(current);
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}

/* L'adresse est une commande autant qu'un reflet : une adresse modifiée à la
   main doit être suivie. Aucune écriture d'historique ici. */
function bindAddressNavigation() {
  window.addEventListener("hashchange", () => {
    const requested = sectionDeLAdresse(sectionIds);

    /* Un fragment inconnu — lien tronqué, ancre d'une ancienne version, adresse
       tapée à la main — ne doit pas laisser une adresse qui ment : on retombe
       sur Profil, comme à l'arrivée sur la page. */
    if (window.location.hash && !requested) {
      goTo(DEFAULT_SECTION, { smooth: false });
      return;
    }

    if (requested && requested !== activeId) {
      goTo(requested, { smooth: false });
    }
  });
}

function placeInitialSection() {
  const requested = sectionDeLAdresse(sectionIds);

  /* Un fragment inconnu — lien tronqué, ancre d'une ancienne version — ne doit
     pas laisser une adresse qui ment : on retombe sur Profil et on le dit. */
  if (window.location.hash && !requested) {
    poserSection(DEFAULT_SECTION);
  }

  if (requested && requested !== DEFAULT_SECTION) {
    /* Le défilement doit précéder la première lecture du suivi, sinon il
       élirait Profil. */
    setActive(requested);
    programmaticUntil = performance.now() + 300;
    document.getElementById(requested)?.scrollIntoView({ block: "start" });
    return;
  }

  setActive(DEFAULT_SECTION, { updateAddress: Boolean(requested) });
}

/* ---------- Remplissage des titres : repli ------------------------------ */

function bindTitleFillFallback() {
  if (CSS.supports("animation-timeline: view()")) {
    return;
  }

  root.classList.add("no-timeline");

  const titles = [...document.querySelectorAll(".s-sec > h2")];
  const update = () =>
    titles.forEach((title) => {
      const top = title.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.8 - top) / (vh * 0.6)));

      title.style.setProperty("--p", progress.toFixed(3));
    });

  window.addEventListener("scroll", () => window.requestAnimationFrame(update), {
    passive: true,
  });
  window.addEventListener("resize", update);
  update();
}

/* ---------- Les lettres suivent le pointeur ----------------------------- *
   Distance au curseur → axe de chasse et graisse. Les centres sont mesurés une
   fois au repos : mesurés pendant l'animation, ils bougeraient avec elle et la
   lettre courrait après son propre centre. Souris seulement, et jamais pendant
   l'ouverture. */
function bindLetterEffect() {
  const letters = [...document.querySelectorAll(".s-l")];
  const hero = document.querySelector(".s-hero");
  const canMove =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !prefersReducedMotion();

  if (!hero || !canMove) {
    return { measure() {} };
  }

  let centers = [];
  let frame = 0;
  let mx = -1e5;
  let my = -1e5;

  function measure() {
    centers = letters.map((letter) => {
      const box = letter.getBoundingClientRect();

      return [
        box.left + box.width / 2 + window.scrollX,
        box.top + box.height / 2 + window.scrollY,
      ];
    });
  }

  function paint() {
    frame = 0;

    const radius = window.innerWidth * 0.2;

    letters.forEach((letter, index) => {
      const [cx, cy] = centers[index];
      const t = Math.max(
        0,
        1 - Math.hypot(mx + window.scrollX - cx, my + window.scrollY - cy) / radius,
      );

      letter.style.setProperty("--w", (125 - 52 * t).toFixed(0));
      letter.style.setProperty("--wg", (800 - 340 * t).toFixed(0));
    });
  }

  window.addEventListener("resize", measure);

  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || root.classList.contains("intro-lock")) {
      return;
    }

    mx = event.clientX;
    my = event.clientY;
    hero.style.setProperty("--px", ((event.clientX / window.innerWidth) - 0.5) * 2);
    hero.style.setProperty("--py", ((event.clientY / window.innerHeight) - 0.5) * 2);

    if (!frame) {
      frame = window.requestAnimationFrame(paint);
    }
  });

  hero.addEventListener("pointerleave", () => {
    mx = my = -1e5;
    hero.style.setProperty("--px", 0);
    hero.style.setProperty("--py", 0);

    if (!frame) {
      frame = window.requestAnimationFrame(paint);
    }
  });

  return { measure };
}

/* ---------- Ouverture ---------------------------------------------------- *
   La durée n'est écrite nulle part : on attend que les animations FINIES de la
   page aient toutes fini. Allonger une keyframe n'oblige donc pas à retoucher le
   script, et le verrou de défilement ne peut pas se lever avant la fin. */
function bindIntro(letterEffect) {
  const finite = () =>
    document
      .getAnimations()
      .filter(
        (animation) =>
          animation.effect &&
          Number.isFinite(animation.effect.getComputedTiming().endTime),
      );

  function end() {
    if (!root.classList.contains("intro-lock")) {
      return;
    }

    root.classList.remove("intro-lock");
    root.classList.add("intro-done");

    try {
      window.sessionStorage.setItem("cv-intro-played", "1");
    } catch (error) {
      /* stockage indisponible : l'ouverture se rejouera, rien de grave */
    }

    letterEffect.measure();
  }

  if (!root.classList.contains("intro-lock")) {
    letterEffect.measure();
    return;
  }

  function go() {
    if (!root.classList.contains("intro-wait")) {
      return;
    }

    root.classList.remove("intro-wait");
    Promise.all(finite().map((animation) => animation.finished.catch(() => {}))).then(end);
  }

  Promise.race([
    document.fonts.ready,
    new Promise((resolve) => window.setTimeout(resolve, 2500)),
  ]).then(go);

  function skip() {
    go();
    finite().forEach((animation) => animation.finish());
    end();
  }

  document.getElementById("skip")?.addEventListener("click", skip);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.key === "Enter") {
      skip();
    }
  });
}

export function initSite() {
  const letterEffect = bindLetterEffect();

  bindNavigation();
  placeInitialSection();
  bindScrollSpy();
  bindAddressNavigation();
  bindTitleFillFallback();
  bindIntro(letterEffect);
}
