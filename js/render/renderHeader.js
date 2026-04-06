import { sections } from "../data/sections.js";
import { renderIdentity, renderIntroStrip } from "./renderContact.js";

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

export function renderSidebar(activeSection) {
  return `<div class="panel-left">
    ${renderIdentity()}
    ${renderIntroStrip()}
    ${renderNavigation(activeSection)}
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
        rowClassName: "contact-row-mobile",
        itemClassName: "contact-pill",
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
  </div>`;
}
