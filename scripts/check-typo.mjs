/* Contrôle de la typographie : trois familles, et rien d'autre.
   -------------------------------------------------------------------------
   Deux défauts typographiques ne se voient pas en relisant le CSS, et aucun
   des deux ne produit d'erreur.

   Le premier est la famille absente. Un `button` sans `font-family` n'hérite
   pas celle du document : il prend la police d'interface du système. Le
   panneau d'export a sorti pendant des mois le titre et le résumé de chaque
   document en Arial, à côté de titres Archivo, dans la même fenêtre — la
   règle qui manquait ne s'écrivait nulle part, donc rien à relire.

   Le second est la graisse absente. Demander un 600 à JetBrains Mono, qui
   n'est chargée qu'en 400, 500 et 700, ne rate pas : le navigateur prend la
   graisse au-dessus. Le libellé sort en 700, l'intention était plus légère
   que 700, et le CSS dit toujours 600.

   Le script rend les trois surfaces — le site, la présentation complète, le
   recto A4 — dans le Chromium présent sur la machine, avec les polices
   réelles servies en local, et relève pour chaque élément porteur de texte
   ce que le navigateur a vraiment utilisé. Il échoue sur ces deux défauts et
   imprime l'inventaire dans tous les cas : la liste des combinaisons
   famille / graisse / corps / interlettrage en usage est ce qui rend une
   dérive visible avant qu'elle ne devienne une règle.

   `npm run check:typo`. Il demande le réseau, comme `check-cv-a4.mjs`, et
   pour la même raison : mesurer avec les polices de substitution de Chromium
   reviendrait à contrôler un autre document. */
import { execFileSync, spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";

import { renderCvDocument } from "../js/render/renderCv.js";
import { renderPrintDocument } from "../js/render/renderPrint.js";

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

/* La même adresse que dans `index.html` et `scripts/check-cv-a4.mjs`. */
const fontQuery =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,700;125,800&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;500;600;700;800&display=swap";

const browserAgent =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

const workDir = mkdtempSync(join(tmpdir(), "cv-typo-"));

function curl(url, destination) {
  /* `--retry` : le service de polices renvoie par intermittence un 404 sur un
     fichier qu'il sert correctement au coup suivant. Sans reprise, le
     controle echoue sur un incident reseau et se fait lire comme un defaut
     de typographie. */
  execFileSync(
    "curl",
    ["-sSf", "--retry", "3", "--retry-all-errors", "-A", browserAgent, url, "-o", destination],
    { stdio: "pipe" },
  );
}

/* Les polices sont rapatriées puis servies depuis l'origine du serveur
   d'essai : la politique de sécurité de `index.html` n'autorise les feuilles
   que depuis `self` et googleapis, et une feuille locale servie autrement
   serait bloquée sans le dire. */
function fetchFonts() {
  const cssPath = join(workDir, "fonts.css");

  curl(fontQuery, cssPath);

  let css = readFileSync(cssPath, "utf8");
  const remote = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g) ?? [])];

  remote.forEach((url, index) => {
    const name = `font-${index}.woff2`;

    curl(url, join(workDir, name));
    css = css.split(url).join(name);
  });

  writeFileSync(cssPath, css, "utf8");
}

try {
  fetchFonts();
} catch (error) {
  console.error(
    "Polices injoignables : le controle ne peut pas mesurer les vraies metriques.",
  );
  console.error(error.message);
  process.exit(1);
}

/* --- Les trois surfaces ---------------------------------------------------
   Le site est servi tel quel, moins sa politique de sécurité : elle interdit
   la feuille de polices locale, qui est ce qui rend la mesure fidèle. Les
   deux documents sont composés comme le fait `js/ui/print.js`, dans une page
   d'essai qui charge les mêmes feuilles.

   `#print-view` porte l'identifiant que `css/print.css` vise : c'est lui qui
   reçoit `display: block` sous `@media print`. */
const sheets = [
  "css/base.css",
  "css/layout.css",
  "css/components.css",
  "css/sections.css",
  "css/export.css",
  "css/print.css",
  "css/intro.css",
]
  .map((href) => `<link rel="stylesheet" href="/${href}" />`)
  .join("\n    ");

function documentPage(body) {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <base href="/" />
    <link rel="stylesheet" href="/__fonts/fonts.css" />
    ${sheets}
  </head>
  <body><div id="print-view">${body}</div></body>
</html>`;
}

const sitePage = readFileSync(join(root, "index.html"), "utf8")
  .replace(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>/s, "")
  .replace(
    /<link\s+href="https:\/\/fonts\.googleapis\.com[^>]*>/s,
    `<link rel="stylesheet" href="/__fonts/fonts.css" />`,
  );

const pages = {
  "/__site.html": sitePage,
  "/__presentation.html": documentPage(renderPrintDocument()),
  "/__cv.html": documentPage(renderCvDocument()),
};

/* Un serveur plutôt que `file://` : les modules ES d'une origine `file` sont
   refusés par le navigateur, et sans eux le site ne monte aucune section. */
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".json": "application/json",
};

