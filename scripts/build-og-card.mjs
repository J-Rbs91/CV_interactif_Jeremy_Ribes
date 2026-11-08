/* Génère `assets/img/og-cv.png`, la carte que LinkedIn, WhatsApp ou une messagerie
   affichent avant que le destinataire n'ouvre le lien.

   Elle était le favicon : un rond de 256 px, photo en couleur, sans nom ni titre —
   la première image du CV contredisait la page noire qu'elle annonçait. La carte
   reprend l'affiche : fond #0a0a0a, nom en Archivo fluo, portrait en bichromie,
   fonction visée. 1200×630 : le format que les réseaux affichent en pleine
   largeur (en deçà, une vignette carrée).

   Les textes viennent de `js/data/contact.js`. Le fichier est un RENDU, figé :
   il ne change que si le nom, la fonction ou le portrait changent, et se
   régénère alors avec `npm run build:og`. Comme `check:cv`, il demande le réseau
   (polices) et un Chromium local. */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { contact } from "../js/data/contact.js";

const racine = new URL("..", import.meta.url).pathname;
const candidats = [
  "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome",
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
];
const chromium = process.env.CHROMIUM_PATH ?? candidats.find((chemin) => existsSync(chemin));

if (!chromium) {
  console.error("Chromium introuvable. Renseigner CHROMIUM_PATH.");
  process.exit(1);
}

const polices = readFileSync(join(racine, "index.html"), "utf8")
  .match(/href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"/)[1]
  .replace(/&amp;/g, "&");
const [prenom, ...reste] = contact.name.split(" ");
const portrait = pathToFileURL(join(racine, contact.portrait.src)).href;

const html = `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="${polices}">
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; background: #0a0a0a; overflow: hidden; }
  body { position: relative; color: #f2f2ee; font-family: "JetBrains Mono", monospace; }
  .nom { position: absolute; left: 64px; top: 120px; font: 800 150px/0.82 "Archivo", sans-serif; font-stretch: 125%;
         letter-spacing: -0.035em; text-transform: uppercase; color: #c9ff2f; }
  .photo { position: absolute; right: 70px; bottom: 70px; width: 230px; height: 230px; border-radius: 50%; overflow: hidden;
           box-shadow: 0 0 0 6px #0a0a0a; }
  .photo img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15) brightness(1.3); }
  .photo::after { content: ""; position: absolute; inset: 0; mix-blend-mode: multiply;
                  background: color-mix(in srgb, #c9ff2f 25%, #e8e8e4); }
  .role { position: absolute; left: 64px; bottom: 64px; max-width: 760px; font: 500 28px/1.35 "Manrope", sans-serif; color: #f2f2ee; }
  .role small { display: block; margin-top: 14px; font: 500 15px/1.5 "JetBrains Mono", monospace; letter-spacing: 0.14em;
                text-transform: uppercase; color: #9a9da1; }
</style>
<div class="nom">${prenom}<br>${reste.join(" ")}</div>
<div class="photo"><img src="${portrait}" alt=""></div>
<p class="role">${contact.hero.target}<small>${contact.hero.background}</small></p>`;

const dossier = mkdtempSync(join(tmpdir(), "og-"));
const page = join(dossier, "og.html");
const sortie = join(racine, "assets/img/og-cv.png");

writeFileSync(page, html);
execFileSync(
  chromium,
  [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--allow-file-access-from-files", "--force-device-scale-factor=1",
    "--window-size=1200,630", "--virtual-time-budget=10000",
    `--screenshot=${sortie}`, pathToFileURL(page).href,
  ],
  { stdio: "inherit" },
);
console.log(`Carte écrite : ${sortie}`);
