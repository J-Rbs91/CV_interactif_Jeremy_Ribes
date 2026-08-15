import { contact } from "../data/contact.js";
import { outils } from "../data/outils.js";
import { projetsTransverses } from "../data/projets.js";
import { icon } from "../ui/icons.js";
import { renderExportTrigger } from "./renderExport.js";
import { natureClass } from "./renderUtils.js";

function buildClassName(baseClassName, itemClassName) {
  return [baseClassName, itemClassName].filter(Boolean).join(" ");
}

/* Trois commandes tenaient cette ligne — partager, le recto A4, la
   presentation complete — et repondaient toutes a la meme question : comment
   j'emporte ce CV. Elles sont passees derriere une porte unique, que
   `renderExportTrigger()` ouvre et que `js/render/renderExport.js`
   documente. Ne reste ici que le contact, qui est autre chose. */
function renderContactItem(item, itemClassName) {
  if (item.type === "contact-form") {
    return `${renderExportTrigger(itemClassName)}<button type="button" class="${buildClassName("contact-form-trigger", itemClassName)}" data-open-contact>
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

/* Bandeau des produits en ligne, dérivé des liens déclarés dans outils.js et
   projets.js. `liveProduct: false` exclut une entrée du bandeau. */
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
        name: projet.title.split(" : ")[0],
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

/* Le portrait est le même objet partout — panneau, résumé étroit, papier —
   et ne diffère que par la taille rendue, tenue en CSS. */
export function renderPortrait(baseClassName, itemClassName = "") {
  const { portrait, name } = contact;

  if (!portrait) {
    return "";
  }

  return `<img
    class="${buildClassName(baseClassName, itemClassName)}"
    src="${portrait.src}"
    width="${portrait.width}"
    height="${portrait.height}"
    alt="${name}"
  />`;
}

export function renderIdentity(options = {}) {
  const {
    className = "",
    rowClassName = "",
    itemClassName = "",
    photoClassName = "",
  } = options;
  const identityClassName = ["identity", className].filter(Boolean).join(" ");
  const contactRowClassName = ["contact-row", rowClassName]
    .filter(Boolean)
    .join(" ");

  /* Le nom, ses deux sous-titres et le portrait forment une seule en-tête :
     c'est la grille de `.identity-head` qui place la photo à droite du nom.
     La ligne de contact lui reste extérieure — elle prend toute la largeur,
     sous le filet. */
  return `<div class="${identityClassName}">
    <div class="identity-head">
      <h1>${contact.name}</h1>
      <div class="role">${contact.role}</div>
      ${renderPortrait("identity-photo", photoClassName)}
      <div class="role2">${contact.secondaryRole}</div>
    </div>
    <div class="${contactRowClassName}">${renderContactItems(itemClassName)}</div>
  </div>`;
}

export function renderIntroStrip(options = {}) {
  const { className = "" } = options;
  const introStripClassName = ["intro-strip", className]
    .filter(Boolean)
    .join(" ");

  /* Le texte est pose entier : `js/ui/typewriter.js` le redecoupe pour le
     faire apparaitre lettre a lettre, et le repli quand il ne le fait pas
     est le paragraphe lui-meme. */
  return `<div class="${introStripClassName}"><p data-typewriter>${contact.intro}</p></div>`;
}
