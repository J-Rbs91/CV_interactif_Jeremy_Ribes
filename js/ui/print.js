import { renderCvDocument } from "../render/renderCv.js";
import { renderPrintDocument } from "../render/renderPrint.js";

const printViewId = "print-view";
let printView = null;

/* Deux documents sortent par la meme commande d'impression : la presentation
   complete, six pages, et le recto A4. Le mode est pose par le bouton juste
   avant `window.print()`, lu par `mountPrintView()` et **toujours** rendu a
   sa valeur par defaut au demontage.

   Ce retour au defaut n'est pas une precaution : c'est lui qui garantit qu'un
   Ctrl+P — qui n'a traverse aucun bouton et n'a donc rien pu declarer — sorte
   la presentation complete, y compris apres une impression du recto. Sans
   remise a zero, le mode devient un etat remanent que rien dans l'interface
   n'affiche, et le raccourci clavier rendrait un document different selon ce
   qui a ete imprime avant. */
const defaultMode = "integral";
let printMode = defaultMode;

const documents = {
  integral: renderPrintDocument,
  cv: renderCvDocument,
};

export function setPrintMode(mode) {
  printMode = documents[mode] ? mode : defaultMode;
}

function mountPrintView() {
  if (printView || typeof document === "undefined") {
    return;
  }

  printView = document.createElement("div");
  printView.id = printViewId;
  printView.setAttribute("aria-hidden", "true");
  printView.innerHTML = (documents[printMode] ?? documents[defaultMode])();
  document.body.appendChild(printView);
}

function unmountPrintView() {
  if (!printView) {
    return;
  }

  printView.remove();
  printView = null;
  printMode = defaultMode;
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
    button.addEventListener("click", () => {
      setPrintMode(button.dataset.print);
      window.print();
    });
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
