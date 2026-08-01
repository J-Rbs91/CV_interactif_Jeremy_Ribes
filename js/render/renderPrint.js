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
import { getLiveProducts } from "./renderContact.js";
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
      return renderExperiencesSection();
    case "projet":
      return renderProjetSection();
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

  return `<div class="print-live">
    <span class="print-live-label">En ligne</span>
    ${products
      .map(
        (product) =>
          `<span class="print-live-item">${linkHost(product.url)}</span>`,
      )
      .join("")}
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
