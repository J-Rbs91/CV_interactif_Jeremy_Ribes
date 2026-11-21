import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");
const site = read("index.html");
const a4 = read("cv-a4.html");
const workflow = read(".github/workflows/deploy-pages.yml");

const count = (text, regex) => [...text.matchAll(regex)].length;
const urls = [...site.matchAll(/(?:src|href)="(\.\/[A-Za-z0-9._/-]+)"/g), ...a4.matchAll(/(?:src|href)="(\.\/[A-Za-z0-9._/-]+)"/g)];
for (const [, url] of urls) {
  if (url === "./") continue;
  assert(existsSync(resolve(root, url)), "Ressource manquante: " + url);
}

assert(site.includes('id="contact-modal"') && count(site, /data-open-contact/g) === 2, "Formulaire de contact inaccessible");
assert(site.includes('src="./js/cv-root.js"'), "Module de contact manquant");
assert(site.includes('src="./maquette-positionnement/maquette.js"'), "Module d'interactions manquant");
assert(site.includes('href="./css/site.css"'), "Direction artistique d'origine absente");
assert(site.includes('href="./cv-a4.html"'), "Lien vers le CV A4 absent");
assert(count(site, /<details class="s-row"/g) === 18, "Fiches de la maquette manquantes");
assert(count(site, /class="s-sec"/g) === 5, "Sections de la maquette manquantes");
assert(!/noindex/i.test(site), "Le CV public est en noindex");
assert(site.includes("Content-Security-Policy"), "CSP absente");
assert(!/ style="--i:\d+"/g.test(site), "Style inline CSP-incompatible");
assert(a4.includes("BTS Opticien-Lunetier") && a4.includes("COORDINATION OPÉRATIONNELLE"), "CV A4 incomplet");

// Le portrait est présent dans les deux documents et demeure visible
// dans les règles d'impression, même si l'affiche interactive est masquée.
const portrait = "./assets/img/portrait/me.jpg";
const a4Css = read("css/cv-a4.css");
const printCss = read("css/cv-print.css");
assert(a4.includes('class="head-photo"') && a4.includes('src="' + portrait + '"'), "Portrait absent du CV A4");
assert(a4Css.includes(".head-photo img") && a4Css.includes("object-fit:cover"), "Portrait A4 non cadré");
assert(a4Css.includes(".head-photo,.head-photo img{display:block}"), "Portrait A4 non garanti à l'impression");
assert(/\.head-photo\{[^}]*border-radius:50%/.test(a4Css), "Portrait A4 non circulaire");
assert(/\.head-photo img\{[^}]*border-radius:50%/.test(a4Css), "Image A4 non découpée en cercle");
assert(site.includes('class="cv-print-head"') && site.includes('class="cv-print-photo"'), "En-tête du CV complet imprimable absent");
assert(site.includes('class="cv-print-photo" src="' + portrait + '"'), "Portrait absent de la présentation imprimable");
assert(printCss.includes(".cv-print-head") && printCss.includes("display: grid !important"), "En-tête d'impression masqué");
assert(printCss.includes(".cv-print-photo") && printCss.includes("display: block !important"), "Portrait masqué à l'impression");
assert(/\.cv-print-photo\s*\{[^}]*border-radius:\s*50%/.test(printCss), "Portrait de l'impression complète non circulaire");
assert(workflow.includes("css/cv-print.css css/cv-a4.css"), "Feuilles d'impression non déployées");

const commercialNumber = /\b30\s*800\s*€|\+\s*(?:83|82[.,]99|81[.,]39)\s*%|\+\s*5[.,](?:6|54)\s*(?:points?|pts)\b/i;
for (const [path, text] of [["index.html", site], ["cv-a4.html", a4], ["README.md", read("README.md")]]) {
  assert(!commercialNumber.test(text), "Chiffres commerciaux sensibles dans " + path);
}
assert(workflow.includes("npm run check:site"), "Workflow sans validation du nouveau site");
assert(workflow.includes("cp js/cv-root.js _site/js/"), "Script de contact non publié");
assert(workflow.includes("cp -r maquette-positionnement _site/"), "La maquette historique n'est plus accessible");

console.log("PASS: chemins, 18 fiches, 5 sections, contact, portraits A4/impression, CSS, CSP et confidentialité.");
