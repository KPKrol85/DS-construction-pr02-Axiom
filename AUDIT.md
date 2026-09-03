# Axiom — Final Technical Front-End Audit

**Audit date:** 2026-09-02
**Project type:** Static multi-page marketing website (vanilla HTML/CSS/ES Modules, no runtime dependencies) with a custom Node release pipeline, a generated service worker, and Netlify-format static-hosting configuration
**Audit mode:** Final repository and implementation review
**Current readiness:** Needs important fixes

## 1. Executive assessment

The implementation is coherent and the engineering discipline in the build and release layer is well above what a static company site normally carries. Ownership of generated output is explicit and enforced: `tools/release/bundle-names.mjs` is the single owner of production bundle names, `dist/build-manifest.json` is the per-build source of truth that the HTML rewrite, the production service worker and the generated `dist/_headers` all read, and `tools/qa/check-references.mjs` validates that contract statically without a build. That check was executed during this audit and passed over 1344 local references. The tracked root `sw.js` was independently re-derived from `sw.template.js` and its generator and is byte-identical, so no service worker in the repository has drifted from its source.

The application layer is defensive and accessible in its fundamentals: every component returns early when its target is absent, all `localStorage` access is wrapped, and all 15 pages carry `lang`, a single `<h1>`, a `#main` landmark, a skip link, unique IDs and resolvable ARIA references. No secrets, credentials or environment files are present.

The remaining risk sits in the public-facing contract rather than in the architecture. Four issues need attention before this is presented or handed over: every canonical URL, `og:url`, JSON-LD identifier, sitemap entry and the `robots.txt` sitemap pointer name an origin that does not resolve, while the site is deployed on a different host; the careers page collects personal data and a CV behind a consent checkbox with no submission path; the offline page's recovery controls are inert because their only script is never loaded; and the reveal animation leaves the majority of the homepage at `opacity: 0` when JavaScript is unavailable, on a project that otherwise implements a deliberate non-JavaScript baseline. None is architectural and all four are contained corrections.

## 2. Audit scope and verification

### Areas inspected

- All 15 HTML pages (`index.html`, six `services/`, five `legal/`, `404.html`, `offline.html`, `success.html`): document structure, landmarks, headings, metadata, structured data, forms, images, links.
- Complete CSS layer set (`css/main.css` plus 19 imported files, 2869 lines): tokens, theming strategy, utilities, layout, sections, reduced-motion handling, `!important` usage.
- Complete JavaScript source (`js/`, 18 files): entry point, initialization order, config, components (navigation, theme, header, scroll-top, lightbox, cookies, forms), sections, utils, service-worker registration, `theme-init.js`.
- Service worker: `sw.template.js` (canonical source), generated root `sw.js`, generator `tools/sw/build-sw.mjs` and both precache profiles.
- Build and QA tooling: all nine scripts under `tools/`, plus `tools/templates/head.partial.html` and `tools/templates/pages.meta.json`.
- Deployment and metadata contract: `_headers`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`.
- Testing and linting configuration: `vitest.config.mjs`, `eslint.config.mjs`, both suites in `tests/` (20 tests).
- Repository metadata: `package.json`, `package-lock.json`, `.gitignore`, `LICENSE`, `THIRD-PARTY-NOTICES.md`, `README.md`, `settings.md`, `docs/CHANGELOG.md`, and the archived audit and plan under `docs/archive/`.

### Verification performed

- `npm run qa:references` — **executed and passed.** Run as `node tools/qa/check-references.mjs`, which imports only Node built-ins and local modules, because no dependencies are installed. Result: 1344 local references across 15 HTML pages, 20 CSS files, `manifest.webmanifest` and 9 precache entries all resolved; the bundle-naming contract held; the post-build release checks were skipped because no `dist/build-manifest.json` exists.
- Service-worker synchronization — **executed and passed.** The local profile of `tools/sw/build-sw.mjs` was re-implemented read-only: the revision `08ff47a9cc6bf00a` recomputed from `css/main.css`, `js/main.js`, `js/theme-init.js` and `manifest.webmanifest` matches, and the rendered output is byte-identical to the tracked `sw.js`.
- `<head>` generation contract — **executed, partially conforming.** `tools/html/build-head.mjs` was re-implemented read-only against all 15 pages: every page carries exactly the metadata `pages.meta.json` declares, and `canonical` equals `og_url` everywhere. Re-running the real script would rewrite all 15 pages; see [P2-01].
- Structured data — **executed and passed.** All 15 inline `application/ld+json` blocks parse as valid JSON (`index.html` carries two, `success.html` none).
- Secret scan — **executed, nothing found.** No credentials, tokens, keys or `.env` files in tracked sources.
- Dependency documentation — **executed and passed.** The 14 tool versions named in `README.md` match `package-lock.json` exactly (`lockfileVersion` 3).
- Browser verification of the current working tree — **executed.** A temporary read-only static server (Node built-ins only, written outside the repository, installing nothing and writing nothing into it) served the worktree; `index.html`, `services/budowa-domow.html`, `legal/regulamin.html` and `legal/kariera.html` were inspected at 375×812 and at desktop width. No horizontal overflow on any page; no duplicate IDs; no dangling `aria-labelledby` / `aria-controls` / `aria-describedby`; every `<img>` has `alt`; all `target="_blank"` anchors carry `rel="noopener noreferrer"`; no placeholder `#` link destinations. Computed opacity of the 29 `.u-hidden` elements and the resolved theme tokens were measured directly.
- Live deployment — **executed, read-only.** `https://construction-pr02-axiom.netlify.app/` was inspected for served metadata, response headers, true 404 behavior and asset naming. `https://construction-project-02.netlify.app/` — the origin every page declares as canonical — returns Netlify's "Site not found".
- `npm run lint`, `npm test`, `npm run qa:lighthouse`, `npm run qa:a11y` — **not executed.** `node_modules/` is absent and this audit installs nothing.
- `npm run build`, `npm run build:head`, `npm run img:build` — **not executed.** Each writes tracked files (the root `sw.js`, the 15 HTML pages, `assets/img/_optimized/`), which is outside a read-only audit. Their behavior was established by reading the scripts and by the read-only re-implementations above.

