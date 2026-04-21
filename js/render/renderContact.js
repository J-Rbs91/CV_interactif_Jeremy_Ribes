import { contact } from "../data/contact.js";

function buildClassName(baseClassName, itemClassName) {
  return [baseClassName, itemClassName].filter(Boolean).join(" ");
}

function renderShareIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M14 4h6v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M10 14 20 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;
}

function renderShareButton(itemClassName) {
  return `<button
      type="button"
      class="${buildClassName("contact-form-trigger share-trigger", itemClassName)}"
      data-share
      aria-label="Partager ce CV"
      title="Partager"
    >
      <span class="ic">${renderShareIcon()}</span> Partager
      <span class="share-feedback" data-share-feedback role="status" aria-live="polite">Lien copi\u00e9 !</span>
    </button>`;
}

function renderContactItem(item, itemClassName) {
  if (item.type === "contact-form") {
    return `${renderShareButton(itemClassName)}<button type="button" class="${buildClassName("contact-form-trigger", itemClassName)}" data-open-contact>
      <span class="ic">${item.icon}</span> ${item.text}
    </button>`;
  }

  return `<span${itemClassName ? ` class="${itemClassName}"` : ""}>
    <span class="ic">${item.icon}</span> ${item.text}
  </span>`;
}

function renderContactItems(itemClassName = "") {
  return contact.items
    .map((item) => renderContactItem(item, itemClassName))
    .join("");
}

export function renderIdentity(options = {}) {
  const {
    className = "",
    rowClassName = "",
    itemClassName = "",
  } = options;
  const identityClassName = ["identity", className].filter(Boolean).join(" ");
  const contactRowClassName = ["contact-row", rowClassName]
    .filter(Boolean)
    .join(" ");

  return `<div class="${identityClassName}">
    <h1>${contact.name}</h1>
    <div class="role">${contact.role}</div>
    <div class="role2">${contact.secondaryRole}</div>
    <div class="${contactRowClassName}">${renderContactItems(itemClassName)}</div>
  </div>`;
}

export function renderIntroStrip(options = {}) {
  const { className = "" } = options;
  const introStripClassName = ["intro-strip", className].filter(Boolean).join(" ");

  return `<div class="${introStripClassName}"><p>${contact.intro}</p></div>`;
}
