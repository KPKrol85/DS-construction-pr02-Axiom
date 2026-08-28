# Axiom

## PL

### Przegląd projektu
Axiom to statyczny serwis WWW (multi-page) dla firmy budowlano-remontowej, zbudowany w oparciu o HTML, CSS i Vanilla JavaScript. Repozytorium zawiera stronę główną, podstrony usług, podstrony prawne, stronę sukcesu formularza, stronę offline oraz stronę błędu 404.

### Kluczowe funkcje
- Struktura wielostronicowa: strona główna, 6 podstron usług oraz sekcja dokumentów prawnych.
- Interaktywne komponenty frontendowe: mobilna nawigacja, przełącznik motywu, przycisk „powrót na górę”, lightbox galerii, sekcja FAQ.
- Formularz kontaktowy z walidacją po stronie klienta, honeypotem i integracją z Netlify Forms (`data-netlify`, `data-netlify-recaptcha`, strona `success.html`).
- Baner cookies z zapisem zgody w `localStorage` oraz ciasteczku.
- PWA surface: `manifest.webmanifest`, rejestracja Service Workera i obsługa strony offline.
- Pipeline QA: skrypty Lighthouse i pa11y zapisujące raporty do katalogu `reports/`.

### Stack technologiczny
**Runtime (frontend)**
- HTML5
- CSS3 (modułowa organizacja przez `@import`)
- Vanilla JavaScript (ES Modules)

**Build i narzędzia**
- Node.js + npm scripts
- `cssnano` / `cssnano-cli` (minifikacja CSS)
- `terser` (minifikacja JavaScript)
- `sharp` (przetwarzanie obrazów)
- `@lhci/cli`, `lighthouse` (audyty Lighthouse)
- `pa11y` (audyty dostępności)
- `http-server` (lokalny serwer)

### Struktura projektu
```text
.
├── index.html
├── services/                  # podstrony usług
├── legal/                     # podstrony dokumentów prawnych i certyfikatów
├── css/                       # warstwy stylów: tokens/base/layout/components/sections
├── js/                        # core, components, sections, utils, structured-data
├── assets/                    # fonty, obrazy, favicony, certyfikaty
├── tools/
│   ├── css/                   # build CSS
│   ├── js/                    # build JS
│   ├── sw/                    # build Service Workera
│   ├── html/                  # generowanie/aktualizacja sekcji <head>
│   ├── images/                # pipeline obrazów
│   ├── qa/                    # Lighthouse + pa11y
│   └── release/               # clean dist + składanie artefaktów produkcyjnych
├── manifest.webmanifest
├── sw.template.js
├── robots.txt
├── sitemap.xml
├── _headers
├── _redirects
└── package.json
```

### Instalacja i konfiguracja
```bash
npm install
```

### Development lokalny
Uruchomienie lokalnego serwera dla katalogu roboczego:
```bash
npm run serve
```
Aplikacja będzie dostępna pod adresem `http://localhost:8080`.

### Build produkcyjny
Pełny build produkcyjny (`dist/`):
```bash
npm run build
```
Podgląd artefaktów produkcyjnych:
```bash
npm run serve:dist
```

### Deployment
Repozytorium zawiera artefakty i konfigurację zgodną z hostingiem statycznym Netlify:
- `_headers` (nagłówki bezpieczeństwa, CSP, cache policy)
- `_redirects` (reguły redirect)
- formularz oparty o Netlify Forms (`data-netlify`, `data-netlify-recaptcha`)

### Dostępność
W kodzie zaimplementowano m.in.:
- skip link do głównej treści,
- atrybuty ARIA w kluczowych komponentach (nawigacja, lightbox, modal cookies, formularze),
- focus management i trap focus (lightbox, modal cookies),
- walidację formularza z komunikatami błędów i podsumowaniem błędów,
- automatyczne audyty dostępności przez pa11y.

### SEO
Zaimplementowane elementy SEO obejmują:
- `canonical`, `meta description`, `robots` na stronach,
- metadane Open Graph i Twitter,
- dane strukturalne JSON-LD (`LocalBusiness`, `Service`, `FAQPage`, `WebSite` i inne pliki w `js/structured-data/`),
- `robots.txt` i `sitemap.xml`,
- skrypt `tools/html/build-head.mjs` do spójnej aktualizacji sekcji `<head>`.

### Wydajność
W repozytorium widoczne są konkretne mechanizmy wydajnościowe:
- minifikacja CSS i JS do `dist/style.min.css` oraz `dist/script.min.js`,
- optymalizacja obrazów przez pipeline oparty o `sharp`,
- Service Worker z precache i cache strategy dla dokumentów, stylów, skryptów i obrazów,
- atrybuty `loading="lazy"`, `decoding="async"` i `fetchpriority` dla obrazów,
- preloading kluczowych fontów i arkusza stylów.

### Utrzymanie projektu
- Główny punkt wejścia JavaScript: `js/main.js` oraz orchestracja inicjalizacji w `js/core/init.js`.
- Konfiguracja selektorów i parametrów wspólnych: `js/core/config.js`.
- Stylowanie warstwowe: `css/main.css` agreguje moduły z `css/tokens`, `css/base`, `css/layout`, `css/components`, `css/sections`.
- Aktualizacja metadanych stron: `tools/templates/pages.meta.json` + `tools/html/build-head.mjs`.
- Release pipeline: `build:clean` → `build:css` → `build:js` → `build:sw` → `build:dist`.