const port = 8787;
const server = createServer((request, response) => {
  const path = decodeURIComponent(request.url.split("?")[0]);

  if (pages[path]) {
    response.writeHead(200, { "content-type": types[".html"] });
    response.end(pages[path]);
    return;
  }

  const file = path.startsWith("/__fonts/")
    ? join(workDir, path.slice("/__fonts/".length))
    : join(root, path === "/" ? "index.html" : path.slice(1));

  if (!existsSync(file)) {
    response.writeHead(404).end("");
    return;
  }

  response.writeHead(200, {
    "content-type": types[extname(file)] ?? "application/octet-stream",
  });
  response.end(readFileSync(file));
});

await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

/* --- Pilotage du navigateur, sans dépendance ------------------------------
   Node 22 fournit `WebSocket` : le protocole de débogage de Chromium suffit,
   là où lire des styles calculés demanderait sinon d'installer un pilote.

   `--no-proxy-server` n'est pas un détail de confort : dans un environnement
   qui déclare un proxy sortant, Chromium y envoie aussi `127.0.0.1`, la page
   d'essai ne se charge pas du tout, et le contrôle mesure une page vide sans
   rien signaler. Rien ne sort d'ici — les polices sont déjà sur le disque. */
const browser = spawn(chromium, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--no-proxy-server",
  `--remote-debugging-port=${port + 1}`,
  "--window-size=1440,900",
  "about:blank",
]);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function debuggerUrl() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port + 1}/json/version`);

      return (await response.json()).webSocketDebuggerUrl;
    } catch {
      await wait(250);
    }
  }

  throw new Error("Chromium ne repond pas sur son port de debogage.");
}

const socket = new WebSocket(await debuggerUrl());
await new Promise((resolve) => {
  socket.onopen = resolve;
});

let nextId = 0;
const pending = new Map();

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (!message.id || !pending.has(message.id)) {
    return;
  }

  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);

  if (message.error) {
    reject(new Error(JSON.stringify(message.error)));
  } else {
    resolve(message.result);
  }
};

function send(method, params = {}, sessionId) {
  nextId += 1;
  const id = nextId;

  socket.send(JSON.stringify({ id, method, params, sessionId }));

  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

/* Relevé fait dans la page : pour chaque élément qui porte lui-même du texte,
   ce que le navigateur a résolu. Les éléments sans boîte sont écartés — un
   ancêtre en `display: none` laisse à ses descendants un style calculé
   normal, et seul le fait qu'ils n'occupent aucun rectangle dit qu'ils ne
   sont pas là. Le bloc `#cv-integral` l'est aussi : il ne s'affiche que sans
   JavaScript, où il a sa propre mise en forme, minimale et voulue. */
const survey = `(() => {
  const faces = [...document.fonts].map((face) => ({
    family: face.family.replace(/^['"]|['"]$/g, ""),
    weight: face.weight,
  }));
  const rows = new Map();
  const ignore = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);

  for (const element of document.body.querySelectorAll("*")) {
    if (ignore.has(element.tagName.toUpperCase())) continue;
    if (element.closest("#cv-integral")) continue;
    if (![...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())) continue;

    const style = getComputedStyle(element);

    if (style.display === "none" || style.visibility === "hidden") continue;
    if (!element.getClientRects().length) continue;

    const family = style.fontFamily.split(",")[0].replace(/^['"]|['"]$/g, "").trim();
    const key = [family, style.fontWeight, style.fontSize, style.fontStretch, style.letterSpacing, style.textTransform].join("|");
    const name = typeof element.className === "string" && element.className.trim()
      ? "." + element.className.trim().split(/\\s+/).join(".")
      : element.tagName.toLowerCase();

    if (!rows.has(key)) {
      rows.set(key, {
        family,
        weight: style.fontWeight,
        size: style.fontSize,
        stretch: style.fontStretch,
        tracking: style.letterSpacing,
        transform: style.textTransform,
        count: 0,
        samples: [],
      });
    }

    const row = rows.get(key);
    row.count += 1;
    if (row.samples.length < 3 && !row.samples.includes(name)) row.samples.push(name);
  }

  return JSON.stringify({ faces, rows: [...rows.values()] });
})()`;

/* La séquence d'ouverture tient l'écran huit secondes et masque le CV
   derrière elle : on la retire avant de mesurer le document. Le SPA ne monte
   qu'une section à la fois — les sept sont parcourues, puis la porte des
   exports est ouverte, sinon la moitié des styles d'écran n'est jamais vue. */
