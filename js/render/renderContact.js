import { contact } from "../data/contact.js";

function renderContactItems() {
  return contact.items
    .map((item) => `<span><span class="ic">${item.icon}</span> ${item.text}</span>`)
    .join("");
}

export function renderIdentity() {
  return `<div class="identity">
    <h1>${contact.name}</h1>
    <div class="role">${contact.role}</div>
    <div class="role2">${contact.secondaryRole}</div>
    <div class="contact-row">${renderContactItems()}</div>
  </div>`;
}

export function renderIntroStrip() {
  return `<div class="intro-strip"><p>${contact.intro}</p></div>`;
}
