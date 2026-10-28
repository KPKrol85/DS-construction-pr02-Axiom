# Axiom — Technical Improvements

**Analysis date:** 2026-10-26
**Project type:** Static multi-page website (vanilla HTML, CSS and ES modules, no runtime dependencies) with a custom Node build and release pipeline, a template-generated service worker and Netlify-format static-hosting configuration
**Analysis mode:** Evidence-based technical improvement review
**Focus:** Project-wide technical implementation

## Improvement overview

The implementation is coherent and deliberately owned. `js/main.js` initialises every component through one ordered `initApp()`, entry selectors and thresholds live in `js/core/config.js`, browser storage goes through guarded wrappers, and the release layer has single owners: `tools/release/bundle-names.mjs` for bundle names, `sw.template.js` for both service workers and `tools/templates/` for every `<head>`. The current source reference check passes.

The remaining opportunities are local duplications inside otherwise sound structures: the reference checker reads the service-worker precache declaration by parsing builder source text, two JavaScript components restate state or focus logic that already has one natural owner, and page metadata is repeated across redundant `pages.meta.json` fields and a hand-maintained `sitemap.xml`. None of the proposals changes public behaviour, routes, dependencies or the build sequence.

## Proposed improvements

### IMP-TECH-01 — Share precache declarations with the reference checker through a side-effect-free module

- **Status:** COMPLETED — implemented and verified.
- **Result:** `BASE_PRECACHE`, `LOCAL_PRECACHE` and the manifest-icon URL rule (`manifestIconUrls`) moved unchanged into the side-effect-free `tools/sw/precache.mjs`, imported by `build-sw.mjs`, which keeps its icon file-existence filter, and by `check-references.mjs`, which no longer parses builder source and labels precache findings with the new module. The hashed-name and obsolete-URL literal checks now also cover the declaration module, without the bundle-consumer import requirement; profiles, revision inputs, CLI arguments and exit codes are unchanged.
- **Verification:** On the same tree, `npm run build:sw:local` produced a `sw.js` byte-identical to the pre-change generator output, and `npm run build` produced a `dist/sw.js` (and all 584 `dist/` files) identical to the pre-change build. `qa:references` passed in `source` scope (11 precache entries) and `release` scope with output unchanged from the pre-change run. Isolated fixtures confirmed exit code 1 for an unresolved precache entry and for a missing declared icon, which the generator still skips; `npm run lint` and `git diff --check` passed.
- **Impact:** Medium
- **Effort:** Small

### IMP-TECH-02 — Apply navigation menu state through one state function

- **Status:** COMPLETED — implemented and verified.
- **Result:** A private `applyMenuState()` inside `initNavigation` now applies the complete `desktop`, `collapsed` and `open` state (classes, `aria-expanded`, the Polish `aria-label`, `inert`, `aria-hidden`, the `nav-open` body class and the outside-pointer listener), replacing the `lock`/`unlock` helpers and declaring each menu label once. `applyDesktopState`, `applyMobileCollapsed`, `closeMenu` and `openMenu` delegate to it; position sync, trigger tracking, focus movement and focus return with `preventScroll` stay in `openMenu`/`closeMenu`, with all attribute values unchanged.
- **Verification:** `tests/navigation.test.js` passed unmodified (29/29) before and after the change, and `npm run lint` and `git diff --check` passed. Dependencies resolved from the main checkout's `node_modules`; no manual browser check or full `npm test` run was performed.
- **Impact:** Medium
- **Effort:** Small

### IMP-TECH-03 — Use the shared focus utilities in the project-information modal

- **Status:** COMPLETED — implemented and verified.
- **Result:** `cookies.js` now recomputes the modal's focusable elements on each Tab keydown with the shared `getFocusableElements()` and delegates wrapping to `handleFocusTrap()`, the same utilities the lightbox imports; its own selector and first/last wrapping logic are removed. Blocked Escape, the local Tab prevention when no control is focusable, initial focus, scroll locking, consent persistence and focus return stay in the component; `js/utils/a11y.js` and the markup are unchanged.
- **Verification:** `tests/cookies.test.js` adopts the `offsetParent` layout emulation from `tests/lightbox.test.js` (restored after the suite) and adds an empty-focusable-list Tab regression test, which also passes against the original implementation; no existing assertion was changed. The cookie and lightbox suites passed (25/25), as did the full `npm test` run (136/136), `npm run lint` and `git diff --check`; no manual browser check was performed.
- **Impact:** Medium
- **Effort:** Small

### IMP-TECH-04 — Derive Open Graph and robots defaults instead of repeating them in page metadata

