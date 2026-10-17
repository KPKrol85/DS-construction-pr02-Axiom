# Axiom — Design Improvements

**Analysis date:** 2026-10-16  
**Project type:** Static multi-page demonstration website for a fictional construction and renovation brand, built with HTML, CSS and vanilla JavaScript ES modules  
**Status:** In progress — IMP-DESIGN-01 to IMP-DESIGN-04 completed; IMP-DESIGN-05 remains proposed  
**Analysis mode:** Evidence-based creative design review  
**Focus:** Project-wide design

## 1. Methodology and evidence

Reviewed the home-page composition, the six service-page structures, shared header/footer, gallery/lightbox, FAQ, contact form, project-information dialog, and supporting-page presentation. Source inspection concentrated on `index.html`, the representative `services/budowa-domow.html`, shared CSS and interaction modules; headings, section structure and demonstration notices were also inspected across service, legal and utility pages. This was not an exhaustive line-by-line review of every page.

Context reviewed: `AGENTS.md`, `README.md`, `docs/settings.md`, `docs/CHANGELOG.md`, `THIRD-PARTY-NOTICES.md`, `package.json`, and the existing archives `docs/archive/plans/PLAN-2026-09-02.md`, `docs/archive/audits/AUDIT-2026-09-04.md` and `docs/archive/audits/daily-AUDIT-2026-09-02.md`. No existing `IMPROVEMENTS-DESIGN.md`, other improvement reports, active root plan or project-context file was found in the inspected inventory. The archived plan records its phases and optional improvements as complete. No historical design-improvement report was found; completed technical work and the certificates redesign are not proposed again.

Evidence labels:

- **Source:** current canonical HTML, CSS, JavaScript, asset references and executable configuration. File references below include selectors or section identifiers to make evidence locatable.
- **Historical:** archived plan/audits and changelog entries; these establish previous work, not current rendering.
- **Design judgment:** professional interpretation and future creative recommendations. All conclusions about perceived hierarchy, repetition, atmosphere and balance are provisional until rendered review.
- **Runtime / Visual:** reserved for observed application behavior or directly inspected project visuals. Neither is claimed for the page design in this review.

**Direct visual inspection did not occur.** The repository preview server started, but browser inspection could not be completed: the Playwright wrapper encountered a sandbox directory-access error, its default Chromium executable was unavailable, a direct launch using installed Edge terminated, and the in-app browser timed out connecting to the local server. No screenshots, mockups or image assets were visually reviewed. No dependencies or browsers were installed. The analysis therefore supports a source-grounded direction and bounded proposals, not final approval of typography, image selection, crops, tonal relationships or responsive compositions.

## 2. Executive design assessment

**Source:** Axiom already has a usable visual foundation: blue/orange brand colors, a Montserrat/Lato pairing, shared surface and spacing tokens, photography throughout the main offering, and common presentation across marketing and supporting pages. Theme initialization, reduced-motion rules, semantic FAQ elements and dedicated interaction modules provide contracts worth retaining (`css/tokens/tokens.css`, `css/base/base.css`, `js/theme-init.js`, `js/components/`, `index.html#faq`).

**Design judgment:** The principal creative limitation suggested by the source is an insufficient distinction between editorial roles. About highlights, service offerings, testimonials, process steps and FAQ entries rely on variants of rounded panels, shadows and centered headings. The hero uses one uppercase title panel rather than a differentiated brand statement and service descriptor. These are coherent existing choices, not confirmed defects; their combined effect needs visual confirmation.

The most useful next direction is **Axiom — Construction Dossier**: express construction through alignment, sectional rules, readable service information, existing process numbering and deliberately presented images. This would give the demonstration a recognizable organizing principle without a new logo, new font family, invented projects or an architectural rewrite. The objective is clearer authorship of the visual language, not an unsupported claim of increased conversion or premium market positioning.

## 3. Current design identity

### Brand and first impression

**Source:** `index.html` identifies the offering as “Budownictwo • Remonty • Wykończenia wnętrz.” The hero is a full-background picture with an uppercase, centered `h1`; its content consists of the brand name, a forced line break and an accented service descriptor. The header combines a logo, navigation and theme control. `index.html#cookieBanner` explicitly identifies the site as a KP_Code Digital Studio demonstration; `legal/regulamin.html#tos-3` identifies Axiom as fictional.

