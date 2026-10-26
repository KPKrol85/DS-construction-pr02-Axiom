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
- `eslint` 10.9.1 — statyczna analiza JavaScriptu (`npm run lint`)
- `vitest` 4.1.11 i `jsdom` 30.0.1 — skupione testy komponentów DOM (formularz kontaktowy, lightbox, nawigacja, modal informacji o projekcie/cookies, motyw), bezpiecznego dostępu do `localStorage`, obsługi dokumentów w Service Workerze i odwołań dostępności w stronach HTML (`npm test`)

### Architektura

- **CSS** — `css/main.css` agreguje warstwy w kolejności `tokens` → `base` → `layout` → `components` → `sections`. Zmienne motywu i typografia znajdują się w `css/tokens/tokens.css`.
- **JavaScript** — `js/main.js` wywołuje `initApp()` z `js/core/init.js`, które inicjalizuje komponenty w ustalonej kolejności. Wspólne selektory i progi są scentralizowane w `js/core/config.js`, a dostęp do `localStorage` przechodzi przez bezpieczne wrappery w `js/utils/storage.js`.
- **Motyw** — `js/theme-init.js` jest ładowany synchronicznie przed treścią i ustawia `data-theme` na podstawie zapisanego wyboru albo `prefers-color-scheme`.
- **Metadane stron** — sekcje `<head>` są generowane z `tools/templates/head.partial.html` oraz `tools/templates/pages.meta.json`.
- **Dane strukturalne** — kanonicznym źródłem są bloki `application/ld+json` osadzone inline w plikach HTML; repozytorium nie utrzymuje równoległych plików JSON-LD.
- **Źródła kanoniczne a pliki generowane** — źródłami są `css/`, `js/`, pliki HTML, `sw.template.js` i `tools/templates/`. Katalog `dist/`, `assets/img/_optimized/` oraz oba pliki `sw.js` (w katalogu głównym i w `dist/`) są wynikiem generowania i nie powinny być edytowane ręcznie.

### Struktura projektu

```text
.
├── index.html                  # strona główna
├── 404.html                    # strona błędu 404 (noindex)
├── offline.html                # fallback offline dla Service Workera (noindex)
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
│   └── utils/                  # dom, a11y, storage
├── assets/                     # fonty, obrazy, favicony, ikony certyfikatów
├── tools/
│   ├── css/                    # build CSS
│   ├── js/                     # build JS
│   ├── sw/                     # generowanie Service Workera
│   ├── html/                   # generowanie sekcji <head>
│   ├── images/                 # pipeline obrazów
│   ├── qa/                     # Lighthouse, pa11y, kontrola odwołań
│   ├── release/                # czyszczenie i składanie dist/
│   └── templates/              # head.partial.html + pages.meta.json
├── tests/                      # 9 skupionych zestawów Vitest (komponenty DOM, storage, SW, HTML)
├── sw.template.js              # jedyne ręcznie edytowane źródło Service Workera
├── sw.js                       # Service Worker generowany z szablonu (profil lokalny)
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── _headers
├── package.json
├── vitest.config.mjs           # konfiguracja Vitest (środowisko jsdom)
├── docs/
│   ├── CHANGELOG.md
│   ├── settings.md             # szczegółowy opis skryptów npm
│   └── archive/
│       ├── audits/
│       │   └── daily-AUDIT-2026-09-02.md
│       └── plans/
│           └── PLAN-2026-09-02.md
├── LICENSE
└── README.md
```

### Instalacja

Projekt używa npm (`package-lock.json`, `lockfileVersion` 3). Zależności są potrzebne wyłącznie do buildu, podglądu i audytów — same strony działają bez nich.

Obsługiwany zakres Node.js: `^22.22.2` (od `22.22.2` do wersji poniżej `23.0.0`), zadeklarowany w `package.json`. Zweryfikowane środowisko: Node.js `22.23.3` i npm `10.9.9` na Windows x64.

Aby odtworzyć zależności z zatwierdzonego lockfile, uruchom:

```bash
npm ci
```

Polecenia `npm install` używaj przy celowym dodawaniu lub aktualizowaniu zależności; sprawdź wtedy zmiany w `package.json` i `package-lock.json`.

### Development lokalny

```bash
npm run serve
```

