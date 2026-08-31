# Changelog

All significant changes to this project are documented in this file.

Recorded history begins with the initial standalone repository import; the entries below describe the implementation verified in the current project state.

## [Unreleased]

### Added

- Added the initial Axiom construction website implementation: home page, six service subpages, five legal subpages, a form success page, an offline page, and a custom 404 page.
- Added interactive front-end components: mobile navigation with synchronized `aria-expanded` state, theme toggle, compact header on scroll, back-to-top button, gallery lightbox with focus trap, and a cookie consent modal.
- Added a contact form with client-side validation, an accessible error summary, a message character counter, a honeypot field, and Netlify Forms with reCAPTCHA submission routed to `success.html`.
- Added flash-free theme initialization in `js/theme-init.js`, applying the stored theme or the `prefers-color-scheme` preference before first paint.
- Added a service worker with a versioned precache, network-first document handling, stale-while-revalidate for styles and scripts, cache-first images, and an `offline.html` fallback.
- Added PWA installability metadata in `manifest.webmanifest`, including maskable icons, application shortcuts, and store screenshots.
- Added SEO metadata across all pages: canonical URLs, Open Graph and Twitter tags, JSON-LD structured data, `robots.txt`, and a `sitemap.xml` covering twelve public URLs.
- Added a layered CSS architecture aggregated by `css/main.css` (`tokens`, `base`, `layout`, `components`, `sections`) with `prefers-reduced-motion` handling in animated sections.
- Added guarded `localStorage` access in `js/utils/storage.js` so theme and cookie-consent state degrade silently when browser storage is unavailable.

### Build and Tooling

- Added a Node-based release pipeline (`build:clean` → `build:css` → `build:js` → `build:sw` → `build:dist`) producing `dist/style.min.css`, `dist/script.min.js`, a generated `dist/sw.js`, and the copied static deployment tree.
- Added service worker generation from `sw.template.js` with a precache revision hashed from the built stylesheet, the built script, and `manifest.webmanifest`.
- Added a `sharp`-based responsive image pipeline generating WebP and AVIF variants at fixed widths (`npm run img:build`, `npm run img:clean`).
- Added `tools/html/build-head.mjs` with `tools/templates/head.partial.html` and `tools/templates/pages.meta.json` as the single source for per-page `<head>` metadata.
- Added local preview servers for the working tree and for production output (`npm run serve`, `npm run serve:dist`).
- Added ESLint flat configuration (`eslint.config.mjs`) covering the browser ES Modules in `js/`, the Node `.mjs` tooling in `tools/`, and the `sw.template.js` service worker source, each linted in its own execution environment.
- Added `npm run lint` for the canonical JavaScript sources, with generated and minified output (`dist/`, the generated `sw.js`, `*.min.js`) excluded from linting.
- Removed redundant escape characters from template literals in `tools/js/build-js.mjs`, the only source correction required by the lint baseline.
- Added `/reports/` to the root `.gitignore`, completing the ignore contract that keeps the dependency directory, the generated `dist/` output, and the QA report output outside the committable working tree.
- Aligned the `_headers` cache policy with the paths the build actually produces: the production bundles `style.min.css` and `script.min.js` now carry explicit finite, revalidated cache rules instead of inheriting the global fallback; the unversioned CSS and JavaScript sources copied into `dist/` no longer receive one-year `immutable` caching, including `js/theme-init.js`, which production pages load directly; fixed-name images and `manifest.webmanifest` keep finite browser caching without `immutable`; the version-segmented self-hosted font paths retain long-lived `immutable` caching; and the stale `/assets/icons/*` rule, which matches no directory in the built output, was removed.
- Reduced the shipped image set to the files production actually requests: `tools/images/build-images.mjs` now derives its output from the widths and formats the page `srcset` declarations consume, instead of applying a fixed width ladder and both formats to every source, and it fails the run when a declared source stops producing output; the unreferenced source images, including the `-dup` duplicates and the unused `instalacja-elektryczna-01-*` set, and the stale `assets/img/_optimized/` variants that no page requests were removed, taking `assets/img/` from 1547 to 543 files (157.0 MiB to 110.6 MiB) and `assets/img/_optimized/` from 1072 to 164 files; `dist/assets/img/` now contains no file that a page, `manifest.webmanifest`, or the production precache contract does not request, and `npm run qa:references` and the production build both pass after the cleanup.
- Gave the root service worker a declared owner: `sw.template.js` is now the single canonical, hand-edited service-worker source, and `tools/sw/build-sw.mjs` renders it through one substitution step to generate both the root `sw.js` and the production `dist/sw.js`, so no service worker in the repository can drift from the template without the build producing it; the generator declares two explicit precache profiles — a local profile covering the assets the repository root actually serves (`/css/main.css`, `/js/main.js`, `/js/theme-init.js`) and the production profile keeping the built bundles (`/style.min.css`, `/script.min.js`), both sharing `/`, `/offline.html`, `/manifest.webmanifest`, and the manifest-derived icons, each with its cache revision hashed from the assets that profile precaches, and each generated file carrying a header naming its source, generator, and profile; the local service worker now installs and activates under the root development server (`npm run serve`) instead of failing its precache install, production continues to precache the production bundles from `dist/`, and `npm run build` and `npm run qa:references` both pass after the change.

### Testing

- Added Lighthouse and pa11y QA runners (`npm run qa`) covering the home page, one service subpage, and one legal subpage, writing reports to `reports/`.
- Added `npm run qa:references`, a static reference-integrity check (`tools/qa/check-references.mjs`) that resolves the local references declared by the HTML pages, `css/**/*.css`, `manifest.webmanifest`, and the canonical production precache inputs owned by `tools/sw/build-sw.mjs`, reading only the tracked sources so it needs no local server and no browser; external, `mailto:`, `tel:`, `data:`, and same-document fragment references are ignored, unresolved references are reported with the source file that declares them and exit the run non-zero, and the precached generated bundle URLs (`/style.min.css`, `/script.min.js`) are validated against the build scripts that declare those outputs rather than against build output that exists only after `npm run build`.

### Security

- Added static-hosting security headers in `_headers`, including a Content Security Policy, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Cross-Origin-Resource-Policy`, and a restrictive `Permissions-Policy`.

### Documentation

- Added a bilingual (PL/EN) `README.md` documenting the technology stack, project structure, build pipeline, and deployment contract.
- Added `settings.md` documenting every `package.json` script with its command, purpose, and intended usage moment.
- Added the KP_Code proprietary project license (`LICENSE`, version 1.0) as the project-level license, with third-party materials documented as excluded from the proprietary grant.
