import { contact } from "../data/contact.js";

function buildClassName(baseClassName, itemClassName) {
  return [baseClassName, itemClassName].filter(Boolean).join(" ");
}

function renderContactItem(item, itemClassName) {
  if (item.type === "contact-form") {
    return `<button type="button" class="${buildClassName("contact-form-trigger", itemClassName)}" data-open-contact>
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
