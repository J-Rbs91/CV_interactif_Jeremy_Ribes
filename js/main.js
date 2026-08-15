import {
  renderMobileShell,
  renderSidebar,
  renderContentHeader,
} from "./render/renderHeader.js";
import {
  renderExperiencesSection,
  renderFormationSection,
  renderProfilSection,
} from "./render/renderExperiences.js";
import {
  renderCompetencesSection,
} from "./render/renderCompetences.js";
import { renderOutilsSection } from "./render/renderOutils.js";
import { renderProjetSection } from "./render/renderProjets.js";
import { bindAccordion, syncAccordion } from "./ui/accordion.js";
import { bindContactForm } from "./ui/contactForm.js";
import { initializeModal } from "./ui/modal.js";
import { bindNavigation } from "./ui/navigation.js";
import { bindExportPanel } from "./ui/exportPanel.js";
import { bindPrint } from "./ui/print.js";
import {
  playSectionEntry as animateSectionEntry,
  playSectionLeave,
  prefersReducedMotion,
  resolveSectionDirection,
  setSectionDirection,
} from "./ui/sectionTransition.js";
import { bindTypewriter } from "./ui/typewriter.js";

const state = {
  activeSection: "profil",
  expandedCompetenceId: null,
  expandedTool: null,
  desktopScrollTop: 0,
  isMobileView: false,
  mobileNavScrollLeft: 0,
  shouldAnimateMobileNav: false,
  hasInitializedMobileNav: false,
  shouldAnimateSection: true,
  hasPlayedSectionEntry: false,
  shouldResetMobileScroll: false,
};

/* La sortie de l'ecran courant dure le temps d'une animation, pendant
   lequel le document affiche encore l'ancienne section : un second clic
   peut tomber dedans. On garde donc la demande en attente plutot qu'un
   booleen — le clic suivant redirige la cible au lieu d'empiler une
   seconde transition. */
let pendingSectionRequest = null;
let cancelSectionLeave = null;

const mobileViewport = "(max-width: 900px)";
const mobileNavigationScrollSettleDelay = 350;
let viewportQueryList;
let resizeListenerBound = false;
let mobileNavigationOverflowUpdateTimeoutId = 0;

function getMobileNavigationRail() {
  return document.querySelector("[data-mobile-nav]");
}

function clampScrollLeft(value, maxScrollLeft) {
  return Math.min(Math.max(0, value), Math.max(0, maxScrollLeft));
}

function setNavigationRailScrollPosition(navigationRail, left) {
  const previousScrollBehavior = navigationRail.style.scrollBehavior;

  navigationRail.style.scrollBehavior = "auto";
  navigationRail.scrollLeft = left;
  navigationRail.style.scrollBehavior = previousScrollBehavior;
}

function isMobileNavigationRailMeasurable(navigationRail) {
  return navigationRail.clientWidth > 0 && navigationRail.scrollWidth > 0;
}

function cancelScheduledMobileNavigationOverflowUpdate() {
  if (!mobileNavigationOverflowUpdateTimeoutId) {
    return;
  }

  window.clearTimeout(mobileNavigationOverflowUpdateTimeoutId);
  mobileNavigationOverflowUpdateTimeoutId = 0;
}

function preserveMobileNavigationState({ shouldAnimate = false } = {}) {
  const navigationRail = getMobileNavigationRail();

  if (navigationRail) {
    const maxScrollLeft =
      navigationRail.scrollWidth - navigationRail.clientWidth;
    state.mobileNavScrollLeft = clampScrollLeft(
      navigationRail.scrollLeft,
      maxScrollLeft,
    );
  }

  state.shouldAnimateMobileNav = shouldAnimate;
}

function preserveDesktopScrollPosition() {
  const contentBody = document.querySelector(".content-body");

  if (contentBody) {
    state.desktopScrollTop = contentBody.scrollTop;
  }
}

function restoreDesktopScrollPosition() {
  const contentBody = document.querySelector(".content-body");

  if (contentBody) {
    contentBody.scrollTop = state.desktopScrollTop;
  }
}

