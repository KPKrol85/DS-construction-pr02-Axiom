# settings.md

Jedyny szczegółowy opis skryptów npm projektu: polecenia, wymagania wstępne i kolejność wykonania, tryby opcjonalne oraz kontrakty plików źródłowych i generowanych. Wykonywalnym źródłem prawdy pozostają `package.json` i skrypty w `tools/`. Każdą zmianę zachowania komendy lub jej kontraktu wyjściowego opisz w tym pliku; `README.md` utrzymuje wyłącznie skrócone przepisy z odnośnikami do tej dokumentacji.

## package.json scripts

### img:build
- **Command:** `node tools/images/build-images.mjs`
- **What it does:** Generuje warianty WebP i AVIF w `assets/img/_optimized/` wyłącznie dla źródeł i szerokości zadeklarowanych w `tools/images/build-images.mjs` na podstawie `srcset` utrzymywanych stron.
- **When to use:** Po zmianach w źródłach obrazów przed buildem release.
- **Selected source:** `npm run img:build -- --source=<relative-path>` generuje kompletny zestaw wariantów tylko jednego źródła, zachowując pozostałe pliki w `_optimized/` bez zmian. Ścieżka musi dokładnie odpowiadać jednemu kluczowi mapy `responsiveSources`, np. `npm run img:build -- --source=hero/hero-1920x1080.jpg`. Bez argumentów `npm run img:build` nadal przetwarza i sprawdza kompletność wszystkich zadeklarowanych źródeł.
- **Arguments:** Puste lub nieznane źródło, nieobsługiwane argumenty, powtórzone selektory oraz połączenie `--source` z `--clean` są odrzucane przed zapisem lub usuwaniem plików. `--clean` musi występować samodzielnie; czyszczenie nadal wykonuje `npm run img:clean`.

### img:clean
- **Command:** `node tools/images/build-images.mjs --clean`
- **What it does:** Usuwa cały katalog `assets/img/_optimized/` z wygenerowanymi wariantami; źródłowe obrazy pozostają bez zmian. Warianty są śledzone w repozytorium, więc po czyszczeniu odtwórz je przez `npm run img:build` bez argumentów.
- **When to use:** Gdy chcesz wykonać pełny, czysty przebieg generowania obrazów.

### build:clean
- **Command:** `node tools/release/clean-dist.mjs`
- **What it does:** Usuwa katalog `dist` i tworzy go na nowo jako pusty.
- **When to use:** Na początku pełnego procesu build.

### build:css
- **Command:** `node tools/css/build-css.mjs`
- **What it does:** Scala `@import` z `css/main.css` i minifikuje wynik do pośredniego bundla `dist/style.min.css`; finalną nazwę produkcyjną nadaje dopiero `build:hash`.
- **When to use:** Po zmianach w `css/` lub jako część `build`.

### min:css
- **Command:** `npm run build:css`
- **What it does:** Alias do `build:css`.
- **When to use:** Dla kompatybilności z wcześniejszym nazewnictwem komendy.

### build:js
- **Command:** `node tools/js/build-js.mjs`
- **What it does:** Rozwiązuje importy modułów od `js/main.js` i minifikuje wynik do pośredniego bundla `dist/script.min.js`; kolejność modułów w bundlu jest deterministyczna, a finalną nazwę produkcyjną nadaje `build:hash`.
- **When to use:** Po zmianach w `js/` lub jako część `build`.

### build:hash
- **Command:** `node tools/release/build-hash.mjs`
- **What it does:** Liczy SHA-256 z finalnych zminifikowanych bajtów obu pośrednich bundli, skraca skrót do 16 znaków szesnastkowych i zmienia ich nazwy na `style.<hash>.min.css` oraz `script.<hash>.min.js` w katalogu głównym `dist`; zapisuje `dist/build-manifest.json`, który jest źródłem finalnych nazw dla `build:sw`, `build:dist` i QA.
- **When to use:** Po `build:css` i `build:js`, przed `build:sw:production`; zwykle jako część `build`.
- **Failure behavior:** Brak pośredniego bundla albo pozostawiony obok niego bundel z wcześniejszego builda przerywa krok błędem; pełny `npm run build` zaczyna od `build:clean`, więc do `build:hash` trafia dokładnie jeden bundel każdego typu.

