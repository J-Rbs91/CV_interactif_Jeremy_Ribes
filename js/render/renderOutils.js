import { outils } from "../data/outils.js";
import {
  linkHost,
  natureClass,
  renderAccentTags,
  renderDiscloseCommand,
} from "./renderUtils.js";
import { icon } from "../ui/icons.js";

/* Aucune carte n'est dépliée à l'arrivée dans la section. Un panneau ouvert
   d'office prenait la moitié de l'écran avant qu'on ait lu la liste, et
   masquait le fait que les cinq autres cartes s'ouvrent aussi : ce qui est
   déjà ouvert ne montre pas qu'on peut ouvrir. C'est la commande de dépliage
   qui porte cette invitation — voir `renderDiscloseCommand`.

   Le panneau est toujours dans le document, replié à `grid-template-rows: 0fr`.
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
              <div class="detail-label">Situation</div>
              <div class="detail-text">${outil.context}</div>
            </div>
            ${
              /* Facultatif : une fiche sans décision préalable à raconter se
                 rend sans la case, plutôt qu'avec une case vide. */
              outil.arbitrage
                ? `<div class="detail-block">
              <div class="detail-label">Arbitrage</div>
              <div class="detail-text">${outil.arbitrage}</div>
            </div>`
                : ""
            }
            <div class="detail-block">
              <div class="detail-label">Réponse</div>
              <div class="detail-text">${outil.action}</div>
            </div>
            <div class="detail-block">
              <div class="detail-label">Constat</div>
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
      <div class="card-title"><div class="dot"></div>Six outils, six problèmes d’organisation</div>
      <div class="card-text">Aucun n’est parti d’une idée de produit. Chacun répond à un dysfonctionnement que j’avais sous les yeux, et à un arbitrage pris avant la première ligne de code : ce qu’il fallait changer dans la façon de travailler, et ce qui ne pouvait pas tenir sans support. Trois sont utilisés par l’équipe du magasin où je travaille — le suivi des devis, le brief quotidien et le hub d’outils. Deux sont sortis de mes mains : Opti’Profit, cédé au directeur régional GrandVision, et le gestionnaire de planning, repris par un collaborateur après mon départ. Le dernier, PANUM, attend son pilote.</div>
    </div>

    ${outils.map((outil, index) => renderOutilCard(outil, index, expandedTool, expandAll)).join("")}
  `;
}
