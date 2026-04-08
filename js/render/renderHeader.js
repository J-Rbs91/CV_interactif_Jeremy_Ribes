import { sections } from "../data/sections.js";
import {
  renderIdentity,
  renderIntroStrip,
  renderReadingNote,
} from "./renderContact.js";

function getActiveSection(activeSection) {
  return sections.find(({ id }) => id === activeSection) ?? sections[0];
}

function renderNavItem(section, activeSection, options = {}) {
  const { compact = false } = options;
  const isActive = section.id === activeSection;
  const navItemClassName = [
    "nav-item",
    compact ? "nav-item-mobile" : "",
    isActive ? "active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `<button type="button" class="${navItemClassName}" data-section="${section.id}" aria-pressed="${isActive ? "true" : "false"}">
    <div class="nav-icon" style="background:${section.bg};color:${section.color}">${section.icon}</div>
    <div class="nav-copy">
      <div class="nav-label">${section.label}</div>
      ${compact ? "" : `<div class="nav-sub">${section.sub}</div>`}
    </div>
  </button>`;
}

function renderNavigation(activeSection, options = {}) {
  const { compact = false } = options;
  const navigationClassName = compact ? "mobile-nav" : "nav-list";

  if (compact) {
    return `<div class="mobile-nav-shell" data-mobile-nav-shell>
      <div class="mobile-nav-meta">
        <div class="mobile-nav-title">Navigation</div>
        <div class="mobile-nav-hint">Balayer pour voir les autres sections</div>
      </div>
      <div class="mobile-nav-viewport" data-mobile-nav-viewport>
        <div class="${navigationClassName}" data-mobile-nav>
          ${sections
            .map((section) => renderNavItem(section, activeSection, { compact }))
            .join("")}
        </div>
      </div>
    </div>`;
  }

  return `<div class="${navigationClassName}">
    ${sections
      .map((section) => renderNavItem(section, activeSection, { compact }))
      .join("")}
  </div>`;
}

function renderContactModal() {
  return `<div id="contact-modal" class="contact-modal-overlay" aria-hidden="true">
    <div class="contact-modal-body" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button type="button" class="contact-modal-close" data-close-contact aria-label="Fermer">&times;</button>
      <div class="contact-modal-title" id="contact-modal-title">Me contacter</div>
      <form class="contact-form">
        <label class="contact-label">
          Nom
          <input type="text" name="from_name" required autocomplete="name" />
        </label>
        <label class="contact-label">
          Email
          <input type="email" name="from_email" required autocomplete="email" />
        </label>
        <label class="contact-label">
          Message
          <textarea name="message" rows="5" required></textarea>
        </label>
        <button type="submit" class="contact-submit">Envoyer</button>
      </form>
      <div class="contact-feedback" data-contact-feedback></div>
    </div>
  </div>`;
}

export function renderSidebar(activeSection) {
  return `<div class="panel-left">
    ${renderIdentity()}
    ${renderReadingNote({ titleId: "reading-note-title-desktop" })}
    ${renderIntroStrip()}
    ${renderNavigation(activeSection)}
    ${renderContactModal()}
  </div>`;
}

export function renderContentHeader(activeSection, options = {}) {
  const { className = "" } = options;
  const section = getActiveSection(activeSection);
  const contentHeadClassName = ["content-head", className].filter(Boolean).join(" ");

  return `<div class="${contentHeadClassName}">
    <h2>${section.label}</h2>
    <span class="badge" style="background:${section.bg};color:${section.color}">${section.sub}</span>
  </div>`;
}

export function renderMobileShell(activeSection, sectionContent) {
  return `<div class="mobile-shell">
    <div class="mobile-summary">
      ${renderIdentity({
        className: "identity-mobile",
        isMobileView: true,
        rowClassName: "contact-row-mobile",
        itemClassName: "contact-pill",
      })}
      ${renderReadingNote({
        className: "reading-note-mobile",
        titleId: "reading-note-title-mobile",
      })}
      ${renderIntroStrip({ className: "intro-strip-mobile" })}
    </div>

    <div class="mobile-nav-sticky">
      ${renderNavigation(activeSection, { compact: true })}
    </div>

    <div class="mobile-main">
      ${renderContentHeader(activeSection, { className: "content-head-mobile" })}
      <div class="content-body content-body-mobile">
        ${sectionContent}
      </div>
    </div>
    ${renderContactModal()}
  </div>`;
}
