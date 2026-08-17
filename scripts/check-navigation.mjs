/* Contrôle du contrat de navigation arrière.
   -------------------------------------------------------------------------
   Le geste retour — bouton d'Android, bouton du navigateur, glissement
   latéral d'iOS — rejoue la pile d'historique. Le défaut qu'on cherche ici ne
   se voit pas en relisant le code, ne casse aucun test fonctionnel, et ne se
   constate pas sur un ordinateur où personne n'appuie sur retour. Il se
   mesure : le nombre d'appuis pour sortir doit égaler la profondeur atteinte,
   pas le nombre d'écrans visités.

   Deux choses sont vérifiées, et ce sont les deux seules natures de nœuds du
   CV (voir js/ui/backNavigation.js) :

   - Les six sections sont des frères. Six pas de côté ne doivent ajouter
     aucune entrée d'historique — sinon quitter le CV coûte six appuis.
   - Le panneau d'export et la modale de contact sont des couches. Elles
     doivent s'ouvrir en empilant une entrée, se fermer sur le geste retour,
     et ne pas ressusciter une fois fermées par l'interface.

   S'y ajoutent l'arrivée directe par un lien profond et le repli sur un
   fragment inconnu, parce qu'un lien de CV se partage plus souvent qu'il ne
   se parcourt.

   `history.back()` déclenché dans la page est la même primitive que celle
   qu'actionne le bouton du téléphone : le contrôle atteste donc le
   comportement, pas l'intention. Ce qu'il ne peut pas attester, c'est le
   ressenti du glissement latéral d'iOS, qui reste à voir sur un appareil.

   `npm run check:nav`. Aucun réseau, aucune dépendance : Node 22 fournit
   `WebSocket`, et le protocole de débogage de Chromium suffit. */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";

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

const port = 8781;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
};

/* Le site servi tel quel. Les polices distantes ne sont pas rapatriées : la
   navigation ne dépend pas des métriques, et une requête qui pend allongerait
   le contrôle sans rien prouver. */
const server = createServer((request, response) => {
  const path = normalize(decodeURIComponent(request.url.split("?")[0])).replace(
    /^(\.\.[/\\])+/,
    "",
  );
  const file = join(root, path === "/" ? "index.html" : path);

  if (!file.startsWith(root) || !existsSync(file)) {
    response.writeHead(404).end();
    return;
  }

  response.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
  response.end(readFileSync(file));
});

await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

/* `--no-proxy-server` : dans un environnement qui déclare un proxy sortant,
   Chromium y enverrait aussi 127.0.0.1 et la page ne se chargerait pas, sans
   que rien ne le signale. Même raison que dans check-typo.mjs. */
const browser = spawn(chromium, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--no-proxy-server",
  `--remote-debugging-port=${port + 1}`,
  "--window-size=390,844",
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

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);

/* Mouvement réduit : la séquence d'ouverture ne s'arme pas et les transitions
   de section sont immédiates. On contrôle la navigation, pas l'animation —
   dont la politique se juge ailleurs. */
await send(
  "Emulation.setEmulatedMedia",
  { features: [{ name: "prefers-reduced-motion", value: "reduce" }] },
  sessionId,
);

async function evaluate(expression) {
  const result = await send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? "evaluation impossible");
  }

  return result.result.value;
}

async function ouvrir(adresse) {
  await send("Page.navigate", { url: `http://127.0.0.1:${port}${adresse}` }, sessionId);
  await wait(700);
}

/* Un vrai parcours d'historique, celui que déclenche le bouton du téléphone.
   La page ne le voit pas venir : c'est exactement ce qui rend ce contrôle
   différent d'un test qui appellerait la fonction de fermeture. */
async function retour() {
  await evaluate("window.history.back()");
  await wait(350);
}

async function cliquer(selecteur) {
  await evaluate(`document.querySelector(${JSON.stringify(selecteur)}).click()`);
  await wait(350);
}

const echecs = [];
let passes = 0;

