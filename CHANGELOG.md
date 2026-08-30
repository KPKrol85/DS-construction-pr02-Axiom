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

### Testing

- Added Lighthouse and pa11y QA runners (`npm run qa`) covering the home page, one service subpage, and one legal subpage, writing reports to `reports/`.

### Security

- Added static-hosting security headers in `_headers`, including a Content Security Policy, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Cross-Origin-Resource-Policy`, and a restrictive `Permissions-Policy`.

### Documentation

- Added a bilingual (PL/EN) `README.md` documenting the technology stack, project structure, build pipeline, and deployment contract.
- Added `settings.md` documenting every `package.json` script with its command, purpose, and intended usage moment.
- Added the MIT `LICENSE` file for the project.