/* En etroit, le conteneur de defilement est `#app` lui-meme, et `render()`
   remplace son contenu sans le remplacer, lui : son `scrollTop` survit donc
   au changement de section, borne a la nouvelle hauteur. Depuis 1 400 px
   dans Outils, un clic sur Competences atterrissait a 993 — soit 140 px
   sous le haut de la section demandee, titre hors ecran et premiere carte
   coupee en deux. Le lecteur demandait une section et recevait le milieu
   d'une autre.

   En large le probleme ne se pose pas : `.content-body` est reconstruit a
   chaque rendu, donc remis a zero, et `restoreDesktopScrollPosition()` lui
   repose la valeur voulue. La symetrie manquait ici, c'est tout.

   On cale sur le bandeau de navigation, pas sur le haut du document. Le
   resume d'identite occupe six cents pixels : y renvoyer a chaque clic
   ferait relire six fois le meme en-tete, et la section demandee
   repartirait sous la ligne de flottaison. Le bandeau colle en tete, la
   section commence juste dessous — on garde la carte sous les yeux et on
   arrive sur le contenu.

   Repli sur zero si le bandeau manque : mieux vaut le haut du document
   qu'une position heritee de la section precedente.

   Deliberement pas de defilement anime : on ne parcourt pas une distance,
   on change d'ecran. */
function resetMobileScrollPosition() {
  const appElement = document.getElementById("app");

  if (!appElement) {
    return;
  }

  const navigationShell = document.querySelector("[data-mobile-nav-sticky]");

  if (!navigationShell) {
    appElement.scrollTop = 0;
    return;
  }

  /* On remet a zero AVANT de mesurer, et ce n'est pas une precaution : le
     bandeau est colle. Mesure depuis une position defilee, sa boite est
     celle de son point d'accroche — zero — et l'ecart calcule vaut zero,
     donc la position ne bouge pas. Remis en tete, il retrouve sa place
     naturelle dans le flux, qui est la seule qu'on cherche a connaitre. */
  appElement.scrollTop = 0;

  const layoutOffset =
    navigationShell.getBoundingClientRect().top -
    appElement.getBoundingClientRect().top;

  appElement.scrollTop = Math.max(0, layoutOffset);
}

/* Une carte qu'on vient d'ouvrir doit rester visible. Le report d'un
   rendez-vous de defilement d'un rendu a l'autre n'a plus lieu d'etre : la
   bascule se fait en place, la carte est donc deja la quand on la mesure.

   On ne juge que par le haut de la carte : au moment de l'appel le panneau
   commence tout juste a se deplier, et sa hauteur finale n'est pas encore
   connue. */
function scrollAccordionIntoView(card) {
  const scrollContainer = state.isMobileView
    ? document.querySelector("#app.app-mobile")
    : document.querySelector(".content-body");

  if (!card || !scrollContainer) {
    return;
  }

  const containerRect = scrollContainer.getBoundingClientRect();
  const cardTopRelative = card.getBoundingClientRect().top - containerRect.top;

  /* En etroit, le bandeau de navigation est collant : la marge de confort
     doit passer dessous, sinon la tete de carte se glisse derriere lui. */
  const navigationShell = state.isMobileView
    ? document.querySelector("[data-mobile-nav-shell]")
    : null;
  const comfortMargin = navigationShell
    ? navigationShell.getBoundingClientRect().bottom - containerRect.top + 20
    : 16;

  const isComfortablyPlaced =
    cardTopRelative >= comfortMargin &&
    cardTopRelative <= scrollContainer.clientHeight - 40;

  if (isComfortablyPlaced) {
    return;
  }

  scrollContainer.scrollTo({
    top: Math.max(
      0,
      scrollContainer.scrollTop + cardTopRelative - comfortMargin,
    ),
    behavior: "smooth",
  });
}

/* La commande de depliage bat doucement tant qu'on n'a ouvert aucune carte :
   c'est ce battement qui dit qu'il y a quelque chose dessous. A la premiere
   ouverture, la demonstration est faite — le mouvement n'a plus rien a
   apprendre a personne et devient du bruit. Il s'arrete, pour la visite
   entiere. La marque est posee sur <html>, seul element que `render()` ne
   reconstruit pas : elle survit aux changements de section. */
