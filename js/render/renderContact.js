import { contact } from "../data/contact.js";

function renderContactItem(item, classAttribute, isMobileView) {
  const content = `<span class="ic">${item.icon}</span> ${item.text}`;
  const shouldRenderLink =
    item.type === "email" || (item.type === "phone" && isMobileView);
  const linkClassAttribute = classAttribute
    ? classAttribute.replace('class="', 'class="contact-link ')
    : ' class="contact-link"';

  if (!shouldRenderLink) {
    return `<span${classAttribute}>${content}</span>`;
  }

  return `<a${linkClassAttribute} href="${item.href}">${content}</a>`;
}

function renderContactItems(itemClassName = "", isMobileView = false) {
  const classAttribute = itemClassName ? ` class="${itemClassName}"` : "";

  return contact.items
    .map((item) => renderContactItem(item, classAttribute, isMobileView))
    .join("");
}

export function renderIdentity(options = {}) {
  const {
    className = "",
    rowClassName = "",
    itemClassName = "",
    isMobileView = false,
  } = options;
  const identityClassName = ["identity", className].filter(Boolean).join(" ");
  const contactRowClassName = ["contact-row", rowClassName]
    .filter(Boolean)
    .join(" ");

  return `<div class="${identityClassName}">
    <h1>${contact.name}</h1>
    <div class="role">${contact.role}</div>
    <div class="role2">${contact.secondaryRole}</div>
    <div class="${contactRowClassName}">${renderContactItems(itemClassName, isMobileView)}</div>
  </div>`;
}

export function renderIntroStrip(options = {}) {
  const { className = "" } = options;
  const introStripClassName = ["intro-strip", className].filter(Boolean).join(" ");

  return `<div class="${introStripClassName}"><p>${contact.intro}</p></div>`;
}
