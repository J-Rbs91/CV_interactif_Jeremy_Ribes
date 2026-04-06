export function bindNavigation(onSectionChange) {
  document.querySelectorAll("[data-section]").forEach((element) => {
    element.addEventListener("click", () => {
      const { section } = element.dataset;

      if (!section) {
        return;
      }

      onSectionChange(section);
    });
  });
}
