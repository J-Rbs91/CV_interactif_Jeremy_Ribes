/* Effet de frappe sur l'accroche de la colonne d'identite.

   Le texte est deja dans le document quand le module s'en saisit : il le
   redecoupe en caracteres, les eteint tous, puis les rallume un a un. C'est
   l'inverse du procede habituel — ajouter le texte au fur et a mesure — et
   c'est ce qui garantit qu'aucune ligne ne bouge pendant la frappe : la
   composition est celle du texte entier des la premiere image, seule l'encre
   arrive en retard. Un texte qui se compose reellement repousse ce qui le
   suit a chaque retour a la ligne, et la colonne entiere tremble.

   Le repli est le texte lui-meme : sans JavaScript, sans le module, ou apres
   une erreur, le paragraphe reste ce qu'il etait. */

/* La cadence est le seul reglage qui se juge a l'oeil, et le premier essai
   etait faux : 12 ms par caractere font 5 000 signes par minute, de l'ordre
   de 800 mots par minute. Aucune main n'ecrit a cette vitesse — on ne lisait
   pas quelqu'un qui tape, on lisait un texte qui se deroule, c'est-a-dire
   exactement ce que l'effet est cense ne pas etre.

   30 ms plus une derive de 0 a 24 ms donnent 42 ms en moyenne : 24
   caracteres par seconde, environ 240 mots par minute. C'est encore au-dessus
   d'une frappe soutenue ordinaire, et c'est assume — descendre au plausible
   strict (80 mots par minute) ferait durer l'accroche une demi-minute, et
   une accroche qui met trente secondes a se poser n'est plus une accroche.

   La derive vaut 80 % de la base. Une cadence reguliere se reconnait tout de
   suite comme calculee : c'est l'irregularite qui fait la main.

   L'accroche fait 238 caracteres, la frappe dure donc une dizaine de
   secondes. Le paragraphe demande une vingtaine de secondes de lecture
   ordinaire : le curseur reste deux fois plus rapide que l'oeil et n'attend
   jamais d'etre rattrape.

   Les arrets de ponctuation ne suivent pas le meme facteur : triples, ils
   auraient pese plus lourd que la frappe elle-meme et hache la phrase. */
const BASE_DELAY = 30;
const JITTER = 24;
const PUNCTUATION_PAUSES = {
  ",": 140,
  ";": 220,
  ":": 240,
  "·": 240,
  ".": 320,
  "!": 320,
  "?": 320,
  "…": 400,
};

const START_DELAY = 220;
/* La sequence d'ouverture rend la main a 8,65 s et le CV monte en 720 ms. La
   frappe attend que ce mouvement soit pose : deux mouvements simultanes sur
   le meme bloc n'en font lire aucun. */
const HANDOFF_SETTLE = 480;
const CARET_LINGER = 900;

let hasPlayed = false;
let isScheduled = false;

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function delayFor(character) {
  return (
    BASE_DELAY + Math.random() * JITTER + (PUNCTUATION_PAUSES[character] ?? 0)
  );
}

/* Le decoupage se fait par mot, et l'espace reste un noeud de texte entre
   deux mots : ce sont les seules occasions de retour a la ligne, et les
   laisser hors des spans garantit qu'aucun mot ne se coupe en cours de
   frappe. La normalisation NFC evite d'isoler un accent combinant dans son
   propre span, ou il se poserait sur le vide. */
function buildLiveLayer(text) {
  const live = document.createElement("span");
  const caret = document.createElement("span");
  const chars = [];

  live.className = "tw-live";
  live.setAttribute("aria-hidden", "true");
  caret.className = "tw-caret";

  text
    .normalize("NFC")
    .split(" ")
    .forEach((word, wordIndex) => {
      if (wordIndex > 0) {
        live.append(" ");
      }

      const wordElement = document.createElement("span");

      wordElement.className = "tw-word";

      Array.from(word).forEach((character) => {
        const charElement = document.createElement("span");

        charElement.className = "tw-char";
        charElement.textContent = character;
        wordElement.append(charElement);
        chars.push(charElement);
      });

      live.append(wordElement);
    });

  live.prepend(caret);

  return { live, caret, chars };
}

/* La couche animee est `aria-hidden` : un texte eclate en spans d'un
   caractere se fait epeler par certains lecteurs d'ecran. Le texte reel est
   restitue a cote, hors champ visuel, et redevient le seul contenu du
   paragraphe une fois la frappe finie. */
function buildAccessibleLayer(text) {
  const accessible = document.createElement("span");

  accessible.className = "tw-text-sr";
  accessible.textContent = text;

  return accessible;
}

function play(paragraph, text) {
  const { live, caret, chars } = buildLiveLayer(text);

  paragraph.replaceChildren(live, buildAccessibleLayer(text));

  let index = 0;
  let nextAt = 0;

  function finish() {
    paragraph.textContent = text;
  }

  function step(now) {
    /* Le CV se reconstruit a chaque changement de section : le paragraphe
       qu'on animait n'est alors plus dans le document, et le nouveau porte
       deja son texte complet. Il n'y a rien a rattraper. */
    if (!paragraph.isConnected) {
      return;
    }

    if (!nextAt) {
      nextAt = now;
    }

    while (index < chars.length && now >= nextAt) {
      const charElement = chars[index];

      charElement.classList.add("is-typed");
      charElement.after(caret);
      nextAt += delayFor(charElement.textContent);
      index += 1;
    }

    if (index < chars.length) {
      window.requestAnimationFrame(step);
      return;
    }

    live.classList.add("is-done");
    window.setTimeout(finish, CARET_LINGER);
  }

  window.requestAnimationFrame(step);
}

function start() {
  const paragraph = document.querySelector("[data-typewriter]");

  if (!paragraph) {
    return;
  }

  const text = paragraph.textContent.trim();

  if (!text) {
    return;
  }

  try {
    play(paragraph, text);
  } catch (error) {
    /* Une accroche invisible serait pire que pas d'effet du tout. */
    paragraph.textContent = text;
  }
}

/* Appele a chaque rendu, mais ne joue qu'une fois par chargement : le CV se
   re-rend a chaque changement de section, et rejouer la frappe ferait de
   l'accroche une animation permanente — une colonne d'identite qui ne se
   pose jamais. Le drapeau est leve avant la premiere image, pour qu'un
   re-rendu survenant en pleine frappe retrouve simplement le texte entier. */
export function bindTypewriter() {
  if (hasPlayed || isScheduled || prefersReducedMotion()) {
    return;
  }

  isScheduled = true;

  /* Sequence d'ouverture armee : la frappe se jouerait derriere l'overlay et
     serait finie depuis six secondes quand on decouvre la page. Elle attend
     le meme signal que l'entree en escalier des blocs. */
  if (document.documentElement.classList.contains("intro-armed")) {
    document.addEventListener(
      "cv:intro-raccord",
      () => {
        hasPlayed = true;
        window.setTimeout(start, HANDOFF_SETTLE);
      },
      { once: true },
    );
    return;
  }

  hasPlayed = true;
  window.setTimeout(start, START_DELAY);
}
