import { experiences } from "../data/experiences.js";
import { formationContent, profileContent } from "../data/profile.js";
import {
  natureClass,
  renderBulletList,
  renderDiscloseCommand,
  renderSmallCard,
  renderTagRow,
} from "./renderUtils.js";

/* La photo a rejoint l'identité, à droite du nom : elle y est visible depuis
   toutes les sections, pas seulement depuis celle-ci. La citation reprend
   donc l'ouverture pour elle seule. */
export function renderProfilSection() {
  return `
    <div class="punchline-box n-cadre">
      <p>${profileContent.quote}</p>
    </div>

    <div class="card n-cadre">
      <div class="card-title"><div class="dot"></div>Profil professionnel</div>
      <div class="card-text">${profileContent.intro}</div>
    </div>

    <div class="grid-2 profile-cards">
      ${profileContent.cards
        .map((card) =>
          renderSmallCard(card, { titleSize: "16px", dimText: false }),
        )
        .join("")}
    </div>

    <div class="card n-produit">
      <div class="card-title"><div class="dot"></div>Expertise clé</div>
      <div class="card-text">${profileContent.expertise}</div>
    </div>

    <div class="section-label">Ce que j'apporte</div>
    ${renderTagRow(profileContent.contributionTags)}

    <div class="card n-cadre">
      <div class="card-title"><div class="dot"></div>Ce que je vise</div>
      <div class="card-text">${profileContent.target}</div>
    </div>
  `;
}

/* `label` est facultatif : sans lui, aucune ligne n'est ouverte sous la
   valeur. */
function renderStat(item) {
  return `
      <div class="stats-item">
        <div class="stats-value">${item.value}</div>
        ${item.label ? `<div class="stats-label">${item.label}</div>` : ""}
      </div>`;
}

/* Les chiffres restent visibles fermés. C'est la règle du CV : un résultat
   mesuré sort du corps de texte, et il ne doit pas attendre un clic pour se
   lire — le lecteur qui n'ouvre rien doit quand même repartir avec +83 %.

   Ils sont posés **hors du bouton** : un <div> dans un <button> n'est pas du
   contenu admis, et le résumé ne porte que du contenu de phrasé. Leur base de
   comparaison les suit immédiatement : séparée d'eux, elle ne se rapporterait
   plus à rien de lisible. */
function renderStatsBlock(experience) {
  const { statsLabel, stats, statsBase } = experience;

  if (!stats) {
    return "";
  }

  return `
    <div class="tl-outcome exp-proof n-preuve">
      ${statsLabel ? `<div class="tl-outcome-label">${statsLabel}</div>` : ""}
      <div class="stats-spotlight">
        ${stats.map(renderStat).join('<div class="stats-divider"></div>')}
      </div>
      ${statsBase ? `<p class="tl-outcome-base">${statsBase}</p>` : ""}
    </div>`;
}

/* Le texte du résultat, lui, appartient au panneau : il conclut les puces qui
   le précèdent, et lu seul il ne dirait rien. */
function renderResult(experience) {
  if (!experience.result) {
    return "";
  }

  return `
    <div class="tl-outcome n-preuve">
      <p class="tl-outcome-text">${experience.result}</p>
    </div>`;
}

/* Chaque enseigne est un item insécable, et le point médian reste collé à
   celle qui précède. La coupure ne peut donc tomber qu'entre deux enseignes,
   où elle se lit — jamais dans « Grand / Optical », jamais avec une puce
   orpheline en tête de ligne. Le texte assemblé est celui de la donnée,
   mot pour mot : « GrandOptical · Krys · Lissac ». */
function renderCompany(company) {
  const items = company.split(" · ");

  return items
    .map(
      (item, index) =>
        `<span class="exp-co">${item}${index < items.length - 1 ? " ·" : ""}</span>`,
    )
    .join(" ");
}

/* Troisième famille du composant d'accordéon (js/ui/accordion.js), mêmes
   règles que les Outils et les Compétences : le panneau est toujours dans le
   document, replié, `inert` ; le résumé est un <button> à contenu de phrasé ;
   aucune fiche n'est ouverte à l'arrivée.

   Le panneau porte le cadrage dans une colonne et les puces dans l'autre :
   le cadrage dit dans quelle situation les puces ont été menées, il se lit
   avant elles et à côté d'elles. Le poste et la période ne sont pas répétés
   dans le panneau : ils sont dans la ligne juste au-dessus. */
function renderExperience(experience, expandedId, expandAll) {
  const isExpanded = expandAll || expandedId === experience.id;
  const panelId = `exp-panel-${experience.id}`;
  const buttonId = `exp-toggle-${experience.id}`;

  return `
    <article class="timeline-item exp-card tl-${experience.recency} ${natureClass("cadre")}${isExpanded ? " is-open" : ""}">
      <button
        type="button"
        id="${buttonId}"
        class="exp-summary"
        data-experience="${experience.id}"
        aria-expanded="${isExpanded ? "true" : "false"}"
        aria-controls="${panelId}"
      >
        <span class="tl-header">
          <span class="tl-date">${experience.date}</span>
          <span class="exp-name">
            <span class="tl-company">${renderCompany(experience.company)}</span>
            <span class="tl-role">${experience.role}</span>
          </span>
          ${renderDiscloseCommand(experience.detailLabel)}
        </span>
      </button>
      ${renderStatsBlock(experience)}
      <div
        id="${panelId}"
        class="exp-panel"
        role="region"
        aria-labelledby="${buttonId}"
        aria-hidden="${isExpanded ? "false" : "true"}"
        ${isExpanded ? "" : "inert"}
      >
        <div class="exp-details">
          <div class="exp-details-grid">
            ${experience.context ? `<p class="tl-context">${experience.context}</p>` : ""}
            <div class="exp-story">
              ${renderBulletList(experience.bullets)}
              ${renderResult(experience)}
            </div>
          </div>
        </div>
      </div>
    </article>`;
}

export function renderExperiencesSection(expandedId = null, options = {}) {
  const { expandAll = false } = options;

  return experiences
    .map((experience) => renderExperience(experience, expandedId, expandAll))
    .join("");
}

export function renderFormationSection() {
  return `
    <div class="formation-card n-socle">
      <div class="formation-year">${formationContent.year}</div>
      <div>
        <div class="formation-title">${formationContent.title}</div>
        <div class="formation-sub">${formationContent.subtitle}</div>
      </div>
    </div>

    <div class="section-label">Compétences acquises en autodidacte</div>
    <div class="grid-2">
      ${formationContent.continuousSkills.map(renderSmallCard).join("")}
    </div>

    <div class="punchline-box n-socle">
      <p>${formationContent.quote}</p>
    </div>
  `;
}
