# SECURITY_AUDIT_REPORT.md

> Audit de sécurité — Dépôt **CV_interactif_Jeremy_Ribes**
> Date : 2026-06-20 · Référence : branche `main` · Auditeur : audit sécurité automatisé
> Branche de travail : `claude/security-audit-main-xs7day` (branche imposée par l'environnement ; voir §2)

---

## 1. Résumé exécutif

Le dépôt est un **CV interactif statique** (HTML/CSS/JavaScript vanilla, modules ES) destiné à
être publié sur **GitHub Pages**. Il n'y a **ni backend, ni base de données, ni build, ni gestionnaire
de paquets, ni CI/CD, ni Docker**. L'intégralité du contenu affiché provient de fichiers de données
statiques (`js/data/*.js`) contrôlés par l'auteur ; **aucune entrée utilisateur n'est injectée dans le DOM**.

La surface d'attaque est donc **faible** et se concentre sur :

1. la **chaîne d'approvisionnement front-end** (scripts tiers chargés depuis des CDN sans contrôle d'intégrité) ;
2. l'**absence de durcissement navigateur** (pas de Content-Security-Policy, pas de Referrer-Policy) ;
3. l'**abus possible du service d'envoi d'e-mails** EmailJS (spam / épuisement de quota) ;
4. quelques points de **bonne hygiène** (validation de formulaire, `.gitignore`, exposition de données personnelles).

