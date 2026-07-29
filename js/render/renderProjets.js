import { projetsTransverses } from "../data/projets.js";
import { renderBulletList, renderSmallCard } from "./renderUtils.js";
import { icon } from "../ui/icons.js";

function renderProjet(projet) {
  return `
    <div class="project-card n-exploration">
      <div class="project-title">${projet.title}</div>
      <div class="project-sub">${projet.subtitle}</div>
      ${renderBulletList(projet.bullets)}
      ${
        projet.link
          ? `<a class="project-link" href="${projet.link.url}" target="_blank" rel="noopener noreferrer">${projet.link.label}${icon("arrow-up-right")}</a>`
          : ""
      }
    </div>

    <div class="section-label">Compétences transférables</div>
    <div class="grid-2">
      ${projet.transferableSkills.map(renderSmallCard).join("")}
    </div>
  `;
}

export function renderProjetSection() {
  return projetsTransverses.map(renderProjet).join("");
}
