import { coucheOuverte, fermerCouche, ouvrirCouche } from "./backNavigation.js";

const EMAILJS_SERVICE_ID = "service_tpynp8t";
const EMAILJS_TEMPLATE_ID = "template_k8zwk94";
const EMAILJS_PUBLIC_KEY = "XaKCNJspsS14ZNmOl";

let emailjsInitialized = false;
let escapeListenerBound = false;
let lastContactTrigger = null;
let openedAt = 0;
const OPENING_MS = 400; /* voir exportPanel.js : le second clic d'un double-clic */

function ensureEmailJSInit() {
  if (emailjsInitialized || typeof emailjs === "undefined") {
    return;
  }

  emailjs.init(EMAILJS_PUBLIC_KEY);
  emailjsInitialized = true;
}

function getContactModal() {
  return document.getElementById("contact-modal");
}

function setExpanded(value) {
  document
    .querySelectorAll("[data-open-contact]")
    .forEach((trigger) => trigger.setAttribute("aria-expanded", String(value)));
}

function openContactModal() {
  ensureEmailJSInit();
  const modal = getContactModal();

  if (!modal || coucheOuverte()) {
    return;
  }

  modal.classList.add("is-open");
  modal.removeAttribute("inert");
  setExpanded(true);
  openedAt = performance.now();
  modal.querySelector("input[name='from_name']")?.focus();

  /* Meme contrat que le panneau d'export : la modale est une couche posee sur
     le CV, le geste retour du telephone la referme au lieu de quitter la page
     — et le message en cours de redaction reste. */
  ouvrirCouche("contact", closeContactModal);
}

/* Fermeture demandee par l'interface. Elle depile, et c'est la pile qui
   appellera `closeContactModal` : bouton, Echap, clic sur le fond et geste
   retour suivent le meme chemin. */
function demanderFermetureContact() {
  const modal = getContactModal();

  if (!modal?.classList.contains("is-open")) {
    return false;
  }

  if (fermerCouche()) {
    return true;
  }

  closeContactModal();
  return true;
}

function closeContactModal() {
  const modal = getContactModal();

  if (!modal) {
    return;
  }

  modal.classList.remove("is-open");
  setExpanded(false);

  /* Rendre le focus avant de poser `inert`, et dans cet ordre. Un element
     qui devient inerte pendant qu'il porte le focus le perd au profit du
     <body> : au clavier, on repartirait du haut de la page a chaque
     fermeture. On revient donc au bouton qui a ouvert, ce qui est aussi ce
     qu'on attend d'un aller-retour. */
  if (modal.contains(document.activeElement)) {
    (lastContactTrigger ?? document.querySelector("[data-open-contact]"))?.focus();
  }

  modal.setAttribute("inert", "");
  lastContactTrigger = null;

  /* Le formulaire n'est PAS remis à zéro ici : le message en cours reste, que
     la couche soit fermée par le bouton, Échap ou le geste retour — et surtout
     après une erreur d'envoi, où fermer ne doit pas détruire ce qu'on invite à
     renvoyer. Il ne se vide qu'au succès (`handleContactSubmit`). Seul un
     retour de succès, devenu sans objet, s'efface. */
  const feedback = modal.querySelector("[data-contact-feedback]");
  if (feedback?.classList.contains("is-success")) {
    feedback.textContent = "";
    feedback.className = "contact-feedback";
  }
}

async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitButton = form.querySelector("button[type='submit']");
  const feedback = form.closest(".contact-modal-body")
    ?.querySelector("[data-contact-feedback]");

  if (!submitButton || !feedback) {
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Envoi…";
  feedback.textContent = "";
  feedback.className = "contact-feedback";

  try {
    ensureEmailJSInit();
    await emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      form,
    );
    feedback.textContent = "Message envoyé ! Je vous répondrai rapidement.";
    feedback.classList.add("is-success");
    form.reset();
  } catch (error) {
    /* Aucun autre canal n'existe sur le site : le message promet donc
       seulement ce qui est vrai — le texte est conservé, on peut renvoyer. */
    feedback.textContent = "Erreur lors de l'envoi. Votre message est conservé : réessayez dans un instant.";
    feedback.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Envoyer";

    /* Le bouton désactivé portait le focus : il retombait sur <body>. Le retour
       reçoit le focus pour que le clavier et le lecteur d'écran restent dans la
       couche, au bon endroit. */
    feedback.tabIndex = -1;
    feedback.focus({ preventScroll: true });
  }
}

function bindEscapeClose() {
  if (escapeListenerBound) {
    return;
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    demanderFermetureContact();
  });

  escapeListenerBound = true;
}

export function bindContactForm() {
  document.querySelectorAll("[data-open-contact]").forEach((button) => {
    button.setAttribute("aria-controls", "contact-modal");
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      lastContactTrigger = button;
      openContactModal();
    });
  });

  const modal = getContactModal();
  if (!modal) {
    bindEscapeClose();
    return;
  }

  modal.addEventListener(
    "click",
    (event) => {
      if (performance.now() - openedAt < OPENING_MS && !event.target.closest("[data-close-contact]")) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    true,
  );

  modal.querySelector("[data-close-contact]")
    ?.addEventListener("click", demanderFermetureContact);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      demanderFermetureContact();
    }
  });

  modal.querySelector("form")
    ?.addEventListener("submit", handleContactSubmit);

  bindEscapeClose();
}
