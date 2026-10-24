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

- **Affected area:** Design tokens and section backgrounds on the home, service, legal and utility pages and in the footer.
- **Evidence:** `css/tokens/tokens.css:27-38`, `:113-124`; `css/sections/about.css:3-6`; `css/sections/services.css:1-10`; `css/sections/gallery.css:1-11`; `css/sections/services-subpages.css:1-7`, `:175-184`; `css/sections/contact.css:9-30`; `css/sections/faq.css:2-8`; `css/sections/testimonials.css:1-7`; `css/sections/legal.css:1-4`; `css/layout/layout.css:459-472`, `:660-672`
- **Current state:** The light `--surface-1/2/3` tokens mix two colours at a combined 16%, 32% and 48%, so they compute to translucent colours (alpha 0.16, 0.32 and 0.48, confirmed in the browser); the dark values exceed 100% and compute opaque. Because the lightness order of surface-1 to surface-3 inverts between themes, home sections remap their surfaces in dark theme (services, gallery, contact and service CTAs), while the service intro, service details and legal sections do not, so the service-page intro/details lightness order flips between themes. The footer uses a hard-coded `#0a0a0a` in dark theme and the footer bar uses `#1a1a1a` with `#c8c8c8` text in both themes. The gallery's top rule references the undefined `--text-dark` and is not rendered, while sibling sections render theirs.
- **Proposed improvement:** Introduce role-based surface tokens (for example page, section base, section alternate, section emphasis, footer and footer bar) defined per theme as opaque values that reproduce the currently rendered colours, and have every section reference a role instead of a numbered surface with theme-specific overrides. Section top rules use one shared rule token.
- **Expected value:** A predictable section rhythm in both themes, no per-section dark-theme background overrides, correct defaults for future sections and nested surfaces that no longer depend on implicit `color-mix()` alpha behaviour.
- **Implementation scope:** `css/tokens/tokens.css` and the background and top-rule declarations of the listed section and footer rules. Preserve rendered colours unless an adjustment is approved, text and focus contrast on each surface, the header's glass treatment and the lightbox's fixed-dark presentation.
- **Acceptance criteria:** Section stylesheets contain no `[data-theme="dark"]` background overrides; all surface tokens compute to opaque colours in both themes; home and service pages follow the same documented alternation of surface roles in both themes; every section that declares a top rule renders it, including the gallery; computed backgrounds on `index.html`, one service page, one legal page and `404.html` match the current values in both themes or differ only by approved adjustments.
- **Impact:** Medium
- **Effort:** Medium

### IMP-UI-05 — Recompose the legal document template as a flat Dossier document column

- **Affected area:** Shared legal template on `legal/regulamin.html`, `legal/polityka-prywatnosci.html`, `legal/polityka-cookies.html`, `legal/certyfikaty.html` and `legal/kariera.html`.
- **Evidence:** `css/sections/legal.css:1-47`, `:64-102`, `:121-147`, `:325-333`, `:351-357`, `:385-395`; `css/base/base.css:122-143`; `legal/regulamin.html:148-199`
- **Current state:** Each document sits in an elevated card (`--bg-legal-card`, border, `--radius-2`, shadow and transitions) on a surface-1 section. The title carries a static copy of the shared section-title gradient-and-glow rule, the lead is centred, and the table of contents is a separately bordered box nested inside the card. Per-heading `↑` return links (17, 14 and 9 instances on the three policy documents) rest at 15% opacity and reach full opacity only on hover or focus, so touch users see them only in their faint resting state. Certificate subsections and cards are further bordered, rounded boxes.
- **Proposed improvement:** Present legal documents as a flat, measured document column on the section surface: no elevated card, the table of contents as a ruled numbered register, the title using the shared section-title component instead of a duplicate rule, return links shown at a readable secondary emphasis at rest, and certificate entries ruled rather than nested in boxes while keeping the demonstration notice distinct.
- **Expected value:** The five legal pages share the visual language of the rest of the site, long documents read as one continuous column with fewer nested containers, and return links are usable without hover.
- **Implementation scope:** `css/sections/legal.css`, plus class reuse in the five legal pages only where needed to share the section-title component. Preserve all IDs, anchors and table-of-contents targets, table overflow containment and the focusable table wrapper, the disabled careers form, the certificate notice semantics, breadcrumbs, content and `noindex` metadata.
- **Acceptance criteria:** Legal pages render without an elevated card or box-shadow at any width in either theme; the title rule is defined once in `css/`; table-of-contents entries and document content share one left edge from tablet width upwards; return links are visible at rest in both themes and keep their accessible names; legal tables still scroll inside their wrapper at 320px with no horizontal page overflow.
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
