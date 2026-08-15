import { boldIcon } from "./icons.js";
import { printDocument } from "./print.js";
import { canShareNatively, copyShareUrl, shareNatively } from "./share.js";

const COPY_MARK = boldIcon("copy");
const COPIED_MARK = boldIcon("check");

let escapeListenerBound = false;
let lastTrigger = null;
let copyResetTimeoutId = 0;

function getPanel() {
  return document.getElementById("export-panel");
}

function isOpen() {
  return getPanel()?.classList.contains("is-open") ?? false;
}

function openPanel(trigger) {
  const panel = getPanel();

  if (!panel) {
    return;
  }

  lastTrigger = trigger ?? null;
  panel.classList.add("is-open");
  panel.removeAttribute("inert");

  /* Le premier canal, pas le bouton de fermeture : au clavier comme au
     lecteur d'ecran, on entre dans le panneau par ce qu'il propose. */
  panel.querySelector(".export-channel")?.focus();
}

/* Meme ordre que la modale de contact, et pour la meme raison : un element
   qui devient inerte pendant qu'il porte le focus le rend au <body>, et la
   tabulation suivante repartirait du haut de la page. On rend donc le focus
   avant de poser `inert`. */
function closePanel() {
  const panel = getPanel();

  if (!panel) {
    return;
  }

  panel.classList.remove("is-open");

  if (panel.contains(document.activeElement)) {
    (lastTrigger ?? document.querySelector("[data-open-export]"))?.focus();
  }

  panel.setAttribute("inert", "");
  lastTrigger = null;
  resetCopyFeedback(panel);
}

function resetCopyFeedback(panel) {
  if (copyResetTimeoutId) {
    window.clearTimeout(copyResetTimeoutId);
    copyResetTimeoutId = 0;
  }

  const action = panel.querySelector("[data-copy-link]");

  action?.classList.remove("is-copied");
  setCopyState(action, "Copier", COPY_MARK);
}

/* Le libelle et la marque disent la meme chose et changent ensemble : une
   coche qui reste sur « Copier », ou l'inverse, se lit comme un etat a
   moitie tenu. */
function setCopyState(action, text, mark) {
  const label = action?.querySelector("[data-copy-label]");
  const markHost = action?.querySelector("[data-copy-mark]");

  if (label) {
    label.textContent = text;
  }

  if (markHost) {
    markHost.innerHTML = mark;
  }
}

/* La confirmation se dit sur le bouton lui-meme, la ou le geste a eu lieu.
   Une bulle flottante — ce que faisait l'ancien bouton de partage — se pose
   ailleurs que le regard, et disparait avant d'etre lue quand le pointeur a
   deja quitte la zone. */
async function handleCopy(action) {
  try {
    await copyShareUrl();
  } catch (error) {
    setCopyState(action, "Échec", COPY_MARK);
    return;
  }

  action.classList.add("is-copied");
  setCopyState(action, "Lien copié", COPIED_MARK);

  if (copyResetTimeoutId) {
    window.clearTimeout(copyResetTimeoutId);
  }

  copyResetTimeoutId = window.setTimeout(() => {
    action.classList.remove("is-copied");
    setCopyState(action, "Copier", COPY_MARK);
    copyResetTimeoutId = 0;
  }, 2400);
}

/* Fermer, puis imprimer — et dans cet ordre. La fenetre d'impression du
   navigateur prend la main sur toute la page : la rouvrir sur un panneau
   reste ouvert renvoie le lecteur, au retour, devant l'ecran qu'il venait
   de quitter. Le panneau se ferme donc d'abord, et le document part au
   cadre suivant, une fois la fermeture peinte. */
function handleExport(mode) {
  closePanel();

  window.requestAnimationFrame(() => {
    printDocument(mode);
  });
}

async function handleNativeShare() {
  const shared = await shareNatively();

  if (shared) {
    closePanel();
  }
}

function bindEscapeClose() {
  if (escapeListenerBound) {
    return;
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      closePanel();
    }
  });

  escapeListenerBound = true;
}

/* Appele a chaque rendu : le panneau et son bouton d'ouverture sont
   reconstruits avec le shell, et les elements etant neufs, aucun ecouteur
   ne s'empile. Seul celui d'Echap, pose sur le document, se garde d'etre
   repose deux fois. */
export function bindExportPanel() {
  document.querySelectorAll("[data-open-export]").forEach((trigger) => {
    trigger.addEventListener("click", () => openPanel(trigger));
  });

  const panel = getPanel();

  if (!panel) {
    bindEscapeClose();
    return;
  }

  panel.querySelector("[data-close-export]")?.addEventListener("click", closePanel);

  /* Le fond ferme, la feuille non : le clic ne compte que s'il tombe hors
     du document. */
  panel.addEventListener("click", (event) => {
    if (event.target === panel) {
      closePanel();
    }
  });

  /* Un canal ouvre son reseau et laisse le panneau derriere lui : au retour
     de l'onglet, le lecteur retrouve ce qu'il etait en train de faire. */
  panel.querySelectorAll("[data-share-channel]").forEach((channel) => {
    channel.addEventListener("click", () => {
      if (!channel.hasAttribute("target")) {
        closePanel();
      }
    });
  });

  panel
    .querySelector("[data-copy-link]")
    ?.addEventListener("click", (event) => handleCopy(event.currentTarget));

  if (canShareNatively()) {
    panel
      .querySelector("[data-native-share]")
      ?.addEventListener("click", handleNativeShare);
  }

  panel.querySelectorAll("[data-export-document]").forEach((button) => {
    button.addEventListener("click", () => {
      handleExport(button.dataset.exportDocument);
    });
  });

  bindEscapeClose();
}
