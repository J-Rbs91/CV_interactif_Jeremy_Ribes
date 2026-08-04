import {
  renderMobileShell,
  renderSidebar,
  renderContentHeader,
} from "./render/renderHeader.js";
import {
  renderExperiencesSection,
  renderFormationSection,
  renderProfilSection,
} from "./render/renderExperiences.js";
import {
  renderCompetencesSection,
} from "./render/renderCompetences.js";
import {
  defaultExpandedTool,
  renderOutilsSection,
} from "./render/renderOutils.js";
import { renderProjetSection } from "./render/renderProjets.js";
import { bindAccordion, syncAccordion } from "./ui/accordion.js";
import { bindContactForm } from "./ui/contactForm.js";
import { initializeModal } from "./ui/modal.js";
import { bindNavigation } from "./ui/navigation.js";
import { bindPrint } from "./ui/print.js";
import { bindShare } from "./ui/share.js";

const state = {
  activeSection: "profil",
  expandedCompetenceId: null,
  expandedTool: defaultExpandedTool,
  hasToggledTool: false,
  desktopScrollTop: 0,
  isMobileView: false,
  mobileNavScrollLeft: 0,
  shouldAnimateMobileNav: false,
  hasInitializedMobileNav: false,
  shouldAnimateSection: true,
};

/* Le decalage d'entree est plafonne : au-dela de huit blocs, le dernier
   arriverait apres que l'oeil a fini de parcourir la page, et le rythme se
   lirait comme une lenteur. */
const maxSectionEntryStagger = 8;

const mobileViewport = "(max-width: 900px)";
const mobileNavigationScrollSettleDelay = 350;
let viewportQueryList;
let resizeListenerBound = false;
let mobileNavigationOverflowUpdateTimeoutId = 0;

function getMobileNavigationRail() {
  return document.querySelector("[data-mobile-nav]");
}

function clampScrollLeft(value, maxScrollLeft) {
  return Math.min(Math.max(0, value), Math.max(0, maxScrollLeft));
}

function setNavigationRailScrollPosition(navigationRail, left) {
  const previousScrollBehavior = navigationRail.style.scrollBehavior;

  navigationRail.style.scrollBehavior = "auto";
  navigationRail.scrollLeft = left;
  navigationRail.style.scrollBehavior = previousScrollBehavior;
}

function isMobileNavigationRailMeasurable(navigationRail) {
  return navigationRail.clientWidth > 0 && navigationRail.scrollWidth > 0;
}

function cancelScheduledMobileNavigationOverflowUpdate() {
  if (!mobileNavigationOverflowUpdateTimeoutId) {
    return;
  }

  window.clearTimeout(mobileNavigationOverflowUpdateTimeoutId);
  mobileNavigationOverflowUpdateTimeoutId = 0;
}

function preserveMobileNavigationState({ shouldAnimate = false } = {}) {
  const navigationRail = getMobileNavigationRail();

  if (navigationRail) {
    const maxScrollLeft =
      navigationRail.scrollWidth - navigationRail.clientWidth;
    state.mobileNavScrollLeft = clampScrollLeft(
      navigationRail.scrollLeft,
      maxScrollLeft,
    );
  }

  state.shouldAnimateMobileNav = shouldAnimate;
}

function preserveDesktopScrollPosition() {
  const contentBody = document.querySelector(".content-body");

  if (contentBody) {
    state.desktopScrollTop = contentBody.scrollTop;
  }
}

function restoreDesktopScrollPosition() {
  const contentBody = document.querySelector(".content-body");

  if (contentBody) {
    contentBody.scrollTop = state.desktopScrollTop;
  }
}

/* Une carte qu'on vient d'ouvrir doit rester visible. Le report d'un
   rendez-vous de defilement d'un rendu a l'autre n'a plus lieu d'etre : la
   bascule se fait en place, la carte est donc deja la quand on la mesure.

   On ne juge que par le haut de la carte : au moment de l'appel le panneau
   commence tout juste a se deplier, et sa hauteur finale n'est pas encore
   connue. */
