import { experiences, realisations } from "../data/experiences.js";
import { formationContent, profileContent } from "../data/profile.js";
import {
  renderBulletList,
  renderSmallCard,
  renderTagRow,
} from "./renderUtils.js";

export function renderProfilSection() {
  return `
    <div class="punchline-box">
      <p>${profileContent.quote}</p>
    </div>

    <div class="card">
      <div class="card-title"><div class="dot" style="background:var(--accent2)"></div>Profil professionnel</div>
      <div class="card-text">${profileContent.intro}</div>
    </div>

    <div class="grid-2 profile-cards">
      ${profileContent.cards
        .map((card) =>
          renderSmallCard(card, { titleSize: "16px", dimText: false }),
        )
        .join("")}
    </div>

    <div class="card">
      <div class="card-title"><div class="dot" style="background:var(--accent3)"></div>Expertise clé</div>
      <div class="card-text">${profileContent.expertise}</div>
    </div>

    <div class="section-label">Ce que j'apporte</div>
    ${renderTagRow(profileContent.contributionTags)}

    <div class="card">
      <div class="card-title"><div class="dot" style="background:var(--accent)"></div>Ce que je vise</div>
      <div class="card-text">${profileContent.target}</div>
    </div>
  `;
}

export function renderRealisationsSection() {
  const [firstStat, secondStat] = realisations.stats;

  return `
    <div class="punchline-box stats-spotlight">
      <div class="stats-item">
        <div class="stats-value" style="color:${firstStat.color}">${firstStat.value}</div>
        <div class="stats-label">${firstStat.label}</div>
      </div>
      <div class="stats-divider"></div>
      <div class="stats-item">
        <div class="stats-value" style="color:${secondStat.color}">${secondStat.value}</div>
        <div class="stats-label">${secondStat.label}</div>
      </div>
    </div>
    <div class="section-label">Pilotage et redynamisation commerciale</div>
    <div class="card-sm" style="margin-bottom:2px"><div class="card-text dim">${realisations.note.replace("Outils", "<strong>Outils</strong>")}</div></div>
    ${realisations.items
      .map(
        (item) => `
          <div class="real-card" style="border-left:3px solid ${item.accent}">
            <div class="real-icon">${item.icon}</div>
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
        <div class="timeline-item"${experience.accent ? ` style="--c:${experience.accent}"` : ""}>
          <div class="tl-header">
            <span class="tl-role">${experience.role}</span>
            <span class="tl-company">${experience.company}</span>
            <span class="tl-date">${experience.date}</span>
          </div>
          ${renderBulletList(experience.bullets)}
          ${experience.tags ? `<div style="margin-top:8px">${renderTagRow(experience.tags)}</div>` : ""}
        </div>
      `,
    )
    .join("");
}

export function renderFormationSection() {
  return `
    <div class="formation-card">
      <div class="formation-year">${formationContent.year}</div>
      <div>
        <div class="formation-title">${formationContent.title}</div>
        <div class="formation-sub">${formationContent.subtitle}</div>
      </div>
    </div>

    <div class="section-label" style="margin-top:12px">Compétences développées en continu</div>
    <div class="grid-2">
      ${formationContent.continuousSkills.map(renderSmallCard).join("")}
    </div>

    <div class="punchline-box" style="margin-top:8px">
      <p>${formationContent.quote}</p>
    </div>
  `;
}
