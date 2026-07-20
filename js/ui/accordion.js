export function bindAccordion({ onToolToggle, onCompetenceToggle }) {
  document.querySelectorAll(".tool-summary").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        return;
      }

      onToolToggle?.(element.dataset.tool);
    });
  });

  document.querySelectorAll(".comp-toggle").forEach((element) => {
    element.addEventListener("click", () => {
      onCompetenceToggle?.(element.dataset.competence);
    });
  });
}
