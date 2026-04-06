import { competences, outils } from "../data/competences.js";
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

function renderOutilCard(outil, index, expandedTool) {
  const isExpanded = expandedTool === outil.id;

  return `
    <div class="tool-card">
      <div class="tool-summary" data-tool="${outil.id}">
        <div class="tool-mark" style="background:${outil.accent}15;color:${outil.accent};border-color:${outil.accent}30">${index + 1}</div>
        <div class="tool-main">
          <div class="tool-topline">
            <span class="tool-title" style="color:${outil.accent}">${outil.title}</span>
            <span class="tool-category">${outil.category}</span>
            <span class="tool-status">${outil.status}</span>
          </div>
          <div class="tool-summary-text">${outil.summary}</div>
          ${renderAccentTags(outil.chips, outil.accent, {
            padding: "3px 8px",
            radius: "999px",
            gap: "6px",
            marginTop: "10px",
          })}
        </div>
      </div>
      ${
        isExpanded
          ? `
            <div class="tool-details">
              <div class="tool-detail-grid">
                <div class="detail-block">
                  <div class="detail-label">Contexte & problème</div>
                  <div class="detail-text">${outil.context}</div>
                </div>
                <div class="detail-block">
                  <div class="detail-label">Action</div>
                  <div class="detail-text">${outil.action}</div>
                </div>
                <div class="detail-block">
                  <div class="detail-label">Résultats</div>
                  <div class="detail-text">${outil.results}</div>
                </div>
              </div>
            </div>
          `
          : ""
      }
    </div>
  `;
}

export function renderOutilsSection(expandedTool) {
  return `
    <div class="card">
      <div class="card-title"><div class="dot" style="background:var(--accent3)"></div>Récapitulatif des outils de pilotage</div>
      <div class="card-text">Chaque dispositif ci-dessous démontre ma capacité à structurer une activité,en créant des cadres qui sécurisent l'exécution et clarifient les priorités décisionnelles.</div>
    </div>

    ${outils.map((outil, index) => renderOutilCard(outil, index, expandedTool)).join("")}
  `;
}
