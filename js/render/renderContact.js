import { contact } from "../data/contact.js";
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

/* La vue integrale existait deja — `renderPrintDocument()` la produit, toutes
   fiches depliees, et elle sert le bloc lu par les moteurs. Mais elle n'etait
   atteignable que par la commande d'impression du navigateur : aucun bouton
   nulle part. Un lecteur qui voulait tout voir devait cliquer les six
   sections puis ouvrir les onze cartes, soit dix-sept interactions pour un
   contenu que le document sait rendre d'un bloc.

   C'est aussi ce que fait un recruteur qui verse le CV a un dossier.

   Le bouton disait « CV complet · PDF ». Un CV est un recto A4 : c'est la
   forme que le mot promet, et le document en fait six pages. L'ecart ne se
   voit qu'apres le clic, quand le lecteur a deja engage son geste — et ce
   qu'il decouvre alors n'est pas un CV trop long, c'est autre chose, un
   dossier qui deplie chaque fiche. Le libelle nomme donc ce qui s'ouvre
   vraiment, et « CV complet · PDF » designe maintenant le recto A4 rendu par
   `renderCvDocument()` — le bouton pose juste avant.

   Les deux boutons partagent `[data-print]` et ne different que par sa
   valeur, lue par `setPrintMode()` : c'est toujours `window.print()` qui
   sort, et `beforeprint` qui monte le document demande. */
function renderFullPresentationButton(itemClassName) {
  return `<button
      type="button"
      class="${buildClassName("contact-form-trigger", itemClassName)}"
      data-print
      title="Ouvrir la présentation entière, toutes fiches dépliées — à imprimer ou enregistrer en PDF"
    >
      <span class="ic">${icon("printer")}</span> Présentation complète
    </button>`;
}

/* Le recto A4 — le CV au sens strict, celui qu'un recruteur attend quand il
   demande « le CV ». Il precede la presentation complete parce que c'est le
   document ordinaire : celui qu'on verse a un dossier, qu'on imprime, qu'on
   transfere. La presentation complete repond a la question d'apres. */
function renderCvButton(itemClassName) {
  return `<button
      type="button"
      class="${buildClassName("contact-form-trigger", itemClassName)}"
      data-print="cv"
      title="Le CV en un recto A4 — à imprimer ou enregistrer en PDF"
    >
      <span class="ic">${icon("page")}</span> CV complet · PDF
    </button>`;
}

function renderContactItem(item, itemClassName) {
  if (item.type === "contact-form") {
    return `${renderShareButton(itemClassName)}${renderCvButton(itemClassName)}${renderFullPresentationButton(itemClassName)}<button type="button" class="${buildClassName("contact-form-trigger", itemClassName)}" data-open-contact>
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
