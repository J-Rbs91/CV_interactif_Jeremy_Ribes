import { competences, outils } from "../data/competences.js";
import { renderAccentTags } from "./renderUtils.js";

export function renderCompetencesSection() {
  return `<div class="grid-2">
    ${competences
      .map(
        (competence) => `
          <div class="comp-card" style="border-left-color:${competence.color}">
            <div class="comp-title" style="color:${competence.color}">${competence.title}</div>
            <div class="comp-desc">${competence.desc}</div>
            ${renderAccentTags(competence.tags, competence.color)}
          </div>
        `,
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
      <div class="card-text">Chaque dispositif ci-dessous peut être ouvert au clic pour afficher le contexte, l'action mise en œuvre et les résultats obtenus. Pour DeV'Flow, la nuance sur l'état d'avancement est explicitée : la solution est structurée et en cours d'hébergement / déploiement, mais n'est pas encore en production.</div>
    </div>

    ${outils.map((outil, index) => renderOutilCard(outil, index, expandedTool)).join("")}
  `;
}
