/* La page du CV, en un seul document qui défile.

   Elle remplace l'ancienne application à six écrans exclusifs. Chaque chaîne
   vient de `js/data/` : ce fichier ne rédige rien, il compose. Une phrase
   écrite ici serait une copie qui dérive au premier ajustement des données.

   Trois exceptions assumées, et seulement trois, toutes des phrases d'appui
   qui ne disent rien de nouveau sur le parcours :
   - la mise en valeur d'un groupe de mots dans la citation et dans la citation
     de formation (`<em>`), qui disparaît sans rien casser si la phrase change ;
   - la mention « Voir le poste » ;
   - la phrase qui rappelle, sur la fiche Opti'Profit, que plusieurs actions ont
     joué ensemble — voir `renderOptiProfitContext`.

   Les classes sont toutes préfixées `s-`. Les feuilles historiques
   (`components.css`, `sections.css`…) restent chargées parce que la vue
   d'impression et le panneau d'export s'en servent : un nom commun entre les
   deux mondes laisserait l'ancien style s'appliquer au nouveau. */
import { contact } from "../data/contact.js";
import { competences } from "../data/competences.js";
import { experiences } from "../data/experiences.js";
import { outils } from "../data/outils.js";
import { projetsTransverses } from "../data/projets.js";
import { a4Content, formationContent, profileContent } from "../data/profile.js";
import { sections } from "../data/sections.js";
import { getLiveProducts, renderContactModal } from "./renderContact.js";
import { renderExportPanel } from "./renderExport.js";
import { boldIcon } from "../ui/icons.js";
import { linkHost } from "./renderUtils.js";

/* ---------- Briques ---------------------------------------------------- */

const pad = (index) => String(index + 1).padStart(2, "0");

const label = (text) => `<div class="s-lab s-mono">${text}</div>`;

const chips = (items) =>
  `<div class="s-chips">${items.map((item) => `<span>${item}</span>`).join("")}</div>`;

/* Les signes de direction sont des vecteurs (`boldIcon`), jamais des caractères
   de texte : aucune des trois familles servies ne couvre → ni ↗, et la police de
   repli changeait leur dessin d'un appareil à l'autre. Un seul signe pour « ce
   lien sort du site » : ↗, et il ne sert qu'à cela. */
const arrow = (name = "arrow-up-right") => boldIcon(name, { className: "s-ico" });

const sr = (text) => `<span class="s-sr">${text}</span>`;

const NEW_WINDOW = sr(" (nouvelle fenêtre)");

function externalLink(link) {
  return `<p><a class="s-link" href="${link.url}" target="_blank" rel="noopener noreferrer" data-host="${linkHost(link.url)}">${link.label}${arrow()}${NEW_WINDOW}</a></p>`;
}

/* « 2025 → aujourd'hui » : la flèche de texte des données devient un tiret. */
const period = (date) => date.replace(" → ", " – ");

/* Une ligne d'index qui s'ouvre en place. <details> plutôt qu'un composant :
   le clavier, le lecteur d'écran et la recherche dans la page sont gérés par le
   navigateur, et rien n'est reconstruit à l'ouverture — donc rien ne perd son
   focus. `side` est la colonne de droite, `meta` la colonne de gauche. */
function row({ id, meta, title, sub, side = "", body }) {
  return `<details class="s-row"${id ? ` id="${id}"` : ""}>
    <summary>
      <span class="s-n s-mono">${meta}</span>
      <h3 class="s-t">${title}${sub ? `<small>${sub}</small>` : ""}</h3>
      <span class="s-s">${side}</span>
      <span class="s-pm" aria-hidden="true">${boldIcon("plus")}</span>
    </summary>
    <div class="s-body"><span></span><div class="s-in">${body}</div></div>
  </details>`;
}

function section({ id, index, title, count, inner, toggleAll = true }) {
  return `<section class="s-sec" id="${id}" data-spy aria-labelledby="${id}-titre">
    <div class="s-sh s-mono"><span>${index}</span><span>${count}</span>${
      toggleAll
        ? `<button type="button" class="s-toggle-all" data-toggle-all="${id}" aria-pressed="false">Tout ouvrir</button>`
        : ""
    }</div>
    <h2 id="${id}-titre">${title}</h2>
    ${inner}
  </section>`;
}

/* Les enseignes ne se coupent qu'entre elles : chacune est un item insécable,
   le point médian reste collé à celle qui précède. */
