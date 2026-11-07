/* Vue d'impression : le SPA ne monte que la section active, donc imprimer la
   page telle quelle perdrait le reste. On construit ici un document linéaire,
   toutes sections dépliées, monté à la demande par js/ui/print.js. */
import { contact } from "../data/contact.js";
import { sections } from "../data/sections.js";
import { renderCompetencesSection } from "./renderCompetences.js";
import {
  renderExperiencesSection,
  renderFormationSection,
  renderProfilSection,
} from "./renderExperiences.js";
import { renderOutilsSection } from "./renderOutils.js";
import { renderProjetSection } from "./renderProjets.js";
import { getLiveProducts, renderPortrait } from "./renderContact.js";
import { linkHost, natureClass } from "./renderUtils.js";

function renderSectionBody(sectionId) {
  switch (sectionId) {
    case "profil":
      return renderProfilSection();
    case "competences":
      return renderCompetencesSection(null, { expandAll: true });
    case "outils":
      return renderOutilsSection(null, { expandAll: true });
    case "experience":
      return renderExperiencesSection(null, { expandAll: true });
    case "projet":
      return renderProjetSection({ expandAll: true });
    case "formation":
      return renderFormationSection();
    default:
      return "";
  }
}

function renderFacts() {
  return contact.items
    .filter((item) => !item.type)
    .map((item) => item.text)
    .join("&nbsp;· ");
}

/* Les adresses en ligne sont regroupées en tête plutôt que répétées à chaque
   lien du corps. */
function renderLiveLine() {
  const products = getLiveProducts();

  if (!products.length) {
    return "";
  }

  /* Le séparateur doit être textuel pour rester lisible lors des exports.
     Le Hub est identifié par un nom, pas par le domaine GitHub Pages. */
  return `<div class="print-live">
    <span class="print-live-label">En ligne</span>
    <span class="print-live-items">${products
      .map(
        (product) =>
          `<span class="print-live-item">${product.printLabel ?? linkHost(product.url)}</span>`,
      )
      .join(" · ")}</span>
  </div>`;
}

export function renderPrintDocument() {
  return `<div class="print-doc">
    <header class="print-head">
      <div class="print-identity">
        <h1>${contact.name}</h1>
        <div class="print-role">${contact.role}</div>
        <div class="print-role2">${contact.secondaryRole}</div>
        <div class="print-facts">${renderFacts()}</div>
      </div>
      ${renderPortrait("print-photo")}
    </header>

    ${renderLiveLine()}

    <p class="print-intro">${contact.intro}</p>

    ${sections
      .map(
        (
          section,
        ) => `<section class="print-section ${natureClass(section.nature)}">
          <h2 class="print-section-title">${section.label}</h2>
          <div class="print-section-body">${renderSectionBody(section.id)}</div>
        </section>`,
      )
      .join("")}
  </div>`;
}