### Verification limitations

- ESLint, Vitest, Lighthouse and pa11y results are unavailable. No claim is made about whether those checks currently pass; the 20 tests in `tests/` were read, not run.
- No production build was produced, so `dist/`, `dist/sw.js`, `dist/_headers` and the content-addressed bundles were assessed through their generators and the static contract check, never as real output.
- The live deployment predates the current repository revision. It serves `/style.min.css` and `/script.min.js` — the fixed intermediate names that `build:hash` replaced in commit `562a4ec` — and serves `/assets/img/*` with `Cache-Control: public,max-age=31536000,immutable`, which the current `_headers` no longer declares. Live observations therefore describe an earlier build and are used only as supplementary evidence.
- No form was submitted, so whether Netlify Forms is enabled for the deployment and where a contact submission lands was not verified.
- Contrast compliance was not fully verified because reliable computed-style analysis was not available. The token layer composes surfaces through `color-mix()` and semi-transparent values over images and gradients, so a determination requires a systematic pass that was not performed.
- No assistive-technology testing, no cross-browser testing and no performance measurement were carried out. All behavior described as observed was observed in a single Chromium-based browser.

## 3. Verified strengths

- **Single-owner release contract.** `tools/release/bundle-names.mjs` owns every production filename decision, the hash algorithm, the manifest shape and its validation; `build:hash`, `build:sw` and `build:dist` all call into it rather than constructing names, and `readBundleManifest` rejects a stale, malformed or dangling manifest before any consumer acts on it.
- **Generated-file ownership is enforced, not just documented.** `sw.template.js` is the only hand-edited service-worker source and both outputs are rendered through one substitution step; the tracked `sw.js` was independently re-derived during this audit and matches byte for byte.
- **Machine-checked reference integrity.** `tools/qa/check-references.mjs` resolves every local reference declared by HTML, CSS, the manifest and the precache definition, and additionally verifies the bundle contract statically — no server, no browser, no `dist/`. It passed.
- **Defensive initialization throughout.** Every module in `js/components/` returns early when its target element is absent (`js/components/navigation.js:7`, `js/components/lightbox.js:8`, `js/components/forms.js:7`, `js/components/cookies.js:7`), and all browser-storage access goes through `try/catch` wrappers (`js/utils/storage.js`).
- **Deliberate focus management in implemented interactions.** Focus trap plus focus return in the lightbox and the consent modal, the lightbox's dynamic controls created before the focusable snapshot is taken (`js/components/lightbox.js:70-71`), `inert` plus `aria-hidden` on the hidden back-to-top button (`js/components/scroll-top.js:9-14`), and `aria-expanded` / `aria-pressed` kept in sync in the navigation and theme toggle.
- **Consistent document fundamentals across all 15 pages.** Each carries `lang="pl"`, exactly one `<h1>`, a `#main` landmark and a skip link; measured in the browser, no duplicate IDs, no dangling ARIA references, and every image has an `alt` attribute.
- **Single canonical source for page metadata and for structured data.** `tools/templates/pages.meta.json` plus `head.partial.html` own every `<head>`, and the inline JSON-LD blocks are the only structured-data source in the repository; all 15 parse as valid JSON.
- **Honest documentation.** `README.md` states that the repository does not confirm the project is live at the recorded canonical origin, that no audit results confirm any WCAG level, that no performance measurement exists and that the QA audits were not run — and its 14 declared tool versions match `package-lock.json` exactly.
- **Coherent, layered CSS with a small override surface.** One entry point aggregating tokens → base → layout → components → sections, a complete semantic token set with a `[data-theme="dark"]` override, a global `prefers-reduced-motion` block, and only 14 `!important` declarations across 2869 lines, most of them in the screen-reader and reduced-motion utilities.
- **No runtime dependencies and no external runtime requests.** `package.json` declares `devDependencies` only; fonts are self-hosted with their upstream OFL texts stored per family and indexed in `THIRD-PARTY-NOTICES.md`.
- **Security-visible repository state is clean.** No credentials, tokens, keys or `.env` files; `_headers` delivers CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Cross-Origin-Resource-Policy` and a restrictive `Permissions-Policy`, confirmed present on live responses.
- **Public content declares its demonstrative character.** A project-information dialog appears on every page and the legal pages state that "Axiom Construction" is a fictional brand created for a demonstration project, so the marketing copy, testimonials and business details do not present themselves as a real trading company.

## 4. P0 — Critical risks

None detected.

## 5. P1 — Important issues worth fixing next

### [P1-01] Every canonical, social and sitemap URL names an origin that does not resolve

- **Status:** RESOLVED — implemented and recorded in CHANGELOG.md
- **Resolution:** The canonical public origin was corrected to `https://construction-pr02-axiom.netlify.app` and synchronized across generated metadata, JSON-LD, sitemap and robots configuration.

