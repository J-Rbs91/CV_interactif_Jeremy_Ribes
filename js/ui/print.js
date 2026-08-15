import { renderCvDocument } from "../render/renderCv.js";
import { renderPrintDocument } from "../render/renderPrint.js";

const printViewId = "print-view";
let printView = null;

/* Deux documents sortent par la meme commande d'impression : la presentation
   complete, six pages, et le recto A4. Le bouton clique declare le document
   attendu (`requestedMode`) ; `mountedMode` retient celui qui est reellement
   dans la page.

   **Deux variables et non une**, parce qu'elles peuvent diverger et que c'est
   precisement le cas qui casse. Une vue montee une fois puis jamais demontee
   — un navigateur qui n'emet pas `afterprint` suffit — restait servie telle
   quelle a l'impression suivante : le second bouton retrouvait `printView`
   deja present, renoncait a la reconstruire, et sortait le document de
   l'autre. Comparer les deux modes, plutot que tester la seule presence de la
   vue, rend l'etat impossible a desynchroniser : ce qui est monte est
   toujours ce qui a ete demande.

   **Le document demande survit au cycle d'impression.** `requestedMode`
   revenait au defaut au demontage, pour qu'un Ctrl+P — qui n'a traverse aucun
   bouton, donc n'a rien pu declarer — sorte la presentation complete meme
   apres une impression du recto. Cette remise a zero partait d'un cycle en
   une passe : ouvrir, imprimer, fermer. Chrome sous Android en fait deux. Il
   emet `afterprint` des qu'il passe la main au service d'impression du
   systeme, bien avant que le document ne soit produit, puis rend la page une
   seconde fois au moment de fabriquer le PDF. La premiere passe demontait la
   vue et rendait la main au defaut ; la seconde retrouvait `integral` et
   sortait la presentation complete — un lecteur qui demandait le CV recevait
   les six pages, sans rien avoir fait de travers.

   Le mode reste donc pose jusqu'a ce qu'un autre bouton en declare un autre.
   Ce que cela change pour la commande du navigateur est assume et se dit en
   une phrase : elle sert le dernier document demande, la presentation
   complete tant qu'aucun bouton n'a ete presse. Servir le document que le
   lecteur vient de demander prime sur le repli d'une commande qu'il n'a pas
   utilisee. */
const defaultMode = "integral";
let requestedMode = defaultMode;
let mountedMode = null;

const documents = {
  integral: renderPrintDocument,
  cv: renderCvDocument,
};

function mountPrintView() {
  if (typeof document === "undefined") {
    return;
  }

  if (printView && mountedMode === requestedMode) {
    return;
  }

  if (printView) {
    printView.remove();
  }

  printView = document.createElement("div");
  printView.id = printViewId;
  printView.setAttribute("aria-hidden", "true");
  printView.innerHTML = (documents[requestedMode] ?? documents[defaultMode])();
  document.body.appendChild(printView);
  mountedMode = requestedMode;
}

function unmountPrintView() {
  if (!printView) {
    return;
  }

  printView.remove();
  printView = null;
  mountedMode = null;
}

/* **La commande monte la vue elle-meme**, elle ne se repose pas sur
   `beforeprint`.

   C'etait l'inverse : le bouton n'appelait que `window.print()` et laissait
   `beforeprint` monter le document. Tant qu'il n'y avait qu'un seul document
   a sortir, l'evenement ne pouvait rien rendre d'autre que le bon, et son
   absence eventuelle ne coutait qu'une impression vide. Avec deux documents,
   il porte le choix de l'utilisateur — et le remettre a un evenement dont ce
   fichier documente deja qu'il n'est pas garanti (voir le repli Safari plus
   bas) fait dependre ce qui sort du navigateur, pas du bouton presse.

   Monter ici ne duplique rien : `mountPrintView()` est idempotent et se
   contente de comparer les modes. Un `beforeprint` qui suit trouve la vue
   deja montee au bon mode et ne fait rien ; un navigateur qui ne l'emet
   jamais imprime quand meme le document demande.

   `beforeprint` reste indispensable pour la commande d'impression du
   navigateur, qui ne passe par aucune commande du site.

   Une fonction exportee plutot qu'un `[data-print]` relie a chaque rendu :
   les deux commandes vivent maintenant dans le panneau « Partager &
   Exporter », qui gere deja sa fermeture avant d'imprimer et sait donc
   quand appeler. Un attribut relie en aveugle imposerait l'ordre inverse —
   imprimer, puis fermer par-dessus la fenetre d'impression. */
export function printDocument(mode) {
  requestedMode = documents[mode] ? mode : defaultMode;
  mountPrintView();
  window.print();
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
