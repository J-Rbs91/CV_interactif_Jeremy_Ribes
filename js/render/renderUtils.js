/* Une nature = une classe. Les composants consomment ensuite
   --n-ink / --n-mark / --n-surf / --n-line sans connaître la couleur portée.
   (charte détaillée en tête de css/base.css) */
export function natureClass(nature) {
  return `n-${nature ?? "cadre"}`;
}

export function linkHost(url) {
  return new URL(url).host.replace(/^www\./, "");
}

export function renderAccentTags(tags, options = {}) {
  const { className = "" } = options;
  const chipRowClassName = ["chip-row", className].filter(Boolean).join(" ");

  return `<div class="${chipRowClassName}">
    ${tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
  </div>`;
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