- **Classification:** Contract mismatch
- **Affected area:** SEO metadata, social previews, structured data, deployment contract
- **Evidence:** `tools/templates/pages.meta.json` — 30 `canonical` / `og_url` values; `tools/html/build-head.mjs:11`; `sitemap.xml:6` and the 11 further `<loc>` entries; `robots.txt:17`; the inline JSON-LD `@id` / `url` / `item` values in all 14 pages that carry a block. 254 occurrences of the origin across tracked sources.
- **Current behavior:** Every page declares `https://construction-project-02.netlify.app` as its canonical origin, its `og:url`, its `og:image` host and its structured-data identifier; `sitemap.xml` lists 12 URLs on that host and `robots.txt` points crawlers at its sitemap. That host was requested during this audit and returns Netlify's "Site not found". The deployment supplied for this audit answers on `https://construction-pr02-axiom.netlify.app`, serves the same metadata verbatim, and declares `robots: index, follow` on its public pages.
- **Impact:** On the live, indexable site every page tells search engines that the authoritative copy lives on a host that does not exist, and the sitemap and `robots.txt` reinforce it with 12 more dead URLs. Because `og:image` and `og:url` resolve against the same dead host, link previews on social platforms and messaging apps fail to load an image or a destination — which for a portfolio-facing project defeats the main way the work gets shared. `README.md` already records that the repository does not confirm the project is live at that address, so the mismatch is unresolved rather than unknown.
- **Recommended direction:** Establish one canonical origin that matches the deployment the project actually publishes, and set it in the places that own it: `pages.meta.json` (regenerating the heads), the hardcoded `defaultOgImage` in `tools/html/build-head.mjs`, `sitemap.xml`, `robots.txt`, and the inline JSON-LD identifiers. The origin currently lives in five independent places; consider making it a single declared value the generators read, so it cannot drift again.
- **Verification criteria:** A request to the canonical origin declared by every page returns the deployed site; each page's `canonical` and `og:url` resolve to that page on that origin; `sitemap.xml` and `robots.txt` name the same origin; and the `og:image` URL returns an image.

