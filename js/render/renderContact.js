import { contact } from "../data/contact.js";

function renderContactItems(itemClassName = "") {
  const classAttribute = itemClassName ? ` class="${itemClassName}"` : "";

  return contact.items
    .map(
      (item) => `<span${classAttribute}><span class="ic">${item.icon}</span> ${item.text}</span>`,
    )
    .join("");
}

export function renderIdentity(options = {}) {
  const { className = "", rowClassName = "", itemClassName = "" } = options;
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