**Aucun secret applicatif réel** n'a été détecté. Les identifiants EmailJS présents dans le code sont des
**clés publiables** prévues par EmailJS pour un usage côté client (ce n'est pas une fuite de secret).

**Aucune vulnérabilité critique** n'a été identifiée. Le risque le plus significatif est **VULN-001**
(scripts tiers sans Subresource Integrity), classé **Haute** car un CDN ou un paquet compromis exécuterait
du JavaScript arbitraire dans la page et pourrait **exfiltrer les données du formulaire de contact des visiteurs**.

| Criticité | Nombre |
|-----------|--------|
| Critique  | 0 |
| Haute     | 1 |
| Moyenne   | 2 |
| Basse     | 3 |
| Informationnelle | 4 |

---

## 2. Périmètre de l'audit

- **Dépôt** : `J-Rbs91/CV_interactif_Jeremy_Ribes`
- **Branche de référence** : `main`
- **État du dépôt au moment de l'audit** :
  - working tree propre ;
  - branche courante de travail : `claude/security-audit-main-xs7day` (imposée par l'environnement d'exécution) ;
  - derniers commits cohérents avec un contenu éditorial de CV (textes, partage, fallback ATS).
- **Note sur la branche de remédiation** : la procédure standard recommandait une branche
  `security/audit-remediation-main`. L'environnement impose toutefois de travailler et de pousser
  **exclusivement** sur `claude/security-audit-main-xs7day`. La remédiation est donc portée sur cette
  branche dédiée. **Aucun push direct sur `main` n'est effectué.**
- **Inclus** : code source HTML/CSS/JS, configuration de page, intégrations tierces, gestion du formulaire de contact, exposition de données.
- **Exclu** : configuration côté tableau de bord EmailJS et GoatCounter (hors dépôt), paramètres GitHub Pages côté hébergeur (en-têtes HTTP non configurables sur Pages).

---

## 3. Stack et architecture détectées

| Élément | Détail |
|--------|--------|
| Type | Application web **statique** mono-page, rendu côté client |
| Langages | HTML5, CSS3, JavaScript (ES modules, sans transpilation) |
| Build / bundler | **Aucun** |
| Gestionnaire de paquets | **Aucun** (`package.json` absent) |
| Hébergement | GitHub Pages (chemins relatifs, voir `AGENTS.md`) |
| Point d'entrée | `index.html` → `js/main.js` (module) |
| Rendu | Fonctions `js/render/*` produisant des chaînes HTML injectées via `innerHTML` |
| Données | `js/data/*.js` — contenu **statique** et **contrôlé par l'auteur** |
| Authentification / autorisation | **Aucune** (site public en lecture seule) |
| Stockage | **Aucun** (pas de `localStorage`, `sessionStorage`, cookies, ni base de données) |
| Intégrations externes | EmailJS (formulaire de contact), GoatCounter (analytics), jsDelivr (CDN), Google Fonts |

**Points d'entrée applicatifs** : un seul (`index.html`). **Surfaces d'attaque** : scripts tiers,
formulaire de contact (EmailJS), liens/URL de partage. **Zones sensibles** : `js/ui/contactForm.js`
(seul flux sortant de données saisies par un visiteur), `index.html` (chargement des scripts tiers).
**Dépendances critiques** : `@emailjs/browser` (CDN), `count.js` GoatCounter (CDN). **Modes de déploiement** :
publication statique GitHub Pages. **Stockage de données** : néant côté client.

---

## 4. Outils utilisés et commandes principales

L'audit est **manuel et assisté** : sur une base de code aussi réduite et sans gestionnaire de paquets,
les scanners de dépendances (`npm audit`, `osv-scanner`, etc.) sont sans objet. Les outils ont été
choisis en conséquence.

| Outil / méthode | Justification | Commande type |
|-----------------|---------------|---------------|
| Revue manuelle du code | Confirmer/infirmer les risques, distinguer faux positifs | lecture de `index.html`, `js/**` |
| `grep` ciblé (motifs de secrets) | Détecter clés/jetons/mots de passe | `grep -rniE '(api[_-]?key\|secret\|token\|password\|bearer)'` |
| `grep` (sinks dangereux) | Repérer `eval`, `innerHTML`, `document.write`, stockage | `grep -rnE 'eval\(\|innerHTML\|localStorage\|new Function'` |
| `grep` (sources d'entrée) | Repérer `location`, `URLSearchParams`, `fetch`, `postMessage` | `grep -rnE 'location\|URLSearchParams\|fetch\('` |
| Inventaire d'URL externes | Cartographier la surface tierce | `grep -rnoE 'https?://[^ "]+'` |
| `curl` + `openssl dgst -sha384` | Calculer le hash **SRI** d'EmailJS pour figer la dépendance | voir VULN-001 |
| API jsDelivr | Vérifier la version résolue par le tag flottant `@4` | `curl .../resolved?specifier=4` |

> Aucun secret n'est reproduit dans ce rapport. Le scan de secrets n'a remonté **aucun** identifiant
> applicatif privé ; seuls des identifiants **publiables** EmailJS (côté client par conception) sont présents.

---

## 5. Synthèse des vulnérabilités par criticité

| ID | Titre | Criticité | Statut |
|----|-------|-----------|--------|
| VULN-001 | Scripts tiers sans Subresource Integrity + version flottante | **Haute** | Confirmé |
| VULN-002 | Absence de Content-Security-Policy | **Moyenne** | Confirmé |
| VULN-003 | Abus possible du service EmailJS (spam / quota) | **Moyenne** | Confirmé (config majoritairement hors dépôt) |
| VULN-004 | Formulaire de contact sans limites de saisie | Basse | Confirmé |
| VULN-005 | URL d'analytics en protocole relatif (`//gc.zgo.at`) | Basse | Confirmé |
| VULN-006 | Absence de Referrer-Policy | Basse | Confirmé |
| VULN-007 | Rendu HTML par interpolation non échappée (latent) | Informationnelle | Probable (non exploitable en l'état) |
| VULN-008 | Exposition de données personnelles (date de naissance exacte) | Informationnelle | Confirmé (choix éditorial) |
| VULN-009 | Absence de `.gitignore` | Informationnelle | Confirmé |
| VULN-010 | En-têtes de sécurité HTTP non posables sur GitHub Pages (clickjacking) | Informationnelle | Confirmé |

---

## 6. Détail des vulnérabilités

### VULN-001 — Scripts tiers chargés sans Subresource Integrity (SRI) et version flottante
- **Criticité** : Haute · **Statut** : Confirmé
- **Fichier(s)** : `index.html` (lignes ~438 et ~441-445)
- **Description** : deux scripts tiers sont chargés sans attribut `integrity` :
  - EmailJS : `https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js` — le tag **`@4`** est une
    version **flottante** (résout aujourd'hui `4.4.1`, mais peut changer sans préavis) ;
  - GoatCounter : `//gc.zgo.at/count.js` — script analytics tiers, sans SRI.
- **Scénario d'exploitation** : compromission du CDN jsDelivr, du paquet npm `@emailjs/browser`, ou de
  `gc.zgo.at`. Le script malveillant s'exécute dans le contexte de la page et a un accès **total au DOM**.
  Comme le seul flux de données sensibles est le **formulaire de contact**, un attaquant pourrait
  **exfiltrer le nom, l'e-mail et le message** saisis par les visiteurs (vol de coordonnées,
  hameçonnage ciblé, défiguration).
- **Impact** : compromission de la confidentialité des données des visiteurs et de l'intégrité de la page.
- **Preuve / indice** : balises `<script src=...>` sans `integrity` ; tag de version non figé.
- **Recommandation** :
  - **EmailJS** : figer à `@4.4.1` et ajouter `integrity="sha384-…"` + `crossorigin="anonymous"`.
    Hash SRI calculé pour `4.4.1` (identique au contenu servi par `@4`) :
    `sha384-SALc35EccAf6RzGw4iNsyj7kTPr33K7RoGzYu+7heZhT8s0GZouafRiCg1qy44AS`.
  - **GoatCounter** : passer en `https://` explicite (voir VULN-005). Le SRI n'est **pas** appliqué sur
    `count.js` car ce fichier d'analytics est susceptible d'être mis à jour par l'éditeur (un SRI le casserait) ;
    le risque résiduel est réduit par la CSP (VULN-002).
- **Difficulté** : faible · **Risque de régression** : faible (version vérifiée identique au tag flottant).
- **Tests** : vérifier le chargement effectif d'EmailJS (ouverture du formulaire de contact) après pinning ;
  contrôler en console l'absence d'erreur d'intégrité.

### VULN-002 — Absence de Content-Security-Policy
- **Criticité** : Moyenne · **Statut** : Confirmé
- **Fichier(s)** : `index.html` (`<head>`)
- **Description** : aucune directive `Content-Security-Policy`. En cas d'introduction future d'une faille
  d'injection (ou de compromission d'un tiers, cf. VULN-001), rien ne restreint l'origine des scripts,
  des connexions réseau ou l'exfiltration de données.
- **Scénario d'exploitation** : un script injecté pourrait `fetch()` vers un domaine attaquant ;
  une CSP `connect-src`/`script-src` bloquerait l'exfiltration et le chargement de scripts non autorisés.
- **Impact** : perte de défense en profondeur.
- **Recommandation** : ajouter une balise `<meta http-equiv="Content-Security-Policy">` autorisant
  strictement les origines réellement utilisées (self, jsDelivr, gc.zgo.at, api.emailjs.com,
  j-rbs.goatcounter.com, fonts.googleapis.com, fonts.gstatic.com). `style-src 'unsafe-inline'` reste
  nécessaire (styles en ligne abondants dans le rendu) — risque faible (les styles n'exécutent pas de JS).
- **Difficulté** : moyenne (réglage des origines) · **Risque de régression** : moyen → à valider visuellement.
- **Tests** : vérifier en console l'absence de violations CSP (fonts, EmailJS, GoatCounter, favicon, partage).

### VULN-003 — Abus possible du service EmailJS (spam / épuisement de quota)
- **Criticité** : Moyenne · **Statut** : Confirmé (correctifs majoritairement **hors dépôt**)
- **Fichier(s)** : `js/ui/contactForm.js`
- **Description** : les identifiants EmailJS (Service ID, Template ID, Public Key) sont — par conception —
  publics côté client. Sans restriction d'origine, sans CAPTCHA et sans limitation de débit, un tiers
  peut réutiliser ces identifiants pour **envoyer des e-mails via le compte** et **épuiser le quota** /
  générer du spam.
- **Scénario d'exploitation** : extraction des IDs depuis le bundle, puis appels automatisés à l'API EmailJS.
- **Impact** : déni de service du canal de contact, spam, coûts/quota.
- **Preuve / indice** : envoi direct via `emailjs.sendForm` sans protection anti-abus.
- **Recommandation** (à appliquer **dans le tableau de bord EmailJS**, hors dépôt) :
  1. activer la **restriction d'origine (Allowed Origins)** sur le domaine GitHub Pages ;
  2. activer **reCAPTCHA / hCaptcha** sur le template ;
  3. fixer une **limite de débit** côté EmailJS.
  Côté dépôt : limiter la taille des saisies (VULN-004) pour réduire l'amplitude d'abus.
- **Difficulté** : faible (config) · **Risque de régression** : faible.
- **Tests** : envoi nominal depuis le domaine autorisé OK ; envoi depuis une autre origine rejeté.

### VULN-004 — Formulaire de contact sans limites de saisie
- **Criticité** : Basse · **Statut** : Confirmé
- **Fichier(s)** : `js/render/renderHeader.js` (`renderContactModal`)
- **Description** : les champs `from_name`, `from_email`, `message` n'ont pas de `maxlength` ni de contrainte
  de longueur. Au-delà du type `email` HTML5, aucune validation/normalisation.
- **Scénario d'exploitation** : envoi de charges utiles surdimensionnées pour gonfler les e-mails / le quota.
- **Impact** : faible (renforce VULN-003).
- **Recommandation** : ajouter `maxlength` raisonnables (ex. nom 100, email 150, message 2000) et `minlength`.
- **Difficulté** : très faible · **Risque de régression** : nul.
- **Tests** : la saisie au-delà des limites est tronquée/refusée ; un message normal passe.

### VULN-005 — URL d'analytics en protocole relatif
- **Criticité** : Basse · **Statut** : Confirmé
- **Fichier(s)** : `index.html` (`src="//gc.zgo.at/count.js"`)
- **Description** : URL en protocole relatif. Sur GitHub Pages (HTTPS) le comportement est correct, mais
  dans un contexte non-HTTPS (ouverture locale, miroir HTTP) le script pourrait être chargé en clair.
- **Recommandation** : forcer `https://gc.zgo.at/count.js`.
- **Difficulté** : très faible · **Risque de régression** : nul.
- **Tests** : analytics toujours fonctionnel après passage en HTTPS explicite.

### VULN-006 — Absence de Referrer-Policy
- **Criticité** : Basse · **Statut** : Confirmé
- **Fichier(s)** : `index.html` (`<head>`)
- **Description** : aucune politique de référent. L'URL complète peut fuiter vers les origines tierces.
- **Recommandation** : `<meta name="referrer" content="strict-origin-when-cross-origin">`.
- **Difficulté** : très faible · **Risque de régression** : nul.

### VULN-007 — Rendu HTML par interpolation de chaînes non échappée (latent)
- **Criticité** : Informationnelle · **Statut** : Probable (non exploitable en l'état)
- **Fichier(s)** : `js/render/*.js`, `js/main.js` (`appElement.innerHTML = …`)
- **Description** : le rendu construit du HTML par template strings injecté via `innerHTML`, **sans
  échappement**. Aujourd'hui **non exploitable** : toutes les données proviennent de `js/data/*` statiques
  et contrôlées par l'auteur (pas de paramètre d'URL, pas de `localStorage`, pas de `fetch`, pas d'entrée
  utilisateur). Le risque devient réel **si** une donnée externe/utilisateur était un jour interpolée.
- **Recommandation (défensive, non bloquante)** : documenter l'invariant « `js/data/*` = données de confiance
  uniquement » ; si une source externe est introduite, ajouter une fonction d'échappement HTML systématique.
- **Difficulté** : n/a aujourd'hui · **Risque de régression** : n/a.
- **Tests** : (si évolution) test unitaire vérifiant l'échappement de `<script>`/`"`/`<`.

### VULN-008 — Exposition de données personnelles
- **Criticité** : Informationnelle · **Statut** : Confirmé (choix éditorial assumé)
- **Fichier(s)** : `index.html` (JSON-LD `birthDate: 1991-06-24`, adresse), `js/data/contact.js`
- **Description** : nom complet, **date de naissance exacte**, localité et code postal sont publiés et
  structurés (schema.org). C'est le CV de l'auteur (donc volontaire), mais la date de naissance exacte
  combinée au nom et à la localisation facilite l'usurpation d'identité / l'ingénierie sociale.
- **Recommandation** : envisager de retirer la `birthDate` exacte du JSON-LD (la garder dans le contenu
  visible si souhaité) ou de ne publier que l'année. **Décision laissée à l'auteur** ; non corrigé d'office.
- **Difficulté** : très faible · **Risque de régression** : nul.

### VULN-009 — Absence de `.gitignore`
- **Criticité** : Informationnelle · **Statut** : Confirmé
- **Fichier(s)** : racine du dépôt
- **Description** : pas de `.gitignore`. Risque futur de commit accidentel de fichiers d'environnement,
  de secrets ou d'artefacts (ex. `.env`, `node_modules/`, fichiers d'éditeur).
- **Recommandation** : ajouter un `.gitignore` couvrant `.env*`, `node_modules/`, artefacts d'OS/éditeur.
- **Difficulté** : très faible · **Risque de régression** : nul.

### VULN-010 — En-têtes de sécurité HTTP non posables sur GitHub Pages (clickjacking)
- **Criticité** : Informationnelle · **Statut** : Confirmé
- **Fichier(s)** : hébergement (hors dépôt)
- **Description** : GitHub Pages ne permet pas de définir `X-Frame-Options`, `X-Content-Type-Options`,
  `Strict-Transport-Security` côté serveur. `frame-ancestors` n'est pas honoré dans une balise `<meta>`.
  Le site pourrait donc être encadré (clickjacking) — impact faible pour un CV public en lecture seule.
- **Recommandation** : si un durcissement complet des en-têtes devient nécessaire, héberger derrière un
  proxy/CDN capable de poser ces en-têtes (Cloudflare, Netlify, etc.). Sinon, risque accepté.

---

## 7. Faux positifs / risques écartés

- **« Fuite de secret EmailJS »** : **écarté**. Service ID / Template ID / Public Key EmailJS sont des
  identifiants **publiables** prévus pour le client. Ce n'est pas une fuite ; la rotation n'est pas requise
  pour confidentialité (mais la restriction d'origine reste recommandée — VULN-003).
- **Injection SQL/NoSQL/commande/template, SSRF, path traversal** : **sans objet** — aucun backend, aucun
  exécuteur côté serveur, aucune construction de requête.
- **CSRF** : **sans objet** — pas de session ni d'état authentifié ; le POST EmailJS ne dépend pas d'un
  cookie d'authentification du site.
- **Vulnérabilités de dépendances (npm/osv)** : **sans objet** — pas de `package.json` ni de lockfile.
  La seule dépendance runtime (EmailJS) est traitée via SRI (VULN-001).
- **`eval` / `new Function` / `document.write`** : **absents** du code.
- **XSS exploitable** : **non confirmé** aujourd'hui (cf. VULN-007 — données statiques uniquement).

---

## 8. Recommandations prioritaires

1. **(Haute)** Figer EmailJS à `@4.4.1` + `integrity` (SRI) + `crossorigin` — VULN-001.
2. **(Moyenne)** Ajouter une Content-Security-Policy restrictive via `<meta>` — VULN-002.
3. **(Moyenne)** Durcir EmailJS côté tableau de bord (Allowed Origins + CAPTCHA + rate limit) — VULN-003.
4. **(Basse)** `maxlength`/`minlength` sur le formulaire — VULN-004.
5. **(Basse)** `https://` explicite pour GoatCounter — VULN-005.
6. **(Basse)** `Referrer-Policy` via `<meta>` — VULN-006.
7. **(Info)** `.gitignore` — VULN-009 ; décision auteur sur `birthDate` — VULN-008.

---

## 9. Plan de remédiation (ordre logique)

1. **Secrets / configuration** : néant à corriger côté dépôt (clés publiables). Ajout `.gitignore` (VULN-009).
2. **Dépendances critiques** : pinning + SRI EmailJS (VULN-001).
3. **Authentification / autorisation** : sans objet.
4. **Validation des entrées** : limites du formulaire (VULN-004).
5. **Frontend / backend** : CSP + Referrer-Policy + HTTPS analytics (VULN-002, VULN-005, VULN-006).
6. **Infra / CI/CD** : sans objet (recommandations en-têtes hébergeur — VULN-010).
7. **Tests** : vérification manuelle de non-régression (chargement EmailJS, fonts, analytics, partage, CSP).
8. **Audit final** : relance du scan de secrets/sinks, contrôle visuel, mise à jour du rapport de remédiation.

---

## 10. Tests de sécurité recommandés

- Ouverture du formulaire de contact → EmailJS chargé sans erreur d'intégrité (SRI OK).
- Console navigateur → **0 violation CSP** (fonts Google, EmailJS, GoatCounter, favicon, partage).
- Soumission d'un message normal → succès ; saisie hors limites → refusée/tronquée.
- Recherche périodique de secrets (`grep`/`gitleaks`) en pré-commit.
- (Évolutif) si une donnée externe est introduite dans le rendu : test unitaire d'échappement HTML (VULN-007).

---

## 11. Risques résiduels

- **Compromission de `gc.zgo.at` (GoatCounter)** : non couverte par SRI (script auto-mis à jour) ;
  atténuée par la CSP. Risque résiduel faible — alternative : auto-héberger le script ou retirer l'analytics.
- **`style-src 'unsafe-inline'`** : conservé en raison des styles en ligne ; impact faible.
- **Abus EmailJS** : dépend de la configuration du tableau de bord (hors dépôt).
- **Clickjacking / en-têtes HTTP** : non posables sur GitHub Pages (VULN-010) — risque accepté pour un CV public.
- **Exposition PII** (VULN-008) : décision éditoriale de l'auteur.

---

## 12. Fichiers modifiés pendant l'audit

Aucune modification de code n'a été nécessaire **pour réaliser l'analyse**. Les corrections sont décrites
et appliquées dans la phase de remédiation (voir `SECURITY_REMEDIATION_REPORT.md`).
