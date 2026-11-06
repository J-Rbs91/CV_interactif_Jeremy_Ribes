/* Assemble les pages d'exploration : explorations/src/*.html → explorations/*.html.

   Chaque page source contient le marqueur MARQUEUR_CV (un commentaire de
   script, voir le code plus bas), remplacé ici par les
   vraies données du CV (js/data/*.js) et la photo en base64. Le résultat est
   un fichier autonome, qui s'ouvre sans serveur ni dépendance autre que les
   polices : on compare des directions de design sur le contenu réel, pas sur
   du texte de remplissage.

   Les explorations ne sont pas publiées : le déploiement ne copie que
   index.html, css/, js/ et assets/ (voir .github/workflows/deploy-pages.yml). */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { contact } from "../js/data/contact.js";
import { competences } from "../js/data/competences.js";
import { experiences } from "../js/data/experiences.js";
import { outils } from "../js/data/outils.js";
import { projetsTransverses } from "../js/data/projets.js";
import { formationContent, profileContent } from "../js/data/profile.js";

const MARK = "/*__CV__*" + "/";
const photo = readFileSync("assets/img/portrait/me.jpg").toString("base64");
const cv = {
  contact,
  profile: profileContent,
  formation: formationContent,
  experiences,
  outils,
  projets: projetsTransverses,
  competences,
};
const payload = `window.CV = ${JSON.stringify(cv).replace(/</g, "\\u003c")};
window.PHOTO = "data:image/jpeg;base64,${photo}";`;

for (const file of readdirSync("explorations/src").filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(`explorations/src/${file}`, "utf8");
  if (!html.includes(MARK)) {
    throw new Error(`${file} : marqueur absent`);
  }
  writeFileSync(`explorations/${file}`, html.replace(MARK, payload));
  console.log(`explorations/${file}`);
}
