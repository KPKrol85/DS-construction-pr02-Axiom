# Axiom — UI Improvements

**Analysis date:** 2026-10-23
**Project type:** Static multi-page marketing website for a fictional construction company (vanilla HTML, layered CSS, ES-module JavaScript, PWA), 15 maintained pages
**Analysis mode:** Evidence-based UI improvement review
**Focus:** Project-wide UI

## Improvement overview

The completed IMP-DESIGN-01–05 work established the Construction Dossier direction (flat, ruled, left-aligned compositions without elevation or hover lift) for the hero, About, service catalogue, service pages, galleries, contact passage and footer. Those areas are consistent and tokenised at the section level.

The remaining opportunities sit at the edges of that work: home-page FAQ and testimonials and the legal document template still use the earlier elevated-card language; shared buttons keep lift-based hover states; focus rings are defined through many per-component recipes; and the surface tokens do not carry a stable meaning across themes, which forces per-section dark-theme remapping. Each proposal below extends or consolidates the existing system rather than replacing it.

## Proposed improvements

### IMP-UI-01 — Introduce theme-aware focus-ring tokens for all interactive elements

- **Status:** COMPLETED — implemented and verified.
- **Result:** Centralized keyboard-focus styling through shared, theme-aware color, width and offset tokens. Consolidated component overrides, restored the navigation-toggle indicator and preserved the inset FAQ focus ring. Added two-tone indicators for lightbox and scroll-top controls and addressed footer focus clipping. Existing focus traps, validation outlines and forced-colors support were preserved.
- **Verification:** Headless Chrome checks at 320px and 1440px in both themes confirmed at least 3:1 ring-to-surface contrast for sampled controls, visible keyboard focus and working modal/lightbox focus traps. Forced-colors emulation, `qa:references` and `git diff --check` passed. Firefox, Safari and assistive technologies were not tested.
- **Impact:** High
- **Effort:** Medium

### IMP-UI-02 — Bring the home FAQ and testimonials into the Construction Dossier ruled register

- **Status:** COMPLETED — implemented and verified.
- **Result:** Replaced elevated FAQ and testimonial cards with flat, ruled entries using theme-aware tokens. Added a CSS-drawn FAQ disclosure indicator, improved answer typography and preserved keyboard focus. Consolidated testimonial styling, introduced `.testimonials__attribution` and retained native disclosure, structured data and reveal behavior.
- **Verification:** Static CSS and markup checks, `qa:references`, HTML accessibility reference tests (26/26) and `git diff --check` passed. Focused Chrome checks at 320px confirmed FAQ keyboard operation, visible focus and no horizontal overflow. Testimonial reveal animation, other viewports and cross-browser behavior were not visually verified.
- **Impact:** High
- **Effort:** Medium

### IMP-UI-03 — Consolidate button variants into a flat, token-driven state model

- **Status:** COMPLETED — implemented and verified.
- **Result:** `.btn` now owns typeface, line height, label size and padding, so `<a>` and `<button>` buttons share one height; hover and active states change only the static blue/orange gradient stops (primary) or the `--feature-accent` fill and outline (ghost), with no translation or shadow, and linked buttons no longer inherit the global link recolour and fade. The unused `btn-secondary` and the undefined `--text-light` reference were removed, and utility-page buttons keep a 240px minimum column width without page-level colour or label-size overrides.
- **Verification:** Static checks confirmed no `transform` or hover/active `box-shadow` in `buttons.css` and that all referenced tokens are defined; `qa:references`, the Vitest suite (85/85) and `git diff --check` passed. Focused built-in browser checks of `offline.html`, `404.html`, `services/budowa-domow.html` and the home contact form in both themes at 320px (utility pages also at 1280px) confirmed readable variants at rest (ghost text contrast 9.7:1 or higher, primary 6:1 or higher), the IMP-UI-01 focus ring on keyboard focus and no horizontal overflow. Pointer hover was checked on `offline.html` only; the disabled careers button, other pages and other browsers were not checked in the browser.
- **Impact:** Medium
- **Effort:** Medium

### IMP-UI-04 — Define role-based section surface tokens with stable meaning across themes