### [P1-02] The careers form collects personal data and a CV with no submission path

- **Classification:** Defect
- **Affected area:** Forms, public content integrity, `legal/kariera.html`
- **Evidence:** `legal/kariera.html:156` (`<form id="career__form" action="#" method="post" novalidate>`), `:162-185` (fields, including the PDF upload at `:185`), `:188` (consent checkbox), `:195` (submit button)
- **Current behavior:** The page invites visitors to apply for a job ("Wypełnij formularz, aby zgłosić swoją kandydaturę") and collects name, e-mail, phone, position, a free-text experience description, a PDF CV upload and an explicit recruitment-consent checkbox. The form has `action="#"`, carries no `data-netlify` attribute, and no JavaScript module references `#career__form` or `.career__form` — `js/components/forms.js` binds only to `#contactForm`. Submitting therefore posts to the current document and nothing processes the data; no success state, error state or status message exists. `novalidate` additionally disables the browser's own enforcement, so the `required` attributes on the name, e-mail and consent fields have no effect and the form can be submitted empty.
- **Impact:** A visitor can upload a CV containing personal data, tick a data-processing consent, press send, and receive no indication that the submission went nowhere. The control is indistinguishable from a working application channel, which is the most consequential kind of misleading control on a public site — and the only page-level disclosure of the site's demonstrative character sits in the separate legal documents, not on this page.
- **Recommended direction:** Either give the form a real destination on the same terms as the contact form (a named Netlify form with a confirmation route and the honeypot the contact form already uses) or replace it with an honest alternative — a mailto contact or a clearly disabled state that states no applications are accepted. Whichever is chosen, remove `novalidate` or supply the equivalent custom validation and error messaging, so required fields are actually enforced.
- **Verification criteria:** Submitting the careers form either reaches a real destination and returns a visible confirmation, or the page no longer presents a submit control that implies processing; required fields block an empty submission with an announced error.

### [P1-03] The offline page's recovery controls are inert because their only script is never loaded

- **Classification:** Defect
- **Affected area:** Service worker offline fallback, `offline.html`
- **Evidence:** `js/offline.js:1-8`; `offline.html:148` (`<button id="retryBtn">`), `offline.html:150` (`<p class="sr-only" id="netStatus" aria-live="polite">`), `offline.html:83` and `:348` (the only two scripts the page loads)
- **Current behavior:** `js/offline.js` binds the "Spróbuj ponownie" button to `location.reload()`, reloads on the `online` event, and reloads on `Escape`. No page loads it: `offline.html` loads `js/theme-init.js` and `js/main.js`, and `js/main.js` reaches `js/offline.js` through no import — it is outside the module graph, so `build:js` does not bundle it either. A repository-wide search finds `retryBtn` and `netStatus` referenced only in that orphaned file. The `#netStatus` live region is consequently never written to.
- **Impact:** On the one page users reach specifically because something went wrong, the primary recovery affordance does nothing when activated, the page does not recover by itself when the connection returns, and the live region that exists to announce connection state stays permanently empty. The dead control is the visible symptom; the orphaned module is the root cause and is also copied into the deployment by `build:dist`, which copies `js/` wholesale.
- **Recommended direction:** Decide the file's status and make the page match it — either load `js/offline.js` from `offline.html` (as a classic script, consistent with how `js/theme-init.js` is loaded) and have it populate `#netStatus`, or remove the module together with the controls it was written for.
- **Verification criteria:** On `offline.html`, activating the retry control attempts a reload and restoring the connection recovers the page without manual reload; or neither the button nor the live region remains in the markup, and `js/offline.js` no longer exists.

### [P1-04] Most homepage content stays invisible when JavaScript does not run

