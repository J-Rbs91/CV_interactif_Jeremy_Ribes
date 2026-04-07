import { competences } from "../data/competences.js";
import { renderAccentTags } from "./renderUtils.js";

function renderCompetenceCard(competence, expandedCompetenceId) {
  const isExpanded = expandedCompetenceId === competence.id;
  const panelId = `competence-panel-${competence.id}`;
  const buttonId = `competence-toggle-${competence.id}`;

  return `
    <article class="comp-card ${isExpanded ? "is-open" : ""}" style="--comp-accent:${competence.color}">
      <button
        type="button"
        id="${buttonId}"
        class="comp-toggle"
        data-competence="${competence.id}"
        aria-expanded="${isExpanded ? "true" : "false"}"
        aria-controls="${panelId}"
      >
        <span class="comp-toggle-main">
          <span class="comp-title" style="color:${competence.color}">${competence.title}</span>
          <span class="comp-desc">${competence.summary}</span>
          ${renderAccentTags(competence.tags, competence.color)}
        </span>
        <span class="comp-toggle-icon" aria-hidden="true"></span>
      </button>
      <div
        id="${panelId}"
        class="comp-details"
        role="region"
        aria-labelledby="${buttonId}"
        aria-hidden="${isExpanded ? "false" : "true"}"
        ${isExpanded ? "" : "hidden"}
      >
        <div class="comp-details-inner">
          <div class="detail-block">
            <div class="detail-label">Enjeu traité</div>
            <div class="detail-text">${competence.enjeu}</div>
          </div>
          <div class="detail-block">
            <div class="detail-label">Ce que j’ai mis en place</div>
            <div class="detail-text">${competence.miseEnPlace}</div>
          </div>
          <div class="detail-block">
            <div class="detail-label">Exemple concret</div>
            <div class="detail-text">${competence.exemple}</div>
          </div>
          <div class="detail-block">
            <div class="detail-label">Résultat observable</div>
            <div class="detail-text">${competence.resultat}</div>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function renderCompetencesSection(expandedCompetenceId) {
  return `<div class="competences-list">
    ${competences
      .map((competence) =>
        renderCompetenceCard(competence, expandedCompetenceId),
      )
      .join("")}
  </div>`;
}