function scrollAccordionIntoView(card) {
  const scrollContainer = state.isMobileView
    ? document.querySelector("#app.app-mobile")
    : document.querySelector(".content-body");

  if (!card || !scrollContainer) {
    return;
  }

  const containerRect = scrollContainer.getBoundingClientRect();
  const cardTopRelative = card.getBoundingClientRect().top - containerRect.top;

  /* En etroit, le bandeau de navigation est collant : la marge de confort
     doit passer dessous, sinon la tete de carte se glisse derriere lui. */
  const navigationShell = state.isMobileView
    ? document.querySelector("[data-mobile-nav-shell]")
    : null;
  const comfortMargin = navigationShell
    ? navigationShell.getBoundingClientRect().bottom - containerRect.top + 20
    : 16;

  const isComfortablyPlaced =
    cardTopRelative >= comfortMargin &&
    cardTopRelative <= scrollContainer.clientHeight - 40;

  if (isComfortablyPlaced) {
    return;
  }

  scrollContainer.scrollTo({
    top: Math.max(
      0,
      scrollContainer.scrollTop + cardTopRelative - comfortMargin,
    ),
    behavior: "smooth",
  });
}

function hasFocusInNavigation() {
  const focused = document.activeElement;

  return Boolean(focused && focused.closest?.("[data-section]"));
}

function restoreFocusToActiveNavigation() {
  const activeNavigationItem = document.querySelector(
    `[data-section="${state.activeSection}"]`,
  );

  activeNavigationItem?.focus({ preventScroll: true });
}

/* Le rythme de la sequence, importe dans le CV : au changement de section,
   les blocs entrent decales, avec la meme courbe. Uniquement au changement
   de section — l'ouverture d'un accordeon ne re-rend plus rien, et faire
   rejouer l'entree a chaque ouverture donnerait une interface nerveuse.
   Le respect de `prefers-reduced-motion` est porte par css/base.css, qui
   ramene toutes les durees a 0,01 ms sans changer l'etat d'arrivee. */
function playSectionEntry() {
  if (!state.shouldAnimateSection) {
    return;
  }

  state.shouldAnimateSection = false;

  const contentHead = document.querySelector(".content-head");
  const contentBody = document.querySelector(".content-body");

  if (contentHead) {
    contentHead.classList.add("is-entering");
  }

  if (!contentBody) {
    return;
  }

  Array.from(contentBody.children).forEach((block, index) => {
    block.style.setProperty(
      "--i",
      String(Math.min(index, maxSectionEntryStagger)),
    );
  });

  contentBody.classList.add("is-entering");
}

function renderCurrentSection() {
  switch (state.activeSection) {
    case "profil":
      return renderProfilSection();
    case "competences":
      return renderCompetencesSection(state.expandedCompetenceId);
    case "outils":
      return renderOutilsSection(state.expandedTool);
    case "experience":
      return renderExperiencesSection();
    case "projet":
      return renderProjetSection();
    case "formation":
      return renderFormationSection();
    default:
      return renderProfilSection();
  }
}

function bindUi() {
  bindNavigation((sectionId) => {
    if (!sectionId || state.activeSection === sectionId) {
      return;
    }

    if (state.isMobileView) {
      preserveMobileNavigationState({ shouldAnimate: true });
    }

    state.expandedCompetenceId = null;
    state.expandedTool =
      sectionId === "outils" && !state.hasToggledTool
        ? defaultExpandedTool
        : null;
    state.desktopScrollTop = 0;
    state.activeSection = sectionId;
    state.shouldAnimateSection = true;
    /* La navigation est le seul endroit ou le document est reconstruit sous
       le doigt de quelqu'un : le bouton qui portait le focus disparait avec
       lui, et le clavier repart du haut de la page. On le lui rend. */
    render({ restoreFocusToActiveNavigation: hasFocusInNavigation() });
  });

  /* Aucun re-rendu ici : c'est ce qui rend le depliage animable, et ce qui
     garde le focus sur le bouton qu'on vient d'actionner. */
  bindAccordion({
    onToolToggle: (toolId) => {
      state.hasToggledTool = true;
      state.expandedTool = state.expandedTool === toolId ? null : toolId;
      scrollAccordionIntoView(syncAccordion("tool", state.expandedTool));
    },
    onCompetenceToggle: (competenceId) => {
      state.expandedCompetenceId =
        state.expandedCompetenceId === competenceId ? null : competenceId;
      scrollAccordionIntoView(
        syncAccordion("competence", state.expandedCompetenceId),
      );
    },
  });

  bindContactForm();
  bindShare();
  initializeModal();
}