function verifier(nom, condition, detail) {
  if (condition) {
    passes += 1;
    console.log("  OK   " + nom);
    return;
  }

  echecs.push(nom + (detail ? " → " + detail : ""));
  console.log("  ECHEC " + nom + (detail ? " → " + detail : ""));
}

const sectionAffichee = () =>
  evaluate("document.querySelector('.nav-item.active')?.dataset.section ?? null");
const longueurHistorique = () => evaluate("window.history.length");
const coucheOuverte = (selecteur) =>
  evaluate(`Boolean(document.querySelector(${JSON.stringify(selecteur)}))`);

try {
  /* 1. Les pas de côté ne consomment pas de profondeur ---------------------
     C'est le contrôle qui compte le plus : c'est celui qui échoue dans la
     quasi-totalité des applications web installables. */
  await ouvrir("/index.html");
  const depart = await longueurHistorique();

  for (const section of ["experience", "outils", "projet", "competences", "formation", "profil"]) {
    await cliquer(`[data-section="${section}"]`);
  }

  verifier(
    "six pas de cote n'ajoutent aucune entree d'historique",
    (await longueurHistorique()) === depart,
    `${depart} → ${await longueurHistorique()}`,
  );
  verifier(
    "l'adresse suit la section affichee",
    (await evaluate("window.location.hash")) === "#profil",
    await evaluate("window.location.hash"),
  );

  /* 2. Arrivée directe en profondeur --------------------------------------- */
  await ouvrir("/index.html#competences");
  verifier(
    "un lien profond ouvre la section demandee",
    (await sectionAffichee()) === "competences",
    String(await sectionAffichee()),
  );

  await ouvrir("/index.html#section-inconnue");
  verifier(
    "un fragment inconnu retombe sur Profil",
    (await sectionAffichee()) === "profil",
    String(await sectionAffichee()),
  );

  /* 3. Les couches ---------------------------------------------------------
     Ouverte, une couche doit partir au geste retour. Fermée par l'interface,
     elle ne doit pas revenir : une couche qui ressuscite fait douter de ce
     qu'on vient de faire. */
  for (const couche of [
    { nom: "panneau d'export", ouvre: "[data-open-export]", ferme: "[data-close-export]", visible: "#export-panel.is-open" },
    { nom: "modale de contact", ouvre: "[data-open-contact]", ferme: "[data-close-contact]", visible: "#contact-modal.is-open" },
  ]) {
    await ouvrir("/index.html");

    await cliquer(couche.ouvre);
    verifier(`${couche.nom} — ouverture`, await coucheOuverte(couche.visible), "ne s'ouvre pas");

    const avecCouche = await longueurHistorique();
    verifier(
      `${couche.nom} — l'ouverture empile une entree`,
      avecCouche > depart,
      `${depart} → ${avecCouche}`,
    );

    await retour();
    verifier(
      `${couche.nom} — le geste retour la referme`,
      !(await coucheOuverte(couche.visible)),
      "restee ouverte : le retour quitterait la page",
    );
    verifier(
      `${couche.nom} — on est toujours sur le CV`,
      (await evaluate("document.querySelectorAll('.nav-item').length")) > 0,
      "page quittee",
    );

    await cliquer(couche.ouvre);
    await cliquer(couche.ferme);
    verifier(
      `${couche.nom} — fermeture par l'interface`,
      !(await coucheOuverte(couche.visible)),
      "restee ouverte",
    );

    const adresseAvant = await evaluate("window.location.href");
    await retour();
    verifier(
      `${couche.nom} — l'entree empilee a bien ete consommee`,
      (await evaluate("window.location.href")) !== adresseAvant,
      "le retour n'a rien depile : une entree fantome reste a payer",
    );
    verifier(
      `${couche.nom} — une couche fermee ne ressuscite pas`,
      !(await coucheOuverte(couche.visible)),
      "revenue au geste retour",
    );
  }
} finally {
  socket.close();
  browser.kill();
  server.close();
}

console.log(`\n${passes} controle(s) passe(s).`);

if (echecs.length) {
  console.error(`\n${echecs.length} echec(s) :`);
  for (const echec of echecs) {
    console.error("  · " + echec);
  }
  process.exit(1);
}