**Design judgment:** The demonstrated construction vocabulary supports precision and organized delivery as a visual theme. It does not establish a real company's positioning, audience research, geographical market or verified project history. Preserve the demonstration disclosure and avoid presenting example claims as proof of business performance.

### Typography and editorial hierarchy

**Source:** `css/tokens/tokens.css` declares Montserrat at 400/600 and Lato at 400/700. `css/base/base.css` assigns Montserrat to headings and Lato to body text. The hero overrides its heading to `--fs-4`; general section titles use `--fs-5`. Wide tracking and uppercase treatments appear in the hero, about highlights, primary buttons and form labels. `THIRD-PARTY-NOTICES.md` records the two font families and their bundled license texts.

**Design judgment:** Retain the pairing and use hierarchy, measure, weight and alignment to create a more specific editorial voice. The declared scale alone cannot establish actual line wrapping, Polish glyph rendering or perceived prominence. No font-loading or glyph defect is asserted.

### Composition and rhythm

**Source:** The home sequence is hero → about → services → testimonials → gallery → FAQ → contact → footer. `.about__grid` remains one column in its owning stylesheet; its highlights become two columns at 1024px. Service cards use an automatic grid with a 300px minimum. Testimonials use an automatic grid with a 260px minimum. Generic sections receive large vertical padding (`css/base/base.css`, `css/sections/about.css`, `services.css`, `testimonials.css`).

**Design judgment:** The source suggests an opportunity to distinguish introduction, offering, example imagery and practical closure through composition instead of giving each another panel variant. Actual excess whitespace, page length and density have not been observed.

### Color, material and component language

**Source:** The core colors are `--primary: #0f4c81` and `--accent: #e6762d`. Light/dark surface formulas are defined separately. Header/navigation use layered backgrounds and, in some conditions, blur; the hero title uses blur, translucency and shadow; primary buttons and section-title rules use gradients. Service cards, highlights, testimonials, FAQ and legal containers reuse rounded surfaces (`css/tokens/tokens.css`, `css/layout/layout.css`, `css/components/buttons.css`, section styles).

**Design judgment:** The combination supports a restrained construction-document direction if expressive effects are assigned a clear role. A broad replacement of all corners or shadows is not justified. No contrast compliance, unreadability or incorrect theme rendering has been verified.

### Imagery and visual storytelling

**Source:** Hero and about markup describe a working crew and a coordination meeting. Service imagery identifies the six trades. Home gallery alternatives describe renovations, buildings, interiors and installations; thumbnails share a 4:3 crop with `object-fit: cover` (`index.html`, `css/sections/gallery.css`). `js/components/lightbox.js` builds gallery order from `.gallery__container .gallery__link` and derives captions from image alternatives. A preview caption should therefore not be implemented by casually replacing alt text.

**Design judgment:** Work, materials and completed spaces could form a stronger image narrative than a uniform thumbnail catalogue. Asset names and alt text do not verify their subjects visually, their provenance, rights or any relationship between different images. No current crop is judged successful or defective here.

### Motion and responsive art direction

**Source:** The hero title animates on entry; sections use IntersectionObserver reveal logic, and several components move on hover. Global reduced-motion rules and local overrides exist (`js/sections/hero.js`, `css/base/base.css`, section styles). Hero rules change height at 480px and 760px and image position at 760px. Navigation changes at 900px; service introductions become two columns at 1024px (`css/sections/hero.css`, `css/layout/layout.css`, `css/sections/services-subpages.css`).

**Design judgment:** Responsive composition deserves explicit review rather than assuming the existing stacking rules settle art direction. No extra motion is needed to express the recommended concept. Preserve the fallback that makes reveal content accessible without JavaScript.

### Closing composition and supporting pages

