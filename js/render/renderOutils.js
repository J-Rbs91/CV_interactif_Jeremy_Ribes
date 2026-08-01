import { outils } from "../data/outils.js";
import { natureClass, renderAccentTags } from "./renderUtils.js";
import { icon } from "../ui/icons.js";
import { linkHost } from "./renderUtils.js";

function renderOutilCard(outil, index, expandedTool, expandAll) {
  const isExpanded = expandAll || expandedTool === outil.id;

  return `
    <div class="tool-card ${natureClass(outil.nature)}${isExpanded ? " is-open" : ""}">
      <div class="tool-summary" data-tool="${outil.id}">
        <div class="tool-mark">${index + 1}</div>
        <div class="tool-main">
          <div class="tool-topline">
            <span class="tool-title">${outil.title}</span>
            <span class="tool-category">${outil.category}</span>
            <span class="tool-status">${outil.status}</span>
          </div>
          <div class="tool-summary-text">${outil.summary}</div>
          ${renderAccentTags(outil.chips, { className: "chip-row-lg" })}
          ${
            outil.link
              ? `<a class="tool-link" href="${outil.link.url}" data-host="${linkHost(outil.link.url)}" target="_blank" rel="noopener noreferrer">${outil.link.label}${icon("arrow-up-right")}</a>`
              : ""
          }
        </div>
        <span class="tool-toggle-icon" aria-hidden="true"></span>
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

export function renderOutilsSection(expandedTool, options = {}) {
  const { expandAll = false } = options;

  return `
    <div class="card n-produit">
      <div class="card-title"><div class="dot"></div>Cinq outils conçus et développés</div>
      <div class="card-text">Je les ai conçus et développés moi-même, sous Google Sheets et Apps Script comme en web. Trois sont en service aujourd’hui, dont deux dans un magasin où je ne les avais pas déployés.</div>
    </div>

    ${outils.map((outil, index) => renderOutilCard(outil, index, expandedTool, expandAll)).join("")}
  `;
}
