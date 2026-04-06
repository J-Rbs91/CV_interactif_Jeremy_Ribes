import { projetTransverse } from "../data/projets.js";
import { renderBulletList, renderSmallCard } from "./renderUtils.js";

export function renderProjetSection() {
  return `
    <div class="project-card">
      <div class="project-title">${projetTransverse.title}</div>
      <div class="project-sub">${projetTransverse.subtitle}</div>
      ${renderBulletList(projetTransverse.bullets)}
    </div>

    <div class="section-label" style="margin-top:8px">Compétences transférables</div>
    <div class="grid-2">
      ${projetTransverse.transferableSkills.map(renderSmallCard).join("")}
    </div>
  `;
}