function initializeViewportDetection() {
  if (typeof window === "undefined" || viewportQueryList) {
    return;
  }

  viewportQueryList = window.matchMedia(mobileViewport);
  state.isMobileView = viewportQueryList.matches;

  const handleViewportChange = (event) => {
    if (state.isMobileView === event.matches) {
      return;
    }

    /* La bascule large ↔ etroit est le seul re-rendu qui reste en cours de
       lecture : on garde la position acquise plutot que de renvoyer en tete. */
    preserveDesktopScrollPosition();
    state.isMobileView = event.matches;
    state.hasInitializedMobileNav = false;
    state.shouldAnimateMobileNav = false;
    render();
  };

  if (typeof viewportQueryList.addEventListener === "function") {
    viewportQueryList.addEventListener("change", handleViewportChange);
    return;
  }

  viewportQueryList.addListener(handleViewportChange);
}

function restoreMobileNavigationScrollPosition() {
  const navigationRail = getMobileNavigationRail();

  if (!navigationRail || !isMobileNavigationRailMeasurable(navigationRail)) {
    return false;
  }

  const maxScrollLeft = navigationRail.scrollWidth - navigationRail.clientWidth;
  const nextScrollLeft = clampScrollLeft(
    state.mobileNavScrollLeft,
    maxScrollLeft,
  );

  setNavigationRailScrollPosition(navigationRail, nextScrollLeft);
  state.mobileNavScrollLeft = nextScrollLeft;
  return true;
}

function scrollActiveMobileNavigationIntoView({ behavior = "smooth" } = {}) {
  const navigationRail = getMobileNavigationRail();
  const activeNavItem = document.querySelector(".app-mobile .nav-item.active");

  if (
    !navigationRail ||
    !activeNavItem ||
    !isMobileNavigationRailMeasurable(navigationRail)
  ) {
    return false;
  }

  const railRect = navigationRail.getBoundingClientRect();
  const activeRect = activeNavItem.getBoundingClientRect();
  const currentScroll = navigationRail.scrollLeft;
  const activeCenter = activeRect.left - railRect.left + currentScroll + activeRect.width / 2;
  const rawTargetScroll =
    activeCenter - navigationRail.clientWidth / 2;
  const maxScrollLeft = navigationRail.scrollWidth - navigationRail.clientWidth;
  const targetScroll = clampScrollLeft(rawTargetScroll, maxScrollLeft);

  if (behavior === "smooth") {
    navigationRail.scrollTo({
      left: targetScroll,
      behavior,
    });
  } else {
    setNavigationRailScrollPosition(navigationRail, targetScroll);
  }

  state.mobileNavScrollLeft = targetScroll;
  return behavior === "smooth";
}

function updateMobileNavigationOverflowState() {
  const navigationShell = document.querySelector("[data-mobile-nav-shell]");
  const navigationRail = document.querySelector("[data-mobile-nav]");

  if (!navigationShell || !navigationRail) {
    return;
  }

  const tolerance = 6;
  const maxScrollLeft =
    navigationRail.scrollWidth - navigationRail.clientWidth;
  const hasOverflow = maxScrollLeft > tolerance;
  const hasLeftOverflow = hasOverflow && navigationRail.scrollLeft > tolerance;
  const hasRightOverflow =
    hasOverflow && navigationRail.scrollLeft < maxScrollLeft - tolerance;

  navigationShell.classList.toggle("is-overflowing", hasOverflow);
  navigationShell.classList.toggle("is-overflow-left", hasLeftOverflow);
  navigationShell.classList.toggle("is-overflow-right", hasRightOverflow);
}

function scheduleMobileNavigationOverflowUpdateAfterScroll() {
  const navigationRail = getMobileNavigationRail();

  if (!navigationRail) {
    return;
  }

  cancelScheduledMobileNavigationOverflowUpdate();

  let hasUpdatedOverflow = false;
  let handleScrollEnd;

  const finalizeOverflowUpdate = () => {
    if (hasUpdatedOverflow) {
      return;
    }

    hasUpdatedOverflow = true;
    cancelScheduledMobileNavigationOverflowUpdate();

    if (handleScrollEnd) {
      navigationRail.removeEventListener("scrollend", handleScrollEnd);
    }

    updateMobileNavigationOverflowState();
  };

  if ("onscrollend" in navigationRail) {
    handleScrollEnd = () => {
      finalizeOverflowUpdate();
    };

    navigationRail.addEventListener("scrollend", handleScrollEnd, { once: true });
  }

  mobileNavigationOverflowUpdateTimeoutId = window.setTimeout(() => {
    finalizeOverflowUpdate();
  }, mobileNavigationScrollSettleDelay);
}

