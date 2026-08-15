import { contact } from "../data/contact.js";
import { boldIcon } from "../ui/icons.js";
import { canShareNatively, shareChannels } from "../ui/share.js";

/* Partager & Exporter — un seul endroit pour ce qui sort du site
   -------------------------------------------------------------------------
   La ligne de contact portait quatre commandes de front : partager, le
   recto A4, la presentation complete, me contacter. Trois d'entre elles
   repondaient a la meme question — comment j'emporte ce CV — et se
   disputaient la meme ligne, chacune payant le prix d'une decision a
   prendre avant d'avoir compris ce qu'elle offrait. Sur un telephone,
   elles occupaient quatre lignes pleines au-dessus du premier mot du CV.

   Elles sont maintenant derriere une porte unique, et le panneau qui
   s'ouvre a la place de les enumerer les classe : d'un cote le lien, qui
   circule ; de l'autre les documents, qui se deposent. C'est la seule
   distinction dont le lecteur a besoin, et elle se lit avant de cliquer.

   **Le panneau est compose comme le recto A4**, pas comme une modale de
   site. Meme gouttiere de libelle en mono capitale, memes filets fins,
   meme titre sous un trait epais, meme absence de carte et de rayon. Ce
   n'est pas une citation de style : le panneau donne acces au document, et
   il vaut mieux qu'il en ait deja l'air.

   Le rendu est un attribut du shell, comme la modale de contact : il est
   reconstruit a chaque rendu de section et ne porte donc aucun etat. */

function renderChannel(channel) {
  /* `target` et `rel` sur les seuls canaux web. `mailto:` et `sms:` passent
     la main a une application du systeme : ouvrir une fenetre pour eux
     laisserait un onglet vide derriere le client de messagerie. */
  const target = channel.newTab
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";

  return `<a class="export-channel" href="${channel.href}"${target} data-share-channel="${channel.id}">
    <span class="export-channel-mark">${boldIcon(channel.icon)}</span>
    <span class="export-channel-label">${channel.label}</span>
  </a>`;
}

/* Le partage du systeme n'apparait que la ou il existe — un telephone, une
   tablette. Sur un poste de travail, `navigator.share` est absent et le
   bouton serait une promesse sans suite ; c'est le seul element du panneau
   dont la presence depend de l'appareil. */
function renderNativeShare() {
  if (!canShareNatively()) {
    return "";
  }

  return `<button type="button" class="export-native" data-native-share>
    <span class="export-channel-mark">${boldIcon("device-mobile")}</span>
    <span class="export-native-label">Partager depuis l’appareil</span>
  </button>`;
}

/* Meme gouttiere de libelle que les lignes du dessus, et c'est la seule
   raison pour laquelle la marque est dans la colonne de matiere et non a
   gauche du libelle : une gouttiere qui se decale d'un bloc a l'autre n'est
   plus une colonne, c'est un alignement approximatif. Le recto tient la
   sienne sur toute la page, celui-ci sur tout le panneau. */
function renderDocument(mode, key, title, text) {
  return `<button type="button" class="export-doc" data-export-document="${mode}">
    <span class="export-doc-key">${key}</span>
    <span class="export-doc-main">
      <span class="export-doc-mark">${boldIcon(mode === "cv" ? "file-pdf" : "files")}</span>
      <span class="export-doc-body">
        <span class="export-doc-title">${title}</span>
        <span class="export-doc-text">${text}</span>
      </span>
    </span>
  </button>`;
}

/* Le code QR existe deja : `assets/img/qr-cv.svg` est celui du recto A4, ou
   il rouvre le chemin depuis le papier. Ici il fait l'inverse — il fait
   passer le CV de l'ecran ou on le lit au telephone qu'on a en main, ce
   qu'aucun des six canaux ne fait sans passer par un compte. */
function renderQr() {
  return `<div class="export-row export-qr-row">
    <div class="export-key">Scanner</div>
    <div class="export-val export-qr">
      <img src="./assets/img/qr-cv.svg" width="37" height="37" alt="Code QR vers le CV interactif de ${contact.name}" />
      <span class="export-qr-text">Ouvrir le CV sur un téléphone, sans saisir l’adresse.</span>
    </div>
  </div>`;
}

export function renderExportTrigger(itemClassName = "") {
  const className = ["contact-form-trigger", "export-trigger", itemClassName]
    .filter(Boolean)
    .join(" ");

  return `<button
      type="button"
      class="${className}"
      data-open-export
      aria-haspopup="dialog"
      title="Partager le lien du CV, ou en exporter les documents en PDF"
    >
      <span class="ic">${boldIcon("share-network")}</span> Partager &amp; Exporter
    </button>`;
}

export function renderExportPanel() {
  return `<div id="export-panel" class="export-overlay" inert>
    <div class="export-sheet" role="dialog" aria-modal="true" aria-labelledby="export-panel-title">
      <button type="button" class="export-close" data-close-export aria-label="Fermer">${boldIcon("close")}</button>

      <header class="export-head">
        <div class="export-kicker">CV interactif</div>
        <h2 class="export-title" id="export-panel-title">Partager &amp; Exporter</h2>
        <div class="export-subject">${contact.name} · ${contact.role}</div>
      </header>

      <section class="export-part">
        <h3 class="export-part-title">Partager le lien</h3>
        <div class="export-channels">${shareChannels.map(renderChannel).join("")}</div>
        ${renderNativeShare()}
        <div class="export-row">
          <div class="export-key">Lien</div>
          <div class="export-val export-link">
            <span class="export-url">${contact.site.host}</span>
            <button type="button" class="export-action" data-copy-link>
              <span class="export-action-mark" data-copy-mark>${boldIcon("copy")}</span>
              <span class="export-action-label" data-copy-label>Copier</span>
            </button>
          </div>
        </div>
        ${renderQr()}
      </section>

      <section class="export-part">
        <h3 class="export-part-title">Exporter</h3>
        ${renderDocument(
          "cv",
          "PDF · 1 page",
          "CV · recto A4",
          "Compétences prouvées, résultats, parcours condensé. Le document qu’on verse à un dossier.",
        )}
        ${renderDocument(
          "integral",
          "PDF · 6 pages",
          "Présentation complète",
          "Toutes les sections, toutes les fiches dépliées, dans l’ordre du site.",
        )}
        <p class="export-note">Les deux s’ouvrent dans la fenêtre d’impression : imprimer, ou enregistrer en PDF.</p>
      </section>
    </div>
  </div>`;
}