- **Classification:** Defect
- **Affected area:** Progressive enhancement, CSS utilities, homepage and service pages
- **Evidence:** `css/components/utilities.css:95-100` (`.u-hidden { opacity: 0 }`); `js/sections/hero.js:4-46` (the only code that adds `u-show`); `index.html` — 29 elements carry `u-hidden`; each of the six `services/*.html` pages — 13; `index.html:1211-1213` (`<noscript>`); `css/layout/layout.css:205-208` (the `html.js` guard used for the navigation)
- **Current behavior:** `.u-hidden` sets `opacity: 0` unconditionally and is the start state of the scroll reveal. `u-show`, which restores opacity, is added exclusively by `js/sections/hero.js`. Measured in the browser against the current sources, all 29 `.u-hidden` elements compute to `opacity: 0` in the CSS-only state; with JavaScript running and the page visible, the reveal works correctly on scroll. On the homepage those 29 elements are the About section text and feature list, all six service cards, all three testimonials and all twelve gallery items — everything between the hero and the FAQ. The rule carries no `noscript` fallback and no `html.js` guard, although `js/theme-init.js:3` sets that very marker class and `css/layout/layout.css:205` already uses it to guard the navigation drawer.
- **Impact:** If the module bundle fails to load — a cache miss against a hashed filename, a CSP change, a network error, or JavaScript disabled — the homepage renders its header, hero, FAQ, contact form and footer while the entire middle of the page occupies layout space but displays nothing. The failure is silent: no fallback, no error, no visual cue. The same applies to the feature, gallery and call-to-action blocks on all six service pages. The project otherwise treats a working non-JavaScript baseline as an intended property — the navigation is guarded by `html.js` and the contact form's own `<noscript>` states that the form works without JavaScript — so this is a gap in an established baseline rather than an unsupported expectation.
- **Recommended direction:** Scope the hidden start state to the enhanced case, using the marker class `js/theme-init.js` already sets before first paint, so the reveal only ever hides content in a document where the script that reveals it has run.
- **Verification criteria:** With JavaScript disabled, the About, Services, Testimonials and Gallery sections of `index.html` and the feature, gallery and CTA blocks of a service page are fully visible; with JavaScript enabled the scroll reveal behaves as it does today.

## 6. P2 — Minor refinements

### [P2-01] `npm run build:head` is not idempotent and reformats every page on each run

- **Classification:** Maintenance risk
- **Affected area:** Metadata generation tooling
- **Evidence:** `tools/html/build-head.mjs:56-65` (`indentBlock`), `:67-79` (`extractHeadExtras`), `:98-103`
- **Current behavior:** `indentBlock` computes the minimum indentation across the retained block's lines, but the block's first line (`<script type="application/ld+json">`) is trimmed to zero indentation, so the minimum is always 0 and the fixed 4-space prefix is added on top of each line's existing indentation. Simulating the script read-only against `404.html`: the first run drops the `<!-- JSON-LD -->` comment and grows the file by 74 bytes, and every subsequent run adds a further 92 bytes as the JSON-LD block is indented four more spaces. All 15 pages change on the first run.
- **Impact:** The documented workflow for updating page metadata — "update `pages.meta.json` and regenerate through `npm run build:head`" — produces a 15-file diff dominated by whitespace regardless of what changed, and indentation grows without bound across runs. The metadata itself stays correct, but the noise makes real metadata changes hard to review and discourages using the generator that owns the contract.
- **Recommended direction:** Make the retained-block re-indentation idempotent — normalize the block's own indentation before applying the target prefix rather than adding to it — and preserve or deliberately drop the section comment, so a run with no metadata change produces no diff.
- **Verification criteria:** Running `npm run build:head` twice in a row against unchanged `pages.meta.json` leaves all 15 pages byte-identical after the first run.

### [P2-02] `X-Robots-Tag: all` contradicts the `noindex` policy the utility pages declare