function markAccordionAsDiscovered() {
  document.documentElement.classList.add("accordion-decouvert");
}

function hasFocusInNavigation() {
  const focused = document.activeElement;

  return Boolean(focused && focused.closest?.("[data-section]"));
}

function restoreFocusToActiveNavigation() {
  const activeNavigationItem = document.querySelector(
    `[data-section="${state.activeSection}"]`,
  );

  activeNavigationItem?.focus({ preventScroll: true });
}

/* Le rythme de la sequence, importe dans le CV : au changement de section,
   les blocs entrent decales, avec la meme courbe. Uniquement au changement
   de section — l'ouverture d'un accordeon ne re-rend plus rien, et faire
   rejouer l'entree a chaque ouverture donnerait une interface nerveuse.
   Le respect de `prefers-reduced-motion` est porte par css/base.css, qui
   ramene toutes les durees a 0,01 ms sans changer l'etat d'arrivee.

   La toute premiere entree se distingue des suivantes : elle accompagne la
   decouverte du CV et n'est vue qu'une fois, la ou la navigation sera vue
   six fois. La regle de frequence lui accorde le tempo ample qu'elle
   refuse aux clics — le detail des durees est dans
   js/ui/sectionTransition.js. */
function playSectionEntry() {
  if (!state.shouldAnimateSection) {
    return;
  }

  state.shouldAnimateSection = false;

  const isFirstEntry = !state.hasPlayedSectionEntry;
  state.hasPlayedSectionEntry = true;

  animateSectionEntry({ isFirstEntry });
}

function renderCurrentSection() {
  switch (state.activeSection) {
    case "profil":
      return renderProfilSection();
    case "competences":
      return renderCompetencesSection(state.expandedCompetenceId);
    case "outils":
      return renderOutilsSection(state.expandedTool);
    case "experience":
      return renderExperiencesSection();
    case "projet":
      return renderProjetSection();
    case "formation":
      return renderFormationSection();
    default:
      return renderProfilSection();
  }
}

/* Le rendu attend la fin de la sortie ; l'appui, lui, n'attend rien. Sans
   cette marque, le bouton reste visuellement inerte pendant 130 ms et le
   clic semble n'avoir rien declenche — c'est exactement le defaut que la
   transition etait censee corriger. Le rendu qui suit reconstruira ces
   memes boutons avec le meme etat. */
