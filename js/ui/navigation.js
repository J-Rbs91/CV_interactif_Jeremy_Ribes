export function bindNavigation(onSectionChange) {
  document.querySelectorAll(".nav-item").forEach((element) => {
    element.addEventListener("click", () => {
      onSectionChange(element.dataset.section);
    });
  });
}