**Source:** The home contact form sits in a centered container capped at 500px. The footer supplies brand, service links, information links, contact details and KP_Code social destinations. Service pages have a final CTA linking to the existing home contact area. Legal pages share a prose container and document typography; utility pages share a centered status treatment (`index.html#kontakt`, `css/sections/contact.css`, `css/layout/layout.css`, `css/sections/services-subpages.css`, `legal.css`, `error.css`). The certificates page already presents explicitly demonstrational categories and notices.

**Design judgment:** Contact and footer can form a more deliberate editorial ending while preserving their different purposes. Legal and utility pages need proportionate continuity, not separate showcase compositions. The completed certificates presentation should remain intact.

## 4. Design prerequisites

No material source-confirmed design defect was established. Two bounded prerequisites affect later creative approval:

| Prerequisite | Evidence | Follow-up boundary |
| --- | --- | --- |
| Obtain a rendered baseline before committing to composition and color decisions | Browser inspection failed in this environment; no viewport or theme was visually inspected | Review current canonical sources in a working browser before implementing the proposed direction. Confirm or reduce proposals if their predicted limitations are not present. This is an evaluation dependency, not a site defect. |
| Approve the image selection and permitted descriptive claims before featuring images as a narrative | Current markup supplies image links and alternatives; the project declares a fictional brand. Reviewed attribution documentation covers fonts/icons and does not establish a photography-rights record | For IMP-DESIGN-04, confirm reuse rights and demonstration treatment for selected assets. Do not infer that rights are absent, commission imagery, source replacements or invent project relationships. Apply the same gate to any replacement hero image. |

The historical service-worker revision finding belongs to delivery verification. It is not a creative proposal or a reason to regenerate output during this review; its current status was not re-tested. Future visual inspection should use a fresh browser context or otherwise establish that current canonical resources are being rendered.

## 5. Creative design directions

Both directions below are advisory interpretations of the existing construction content, not verified brand requirements.

| Dimension | Axiom — Construction Dossier | Axiom — Workshop to Finished Space |
| --- | --- | --- |
| Philosophy | An ordered record of scope, method and example outcomes | A photographic account of craft, materials and finished environments |
| Typography | Existing families; explicit title, descriptor, body and process-number roles | Existing families; quieter labels and more image-adjacent prose |
| Color and material | Existing blue/orange, calm paper-like light surfaces and graphite dark surfaces; rules mark sections | Existing palette recedes around larger photographs; image tone carries more atmosphere |
| Composition | Aligned introductions, readable service entries, sequential process strips, selective featured images | Larger image/text passages with fewer repeated boxes |
| Imagery | Existing assets selected by role; no implied case study without evidence | Requires a coherent, approved set capable of sustaining the story |
| Motion | Restrained state and entry feedback | Restrained image transitions; no autoplay or parallax |
| Mobile | Title → image → supporting copy; readable process sequence and gallery order | Image-led passages with individually approved narrow crops |
| Strength | Connects to existing numbered process content and shared CSS without relying on new assets | Could express the physical character of construction more directly |
| Trade-off | Must avoid decorative pseudo-technical clutter and excessively small labels | Greater dependence on image quality, provenance and visual consistency, currently unverified |
| Technical implications | Local HTML/CSS changes within existing layers and image workflow | Same stack, but potentially greater media and responsive-image work |

## 6. Recommended direction

Recommend **Axiom — Construction Dossier**, subject to rendered baseline review. Existing service descriptions and numbered cooperation stages support the concept directly (`services/budowa-domow.html#svc-scope-heading` and corresponding service structures). It can produce distinction through editorial decisions even if all currently referenced assets are retained.

Preserve the logo, blue/orange identity, Montserrat/Lato pairing, Polish content, routes, section anchors, both theme editions and system preference behavior. Keep semantic HTML, useful DOM order, forms, lightbox selectors, disclosure behavior, focus management, stored state and build ownership. Use light surfaces as a document field and dark surfaces as a graphite edition, with equivalent hierarchy and independently verified text/control contrast.

**Primary objective:** give each part of the site an unmistakable visual role: statement, scope, sequence, example and action. Use alignment, type and restrained rules as the recurring signature; avoid fake measurements, drafting marks, credentials or technical annotations without content meaning.

**Guiding hierarchy:** brand and offering → coordination → service scope and method → illustrative outcomes → project contact.