### build:sw
- **Command:** `node tools/sw/build-sw.mjs`
- **What it does:** Generuje z `sw.template.js` oba Service Workery: `sw.js` w katalogu głównym (profil lokalny, niezmieniony) i `dist/sw.js` (profil produkcyjny, który precache’uje dokładne nazwy bundli odczytane z `dist/build-manifest.json`), każdy z własną listą pre-cache i własną rewizją. Nie jest krokiem `build`, który używa `build:sw:production`.
- **When to use:** Tylko gdy oba profile mają zostać odświeżone jednocześnie; wymaga wcześniejszego `build:hash` dla profilu produkcyjnego. Bez poprawnego `dist/build-manifest.json` kończy się błędem przed zapisem któregokolwiek pliku, także lokalnego `sw.js`.

### build:sw:local
- **Command:** `node tools/sw/build-sw.mjs --profile=local`
- **What it does:** Generuje wyłącznie lokalny `sw.js` w katalogu głównym, bez wymagania `dist/build-manifest.json`. Wygenerowany plik jest śledzony w repozytorium i nie jest edytowany ręcznie.
- **When to use:** Po zmianach w `sw.template.js` oraz jawnie przed lokalnymi testami PWA uruchamianymi przez `npm run serve`.

### build:sw:production
- **Command:** `node tools/sw/build-sw.mjs --profile=production`
- **What it does:** Generuje wyłącznie produkcyjny `dist/sw.js` z nazwami bundli odczytanymi z `dist/build-manifest.json`; nie zapisuje głównego `sw.js`. Brakujący, nieaktualny lub nieprawidłowy manifest przerywa krok błędem.
- **When to use:** Po `build:hash`, przed `build:dist`; standardowo jako część `build`.

### build:dist
- **Command:** `node tools/release/build-dist.mjs`
- **What it does:** Składa artefakty produkcyjne do katalogu `dist`: kopiuje pliki statyczne, przepisuje odwołania w HTML na nazwy bundli z `dist/build-manifest.json` i zastępuje blok znaczników w `dist/_headers` dokładnymi regułami `immutable` dla obu bundli.
- **When to use:** Po `build:hash` i `build:sw:production`, bezpośrednio przed publikacją.

### build
- **Command:** `npm run build:clean && npm run build:css && npm run build:js && npm run build:hash && npm run build:sw:production && npm run build:dist`
- **What it does:** Uruchamia pełny pipeline produkcyjny od czyszczenia do złożenia `dist`. Kroki są połączone `&&`, więc błąd dowolnego kroku zatrzymuje pipeline.
- **Output:** Kompletne wydanie w `dist/`: bundle `style.<hash>.min.css` i `script.<hash>.min.js`, `build-manifest.json` z ich finalnymi nazwami, produkcyjny `sw.js`, `_headers` z dokładnymi regułami cache obu bundli oraz kopie `assets/`, `services/`, `legal/` i plików z katalogu głównego (`index.html`, `404.html`, `offline.html`, `success.html`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `LICENSE`). Kanoniczne drzewa `css/` i `js/` nie są kopiowane w całości: warstwy CSS i graf modułów `js/main.js` trafiają do produkcji wyłącznie jako bundle adresowane treścią, a pod `dist/js/` trafiają tylko dwa skrypty ładowane bezpośrednio przez strony — `js/theme-init.js` i `js/offline.js`. Katalog `dist/` powstaje lokalnie, nie jest przechowywany w repozytorium i nie jest edytowany ręcznie.
- **When to use:** Standardowa komenda przed wdrożeniem; następnie sprawdź wydanie przez `npm run qa:references -- --scope=release` i obejrzyj je przez `npm run serve:dist`.

### serve
- **Command:** `http-server -c-1 -p 8080`
- **What it does:** Serwuje katalog roboczy projektu na porcie 8080 z wyłączonym cache.
- **When to use:** Lokalny podgląd źródeł (bez budowania `dist`).

