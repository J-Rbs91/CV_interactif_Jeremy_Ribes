import { sections } from "../data/sections.js";
import { natureClass } from "./renderUtils.js";
import {
  renderIdentity,
  renderIntroStrip,
  renderLiveProducts,
} from "./renderContact.js";
import { icon } from "../ui/icons.js";

function getActiveSection(activeSection) {
  return sections.find(({ id }) => id === activeSection) ?? sections[0];
}

function renderNavItem(section, activeSection, options = {}) {
  const { compact = false } = options;
  const isActive = section.id === activeSection;
  const navItemClassName = [
    "nav-item",
    natureClass(section.nature),
    compact ? "nav-item-mobile" : "",
    isActive ? "active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `<button type="button" class="${navItemClassName}" data-section="${section.id}" aria-pressed="${isActive ? "true" : "false"}">
    <div class="nav-icon">${icon(section.icon)}</div>
    <div class="nav-copy">
      <div class="nav-label">${compact ? (section.short ?? section.label) : section.label}</div>
    </div>
  </button>`;
}

function renderNavigation(activeSection, options = {}) {
  const { compact = false } = options;
  const navigationClassName = compact ? "mobile-nav" : "nav-list";

  if (compact) {
    /* Le rail ne montre que trois entrees sur six a 390 px, et le masque de
       debord dit deja qu'il y en a d'autres. Ce qu'il ne disait pas, c'est
       COMBIEN : le lecteur ignorait l'etendue de ce qui l'attendait, ce qui
       est precisement le travail d'une navigation. La mention passe donc
       d'une consigne d'usage — « balayer pour voir les autres sections » — a
       un reperage : ou l'on est, et sur combien. Une affordance qui a besoin
       d'une notice se reprend, elle ne se commente pas. */
    const position = sections.findIndex(({ id }) => id === activeSection) + 1;

    return `<div class="mobile-nav-shell" data-mobile-nav-shell>
      <div class="mobile-nav-meta">
        <div class="mobile-nav-title">Navigation</div>
        <div class="mobile-nav-hint">Section ${position || 1} sur ${sections.length}</div>
      </div>
      <div class="mobile-nav-viewport" data-mobile-nav-viewport>
        <div class="${navigationClassName}" data-mobile-nav>
          ${sections
            .map((section) =>
              renderNavItem(section, activeSection, { compact }),
            )
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

/* `inert` et non `aria-hidden`. La modale reste dans le document, en
   `opacity: 0`, pour que sa transition d'ouverture ait un etat de depart —
   c'est la meme raison qui garde les panneaux d'accordeon montes. Mais elle
   contient cinq elements focalisables : avec le seul `aria-hidden`, la
   douzieme tabulation depuis le haut de la page deposait le focus sur sa
   croix de fermeture, invisible et sans contour. L'utilisateur au clavier
   pilotait un formulaire qu'il ne voyait pas, et un lecteur d'ecran
   annoncait du vide pendant que le focus etait reel — un focus dans une
   zone `aria-hidden` est explicitement interdit.

   `inert` retire d'un seul attribut le parcours clavier ET l'arbre
   d'accessibilite, ce qui rend `aria-hidden` redondant : le poser en plus
   reintroduirait la contradiction qu'on corrige. */
function renderContactModal() {
  return `<div id="contact-modal" class="contact-modal-overlay" inert>
    <div class="contact-modal-body" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button type="button" class="contact-modal-close" data-close-contact aria-label="Fermer">&times;</button>
      <div class="contact-modal-title" id="contact-modal-title">Me contacter</div>
      <form class="contact-form">
        <label class="contact-label">
          Nom
          <input type="text" name="from_name" required autocomplete="name" minlength="2" maxlength="100" />
        </label>
        <label class="contact-label">
          Email
          <input type="email" name="from_email" required autocomplete="email" maxlength="150" />
        </label>
        <label class="contact-label">
          Message
          <textarea name="message" rows="5" required minlength="10" maxlength="2000"></textarea>
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
    ${renderLiveProducts()}
    ${renderNavigation(activeSection)}
    ${renderIntroStrip()}
    ${renderContactModal()}
  </div>`;
}

export function renderContentHeader(activeSection, options = {}) {
  const { className = "" } = options;
  const section = getActiveSection(activeSection);
  const contentHeadClassName = ["content-head", className]
    .filter(Boolean)
    .join(" ");

  return `<div class="${contentHeadClassName} ${natureClass(section.nature)}">
    <h2>${section.label}</h2>
    <span class="badge">${section.sub}</span>
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
      ${renderLiveProducts({ className: "live-products-mobile" })}
      ${renderIntroStrip({ className: "intro-strip-mobile" })}
    </div>

    <div class="mobile-nav-sticky" data-mobile-nav-sticky>
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
