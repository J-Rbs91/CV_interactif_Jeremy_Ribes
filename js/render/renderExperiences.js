import { experiences, realisations } from "../data/experiences.js";
import { formationContent, profileContent } from "../data/profile.js";
import { icon } from "../ui/icons.js";
import {
  natureClass,
  renderBulletList,
  renderSmallCard,
  renderTagRow,
} from "./renderUtils.js";

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

export function renderRealisationsSection() {
  const [firstStat, secondStat] = realisations.stats;

  return `
    <div class="punchline-box stats-spotlight n-preuve">
      <div class="stats-item">
        <div class="stats-value">${firstStat.value}</div>
        <div class="stats-label">${firstStat.label}</div>
      </div>
      <div class="stats-divider"></div>
      <div class="stats-item">
        <div class="stats-value">${secondStat.value}</div>
        <div class="stats-label">${secondStat.label}</div>
      </div>
    </div>
    <div class="section-label">Pilotage et redynamisation commerciale</div>
    <p class="note">${realisations.note.replace(/(Outils|Projets transverses)/g, "<strong>$1</strong>")}</p>
    ${realisations.items
      .map(
        (item) => `
          <div class="real-card ${natureClass(item.nature)}">
            <div class="real-icon">${icon(item.icon)}</div>
            <div class="real-text">${item.text}</div>
          </div>
        `,
      )
      .join("")}
  `;
}

export function renderExperiencesSection() {
  return experiences
    .map(
      (experience) => `
        <div class="timeline-item tl-${experience.recency}">
          <div class="tl-header">
            <span class="tl-role">${experience.role}</span>
            <span class="tl-company">${experience.company}</span>
            <span class="tl-date">${experience.date}</span>
          </div>
          ${renderBulletList(experience.bullets)}
          ${experience.tags ? `<div class="tl-tags">${renderTagRow(experience.tags)}</div>` : ""}
        </div>
      `,
    )
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

    <div class="section-label">Compétences développées en continu</div>
    <div class="grid-2">
      ${formationContent.continuousSkills.map(renderSmallCard).join("")}
    </div>

    <div class="punchline-box n-socle">
      <p>${formationContent.quote}</p>
    </div>
  `;
}