The concept requires no framework, dependencies, new font family, animation system, backend, new navigation model or content fabrication. Canonical changes would belong in existing HTML and `css/`; generated `dist/`, optimized image output and service workers remain outside manual editing.

## 7. Prioritized design improvements

Priorities express prospective implementation value and dependencies, not defect severity. All five proposals support the recommended direction; none authorizes implementation. Acceptance criteria describe future verification, not results achieved in this review. Shared baseline for later visual approval: representative desktop, tablet and mobile layouts, both themes, meaningful DOM order, visible keyboard focus, touch access and 200% zoom. Widths below are proposed review samples, not claims about viewports tested today.

### IMP-DESIGN-01 — Establish the Axiom dossier typography and material language

- **Status:** COMPLETED — implemented and verified.
- **Result:** Implemented only on home `#o-nas` and the `services/budowa-domow.html` `.service-details` section, using CSS scoped to those sections and the existing `no-interaction` class on their eight list items. The About introduction and highlights and the numbered work steps now use left-aligned explanatory text, body-size descriptions and restrained sectional rules instead of raised cards, with step numbers on a separate typographic line. Shared selectors, tokens, fonts, content, `Krok n:` labels, step order, anchors, the contact CTA and reveal behavior are preserved.
- **Verification:** Browser inspection at 1440, 768, 390 and 320px in light and dark system-preference themes, plus a 720×450 viewport as a 200% zoom approximation, found no horizontal overflow, intact step order and labels, visible CTA keyboard focus, text contrast of at least 4.58:1, and an unchanged `remonty-mieszkan` page; `npm run qa:references` passed. Real 200% browser zoom, `prefers-reduced-motion` emulation, Firefox, Safari and assistive technologies were not tested.
- **Impact:** High
- **Effort:** Medium

### IMP-DESIGN-02 — Compose the hero and about section as one construction introduction

- **Status:** COMPLETED — implemented and verified.
- **Result:** The single hero `h1` now pairs a large title-case brand name with a ruled, uppercase service descriptor, aligned bottom-left to the 1200px grid over a text-anchored scrim that replaces the previously ineffective overlay; narrow crops keep the lit building corner. From 1024px, `#o-nas` pairs the explanation, highlights and left-aligned contact CTA with a flat 5:4 coordination photograph, while narrower screens keep the DOM order with a full-column 4:3/3:2 image and a matching `sizes` value. Wording, image sources and alternatives, `#o-nas`/`#kontakt`, the IMP-DESIGN-01 rules and `no-interaction` items, and reveal behavior are preserved.
- **Verification:** Headless Chrome at 1440×900, 1024×768, 768×1024, 390×844, 320×568, 844×390 and 1280×600 in light, dark, stored and system themes, with and without emulated reduced motion, plus real 200% page zoom (712 CSS px, DPR 2), found no horizontal overflow, single-line or balanced headings, and rendered hero text contrast of at least 5.1:1 (brand) and 6.6:1 (descriptor). Keyboard Tab/Enter reached the focus-visible `Kontakt` CTA and `#kontakt`, About stayed visible without JavaScript, service, legal and 404 pages rendered identically to HEAD apart from lazy-image timing, and `npm run qa:references` and `git diff --check` passed. Firefox, Safari (including the `support.css` no-`backdrop-filter` fallback), touch devices and assistive technologies were not tested.
- **Impact:** High
- **Effort:** Medium

### IMP-DESIGN-03 — Give service scope and work sequence distinct editorial compositions

