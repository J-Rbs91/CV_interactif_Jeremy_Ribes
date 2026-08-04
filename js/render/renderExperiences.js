import { experiences } from "../data/experiences.js";
import { formationContent, profileContent } from "../data/profile.js";
import { renderBulletList, renderSmallCard, renderTagRow } from "./renderUtils.js";

/* La photo ouvre le Profil, face à la citation.

   Pas dans la colonne de gauche : elle porte 811 px de contenu fixe et
   déborde déjà sous 800 px de fenêtre, donc tout ce qu'on y ajoute pousse la
   navigation sous la ligne de flottaison. Ici elle ne déplace rien — elle
   occupe le vide qui suivait la citation, borné à 40 caractères sur une
   colonne qui en fait trois fois plus. Et le Profil est la section d'accueil :
   elle se voit sans qu'on ait à la chercher. */
export function renderProfilSection() {
  return `
    <div class="profil-head">
      <div class="punchline-box n-cadre">
        <p>${profileContent.quote}</p>
      </div>
      <img
        class="profil-photo"
        src="./assets/img/portrait/me.jpg"
        width="405"
        height="405"
        alt="Jérémy Ribes"
      />
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

/* Bloc facultatif : rendu uniquement si l'expérience déclare `stats` ou
   `result`. */
function renderOutcome(experience) {
  const { statsLabel, stats, result } = experience;

  if (!stats && !result) {
    return "";
  }

  return `
    <div class="tl-outcome n-preuve">
      ${statsLabel ? `<div class="tl-outcome-label">${statsLabel}</div>` : ""}
      ${
        stats
          ? `<div class="stats-spotlight">
              ${stats.map(renderStat).join('<div class="stats-divider"></div>')}
            </div>`
          : ""
      }
      ${result ? `<p class="tl-outcome-text">${result}</p>` : ""}
    </div>`;
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
          ${experience.context ? `<p class="tl-context">${experience.context}</p>` : ""}
          ${renderBulletList(experience.bullets)}
          ${renderOutcome(experience)}
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

    <div class="section-label">Compétences acquises en autodidacte</div>
    <div class="grid-2">
      ${formationContent.continuousSkills.map(renderSmallCard).join("")}
    </div>

    <div class="punchline-box n-socle">
      <p>${formationContent.quote}</p>
    </div>
  `;
}
