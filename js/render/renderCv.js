/* Recto A4 — un CV en competences.
   -------------------------------------------------------------------------
   `renderPrintDocument()` produit six pages : toutes les sections, toutes les
   fiches depliees. C'est une presentation complete, et le bouton qui l'ouvre
   le dit. Un CV est autre chose : un recto, lu en trente secondes, dont la
   contrainte de format EST la methode de selection.

   **Ce document n'est pas une miniature du site.** C'est la regle dont tout
   le reste decoule. Le site demontre et explique — chaque fiche deroule
   situation, arbitrage, reponse, constat ; le recto selectionne. La matiere
   la plus differenciante est dans les competences et leurs preuves, pas dans
   le nombre de realisations : une page qui reduirait chaque section du site
   d'un facteur six rendrait tout egal, donc rien lisible.

   D'ou la hierarchie, qui n'est pas celle du site :
     1. nom et positionnement    4. resultats et adoption
     2. accroche, deux phrases   5. parcours, condense
     3. cinq competences prouvees 6. projets, methodes, formation
   Le parcours vient apres les competences et n'occupe qu'un cinquieme de la
   page : sa fonction est de donner la profondeur de terrain qui rend les
   competences credibles, pas de raconter des postes.

   Trois regles tiennent la page, et se perdent des qu'on ajoute :
   - **Aucun texte metier n'est redige ici.** Chaque chaine vient de
     `js/data/`. Une phrase composee dans ce fichier serait une copie qui
     derive au premier ajustement des donnees.
   - **La selection appartient aux donnees** (`a4Rank`, `a4Statement`,
     `a4Proofs`, `a4Summary`, `a4Content`), pas au rendu.
   - **Une seule tache chiffree.** Sur une page unique, deux blocs de chiffres
     se neutralisent et le lecteur n'en verifie plus aucun. */
import { contact } from "../data/contact.js";
import { competences } from "../data/competences.js";
import { experiences } from "../data/experiences.js";
import { a4Content, formationContent } from "../data/profile.js";
import { getLiveProducts, renderPortrait } from "./renderContact.js";
import { linkHost, natureClass } from "./renderUtils.js";

function renderRow(label, body, className = "") {
  return `<div class="cv1-row${className ? ` ${className}` : ""}">
    <div class="cv1-key">${label}</div>
    <div class="cv1-val">${body}</div>
  </div>`;
}

/* Les adresses en ligne, groupees : celle du CV d'abord — c'est la seule voie
   de retour d'une feuille qui a quitte son support — puis les produits
   reellement joignables. Un recruteur qui veut verifier n'a pas a chercher.

   C'est aussi le seul endroit ou l'adresse du site figure. Un pied de page la
   repetait, avec une invitation a y trouver le detail : douze millimetres pour
   redire une ligne deja lue en tete, sur une page qui manquait d'air. */
function renderLinks() {
  const hosts = [
    contact.site.host,
    ...getLiveProducts().map((product) => linkHost(product.url)),
  ];

  return `<div class="cv1-links">${hosts
    .map((host) => `<span class="cv1-site">${host}</span>`)
    .join("")}</div>`;
}

/* Le portrait tient dans la hauteur que l'identite occupe deja : a 22 mm il
   est plus court que le nom, le positionnement et les adresses empiles, et ne
   coute donc rien a la page. Le retirer ne libere pas une ligne — c'est une
   question de fond, pas de place, et elle appartient au contenu. */
function renderHead() {
  return `<header class="cv1-head">
    <div class="cv1-identity">
      <h1>${contact.name}</h1>
      <div class="cv1-positioning">${contact.a4.positioning}</div>
      <div class="cv1-facts">${contact.a4.experience} · ${
        contact.items.find((item) => item.icon === "pin")?.text ?? ""
      }</div>
      ${renderLinks()}
    </div>
    ${renderPortrait("cv1-photo")}
  </header>`;
}

/* Le bloc le plus long de la page, et c'est voulu : c'est lui qui porte ce
   qui distingue le profil. Chaque competence tient en deux temps — l'enonce,
   puis les faits qui l'etablissent — et jamais le raisonnement qui y a mene,
   qui est ce que la presentation complete a de plus. */
function renderCompetences() {
  const ordered = competences
    .filter((competence) => competence.a4Rank)
    .sort((first, second) => first.a4Rank - second.a4Rank);

  return ordered
    .map(
      (competence) => `<div class="cv1-comp ${natureClass(competence.nature)}">
        <p class="cv1-comp-line">
          <span class="cv1-comp-title">${competence.title}</span>
          <span class="cv1-comp-statement">${competence.a4Statement}</span>
        </p>
        <p class="cv1-comp-proofs">${competence.a4Proofs
          .map((proof) => `<span class="cv1-comp-proof">${proof}</span>`)
          .join("")}</p>
      </div>`,
    )
    .join("");
}

/* Impact economique, adoption terrain, transferabilite — dans cet ordre, et
   trois seulement. Seule la premiere porte un chiffre, donc seule la premiere
   prend la flamme : c'est la regle de rarete, et c'est aussi ce qui fait de
   ce bloc l'element le plus voyant de la page. */
function renderEvidence() {
  return `<div class="cv1-evidence">${a4Content.proofs
    .map(
      (proof) => `<div class="cv1-cell ${natureClass(proof.nature)}">
        <div class="cv1-cell-value">${proof.value}</div>
        <div class="cv1-cell-text">${proof.text}</div>
        ${proof.note ? `<div class="cv1-cell-note">${proof.note}</div>` : ""}
      </div>`,
    )
    .join("")}</div>`;
}

function renderCareer() {
  return experiences
    .filter((experience) => experience.a4Summary)
    .map(
      (experience) => `<div class="cv1-job">
        <p class="cv1-job-head">
          <span class="cv1-job-date">${experience.date}</span>
          <span class="cv1-job-role">${experience.role}</span>
          <span class="cv1-job-company">${experience.company}</span>
        </p>
        <p class="cv1-job-summary">${experience.a4Summary}</p>
      </div>`,
    )
    .join("");
}

function renderProjects() {
  return a4Content.projects
    .map(
      (project) => `<p class="cv1-project">
        <span class="cv1-project-title">${project.title}</span>
        <span class="cv1-project-text">${project.text}</span>
      </p>`,
    )
    .join("");
}

function renderPart(title, body) {
  return `<section class="cv1-part">
    <h2 class="cv1-part-title">${title}</h2>
    ${body}
  </section>`;
}

export function renderCvDocument() {
  return `<div class="cv-a4">
    ${renderHead()}

    <div class="cv1-pitch">${a4Content.pitch.map((line) => `<p>${line}</p>`).join("")}</div>

    ${renderPart("Compétences", renderCompetences())}
    ${renderPart("Résultats & adoption", renderEvidence())}
    ${renderPart("Parcours", renderCareer())}

    ${renderRow("Projets transverses", renderProjects())}
    ${renderRow(
      "Méthodes & outils",
      a4Content.methods
        .map((method) => `<span class="cv1-method">${method}</span>`)
        .join(""),
    )}
    ${renderRow(
      "Formation",
      `<span class="cv1-formation-title">${formationContent.title}</span>
       <span class="cv1-formation-year">${formationContent.year}</span>
       <span class="cv1-formation-note">${formationContent.a4Note}</span>`,
    )}

  </div>`;
}