- **Status:** COMPLETED — implemented and verified.
- **Result:** The six home service links are now equal, ruled catalogue entries (compact image/text rows below 600px, two or three aligned columns above) with flat 3:2 photographs, a drawn link chevron, title hover/focus states and no card elevation or hover lift; `.service` was removed from the shared shadow/lift rules. All six service pages share a flat photograph, left-aligned description, square-marker scope checklist and paired actions, while the `budowa-domow` numbered process rules now apply, scoped to `.service-details`, to every page with `no-interaction` steps. Routes, copy, image sources/`sizes`/alternatives, ordered lists, `Krok n:` and `aria-hidden` numbers, gallery anchors and CTA destinations are unchanged.
- **Verification:** Headless Chrome at 1440, 1024, 768 and 390px (plus 320px screenshots) in stored light/dark and system themes found six equal links, four labelled steps with attached numbers, intact CTA targets and no horizontal overflow; text contrast was at least 9.78:1 and step numbers 4.59:1, the `budowa-domow` process, About and other home sections computed identically to HEAD, and Tab/Enter, reduced motion and no-JavaScript fallback behaved correctly. Emulated 200% zoom (720 and 512 CSS px at DPR 2), `npm run qa:references` and `git diff --check` on the implementation files passed; the browser zoom UI, Firefox, Safari, touch hardware and assistive technologies were not tested, and the shared CTA buttons keep their existing 2.0:1 light-theme focus ring.
- **Impact:** High
- **Effort:** Medium

### IMP-DESIGN-04 — Curate gallery imagery into a demonstrational construction narrative

- **Status:** COMPLETED — implemented and verified.
- **Result:** All 12 home and 36 service photographs keep their sources, order, links and alternatives but now sit as equal, flat plates at their native 3:2 ratio in a one/two/three-column grid aligned with the service catalogue; no image is featured because the opening photograph is a split composite. Each figure gained a `<figcaption>` outside the link with a factual Polish description (home captions also name the service area; composites are described as "Dwa ujęcia" without before/after claims), while the lightbox keeps its alt-based captions and `lightbox.js` is unchanged.
- **Verification:** The in-app browser at 1440, 768, 390, 320 and 720×450 (200% zoom approximation) in light, dark and system themes found no horizontal overflow, uncropped plates, caption contrast of at least 9.12:1 and focus rings of at least 4.07:1; keyboard and mouse opening, DOM-ordered ArrowLeft/ArrowRight and button navigation, Escape/backdrop closing, focus return, immersive fallback and per-page six-image grouping worked, captions stayed visible without JavaScript, and `npm test -- tests/lightbox.test.js` (9/9), `npm run qa:references` and `git diff --check` passed. Reduced motion was checked only as loaded CSS rules, native fullscreen was refused by the browser pane, and Firefox, Safari, touch devices and assistive technologies were not tested; initial focus not entering the open lightbox is pre-existing and identical on HEAD.
- **Impact:** Medium
- **Effort:** Medium

### IMP-DESIGN-05 — Create a deliberate project-contact closing composition

