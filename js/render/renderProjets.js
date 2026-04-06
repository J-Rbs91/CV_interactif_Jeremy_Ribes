import { projetsTransverses } from "../data/projets.js";
import { renderBulletList, renderSmallCard } from "./renderUtils.js";

function renderProjet(projet) {
  return `
    <div class="project-card">
      <div class="project-title">${projet.title}</div>
      <div class="project-sub">${projet.subtitle}</div>
      ${renderBulletList(projet.bullets)}
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