Serwer `http-server` startuje na `http://localhost:8080` z wyłączonym cache (`-c-1`). Strony należy otwierać przez HTTP — moduły ES i rejestracja Service Workera nie działają przy otwarciu plików z dysku.

### Dostępne skrypty

Szczegółowy opis wszystkich skryptów npm — wymagania wstępne, kolejność wykonania, tryby opcjonalne i kontrakty plików generowanych — znajduje się w [docs/settings.md](docs/settings.md). Najczęstsze zadania:

- Podgląd źródeł: [`npm run serve`](docs/settings.md#serve).
- Build produkcyjny i jego podgląd: [`npm run build`](docs/settings.md#build), następnie [`npm run serve:dist`](docs/settings.md#servedist).
- Skupione kontrole bez serwera i przeglądarki: [`npm test`](docs/settings.md#test), [`npm run lint`](docs/settings.md#lint) i [`npm run qa:references`](docs/settings.md#qareferences).
- Audyty przeglądarkowe: [`npm run qa`](docs/settings.md#qa) albo osobno [`npm run qa:lighthouse`](docs/settings.md#qalighthouse) i [`npm run qa:a11y`](docs/settings.md#qaa11y).
- Regeneracja plików pochodnych: [`npm run build:head`](docs/settings.md#buildhead) (sekcje `<head>`), [`npm run img:build`](docs/settings.md#imgbuild) (warianty obrazów) i [`npm run build:sw:local`](docs/settings.md#buildswlocal) (lokalny `sw.js`).

### Build produkcyjny

```bash
npm run build
npm run qa:references -- --scope=release
npm run serve:dist
```

`npm run build` wykonuje kolejno `build:clean` → `build:css` → `build:js` → `build:hash` → `build:sw:production` → `build:dist` i zapisuje kompletne wydanie do `dist/`: bundle CSS i JS o nazwach zawierających skrót treści, `build-manifest.json`, produkcyjny `sw.js`, `_headers` z regułami cache bundli oraz kopie stron i zasobów. Katalog `dist/` powstaje lokalnie i nie jest przechowywany w repozytorium. Kontrola `--scope=release` wymaga poprawnego wygenerowanego wydania. Pełną zawartość `dist/` i kontrakty poszczególnych kroków opisuje [docs/settings.md](docs/settings.md#build).

Sekwencja `npm run build` była uruchamiana wielokrotnie na czystym `dist/` podczas weryfikacji O-01: identyczne źródła dają identyczne nazwy bundli produkcyjnych oraz identyczne wygenerowane pliki `sw.js` i `_headers`.

### Testy i walidacja

Skupione testy i kontrole statyczne nie wymagają serwera ani przeglądarki:

```bash
npm test
npm run lint
npm run qa:references
```

- [`npm test`](docs/settings.md#test) uruchamia skupione testy Vitest, domyślnie w środowisku jsdom.
- [`npm run lint`](docs/settings.md#lint) uruchamia ESLint dla kodu przeglądarkowego, narzędzi, testów, źródła Service Workera i konfiguracji Vitest.
- [`npm run qa:references`](docs/settings.md#qareferences) sprawdza odwołania lokalne i kontrakt bundli produkcyjnych, a po buildzie także wygenerowane wydanie; nierozwiązane odwołanie lub naruszony kontrakt kończy przebieg kodem różnym od zera.

Zestaw obejmuje 9 plików w `tests/`:

- `contact-form.test.js` — formularz kontaktowy: walidacja pól wymaganych i adresu e-mail, dostępne podsumowanie błędów z odnośnikami do błędnych pól, limit 500 znaków wiadomości, wersja robocza pod kluczem `contactFormMessage` (zapis, odtworzenie, komunikat, odrzucenie i usunięcie po udanym wysłaniu) oraz działanie przy błędach `localStorage`.
- `contact-form-production.test.js` — produkcyjna wysyłka formularza z atrapą `fetch`: jednokrotne wysłanie zakodowanych pól, czyszczenie formularza i wersji roboczej dopiero po potwierdzeniu, blokada ponownego wysłania w trakcie żądania oraz zachowanie wersji roboczej i natywny fallback po błędzie sieci lub odpowiedzi innej niż OK.
- `lightbox.test.js` — lightbox: otwarcie i przeniesienie fokusu, pułapka fokusu obejmująca dynamicznie tworzone przyciski nawigacji, zamknięcie (także z trybu pełnoekranowego i przez Escape) z powrotem fokusu do elementu otwierającego, nawigacja klawiszami `ArrowRight` i `ArrowLeft`, przyciskami i gestem przesunięcia oraz wskaźnik pozycji w galerii.
- `navigation.test.js` — nawigacja: stan zwinięty i otwarty na urządzeniach mobilnych, synchronizacja ARIA/`inert`/klas i blokady przewijania, przeniesienie i powrót fokusu, zamknięcie przez Escape, aktywację linku i wskaźnik poza menu, synchronizacja po zmianie breakpointu oraz oznaczanie bieżącej sekcji strony głównej, także bez opcjonalnych API przeglądarki.
- `cookies.test.js` — modal informacji o projekcie/cookies: obsługa zapisanej zgody, blokada przewijania, fokus początkowy i jego pułapka, zablokowany Escape bez zamykania, zapis zgody w `localStorage` i ciasteczku, przywrócenie przewijania i fokusu oraz działanie przy błędach `localStorage`.
- `theme.test.js` — motyw: wczesna inicjalizacja z `js/theme-init.js` i przełącznik motywu — zachowanie zapisanego wyboru, podążanie za motywem systemowym w nowszym i starszym API zapytań medialnych bez zapisu wyboru oraz ręczne przełączanie z synchronizacją kontrolek i zapisem.
- `storage.test.js` — wrappery `js/utils/storage.js`: odczyt zwraca `null`, a zapis i usuwanie nie przekazują wyjątków, gdy `localStorage` zgłasza błąd.
- `service-worker-documents.test.js` — obsługa dokumentów w `sw.template.js` (środowisko `node`): zapis odpowiedzi HTTP 200 w cache HTML bieżącej rewizji, zwracanie innych odpowiedzi bez zapisu oraz kolejność fallbacków po błędzie sieci (żądany dokument, `offline.html`, `index.html`).
- `html-accessibility-references.test.js` — 15 utrzymywanych stron HTML (środowisko `node` z `jsdom`): unikalne identyfikatory oraz rozwiązywanie odwołań `label[for]`, `aria-labelledby`, `aria-describedby` i `aria-controls` w obrębie tego samego dokumentu.

Testy nie wykonują zapytań sieciowych. Repozytorium nie zawiera testów e2e.

Audyty przeglądarkowe Lighthouse i pa11y uruchamia jedna komenda:

```bash
npm run qa
```

`npm run qa` wykonuje kolejno `qa:lighthouse` i `qa:a11y`; każdy skrypt sam startuje i zatrzymuje lokalny serwer QA na porcie 8080, więc nie wymaga osobno uruchomionego `npm run serve`. Adresy audytów, katalogi raportów i obsługę zajętego portu opisuje [docs/settings.md](docs/settings.md#qalighthouse). Audyty nie były wykonywane w ramach przygotowania tej dokumentacji, więc dokumentacja nie zawiera ich wyników.

### Wdrożenie

Repozytorium jest przygotowane pod hosting statyczny (konfiguracja w formacie Netlify):

- `_headers` — nagłówki bezpieczeństwa (CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) oraz polityka cache. Plik w katalogu głównym jest kanoniczny i zawiera blok znaczników przeznaczony na reguły bundli produkcyjnych; `build:dist` zastępuje ten blok wyłącznie w `dist/_headers` dokładnymi regułami dla nazw z bieżącego builda (`Cache-Control: public, max-age=31536000, immutable`), ponieważ te adresy niosą skrót własnej treści. Dwa samodzielne skrypty źródłowe publikowane obok bundli — `js/theme-init.js` i `js/offline.js`, ładowane bezpośrednio przez strony produkcyjne — zachowują skończony czas świeżości z rewalidacją, wersjonowane ścieżki fontów zachowują długotrwałe `immutable`, obrazy i pliki metadanych mają skończony czas świeżości, a `sw.js` i strony HTML pozostają poza długotrwałym cache (`no-cache`).
- Formularz kontaktowy korzysta z Netlify Forms i reCAPTCHA; CSP w `_headers` dopuszcza domeny reCAPTCHA.
- Katalogiem wyjściowym wdrożenia jest `dist/`.

Kanoniczny origin zapisany w metadanych stron, `sitemap.xml` i `robots.txt` to `https://ds-construction-pr02-axiom.netlify.app`. Repozytorium nie potwierdza, czy pod tym adresem działa aktualna wersja projektu.

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

- `title`, `meta description`, `canonical` i `meta robots` na każdej stronie; strony pomocnicze `404.html`, `offline.html` i `success.html` mają `noindex, follow`, pozostałe strony `index, follow`.
- Metadane Open Graph i Twitter wraz z obrazami w `assets/img/og/`.
- Dane strukturalne JSON-LD osadzone inline w HTML — jedyne źródło danych strukturalnych w repozytorium: `HomeAndConstructionBusiness`, `Service`, `FAQPage`, `ImageGallery`, `WebSite` na stronie głównej oraz `WebPage` i `BreadcrumbList` na podstronach.
- `robots.txt` ze wskazaniem sitemapy oraz `sitemap.xml` z 12 adresami.
- Sekcje `<head>` utrzymywane skryptem `npm run build:head`.

### PWA i obsługa offline

- `manifest.webmanifest` definiuje `id`, `scope`, `start_url`, tryb `standalone`, ikony (w tym `maskable`), skróty aplikacji i zrzuty ekranu; wszystkie wskazane pliki istnieją w `assets/img/`.
- Service Worker jest rejestrowany w `js/core/service-worker.js` dla `/sw.js` z zakresem `/`.
- Strategie: dokumenty — network-first z fallbackiem na cache i `offline.html`; style i skrypty — stale-while-revalidate; obrazy — cache-first.
- Podczas `activate` usuwane są cache o nieaktualnej rewizji; Service Worker używa `skipWaiting()` i `clients.claim()`.
- `sw.template.js` jest jedynym ręcznie edytowanym źródłem Service Workera; generowane są z niego `sw.js` w katalogu głównym (profil lokalny, precache źródeł serwowanych przez `npm run serve`; `npm run build:sw:local`) oraz `dist/sw.js` (profil produkcyjny, precache dokładnych nazw bundli odczytanych z `dist/build-manifest.json`; krok `build:sw:production` w `npm run build`).

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
- Zmiany w Service Workerze wprowadzaj w `sw.template.js`, a następnie uruchom `npm run build:sw:local`; produkcyjny `dist/sw.js` powstaje w `npm run build`. Nie edytuj wygenerowanych plików `sw.js` ręcznie.
- Metadane stron aktualizuj w `tools/templates/pages.meta.json`, sprawdź zakres zmian przez `npm run build:head -- --preview` i regeneruj przez `npm run build:head`.
- Warianty obrazów w `assets/img/_optimized/` pochodzą z `npm run img:build`; listę źródeł i szerokości deklaruje `tools/images/build-images.mjs` zgodnie z `srcset` na stronach — po zmianie `srcset` zaktualizuj tę deklarację i uruchom skrypt ponownie.
- Szczegółowy opis wszystkich skryptów npm znajduje się w [docs/settings.md](docs/settings.md); zmiany zachowania komend lub ich kontraktów wyjściowych opisuj tam, a README aktualizuj tylko wtedy, gdy zmienia się skrócony przepis. Historia istotnych zmian znajduje się w `docs/CHANGELOG.md`.

### Roadmap

- Brak otwartych pozycji roadmapy; opcjonalne usprawnienia są prowadzone w `docs/archive/plans/PLAN-2026-09-02.md`.

### Licencja

Projekt jest objęty własnościową licencją KP_Code (Własnościowa Licencja Projektu KP_CODE, wersja 1.0) — pełna treść w pliku [LICENSE](LICENSE). Nie jest to licencja open source. Materiały podmiotów trzecich pozostają objęte własnymi licencjami.

### Atrybucje

- Licencje zależności deweloperskich są wypisane w sekcji 8 pliku [LICENSE](LICENSE).
- Fonty Lato i Montserrat są hostowane lokalnie w `assets/fonts/` na licencji SIL Open Font License 1.1; atrybucje oraz ścieżki do przechowywanych tekstów licencji zbiera plik [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

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
- `eslint` 10.9.1 — JavaScript static analysis (`npm run lint`)
- `vitest` 4.1.11 and `jsdom` 30.0.1 — focused tests for the DOM components (contact form, lightbox, navigation, project-information/cookie modal, theme), safe `localStorage` access, service worker document handling, and accessibility references in the HTML pages (`npm test`)

### Architecture

- **CSS** — `css/main.css` aggregates the layers in the order `tokens` → `base` → `layout` → `components` → `sections`. Theme variables and typography live in `css/tokens/tokens.css`.
- **JavaScript** — `js/main.js` calls `initApp()` from `js/core/init.js`, which initializes the components in a fixed order. Shared selectors and thresholds are centralized in `js/core/config.js`, and `localStorage` access goes through safe wrappers in `js/utils/storage.js`.
- **Theme** — `js/theme-init.js` is loaded synchronously before the content and sets `data-theme` from the stored choice or from `prefers-color-scheme`.
- **Page metadata** — `<head>` sections are generated from `tools/templates/head.partial.html` and `tools/templates/pages.meta.json`.
- **Structured data** — the canonical source is the inline `application/ld+json` blocks in the HTML files; the repository keeps no parallel JSON-LD files.
- **Canonical sources vs generated files** — the sources are `css/`, `js/`, the HTML files, `sw.template.js`, and `tools/templates/`. The `dist/` directory, `assets/img/_optimized/`, and both `sw.js` files (the repository root one and `dist/sw.js`) are generated output and should not be edited by hand.

### Project Structure

```text
.
├── index.html                  # homepage
├── 404.html                    # 404 error page (noindex)
├── offline.html                # service worker offline fallback (noindex)
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
│   └── utils/                  # dom, a11y, storage
├── assets/                     # fonts, images, favicons, certificate icons
├── tools/
│   ├── css/                    # CSS build
│   ├── js/                     # JS build
│   ├── sw/                     # service worker generation
│   ├── html/                   # <head> generation
│   ├── images/                 # image pipeline
│   ├── qa/                     # Lighthouse, pa11y, reference check
│   ├── release/                # dist cleanup and assembly
│   └── templates/              # head.partial.html + pages.meta.json
├── tests/                      # 9 focused Vitest suites (DOM components, storage, SW, HTML)
├── sw.template.js              # the only hand-edited service worker source
├── sw.js                       # service worker generated from the template (local profile)
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── _headers
├── package.json
├── vitest.config.mjs           # Vitest configuration (jsdom environment)
├── docs/
│   ├── CHANGELOG.md
│   ├── settings.md             # detailed npm script reference
│   └── archive/
│       ├── audits/
│       │   └── daily-AUDIT-2026-09-02.md
│       └── plans/
│           └── PLAN-2026-09-02.md
├── LICENSE
└── README.md
```

### Installation

The project uses npm (`package-lock.json`, `lockfileVersion` 3). Dependencies are required only for the build, preview, and audits — the pages themselves run without them.

Supported Node.js range: `^22.22.2` (from `22.22.2` up to, but excluding, `23.0.0`), declared in `package.json`. Verified environment: Node.js `22.23.3` and npm `10.9.9` on Windows x64.

To reproduce dependencies from the committed lockfile, run:

```bash
npm ci
```

Use `npm install` for intentional dependency additions or updates; review the resulting changes to `package.json` and `package-lock.json`.

### Local Development

```bash
npm run serve
```

`http-server` starts at `http://localhost:8080` with caching disabled (`-c-1`). Open the pages over HTTP — ES modules and service worker registration do not work when files are opened from disk.

### Available Scripts

Every npm script — its prerequisites, execution order, optional modes, and generated-file contracts — is described in detail in [docs/settings.md](docs/settings.md) (written in Polish). Common tasks:

- Source preview: [`npm run serve`](docs/settings.md#serve).
- Production build and preview: [`npm run build`](docs/settings.md#build), then [`npm run serve:dist`](docs/settings.md#servedist).
- Focused checks without a server or browser: [`npm test`](docs/settings.md#test), [`npm run lint`](docs/settings.md#lint), and [`npm run qa:references`](docs/settings.md#qareferences).
- Browser audits: [`npm run qa`](docs/settings.md#qa), or [`npm run qa:lighthouse`](docs/settings.md#qalighthouse) and [`npm run qa:a11y`](docs/settings.md#qaa11y) separately.
- Regenerating derived files: [`npm run build:head`](docs/settings.md#buildhead) (`<head>` sections), [`npm run img:build`](docs/settings.md#imgbuild) (image variants), and [`npm run build:sw:local`](docs/settings.md#buildswlocal) (the local `sw.js`).

### Production Build

```bash
npm run build
npm run qa:references -- --scope=release
npm run serve:dist
```

`npm run build` runs `build:clean` → `build:css` → `build:js` → `build:hash` → `build:sw:production` → `build:dist` and writes the complete release to `dist/`: content-addressed CSS and JS bundles, `build-manifest.json`, the production `sw.js`, `_headers` with the bundle cache rules, and copies of the pages and assets. The `dist/` directory is produced locally and is not stored in the repository. The `--scope=release` check requires a valid generated release. The full `dist/` contents and the contract of each step are described in [docs/settings.md](docs/settings.md#build).

The `npm run build` sequence was run repeatedly from a clean `dist/` while verifying O-01: identical sources produce identical production bundle filenames and identical generated `sw.js` and `_headers`.

### Testing and Validation

The focused tests and static checks need no server and no browser:

```bash
npm test
npm run lint
npm run qa:references
```

- [`npm test`](docs/settings.md#test) runs the focused Vitest suite, in a jsdom environment by default.
- [`npm run lint`](docs/settings.md#lint) runs ESLint for the browser code, tooling, tests, the service worker source, and the Vitest configuration.
- [`npm run qa:references`](docs/settings.md#qareferences) checks local references and the production bundle contract, and also the generated release after a build; an unresolved reference or a violated contract exits the run non-zero.

The suite consists of 9 files in `tests/`:

- `contact-form.test.js` — contact form: required-field and e-mail validation, the accessible error summary linking to invalid fields, the 500-character message limit, the draft stored under `contactFormMessage` (saving, restoring, the notice, discarding, and removal after a successful submission), and behavior when `localStorage` fails.
- `contact-form-production.test.js` — production form submission with a stubbed `fetch`: a single submission of the encoded fields, clearing the form and draft only after acknowledgement, protection against resubmission while a request is pending, and draft preservation with a native fallback after a network failure or a non-OK response.
- `lightbox.test.js` — lightbox: opening and initial focus, the focus trap including the dynamically created navigation controls, closing (including from fullscreen and through Escape) with focus return to the triggering element, navigation through `ArrowRight` / `ArrowLeft`, buttons, and swipe gestures, and the gallery position indicator.
- `navigation.test.js` — navigation: collapsed and open mobile states, ARIA/`inert`/class and scroll-lock synchronization, focus transfer and return, closing through Escape, link activation, and an outside pointer interaction, synchronization across breakpoint changes, and marking the current homepage section, including without optional browser APIs.
- `cookies.test.js` — project-information/cookie modal: stored-consent handling, scroll locking, initial focus and focus trapping, blocked Escape without dismissal, consent persistence in `localStorage` and a cookie, scroll/focus restoration, and behavior when `localStorage` fails.
- `theme.test.js` — theme: early initialization from `js/theme-init.js` and the theme toggle — preserving a stored choice, following the system theme through both the modern and legacy media-query APIs without persisting a choice, and manual switching with control synchronization and persistence.
- `storage.test.js` — the `js/utils/storage.js` wrappers: reading returns `null`, and writing and removal do not propagate exceptions when `localStorage` throws.
- `service-worker-documents.test.js` — document handling in `sw.template.js` (`node` environment): caching HTTP 200 network responses in the revision-specific HTML cache, returning other responses without caching, and the fallback order after a network failure (requested document, `offline.html`, `index.html`).
- `html-accessibility-references.test.js` — the 15 maintained HTML pages (`node` environment with `jsdom`): unique IDs and resolution of `label[for]`, `aria-labelledby`, `aria-describedby`, and `aria-controls` references within the same document.

The tests make no network requests. The repository contains no end-to-end tests.

The Lighthouse and pa11y browser audits run from a single command:

```bash
npm run qa
```

`npm run qa` runs `qa:lighthouse` and then `qa:a11y`; each script starts and stops its own local QA server on port 8080, so no separately started `npm run serve` is needed. The audited URLs, report directories, and occupied-port handling are described in [docs/settings.md](docs/settings.md#qalighthouse). The audits were not executed while preparing this documentation, so no audit results are reported here.

### Deployment

The repository is prepared for static hosting (Netlify-format configuration):

- `_headers` — security headers (CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) and the cache policy. The root file is canonical and carries a marker block reserved for the production bundle rules; `build:dist` replaces that block only in `dist/_headers` with the exact rules for the current build's filenames (`Cache-Control: public, max-age=31536000, immutable`), because those URLs carry a digest of their own content. The two standalone source scripts published beside the bundles — `js/theme-init.js` and `js/offline.js`, which production pages load directly — keep a finite freshness window with revalidation, the versioned font paths keep long-lived `immutable` caching, images and metadata files use finite caching, and `sw.js` and the HTML pages stay outside long-lived caching (`no-cache`).
- The contact form uses Netlify Forms and reCAPTCHA; the CSP in `_headers` allows the reCAPTCHA domains.
- The deployment output directory is `dist/`.

The canonical origin recorded in page metadata, `sitemap.xml`, and `robots.txt` is `https://ds-construction-pr02-axiom.netlify.app`. The repository does not confirm whether the current version of the project is live at that address.

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

- `title`, `meta description`, `canonical`, and `meta robots` on every page; the utility pages `404.html`, `offline.html`, and `success.html` use `noindex, follow`, the remaining pages use `index, follow`.
- Open Graph and Twitter metadata with images in `assets/img/og/`.
- JSON-LD structured data embedded inline in the HTML — the only structured-data source in the repository: `HomeAndConstructionBusiness`, `Service`, `FAQPage`, `ImageGallery`, and `WebSite` on the homepage, plus `WebPage` and `BreadcrumbList` on subpages.
- `robots.txt` pointing to the sitemap and a `sitemap.xml` with 12 URLs.
- `<head>` sections maintained through `npm run build:head`.

### PWA and Offline Support

- `manifest.webmanifest` defines `id`, `scope`, `start_url`, `standalone` display, icons (including `maskable`), app shortcuts, and screenshots; every referenced file exists under `assets/img/`.
- The service worker is registered in `js/core/service-worker.js` for `/sw.js` with scope `/`.
- Strategies: documents — network-first with a cache and `offline.html` fallback; styles and scripts — stale-while-revalidate; images — cache-first.
- On `activate`, caches with an outdated revision are removed; the service worker uses `skipWaiting()` and `clients.claim()`.
- `sw.template.js` is the only hand-edited service worker source; the root `sw.js` (local profile, precaching the sources served by `npm run serve`; `npm run build:sw:local`) and `dist/sw.js` (production profile, precaching the exact bundle names read from `dist/build-manifest.json`; the `build:sw:production` step of `npm run build`) are generated from it.

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
- Make service worker changes in `sw.template.js` and then run `npm run build:sw:local`; the production `dist/sw.js` is produced by `npm run build`. Do not edit generated `sw.js` files by hand.
- Update page metadata in `tools/templates/pages.meta.json`, review the scope of changes with `npm run build:head -- --preview`, and regenerate it through `npm run build:head`.
- Image variants in `assets/img/_optimized/` come from `npm run img:build`; `tools/images/build-images.mjs` declares the sources and widths to match the `srcset` declarations on the pages — after changing a `srcset`, update that declaration and run the script again.
- All npm scripts are described in detail in [docs/settings.md](docs/settings.md); document changes to command behavior or output contracts there, and update this README only when a quick-start recipe changes. Significant changes are recorded in `docs/CHANGELOG.md`.

### Roadmap

- No open roadmap items; optional improvements are tracked in `docs/archive/plans/PLAN-2026-09-02.md`.

### License

The project is covered by the KP_Code proprietary project license (KP_CODE Proprietary Project License, version 1.0) — full text in [LICENSE](LICENSE). It is not an open-source license. Third-party materials remain subject to their own licenses.

### Attributions

- Licenses of the development dependencies are listed in section 8 of [LICENSE](LICENSE).
- The Lato and Montserrat fonts are self-hosted in `assets/fonts/` under the SIL Open Font License 1.1; the attributions and the paths to the stored license texts are collected in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
