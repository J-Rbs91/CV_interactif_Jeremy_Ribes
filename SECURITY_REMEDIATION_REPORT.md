# SECURITY_REMEDIATION_REPORT.md

> Remédiation de sécurité — Dépôt **CV_interactif_Jeremy_Ribes**
> Date : 2026-06-20 · Base : `SECURITY_AUDIT_REPORT.md`
> Branche : `claude/security-audit-main-xs7day` (aucun push direct sur `main`)

---

## 1. Résumé des vulnérabilités corrigées

| ID | Titre | Criticité | Statut final | Agent responsable |
|----|-------|-----------|--------------|-------------------|
| VULN-001 | Scripts tiers sans SRI + version flottante | Haute | **Corrigé** | Dépendances & Supply Chain |
| VULN-002 | Absence de Content-Security-Policy | Moyenne | **Corrigé** | Frontend Security |
| VULN-004 | Formulaire sans limites de saisie | Basse | **Corrigé** | Validation des entrées |
| VULN-005 | URL analytics en protocole relatif | Basse | **Corrigé** | Dépendances & Supply Chain |
| VULN-006 | Absence de Referrer-Policy | Basse | **Corrigé** | Frontend Security |
| VULN-009 | Absence de `.gitignore` | Info | **Corrigé** | Secrets & Configuration |

Revue finale par l'**Agent QA Sécurité Final** (relecture indépendante du diff complet) : **APPROUVÉ**.
Vérification que la CSP n'omet aucune origine réellement utilisée (Google Fonts, jsDelivr, EmailJS API,
GoatCounter script + beacon, favicon, modules ES, JSON-LD, styles en ligne) — **aucune ressource bloquée**.

---

## 2. Vulnérabilités restantes et justification

| ID | Criticité | Décision | Justification |
|----|-----------|----------|---------------|
| VULN-003 | Moyenne | **Action hors dépôt** | Durcissement EmailJS (Allowed Origins, CAPTCHA, rate limit) se configure dans le **tableau de bord EmailJS**, pas dans le code. Atténué côté dépôt par VULN-004. |
| VULN-007 | Info | **Accepté (latent)** | Rendu `innerHTML` non échappé mais **non exploitable** : données 100 % statiques/auteur. La CSP `script-src` (sans `'unsafe-inline'`) ajoute une défense en profondeur. À traiter uniquement si une source externe est introduite. |
| VULN-008 | Info | **Décision auteur** | Exposition de la date de naissance exacte = choix éditorial. Recommandation de ne publier que l'année laissée à l'auteur ; non modifié d'office. |
| VULN-010 | Info | **Risque accepté** | `X-Frame-Options`/`HSTS`/`X-Content-Type-Options` et `frame-ancestors` non posables sur GitHub Pages / via `<meta>`. Impact clickjacking faible pour un CV public en lecture seule. |

Aucune vulnérabilité n'a été masquée ; aucun test n'a été supprimé.

---

## 3. Changements réalisés par fichier

### `index.html`
- **VULN-002 / VULN-006** : ajout dans `<head>` d'une balise `Content-Security-Policy` restrictive et d'une
  balise `referrer` (`strict-origin-when-cross-origin`).
  - CSP : `default-src 'self'` ; `script-src 'self' https://cdn.jsdelivr.net https://gc.zgo.at` ;
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` ; `font-src https://fonts.gstatic.com` ;
    `img-src 'self' data: https://j-rbs.goatcounter.com` ;
    `connect-src https://api.emailjs.com https://j-rbs.goatcounter.com` ;
    `object-src 'none'` ; `base-uri 'self'` ; `form-action 'self'` ; `upgrade-insecure-requests`.
- **VULN-001** : script EmailJS **figé** en `@4.4.1` + `integrity="sha384-…"` + `crossorigin="anonymous"`
  (hash vérifié identique au contenu servi par le tag flottant `@4`).
- **VULN-005** : GoatCounter passé de `//gc.zgo.at/count.js` à `https://gc.zgo.at/count.js`.

### `js/render/renderHeader.js`
- **VULN-004** : ajout de contraintes sur le formulaire de contact :
  `from_name` `minlength=2` `maxlength=100` · `from_email` `maxlength=150` ·
  `message` `minlength=10` `maxlength=2000`.

### `.gitignore` (nouveau)
- **VULN-009** : exclusion de `.env*`, `*.pem`, `*.key`, `secrets.*`, `node_modules/`, artefacts OS/éditeur, logs.

