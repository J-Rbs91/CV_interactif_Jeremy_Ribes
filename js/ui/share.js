const SHARE_PAYLOAD = {
  title: "CV Interactif \u2014 J\u00e9r\u00e9my Ribes",
  text: "D\u00e9couvrez le CV interactif de J\u00e9r\u00e9my Ribes \u2014 Manager de Proximit\u00e9 & Coordinateur Performance Commerciale",
  url: "https://j-rbs91.github.io/CV_interactif_Jeremy_Ribes/",
};

const feedbackTimeouts = new WeakMap();

async function copyShareUrl() {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(SHARE_PAYLOAD.url);
    return;
  }

  const temporaryField = document.createElement("textarea");

  temporaryField.value = SHARE_PAYLOAD.url;
  temporaryField.setAttribute("readonly", "");
  temporaryField.style.position = "absolute";
  temporaryField.style.left = "-9999px";
  document.body.appendChild(temporaryField);
  temporaryField.select();
  document.execCommand("copy");
  document.body.removeChild(temporaryField);
}

function showCopyFeedback(button) {
  const activeTimeoutId = feedbackTimeouts.get(button);

  if (activeTimeoutId) {
    window.clearTimeout(activeTimeoutId);
  }

  button.classList.add("is-copied");

  const timeoutId = window.setTimeout(() => {
    button.classList.remove("is-copied");
    feedbackTimeouts.delete(button);
  }, 2000);

  feedbackTimeouts.set(button, timeoutId);
}

async function handleShare(event) {
  const button = event.currentTarget;

  if (!(button instanceof HTMLElement)) {
    return;
  }

  if (navigator.share) {
    try {
      await navigator.share(SHARE_PAYLOAD);
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await copyShareUrl();
    showCopyFeedback(button);
  } catch (error) {
    button.classList.remove("is-copied");
  }
}

export function bindShare() {
  document.querySelectorAll("[data-share]").forEach((button) => {
    button.addEventListener("click", handleShare);
  });
}