### Roadmap
- Rozszerzenie skryptów QA o automatyczne uruchamianie serwera testowego przed audytami.
- Dodanie testów jednostkowych dla modułów JS o najwyższej złożoności (np. formularz i lightbox).
- Ujednolicenie źródeł JSON-LD (aktualnie część jest inline w HTML, część w `js/structured-data/`).
- Dodanie automatycznej walidacji linków wewnętrznych dla całej struktury wielostronicowej.

### Licencja
Projekt jest udostępniony na licencji MIT. Szczegóły w pliku `LICENSE`.

## EN

### Project Overview
Axiom is a static multi-page website for a construction and renovation company, built with HTML, CSS, and Vanilla JavaScript. The repository includes a homepage, service pages, legal pages, a form success page, an offline page, and a custom 404 page.

### Key Features
- Multi-page structure: homepage, 6 service pages, and a legal/document section.
- Interactive frontend components: mobile navigation, theme toggle, scroll-to-top button, gallery lightbox, and FAQ section.
- Contact form with client-side validation, honeypot protection, and Netlify Forms integration (`data-netlify`, `data-netlify-recaptcha`, `success.html`).
- Cookie banner with consent persistence in `localStorage` and a browser cookie.
- PWA surface: `manifest.webmanifest`, Service Worker registration, and offline fallback page.
- QA pipeline: Lighthouse and pa11y scripts that write reports to `reports/`.

### Tech Stack
**Runtime (frontend)**
- HTML5
- CSS3 (modular structure via `@import`)
- Vanilla JavaScript (ES Modules)

**Build and tooling**
- Node.js + npm scripts
- `cssnano` / `cssnano-cli` (CSS minification)
- `terser` (JavaScript minification)
- `sharp` (image processing)
- `@lhci/cli`, `lighthouse` (Lighthouse audits)
- `pa11y` (accessibility audits)
- `http-server` (local server)

### Project Structure
```text
.
├── index.html
├── services/                  # service subpages
├── legal/                     # legal and certification pages
├── css/                       # style layers: tokens/base/layout/components/sections
├── js/                        # core, components, sections, utils, structured-data
├── assets/                    # fonts, images, favicons, certificates
├── tools/
│   ├── css/                   # CSS build
│   ├── js/                    # JS build
│   ├── sw/                    # Service Worker build
│   ├── html/                  # <head> generation/update tooling
│   ├── images/                # image pipeline
│   ├── qa/                    # Lighthouse + pa11y
│   └── release/               # dist cleanup + production assembly
├── manifest.webmanifest
├── sw.template.js
├── robots.txt
├── sitemap.xml
├── _headers
├── _redirects
└── package.json
```

### Setup and Installation
```bash
npm install
```

### Local Development
Run a local server for the working directory:
```bash
npm run serve
```
The site is available at `http://localhost:8080`.

### Production Build
Run the full production build (`dist/`):
```bash
npm run build
```
Preview production artifacts:
```bash
npm run serve:dist
```

### Deployment
The repository includes assets and configuration aligned with Netlify static hosting:
- `_headers` (security headers, CSP, cache policy)
- `_redirects` (redirect rules)
- Netlify Forms markup (`data-netlify`, `data-netlify-recaptcha`)

### Accessibility
The implementation includes, among others:
- skip link to main content,
- ARIA attributes in key components (navigation, lightbox, cookie modal, forms),
- focus management and focus trap (lightbox, cookie modal),
- form validation with error status and error summary,
- automated accessibility checks via pa11y.

### SEO
Implemented SEO elements include:
- page-level `canonical`, `meta description`, and `robots`,
- Open Graph and Twitter metadata,
- JSON-LD structured data (`LocalBusiness`, `Service`, `FAQPage`, `WebSite`, and additional files in `js/structured-data/`),
- `robots.txt` and `sitemap.xml`,
- `tools/html/build-head.mjs` for consistent `<head>` updates.

### Performance
The repository contains explicit performance mechanisms:
- CSS and JS minification to `dist/style.min.css` and `dist/script.min.js`,
- image optimization pipeline based on `sharp`,
- Service Worker precache and runtime cache strategy for documents, styles, scripts, and images,
- `loading="lazy"`, `decoding="async"`, and `fetchpriority` attributes on images,
- preload of key fonts and stylesheet.

### Project Maintenance
- Main JavaScript entry point: `js/main.js` with init orchestration in `js/core/init.js`.
- Shared selectors and runtime settings: `js/core/config.js`.
- Layered styling: `css/main.css` aggregates modules from `css/tokens`, `css/base`, `css/layout`, `css/components`, and `css/sections`.
- Page metadata maintenance: `tools/templates/pages.meta.json` + `tools/html/build-head.mjs`.
- Release pipeline: `build:clean` → `build:css` → `build:js` → `build:sw` → `build:dist`.

### Roadmap
- Extend QA scripts to auto-start a test server before audits.
- Add unit tests for higher-complexity JS modules (e.g., contact form and lightbox).
- Consolidate JSON-LD sources (currently split between inline HTML and `js/structured-data/`).
- Add automated internal link validation across the multi-page structure.

### License
This project is licensed under the MIT License. See `LICENSE` for details.