const sections = [
  "profil",
  "competences",
  "outils",
  "experience",
  "projet",
  "formation",
  "contact",
];

async function inspect(path, media) {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);

  await call("Page.enable");
  await call("Runtime.enable");
  await call("Emulation.setEmulatedMedia", { media });
  await call("Page.navigate", { url: `http://127.0.0.1:${port}${path}` });
  await wait(3000);
  await call("Runtime.evaluate", {
    expression: "document.fonts.ready",
    awaitPromise: true,
  });

  const passes = [];

  if (media === "screen") {
    await call("Runtime.evaluate", {
      expression: `document.documentElement.classList.remove("intro-armed", "intro-lock", "intro-handoff");
        document.querySelectorAll(".intro-overlay, .intro-ghost").forEach((node) => node.remove());`,
    });
    await wait(400);

    for (const section of sections) {
      await call("Runtime.evaluate", {
        expression: `document.querySelector('[data-section="${section}"]')?.click()`,
      });
      await wait(300);
      passes.push(await collect(call));
    }

    await call("Runtime.evaluate", {
      expression: `document.querySelector("[data-open-export]")?.click()`,
    });
    await wait(400);
  }

  passes.push(await collect(call));
  await send("Target.closeTarget", { targetId });

  return merge(passes);
}

async function collect(call) {
  const { result, exceptionDetails } = await call("Runtime.evaluate", {
    expression: survey,
    returnByValue: true,
  });

  if (exceptionDetails) {
    throw new Error(JSON.stringify(exceptionDetails).slice(0, 400));
  }

  return JSON.parse(result.value);
}

function merge(passes) {
  const rows = new Map();

  passes.forEach((pass) =>
    pass.rows.forEach((row) => {
      const key = [row.family, row.weight, row.size, row.stretch, row.tracking, row.transform].join("|");

      if (!rows.has(key)) {
        rows.set(key, { ...row, samples: [...row.samples] });
        return;
      }

      const kept = rows.get(key);
      kept.count += row.count;
      row.samples.forEach((sample) => {
        if (kept.samples.length < 3 && !kept.samples.includes(sample)) kept.samples.push(sample);
      });
    }),
  );

  return { faces: passes[passes.length - 1].faces, rows: [...rows.values()] };
}

/* Les familles génériques ne sont jamais un défaut : c'est ce que le CSS
   demande quand il ne demande rien de particulier. Une police nommée qui
   n'est déclarée nulle part, elle, vient du système. */
const generic = /^(ui-|system-ui|monospace|sans-serif|serif|cursive|fantasy|-apple)/;

const surfaces = [
  ["Site", "/__site.html", "screen"],
  ["Présentation complète", "/__presentation.html", "print"],
  ["Recto A4", "/__cv.html", "print"],
];

const failures = [];

for (const [label, path, media] of surfaces) {
  const { faces, rows } = await inspect(path, media);
  const served = new Map();

  faces.forEach((face) => {
    if (!served.has(face.family)) served.set(face.family, new Set());
    served.get(face.family).add(face.weight);
  });

  console.log(`\n=== ${label} ===`);
  console.log(
    [...served]
      .map(([family, weights]) => `${family} ${[...weights].sort().join("/")}`)
      .join("  ·  "),
  );
  console.log("");

  rows
    .sort(
      (a, b) =>
        a.family.localeCompare(b.family) || parseFloat(b.size) - parseFloat(a.size),
    )
    .forEach((row) => {
      const weights = served.get(row.family);
      let flag = "";

      if (!weights && !generic.test(row.family)) {
        flag = "  ← famille non chargée";
        failures.push(
          `${label} : ${row.samples.join(" ")} composé en ${row.family}, qui n'est pas une des trois familles du projet.`,
        );
      } else if (weights && !weights.has(row.weight)) {
        flag = "  ← graisse non chargée";
        failures.push(
          `${label} : ${row.samples.join(" ")} demande ${row.family} ${row.weight}, qui n'est pas servie — le navigateur en prend une autre.`,
        );
      }

      console.log(
        `  ${row.family} ${row.weight} · ${row.size} · chasse ${row.stretch} · ` +
          `${row.tracking === "normal" ? "sans interlettrage" : row.tracking} · ` +
          `${row.transform === "none" ? "bas de casse" : row.transform} · ` +
          `${row.count}× ${row.samples.join(" ")}${flag}`,
      );
    });
}

socket.close();
browser.kill();
server.close();

if (failures.length) {
  console.error("\nLa typographie n'est pas celle qui est écrite :\n");
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log("\nTrois familles, et rien d'autre : aucune substitution silencieuse.");
process.exit(0);
