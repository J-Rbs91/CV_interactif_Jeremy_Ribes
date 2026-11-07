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

   **Le panneau parle la langue de la page** (css/panels.css) : noir, un seul
   accent, un titre géant en Archivo, des lignes séparées par un filet qui
   passent au fluo au survol, le même geste que les lignes d'index. Il s'ouvre
   comme un tiroir plutôt qu'une fenêtre : sur téléphone il prend l'écran.

   Il est monté une fois avec la page et ne porte aucun état : tout ce qui
   change (ouvert, copié) est une classe posée par js/ui/exportPanel.js.

   Les accroches `data-*` sont le contrat avec ce script et avec
   `npm run check:nav` ; les classes `p-*` ne sont que de la mise en forme. */

function renderChannel(channel) {
  /* `target` et `rel` sur les seuls canaux web. `mailto:` et `sms:` passent
     la main a une application du systeme : ouvrir une fenetre pour eux
     laisserait un onglet vide derriere le client de messagerie. */
  const target = channel.newTab
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";

  return `<a class="p-channel" href="${channel.href}"${target} data-share-channel="${channel.id}">
    <span class="p-mark">${boldIcon(channel.icon)}</span>
    <span class="p-channel-label">${channel.label}</span>
    <span class="p-arrow" aria-hidden="true">${channel.newTab ? "↗" : "→"}</span>
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

  return `<button type="button" class="p-channel p-native" data-native-share>
    <span class="p-mark">${boldIcon("device-mobile")}</span>
    <span class="p-channel-label">Partager depuis l’appareil</span>
    <span class="p-arrow" aria-hidden="true">→</span>
  </button>`;
}

function renderDocument(mode, key, title, text) {
  return `<button type="button" class="p-doc" data-export-document="${mode}">
    <span class="p-doc-key s-mono">${key}</span>
    <span class="p-doc-title">${title}</span>
    <span class="p-doc-text">${text}</span>
    <span class="p-arrow" aria-hidden="true">↓</span>
  </button>`;
}

/* Le code QR existe deja : `assets/img/qr-cv.svg` est celui du recto A4, ou
   il rouvre le chemin depuis le papier. Ici il fait l'inverse — il fait
   passer le CV de l'ecran ou on le lit au telephone qu'on a en main, ce
   qu'aucun des six canaux ne fait sans passer par un compte.

   Il est pose sur une tuile claire : ses modules sont d'encre sombre sur fond
   transparent, donc invisibles sur le noir du panneau — un code qu'aucun
   telephone ne lirait. */
function renderQr() {
  return `<div class="p-qr">
    <span class="p-qr-tile"><img src="./assets/img/qr-cv.svg" width="37" height="37" alt="Code QR vers le CV interactif de ${contact.name}" /></span>
    <span class="p-qr-text">Ouvrir le CV sur un téléphone, sans saisir l’adresse.</span>
  </div>`;
}

export function renderExportPanel() {
  return `<div id="export-panel" class="p-overlay" inert>
    <div class="p-sheet" role="dialog" aria-modal="true" aria-labelledby="export-panel-title">
      <button type="button" class="p-close s-mono" data-close-export aria-label="Fermer"><span>Fermer</span>${boldIcon("close")}</button>

      <header class="p-head">
        <div class="p-kicker s-mono">CV interactif</div>
        <h2 class="p-title" id="export-panel-title">Partager<br />&amp; Exporter</h2>
        <div class="p-subject s-mono">${contact.name} · ${contact.role}</div>
      </header>

      <section class="p-part">
        <h3 class="p-part-title s-mono"><span>01</span>Partager le lien</h3>
        <div class="p-channels">${shareChannels.map(renderChannel).join("")}${renderNativeShare()}</div>
        <div class="p-link">
          <span class="p-url s-mono">${contact.site.host}</span>
          <button type="button" class="p-copy s-mono" data-copy-link>
            <span class="p-copy-mark" data-copy-mark>${boldIcon("copy")}</span>
            <span data-copy-label>Copier</span>
          </button>
        </div>
        ${renderQr()}
      </section>

      <section class="p-part">
        <h3 class="p-part-title s-mono"><span>02</span>Exporter</h3>
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
        <p class="p-note">Les deux s’ouvrent dans la fenêtre d’impression : imprimer, ou enregistrer en PDF.</p>
      </section>
    </div>
  </div>`;
}
