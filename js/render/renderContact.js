import { contact } from "../data/contact.js";
import { outils } from "../data/outils.js";
import { projetsTransverses } from "../data/projets.js";

function buildClassName(baseClassName, itemClassName) {
  return [baseClassName, itemClassName].filter(Boolean).join(" ");
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
        printLabel: outil.link.printLabel,
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
export function renderContactModal() {
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
