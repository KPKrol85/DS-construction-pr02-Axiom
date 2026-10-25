# Axiom — UX Improvements

**Analysis date:** 2026-10-24
**Project type:** Static multi-page demonstration website for a construction business, using HTML, CSS and vanilla JavaScript modules with a Node build pipeline
**Analysis mode:** Evidence-based UX improvement review
**Focus:** Project-wide UX

## Improvement overview

Axiom supports service browsing, photograph previews, native FAQ disclosures, contact with KP_Code Digital Studio, legal-document navigation and utility-page recovery. Source inspection shows existing mobile-menu state management, lightbox keyboard controls and focus return, form validation, message-draft restoration and submission feedback.

The five opportunities below refine those existing interactions: direct access to fields requiring correction, longer-lived submission feedback, understandable draft restoration, gallery position awareness and homepage section orientation. They are optional improvements, not findings of broken functionality or formal accessibility failures. Expected benefits are reasoned opportunities, not measured outcomes.

The archived plan, changelog, audits and completed UI, design and quality reports were consulted. No active UX report or active plan was found. These proposals do not repeat the completed focus-ring, lightbox-focus, gallery-caption, contact-layout or legal-layout work.

## Proposed improvements

### IMP-UX-01 — Link the error summary to individual fields

- **Status:** COMPLETED — implemented and verified.
- **Result:** The existing summary now builds safe, label-derived links to each invalid control in form order; activation focuses the control without navigation or value/checkbox changes. Scoped styles preserve underlines and theme colours, retain the shared focus ring and exclude hidden summary links from keyboard navigation; count messages, announcements, shortcuts, validation and submission contracts remain unchanged.
- **Verification:** Contact-form tests passed (22/22), `qa:references` passed and `git diff --check` passed; release-artifact checks were skipped because the dist manifest was absent. An isolated canonical contact section passed a Chrome check at 320px for pointer/Enter focus, unchanged values/consent/history, both first-error shortcuts and light/dark link styling; screen readers and production delivery were not tested.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-02 — Keep successful submission confirmation available

- **Status:** COMPLETED — implemented and verified.
- **Result:** The existing success confirmation persists until the next contact-control input, with unchanged polite announcements and no focus movement. Button timings remain 1,200ms/6,000ms, with prior timers cancelled before another enhanced submission; validation, reset, draft removal and native fallback contracts are preserved.
- **Verification:** Focused contact-form tests passed (35/35) after relocating Vitest's temporary directory to resolve a sandbox EPERM; `qa:references` and `git diff --check` passed. Post-build checks were skipped because the dist manifest was absent; browser, screen-reader and live Netlify delivery testing were not performed.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-03 — Explain restored message drafts and offer a fresh start

- **Status:** COMPLETED — implemented and verified.
- **Result:** Restored messages now show a Polish notice and native discard button, with a textarea description removed on editing, discard or acknowledged success. Discard clears only the message and its existing storage entry, resets the counter and focuses the textarea; other fields, consent, feedback and form contracts are preserved, including safe handling of storage failures.
- **Verification:** Focused contact-form suites passed (40/40), `qa:references` and `git diff --check` passed; Vitest required a writable temporary directory after sandbox EPERM. Isolated canonical sources passed Chrome checks at 320px for hidden/no-JS states, light/dark/system visibility and Tab/Enter discard/focus; screen readers, live Netlify delivery and post-build artifacts (no dist manifest) were not tested.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-04 — Expose the lightbox's existing photograph position visually

- **Status:** COMPLETED — implemented and verified.
- **Result:** A single noninteractive, aria-hidden position indicator inside the fullscreen figure uses the existing gallery state and render lifecycle. Compact overlay styling preserves captions, controls, pointer gestures, focus behavior and the existing live announcement.
- **Verification:** Focused lightbox tests passed (16/16), `qa:references` and `git diff --check` passed. Isolated canonical sources passed headless Chrome checks at 320px for navigation, wraparound, focus, light/dark/system themes, immersive fallback and native fullscreen, plus landscape layout at 568×320. Screen readers and post-build artifacts (no dist manifest) were not tested.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-05 — Indicate the current homepage section in navigation

- **Status:** COMPLETED — implemented and verified.
- **Result:** Homepage navigation now underlines at most one section link using `data-current-section`, based on section bounds, the sticky header's actual bottom edge and existing anchor offsets; hero, testimonials and footer reading positions have no marker. Tracking preserves page-current semantics, destinations, native navigation and mobile-menu interactions, including updates while collapsed.
- **Verification:** Focused navigation tests passed (29/29), scoped ESLint, `qa:references` and `git diff --check` passed. Headless Chrome checks at 1280px and 320px covered scrolling, anchors, menu interactions, breakpoints and light/dark/system themes using intercepted canonical files because loopback networking was blocked. Screen readers and release artifacts (no dist manifest) were not tested.
- **Impact:** Medium
- **Effort:** Medium

## Selection summary

All five proposals refine existing workflows without changing the framework, routes, backend or demonstration purpose. Each can be implemented independently. IMP-UX-01–03 share the form module and should be coordinated to preserve validation, draft and submission-state contracts; none depends on implementing another proposal.

The set is a bounded candidate backlog for focused development, predominantly small changes with one medium navigation task. Relative impact and effort reflect source-level judgment, not measured user outcomes or a guarantee that the complete set fits one working day. Implementation requires separate approval.

## Analysis limitations

- This review inspected canonical sources, interaction/state code, existing test definitions and project records. Tests were read, not executed; historical verification results were not treated as current runs.
- No browser inspection, real-device use, screen-reader testing, formal WCAG audit or user research was performed. Responsive/fullscreen behavior and focus outcomes in the acceptance criteria remain future verification requirements.
- Live Netlify delivery, production reCAPTCHA, service-worker lifecycle and actual offline recovery were not exercised. Local submissions are simulated by the implementation and cannot establish delivery. The proposals do not depend on claims about those external/runtime outcomes.
