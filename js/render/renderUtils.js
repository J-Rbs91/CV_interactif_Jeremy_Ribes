/* Une nature = une classe. Les composants consomment ensuite
   --n-ink / --n-mark / --n-surf / --n-line sans connaître la couleur portée.
   (charte détaillée en tête de css/base.css) */
export function natureClass(nature) {
  return `n-${nature ?? "cadre"}`;
}

export function linkHost(url) {
  return new URL(url).host.replace(/^www\./, "");
}

/* `element` : les deux accordéons posent leurs étiquettes à l'intérieur du
   bouton de dépliage, et un <div> dans un <button> n'est pas du contenu
   admis — le navigateur referme le bouton avant la rangée, et une partie de
   la carte se retrouve hors de la zone cliquable. */
export function renderAccentTags(tags, options = {}) {
  const { className = "", element = "div" } = options;
  const chipRowClassName = ["chip-row", className].filter(Boolean).join(" ");

  return `<${element} class="${chipRowClassName}">
    ${tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
  </${element}>`;
}

/* La commande de dépliage, commune aux Outils et aux Compétences.

   Un chevron seul ne dit pas qu'on peut déplier : posé à l'extrémité droite
   d'une colonne large, il se lit comme un ornement de fin de ligne. Le mot,
   lui, se lit. Il prend la langue de la seconde couche — mono capitalisée,
   comme les catégories, les statuts et les liens.

   `aria-hidden` : l'état est déjà porté par `aria-expanded` sur le bouton.
   Sans lui, le nom accessible du bouton contiendrait les deux libellés. */
export function renderDiscloseCommand() {
  return `<span class="accordion-cmd" aria-hidden="true">
    <span class="accordion-cmd-label is-closed">Déplier le détail</span>
    <span class="accordion-cmd-label is-open">Replier</span>
    <span class="accordion-chevron"></span>
  </span>`;
}

export function renderTagRow(tags) {
  return `<div class="tag-row">
    ${tags
      .map(
        (tag) =>
          `<span class="tag ${natureClass(tag.nature)}">${tag.label}</span>`,
      )
      .join("")}
  </div>`;
}

export function renderBulletList(items) {
  return `<ul class="tl-bullets">
    ${items.map((item) => `<li>${item}</li>`).join("")}
  </ul>`;
}

export function renderSmallCard(item, options = {}) {
  const { titleSize = "14px", dimText = true } = options;
  const textClassName = ["card-text", dimText ? "dim" : ""]
    .filter(Boolean)
    .join(" ");

  return `<div class="card-sm ${natureClass(item.nature)}">
    <div class="card-title" style="font-size:${titleSize}"><div class="dot"></div>${item.title}</div>
    <div class="${textClassName}">${item.text}</div>
  </div>`;
}
