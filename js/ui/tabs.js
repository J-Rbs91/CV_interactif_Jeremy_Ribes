/* Les onglets de la section Projets — motif WAI-ARIA Tabs.

   Clavier : flèches (les quatre : la pile est verticale en étroit et en
   perspective en large, aucune orientation unique n'est vraie), Début et Fin.
   Activation automatique — il n'y a que trois panneaux, légers, et un onglet
   qui demanderait une validation en plus de la flèche ferait deux gestes pour
   un seul effet.

   Tabulation itinérante : un seul onglet est dans l'ordre de tabulation, les
   autres s'atteignent par les flèches. Sans cela, trois arrêts de Tab sur un
   composant dont les trois éléments disent la même chose.

   Rien n'est re-rendu et l'historique n'est pas touché : un onglet n'est ni
   une section ni une couche (voir js/ui/backNavigation.js), donc le geste
   retour ne doit pas le connaître.

   `--k` est le rang de la carte dans la pile (0 = devant). Il est la seule
   chose que le CSS lit pour disposer la pile. */
export function bindProjectTabs({ onSelect } = {}) {
  document.querySelectorAll(".proj-stack").forEach((list) => {
    const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((tab) =>
      document.getElementById(tab.getAttribute("aria-controls")),
    );

    function activate(index, { moveFocus = false } = {}) {
      tabs.forEach((tab, position) => {
        const isActive = position === index;

        tab.setAttribute("aria-selected", isActive ? "true" : "false");
        tab.tabIndex = isActive ? 0 : -1;
        tab.style.setProperty(
          "--k",
          String((position - index + tabs.length) % tabs.length),
        );

        if (panels[position]) {
          panels[position].hidden = !isActive;
        }
      });

      if (moveFocus) {
        tabs[index].focus();
      }

      onSelect?.(tabs[index].dataset.project);
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(index));

      tab.addEventListener("keydown", (event) => {
        const last = tabs.length - 1;
        let target = null;

        switch (event.key) {
          case "ArrowRight":
          case "ArrowDown":
            target = index === last ? 0 : index + 1;
            break;
          case "ArrowLeft":
          case "ArrowUp":
            target = index === 0 ? last : index - 1;
            break;
          case "Home":
            target = 0;
            break;
          case "End":
            target = last;
            break;
          default:
            return;
        }

        event.preventDefault();
        activate(target, { moveFocus: true });
      });
    });
  });
}
