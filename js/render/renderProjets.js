import { projetsTransverses } from "../data/projets.js";
import { linkHost, renderBulletList, renderSmallCard } from "./renderUtils.js";
import { icon } from "../ui/icons.js";

function renderProjet(projet) {
  return `
    <div class="project-card n-produit">
      <div class="project-title">${projet.title}</div>
      <div class="project-sub">${projet.subtitle}</div>
      ${renderBulletList(projet.bullets)}
      ${
        projet.link
          ? `<a class="project-link" href="${projet.link.url}" data-host="${linkHost(projet.link.url)}" target="_blank" rel="noopener noreferrer">${projet.link.label}${icon("arrow-up-right")}</a>`
          : ""
      }
    </div>

    <div class="section-label">Compétences transférables</div>
    <div class="grid-2">
      ${projet.transferableSkills.map(renderSmallCard).join("")}
    </div>
  `;
}

/* Trois projets, une vitrine : on en voit un à la fois.

   Les onglets suivent le motif WAI-ARIA Tabs (js/ui/tabs.js). Ils ne
   re-rendent rien : un re-rendu ferait perdre le focus au bouton qu'on vient
   d'actionner, et le clavier repartirait du haut de la page.

   `--k` est le rang de la carte dans la pile : 0 pour l'onglet actif, qui
   passe devant, puis 1 et 2 derrière. Il est posé ici pour que la pile naisse
   dans son état d'arrivée, sans clignotement, et c'est le seul état que le
   CSS lit — la pile et la liste à plat partagent le même balisage.

   Le panneau reprend le balisage du document imprimé (`renderProjet`) : un
   seul gabarit pour les deux surfaces, donc aucun texte qui puisse exister
   dans l'une et pas dans l'autre. Les panneaux inactifs sont `hidden` : ici
   aucune transition à protéger, contrairement aux accordéons. */
function renderShowcase(activeId) {
  const total = projetsTransverses.length;
  const found = projetsTransverses.findIndex((projet) => projet.id === activeId);
  const activeIndex = found < 0 ? 0 : found;

  return `
    <div class="proj-showcase n-produit">
      <div class="proj-layout">
        <div class="proj-stack" role="tablist" aria-label="Projets transverses">
          ${projetsTransverses
            .map((projet, index) => {
              const isActive = index === activeIndex;
              const rank = (index - activeIndex + total) % total;

              return `<button
                type="button"
                role="tab"
                id="proj-tab-${projet.id}"
                class="proj-tab"
                data-project="${projet.id}"
                aria-selected="${isActive ? "true" : "false"}"
                aria-controls="proj-panel-${projet.id}"
                tabindex="${isActive ? "0" : "-1"}"
                style="--k:${rank}"
              ><span class="proj-tab-num">${String(index + 1).padStart(2, "0")}</span><span class="proj-tab-name">${projet.short}</span></button>`;
            })
            .join("")}
        </div>
        <div class="proj-panels">
          ${projetsTransverses
            .map(
              (projet, index) => `<div
                role="tabpanel"
                id="proj-panel-${projet.id}"
                class="proj-panel"
                aria-labelledby="proj-tab-${projet.id}"
                tabindex="0"
                ${index === activeIndex ? "" : "hidden"}
              >${renderProjet(projet)}</div>`,
            )
            .join("")}
        </div>
      </div>
    </div>`;
}

/* `expandAll` : le document imprimé et le bloc de texte intégral n'ont pas
   d'onglets — tout est déplié, les trois projets à la suite. */
export function renderProjetSection(options = {}) {
  const { expandAll = false, activeId = null } = options;

  if (expandAll) {
    return projetsTransverses.map(renderProjet).join("");
  }

  return renderShowcase(activeId);
}
