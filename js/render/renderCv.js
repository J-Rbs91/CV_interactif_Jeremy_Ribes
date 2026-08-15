/* Recto A4 — le CV proprement dit.
   -------------------------------------------------------------------------
   `renderPrintDocument()` produit six pages : toutes les sections, toutes les
   fiches depliees. C'est une presentation complete, et le bouton qui l'ouvre
   le dit desormais. Un CV est autre chose : un recto A4, lu en trente
   secondes, dont la contrainte de format EST la methode de selection.

   Ce document ne rentre donc pas la vue integrale dans une page. Il repart
   des memes donnees et n'en retient que ce qui repond a quatre questions,
   dans cet ordre : qui, pour quel role, avec quelle preuve, par quel
   parcours. Tout ce qui documente plutot qu'il ne repond est reste dans la
   presentation complete, ou le lien de l'en-tete conduit.

   Trois regles tiennent la page, et se perdent des qu'on ajoute :
   - Aucun texte metier n'est reecrit ici. Chaque chaine vient de `js/data/` :
     ce document choisit, il ne redige pas. Une phrase composee dans ce
     fichier serait une copie qui derive au premier ajustement des donnees.
   - La selection appartient aux donnees (`a4Bullets`, `a4Stats`), pas au
     rendu. Le jour ou une puce devient la meilleure d'une fiche, on change
     un rang dans `experiences.js`, pas une regle ici.
   - Une seule tache chiffree. Sur une page unique, deux blocs de chiffres se
     neutralisent, et le lecteur n'en verifie plus aucun. */
import { contact } from "../data/contact.js";
import { competences } from "../data/competences.js";
import { experiences } from "../data/experiences.js";
import { formationContent, profileContent } from "../data/profile.js";
import { outils } from "../data/outils.js";
import { projetsTransverses } from "../data/projets.js";
import { renderPortrait } from "./renderContact.js";
import { natureClass } from "./renderUtils.js";

function renderRow(label, body, className = "") {
  return `<div class="cv1-row ${className}">
    <div class="cv1-key">${label}</div>
    <div class="cv1-val">${body}</div>
  </div>`;
}

function renderHead() {
  const place = contact.items.find((item) => item.icon === "pin");

  return `<header class="cv1-head">
    <div class="cv1-identity">
      <h1>${contact.name}</h1>
      <div class="cv1-role">${contact.role}</div>
      <div class="cv1-role2">${contact.secondaryRole}</div>
      <div class="cv1-facts">
        ${place ? `<span>${place.text}</span>` : ""}
        <span class="cv1-site">${contact.site.host}</span>
      </div>
    </div>
    ${renderPortrait("cv1-photo")}
  </header>`;
}

/* Le cadre : ce que je fais, et ce que je cherche. Deux phrases, et c'est la
   seule prose du recto — le reste est du fait verifiable. Elles precedent le
   parcours parce qu'un lecteur qui ignore la cible lit les postes sans savoir
   ce qu'il doit y chercher. */
function renderFrame() {
  return `<div class="cv1-frame">
    ${renderRow("Expertise", profileContent.expertise)}
    ${renderRow("Recherche", profileContent.target)}
  </div>`;
}

/* La seule tache chiffree de la page, prise a la fiche qui porte `a4Stats`.
   La base de comparaison voyage avec les chiffres : un ecart sans sa base se
   lit comme une affirmation invérifiable, et c'est la premiere question posee
   en entretien. */
function renderProof() {
  const source = experiences.find((experience) => experience.a4Stats);

  if (!source?.stats?.length) {
    return "";
  }

  const values = source.stats
    .map(
      (stat) =>
        `<span class="cv1-stat"><span class="cv1-stat-value">${stat.value}</span>${
          stat.label ? `<span class="cv1-stat-label">${stat.label}</span>` : ""
        }</span>`,
    )
    .join("");

  /* `statsLabel` ouvre la phrase que les chiffres terminent — « ces actions
     ont contribué à » — et doit donc les preceder. Repousse dessous avec la
     base de comparaison, il donnait « +83 % CA · ont contribué à ». */
  const lead = [`${source.company} · ${source.date}`, source.statsLabel]
    .filter(Boolean)
    .join(" — ");

  return `<div class="cv1-proof n-preuve">
    <div class="cv1-key">Résultats mesurés</div>
    <div class="cv1-val">
      <div class="cv1-note cv1-note-lead">${lead}</div>
      <div class="cv1-stats">${values}</div>
      ${source.statsBase ? `<div class="cv1-note">${source.statsBase}</div>` : ""}
    </div>
  </div>`;
}