function markActiveNavigationItem(sectionId) {
  document.querySelectorAll(".nav-item[data-section]").forEach((navItem) => {
    const isActive = navItem.dataset.section === sectionId;

    navItem.classList.toggle("active", isActive);
    navItem.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

/* On arrive dans une section les cartes repliees, et on la retrouve repliee
   en y revenant : l'etat d'ouverture appartient a la visite en cours, pas au
   document. */
function commitSectionState(sectionId) {
  state.expandedCompetenceId = null;
  state.expandedTool = null;
  state.desktopScrollTop = 0;
  state.shouldResetMobileScroll = true;
  state.activeSection = sectionId;
  state.shouldAnimateSection = true;
}

function applySectionChange(sectionId, shouldRestoreFocus) {
  if (state.isMobileView) {
    preserveMobileNavigationState({ shouldAnimate: true });
  }

  commitSectionState(sectionId);
  render({ restoreFocusToActiveNavigation: shouldRestoreFocus });
}

/* Une bascule large ↔ etroit pendant la sortie reconstruirait le document
   sous l'animation, et le minuteur rendrait une seconde fois derriere. On
   solde la demande dans l'etat : le rendu de la bascule affiche la section
   demandee, une seule fois. */
function flushPendingSectionChange() {
  if (!pendingSectionRequest) {
    return;
  }

  const { sectionId } = pendingSectionRequest;

  cancelSectionLeave?.();
  cancelSectionLeave = null;
  pendingSectionRequest = null;
  commitSectionState(sectionId);
}

function bindUi() {
  bindNavigation((sectionId) => {
    if (!sectionId) {
      return;
    }

    /* Un clic tombe dans la sortie deja lancee : on change la destination
       sans relancer de mouvement. Rejouer la sortie ferait repartir un
       ecran deja parti, et deux minuteurs se disputeraient le rendu. */
    if (pendingSectionRequest) {
      pendingSectionRequest.sectionId = sectionId;
      markActiveNavigationItem(sectionId);
      return;
    }

    if (state.activeSection === sectionId) {
      return;
    }

    markActiveNavigationItem(sectionId);

    /* La navigation est le seul endroit ou le document est reconstruit sous
       le doigt de quelqu'un : le bouton qui portait le focus disparait avec
       lui, et le clavier repart du haut de la page. On le lui rend. Le test
       se fait maintenant, tant que ce bouton existe encore. */
    const shouldRestoreFocus = hasFocusInNavigation();

    /* Mouvement reduit : pas de phase de sortie du tout. Un ecran qu'on
       fait partir en 0,01 ms n'est pas un repli, c'est un clignotement. */
    if (prefersReducedMotion()) {
      applySectionChange(sectionId, shouldRestoreFocus);
      return;
    }

    setSectionDirection(resolveSectionDirection(state.activeSection, sectionId));
    pendingSectionRequest = { sectionId, shouldRestoreFocus };

    cancelSectionLeave = playSectionLeave(() => {
      const request = pendingSectionRequest;

      pendingSectionRequest = null;
      cancelSectionLeave = null;

      /* La destination a pu changer en cours de sortie : l'entree se joue
         dans le sens de la demande retenue, pas de la premiere. */
      setSectionDirection(
        resolveSectionDirection(state.activeSection, request.sectionId),
      );
      applySectionChange(request.sectionId, request.shouldRestoreFocus);
    });
  });

  /* Aucun re-rendu ici : c'est ce qui rend le depliage animable, et ce qui
     garde le focus sur le bouton qu'on vient d'actionner. */
  bindAccordion({
    onToolToggle: (toolId) => {
      markAccordionAsDiscovered();
      state.expandedTool = state.expandedTool === toolId ? null : toolId;
      scrollAccordionIntoView(syncAccordion("tool", state.expandedTool));
    },
    onCompetenceToggle: (competenceId) => {
      markAccordionAsDiscovered();
      state.expandedCompetenceId =
        state.expandedCompetenceId === competenceId ? null : competenceId;
      scrollAccordionIntoView(
        syncAccordion("competence", state.expandedCompetenceId),
      );
    },
  });

  bindContactForm();
  bindExportPanel();
  bindTypewriter();
  initializeModal();
}

function initializeViewportDetection() {
  if (typeof window === "undefined" || viewportQueryList) {
    return;
  }

  viewportQueryList = window.matchMedia(mobileViewport);
  state.isMobileView = viewportQueryList.matches;

  const handleViewportChange = (event) => {
    if (state.isMobileView === event.matches) {
      return;
    }

    flushPendingSectionChange();

    /* La bascule large ↔ etroit est le seul re-rendu qui reste en cours de
       lecture : on garde la position acquise plutot que de renvoyer en tete. */
    preserveDesktopScrollPosition();
    state.isMobileView = event.matches;
    state.hasInitializedMobileNav = false;
    state.shouldAnimateMobileNav = false;
    render();
  };

  if (typeof viewportQueryList.addEventListener === "function") {
    viewportQueryList.addEventListener("change", handleViewportChange);
    return;
  }

  viewportQueryList.addListener(handleViewportChange);
}

function restoreMobileNavigationScrollPosition() {
  const navigationRail = getMobileNavigationRail();

  if (!navigationRail || !isMobileNavigationRailMeasurable(navigationRail)) {
    return false;
  }

  const maxScrollLeft = navigationRail.scrollWidth - navigationRail.clientWidth;
  const nextScrollLeft = clampScrollLeft(
    state.mobileNavScrollLeft,
    maxScrollLeft,
  );

  setNavigationRailScrollPosition(navigationRail, nextScrollLeft);
  state.mobileNavScrollLeft = nextScrollLeft;
  return true;
}

function scrollActiveMobileNavigationIntoView({ behavior = "smooth" } = {}) {
  const navigationRail = getMobileNavigationRail();
  const activeNavItem = document.querySelector(".app-mobile .nav-item.active");

  if (
    !navigationRail ||
    !activeNavItem ||
    !isMobileNavigationRailMeasurable(navigationRail)
  ) {
    return false;
  }

  const railRect = navigationRail.getBoundingClientRect();
  const activeRect = activeNavItem.getBoundingClientRect();
  const currentScroll = navigationRail.scrollLeft;
  const activeCenter = activeRect.left - railRect.left + currentScroll + activeRect.width / 2;
  const rawTargetScroll =
    activeCenter - navigationRail.clientWidth / 2;
  const maxScrollLeft = navigationRail.scrollWidth - navigationRail.clientWidth;
  const targetScroll = clampScrollLeft(rawTargetScroll, maxScrollLeft);

  if (behavior === "smooth") {
    navigationRail.scrollTo({
      left: targetScroll,
      behavior,
    });
  } else {
    setNavigationRailScrollPosition(navigationRail, targetScroll);
  }

  state.mobileNavScrollLeft = targetScroll;
  return behavior === "smooth";
}

function updateMobileNavigationOverflowState() {
  const navigationShell = document.querySelector("[data-mobile-nav-shell]");
  const navigationRail = document.querySelector("[data-mobile-nav]");

  if (!navigationShell || !navigationRail) {
    return;
  }

  const tolerance = 6;
  const maxScrollLeft =
    navigationRail.scrollWidth - navigationRail.clientWidth;
  const hasOverflow = maxScrollLeft > tolerance;
  const hasLeftOverflow = hasOverflow && navigationRail.scrollLeft > tolerance;
  const hasRightOverflow =
    hasOverflow && navigationRail.scrollLeft < maxScrollLeft - tolerance;

  navigationShell.classList.toggle("is-overflowing", hasOverflow);
  navigationShell.classList.toggle("is-overflow-left", hasLeftOverflow);
  navigationShell.classList.toggle("is-overflow-right", hasRightOverflow);
}

function scheduleMobileNavigationOverflowUpdateAfterScroll() {
  const navigationRail = getMobileNavigationRail();

  if (!navigationRail) {
    return;
  }

  cancelScheduledMobileNavigationOverflowUpdate();

  let hasUpdatedOverflow = false;
  let handleScrollEnd;

  const finalizeOverflowUpdate = () => {
    if (hasUpdatedOverflow) {
      return;
    }

    hasUpdatedOverflow = true;
    cancelScheduledMobileNavigationOverflowUpdate();

    if (handleScrollEnd) {
      navigationRail.removeEventListener("scrollend", handleScrollEnd);
    }

    updateMobileNavigationOverflowState();
  };

  if ("onscrollend" in navigationRail) {
    handleScrollEnd = () => {
      finalizeOverflowUpdate();
    };

    navigationRail.addEventListener("scrollend", handleScrollEnd, { once: true });
  }

  mobileNavigationOverflowUpdateTimeoutId = window.setTimeout(() => {
    finalizeOverflowUpdate();
  }, mobileNavigationScrollSettleDelay);
}

function bindMobileNavigationUi() {
  const navigationRail = getMobileNavigationRail();

  if (!navigationRail) {
    return;
  }

  navigationRail.addEventListener(
    "scroll",
    () => {
      state.mobileNavScrollLeft = navigationRail.scrollLeft;
      updateMobileNavigationOverflowState();
    },
    { passive: true },
  );
}

function finalizeMobileNavigationRender({
  shouldCenterActiveItem,
  scrollBehavior,
  remainingMeasureAttempts = 4,
} = {}) {
  const didRestoreScrollPosition = restoreMobileNavigationScrollPosition();

  if (!didRestoreScrollPosition) {
    if (remainingMeasureAttempts <= 0) {
      updateMobileNavigationOverflowState();
      state.shouldAnimateMobileNav = false;
      state.hasInitializedMobileNav = true;
      return;
    }

    requestAnimationFrame(() => {
      finalizeMobileNavigationRender({
        shouldCenterActiveItem,
        scrollBehavior,
        remainingMeasureAttempts: remainingMeasureAttempts - 1,
      });
    });
    return;
  }

  requestAnimationFrame(() => {
    const didStartSmoothScroll = shouldCenterActiveItem
      ? scrollActiveMobileNavigationIntoView({ behavior: scrollBehavior })
      : false;

    if (didStartSmoothScroll) {
      scheduleMobileNavigationOverflowUpdateAfterScroll();
    } else {
      updateMobileNavigationOverflowState();
    }

    state.shouldAnimateMobileNav = false;
    state.hasInitializedMobileNav = true;
  });
}

function initializeWindowBindings() {
  if (typeof window === "undefined" || resizeListenerBound) {
    return;
  }

  resizeListenerBound = true;

  window.addEventListener(
    "resize",
    () => {
      if (!state.isMobileView) {
        return;
      }

      updateMobileNavigationOverflowState();
    },
    { passive: true },
  );
}

function render(options = {}) {
  const { restoreFocusToActiveNavigation: shouldRestoreFocus = false } = options;
  const appElement = document.getElementById("app");

  if (!appElement) {
    return;
  }

  cancelScheduledMobileNavigationOverflowUpdate();

  const currentSection = renderCurrentSection();

  appElement.className = state.isMobileView ? "app app-mobile" : "app";
  appElement.innerHTML = state.isMobileView
    ? renderMobileShell(state.activeSection, currentSection)
    : `
        ${renderSidebar(state.activeSection)}
        <div class="panel-right">
          ${renderContentHeader(state.activeSection)}
          <div class="content-body">
            ${currentSection}
          </div>
        </div>
      `;

  bindUi();
  playSectionEntry();

  if (shouldRestoreFocus) {
    restoreFocusToActiveNavigation();
  }

  if (!state.isMobileView) {
    restoreDesktopScrollPosition();
  }

  /* Le drapeau, et non `state.isMobileView` seul : la bascule large ↔ etroit
     est aussi un rendu en etroit, et elle doit garder la position acquise —
     c'est la seule raison d'etre de `preserveDesktopScrollPosition()`. Seul
     un changement de section demande la remise en tete. */
  if (state.isMobileView && state.shouldResetMobileScroll) {
    resetMobileScrollPosition();
  }

  state.shouldResetMobileScroll = false;

  if (state.isMobileView) {
    bindMobileNavigationUi();
    const shouldCenterActiveItem =
      state.shouldAnimateMobileNav || !state.hasInitializedMobileNav;
    const scrollBehavior = state.shouldAnimateMobileNav ? "smooth" : "auto";

    requestAnimationFrame(() => {
      finalizeMobileNavigationRender({
        shouldCenterActiveItem,
        scrollBehavior,
      });
    });
  }
}

/* L'entree des blocs se jouait derriere la sequence d'ouverture. Le module
   monte le CV des l'analyse du document, l'entree partait aussitot, et
   l'overlay ne se retirait qu'a 8,65 s : l'escalier etait fini depuis six
   secondes quand on decouvrait la page. On la garde en reserve, et
   js/ui/intro.js previent au raccord — c'est-a-dire au moment exact ou le
   CV se decouvre, ce qui etait l'intention. */
function deferSectionEntryUntilIntroHandoff() {
  state.shouldAnimateSection = false;

  document.addEventListener(
    "cv:intro-raccord",
    () => {
      state.shouldAnimateSection = true;
      playSectionEntry();
    },
    { once: true },
  );
}

if (typeof document !== "undefined") {
  const isIntroArmed =
    document.documentElement.classList.contains("intro-armed");

  initializeViewportDetection();
  initializeWindowBindings();
  bindPrint();

  if (isIntroArmed) {
    deferSectionEntryUntilIntroHandoff();
  }

  render();
}
