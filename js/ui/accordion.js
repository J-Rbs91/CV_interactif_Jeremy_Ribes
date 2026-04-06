export function bindAccordion(onToolToggle) {
  document.querySelectorAll(".tool-summary").forEach((element) => {
    element.addEventListener("click", () => {
      onToolToggle(element.dataset.tool);
    });
  });
}