### serve:dist
- **Command:** `http-server dist -c-1 -p 8080`
- **What it does:** Serwuje tylko artefakty z katalogu `dist` na porcie 8080 z wyłączonym cache.
- **When to use:** Weryfikacja finalnego pakietu produkcyjnego po `npm run build`.

### qa:lighthouse
- **Command:** `node tools/qa/run-lighthouse.mjs`
- **What it does:** Uruchamia Lighthouse CI collect dla `http://localhost:8080/`, `/services/budowa-domow.html` i `/legal/regulamin.html` oraz zapisuje raporty do `reports/lighthouse`.
- **When to use:** Audyt jakości (performance/SEO/a11y/best practices) przed release.
- **Local server:** Skrypt sam startuje i po zakończeniu zatrzymuje własny `http-server` dla katalogu roboczego (źródeł, nie `dist/`) na porcie 8080, więc nie wymaga osobno uruchomionego `npm run serve`. Gdy port 8080 jest zajęty, przebieg kończy się czytelnym błędem bez ponownego użycia ani zatrzymania cudzego procesu. Niepowodzenie audytu lub serwera kończy polecenie kodem `1`.

### qa:a11y
- **Command:** `node tools/qa/run-pa11y.mjs`
- **What it does:** Uruchamia pa11y dla tych samych trzech adresów co `qa:lighthouse` i zapisuje raporty JSON do `reports/pa11y` (`index.json`, `budowa-domow.json`, `regulamin.json`).
- **When to use:** Kontrola dostępności przed publikacją.
- **Local server:** Ten sam kontrakt lokalnego serwera QA co w `qa:lighthouse`.

### qa:references
- **Command:** `node tools/qa/check-references.mjs`
- **What it does:** W każdym trybie statycznie sprawdza odwołania lokalne deklarowane przez strony HTML, `css/**/*.css`, `manifest.webmanifest` i stałą listę precache z modułu `tools/sw/precache.mjs`, wspólnego z generatorem `build:sw`, a także kontrakt bundli produkcyjnych: własność nazw, brak nazw ze skrótem wpisanych na sztywno w skryptach i dokładnie jeden blok znaczników oraz politykę cache w kanonicznym `_headers`. Kontrola źródeł nie wymaga serwera, przeglądarki ani katalogu `dist/`. Kontrola wydania obejmuje bundle, przepisany HTML, zawężony zestaw plików źródłowych publikowanych obok bundli, `dist/sw.js` i `dist/_headers`.
- **Scopes:** `npm run qa:references` oraz `npm run qa:references -- --scope=auto` zachowują dotychczasowy tryb automatyczny: sprawdzają źródła i dodatkowo wydanie, gdy istnieje `dist/build-manifest.json`; brak manifestu oznacza pominięcie wydania, bez błędu. `npm run qa:references -- --scope=source` sprawdza wszystkie kontrakty źródeł bez sprawdzania dostępności manifestu ani uruchamiania walidacji wygenerowanego wydania. `npm run qa:references -- --scope=release` sprawdza źródła i wymaga walidacji wydania; brak manifestu jest naruszeniem kontraktu z kodem wyjścia `1`.
- **When to use:** Po zmianach ścieżek, nazw plików lub zawartości `assets/`; tryb `source` pozwala sprawdzić źródła niezależnie od istniejących artefaktów, a tryb `release` służy do wymaganej kontroli po `npm run build`, przed publikacją.
- **Reporting and safety:** Polecenie raportuje wybrany zakres oraz wynik kontroli wydania, w tym powód jej pominięcia lub brak wymaganego wydania. Wszystkie tryby wyłącznie odczytują pliki; nie budują ani nie naprawiają artefaktów. Kod `0` oznacza powodzenie wszystkich kontroli wymaganych w danym zakresie, `1` — błędne odwołania lub naruszenia kontraktu, a `2` — nieprawidłowe argumenty (nieobsługiwany zakres, nieznany argument lub sprzeczne deklaracje zakresu) albo błąd wykonania uniemożliwiający ukończenie kontroli.

