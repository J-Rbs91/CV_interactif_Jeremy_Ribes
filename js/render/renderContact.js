import { contact } from "../data/contact.js";
import { kpiItems } from "../data/sections.js";
import { outils } from "../data/outils.js";
import { projetsTransverses } from "../data/projets.js";
import { icon } from "../ui/icons.js";
import { natureClass } from "./renderUtils.js";

function buildClassName(baseClassName, itemClassName) {
  return [baseClassName, itemClassName].filter(Boolean).join(" ");
}

function renderShareButton(itemClassName) {
  return `<button
      type="button"
      class="${buildClassName("contact-form-trigger share-trigger", itemClassName)}"
      data-share
      aria-label="Partager ce CV"
      title="Partager"
    >
      <span class="ic">${icon("share")}</span> Partager
      <span class="share-feedback" data-share-feedback role="status" aria-live="polite">Lien copié !</span>
    </button>`;
}

function renderContactItem(item, itemClassName) {
  if (item.type === "contact-form") {
    return `${renderShareButton(itemClassName)}<button type="button" class="${buildClassName("contact-form-trigger", itemClassName)}" data-open-contact>
      <span class="ic">${icon(item.icon)}</span> ${item.text}
    </button>`;
  }

  return `<span${itemClassName ? ` class="${itemClassName}"` : ""}>
    <span class="ic">${icon(item.icon)}</span> ${item.text}
  </span>`;
}

function renderContactItems(itemClassName = "") {
  return contact.items
    .map((item) => renderContactItem(item, itemClassName))
    .join("");
}

/* Bandeau de preuve : les trois chiffres que le recruteur doit lire
   avant d'avoir cliqué où que ce soit. */
function renderProofStrip() {
  return `<div class="proof-strip">
    ${kpiItems
      .map(
        (kpi) => `<div class="proof-item ${natureClass(kpi.nature)}">
          <div class="proof-value">${kpi.value}</div>
          <div class="proof-label">${kpi.label}</div>
        </div>`,
      )
      .join("")}
  </div>`;
}

/* Produits réellement en ligne, dérivés des données existantes : c'est
   l'argument le plus fort du dossier, il ne doit pas coûter deux clics. */
export function getLiveProducts() {
  return [
    ...outils
      .filter((outil) => outil.link && outil.liveProduct !== false)
      .map((outil) => ({
        name: outil.title,
        url: outil.link.url,
        nature: "preuve",
      })),
    ...projetsTransverses
      .filter((projet) => projet.link)
      .map((projet) => ({
        name: projet.title.split(" — ")[0],
        url: projet.link.url,
        nature: "preuve",
      })),
  ];
}

export function renderLiveProducts(options = {}) {
  const { className = "" } = options;
  const products = getLiveProducts();

  if (!products.length) {
    return "";
  }

  const wrapperClassName = ["live-products", className]
    .filter(Boolean)
    .join(" ");

  return `<div class="${wrapperClassName}">
    <div class="live-products-label">Produits en ligne</div>
    <div class="live-products-row">
      ${products
        .map(
          (product) =>
            `<a class="live-product ${natureClass(product.nature)}" href="${product.url}" target="_blank" rel="noopener noreferrer">${product.name}${icon("arrow-up-right")}</a>`,
        )
        .join("")}
    </div>
  </div>`;
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
    ${renderProofStrip()}
    <div class="${contactRowClassName}">${renderContactItems(itemClassName)}</div>
  </div>`;
}

export function renderIntroStrip(options = {}) {
  const { className = "" } = options;
  const introStripClassName = ["intro-strip", className]
    .filter(Boolean)
    .join(" ");

  return `<div class="${introStripClassName}"><p>${contact.intro}</p></div>`;
}
