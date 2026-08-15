import { renderPrintDocument } from "../render/renderPrint.js";

const printViewId = "print-view";
let printView = null;

function mountPrintView() {
  if (printView || typeof document === "undefined") {
    return;
  }

  printView = document.createElement("div");
  printView.id = printViewId;
  printView.setAttribute("aria-hidden", "true");
  printView.innerHTML = renderPrintDocument();
  document.body.appendChild(printView);
}

function unmountPrintView() {
  if (!printView) {
    return;
  }

  printView.remove();
  printView = null;
}

/* Le document integral n'etait joignable que par la commande d'impression du
   navigateur. `beforeprint` reste la voie qui compte — c'est elle qui sert
   un Ctrl+P, quel qu'en soit le declencheur — et le bouton ne fait que
   l'appeler : rien n'est duplique, et un navigateur qui monterait la vue
   autrement continue de fonctionner.

   `window.print()` est synchrone et bloquant : les ecouteurs de `beforeprint`
   ont donc deja monte la vue quand la boite de dialogue s'ouvre. Ne pas
   monter la vue ici en plus, ce serait la monter deux fois.

   Appele depuis `bindUi()` et non depuis `bindPrint()` : les ecouteurs de
   fenetre se posent une fois, les boutons sont reconstruits a chaque rendu
   et doivent etre relies a chaque fois. Les elements etant neufs, aucun
   ecouteur ne s'empile. */
export function bindPrintTriggers() {
  document.querySelectorAll("[data-print]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });
}

export function bindPrint() {
  if (typeof window === "undefined") {
    return;
  }

  window.addEventListener("beforeprint", mountPrintView);
  window.addEventListener("afterprint", unmountPrintView);

  // Safari ne déclenche pas toujours beforeprint : on double avec matchMedia.
  const printQueryList = window.matchMedia("print");
  const handlePrintChange = (event) => {
    if (event.matches) {
      mountPrintView();
    } else {
      unmountPrintView();
    }
  };

  if (typeof printQueryList.addEventListener === "function") {
    printQueryList.addEventListener("change", handlePrintChange);
  } else if (typeof printQueryList.addListener === "function") {
    printQueryList.addListener(handlePrintChange);
  }
}
