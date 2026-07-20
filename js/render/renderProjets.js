import { projetsTransverses } from "../data/projets.js";
import { renderBulletList, renderSmallCard } from "./renderUtils.js";

function renderProjet(projet) {
  return `
    <div class="project-card">
      <div class="project-title">${projet.title}</div>
      <div class="project-sub">${projet.subtitle}</div>
      ${renderBulletList(projet.bullets)}
      ${
        projet.link
          ? `<a class="project-link" href="${projet.link.url}" target="_blank" rel="noopener noreferrer" style="color:var(--accent5);background:var(--accent5)12;border-color:var(--accent5)30">${projet.link.label}<span class="tool-link-icon" aria-hidden="true">↗</span></a>`
          : ""
      }
    </div>

    <div class="section-label" style="margin-top:8px">Compétences transférables</div>
    <div class="grid-2">
      ${projet.transferableSkills.map(renderSmallCard).join("")}
    </div>
  `;
}

export function renderProjetSection() {
  return projetsTransverses
    .map(renderProjet)
    .join('<div style="margin-top:24px"></div>');
}
