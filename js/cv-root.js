import { bindContactForm } from "./ui/contactForm.js";

bindContactForm();

// Conserve la respiration progressive des caractères sans style inline,
// afin de respecter la Content Security Policy du site public.
for (const word of document.querySelectorAll(".s-w")) {
  [...word.querySelectorAll(".s-l")].forEach((letter, index) => {
    letter.style.setProperty("--i", String(index));
  });
}

const printButton = document.querySelector("[data-print-full]");
printButton?.addEventListener("click", () => window.print());

const shareButton = document.querySelector("[data-share-cv]");
shareButton?.addEventListener("click", async () => {
  const url = new URL("./", window.location.href).href.split("#")[0];
  try {
    if (navigator.share) {
      await navigator.share({ title: "CV de Jérémy Ribes", url });
      return;
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      shareButton.textContent = "Lien copié";
    } else {
      throw new Error("Presse-papiers indisponible");
    }
  } catch (error) {
    if (error?.name !== "AbortError") {
      shareButton.textContent = "Lien : " + url;
    }
  }
});
