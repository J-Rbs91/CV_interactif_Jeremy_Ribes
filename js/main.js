import { renderSidebar, renderContentHeader } from "./render/renderHeader.js";
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
  expandedTool: "optiprofit",
};

function renderCurrentSection() {
  switch (state.activeSection) {
    case "profil":
      return renderProfilSection();
    case "competences":
      return renderCompetencesSection();
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

  bindAccordion((toolId) => {
    state.expandedTool = state.expandedTool === toolId ? null : toolId;
    render();
  });

  initializeModal();
}

function render() {
  const appElement = document.getElementById("app");

  if (!appElement) {
    return;
  }

  appElement.innerHTML = `
    ${renderSidebar(state.activeSection)}
    <div class="panel-right">
      ${renderContentHeader(state.activeSection)}
      <div class="content-body">
        ${renderCurrentSection()}
      </div>
    </div>
  `;

  bindUi();
}

if (typeof document !== "undefined") {
  render();
}
