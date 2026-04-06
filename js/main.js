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
import { initializeModal } from "./ui/modal.js";
import { bindNavigation } from "./ui/navigation.js";

const state = {
  activeSection: "profil",
  expandedCompetenceId: null,
  expandedTool: "optiprofit",
  isMobileView: false,
};

const mobileViewport = "(max-width: 900px)";
let viewportQueryList;
let resizeListenerBound = false;

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
    state.activeSection = sectionId;
    render();
  });

  bindAccordion({
    onToolToggle: (toolId) => {
      state.expandedTool = state.expandedTool === toolId ? null : toolId;
      render();
    },
    onCompetenceToggle: (competenceId) => {
      state.expandedCompetenceId =
        state.expandedCompetenceId === competenceId ? null : competenceId;
      render();
    },
  });

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
    render();
  };

  if (typeof viewportQueryList.addEventListener === "function") {
    viewportQueryList.addEventListener("change", handleViewportChange);
    return;
  }

  viewportQueryList.addListener(handleViewportChange);
}

function scrollActiveMobileNavigationIntoView() {
  const navigationRail = document.querySelector("[data-mobile-nav]");
  const activeNavItem = document.querySelector(".app-mobile .nav-item.active");

  if (!navigationRail || !activeNavItem) {
    return;
  }

  const railRect = navigationRail.getBoundingClientRect();
  const activeRect = activeNavItem.getBoundingClientRect();
  const currentScroll = navigationRail.scrollLeft;
  const activeCenter = activeRect.left - railRect.left + currentScroll + activeRect.width / 2;
  const targetScroll =
    activeCenter - navigationRail.clientWidth / 2;

  navigationRail.scrollTo({
    left: Math.max(0, targetScroll),
    behavior: "smooth",
  });
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

function bindMobileNavigationUi() {
  const navigationRail = document.querySelector("[data-mobile-nav]");

  if (!navigationRail) {
    return;
  }

  navigationRail.addEventListener(
    "scroll",
    () => {
      updateMobileNavigationOverflowState();
    },
    { passive: true },
  );
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
    bindMobileNavigationUi();
    requestAnimationFrame(() => {
      scrollActiveMobileNavigationIntoView();
      requestAnimationFrame(() => {
        updateMobileNavigationOverflowState();
      });
    });
  }
}

if (typeof document !== "undefined") {
  initializeViewportDetection();
  initializeWindowBindings();
  render();
}