function company(name) {
  const items = name.split(" · ");

  /* Un nom à une seule enseigne se coupe comme un texte : l'insécable ne vaut
     que là où il y a plusieurs enseignes à ne pas mélanger. */
  if (items.length === 1) {
    return name;
  }

  return items
    .map(
      (item, index) =>
        `<span class="s-co">${item}${index < items.length - 1 ? " ·" : ""}</span>`,
    )
    .join(" ");
}

const statsText = (experience) =>
  experience.stats.map((stat) => stat.value + (stat.label ? ` ${stat.label}` : ""));

const experienceId = (experience) => `exp-${experience.id}`;

/* ---------- Profil ----------------------------------------------------- */

/* L'essentiel est visible sans interaction : parcours, cible et preuve.
   Les justifications, la méthode et les limites restent accessibles dans un
   <details> natif, sans nouveau JavaScript ni seconde source de vérité. */
function renderProfile() {
  const { context, ambition, roles, limits } = profileContent.target;
  const proof = a4Content.proofs.find((item) => item.value === "3 outils en usage quotidien");

  return `
    <h2 class="s-big">${profileContent.headline.replace("outils métiers", "<em>outils métiers</em>")}</h2>
    <p class="s-lead">${contact.intro}</p>
    <div class="s-profile">
      <div class="s-block">
        ${label("Fonctions recherchées")}
        <ul class="s-list">${roles.map((role) => `<li>${role}</li>`).join("")}</ul>
      </div>
      <div class="s-block">
        ${label("Ce que je peux apporter")}
        <p>${profileContent.expertise}</p>
        ${proof ? `<p class="s-dim">${proof.value} : ${proof.text}</p>` : ""}
      </div>
    </div>
    <details class="s-profile-more">
      <summary><span>Mon parcours et ma façon de travailler</span><span class="s-pm" aria-hidden="true">${boldIcon("plus")}</span></summary>
      <div class="s-profile">
        <div class="s-block">
          ${label("Mon orientation")}
          <p>${context}</p>
          <p>${ambition}</p>
        </div>
        <div class="s-block">
          ${label("Ce que présente ce CV")}
          <p>${limits}</p>
        </div>
        ${profileContent.cards
          .map(
            (card) => `<div class="s-block">
              ${label(card.title)}
              <p>${card.text}</p>
            </div>`,
          )
          .join("")}
        <div class="s-block s-wide">
          ${label("Compétences mobilisées")}
          ${chips(profileContent.contributionTags.map((tag) => tag.label))}
        </div>
      </div>
    </details>`;
}

/* ---------- Expériences ------------------------------------------------ */

/* Les chiffres sont un fait du poste, pas un titre de page : une pastille
   discrète sur la ligne fermée, un paragraphe sobre avec sa base de
   comparaison dans la fiche. */
function renderExperiences() {
  return experiences
    .map((experience) => {
      /* Le libellé précède les valeurs, la base de comparaison les suit : la phrase
         se lit « ces actions ont contribué à +83 % CA · +5,6 pts de marge », puis
         sur quoi on compare. Elle se terminait sur « à — » avant les valeurs. */
      const proof = experience.stats
        ? `<p class="s-pf"><small>${experience.statsLabel}</small><span>${statsText(experience)
            .map((text) => `<b>${text}</b>`)
            .join(" · ")}</span><small>${experience.statsBase}</small></p>`
        : "";
      const chip = experience.stats
        ? `<span class="s-pchip">${statsText(experience).join(" · ")}</span>`
        : "";

      return row({
        id: experienceId(experience),
        meta: period(experience.date),
        title: company(experience.company),
        /* Le libellé de commande que les données écrivent « pour la ligne
           fermée » y est enfin : le poste actuel ne se lit plus comme un poste
           de vente ordinaire. */
        sub: experience.detailLabel
          ? `${experience.role} · ${experience.detailLabel}`
          : experience.role,
        side: chip,
        /* La preuve vient juste après le contexte : le lecteur qui ouvre la
           fiche pour vérifier un chiffre le trouve sans traverser le récit. */
        body: `${experience.context ? `<p>${experience.context}</p>` : ""}
          ${proof}
          <ul class="s-list">${experience.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
          ${experience.result ? `<p>${experience.result}</p>` : ""}`,
      });
    })
    .join("");
}