- **Classification:** Contract mismatch
- **Affected area:** Deployment headers, indexing policy
- **Evidence:** `_headers:1-2` (`/*` → `X-Robots-Tag: all`); `404.html:11`, `offline.html:11`, `success.html:11` (`noindex, follow`); confirmed on the live deployment, where `/404.html` is served with `X-Robots-Tag: all`
- **Current behavior:** The `/*` rule applies `X-Robots-Tag: all` to every response, including the three utility pages that deliberately declare `noindex, follow` in their `<head>`. The repository set that page-level policy on purpose and recorded it in `docs/CHANGELOG.md`; the header was not updated to match. Google resolves conflicting robots directives in favour of the more restrictive one, so `noindex` is expected to win there, but the site now states both policies for the same URLs and other crawlers are not guaranteed to resolve the conflict the same way.
- **Impact:** The indexing policy for the utility pages depends on each crawler's conflict-resolution rule rather than on a single declared intent, and a future reader of `_headers` is told the opposite of what `pages.meta.json` declares.
- **Recommended direction:** Make the header layer agree with the page layer — either narrow `X-Robots-Tag` so it does not cover the utility routes, or drop the blanket header and let the per-page `<meta name="robots">` remain the single declaration of indexing policy.
- **Verification criteria:** No response carries an `X-Robots-Tag` value that contradicts the `robots` meta of the page it serves.

### [P2-03] The dark-theme hover token uses `color-mix()` with a single colour

- **Classification:** Source-visible risk
- **Affected area:** Design tokens, dark theme
- **Evidence:** `css/tokens/tokens.css:123` (`--feature-hover-bg: color-mix(in srgb, var(--surface-2) 94%)`), against `:38` for the light-theme equivalent; consumed at `css/components/utilities.css:207`, `:218`, `:229` and `css/sections/faq.css:91`, `:112`
- **Current behavior:** The CSS Color grammar for `color-mix()` requires exactly two colour arguments; the dark-theme declaration supplies one. Measured in a Chromium-based browser, the value is accepted and resolves to a colour identical to `--surface-2`, so hovering a feature card, an about-list item or a FAQ entry in dark theme produces no background change at all — only the border and shadow respond. The light-theme token at line 38 is well formed and does shift the background.
- **Impact:** The dark-theme hover state is already incomplete where it is accepted, and in an engine that treats the declaration as invalid the `background: var(--feature-hover-bg)` rule fails at computed-value time and the hovered card loses its background entirely rather than changing it. The behavior therefore depends on engine leniency for a construction the specification does not define.
- **Recommended direction:** Give the dark-theme token a well-formed two-colour mix expressing the intended hover shift, matching the shape the light theme already uses.
- **Verification criteria:** `--feature-hover-bg` resolves to a colour distinguishable from `--surface-2` under `[data-theme="dark"]`, and the hover background of a feature card, an about-list item and a FAQ entry visibly changes in both themes.

### [P2-04] One rule keys off the system colour scheme in a theme system driven by `data-theme`

- **Classification:** Defect
- **Affected area:** Theming, primary navigation
- **Evidence:** `css/components/utilities.css:17-21`, against `css/tokens/tokens.css:101` (`:root[data-theme="dark"]`) and `js/theme-init.js:4-9`
- **Current behavior:** Theming is driven end to end by the `data-theme` attribute, which `js/theme-init.js` sets before first paint from the stored choice or the system preference, and which the toggle then owns. A single `@media (prefers-color-scheme: dark)` block overrides the current-page navigation link colour to `--accent-400`. It is the only system-preference-keyed rule in the entire stylesheet.
- **Impact:** A visitor whose system is dark but who switches the site to light gets the dark-theme accent colour on the active navigation link while every other element follows the chosen theme — the user's explicit choice is ignored for that one element, in both directions.
- **Recommended direction:** Express the rule through the `[data-theme="dark"]` selector the rest of the stylesheet uses, so a single mechanism decides the active theme.
- **Verification criteria:** With the system preference set to dark and the site toggled to light, the current-page navigation link uses the light-theme colour; the dark-theme colour still applies when the site is in dark theme.

### [P2-05] A self-hosted font family is shipped but never used

