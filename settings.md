# settings.md

## package.json scripts

### img:build
- **Command:** `node tools/images/build-images.mjs`
- **What it does:** Przetwarza i generuje zoptymalizowane warianty obrazów na podstawie pipeline w `tools/images`.
- **When to use:** Po zmianach w źródłach obrazów przed buildem release.

### img:clean
- **Command:** `node tools/images/build-images.mjs --clean`
- **What it does:** Czyści wygenerowane artefakty obrazów.
- **When to use:** Gdy chcesz wykonać pełny, czysty przebieg generowania obrazów.

### build:clean
- **Command:** `node tools/release/clean-dist.mjs`
- **What it does:** Usuwa katalog `dist`.
- **When to use:** Na początku pełnego procesu build.

### build:css
- **Command:** `node tools/css/build-css.mjs`
- **What it does:** Buduje finalne zasoby CSS (pipeline release dla stylów).
- **When to use:** Po zmianach w `css/` lub jako część `build`.

### min:css
- **Command:** `npm run build:css`
- **What it does:** Alias do `build:css`.
- **When to use:** Dla kompatybilności z wcześniejszym nazewnictwem komendy.

### build:js
- **Command:** `node tools/js/build-js.mjs`
- **What it does:** Buduje finalne zasoby JavaScript.
- **When to use:** Po zmianach w `js/` lub jako część `build`.

### build:sw
- **Command:** `node tools/sw/build-sw.mjs`
- **What it does:** Generuje/odświeża `sw.js` (wersjonowanie i lista pre-cache).
- **When to use:** Po zmianach wpływających na service workera lub cache’owane assety.

### build:dist
- **Command:** `node tools/release/build-dist.mjs`
- **What it does:** Składa artefakty produkcyjne do katalogu `dist`.
- **When to use:** Po buildzie CSS/JS/SW, bezpośrednio przed publikacją.

### build
- **Command:** `npm run build:clean && npm run build:css && npm run build:js && npm run build:sw && npm run build:dist`
- **What it does:** Uruchamia pełny pipeline produkcyjny od czyszczenia do złożenia `dist`.
- **When to use:** Standardowa komenda przed wdrożeniem.

### serve
- **Command:** `http-server -c-1 -p 8080`
- **What it does:** Serwuje katalog roboczy projektu na porcie 8080 z wyłączonym cache.
- **When to use:** Lokalny podgląd źródeł (bez budowania `dist`).

### serve:dist
- **Command:** `http-server dist -c-1 -p 8080`
- **What it does:** Serwuje tylko artefakty z katalogu `dist`.
- **When to use:** Weryfikacja finalnego pakietu produkcyjnego.

### qa:lighthouse
- **Command:** `node tools/qa/run-lighthouse.mjs`
- **What it does:** Uruchamia Lighthouse CI collect dla zdefiniowanych URL i zapisuje raporty do `reports/lighthouse`.
- **When to use:** Audyt jakości (performance/SEO/a11y/best practices) przed release.

### qa:a11y
- **Command:** `node tools/qa/run-pa11y.mjs`
- **What it does:** Uruchamia pa11y dla wskazanych URL i zapisuje raporty JSON do `reports/pa11y`.
- **When to use:** Kontrola dostępności przed publikacją.

### qa
- **Command:** `npm run qa:lighthouse && npm run qa:a11y`
- **What it does:** Odpala komplet QA (Lighthouse + pa11y).
- **When to use:** Jako quality gate przed wdrożeniem.

### build:head
- **Command:** `node tools/html/build-head.mjs`
- **What it does:** Aktualizuje sekcje `<head>` stron HTML na podstawie szablonu i metadanych.
- **When to use:** Po zmianach globalnych SEO/meta/head.
