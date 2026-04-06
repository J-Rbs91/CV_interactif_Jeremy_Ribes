import {
  renderMobileShell,
  renderSidebar,
  renderContentHeader,
} from "./render/renderHeader.js";
import {
  renderExperiencesSection,
  renderFormationSection,
  renderProfilSection,
  renderRealisationsSection,
} from "./render/renderExperiences.js";
import {
  renderCompetencesSection,
  renderOutilsSection,
} from "./render/renderCompetences.js";
import { renderProjetSection } from "./render/renderProjets.js";
import { bindAccordion } from "./ui/accordion.js";
import { bindContactLinks } from "./ui/contactLinks.js";
import { initializeModal } from "./ui/modal.js";
import { bindNavigation } from "./ui/navigation.js";

const state = {
  activeSection: "profil",
  expandedCompetenceId: null,
  expandedTool: "optiprofit",
  isMobileView: false,
  mobileNavScrollLeft: 0,
  pendingMobileAccordionScroll: null,
  shouldAnimateMobileNav: false,
  hasInitializedMobileNav: false,
};

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

function queueMobileAccordionScroll(target) {
  state.pendingMobileAccordionScroll = state.isMobileView ? target : null;
}

function findPendingMobileAccordionTarget() {
  const target = state.pendingMobileAccordionScroll;

  if (!target || !state.isMobileView) {
    return null;
  }

  const targetId = typeof CSS !== "undefined" && typeof CSS.escape === "function"
    ? CSS.escape(target.id)
    : target.id;

  if (target.type === "competence") {
    return document.querySelector(
      `.comp-card.is-open [data-competence="${targetId}"]`,
    );
  }

  if (target.type === "tool") {
    const trigger = document.querySelector(`[data-tool="${targetId}"]`);

    if (trigger?.closest(".tool-card")?.querySelector(".tool-details")) {
      return trigger;
    }
  }

  return null;
}

function restoreMobileAccordionScrollPosition({ behavior = "smooth" } = {}) {
  const scrollContainer = document.querySelector("#app.app-mobile");
  const targetElement = findPendingMobileAccordionTarget();

  state.pendingMobileAccordionScroll = null;

  if (!scrollContainer || !targetElement) {
    return false;
  }

  const containerRect = scrollContainer.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  const targetOffset =
    targetRect.top - containerRect.top + scrollContainer.scrollTop;
  const navShell = document.querySelector("[data-mobile-nav-shell]");
  const navHeight = navShell
    ? navShell.getBoundingClientRect().bottom - containerRect.top
    : 0;
  const comfortMargin = navHeight + 12;

  scrollContainer.scrollTo({
    top: Math.max(0, targetOffset - comfortMargin),
    behavior,
  });

  return true;
}

function renderCurrentSection() {
  switch (state.activeSection) {
    case "profil":
      return renderProfilSection();
    case "competences":
      return renderCompetencesSection(state.expandedCompetenceId);
    case "realisations":
      return renderRealisationsSection();
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

    state.activeSection = sectionId;
    render();
  });

  bindAccordion({
    onToolToggle: (toolId) => {
      if (state.isMobileView) {
        preserveMobileNavigationState();
      }

      state.expandedTool = state.expandedTool === toolId ? null : toolId;
      queueMobileAccordionScroll(
        state.expandedTool ? { type: "tool", id: state.expandedTool } : null,
      );
      render();
    },
    onCompetenceToggle: (competenceId) => {
      if (state.isMobileView) {
        preserveMobileNavigationState();
      }

      state.expandedCompetenceId =
        state.expandedCompetenceId === competenceId ? null : competenceId;
      queueMobileAccordionScroll(
        state.expandedCompetenceId
          ? { type: "competence", id: state.expandedCompetenceId }
          : null,
      );
      render();
    },
  });

  bindContactLinks();
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

function render() {
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

  if (state.isMobileView) {
    if (state.pendingMobileAccordionScroll) {
      restoreMobileAccordionScrollPosition({ behavior: "auto" });
    }

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

if (typeof document !== "undefined") {
  initializeViewportDetection();
  initializeWindowBindings();
  render();
}
