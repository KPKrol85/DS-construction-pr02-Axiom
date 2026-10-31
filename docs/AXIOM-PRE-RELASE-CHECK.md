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

- [ ] Sprawdzono, czy manifest zawiera sekcję `screenshots`.
- [ ] Zweryfikowano wszystkie istniejące zrzuty ekranu.
- [ ] Screenshoty przedstawiają aktualny wygląd Axiom.
- [ ] Zweryfikowano proporcje, rozdzielczość i format plików.
- [ ] Sprawdzono poprawność ścieżek do obrazów.
- [ ] W razie potrzeby przygotowano nowe screenshoty mobilne.
- [ ] W razie potrzeby przygotowano nowe screenshoty desktopowe.
- [ ] Po ewentualnej wymianie zweryfikowano manifest ponownie.
- [ ] Sprawdzono aktualność osobnych screenshotów portfolio, jeśli istnieją.

## 5. PWA — Service Worker i Offline

- [ ] Service Worker rejestruje się poprawnie.
- [ ] Produkcyjne zasoby są prawidłowo obsługiwane przez cache.
- [ ] Strona działa po przejściu w tryb offline w przewidzianym zakresie.
- [ ] Strona `offline.html` działa poprawnie.
- [ ] Aktualizacja aplikacji nie pozostawia nieaktualnych zasobów.
- [ ] Zweryfikowano zachowanie aplikacji po ponownym połączeniu z internetem.
- [ ] Nie występują błędy Service Workera w konsoli.

## 6. Standard KP_Code Digital Studio

- [ ] Axiom Construction jest jednoznacznie przedstawiony jako marka fikcyjna.
- [ ] Autorstwo KP_Code Digital Studio jest prawidłowo oznaczone.
- [ ] Notka demonstracyjna występuje w stopce wszystkich 15 stron.
- [ ] Stopki zachowują spójny wygląd i treść.
- [ ] Dane kontaktowe są prawidłowo przypisane autorowi.
- [ ] Telefon, e-mail i adres są aktualne.
- [ ] Odnośniki `tel:` i `mailto:` działają.
- [ ] Na sześciu podstronach usług znajdują się dyskretne noty demonstracyjne.
- [ ] Nie występują sprzeczne deklaracje dotyczące fikcyjnej działalności.
- [ ] Nie występują zbędne bannery, modale ani powtarzające się komunikaty demonstracyjne.

## 7. Formularz kontaktowy

- [ ] Formularz prawidłowo wyświetla się na desktopie.
- [ ] Formularz prawidłowo wyświetla się na telefonie.
- [ ] Przycisk „Wyślij wiadomość” jest wycentrowany.
- [ ] Wszystkie pola mają właściwe etykiety.
- [ ] Walidacja wymaganych pól działa.
- [ ] Pole wyboru rodzaju zapytania działa poprawnie.
- [ ] Zgoda dotycząca polityki prywatności działa.
- [ ] Mechanizm antyspamowy działa poprawnie.
- [ ] reCAPTCHA działa w środowisku produkcyjnym.
- [ ] Netlify Forms odbiera rzeczywiste zgłoszenie testowe.
- [ ] Formularz kieruje wiadomości do KP_Code Digital Studio.
- [ ] Strona `success.html` działa poprawnie.
- [ ] Formularz nie wykazuje błędów w konsoli przeglądarki.

## 8. FAQ i CTA

- [ ] Wszystkie cztery pytania FAQ są aktualne.
- [ ] Odpowiedzi są zgodne ze standardem KP_Code.
- [ ] FAQ działa przy użyciu klawiatury.
- [ ] FAQ jest zgodne z danymi strukturalnymi JSON-LD.
- [ ] Wszystkie przyciski CTA prowadzą do właściwych miejsc.
- [ ] CTA nie sugerują zamawiania rzeczywistych usług Axiom.
- [ ] Przyciski końcowych CTA są wycentrowane na sześciu podstronach usług.
- [ ] Zawijanie przycisków na urządzeniach mobilnych działa poprawnie.
- [ ] Nie występują uszkodzone odnośniki.

## 9. Responsywność i wygląd

Sprawdzić najważniejsze widoki na szerokościach około 375 px, 768 px i 1280 px oraz dodatkowo 320 px dla wąskich ekranów.

- [ ] Strona główna wygląda poprawnie.
- [ ] Wszystkie sześć podstron usług wygląda poprawnie.
- [ ] Formularz kontaktowy wygląda poprawnie.
- [ ] FAQ wygląda poprawnie.
- [ ] Galeria działa poprawnie.
- [ ] Nawigacja mobilna działa poprawnie.
- [ ] Stopki są responsywne.
- [ ] Motyw jasny działa poprawnie.
- [ ] Motyw ciemny działa poprawnie.
- [ ] Motyw systemowy działa poprawnie.
- [ ] Nie występuje niepożądane poziome przewijanie.
- [ ] Obrazy zachowują prawidłowe proporcje.
- [ ] Nie występują regresje wizualne.

## 10. SEO i metadane

- [ ] Każda strona ma poprawny `title`.
- [ ] Opisy `meta description` są aktualne.
- [ ] Adresy canonical są prawidłowe.
- [ ] Metadane Open Graph są zgodne z charakterem projektu.
- [ ] Metadane Twitter/X są aktualne.
- [ ] Dane strukturalne JSON-LD są poprawne.
- [ ] Fikcyjna działalność nie jest przedstawiana jako rzeczywista firma.
- [ ] `sitemap.xml` zawiera właściwe adresy.
- [ ] `robots.txt` jest poprawny.
- [ ] Nie występują nieaktualne adresy URL.

## 11. Dostępność — Accessibility

- [ ] Nawigacja klawiaturą działa.
- [ ] Fokus interaktywnych elementów jest widoczny.
- [ ] Kontrasty tekstów są prawidłowe.
- [ ] Formularz ma poprawne etykiety i komunikaty.
- [ ] Obrazy mają odpowiednie teksty alternatywne.
- [ ] Hierarchia nagłówków jest logiczna.
- [ ] Elementy interaktywne mają właściwe nazwy dostępności.
- [ ] Wykonano dostępne testy automatyczne.
- [ ] Zweryfikowano najważniejsze interakcje ręcznie.

## 12. Produkcyjny build i QA

- [ ] `npm run lint` — PASS.
- [ ] `npm test` — PASS.
- [ ] `npm run qa:references -- --scope=source` — PASS.
- [ ] `npm run build` — PASS.
- [ ] `npm run qa:references -- --scope=release` — PASS.
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
