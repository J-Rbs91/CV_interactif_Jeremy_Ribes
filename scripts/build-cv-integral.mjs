/* Génère le bloc de texte intégral inséré dans index.html.

   Pourquoi ce script existe. Le CV est une application monopage : le document
   livré ne contient qu'un `#app` vide, et le texte n'apparaît qu'une fois le
   JavaScript exécuté. Les lecteurs automatiques — moteurs, agrégateurs, et
   surtout les IA auxquelles un recruteur donne l'URL — n'exécutent pour la
   plupart aucun script. Ils lisaient donc une page sans CV.

   Le repli précédent était écrit à la main dans un `<noscript>`, avec pour
   consigne de le tenir aligné sur js/data/*.js. Il ne l'était plus : un tiers
   du contenu affiché à l'écran n'y figurait pas, et les deux versions
   divergeaient un peu plus à chaque modification. Une copie manuelle d'une
   source de vérité finit toujours par mentir ; celle-ci mentait déjà.

   D'où ce script. Il n'invente rien et ne duplique rien : il appelle
   `renderPrintDocument()`, c'est-à-dire exactement le document que produit
   déjà la commande d'impression — toutes sections, toutes fiches dépliées —
   et l'écrit dans index.html entre deux marqueurs. Les moteurs de rendu du
   projet ne touchent ni `document` ni `window` : ce sont des constructeurs de
   chaînes, exécutables tels quels sous Node.

   Conséquence à retenir : le bloc ne se modifie pas à la main. On modifie
   js/data/*.js, puis on relance `npm run build`. La CI le vérifie à chaque
   publication (`npm run verify`) et refuse un index.html désynchronisé. */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { renderPrintDocument } from "../js/render/renderPrint.js";

const racine = dirname(dirname(fileURLToPath(import.meta.url)));
const cible = join(racine, "index.html");

const DEBUT = "<!-- CV-INTEGRAL:DEBUT — bloc genere, ne pas editer a la main -->";
const FIN = "<!-- CV-INTEGRAL:FIN -->";

/* Le document imprimable et l'application vivante décrivent les mêmes fiches,
   donc portent les mêmes identifiants. Les deux coexistent ici dans un seul
   document : sans préfixe, `aria-controls` et `aria-labelledby` de
   l'application pourraient se résoudre sur la copie masquée, et
   `getElementById` renvoyer la mauvaise. On préfixe donc les identifiants du
   bloc généré et les attributs qui les visent. */
function prefixerIdentifiants(html) {
  return html.replace(
    /\b(id|aria-controls|aria-labelledby)="([^"]+)"/g,
    (_, attribut, valeur) =>
      `${attribut}="${valeur
        .split(/\s+/)
        .map((identifiant) => `cv-${identifiant}`)
        .join(" ")}"`,
  );
}

/* Le bloc est lu, pas parcouru : il double le contenu de l'application pour
   les lecteurs qui n'exécutent pas de script. Laisser dedans des boutons
   focalisables donnerait au clavier un second CV fantôme à traverser — sans
   JavaScript ils ne commandent rien de toute façon, toutes les fiches étant
   déjà dépliées. On les ramène donc à des conteneurs neutres. */
function neutraliserCommandes(html) {
  return html
    .replace(/<button\b[^>]*>/g, "<div>")
    .replace(/<\/button>/g, "</div>");
}

function construireBloc() {
  const document = neutraliserCommandes(
    prefixerIdentifiants(renderPrintDocument()),
  );

  /* `lang` est répété ici : un extracteur qui ne retient que ce bloc perd
     l'attribut porté par <html>, et lit un texte français comme s'il était
     dans la langue par défaut de son analyseur. */
  return [
    DEBUT,
    '    <div id="cv-integral" lang="fr">',
    `      ${document}`,
    "    </div>",
    `    ${FIN}`,
  ].join("\n    ");
}

function remplacerBloc(source, bloc) {
  const debut = source.indexOf(DEBUT);
  const fin = source.indexOf(FIN);

  if (debut === -1 || fin === -1) {
    throw new Error(
      `Marqueurs introuvables dans index.html. Attendus :\n  ${DEBUT}\n  ${FIN}`,
    );
  }

  return source.slice(0, debut) + bloc.trimStart() + source.slice(fin + FIN.length);
}

const source = await readFile(cible, "utf8");
const attendu = remplacerBloc(source, construireBloc());

if (process.argv.includes("--verify")) {
  if (source !== attendu) {
    console.error(
      "index.html est desynchronise de js/data/*.js.\n" +
        "Lancer `npm run build` puis committer le resultat.",
    );
    process.exit(1);
  }

  console.log("index.html est a jour.");
} else {
  await writeFile(cible, attendu, "utf8");

  const texte = attendu
    .slice(attendu.indexOf(DEBUT), attendu.indexOf(FIN))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  console.log(`index.html mis a jour — ${texte.length} caracteres de texte lisible sans JavaScript.`);
}
