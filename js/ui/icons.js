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
};

export function icon(name, options = {}) {
  const { className = "" } = options;
  const path = PATHS[name];

  if (!path) {
    return "";
  }

  return `<svg class="${["icon", className].filter(Boolean).join(" ")}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
}

/* ============================================================
   Jeu gras — les canaux de partage et les documents
   ============================================================
   Le trait de 1,8 au-dessus est fait pour des reperes discrets poses dans
   une ligne de texte. Le panneau de partage demande l'inverse : un logo de
   reseau se reconnait a sa silhouette pleine, et un contour de 1,8 sur
   vingt pixels rend le LinkedIn et le Facebook interchangeables. Deux jeux,
   donc, et pas un reglage du premier : ce sont deux grilles differentes
   (24 contre 256) et deux modes de rendu (trait contre plein).

   Les glyphes viennent de Phosphor Icons, graisse « Bold », recopies ici
   plutot qu'installes — le projet n'a aucune dependance et n'en prend pas
   une pour seize chemins.

     Phosphor Icons — https://phosphoricons.com
     MIT License, Copyright (c) 2023 Phosphor Icons
     https://github.com/phosphor-icons/core/blob/main/LICENSE

   Redessiner ces marques a la main aurait ete plus long, moins fidele et
   sans meilleure licence : celle-ci autorise la copie, y compris commerciale,
   contre la mention ci-dessus. */
const BOLD_PATHS = {
  "share-network":
    '<path d="M176,156a43.78,43.78,0,0,0-29.09,11L106.1,140.8a44.07,44.07,0,0,0,0-25.6L146.91,89a43.83,43.83,0,1,0-13-20.17L93.09,95a44,44,0,1,0,0,65.94L133.9,187.2A44,44,0,1,0,176,156Zm0-120a20,20,0,1,1-20,20A20,20,0,0,1,176,36ZM64,148a20,20,0,1,1,20-20A20,20,0,0,1,64,148Zm112,72a20,20,0,1,1,20-20A20,20,0,0,1,176,220Z"/>',
  linkedin:
    '<path d="M216,20H40A20,20,0,0,0,20,40V216a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V40A20,20,0,0,0,216,20Zm-4,192H44V44H212ZM112,176V120a12,12,0,0,1,21.43-7.41A40,40,0,0,1,192,148v28a12,12,0,0,1-24,0V148a16,16,0,0,0-32,0v28a12,12,0,0,1-24,0ZM96,120v56a12,12,0,0,1-24,0V120a12,12,0,0,1,24,0ZM68,80A16,16,0,1,1,84,96,16,16,0,0,1,68,80Z"/>',
  whatsapp:
    '<path d="M187.3,159.06A36.09,36.09,0,0,1,152,188a84.09,84.09,0,0,1-84-84A36.09,36.09,0,0,1,96.94,68.7,12,12,0,0,1,110,75.1l11.48,23a12,12,0,0,1-.75,12l-8.52,12.78a44.56,44.56,0,0,0,20.91,20.91l12.78-8.52a12,12,0,0,1,12-.75l23,11.48A12,12,0,0,1,187.3,159.06ZM236,128A108,108,0,0,1,78.77,224.15L46.34,235A20,20,0,0,1,21,209.66l10.81-32.43A108,108,0,1,1,236,128Zm-24,0A84,84,0,1,0,55.27,170.06a12,12,0,0,1,1,9.81l-9.93,29.79,29.79-9.93a12.1,12.1,0,0,1,3.8-.62,12,12,0,0,1,6,1.62A84,84,0,0,0,212,128Z"/>',
  facebook:
    '<path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm12,191.13V156h20a12,12,0,0,0,0-24H140V112a12,12,0,0,1,12-12h16a12,12,0,0,0,0-24H152a36,36,0,0,0-36,36v20H96a12,12,0,0,0,0,24h20v55.13a84,84,0,1,1,24,0Z"/>',
  x: '<path d="M218.12,209.56l-61-95.8,59.72-65.69a12,12,0,0,0-17.76-16.14L143.81,92.77,106.12,33.56A12,12,0,0,0,96,28H48A12,12,0,0,0,37.88,46.44l61,95.8L39.12,207.93a12,12,0,1,0,17.76,16.14l55.31-60.84,37.69,59.21A12,12,0,0,0,160,228h48a12,12,0,0,0,10.12-18.44ZM166.59,204,69.86,52H89.41l96.73,152Z"/>',
  envelope:
    '<path d="M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44ZM193.15,68,128,127.72,62.85,68ZM44,188V83.28l75.89,69.57a12,12,0,0,0,16.22,0L212,83.28V188Z"/>',
  message:
    '<path d="M176,108a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h68A12,12,0,0,1,176,108Zm-12,28H96a12,12,0,0,0,0,24h68a12,12,0,0,0,0-24Zm72-12A104.11,104.11,0,0,1,132,228H48a20,20,0,0,1-20-20V124a104,104,0,0,1,208,0Zm-24,0a80,80,0,0,0-160,0v80h80A80.09,80.09,0,0,0,212,124Z"/>',
  copy: '<path d="M216,28H88A12,12,0,0,0,76,40V76H40A12,12,0,0,0,28,88V216a12,12,0,0,0,12,12H168a12,12,0,0,0,12-12V180h36a12,12,0,0,0,12-12V40A12,12,0,0,0,216,28ZM156,204H52V100H156Zm48-48H180V88a12,12,0,0,0-12-12H100V52H204Z"/>',
  check:
    '<path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"/>',
  "device-mobile":
    '<path d="M176,12H80A28,28,0,0,0,52,40V216a28,28,0,0,0,28,28h96a28,28,0,0,0,28-28V40A28,28,0,0,0,176,12ZM76,76H180V180H76Zm4-40h96a4,4,0,0,1,4,4V52H76V40A4,4,0,0,1,80,36Zm96,184H80a4,4,0,0,1-4-4V204H180v12A4,4,0,0,1,176,220Z"/>',
  "file-pdf":
    '<path d="M200,164v8h12a12,12,0,0,1,0,24H200v12a12,12,0,0,1-24,0V152a12,12,0,0,1,12-12h32a12,12,0,0,1,0,24ZM92,172a32,32,0,0,1-32,32H56v4a12,12,0,0,1-24,0V152a12,12,0,0,1,12-12H60A32,32,0,0,1,92,172Zm-24,0a8,8,0,0,0-8-8H56v16h4A8,8,0,0,0,68,172Zm100,8a40,40,0,0,1-40,40H112a12,12,0,0,1-12-12V152a12,12,0,0,1,12-12h16A40,40,0,0,1,168,180Zm-24,0a16,16,0,0,0-16-16h-4v32h4A16,16,0,0,0,144,180ZM36,108V40A20,20,0,0,1,56,20h96a12,12,0,0,1,8.49,3.52l56,56A12,12,0,0,1,220,88v20a12,12,0,0,1-24,0v-4H148a12,12,0,0,1-12-12V44H60v64a12,12,0,0,1-24,0ZM160,57V80h23Z"/>',
  files:
    '<path d="M220.49,59.51l-40-40A12,12,0,0,0,172,16H92A20,20,0,0,0,72,36V56H56A20,20,0,0,0,36,76V216a20,20,0,0,0,20,20H164a20,20,0,0,0,20-20V196h20a20,20,0,0,0,20-20V68A12,12,0,0,0,220.49,59.51ZM160,212H60V80h67l33,33Zm40-40H184V108a12,12,0,0,0-3.51-8.49l-40-40A12,12,0,0,0,132,56H96V40h71l33,33Zm-56-28a12,12,0,0,1-12,12H88a12,12,0,0,1,0-24h44A12,12,0,0,1,144,144Zm0,40a12,12,0,0,1-12,12H88a12,12,0,0,1,0-24h44A12,12,0,0,1,144,184Z"/>',
  close:
    '<path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"/>',
};

export function boldIcon(name, options = {}) {
  const { className = "" } = options;
  const path = BOLD_PATHS[name];

  if (!path) {
    return "";
  }

  return `<svg class="${["icon-bold", className].filter(Boolean).join(" ")}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">${path}</svg>`;
}