/* ---------- Outils ----------------------------------------------------- */

/* Opti'Profit a été conçu et utilisé pendant le poste qui porte le chiffre. Il
   est rappelé comme CONTEXTE, avec un renvoi au poste. Les données disent que
   relance, équipe et réorganisation ont joué ensemble : le chiffre n'est donc
   pas présenté comme le résultat de l'outil. */
function renderOptiProfitContext(outil) {
  const poste = experiences.find((experience) => experience.stats);

  if (outil.id !== "optiprofit" || !poste) {
    return "";
  }

  return `${label("Contexte mesuré")}
    <div class="s-pf">
      <span>Poste où il a servi : <a class="s-link" href="#${experienceId(poste)}" data-open="${experienceId(poste)}">${poste.company}, ${period(poste.date)}${arrow("arrow-right")}</a></span>
      <span>${poste.statsLabel} ${statsText(poste).map((text) => `<b>${text}</b>`).join(" · ")}.</span>
      <small>${poste.statsBase} Plusieurs actions ont joué ensemble : l’outil n’explique pas l’écart à lui seul.</small>
    </div>`;
}

function renderOutils() {
  return outils
    .map((outil, index) =>
      row({
        meta: pad(index),
        title: outil.title,
        sub: outil.category,
        side: outil.status,
        body: `${outil.detailLabel ? label(outil.detailLabel) : ""}
          <p>${outil.summary}</p>
          ${label("Situation")}<p>${outil.context}</p>
          ${outil.arbitrage ? `${label("Décision")}<p>${outil.arbitrage}</p>` : ""}
          ${label("Réponse")}<p>${outil.action}</p>
          ${label("Résultat")}<p>${outil.results}</p>
          ${renderOptiProfitContext(outil)}
          ${chips(outil.chips)}
          ${outil.link ? externalLink(outil.link) : ""}`,
      }),
    )
    .join("");
}

/* ---------- Projets, compétences, formation ---------------------------- */

function renderProjets() {
  return projetsTransverses
    .map((projet, index) =>
      row({
        meta: pad(index),
        title: projet.short,
        sub: projet.subtitle,
        body: `<p class="s-strong">${projet.title}</p>
          <ul class="s-list">${projet.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
          ${label("Compétences transférables")}
          <ul class="s-list">${projet.transferableSkills.map((skill) => `<li><b>${skill.title}</b> — ${skill.text}</li>`).join("")}</ul>
          ${projet.link ? externalLink(projet.link) : ""}`,
      }),
    )
    .join("");
}

function renderCompetences() {
  return competences
    .map((competence, index) =>
      row({
        meta: pad(index),
        title: competence.title,
        sub: competence.detailLabel,
        side: competence.summary,
        body: `${label("Enjeu traité")}<p>${competence.enjeu}</p>
          ${label("Ce que j’ai mis en place")}<p>${competence.miseEnPlace}</p>
          ${label("Exemple concret")}<p>${competence.exemple}</p>
          ${label("Résultat observable")}<p>${competence.resultat}</p>
          ${chips(competence.tags)}`,
      }),
    )
    .join("");
}

function renderFormation() {
  const quote = formationContent.quote.replace(
    "besoins rencontrés en magasin",
    "<em>besoins rencontrés en magasin</em>",
  );

  return `${row({
    meta: formationContent.year,
    title: formationContent.title,
    sub: formationContent.subtitle,
    body: `${label("Compétences acquises en autodidacte")}
      <ul class="s-list">${formationContent.continuousSkills.map((skill) => `<li><b>${skill.title}</b> — ${skill.text}</li>`).join("")}</ul>`,
  })}
  <p class="s-big">${quote}</p>`;
}

/* ---------- Page ------------------------------------------------------- */

