/* Les deux accordéons du CV — Outils et Compétences.

   Une bascule ne re-rend plus sa section. Le re-rendu recréait la carte déjà
   ouverte : le panneau naissait à `grid-template-rows: 1fr` sans jamais être
   passé par `0fr`, donc la transition n'avait pas d'état de départ et le
   dépliage était instantané. Le chevron, recréé lui aussi déjà tourné, ne
   tournait pas non plus. Et le bouton qui portait le focus disparaissait
   avec le reste : au clavier, on ouvrait une carte et on repartait du haut
   de la page.

   Ici on ne touche que ce qui change d'état, sur le document en place. */

const FAMILIES = {
  tool: {
    card: ".tool-card",
    attribute: "data-tool",
    panel: ".tool-panel",
  },
  competence: {
    card: ".comp-card",
    attribute: "data-competence",
    panel: ".comp-details",
  },
};

/* On compare des valeurs d'attribut plutôt que de construire un sélecteur :
   un identifiant n'a alors pas à être échappé pour être cherché. */
export function syncAccordion(family, openId) {
  const config = FAMILIES[family];

  if (!config) {
    return null;
  }

  let openCard = null;

  document.querySelectorAll(config.card).forEach((card) => {
    const trigger = card.querySelector(`[${config.attribute}]`);
    const panel = card.querySelector(config.panel);
    const isOpen =
      openId !== null && trigger?.getAttribute(config.attribute) === openId;

    if (isOpen) {
      openCard = card;
    }

    card.classList.toggle("is-open", isOpen);
    trigger?.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (!panel) {
      return;
    }

    panel.setAttribute("aria-hidden", isOpen ? "false" : "true");

    /* `inert` et non `hidden` : il retire le panneau replié du parcours
       clavier sans poser `display: none`, qui couperait la transition. */
    if (isOpen) {
      panel.removeAttribute("inert");
    } else {
      panel.setAttribute("inert", "");
    }
  });

  return openCard;
}

export function bindAccordion({ onToolToggle, onCompetenceToggle }) {
  document.querySelectorAll("[data-tool]").forEach((element) => {
    element.addEventListener("click", () => {
      onToolToggle?.(element.dataset.tool);
    });
  });

  document.querySelectorAll("[data-competence]").forEach((element) => {
    element.addEventListener("click", () => {
      onCompetenceToggle?.(element.dataset.competence);
    });
  });
}
