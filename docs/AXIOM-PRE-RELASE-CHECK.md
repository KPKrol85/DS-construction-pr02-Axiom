# AXIOM — PRE-RELEASE CHECK

**Projekt:** DS-construction-pr02-Axiom
**Marka demonstracyjna:** Axiom Construction
**Autor:** KP_Code Digital Studio
**Data rozpoczęcia:** 31.10.2026
**Status:** IN PROGRESS
**Cel:** Końcowa weryfikacja projektu przed wydaniem i utworzeniem taga Git.

---

## 1. GitHub Actions — CI

- [x] Workflow CI jest poprawnie wykrywany przez GitHub.
- [x] Automatyczne uruchamianie po `push` do `main` działa.
- [x] `npm ci` przechodzi na GitHub Actions.
- [x] ESLint kończy się sukcesem.
- [x] Wszystkie testy Vitest przechodzą.
- [x] Kontrola referencji źródłowych przechodzi.
- [x] Produkcyjny build kończy się sukcesem.
- [x] Kontrola referencji produkcyjnych przechodzi.
- [x] Cały workflow ma status **SUCCESS**.

## 2. PWA — Manifest

- [x] Zweryfikowano poprawność manifestu.
- [x] `name` i `short_name` są poprawne.
- [x] `start_url` prowadzi do właściwej strony.
- [x] `scope` odpowiada strukturze aplikacji.
- [x] `display` jest właściwie skonfigurowane.
- [x] `theme_color` i `background_color` są odpowiednie.
- [x] Wszystkie ikony istnieją i poprawnie się wyświetlają.
- [x] Instalacja PWA działa na urządzeniu mobilnym.
- [x] Uruchomienie zainstalowanej aplikacji działa poprawnie.

## 3. PWA — Shortcuts

- [x] Sprawdzono wszystkie istniejące skróty w manifeście.
- [x] Nazwy skrótów są czytelne i aktualne.
- [x] Każdy skrót prowadzi do właściwego miejsca.
- [x] Nie występują nieaktualne adresy ani odnośniki.
- [x] Ikony skrótów istnieją i mają odpowiednie parametry.
- [x] Skróty działają po uruchomieniu z zainstalowanej PWA.

## 4. PWA — Screenshots

- [x] Sprawdzono, czy manifest zawiera sekcję `screenshots`.
- [x] Zweryfikowano wszystkie istniejące zrzuty ekranu.
- [x] Screenshoty przedstawiają aktualny wygląd Axiom.
- [x] Zweryfikowano proporcje, rozdzielczość i format plików.
- [x] Sprawdzono poprawność ścieżek do obrazów.
- [x] W razie potrzeby przygotowano nowe screenshoty mobilne.
- [x] W razie potrzeby przygotowano nowe screenshoty desktopowe.
- [x] Po ewentualnej wymianie zweryfikowano manifest ponownie.
- [ ] Sprawdzono aktualność osobnych screenshotów portfolio, jeśli istnieją.

## 5. PWA — Service Worker i Offline

- [x] Service Worker rejestruje się poprawnie.
- [x] Produkcyjne zasoby są prawidłowo obsługiwane przez cache.
- [x] Strona działa po przejściu w tryb offline w przewidzianym zakresie.
- [x] Strona `offline.html` działa poprawnie.
- [x] Aktualizacja aplikacji nie pozostawia nieaktualnych zasobów.
- [x] Zweryfikowano zachowanie aplikacji po ponownym połączeniu z internetem.
- [x] Nie występują błędy Service Workera w konsoli.

## 6. Standard KP_Code Digital Studio

- [x] Axiom Construction jest jednoznacznie przedstawiony jako marka fikcyjna.
- [x] Autorstwo KP_Code Digital Studio jest prawidłowo oznaczone.
- [x] Notka demonstracyjna występuje w stopce wszystkich 15 stron.
- [x] Stopki zachowują spójny wygląd i treść.
- [x] Dane kontaktowe są prawidłowo przypisane autorowi.
- [x] Telefon, e-mail i adres są aktualne.
- [x] Odnośniki `tel:` i `mailto:` działają.
- [x] Na sześciu podstronach usług znajdują się dyskretne noty demonstracyjne.
- [x] Nie występują sprzeczne deklaracje dotyczące fikcyjnej działalności.
- [x] Nie występują zbędne bannery, modale ani powtarzające się komunikaty demonstracyjne.