- **Classification:** Maintenance risk
- **Affected area:** Assets, deployment payload, attribution documentation
- **Evidence:** `assets/fonts/poppins-v24-latin/poppins-v24-latin-regular.woff2`; `css/tokens/tokens.css:126-153` declares `@font-face` for Montserrat and Lato only; no `font-family` declaration in `css/` names Poppins; `THIRD-PARTY-NOTICES.md:66-78`; `README.md:274` and `:547`
- **Current behavior:** Poppins is stored with its OFL text, indexed in `THIRD-PARTY-NOTICES.md` alongside Lato and Montserrat, and named in both attribution sections of `README.md` as a font self-hosted by the project. No `@font-face` declares it and no rule requests it. `build:dist` copies `assets/` wholesale, so the binary reaches the deployment, and the `/assets/fonts/*` rule gives it one-year `immutable` caching.
- **Impact:** An unused binary is shipped on every deploy, and the attribution records present a three-family type system where the implementation uses two — a reader adding a heading style will reasonably assume Poppins is available.
- **Recommended direction:** Decide whether Poppins belongs in the type system: either declare and use it, or remove the family directory together with its entry in `THIRD-PARTY-NOTICES.md` and the attribution sentences in `README.md`.
- **Verification criteria:** Every font family stored under `assets/fonts/` is declared by an `@font-face` rule and requested by at least one `font-family` declaration, and the attribution records list exactly those families.

### [P2-06] `README.md` points at archive files that do not exist

- **Classification:** Documentation mismatch
- **Affected area:** Project documentation
- **Evidence:** `README.md:100` and `:373` (`daily-AUDIT.md` in the structure tree), `:102` and `:375` (`PLAN.md`), `:265` and `:538` (the PL and EN Roadmap sections pointing readers at `docs/archive/plans/PLAN.md`); actual files `docs/archive/audits/daily-AUDIT-2026-09-02.md` and `docs/archive/plans/PLAN-2026-09-02.md`
- **Current behavior:** Commit `1605fc7` added the date suffix to both archived documents; `README.md` still names the unsuffixed paths in the project-structure tree and, more consequentially, in both Roadmap sections, which direct a reader to `docs/archive/plans/PLAN.md` for the project's optional improvements. Markdown links are outside the scope of `qa:references`, which resolves references declared by HTML, CSS and the manifest, so nothing catches this.
- **Impact:** The single documented route to the project's open improvement list leads to a path that does not exist. Both language versions are affected.
- **Recommended direction:** Update the two structure trees and the two Roadmap pointers to the current filenames, or adopt a stable unsuffixed name for the archived documents so the references stay valid across archiving.
- **Verification criteria:** Every repository path named in `README.md` resolves to an existing file.

### [P2-07] Runtime code paths remain for controls and services the project does not have

- **Classification:** Maintenance risk
- **Affected area:** JavaScript configuration and components
- **Evidence:** `js/core/config.js:4` (`themeToggleMobile: "#themeToggleMobile"`) with the branch it feeds at `js/components/theme.js:8`, `:27-30`, `:45`; `js/components/forms.js:193-200` (`gtag` / `fbq` calls) with the globals declared for them at `eslint.config.mjs` in the `js/**/*.js` block
- **Current behavior:** `SELECTORS.themeToggleMobile` matches no element in any of the 15 pages — no page contains `#themeToggleMobile` — yet `js/components/theme.js` carries a parallel `btnMobile` branch through lookup, ARIA synchronization and event binding. `js/components/forms.js` calls Google Analytics and Meta Pixel after a successful non-local submission behind `typeof` guards; neither script is loaded by any page, and the CSP in `_headers` restricts `script-src` to `'self'` plus the reCAPTCHA hosts, so neither could load. Both paths are correctly guarded and neither can fail at runtime. `docs/CHANGELOG.md` records a dead-code removal pass that covered `_redirects`, `postcss.config.json` and `js/sections/faq.js` but did not reach these.
- **Impact:** A maintainer reading `config.js` or `theme.js` will reasonably conclude a second, mobile theme toggle exists and look for the markup, and the analytics branches suggest a measurement setup the project neither ships nor permits. This is the same incomplete cleanup that leaves `js/offline.js` orphaned, reported separately at [P1-03] because there it disables a real control.
- **Recommended direction:** Remove the selector and the `btnMobile` branch, or add the mobile toggle the configuration describes; remove the analytics calls and their ESLint global declarations, or introduce them together with a real, CSP-permitted measurement setup.
- **Verification criteria:** Every selector in `js/core/config.js` matches an element in at least one page, and no runtime module calls a global the project neither loads nor permits.

## 7. Extra quality improvements

### Narrow what the production build copies into `dist/`

