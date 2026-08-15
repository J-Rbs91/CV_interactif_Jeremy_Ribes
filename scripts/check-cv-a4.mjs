/* Contrôle du recto A4 : il tient en une page, ou il n'est pas un CV.
   -------------------------------------------------------------------------
   C'est le seul contrôle que ce document demande, et il ne se fait pas à
   l'œil : `#print-view` est masqué hors impression, et un débordement de
   trois millimètres sort une seconde page presque vide sans rien changer à
   ce qu'on voit dans le navigateur.

   Le script compose une page d'essai à partir de `renderCvDocument()` et des
   feuilles réelles, la fait imprimer par le Chromium présent sur la machine,
   puis compte les pages du PDF. Il ne rend rien de plus que ce que produit le
   bouton : même document, même CSS, même format de page.

   `npm run check:cv`. Sans Chromium disponible, il le dit et sort en échec —
   un contrôle qui se passe de vérifier est pire que pas de contrôle. */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { renderCvDocument } from "../js/render/renderCv.js";

const root = new URL("..", import.meta.url).pathname;

const chromiumCandidates = [
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
];

const chromium =
  process.env.CHROMIUM_PATH ?? chromiumCandidates.find((path) => existsSync(path));

if (!chromium || !existsSync(chromium)) {
  console.error(
    "Chromium introuvable. Renseigner CHROMIUM_PATH pour lancer le controle.",
  );
  process.exit(1);
}

/* Les polices ne sont pas un detail de rendu, ce sont les metriques de la
   mesure. Manrope, Archivo et JetBrains Mono viennent de Google Fonts : sans
   elles, Chromium substitue sa police par defaut, les lignes se replient
   ailleurs et le controle certifie une page qui n'est pas celle qui sortira.

   Elles sont donc rapatriees a chaque passage — la feuille, puis les fichiers
   qu'elle designe — et servies en local. `curl` plutot que `fetch` : il suit
   HTTPS_PROXY et le magasin de certificats du systeme, ce que le client de
   Node ne fait pas ici. L'entete de navigateur n'est pas cosmetique, Google
   servant du woff2 ou du ttf selon ce qu'il croit avoir en face.

   Sans reseau, le controle s'arrete : mesurer avec des polices de
   substitution reviendrait a valider un autre document. */
const fontQuery =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,700;125,800&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;500;600;700;800&display=swap";

const browserAgent =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

function curl(url, destination) {
  /* `--retry` : le service de polices renvoie par intermittence un 404 sur un
     fichier qu'il sert correctement au coup suivant. Sans reprise, le
     controle echoue sur un incident reseau et se fait lire comme un
     debordement de page. */
  execFileSync(
    "curl",
    ["-sSf", "--retry", "3", "--retry-all-errors", "-A", browserAgent, url, "-o", destination],
    { stdio: "pipe" },
  );
}

function fetchFonts(directory) {
  const cssPath = join(directory, "fonts.css");

  curl(fontQuery, cssPath);

  let css = readFileSync(cssPath, "utf8");
  const remote = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g) ?? [])];

  remote.forEach((url, index) => {
    const name = `font-${index}.woff2`;

    curl(url, join(directory, name));
    css = css.split(url).join(name);
  });

  writeFileSync(cssPath, css, "utf8");

  return pathToFileURL(cssPath).href;
}

const styles = [
  "css/base.css",
  "css/layout.css",
  "css/components.css",
  "css/sections.css",
  "css/print.css",
]
  .map((href) => `<link rel="stylesheet" href="${pathToFileURL(join(root, href)).href}" />`)
  .join("\n");

const workDir = mkdtempSync(join(tmpdir(), "cv-a4-"));
const htmlPath = join(workDir, "recto.html");
const pdfPath = join(workDir, "recto.pdf");

let fontsHref;

try {
  fontsHref = fetchFonts(workDir);
} catch (error) {
  console.error(
    "Polices injoignables : le controle ne peut pas mesurer le document reel.",
  );
  console.error(error.message);
  process.exit(1);
}

/* La page d'essai se compose a la demande : le controle en imprime plusieurs,
   identiques au contenu pres de la taille de page injectee (voir la mesure de
   reserve plus bas). `pageHeight` a `null` laisse `@page` de `print.css`
   decider, soit une A4. */
function buildPage(pageHeight) {
  const override = pageHeight
    ? `<style>@media print { @page { size: 210mm ${pageHeight}mm; } }</style>`
    : "";

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <base href="${pathToFileURL(root).href}" />
    <link rel="stylesheet" href="${fontsHref}" />
    ${styles}
    ${override}
  </head>
  <body>
    <!-- Le document d'essai n'a pas d'\`#app\` a masquer, mais il garde l'\`id\`
         que \`css/print.css\` vise : c'est lui qui porte \`display: block\` sous
         \`@media print\`, et sans lui la page sortirait vide. -->
    <div id="print-view">${renderCvDocument()}</div>
  </body>
</html>`;
}

/* Le nombre de pages se lit sur l'arbre du PDF : `/Type /Pages` porte un
   `/Count`. On prend le plus grand, la racine etant le noeud qui totalise. */
function countPages(pageHeight) {
  writeFileSync(htmlPath, buildPage(pageHeight), "utf8");

  execFileSync(
    chromium,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ],
    { stdio: "pipe" },
  );

  const pdf = readFileSync(pdfPath, "latin1");
  const counts = [...pdf.matchAll(/\/Count\s+(\d+)/g)].map((match) =>
    Number(match[1]),
  );

  return counts.length ? Math.max(...counts) : 0;
}

const pages = countPages(null);

if (pages !== 1) {
  console.error(
    `Le recto A4 sort en ${pages} page(s). Un CV tient sur un recto : retirer de la matiere, pas reduire le corps.`,
  );
  console.error(`PDF conserve pour inspection : ${pdfPath}`);
  process.exit(1);
}

/* --- La reserve de pied -----------------------------------------------------
   Tenir en une page ne dit pas de combien. Le recto a tenu pendant des mois
   avec 0,7 mm de blanc sous la derniere ligne : la mesure passait, et le
   fichier sortait quand meme en deux pages sur un telephone, la seconde vide.
   Un controle binaire — ça tient / ça ne tient pas — ne pouvait pas le voir.

   La reserve se mesure sans rien mesurer dans le document : on reimprime le
   meme contenu sur des pages de plus en plus courtes et on cherche la
   derniere qui tient encore en un feuillet. La difference avec l'A4 est le
   blanc disponible, et elle est prise par le moteur d'impression reel, avec
   les vraies polices — pas par un calcul sur des hauteurs de ligne.

   Recherche dichotomique : sept impressions pour un millimetre de precision,
   la ou un pas de un en aurait demande cinquante. */
const A4_HEIGHT = 297;
const MIN_RESERVE = 6;

let fits = A4_HEIGHT;
let overflows = 200;

while (fits - overflows > 1) {
  const middle = Math.round((fits + overflows) / 2);

  if (countPages(middle) === 1) {
    fits = middle;
  } else {
    overflows = middle;
  }
}

const reserve = A4_HEIGHT - fits;

if (reserve < MIN_RESERVE) {
  console.error(
    `Le recto tient en une page, mais il ne reste que ${reserve} mm de blanc en pied.`,
  );
  console.error(
    `En dessous de ${MIN_RESERVE} mm, la page sort juste ici et en deux pages ailleurs : le rendu d'un telephone ou d'un pilote d'imprimante ne tombe pas au meme millimetre.`,
  );
  process.exit(1);
}

console.log(`Le recto A4 tient en une page, ${reserve} mm de blanc en pied.`);