## 7. Formularz kontaktowy

- [x] Formularz prawidłowo wyświetla się na desktopie.
- [x] Formularz prawidłowo wyświetla się na telefonie.
- [x] Przycisk „Wyślij wiadomość” jest wycentrowany.
- [x] Wszystkie pola mają właściwe etykiety.
- [x] Walidacja wymaganych pól działa.
- [x] Pole wyboru rodzaju zapytania działa poprawnie.
- [x] Zgoda dotycząca polityki prywatności działa.
- [x] Mechanizm antyspamowy działa poprawnie.
- [x] reCAPTCHA działa w środowisku produkcyjnym.
- [x] Netlify Forms odbiera rzeczywiste zgłoszenie testowe.
- [x] Formularz kieruje wiadomości do KP_Code Digital Studio.
- [x] Strona `success.html` działa poprawnie.
- [x] Formularz nie wykazuje błędów w konsoli przeglądarki.

## 8. FAQ i CTA

- [x] Wszystkie cztery pytania FAQ są aktualne.
- [x] Odpowiedzi są zgodne ze standardem KP_Code.
- [x] FAQ działa przy użyciu klawiatury.
- [x] FAQ jest zgodne z danymi strukturalnymi JSON-LD.
- [x] Wszystkie przyciski CTA prowadzą do właściwych miejsc.
- [x] CTA nie sugerują zamawiania rzeczywistych usług Axiom.
- [x] Przyciski końcowych CTA są wycentrowane na sześciu podstronach usług.
- [x] Zawijanie przycisków na urządzeniach mobilnych działa poprawnie.
- [x] Nie występują uszkodzone odnośniki.

## 9. Responsywność i wygląd

Sprawdzić najważniejsze widoki na szerokościach około 375 px, 768 px i 1280 px oraz dodatkowo 320 px dla wąskich ekranów.

- [X] Strona główna wygląda poprawnie.
- [X] Wszystkie sześć podstron usług wygląda poprawnie.
- [X] Formularz kontaktowy wygląda poprawnie.
- [X] FAQ wygląda poprawnie.
- [X] Galeria działa poprawnie.
- [X] Nawigacja mobilna działa poprawnie.
- [X] Stopki są responsywne.
- [X] Motyw jasny działa poprawnie.
- [X] Motyw ciemny działa poprawnie.
- [X] Motyw systemowy działa poprawnie.
- [X] Nie występuje niepożądane poziome przewijanie.
- [X] Obrazy zachowują prawidłowe proporcje.
- [X] Nie występują regresje wizualne.

## 10. SEO i metadane

- [x] Każda strona ma poprawny `title`.
- [x] Opisy `meta description` są aktualne.
- [x] Adresy canonical są prawidłowe.
- [x] Metadane Open Graph są zgodne z charakterem projektu.
- [x] Metadane Twitter/X są aktualne.
- [x] Dane strukturalne JSON-LD są poprawne.
- [x] Fikcyjna działalność nie jest przedstawiana jako rzeczywista firma.
- [x] `sitemap.xml` zawiera właściwe adresy.
- [x] `robots.txt` jest poprawny.
- [x] Nie występują nieaktualne adresy URL.

## 11. Dostępność — Accessibility

- [x] Nawigacja klawiaturą działa.
- [x] Fokus interaktywnych elementów jest widoczny.
- [x] Kontrasty tekstów są prawidłowe.
- [x] Formularz ma poprawne etykiety i komunikaty.
- [x] Obrazy mają odpowiednie teksty alternatywne.
- [x] Hierarchia nagłówków jest logiczna.
- [x] Elementy interaktywne mają właściwe nazwy dostępności.
- [x] Wykonano dostępne testy automatyczne.
- [x] Zweryfikowano najważniejsze interakcje ręcznie.

## 12. Produkcyjny build i QA

- [x] `npm run lint` — PASS.
- [x] `npm test` — PASS.
- [x] `npm run qa:references -- --scope=source` — PASS.
- [x] `npm run build` — PASS.
- [x] `npm run qa:references -- --scope=release` — PASS.
- [ ] Produkcyjny katalog `dist/` zawiera wymagane pliki.
- [ ] Zweryfikowano poprawność wygenerowanych ścieżek.
- [ ] Sprawdzono konsolę przeglądarki pod kątem błędów.
- [ ] Wykonano końcowy pomiar Lighthouse.
- [ ] Sprawdzono podstawowe wskaźniki wydajności.
- [ ] Nie wykryto krytycznych regresji.

