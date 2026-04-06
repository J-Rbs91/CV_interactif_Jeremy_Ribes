export function bindContactLinks() {
  document.querySelectorAll('.contact-link[href^="mailto:"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.stopPropagation();
      window.location.href = link.href;
    });
  });
}
