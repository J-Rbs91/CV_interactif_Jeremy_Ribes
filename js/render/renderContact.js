import { contact } from "../data/contact.js";

const readingNote = {
  title: "Note de lecture",
  body:
    "Ce CV interactif a &eacute;t&eacute; con&ccedil;u pour une double lecture : humaine, pour une navigation claire et structur&eacute;e ; automatis&eacute;e, pour une extraction fiable des informations cl&eacute;s. Cette attention r&eacute;pond aux usages actuels du recrutement, o&ugrave; les outils d&rsquo;analyse assist&eacute;e par IA occupent une place croissante.",
};

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

export function renderReadingNote(options = {}) {
  const { className = "", titleId = "reading-note-title" } = options;
  const readingNoteClassName = ["reading-note", className]
    .filter(Boolean)
    .join(" ");

  return `<aside class="${readingNoteClassName}" aria-labelledby="${titleId}">
    <h2 class="reading-note-title" id="${titleId}">${readingNote.title}</h2>
    <p class="reading-note-body">${readingNote.body}</p>
  </aside>`;
}