function bindMobileNavigationUi() {
  const navigationRail = getMobileNavigationRail();

  if (!navigationRail) {
    return;
  }

  navigationRail.addEventListener(
    "scroll",
    () => {
      state.mobileNavScrollLeft = navigationRail.scrollLeft;
      updateMobileNavigationOverflowState();
    },
    { passive: true },
  );
}

function finalizeMobileNavigationRender({
  shouldCenterActiveItem,
  scrollBehavior,
  remainingMeasureAttempts = 4,
} = {}) {
  const didRestoreScrollPosition = restoreMobileNavigationScrollPosition();

  if (!didRestoreScrollPosition) {
    if (remainingMeasureAttempts <= 0) {
      updateMobileNavigationOverflowState();
      state.shouldAnimateMobileNav = false;
      state.hasInitializedMobileNav = true;
      return;
    }

    requestAnimationFrame(() => {
      finalizeMobileNavigationRender({
        shouldCenterActiveItem,
        scrollBehavior,
        remainingMeasureAttempts: remainingMeasureAttempts - 1,
      });
    });
    return;
  }

  requestAnimationFrame(() => {
    const didStartSmoothScroll = shouldCenterActiveItem
      ? scrollActiveMobileNavigationIntoView({ behavior: scrollBehavior })
      : false;

    if (didStartSmoothScroll) {
      scheduleMobileNavigationOverflowUpdateAfterScroll();
    } else {
      updateMobileNavigationOverflowState();
    }

    state.shouldAnimateMobileNav = false;
    state.hasInitializedMobileNav = true;
  });
}

function initializeWindowBindings() {
  if (typeof window === "undefined" || resizeListenerBound) {
    return;
  }

  resizeListenerBound = true;

  window.addEventListener(
    "resize",
    () => {
      if (!state.isMobileView) {
        return;
      }

      updateMobileNavigationOverflowState();
    },
    { passive: true },
  );
}

function render(options = {}) {
  const { restoreFocusToActiveNavigation: shouldRestoreFocus = false } = options;
  const appElement = document.getElementById("app");

  if (!appElement) {
    return;
  }

  cancelScheduledMobileNavigationOverflowUpdate();

  const currentSection = renderCurrentSection();

  appElement.className = state.isMobileView ? "app app-mobile" : "app";
  appElement.innerHTML = state.isMobileView
    ? renderMobileShell(state.activeSection, currentSection)
    : `
        ${renderSidebar(state.activeSection)}
        <div class="panel-right">
          ${renderContentHeader(state.activeSection)}
          <div class="content-body">
            ${currentSection}
          </div>
        </div>
      `;

  bindUi();
  playSectionEntry();

  if (shouldRestoreFocus) {
    restoreFocusToActiveNavigation();
  }

  if (!state.isMobileView) {
    restoreDesktopScrollPosition();
  }

  if (state.isMobileView) {
    bindMobileNavigationUi();
    const shouldCenterActiveItem =
      state.shouldAnimateMobileNav || !state.hasInitializedMobileNav;
    const scrollBehavior = state.shouldAnimateMobileNav ? "smooth" : "auto";

    requestAnimationFrame(() => {
      finalizeMobileNavigationRender({
        shouldCenterActiveItem,
        scrollBehavior,
      });
    });
  }
}

/* L'entree des blocs se jouait derriere la sequence d'ouverture. Le module
   monte le CV des l'analyse du document, l'entree partait aussitot, et
   l'overlay ne se retirait qu'a 8,65 s : l'escalier etait fini depuis six
   secondes quand on decouvrait la page. On la garde en reserve, et
   js/ui/intro.js previent au raccord — c'est-a-dire au moment exact ou le
   CV se decouvre, ce qui etait l'intention. */
function deferSectionEntryUntilIntroHandoff() {
  state.shouldAnimateSection = false;

  document.addEventListener(
    "cv:intro-raccord",
    () => {
      state.shouldAnimateSection = true;
      playSectionEntry();
    },
    { once: true },
  );
}

if (typeof document !== "undefined") {
  const isIntroArmed =
    document.documentElement.classList.contains("intro-armed");

  initializeViewportDetection();
  initializeWindowBindings();
  bindPrint();

  if (isIntroArmed) {
    deferSectionEntryUntilIntroHandoff();
  }

  render();
}