## 13. Dokumenty i strony pomocnicze

- [ ] Regulamin odpowiada demonstracyjnemu charakterowi projektu.
- [ ] Polityka prywatności opisuje rzeczywiste działanie formularza.
- [ ] Polityka cookies jest aktualna.
- [ ] Strona certyfikatów zawiera poprawne informacje.
- [ ] Strona kariery nie sugeruje aktywnej, rzeczywistej rekrutacji.
- [ ] Strona `404.html` działa poprawnie.
- [ ] Strona `offline.html` działa poprawnie.
- [ ] README odpowiada aktualnemu projektowi.
- [ ] CHANGELOG zawiera wymagane wpisy.
- [ ] Dokumentacja nie zawiera nieaktualnych instrukcji.

---

## 14. Raport audytu

**Etap pierwszy: analiza bez modyfikowania plików.**

- [ ] KODEK wykonał audyt wszystkich wymienionych obszarów.
- [ ] Przygotowano listę wyników PASS.
- [ ] Przygotowano listę problemów FIX.
- [ ] Wskazano kwestie wymagające decyzji właściciela — REVIEW.
- [ ] Każdy problem ma przypisany plik, lokalizację lub sposób odtworzenia.
- [ ] Zweryfikowano, czy proponowane poprawki mieszczą się w zakresie zadania.
- [ ] Właściciel projektu zatwierdził zakres poprawek.

### Wyniki audytu

**PASS:**
Do uzupełnienia.

**FIX:**
Do uzupełnienia.

**REVIEW:**
Do uzupełnienia.

---

## 15. Poprawki po audycie

**Ten etap realizujemy wyłącznie wtedy, gdy audyt wykaże rzeczywiste problemy.**

- [ ] Przygotowano minimalny plan zmian.
- [ ] Właściciel zatwierdził plan.
- [ ] Wprowadzono wyłącznie zatwierdzone poprawki.
- [ ] Nie zmieniono niepowiązanych komponentów.
- [ ] Nie naruszono standardu KP_Code Digital Studio.
- [ ] Ponownie przeprowadzono wymagane testy.
- [ ] Zweryfikowano poprawione elementy w przeglądarce.
- [ ] Zmiany zostały przejrzane i zaakceptowane.

---

## 16. Final Release Gate

**Warunki wymagane przed utworzeniem taga Git.**

- [ ] Wszystkie problemy krytyczne zostały rozwiązane.
- [ ] Nie pozostały niezaakceptowane problemy blokujące wydanie.
- [ ] Finalny build produkcyjny przechodzi.
- [ ] GitHub Actions ma status SUCCESS dla finalnego commita.
- [ ] Produkcyjna wersja na Netlify została zweryfikowana po ręcznym wdrożeniu.
- [ ] Formularz produkcyjny został przetestowany.
- [ ] PWA działa prawidłowo.
- [ ] Shortcuts i screenshots są aktualne.
- [ ] Standard KP_Code Digital Studio jest zachowany.
- [ ] Dokumentacja jest aktualna.
- [ ] Wszystkie zatwierdzone zmiany zostały zacommitowane.
- [ ] Drzewo robocze Git jest czyste.
- [ ] Właściciel projektu zatwierdził wydanie.

### Git Tag

- [ ] Ustalono numer wersji.
- [ ] Utworzono tag Git.
- [ ] Wypchnięto tag do GitHub.
- [ ] Zweryfikowano tag w repozytorium.

---

## Final Status

**Audit:** PENDING
**Critical Issues:** UNKNOWN
**GitHub Actions:** PENDING FINAL VERIFICATION
**Production Verification:** PENDING
**Release Approval:** PENDING
**Git Tag:** NOT CREATED

**Project:** DS-construction-pr02-Axiom
**Owner:** KP_Code Digital Studio

---

*KP_Code Digital Studio — Professional presentation. Clear ownership. Minimal disclosure.*

*Release principle: verify first, fix only what is necessary, approve before tagging.*