function renderHero() {
  const [first, ...rest] = contact.name.split(" ");
  let index = 0;
  const word = (text) =>
    `<span class="s-w" aria-hidden="true">${[...text]
      .map((letter) => `<span class="s-l" style="--i:${index++}">${letter}</span>`)
      .join("")}</span>`;
  const territories = contact.secondaryRole.split(" · ");
  /* La bande répète les quatre territoires pour boucler : seule la première
     série est lue par un lecteur d'écran, les trois autres sont des copies
     décoratives. C'est la seule ligne de l'écran qui porte « 14 ans » et les
     territoires : la rendre muette la retirait aux lecteurs d'écran. */
  const strip = [0, 1, 2, 3].flatMap((copy) =>
    territories.map((item) => `<span${copy ? ' aria-hidden="true"' : ""}>${item}</span>`),
  );
  /* La ligne de poste vient d'abord et se lit comme une phrase ; le parcours
     passe en second, en registre mono. Chaque segment est insécable : la coupe
     ne peut tomber qu'entre deux. */
  const background = contact.hero.background
    .split(" · ")
    .map((part) => `<span class="s-nb">${part}</span>`)
    .join(" · ");

  return `
    <header class="s-hero" id="accueil">
      <h1 class="s-name" aria-label="${contact.name}">${word(first)}${word(rest.join(" "))}</h1>
      <div class="s-photo"><img src="${contact.portrait.src}" width="${contact.portrait.width}" height="${contact.portrait.height}" alt="Portrait de ${contact.name}" /></div>
      <p class="s-tag"><span class="s-tag-main">${contact.hero.target}</span><span class="s-tag-sub s-mono">${background}</span></p>
      <button type="button" class="s-arrow" data-scroll-next aria-label="Lire la suite">${boldIcon("arrow-down")}</button>
    </header>
    <div class="s-ticker"><div>${strip.join("")}</div></div>`;
}

function renderTop() {
  return `<a class="s-skiplink" href="#contenu">Aller au contenu</a>
  <div class="s-top">
    <a class="s-brand s-mono" href="#profil" data-section-link="profil">${contact.name}</a>
    <nav class="s-nav s-mono" aria-label="Sections du CV">
      ${sections
        .map(
          (item) =>
            `<button type="button" class="s-nav-item" data-section="${item.id}" aria-label="${item.label}">${item.short}</button>`,
        )
        .join("")}
    </nav>
    <div class="s-cmds s-mono">
      <button type="button" class="s-cmd" data-open-export aria-haspopup="dialog"><span class="s-long">Exporter &amp; Partager</span><span class="s-short">CV · PDF</span></button>
      <button type="button" class="s-cmd" data-open-contact aria-haspopup="dialog">Contact</button>
    </div>
  </div>`;
}

function renderFooter() {
  const live = getLiveProducts();

  return `<footer class="s-foot">
    <button type="button" class="s-contact" data-open-contact aria-haspopup="dialog">Me <span class="s-nb">contacter${boldIcon("arrow-up-right", { className: "s-ico" })}</span></button>
    <div class="s-foot-meta s-mono">
      <span>${contact.name}<br />${contact.items[0].text}</span>
      <span class="s-live">${live
        .map(
          (product) =>
            `<a class="s-link" href="${product.url}" target="_blank" rel="noopener noreferrer">${product.name}${arrow()}${NEW_WINDOW}</a>`,
        )
        .join("")}</span>
      <span class="s-live">
        <button type="button" class="s-link s-foot-cmd" data-open-export aria-haspopup="dialog">CV · recto A4 (PDF)</button>
        <button type="button" class="s-link s-foot-cmd" data-open-export aria-haspopup="dialog">Partager</button>
      </span>
    </div>
  </footer>`;
}

export function renderSite() {
  const byId = Object.fromEntries(sections.map((item) => [item.id, item]));

  return `<div class="site">
    ${renderTop()}
    <main id="contenu" tabindex="-1">
      <div class="s-first" id="profil" data-spy>
        ${renderHero()}
        <div class="s-wrap">${renderProfile()}</div>
      </div>
      <div class="s-wrap">
        ${[
          { id: "experience", title: byId.experience.label, count: `${experiences.length} postes`, inner: renderExperiences() },
          { id: "outils", title: byId.outils.label, count: `${outils.length} outils`, inner: renderOutils() },
          { id: "competences", title: byId.competences.label, count: `${competences.length} domaines`, inner: renderCompetences() },
          { id: "projet", title: byId.projet.short, count: `${projetsTransverses.length} projets`, inner: renderProjets() },
          { id: "formation", title: byId.formation.label, count: formationContent.year, inner: renderFormation() },
        ]
          .map((item, position) => section({ ...item, index: pad(position) }))
          .join("")}
        ${renderFooter()}
      </div>
    </main>
    ${renderContactModal()}
    ${renderExportPanel()}
    <button type="button" class="s-skip s-mono" id="skip"><span>Passer</span>${boldIcon("close")}</button>
  </div>`;
}