- **Relevant area:** `tools/release/build-dist.mjs:26` — `dirsToCopy` includes `js` and `css`.
- **Current evidence:** The release copies the complete unbundled `css/` and `js/` source trees into the deployment even though production pages load only the two content-addressed bundles plus `js/theme-init.js`. The `_headers` file already acknowledges this by giving `/css/*` and `/js/*` their own finite revalidated policy. The current CSS layers total 2869 lines and the module graph 18 files, all shipped a second time in unminified form.
- **Potential value:** A smaller deployment and one fewer way for a stale unbundled source to be served, without changing the bundle contract that `bundle-names.mjs` already owns.
- **Scope boundary:** Optional. Nothing is currently broken by the extra copy; `js/theme-init.js` and any asset a page genuinely references would need to keep its path.

### Precache `js/theme-init.js` in the production service-worker profile

- **Relevant area:** `tools/sw/build-sw.mjs:20-24` — `BASE_PRECACHE`.
- **Current evidence:** The local profile precaches `/js/theme-init.js` (line 36); the production profile does not, although every production page loads it directly from `<head>` and `_headers` documents that fact. Offline, that request has no cached response, so the page renders on the `data-theme="light"` value hardcoded in the markup.
- **Potential value:** A visitor who chose the dark theme keeps it on an offline navigation instead of getting a flash to light, at the cost of one small file in the precache.
- **Scope boundary:** Optional and small. The offline fallback already works; only the pre-paint theme is affected.

### Extend the focused test suite to the remaining focus-managing components

- **Relevant area:** `tests/` — `contact-form.test.js` and `lightbox.test.js`, 20 tests.
- **Current evidence:** The two most complex interactive modules are covered, and writing the lightbox focus-trap test already surfaced a real defect in the control creation order (recorded in `docs/CHANGELOG.md`). The mobile navigation (`js/components/navigation.js`) and the consent modal (`js/components/cookies.js`) implement comparable behavior — focus capture, focus return, Escape handling, scroll locking, `aria-expanded` synchronization — with no automated coverage.
- **Potential value:** The same class of regression the lightbox test caught would be caught in the two components that gate access to the rest of every page.
- **Scope boundary:** Optional. The existing jsdom setup and `npm test` command need no change, and no new dependency is implied.

## 8. Current readiness conclusion

**Status:** Needs important fixes

No blocker prevents the project from being built, deployed or used: the release pipeline is coherent, the reference contract holds, and the pages render and behave correctly in a normal browser session. Four P1 findings should be resolved before the project is presented as finished work or handed to someone else. Three of them are public-facing — a canonical origin pointing at a host that does not exist, a careers form that accepts a CV and a consent tick and does nothing with them, and an offline page whose recovery button is inert — and the fourth is a gap in the non-JavaScript baseline the project otherwise maintains deliberately. All four are contained corrections in metadata, markup and one CSS selector; none requires an architectural change, and the build, service-worker and validation contracts are unaffected by them.

Readiness here means readiness within the scope this repository actually declares. It is not a statement about WCAG conformance, security, legal compliance, browser support or measured performance — none of which was established, and several of which the project's own documentation correctly declines to claim.

## 9. Senior rating

**Rating:** 7/10

The delivery layer is the strongest part of the project and would stand up in a professional codebase: a single owner for production bundle names, a validated build manifest driving the HTML rewrite, the service worker and the generated cache headers, deterministic bundle output, explicit generated-file ownership that this audit independently confirmed byte for byte, and a static contract check that runs without a server, a browser or a build — and passed. The application layer is defensive and accessible in its fundamentals across all 15 pages, there are no runtime dependencies, no secrets, and the documentation is unusually honest about what has and has not been verified.

The rating is held back by the public-facing contract, which has not kept pace with the engineering behind it. Every canonical, social and sitemap URL on a live indexable site names a host that does not resolve; a form soliciting a CV and a data-processing consent has no destination; the offline page's recovery control does nothing; and the majority of the homepage disappears if the bundle does not load, on a project that elsewhere guards its non-JavaScript baseline on purpose. These are correctable without touching the architecture, and none is a design flaw — but they are exactly the defects a visitor or a reviewer encounters first, and they carry more weight on a project whose stated purpose is public presentation. Resolving the four P1 findings and confirming a deployment whose metadata describes itself would put this project at 8–9 within its scope.
