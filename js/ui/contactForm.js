const EMAILJS_SERVICE_ID = "service_tpynp8t";
const EMAILJS_TEMPLATE_ID = "template_k8zwk94";
const EMAILJS_PUBLIC_KEY = "XaKCNJspsS14ZNmOl";

let emailjsInitialized = false;
let escapeListenerBound = false;
let lastContactTrigger = null;

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

function openContactModal() {
  ensureEmailJSInit();
  const modal = getContactModal();

  if (!modal) {
    return;
  }

  modal.classList.add("is-open");
  modal.removeAttribute("inert");
  modal.querySelector("input[name='from_name']")?.focus();
}

function closeContactModal() {
  const modal = getContactModal();

  if (!modal) {
    return;
  }

  modal.classList.remove("is-open");

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

  const form = modal.querySelector("form");
  if (form) {
    form.reset();
  }

  const feedback = modal.querySelector("[data-contact-feedback]");
  if (feedback) {
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
    feedback.textContent = "Erreur lors de l'envoi. Réessayez ou contactez-moi sur LinkedIn.";
    feedback.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Envoyer";
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

    const modal = getContactModal();
    if (modal?.classList.contains("is-open")) {
      closeContactModal();
    }
  });

  escapeListenerBound = true;
}

export function bindContactForm() {
  document.querySelectorAll("[data-open-contact]").forEach((button) => {
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

  modal.querySelector("[data-close-contact]")
    ?.addEventListener("click", closeContactModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeContactModal();
    }
  });

  modal.querySelector("form")
    ?.addEventListener("submit", handleContactSubmit);

  bindEscapeClose();
}
