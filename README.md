# Axiom

## PL

### Przegląd projektu

Axiom to statyczny, wielostronicowy serwis WWW firmy budowlano-remontowej, zbudowany w czystym HTML, CSS i JavaScript (ES Modules), bez frameworka i bez zależności runtime. Repozytorium zawiera 15 stron HTML: stronę główną, 6 podstron usług, 5 podstron prawnych oraz strony `success.html`, `offline.html` i `404.html`.

Warstwa buildowa to własne skrypty Node uruchamiane przez npm scripts (minifikacja CSS i JS, generowanie Service Workera, generowanie sekcji `<head>`, pipeline obrazów, audyty QA). Repozytorium zawiera również konfigurację hostingu statycznego.

### Kluczowe funkcje

- 15 stron statycznych: strona główna, 6 podstron usług, 5 podstron prawnych, potwierdzenie formularza, strona offline i strona 404.
- Nawigacja mobilna z synchronizacją `aria-expanded`, blokadą przewijania strony i pozycjonowaniem panelu względem nagłówka.
- Przełącznik motywu jasny/ciemny z zapisem wyboru oraz inicjalizacją motywu przed pierwszym renderem (`js/theme-init.js` na każdej stronie).
- Lightbox galerii z pułapką fokusu, obsługą klawiatury, regionem `aria-live` i powrotem fokusu do elementu wywołującego.
- Formularz kontaktowy: walidacja po stronie klienta (5 pól wymaganych, limit 500 znaków), licznik znaków, podsumowanie błędów ze skrótem do pierwszego błędnego pola, honeypot oraz integracja z Netlify Forms i reCAPTCHA (`data-netlify`, `data-netlify-recaptcha`, przekierowanie na `success.html`).
- Baner cookies w formie modala z pułapką fokusu; zgoda zapisywana w `localStorage` i w ciasteczku.
- Sekcja FAQ oparta na natywnych elementach `<details>` i `<summary>`.
- Kompaktowy nagłówek po przewinięciu oraz przycisk „powrót na górę” wyłączany atrybutem `inert`, gdy jest ukryty.
- Ujawnianie sekcji przez `IntersectionObserver` z fallbackiem dla przeglądarek bez tego API.
- Service Worker z precache, strategiami cache dla dokumentów, stylów, skryptów i obrazów oraz stroną offline.

### Stack technologiczny

**Runtime**

- HTML
- CSS (warstwy łączone przez `@import`, custom properties, `color-mix`)
- Vanilla JavaScript (ES Modules)
- Brak zależności runtime — `package.json` deklaruje wyłącznie `devDependencies`

**Build**

- Node.js + npm scripts (własne skrypty `.mjs` w `tools/`)
- `cssnano` 7.1.1 i `cssnano-cli` 1.0.5 — minifikacja CSS
- `terser` 5.44.1 — minifikacja JavaScript
- `sharp` 0.33.5 — generowanie wariantów obrazów
- `ttf2woff2` 8.0.0 — konwersja fontów

**Podgląd i QA**

- `http-server` 14.1.1 — lokalny serwer HTTP
- `lighthouse` 12.8.2 i `@lhci/cli` 0.15.1 — audyty Lighthouse
- `pa11y` 8.0.0 — automatyczne audyty dostępności

### Architektura

- **CSS** — `css/main.css` agreguje warstwy w kolejności `tokens` → `base` → `layout` → `components` → `sections`. Zmienne motywu i typografia znajdują się w `css/tokens/tokens.css`.
- **JavaScript** — `js/main.js` wywołuje `initApp()` z `js/core/init.js`, które inicjalizuje komponenty w ustalonej kolejności. Wspólne selektory i progi są scentralizowane w `js/core/config.js`, a dostęp do `localStorage` przechodzi przez bezpieczne wrappery w `js/utils/storage.js`.
- **Motyw** — `js/theme-init.js` jest ładowany synchronicznie przed treścią i ustawia `data-theme` na podstawie zapisanego wyboru albo `prefers-color-scheme`.
- **Metadane stron** — sekcje `<head>` są generowane z `tools/templates/head.partial.html` oraz `tools/templates/pages.meta.json`.
- **Źródła kanoniczne a pliki generowane** — źródłami są `css/`, `js/`, pliki HTML, `sw.template.js` i `tools/templates/`. Katalog `dist/`, `assets/img/_optimized/` oraz `sw.js` są wynikiem generowania i nie powinny być edytowane ręcznie.

