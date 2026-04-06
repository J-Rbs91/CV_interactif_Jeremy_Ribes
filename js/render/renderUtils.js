export function renderAccentTags(tags, color, options = {}) {
  const {
    padding = "2px 7px",
    radius = "3px",
    gap = "4px",
    marginTop = "8px",
  } = options;

  return `<div style="display:flex;gap:${gap};flex-wrap:wrap;margin-top:${marginTop}">
    ${tags
      .map(
        (tag) =>
          `<span style="font-size:10px;padding:${padding};border-radius:${radius};background:${color}15;color:${color};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border:1px solid ${color}25">${tag}</span>`,
      )
      .join("")}
  </div>`;
}

export function renderTagRow(tags) {
  return `<div class="tag-row">
    ${tags
      .map((tag) => `<span class="tag ${tag.className}">${tag.label}</span>`)
      .join("")}
  </div>`;
}

export function renderBulletList(items) {
  return `<ul class="tl-bullets">
    ${items.map((item) => `<li>${item}</li>`).join("")}
  </ul>`;
}

export function renderSmallCard(item) {
  return `<div class="card-sm">
    <div class="card-title" style="font-size:14px"><div class="dot" style="background:${item.color}"></div>${item.title}</div>
    <div class="card-text dim">${item.text}</div>
  </div>`;
}
