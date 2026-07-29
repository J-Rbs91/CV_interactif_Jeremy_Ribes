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