- **Status:** COMPLETED — implemented and verified.
- **Result:** `pages.meta.json` no longer declares `og_url` and keeps only values that differ from the generator's fallbacks: 51 redundant declarations were removed (15 `og_url`, 10 `og_title`, 14 `og_description`, 11 default `robots`, 1 `twitter_image_alt`), while 5 `og_title`, 1 `og_description`, 4 `noindex`, 4 `twitter_title`, 1 `twitter_description` and 8 `twitter_image_alt` overrides remain. `build-head.mjs` renders `og:url` from `canonical` through the existing `siteOrigin` resolution and drops the obsolete equality check; `head.partial.html`, fallbacks, escaping, required-field validation and the preview and apply modes are unchanged.
- **Verification:** `npm run build:head -- --preview` reported 0 changed and 15 unchanged pages before and after the change, and in isolated fixture copies the generated `<head>` and full HTML of all 15 pages were byte-identical to the pre-change output, including a forced re-render from stripped heads. Fixtures missing `title`, `description`, `canonical` or `og_image_alt` failed with exit code 1 before any of 15 stale pages was written; `npm run qa:references`, `npm test` (136/136), `npm run lint` and `git diff --check` passed. Dependencies resolved from the main checkout's `node_modules`; maintained HTML was not rewritten and no `dist/` build was run.
- **Impact:** Medium
- **Effort:** Small

### IMP-TECH-05 — Generate sitemap.xml from the page metadata

- **Affected area:** Indexable-page inventory and public origin (`sitemap.xml`, `tools/templates/pages.meta.json`, `tools/html/build-head.mjs`).
- **Evidence:** `sitemap.xml:1-74`; `tools/templates/pages.meta.json` (`canonical` and `robots` of all 15 entries); `tools/html/build-head.mjs:11-13`; `tools/html/build-head.mjs:64-66`; `tools/release/build-dist.mjs:26`; commits `29e83b3`, `cd78454` and `50fe1f0`.
- **Current implementation:** `sitemap.xml` is maintained by hand. Its 11 URLs are exactly the canonical paths of the 11 `pages.meta.json` entries with an indexable `robots` value, written with the origin that `build-head.mjs` also declares. Setting a page to `noindex` (`29e83b3`) and both origin migrations (`cd78454`, `50fe1f0`) each required a separate manual `sitemap.xml` edit alongside the metadata or generator change.
- **Proposed improvement:** Render `sitemap.xml` from `pages.meta.json` and the generator's existing `siteOrigin`, including only indexable pages, with each page's `lastmod`, `changefreq` and `priority` values held in its metadata entry.
- **Expected engineering value:** Indexing policy, canonical paths and the public origin determine the sitemap from one source, so a `noindex` change or an origin migration can no longer leave the sitemap inconsistent with the generated page heads.
- **Implementation scope:** The existing metadata generator and `pages.meta.json`; `sitemap.xml` becomes a generated, committed file maintained through the same preview and apply workflow, documented in `docs/settings.md`. Preserve the URL set, the current `lastmod`, `changefreq` and `priority` values, the sitemap namespace, the `sitemap.xml` path copied by `build:dist` and `robots.txt`. URL order may follow the metadata order, because the sitemap protocol assigns it no meaning.
- **Acceptance criteria:** Preview reports whether `sitemap.xml` would change without writing it; the generated file contains exactly the 11 indexable canonical URLs with their current `lastmod`, `changefreq` and `priority` values; setting a page to `noindex` in `pages.meta.json` removes it from the generated sitemap; a repeated apply run leaves `sitemap.xml` unchanged; `npm run qa:references` passes.
- **Impact:** Medium
- **Effort:** Medium

## Selection summary

The five proposals address the places where one technical responsibility is currently expressed more than once: a precache declaration read through source parsing, menu state written in four transitions, two focus-trap implementations, metadata values the generator could derive and a page inventory restated in the sitemap. Each has a source-level owner already present in the repository, so no proposal introduces a new architectural layer or dependency.

IMP-TECH-01, IMP-TECH-02 and IMP-TECH-03 touch separate files and can be implemented independently in any order. IMP-TECH-04 and IMP-TECH-05 both change `tools/html/build-head.mjs` and `tools/templates/pages.meta.json`; implement them sequentially, preferably IMP-TECH-04 first, so the metadata format is settled before sitemap fields are added.

Four proposals are Small and one is Medium, which suits focused development work. Other observations, such as mixed `process.cwd()` and `import.meta.url` root resolution across `tools/`, the repeated frame-throttled scroll handlers and the contact form's hard-coded field selector, were not selected because their current maintenance benefit is smaller.

## Analysis limitations

- The analysis is based on static inspection of canonical sources, configuration and Git history. `node_modules` is absent from this worktree, so `npm test`, `npm run lint`, the builds and browser audits were not run; the acceptance criteria that compare generated output or run tests require installed dependencies.
- The only check executed was `node tools/qa/check-references.mjs --scope=source`, which passed: 1,359 local references across 15 HTML pages, 20 CSS files, `manifest.webmanifest` and 11 precache entries resolved, and the bundle contract held.
- CSS was inspected at the level of tokens, layer imports and media queries; no CSS proposal met the evidence threshold.
- Observations outside this report's scope: `README.md` describes `sitemap.xml` as containing 12 URLs while the file contains 11, and `/` and `/offline.html` are precached but are not revision inputs in either service-worker profile. Neither was assessed as a defect here; both belong to a documentation update or an audit.