- **Status:** Proposed
- **Priority:** P2
- **Affected area:** Home `#kontakt`, service closing CTAs and shared footer.
- **Evidence:** **Source:** `index.html#kontakt`, footer markup, `css/sections/contact.css` (`.contact-form__container`), `css/layout/layout.css` (`.footer__content`), service `.cta` rules, `legal/regulamin.html#tos-9` (the form's actual project-contact purpose).
- **Current state:** Home contact is a centered form panel followed by a multi-group footer; service pages close with a separate CTA to the same contact area. The legal content distinguishes real operator contact from the fictional construction offering.
- **Design judgment:** A dossier-like final contact block could provide a clearer visual finish without adding another action, promising a real construction estimate or expanding the form workflow.
- **Proposed improvement:** Compose the existing contact heading and form as the main closing passage, with a quieter supporting operator-contact register drawn only from approved existing details. Give service endings the same visual signature, then let footer navigation and attribution provide the secondary finish. On mobile, prioritize heading and form before supporting details. Keep demonstration context visible according to the approved content treatment.
- **Expected value:** A recognizable ending that connects the visual direction to the site's actual project-contact functionality.
- **Implementation scope:** Home contact presentation, service CTA styling and shared footer layout. Minimal presentation markup only; preserve `contactForm`, all field names/IDs, validation/status associations, Netlify attributes, honeypot, reCAPTCHA area, action URL, draft storage, direct contact links and existing footer destinations. No new fields, persistent mobile bar, submission behavior or business promises.
- **Dependencies:** IMP-DESIGN-01; owner approval of any repeated operator detail and adjacent wording so it remains accurate for a demonstration. Can proceed independently of the gallery proposal.
- **Acceptance criteria:** At desktop, tablet, mobile, short landscape and 200% zoom, the heading/form form one primary closing passage and all controls, messages and captcha area remain reachable. Footer links, social destinations and direct contact actions remain intact. Both themes retain visible focus and readable normal, error and success states. Verify existing form behavior using the focused contact-form tests and a local browser scenario without transmitting a real message; live Netlify delivery remains a separate check.
- **Impact:** Medium
- **Effort:** Medium

## 8. Suggested implementation sequence and dependencies

1. **Owner direction review and evaluation prerequisite:** obtain a current rendered baseline, assess whether the source-derived limitations are visible, and approve or reduce the proposed direction. This report itself authorizes no coding.
2. **Foundation:** approve and implement IMP-DESIGN-01 in a small home/service sample, then review its shared effects on document and utility pages.
3. **Independent compositions:** implement IMP-DESIGN-02, IMP-DESIGN-03 and IMP-DESIGN-05 as separate reviewable changes after the foundation. The service proposal should use one-page pilot and subsequent rollout slices; it does not depend on completing the hero.
4. **Asset-dependent stream:** evaluate the existing images and permitted captions before IMP-DESIGN-04. Asset review may run alongside the composition work; no new sourcing is assumed. Final gallery emphasis waits for approval of actual images and crops.
5. **Final integration review:** inspect the combined home sequence, all six service pages and representative legal/utility pages in light/dark/system conditions. Check heading rhythm, transitions, image scale and the closing hierarchy, then use focused existing tests only where affected. Broader checks require a concrete regression reason.

Keep all implementation in canonical sources. Any later image generation/build workflow must be separately within the approved implementation task; never hand-edit `dist/`, `assets/img/_optimized/` or generated workers. No additional maintenance documentation is needed for this direction.

## 9. Verification performed and limitations

- **Repository/source inspection performed:** inventory with `rg --files`; targeted searches with `rg -n`; file reading with PowerShell `Get-Content`. Reviewed the documentation, page structures, CSS rules and interaction owners identified above. `git status --short` was clean before the report was created.
- **Static reference verification performed:** `npm run qa:references` passed, checking **1355 local references across 15 HTML pages, 20 CSS files, the manifest and 11 statically checkable precache entries**; 310 external or in-page references were ignored. No `dist/build-manifest.json` was present, so post-build release checks were skipped. This result establishes reference integrity, not visual quality, image rights or live destination availability.
- **Preview attempt performed:** server discovery found no running development server. `npm run serve` started the existing `http-server` preview on port 8080. The Playwright and in-app browser attempts described in section 1 did not produce an inspectable page. Starting a server is not runtime verification of design behavior.
- **Visual/runtime coverage:** no rendered page, screenshot, image crop, active font, viewport, theme, zoom state or interaction was successfully inspected. No aesthetic conclusion is represented as a direct observation. CSS declarations were inspected for responsive, theme and reduced-motion intent only.
- **Not performed:** production build, image build, dependency installation/update, source fixes, formatting, unit/browser suites, Lighthouse, pa11y, contrast measurements, assistive-technology checks, deployment inspection, offline testing or live form submission. Historical test results were not adopted as results of this review.
- **Material limits:** current font rendering, Polish glyph coverage, tonal hierarchy, image subject quality, responsive crops and actual page pacing need future browser review. No audience research, analytics, conversion benefit, real customer/project provenance or production readiness is claimed.

Only `IMPROVEMENTS-DESIGN.md` is created by this task. No design proposal has been implemented; no generated project output, source, dependency, plan, audit, changelog or delivery state is changed.

## 10. Owner decisions required

- Approve **Construction Dossier** or select the more photography-dependent **Workshop to Finished Space** direction after rendered review. Approval of a direction and approval of an implementation task are separate decisions.
- Approve the subset and order of images eligible for emphasis, the rights to reuse them, and caption wording that preserves their demonstrational character. Existing images may remain; no replacement commission is assumed.
- Approve the visual trade-offs: a differentiated brand/descriptor opening, distinct service/process compositions, a conditional gallery anchor and a stronger contact ending. Confirm operator-contact wording wherever existing details would be repeated. No new logo, font selection, fictional testimonial or credential decision is requested.
