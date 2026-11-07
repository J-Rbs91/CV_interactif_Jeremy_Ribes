/* Point d'entrée : monte la page, puis branche ce qui doit l'être.

   Ce qui est branché ici et qui survit à la refonte de l'affichage :
   - le panneau « Partager & Exporter » et la modale de contact, qui sont des
     COUCHES (elles empilent une entrée d'historique : js/ui/backNavigation.js) ;
   - la commande d'impression (recto A4, présentation complète) ;
   - la navigation entre sections et l'ouverture : js/ui/site.js.

   La page est montée UNE FOIS. Plus rien ne la reconstruit : c'est ce qui
   garantit que le focus, l'état des fiches ouvertes et la position de défilement
   ne se perdent jamais en cours de lecture. */
import { renderSite } from "./render/renderSite.js";
import { bindContactForm } from "./ui/contactForm.js";
import { bindExportPanel } from "./ui/exportPanel.js";
import { bindPrint } from "./ui/print.js";
import { initSite } from "./ui/site.js";

if (typeof document !== "undefined") {
  const app = document.getElementById("app");

  if (app) {
    app.innerHTML = renderSite();

    bindPrint();
    bindContactForm();
    bindExportPanel();
    initSite();
  }
}
