import { outils } from "../data/outils.js";
import {
  linkHost,
  natureClass,
  renderAccentTags,
  renderDiscloseCommand,
} from "./renderUtils.js";
import { icon } from "../ui/icons.js";

/* Le premier outil est déplié à l'arrivée dans la section, tant que le
   visiteur n'a lui-même basculé aucune carte. Un exemple ouvert montre ce
   que la commande donne ; le libellé seul ne fait que l'annoncer. Dès qu'il
   a basculé une carte, il sait, et on ne force plus rien. */
export const defaultExpandedTool = outils[0]?.id ?? null;

/* Le panneau est toujours dans le document, replié à `grid-template-rows: 0fr`.
   Le monter au moment de l'ouverture le faisait naître déjà ouvert : la
   transition n'avait aucun état de départ et le dépliage était instantané.
   `inert` le retire du parcours clavier et de l'arbre d'accessibilité quand
   il est replié — `hidden` aurait posé `display: none`, ce qui coupe la
   transition pour la même raison. */
function renderOutilCard(outil, index, expandedTool, expandAll) {
  const isExpanded = expandAll || expandedTool === outil.id;
  const panelId = `tool-panel-${outil.id}`;
  const buttonId = `tool-toggle-${outil.id}`;

  return `
    <article class="tool-card ${natureClass(outil.nature)}${isExpanded ? " is-open" : ""}">
      <button
        type="button"
        id="${buttonId}"
        class="tool-summary"
        data-tool="${outil.id}"
        aria-expanded="${isExpanded ? "true" : "false"}"
        aria-controls="${panelId}"
      >
        <span class="tool-mark">${index + 1}</span>
        <span class="tool-main">
          <span class="tool-topline">
            <span class="tool-title">${outil.title}</span>
            <span class="tool-category">${outil.category}</span>
          </span>
          <span class="tool-summary-text">${outil.summary}</span>
          ${renderAccentTags(outil.chips, { className: "chip-row-lg", element: "span" })}
          <span class="tool-footline">
            ${renderDiscloseCommand()}
            <span class="tool-status">${outil.status}</span>
          </span>
        </span>
      </button>
      ${
        /* Hors du bouton : un <a> dans un <button> n'est pas du contenu
           admis, et le lien devenait inatteignable au clavier. */
        outil.link
          ? `<a class="tool-link" href="${outil.link.url}" data-host="${linkHost(outil.link.url)}" target="_blank" rel="noopener noreferrer">${outil.link.label}${icon("arrow-up-right")}</a>`
          : ""
      }
      <div
        id="${panelId}"
        class="tool-panel"
        role="region"
        aria-labelledby="${buttonId}"
        aria-hidden="${isExpanded ? "false" : "true"}"
        ${isExpanded ? "" : "inert"}
      >
        <div class="tool-details">
          <div class="tool-detail-grid">
            <div class="detail-block">
              <div class="detail-label">Contexte &amp; problème</div>
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
      </div>
    </article>
  `;
}

export function renderOutilsSection(expandedTool, options = {}) {
  const { expandAll = false } = options;

  return `
    <div class="card n-produit">
      <div class="card-title"><div class="dot"></div>Six outils conçus et développés</div>
      <div class="card-text">Je les ai conçus et développés sous Google Sheets et Apps Script comme en web. Trois tournent tous les jours dans le magasin où je travaille : le suivi des devis, le brief quotidien et le hub d’outils. Deux autres ont continué sans moi : Opti’Profit, cédé au directeur régional de GrandVision pour son réseau de franchisés, et le gestionnaire de planning, resté à l’équipe du magasin que je dirigeais. Le dernier, PANUM, attend son pilote.</div>
    </div>

    ${outils.map((outil, index) => renderOutilCard(outil, index, expandedTool, expandAll)).join("")}
  `;
}
