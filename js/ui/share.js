import { contact } from "../data/contact.js";

/* L'URL vient de `contact.site` : le recto A4 la porte aussi, et deux copies
   de la meme adresse finissent par diverger. */
export const sharePayload = {
  title: `CV interactif de ${contact.name}`,
  text: `Le CV interactif de ${contact.name} — ${contact.role}.`,
  url: contact.site.url,
};

const encodedUrl = encodeURIComponent(sharePayload.url);
const encodedTitle = encodeURIComponent(sharePayload.title);
const encodedText = encodeURIComponent(sharePayload.text);
const encodedMessage = encodeURIComponent(`${sharePayload.text} ${sharePayload.url}`);

/* Les six canaux par lesquels un CV circule reellement, et rien d'autre.
   LinkedIn d'abord — c'est le seul dont le partage vaut recommandation
   professionnelle ; WhatsApp et SMS ensuite, parce qu'un lien de CV se
   transfere d'un telephone a l'autre plus souvent qu'il ne se publie ;
   l'e-mail parce que c'est encore ce qu'un recruteur verse a un dossier.
   Facebook et X ferment la liste : ils partagent, sans etre le chemin
   ordinaire de ce document-ci.

   Chaque canal porte le protocole qui convient. `mailto:` et `sms:`
   n'ouvrent pas un onglet mais l'application du systeme : les envoyer sur
   une nouvelle fenetre laisserait un onglet vide derriere le client mail.
   `sms:?&body=` est la forme qui passe des deux cotes, iOS attendant `&`
   la ou Android attend `?`.

   Le titre de partage n'est pas repete dans le texte : les reseaux qui
   lisent l'un ignorent l'autre, et ceux qui lisent les deux les affichent a
   la suite. */
export const shareChannels = [
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "linkedin",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    newTab: true,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "whatsapp",
    href: `https://wa.me/?text=${encodedMessage}`,
    newTab: true,
  },
  {
    id: "email",
    label: "E-mail",
    icon: "envelope",
    href: `mailto:?subject=${encodedTitle}&body=${encodedMessage}`,
    newTab: false,
  },
  {
    id: "sms",
    label: "SMS",
    icon: "message",
    href: `sms:?&body=${encodedMessage}`,
    newTab: false,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    newTab: true,
  },
  {
    id: "x",
    label: "X",
    icon: "x",
    href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedText}`,
    newTab: true,
  },
];

/* Le repli historique : un champ hors champ, selectionne, copie. Il ne
   demande ni contexte securise ni permission, et fonctionne partout ou le
   presse-papiers moderne n'a pas voulu. */
function copyViaTemporaryField() {
  const temporaryField = document.createElement("textarea");

  temporaryField.value = sharePayload.url;
  temporaryField.setAttribute("readonly", "");
  temporaryField.style.position = "absolute";
  temporaryField.style.left = "-9999px";
  document.body.appendChild(temporaryField);
  temporaryField.select();

  const copied = document.execCommand("copy");

  document.body.removeChild(temporaryField);

  if (!copied) {
    throw new Error("Copie refusée par le navigateur.");
  }
}

/* Le presse-papiers moderne demande un contexte securise, et sa promesse est
   rejetee quand la permission manque ou que le document n'a pas le focus.
   **Son absence n'est donc pas le seul cas d'echec** : tester sa presence
   avant d'appeler ne suffit pas, il faut aussi rattraper son refus. Sans ce
   rattrapage, un navigateur qui a l'API mais refuse l'ecriture n'essayait
   jamais le repli et le lecteur lisait « Échec » devant une copie qui aurait
   abouti par l'autre voie. */
export async function copyShareUrl() {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(sharePayload.url);
      return;
    } catch (error) {
      /* On tente le repli plutot que de rendre l'echec. */
    }
  }

  copyViaTemporaryField();
}

export function canShareNatively() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

/* Rend `true` si le systeme a pris la main, `false` si le partage n'existe
   pas ou si le lecteur l'a annule : l'appelant sait alors s'il doit proposer
   autre chose, et une annulation n'est pas une erreur. */
export async function shareNatively() {
  if (!canShareNatively()) {
    return false;
  }

  try {
    await navigator.share(sharePayload);
    return true;
  } catch (error) {
    return false;
  }
}