- **Status:** COMPLETED — implemented and verified.
- **Result:** `tokens.css` defines opaque per-theme roles (`--surface-page`, `--surface-section`, `-alt`, `-emphasis`, `-subtle`, `--surface-footer`, `--surface-footer-bar`) and a shared theme-aware `--section-rule`; top-level sections, the utility-page panel and the footer reference these roles, and the section and footer dark-theme background overrides and `--footer-bg` were removed. Light roles reproduce the former translucent layers composited over the page, the `subtle` role keeps the service-intro, legal and utility surfaces unchanged, and `--surface-1/2/3` remain for nested components.
- **Verification:** Computed-style checks in the built-in browser on `index.html`, `services/budowa-domow.html`, `legal/polityka-prywatnosci.html` and `404.html` in both themes at 320px showed opaque section, footer and footer-bar backgrounds identical to the baseline, rendered top rules including the gallery, focus-ring tokens at 4:1 or more on every role and no horizontal overflow; `qa:references`, Vitest (85/85) and `git diff --check` passed. The only visual changes are the restored gallery rule and the services rule moving to the shared token; live keyboard focus, other pages and other browsers were not checked.
- **Impact:** Medium
- **Effort:** Medium

### IMP-UI-05 — Recompose the legal document template as a flat Dossier document column

- **Status:** COMPLETED — implemented and verified.
- **Result:** Replaced the outer legal card with a measured, left-aligned document column on the existing section surface. All five titles reuse `.section__title`; numbered contents and certificate entries use theme-aware rules, return links remain visible at rest, and the distinct demonstration notice and existing document contracts are preserved.
- **Verification:** Static comparison confirmed that HTML changes are limited to the five heading class attributes; `qa:references`, HTML accessibility reference tests (26/26) and `git diff --check` passed. Focused Chrome checks of the cookies policy, certificates and careers at 320px and 1280px with representative light/dark themes confirmed column alignment, visible return links, unclipped keyboard focus, local keyboard scrolling of the wide table, responsive certificate entries, the disabled careers form and no horizontal page overflow. Other pages, other browsers and a production build were not checked.
- **Impact:** Medium
- **Effort:** Medium

## Selection summary

These five proposals were selected because they address the only interface areas and shared mechanisms that the completed design work did not reach, and each extends an existing project pattern instead of introducing a new one.

IMP-UI-01 and IMP-UI-04 are token-level changes; IMP-UI-02, IMP-UI-03 and IMP-UI-05 benefit from them but do not depend on them. Implementing IMP-UI-01 first avoids redefining focus styles in the later component work, and implementing IMP-UI-04 before IMP-UI-02 or IMP-UI-05 avoids restyling those sections twice. Each proposal can otherwise be implemented and verified independently.

Primary-navigation hover and current-page presentation was also reviewed. It was not proposed because its main issue is the pointer-events defect listed below, which belongs in an audit rather than an optional improvement.

## Analysis limitations

The analysis was primarily static. Browser evidence was limited to computed-style queries in the built-in browser against a local static server for `offline.html`, `services/budowa-domow.html` and `index.html#faq`. The pane reported a zero-width viewport, so no screenshots, responsive rendering, hover, keyboard-focus or contrast measurements were performed, and no tests or builds were run.

The following defects were observed and excluded from the proposals; they belong in an audit or a separate fix:

- `css/sections/error.css:39-45` forces white text on all utility-page buttons; on `offline.html` in light theme the ghost "Spróbuj ponownie" button computes to white text on a transparent button over a near-white surface.
- `css/components/utilities.css:25-30` sets `pointer-events: none` on every `a[aria-current="page"]`; on service pages this disables pointer activation of the "Usługi" navigation link, which points to `../index.html#uslugi` (confirmed by computed style).
- `css/sections/legal.css:49-52` and `:164-169` style inline legal links in the body colour without underline, making them visually indistinguishable from the surrounding text (source-visible).
- Undefined custom properties are referenced at `css/base/base.css:38`, `css/sections/gallery.css:4`, `css/sections/support.css:5` and `:9` (`--text-dark`, `--text-light`), `css/components/buttons.css:150` (`--text-light`), `css/sections/faq.css:113` (`--text-mute`) and `css/sections/error.css:4-5` (`--header-height`, falling back to 80px instead of the 56px `--header-h`).
- `css/sections/faq.css:34` clips `.faq__item` overflow while `.faq__question` draws its focus outline 3px outside its box, which may clip the ring; this requires runtime confirmation.
