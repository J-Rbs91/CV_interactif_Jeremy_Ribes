/* Icônes monochromes en `currentColor` : elles héritent de --n-ink et servent
   donc la charte au lieu de la contredire (cf. css/base.css).
   Grille 24×24, trait 1.8, extrémités rondes. */
const PATHS = {
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0"/>',
  check: '<path d="M4.5 12.5 9.5 17.5 19.5 6.5"/>',
  "trending-up":
    '<path d="M3 17.5 9.5 11l4 4L21 7"/><path d="M15.5 7H21v5.5"/>',
  wrench:
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2V12l3.2 2"/>',
  sprout:
    '<path d="M12 20.5v-7"/><path d="M12 13.5c0-3.6-2.6-6.2-6.2-6.2 0 3.6 2.6 6.2 6.2 6.2z"/><path d="M12 13.5c0-3 2.2-5.4 5.4-5.4 0 3-2.2 5.4-5.4 5.4z"/>',
  cap: '<path d="M12 4 2.5 9 12 14l9.5-5L12 4z"/><path d="M6.6 11.3V16c0 1.7 2.4 3 5.4 3s5.4-1.3 5.4-3v-4.7"/>',
  pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  cake: '<path d="M4 20h16"/><path d="M5.5 20v-6.2a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2V20"/><path d="M12 11.8V8.4"/><circle cx="12" cy="5.6" r="1.4"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.9 7.1 7 5.1a2 2 0 0 0 2.2 0l7-5.1"/>',
  coins:
    '<ellipse cx="12" cy="6.6" rx="7" ry="2.9"/><path d="M5 6.6v5c0 1.6 3.1 2.9 7 2.9s7-1.3 7-2.9v-5"/><path d="M5 11.6v5c0 1.6 3.1 2.9 7 2.9s7-1.3 7-2.9v-5"/>',
  clipboard:
    '<path d="M9.2 4.6H7.6a2 2 0 0 0-2 2v11.8a2 2 0 0 0 2 2h8.8a2 2 0 0 0 2-2V6.6a2 2 0 0 0-2-2h-1.6"/><rect x="9.2" y="2.9" width="5.6" height="3.4" rx="1.2"/><path d="M8.9 11.4h6.2M8.9 15h4.2"/>',
  calendar:
    '<rect x="3.5" y="5.6" width="17" height="14.9" rx="2"/><path d="M3.5 10.2h17M8 3.5v4.2M16 3.5v4.2"/>',
  "arrow-up-right": '<path d="M8 16 16 8"/><path d="M9.6 8H16v6.4"/>',
  share:
    '<path d="M14 4h6v6"/><path d="M10 14 20 4"/><path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/>',
  /* Une feuille unique, coin replie. Elle se distingue de `printer` par ce
     qu'elle montre : l'imprimante dit le geste, la feuille dit le format —
     et c'est le format qui separe les deux documents. */
  page: '<path d="M13.4 3.4H7.5a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8.4z"/><path d="M13.4 3.4v5h5"/><path d="M8.9 13.4h5.6M8.9 16.6h3.8"/>',
  printer:
    '<path d="M7.4 8.4V3.6h9.2v4.8"/><path d="M7.4 18.2H5.5a2 2 0 0 1-2-2v-5.8a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v5.8a2 2 0 0 1-2 2h-1.9"/><rect x="7.4" y="14.6" width="9.2" height="5.8" rx="1"/>',
};

export function icon(name, options = {}) {
  const { className = "" } = options;
  const path = PATHS[name];

  if (!path) {
    return "";
  }

  return `<svg class="${["icon", className].filter(Boolean).join(" ")}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
}
