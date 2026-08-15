import { competences } from "../data/competences.js";
import {
  natureClass,
  renderAccentTags,
  renderDiscloseCommand,
} from "./renderUtils.js";

/* Les quatre rubriques sont facultatives : un champ absent des données ne
   produit pas de bloc. */
function detailBlock(label, text) {
  if (!text) {
    return "";
  }

  return `<div class="detail-block">
            <div class="detail-label">${label}</div>
            <div class="detail-text">${text}</div>
          </div>`;
}

function renderCompetenceCard(competence, expandedCompetenceId, expandAll) {
  const isExpanded = expandAll || expandedCompetenceId === competence.id;
  const panelId = `competence-panel-${competence.id}`;
  const buttonId = `competence-toggle-${competence.id}`;

  return `
    <article class="comp-card ${natureClass(competence.nature)} ${isExpanded ? "is-open" : ""}">
      <button
        type="button"
        id="${buttonId}"
        class="comp-toggle"
        data-competence="${competence.id}"
        aria-expanded="${isExpanded ? "true" : "false"}"
        aria-controls="${panelId}"
      >
        <span class="comp-toggle-main">
          <span class="comp-title">${competence.title}</span>
          <span class="comp-desc">${competence.summary}</span>
          ${renderAccentTags(competence.tags, { element: "span" })}
          ${renderDiscloseCommand(competence.detailLabel)}
        </span>
      </button>
      <div
        id="${panelId}"
        class="comp-details"
        role="region"
        aria-labelledby="${buttonId}"
        aria-hidden="${isExpanded ? "false" : "true"}"
        ${isExpanded ? "" : "inert"}
      >
        <div class="comp-details-inner">
          ${detailBlock("Enjeu traité", competence.enjeu)}
          ${detailBlock("Ce que j’ai mis en place", competence.miseEnPlace)}
          ${detailBlock("Exemple concret", competence.exemple)}
          ${detailBlock("Résultat observable", competence.resultat)}
        </div>
      </div>
    </article>
  `;
}

export function renderCompetencesSection(expandedCompetenceId, options = {}) {
  const { expandAll = false } = options;

  return `<div class="competences-list">
    ${competences
      .map((competence) =>
        renderCompetenceCard(competence, expandedCompetenceId, expandAll),
      )
      .join("")}
  </div>`;
}