### Struktura projektu

```text
.
├── index.html                  # strona główna
├── 404.html                    # strona błędu 404
├── offline.html                # fallback offline dla Service Workera
├── success.html                # potwierdzenie wysłania formularza (noindex)
├── services/                   # 6 podstron usług
├── legal/                      # 5 podstron prawnych i certyfikaty
├── css/                        # tokens, base, layout, components, sections
├── js/
│   ├── main.js                 # punkt wejścia (ES Modules)
│   ├── theme-init.js           # inicjalizacja motywu przed renderem
│   ├── core/                   # init, config, rejestracja Service Workera
│   ├── components/             # nawigacja, motyw, lightbox, formularz, cookies
│   ├── sections/               # logika sekcji strony
│   ├── utils/                  # dom, a11y, storage
│   └── structured-data/        # pliki JSON-LD (nieładowane w runtime)
├── assets/                     # fonty, obrazy, favicony, ikony certyfikatów
├── tools/
│   ├── css/                    # build CSS
│   ├── js/                     # build JS
│   ├── sw/                     # generowanie Service Workera
│   ├── html/                   # generowanie sekcji <head>
│   ├── images/                 # pipeline obrazów
│   ├── qa/                     # Lighthouse + pa11y
│   ├── release/                # czyszczenie i składanie dist/
│   └── templates/              # head.partial.html + pages.meta.json
├── sw.template.js              # kanoniczne źródło Service Workera
├── sw.js                       # Service Worker odpowiadający szablonowi
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── _headers
├── _redirects
├── package.json
├── settings.md                 # opis skryptów npm
├── CHANGELOG.md
├── LICENSE
└── README.md
```

### Instalacja

Projekt używa npm (`package-lock.json`, `lockfileVersion` 3). Zależności są potrzebne wyłącznie do buildu, podglądu i audytów — same strony działają bez nich.

```bash
npm install
```

Repozytorium nie deklaruje wymaganej wersji Node.js (brak `engines`, `.nvmrc` i `.node-version`).

### Development lokalny

```bash
npm run serve
```

Serwer `http-server` startuje na `http://localhost:8080` z wyłączonym cache (`-c-1`). Strony należy otwierać przez HTTP — moduły ES i rejestracja Service Workera nie działają przy otwarciu plików z dysku.

### Dostępne skrypty

- `npm run serve` — lokalny serwer katalogu roboczego na porcie 8080.
- `npm run serve:dist` — ten sam serwer dla katalogu `dist/`.
- `npm run build` — pełny build: `build:clean` → `build:css` → `build:js` → `build:sw` → `build:dist`.
- `npm run build:clean` — usuwa i tworzy na nowo katalog `dist/`.
- `npm run build:css` — scala `@import` z `css/main.css` i minifikuje wynik do `dist/style.min.css`.
- `npm run build:js` — rozwiązuje importy modułów od `js/main.js` i minifikuje wynik do `dist/script.min.js`.
- `npm run build:sw` — generuje `dist/sw.js` z `sw.template.js`; rewizja cache jest liczona z zawartości `dist/style.min.css`, `dist/script.min.js` i `manifest.webmanifest`.
- `npm run build:dist` — kopiuje pliki statyczne do `dist/` i przepisuje odwołania w HTML na `style.min.css` oraz `script.min.js`.
- `npm run build:head` — generuje sekcje `<head>` na podstawie `tools/templates/head.partial.html` i `tools/templates/pages.meta.json`.
- `npm run img:build` — generuje warianty WebP i AVIF w `assets/img/_optimized/`; `npm run img:clean` usuwa ten katalog.
- `npm run qa:lighthouse`, `npm run qa:a11y`, `npm run qa` — audyty Lighthouse i pa11y.

### Build produkcyjny

```bash
npm run build
npm run serve:dist
```

