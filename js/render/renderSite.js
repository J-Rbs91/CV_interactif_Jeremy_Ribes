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
import { linkHost } from "./renderUtils.js";

/* ---------- Briques ---------------------------------------------------- */

const pad = (index) => String(index + 1).padStart(2, "0");

const label = (text) => `<div class="s-lab s-mono">${text}</div>`;

const chips = (items) =>
  `<div class="s-chips">${items.map((item) => `<span>${item}</span>`).join("")}</div>`;

function externalLink(link) {
  return `<p><a class="s-link" href="${link.url}" target="_blank" rel="noopener noreferrer" data-host="${linkHost(link.url)}">${link.label} ↗</a></p>`;
}

/* Une ligne d'index qui s'ouvre en place. <details> plutôt qu'un composant :
   le clavier, le lecteur d'écran et la recherche dans la page sont gérés par le
   navigateur, et rien n'est reconstruit à l'ouverture — donc rien ne perd son
   focus. `side` est la colonne de droite, `meta` la colonne de gauche. */
function row({ id, meta, title, sub, side = "", body }) {
  return `<details class="s-row"${id ? ` id="${id}"` : ""}>
    <summary>
      <span class="s-n s-mono">${meta}</span>
      <span class="s-t">${title}${sub ? `<small>${sub}</small>` : ""}</span>
      <span class="s-s">${side}</span>
      <span class="s-pm" aria-hidden="true">+</span>
    </summary>
    <div class="s-body"><span></span><div class="s-in">${body}</div></div>
  </details>`;
}

function section({ id, index, title, count, inner }) {
  return `<section class="s-sec" id="${id}" data-spy>
    <div class="s-sh s-mono"><span>${index}</span><span>${count}</span></div>
    <h2>${title}</h2>
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
    <p class="s-big">${profileContent.headline}</p>
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
      <summary>Mon parcours, ma méthode et les limites de mon expérience</summary>
      <div class="s-profile">
        <div class="s-block">
          ${label("Pourquoi j’envisage d’autres secteurs")}
          <p>${context}</p>
          <p>${ambition}</p>
        </div>
        <div class="s-block">
          ${label("Ce que je n’ai pas encore exercé")}
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
      const proof = experience.stats
        ? `<p class="s-pf"><span>${statsText(experience)
            .map((text) => `<b>${text}</b>`)
            .join(" · ")}</span><small>${experience.statsLabel} — ${experience.statsBase}</small></p>`
        : "";
      const chip = experience.stats
        ? `<span class="s-pchip">${statsText(experience).join(" · ")}</span>`
        : "";

      return row({
        id: experienceId(experience),
        meta: experience.date,
        title: company(experience.company),
        sub: experience.role,
        side: chip,
        body: `${experience.detailLabel ? label(experience.detailLabel) : ""}
          ${experience.context ? `<p>${experience.context}</p>` : ""}
          <ul class="s-list">${experience.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
          ${proof}
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
      <span>Poste où il a servi : <a class="s-link" href="#${experienceId(poste)}" data-open="${experienceId(poste)}">${poste.company}, ${poste.date} ↗</a></span>
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
        side: competence.summary,
        body: `${competence.detailLabel ? label(competence.detailLabel) : ""}
          ${label("Enjeu traité")}<p>${competence.enjeu}</p>
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
    "problèmes",
    "<em>problèmes</em>",
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
  const strip = [...territories, ...territories, ...territories, ...territories];

  return `
    <header class="s-hero" id="accueil">
      <h1 class="s-name" aria-label="${contact.name}">${word(first)}${word(rest.join(" "))}</h1>
      <div class="s-photo"><img src="${contact.portrait.src}" width="${contact.portrait.width}" height="${contact.portrait.height}" alt="Portrait de ${contact.name}" /></div>
      <p class="s-tag s-mono"><b>${contact.hero.background}</b><br />${contact.hero.target}</p>
      <div class="s-arrow" aria-hidden="true">↓</div>
    </header>
    <div class="s-ticker" aria-hidden="true"><div>${strip.map((item) => `<span>${item}</span>`).join("")}</div></div>`;
}

function renderTop() {
  return `<div class="s-top">
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
      <button type="button" class="s-cmd" data-open-export aria-haspopup="dialog"><span class="s-long">Partager &amp; Exporter</span><span class="s-short">Exporter</span></button>
      <button type="button" class="s-cmd" data-open-contact aria-haspopup="dialog">Contact</button>
    </div>
  </div>`;
}

function renderFooter() {
  const live = getLiveProducts();

  return `<footer class="s-foot">
    <button type="button" class="s-contact" data-open-contact aria-haspopup="dialog">Me contacter ↗</button>
    <div class="s-foot-meta s-mono">
      <span>${contact.name}<br />${contact.items[0].text}</span>
      <span class="s-live">${live
        .map(
          (product) =>
            `<a class="s-link" href="${product.url}" target="_blank" rel="noopener noreferrer">${product.name} ↗</a>`,
        )
        .join("")}</span>
    </div>
  </footer>`;
}

export function renderSite() {
  const byId = Object.fromEntries(sections.map((item) => [item.id, item]));

  return `<div class="site">
    ${renderTop()}
    <main>
      <div class="s-first" id="profil" data-spy>
        ${renderHero()}
        <div class="s-wrap">${renderProfile()}</div>
      </div>
      <div class="s-wrap">
        ${section({ id: "experience", index: "01", title: byId.experience.label, count: `${experiences.length} postes`, inner: renderExperiences() })}
        ${section({ id: "outils", index: "02", title: byId.outils.label, count: `${outils.length} outils`, inner: renderOutils() })}
        ${section({ id: "projet", index: "03", title: byId.projet.short, count: `${projetsTransverses.length} projets`, inner: renderProjets() })}
        ${section({ id: "competences", index: "04", title: byId.competences.label, count: `${competences.length} domaines`, inner: renderCompetences() })}
        ${section({ id: "formation", index: "05", title: byId.formation.label, count: formationContent.year, inner: renderFormation() })}
        ${renderFooter()}
      </div>
    </main>
    ${renderContactModal()}
    ${renderExportPanel()}
    <button type="button" class="s-skip s-mono" id="skip">Passer</button>
  </div>`;
}