### qa
- **Command:** `npm run qa:lighthouse && npm run qa:a11y`
- **What it does:** Odpala komplet QA (Lighthouse + pa11y); `qa:a11y` uruchamia się tylko po udanym `qa:lighthouse`.
- **When to use:** Jako quality gate przed wdrożeniem.

### build:head
- **Commands:** `npm run build:head -- --preview` (podgląd) oraz `npm run build:head` (zapis); uruchamiają `node tools/html/build-head.mjs` odpowiednio z `--preview` lub bez argumentów.
- **What it does:** Oba tryby najpierw odczytują i walidują metadane oraz sekcje `<head>` wszystkich zadeklarowanych stron i przygotowują ich pełną treść tym samym rendererem, a następnie z tych samych metadanych przygotowują `sitemap.xml`. Mapa witryny obejmuje, w kolejności wpisów `pages.meta.json`, każdą stronę, której efektywna polityka `robots` (jawna lub domyślna generatora) nie zawiera dyrektywy `noindex` ani `none`, pod adresem `canonical` rozwiązanym względem `siteOrigin` generatora, z polami `lastmod` (data `RRRR-MM-DD`), `changefreq` i `priority` (ciąg zapisywany dosłownie, np. `"1.0"`) z jej wpisu. Pola te są wymagane wyłącznie dla stron indeksowanych, a generator nie aktualizuje dat `lastmod` samodzielnie. Błąd danych wejściowych lub renderowania, w tym brakujące lub nieprawidłowe pole mapy witryny albo adres spoza `siteOrigin`, przerywa pracę przed pierwszym zapisem HTML lub XML. Podgląd wyłącznie raportuje `CHANGED`/`UNCHANGED` dla każdej strony i dla `sitemap.xml` oraz liczbę zmian, bez zapisywania plików; wykryte różnice nie powodują błędu. Tryb zapisu aktualizuje tylko strony i `sitemap.xml` o zmienionej treści i podaje liczby plików zmienionych oraz niezmienionych. Zachowane są szablon i metadane jako źródła generowanej sekcji, skrypty JSON-LD i inicjalizacji motywu, końce linii każdej strony oraz treść poza `<head>`.
- **When to use:** Po zmianach globalnych SEO/meta/head, polityki `robots`, adresów kanonicznych lub danych mapy witryny: najpierw sprawdź zakres przez `--preview`, następnie zastosuj zmiany bez argumentów. Kolejny podgląd powinien wykazać zero zmian; ponowny zapis bez różnic nie modyfikuje plików ani ich czasów modyfikacji. Nieznane, powtórzone i nieobsługiwane argumenty kończą polecenie błędem przed zapisem. `sitemap.xml` jest wersjonowanym plikiem generowanym — nie edytuj go ręcznie; `build:dist` kopiuje go do `dist/` bez zmian.

### lint
- **Command:** `eslint js tools tests sw.template.js vitest.config.mjs`
- **What it does:** Uruchamia ESLint dla przeglądarkowych modułów w `js/`, narzędzi Node w `tools/`, skupionych testów w `tests/`, źródła Service Workera `sw.template.js` i konfiguracji `vitest.config.mjs`.
- **When to use:** Po zmianach w JavaScripcie, przed commitem i przed release.

### test
- **Command:** `vitest run`
- **What it does:** Uruchamia wszystkie pliki `tests/**/*.test.js` zgodnie ze wzorcem `include` w `vitest.config.mjs`; domyślnym środowiskiem jest jsdom, a testy dokumentów Service Workera i odwołań dostępności w HTML deklarują środowisko `node`. Skupione testy obejmują formularz kontaktowy (także wysyłkę produkcyjną z zamockowanym `fetch`), lightbox, nawigację, motyw i jego wczesną inicjalizację, wrappery `js/utils/storage.js`, obsługę dokumentów w `sw.template.js` oraz odwołania dostępności w utrzymywanych stronach HTML; nie wymagają serwera ani przeglądarki.
- **When to use:** Po zmianach w `js/`, `sw.template.js`, utrzymywanych stronach HTML, `tests/` lub powiązanej konfiguracji, przed commitem i przed release.