Build zapisuje wynik do `dist/`: zminifikowane `style.min.css` i `script.min.js`, wygenerowany `sw.js`, skopiowane `assets/`, `services/`, `legal/`, `js/`, `css/` oraz pliki z katalogu głównego (`index.html`, `404.html`, `offline.html`, `success.html`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`, `LICENSE`). Katalog `dist/` powstaje lokalnie i nie jest przechowywany w repozytorium.

Build nie był uruchamiany w ramach przygotowania tej dokumentacji — powyższy opis pochodzi z konfiguracji skryptów.

### Testy i walidacja

Repozytorium nie zawiera testów jednostkowych ani testów e2e. Dostępne są dwa audyty uruchamiane na działającym serwerze lokalnym:

```bash
npm run serve   # w osobnym terminalu
npm run qa
```

- `qa:lighthouse` uruchamia `lhci collect` dla `http://localhost:8080/`, `/services/budowa-domow.html` i `/legal/regulamin.html`, zapisując wyniki do `reports/lighthouse/`.
- `qa:a11y` uruchamia `pa11y` dla tych samych trzech adresów i zapisuje raporty JSON do `reports/pa11y/`.

Skrypty QA nie uruchamiają serwera samodzielnie. Audyty nie były wykonywane w ramach przygotowania tej dokumentacji, więc dokumentacja nie zawiera ich wyników.

### Wdrożenie

Repozytorium jest przygotowane pod hosting statyczny (konfiguracja w formacie Netlify):

- `_headers` — nagłówki bezpieczeństwa (CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) oraz polityka cache: `immutable` dla `css/`, `js/`, fontów i obrazów, `no-cache` dla `sw.js` i plików HTML.
- `_redirects` — plik zawiera obecnie wyłącznie komentarze i nie definiuje aktywnych reguł przekierowań.
- Formularz kontaktowy korzysta z Netlify Forms i reCAPTCHA; CSP w `_headers` dopuszcza domeny reCAPTCHA.
- Katalogiem wyjściowym wdrożenia jest `dist/`.

Kanoniczny origin zapisany w metadanych stron, `sitemap.xml` i `robots.txt` to `https://construction-project-02.netlify.app`. Repozytorium nie potwierdza, czy pod tym adresem działa aktualna wersja projektu.

### Dostępność

Zaimplementowane mechanizmy:

- skip link do treści głównej (`#main`) i sekcje opisane atrybutami `aria-labelledby`,
- synchronizacja `aria-expanded` i `aria-pressed` w nawigacji mobilnej oraz przełączniku motywu,
- pułapka fokusu i powrót fokusu do elementu wywołującego w lightboxie oraz modalu cookies,
- `inert` na ukrytym przycisku „powrót na górę”,
- walidacja formularza z komunikatami błędów, podsumowaniem błędów i skrótem do pierwszego błędnego pola,
- region `aria-live` w lightboxie,
- obsługa `prefers-reduced-motion` w warstwach CSS odpowiedzialnych za animacje,
- automatyczne audyty pa11y (`npm run qa:a11y`).

Repozytorium nie zawiera wyników audytu potwierdzających zgodność z konkretnym poziomem WCAG.

### SEO

- `title`, `meta description`, `canonical` i `meta robots` na każdej stronie; `success.html` ma `noindex, follow`, pozostałe strony `index, follow`.
- Metadane Open Graph i Twitter wraz z obrazami w `assets/img/og/`.
- Dane strukturalne JSON-LD osadzone inline w HTML: `HomeAndConstructionBusiness`, `Service`, `FAQPage`, `ImageGallery`, `WebSite` na stronie głównej oraz `WebPage` i `BreadcrumbList` na podstronach.
- `robots.txt` ze wskazaniem sitemapy oraz `sitemap.xml` z 12 adresami.
- Sekcje `<head>` utrzymywane skryptem `npm run build:head`.

Pliki JSON w `js/structured-data/` nie są ładowane w runtime — obowiązującym źródłem danych strukturalnych są bloki inline w HTML.

### PWA i obsługa offline

- `manifest.webmanifest` definiuje `id`, `scope`, `start_url`, tryb `standalone`, ikony (w tym `maskable`), skróty aplikacji i zrzuty ekranu; wszystkie wskazane pliki istnieją w `assets/img/`.
- Service Worker jest rejestrowany w `js/core/service-worker.js` dla `/sw.js` z zakresem `/`.
- Strategie: dokumenty — network-first z fallbackiem na cache i `offline.html`; style i skrypty — stale-while-revalidate; obrazy — cache-first.
- Podczas `activate` usuwane są cache o nieaktualnej rewizji; Service Worker używa `skipWaiting()` i `clients.claim()`.
- `sw.js` w katalogu głównym odpowiada strukturze `sw.template.js` z podstawioną rewizją i listą precache; `npm run build:sw` zapisuje swój wynik do `dist/sw.js`.

Repozytorium nie zawiera weryfikacji instalowalności ani testów działania offline.

### Wydajność

- Minifikacja CSS i JS do pojedynczych plików produkcyjnych.
- Obrazy w `<picture>` z wariantami AVIF, WebP i JPG oraz `srcset` dla kilku szerokości.
- Atrybuty `loading="lazy"`, `decoding="async"` i `fetchpriority` na obrazach.
- `preload` dwóch fontów `woff2` i arkusza `css/main.css`, `font-display: swap` w deklaracjach `@font-face`.
- Fonty hostowane lokalnie, brak zapytań do zewnętrznych CDN-ów w warstwie runtime.
- Nagłówki cache dla zasobów statycznych i precache w Service Workerze.

Repozytorium nie zawiera wyników pomiarów wydajności.

### Dane i trwałość stanu

Projekt nie ma backendu, kont użytkowników ani bazy danych. Treści są statyczne i zapisane bezpośrednio w HTML.

Stan przechowywany w przeglądarce:

- `localStorage` `theme` — wybrany motyw,
- `localStorage` `cookie-consent-v1` — zgoda cookies wraz ze znacznikiem czasu,
- `localStorage` `contactFormMessage` — robocza treść wiadomości z formularza, usuwana po udanej wysyłce,
- ciasteczko `cookie_consent` — `max-age` 15768000 sekund, `SameSite=Lax`.

Dostęp do `localStorage` jest opakowany w `try/catch` (`js/utils/storage.js`), więc brak dostępu do magazynu nie przerywa działania strony. Dane formularza są wysyłane do Netlify Forms.

### Utrzymanie projektu

- Style zmieniaj w `css/` (wejście: `css/main.css`), skrypty w `js/` (wejście: `js/main.js`); pliki w `dist/` są generowane.
- Zmiany w Service Workerze wprowadzaj w `sw.template.js`, a następnie uruchom `npm run build:sw`; nie edytuj wygenerowanych plików `sw.js` ręcznie.
- Metadane stron aktualizuj w `tools/templates/pages.meta.json` i regeneruj przez `npm run build:head`.
- Warianty obrazów w `assets/img/_optimized/` pochodzą z `npm run img:build`.
- Opis wszystkich skryptów npm znajduje się w `settings.md`, historia istotnych zmian w `CHANGELOG.md`.
- `postcss.config.json` jest obecny w repozytorium, ale wtyczki `postcss-import`, `postcss-nested` i `postcss-preset-env` nie są zainstalowane, a build CSS scala `@import` własnym skryptem i minifikuje przez `cssnano-cli`.

### Roadmap

- Rozszerzenie skryptów QA o automatyczne uruchamianie serwera testowego przed audytami.
- Dodanie testów jednostkowych dla modułów JS o najwyższej złożoności (formularz, lightbox).
- Ujednolicenie źródeł JSON-LD (obecnie bloki inline w HTML i pliki w `js/structured-data/`).
- Dodanie automatycznej walidacji linków wewnętrznych dla całej struktury wielostronicowej.

### Licencja

Projekt jest objęty własnościową licencją KP_Code (Własnościowa Licencja Projektu KP_CODE, wersja 1.0) — pełna treść w pliku [LICENSE](LICENSE). Nie jest to licencja open source. Materiały podmiotów trzecich pozostają objęte własnymi licencjami.

### Atrybucje

- Licencje zależności deweloperskich są wypisane w sekcji 8 pliku [LICENSE](LICENSE).
- Fonty Lato, Montserrat i Poppins są hostowane lokalnie w `assets/fonts/`; repozytorium nie zawiera plików licencyjnych tych fontów.

## EN

### Project Overview

Axiom is a static, multi-page website for a construction and renovation company, built with plain HTML, CSS, and JavaScript (ES Modules), without a framework and without runtime dependencies. The repository contains 15 HTML pages: the homepage, 6 service pages, 5 legal pages, and `success.html`, `offline.html`, and `404.html`.

The build layer consists of custom Node scripts executed through npm scripts (CSS and JS minification, service worker generation, `<head>` generation, an image pipeline, and QA audits). The repository also contains static hosting configuration.

### Key Features

- 15 static pages: homepage, 6 service pages, 5 legal pages, form confirmation, offline page, and a 404 page.
- Mobile navigation with `aria-expanded` synchronization, page scroll locking, and panel positioning relative to the header.
- Light/dark theme toggle with a persisted choice and theme initialization before first paint (`js/theme-init.js` on every page).
- Gallery lightbox with a focus trap, keyboard support, an `aria-live` region, and focus return to the triggering element.
- Contact form: client-side validation (5 required fields, 500-character limit), character counter, error summary with a shortcut to the first invalid field, honeypot, and Netlify Forms with reCAPTCHA integration (`data-netlify`, `data-netlify-recaptcha`, redirect to `success.html`).
- Cookie banner implemented as a modal with a focus trap; consent stored in `localStorage` and in a cookie.
- FAQ section built on native `<details>` and `<summary>` elements.
- Compact header after scrolling and a back-to-top button disabled with `inert` while hidden.
- Section reveal through `IntersectionObserver` with a fallback for browsers without the API.
- Service worker with precache, cache strategies for documents, styles, scripts, and images, and an offline page.

### Tech Stack

**Runtime**

- HTML
- CSS (layers combined through `@import`, custom properties, `color-mix`)
- Vanilla JavaScript (ES Modules)
- No runtime dependencies — `package.json` declares `devDependencies` only

**Build**

- Node.js + npm scripts (custom `.mjs` scripts in `tools/`)
- `cssnano` 7.1.1 and `cssnano-cli` 1.0.5 — CSS minification
- `terser` 5.44.1 — JavaScript minification
- `sharp` 0.33.5 — image variant generation
- `ttf2woff2` 8.0.0 — font conversion

**Preview and QA**

- `http-server` 14.1.1 — local HTTP server
- `lighthouse` 12.8.2 and `@lhci/cli` 0.15.1 — Lighthouse audits
- `pa11y` 8.0.0 — automated accessibility audits

### Architecture

- **CSS** — `css/main.css` aggregates the layers in the order `tokens` → `base` → `layout` → `components` → `sections`. Theme variables and typography live in `css/tokens/tokens.css`.
- **JavaScript** — `js/main.js` calls `initApp()` from `js/core/init.js`, which initializes the components in a fixed order. Shared selectors and thresholds are centralized in `js/core/config.js`, and `localStorage` access goes through safe wrappers in `js/utils/storage.js`.
- **Theme** — `js/theme-init.js` is loaded synchronously before the content and sets `data-theme` from the stored choice or from `prefers-color-scheme`.
- **Page metadata** — `<head>` sections are generated from `tools/templates/head.partial.html` and `tools/templates/pages.meta.json`.
- **Canonical sources vs generated files** — the sources are `css/`, `js/`, the HTML files, `sw.template.js`, and `tools/templates/`. The `dist/` directory, `assets/img/_optimized/`, and `sw.js` are generated output and should not be edited by hand.

### Project Structure

```text
.
├── index.html                  # homepage
├── 404.html                    # 404 error page
├── offline.html                # service worker offline fallback
├── success.html                # form submission confirmation (noindex)
├── services/                   # 6 service pages
├── legal/                      # 5 legal pages and certificates
├── css/                        # tokens, base, layout, components, sections
├── js/
│   ├── main.js                 # entry point (ES Modules)
│   ├── theme-init.js           # theme initialization before first paint
│   ├── core/                   # init, config, service worker registration
│   ├── components/             # navigation, theme, lightbox, form, cookies
│   ├── sections/               # page section logic
│   ├── utils/                  # dom, a11y, storage
│   └── structured-data/        # JSON-LD files (not loaded at runtime)
├── assets/                     # fonts, images, favicons, certificate icons
├── tools/
│   ├── css/                    # CSS build
│   ├── js/                     # JS build
│   ├── sw/                     # service worker generation
│   ├── html/                   # <head> generation
│   ├── images/                 # image pipeline
│   ├── qa/                     # Lighthouse + pa11y
│   ├── release/                # dist cleanup and assembly
│   └── templates/              # head.partial.html + pages.meta.json
├── sw.template.js              # canonical service worker source
├── sw.js                       # service worker matching the template
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── _headers
├── _redirects
├── package.json
├── settings.md                 # npm script reference
├── CHANGELOG.md
├── LICENSE
└── README.md
```

### Installation

The project uses npm (`package-lock.json`, `lockfileVersion` 3). Dependencies are required only for the build, preview, and audits — the pages themselves run without them.

```bash
npm install
```

The repository does not declare a required Node.js version (no `engines`, `.nvmrc`, or `.node-version`).

### Local Development

```bash
npm run serve
```

`http-server` starts at `http://localhost:8080` with caching disabled (`-c-1`). Open the pages over HTTP — ES modules and service worker registration do not work when files are opened from disk.

### Available Scripts

- `npm run serve` — local server for the working directory on port 8080.
- `npm run serve:dist` — the same server for the `dist/` directory.
- `npm run build` — full build: `build:clean` → `build:css` → `build:js` → `build:sw` → `build:dist`.
- `npm run build:clean` — removes and recreates the `dist/` directory.
- `npm run build:css` — inlines the `@import` chain from `css/main.css` and minifies the result to `dist/style.min.css`.
- `npm run build:js` — resolves module imports from `js/main.js` and minifies the result to `dist/script.min.js`.
- `npm run build:sw` — generates `dist/sw.js` from `sw.template.js`; the cache revision is hashed from `dist/style.min.css`, `dist/script.min.js`, and `manifest.webmanifest`.
- `npm run build:dist` — copies static files into `dist/` and rewrites HTML references to `style.min.css` and `script.min.js`.
- `npm run build:head` — generates `<head>` sections from `tools/templates/head.partial.html` and `tools/templates/pages.meta.json`.
- `npm run img:build` — generates WebP and AVIF variants in `assets/img/_optimized/`; `npm run img:clean` removes that directory.
- `npm run qa:lighthouse`, `npm run qa:a11y`, `npm run qa` — Lighthouse and pa11y audits.

### Production Build

```bash
npm run build
npm run serve:dist
```

The build writes its output to `dist/`: minified `style.min.css` and `script.min.js`, a generated `sw.js`, copies of `assets/`, `services/`, `legal/`, `js/`, `css/`, and the root files (`index.html`, `404.html`, `offline.html`, `success.html`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`, `LICENSE`). The `dist/` directory is produced locally and is not stored in the repository.

The build was not executed while preparing this documentation — the description above comes from the script configuration.

### Testing and Validation

The repository contains no unit tests and no end-to-end tests. Two audits are available and run against a live local server:

```bash
npm run serve   # in a separate terminal
npm run qa
```

- `qa:lighthouse` runs `lhci collect` against `http://localhost:8080/`, `/services/budowa-domow.html`, and `/legal/regulamin.html`, writing results to `reports/lighthouse/`.
- `qa:a11y` runs `pa11y` against the same three URLs and writes JSON reports to `reports/pa11y/`.

The QA scripts do not start the server themselves. The audits were not executed while preparing this documentation, so no audit results are reported here.

### Deployment

The repository is prepared for static hosting (Netlify-format configuration):

- `_headers` — security headers (CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) and the cache policy: `immutable` for `css/`, `js/`, fonts, and images, `no-cache` for `sw.js` and HTML files.
- `_redirects` — the file currently contains comments only and defines no active redirect rules.
- The contact form uses Netlify Forms and reCAPTCHA; the CSP in `_headers` allows the reCAPTCHA domains.
- The deployment output directory is `dist/`.

The canonical origin recorded in page metadata, `sitemap.xml`, and `robots.txt` is `https://construction-project-02.netlify.app`. The repository does not confirm whether the current version of the project is live at that address.

### Accessibility

Implemented mechanisms:

- skip link to the main content (`#main`) and sections described with `aria-labelledby`,
- `aria-expanded` and `aria-pressed` synchronization in the mobile navigation and the theme toggle,
- focus trap and focus return to the triggering element in the lightbox and the cookie modal,
- `inert` on the hidden back-to-top button,
- form validation with error messages, an error summary, and a shortcut to the first invalid field,
- an `aria-live` region in the lightbox,
- `prefers-reduced-motion` handling in the CSS layers responsible for animations,
- automated pa11y audits (`npm run qa:a11y`).

The repository contains no audit results confirming conformance with a specific WCAG level.

### SEO

- `title`, `meta description`, `canonical`, and `meta robots` on every page; `success.html` uses `noindex, follow`, the remaining pages use `index, follow`.
- Open Graph and Twitter metadata with images in `assets/img/og/`.
- JSON-LD structured data embedded inline in the HTML: `HomeAndConstructionBusiness`, `Service`, `FAQPage`, `ImageGallery`, and `WebSite` on the homepage, plus `WebPage` and `BreadcrumbList` on subpages.
- `robots.txt` pointing to the sitemap and a `sitemap.xml` with 12 URLs.
- `<head>` sections maintained through `npm run build:head`.

The JSON files in `js/structured-data/` are not loaded at runtime — the inline blocks in the HTML are the effective source of structured data.

### PWA and Offline Support

- `manifest.webmanifest` defines `id`, `scope`, `start_url`, `standalone` display, icons (including `maskable`), app shortcuts, and screenshots; every referenced file exists under `assets/img/`.
- The service worker is registered in `js/core/service-worker.js` for `/sw.js` with scope `/`.
- Strategies: documents — network-first with a cache and `offline.html` fallback; styles and scripts — stale-while-revalidate; images — cache-first.
- On `activate`, caches with an outdated revision are removed; the service worker uses `skipWaiting()` and `clients.claim()`.
- The root `sw.js` matches the structure of `sw.template.js` with the revision and precache list filled in; `npm run build:sw` writes its own output to `dist/sw.js`.

The repository contains no installability verification and no offline behavior tests.

### Performance

- CSS and JS minification into single production files.
- Images served through `<picture>` with AVIF, WebP, and JPG variants and `srcset` for several widths.
- `loading="lazy"`, `decoding="async"`, and `fetchpriority` attributes on images.
- `preload` for two `woff2` fonts and for `css/main.css`, with `font-display: swap` in the `@font-face` declarations.
- Locally hosted fonts and no runtime requests to external CDNs.
- Cache headers for static assets and service worker precache.

The repository contains no performance measurement results.

### Data and State Persistence

The project has no backend, no user accounts, and no database. Content is static and stored directly in the HTML.

State kept in the browser:

- `localStorage` `theme` — the selected theme,
- `localStorage` `cookie-consent-v1` — cookie consent with a timestamp,
- `localStorage` `contactFormMessage` — the draft contact message, removed after a successful submission,
- the `cookie_consent` cookie — `max-age` 15768000 seconds, `SameSite=Lax`.

`localStorage` access is wrapped in `try/catch` (`js/utils/storage.js`), so an unavailable storage does not break the page. Form data is submitted to Netlify Forms.

### Project Maintenance

- Change styles in `css/` (entry point: `css/main.css`) and scripts in `js/` (entry point: `js/main.js`); files in `dist/` are generated.
- Make service worker changes in `sw.template.js` and then run `npm run build:sw`; do not edit generated `sw.js` files by hand.
- Update page metadata in `tools/templates/pages.meta.json` and regenerate it through `npm run build:head`.
- Image variants in `assets/img/_optimized/` come from `npm run img:build`.
- All npm scripts are described in `settings.md`, and significant changes are recorded in `CHANGELOG.md`.
- `postcss.config.json` is present in the repository, but the `postcss-import`, `postcss-nested`, and `postcss-preset-env` plugins are not installed, and the CSS build inlines `@import` with its own script and minifies through `cssnano-cli`.

### Roadmap

- Extend the QA scripts to start the test server automatically before the audits.
- Add unit tests for the higher-complexity JS modules (contact form, lightbox).
- Consolidate the JSON-LD sources (currently inline blocks in the HTML and files in `js/structured-data/`).
- Add automated internal link validation across the multi-page structure.

### License

The project is covered by the KP_Code proprietary project license (KP_CODE Proprietary Project License, version 1.0) — full text in [LICENSE](LICENSE). It is not an open-source license. Third-party materials remain subject to their own licenses.

### Attributions

- Licenses of the development dependencies are listed in section 8 of [LICENSE](LICENSE).
- The Lato, Montserrat, and Poppins fonts are self-hosted in `assets/fonts/`; the repository does not include license files for those fonts.