/* Les seuls intitules, en une ligne courante. Leurs resumes tenaient ici au
   depart : cinq lignes de plus, trente millimetres, soit le huitieme d'une
   page pour redire ce que l'expertise, les chiffres et les postes venaient
   d'etablir. Sur un recto, ce n'est pas une redondance acceptable, c'est la
   place d'un poste entier.

   Les intitules restent parce qu'ils nomment les cinq domaines d'un coup
   d'oeil, ce qu'aucun autre bloc de la page ne fait. Leur detail — enjeu,
   mise en place, exemple, resultat — est dans la presentation complete, ou
   le pied de page conduit. */
function renderSkills() {
  const items = competences
    .map(
      (competence) =>
        `<span class="cv1-skill ${natureClass(competence.nature)}">${competence.title}</span>`,
    )
    .join("");

  return renderRow("Compétences", `<div class="cv1-skills">${items}</div>`);
}

function renderJob(experience) {
  const ranks = experience.a4Bullets ?? [];
  const bullets = ranks
    .map((rank) => experience.bullets?.[rank])
    .filter(Boolean);

  return `<article class="cv1-job">
    <div class="cv1-job-head">
      <span class="cv1-job-date">${experience.date}</span>
      <span class="cv1-job-role">${experience.role}</span>
      <span class="cv1-job-company">${experience.company}</span>
    </div>
    ${experience.context ? `<p class="cv1-job-context">${experience.context}</p>` : ""}
    ${
      bullets.length
        ? `<ul class="cv1-bullets">${bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`
        : ""
    }
    ${experience.result ? `<p class="cv1-job-result">${experience.result}</p>` : ""}
  </article>`;
}

/* Le statut d'un outil est la seule chose que le recto en retient. Ni le
   resume, ni la categorie ne disent ce que dit « Resté en service après mon
   départ » : c'est la difference entre avoir fait des outils et avoir des
   outils utilises sans soi. */
function renderTools() {
  return outils
    .map(
      (outil) => `<li class="${natureClass(outil.nature)}">
        <span class="cv1-item-title">${outil.title}</span>
        <span class="cv1-item-note">${outil.status}</span>
      </li>`,
    )
    .join("");
}

function renderProjects() {
  return projetsTransverses
    .map((projet) => {
      const [name, ...rest] = projet.title.split(" : ");

      return `<li class="n-produit">
        <span class="cv1-item-title">${name}</span>
        <span class="cv1-item-note">${rest.join(" : ")}</span>
      </li>`;
    })
    .join("");
}

function renderSideBlock(title, items) {
  return `<section class="cv1-block">
    <h2 class="cv1-block-title">${title}</h2>
    <ul class="cv1-items">${items}</ul>
  </section>`;
}

export function renderCvDocument() {
  return `<div class="cv-a4">
    ${renderHead()}
    ${renderFrame()}
    ${renderProof()}
    ${renderSkills()}

    <div class="cv1-body">
      <main class="cv1-main">
        <h2 class="cv1-block-title">Parcours</h2>
        ${experiences.map(renderJob).join("")}
      </main>

      <aside class="cv1-side">
        ${renderSideBlock("Outils conçus", renderTools())}
        ${renderSideBlock("Projets transverses", renderProjects())}
        ${renderSideBlock(
          "Formation",
          `<li class="n-socle">
            <span class="cv1-item-title">${formationContent.title}</span>
            <span class="cv1-item-note">${formationContent.subtitle} · ${formationContent.year}</span>
          </li>`,
        )}
      </aside>
    </div>

    <footer class="cv1-foot">
      Présentation complète, outils et projets détaillés :
      <span class="cv1-site">${contact.site.host}</span>
    </footer>
  </div>`;
}