### `SECURITY_AUDIT_REPORT.md` / `SECURITY_REMEDIATION_REPORT.md` (nouveaux)
- Documentation d'audit et de remédiation.

---

## 4. Tests ajoutés ou modifiés

Le projet ne possède **pas de framework de test** (site statique sans build). Conformément au principe de
modifications minimales (`AGENTS.md`), aucun harnais de test n'a été introduit. La non-régression a été
vérifiée par **contrôles manuels et statiques** (voir §5). Tests recommandés pour l'avenir : voir §10 du
rapport d'audit (chargement EmailJS sous SRI, absence de violation CSP, validation du formulaire).

---

## 5. Commandes exécutées

```bash
# Vérification absence de secrets (après correction)
grep -rniE '(api[_-]?key|secret|token|password|bearer)' js/ index.html css/   # → 0 résultat

# Vérification absence de sinks dangereux
grep -rnE 'eval\(|document\.write|insertAdjacentHTML|new Function' js/         # → none

# Vérification pinning + HTTPS (aucun reliquat flottant/http)
grep -nE '@4/dist|src="//' index.html                                          # → none

# Présence CSP / SRI / referrer
grep -cE 'Content-Security-Policy|integrity=|name="referrer"' index.html       # → 3

# Recalcul et vérification du hash SRI EmailJS 4.4.1
curl -fsSL https://cdn.jsdelivr.net/npm/@emailjs/browser@4.4.1/dist/email.min.js \
  | openssl dgst -sha384 -binary | openssl base64 -A
# → SALc35EccAf6RzGw4iNsyj7kTPr33K7RoGzYu+7heZhT8s0GZouafRiCg1qy44AS  (correspond)

# Contrôle syntaxique JS
node --check js/main.js js/render/renderHeader.js js/ui/contactForm.js          # → OK
```

---

## 6. Résultat des scanners après correction

- **Scan de secrets (grep ciblé)** : **0** secret applicatif détecté.
- **Sinks dangereux** (`eval`, `new Function`, `document.write`, `insertAdjacentHTML`) : **aucun**.
- **Dépendances** : aucune dépendance gérée par paquet ; seule dépendance runtime (EmailJS) **figée + SRI**.
- **Vérification SRI** : hash recalculé identique → intégrité garantie.
- **Contrôle syntaxique** (`node --check`) : **OK** sur les fichiers modifiés.
- **Revue QA indépendante** (agent dédié) : **APPROUVÉ**, aucune origine CSP manquante.

---

## 7. Risques résiduels

- **GoatCounter (`gc.zgo.at`)** : pas de SRI (script susceptible d'évoluer côté éditeur) ; atténué par la CSP.
  Alternative : auto-héberger le script ou retirer l'analytics.
- **`style-src 'unsafe-inline'`** : conservé (styles en ligne nombreux) ; impact faible (pas d'exécution JS).
- **Abus EmailJS (VULN-003)** : dépend de la configuration du tableau de bord (hors dépôt).
- **Clickjacking / en-têtes HTTP (VULN-010)** : non posables sur GitHub Pages — risque accepté.
- **PII (VULN-008)** : décision éditoriale de l'auteur.

---

## 8. Actions recommandées après merge

1. **Rotation de secrets** : non requise (aucun secret privé exposé ; clés EmailJS publiables par conception).
2. **Configuration EmailJS (prioritaire)** : activer **Allowed Origins** (domaine GitHub Pages), un **CAPTCHA**
   et une **limite de débit** dans le tableau de bord EmailJS (traite VULN-003).
3. **Revue humaine** : valider visuellement le site après déploiement (police, formulaire, partage, analytics)
   et contrôler la **console navigateur** → 0 violation CSP.
4. **Variables d'environnement** : néant à mettre à jour (site statique sans `.env`).
5. **Déploiement contrôlé** : publier sur une branche/preview avant `main` si possible ; vérifier le SRI EmailJS.
6. **Surveillance des logs** : suivre les statistiques EmailJS (pics d'envois = signe d'abus).
7. **Création d'alertes** : alerte sur dépassement de quota EmailJS.
8. **Amélioration CI/CD** : ajouter un workflow GitHub Actions minimal (lint HTML/JS + scan de secrets type
   `gitleaks` en pré-merge), avec permissions `contents: read` et actions **pinnées par SHA**.
9. **Décision auteur** : arbitrer sur la `birthDate` exacte du JSON-LD (VULN-008).
10. **Maintenance SRI** : à chaque montée de version d'EmailJS, recalculer le hash `integrity`.
