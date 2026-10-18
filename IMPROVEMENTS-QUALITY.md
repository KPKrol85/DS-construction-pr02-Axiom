# Axiom — Quality Improvements

**Analysis date:** 2026-10-18
**Project type:** Static, multipage construction-company demonstration website using HTML, CSS and vanilla JavaScript ES modules, with a custom Node build and PWA support
**Analysis mode:** Evidence-based quality improvement review
**Focus:** Project-wide quality

## Improvement overview

Axiom already has focused Vitest/jsdom tests for four interactive components, guarded storage access, a reference-integrity validator, release-contract checks, and optional Lighthouse and pa11y runners. Current source inspection supports extending assurance around specific existing behaviors rather than adding infrastructure or changing the architecture.

The proposals below address unasserted production submission, document fallback, theme synchronization, HTML accessibility references, and storage-failure behavior. They are verification improvements, not claims that those workflows currently fail. No active quality report or root development plan was present. The archived plan, audits, completed design report and current changelog were consulted to exclude completed work, including navigation/modal tests, lightbox focus corrections and production theme precaching.

One existing check was executed: `node tools/qa/check-references.mjs` passed, checking 1,359 local references across 15 HTML pages, 20 CSS files, the web manifest and 11 precache entries. It ignored 310 external or in-page references and skipped post-build verification because `dist/build-manifest.json` was absent.

## Proposed improvements

### IMP-QUALITY-01 — Protect production contact submission and native fallback

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added an isolated production-host suite exercising the real contact-form module: encoded POST payload, pending-request guard, reset and draft removal after acknowledgement, and success UI timing. Network rejection and non-OK responses preserve fields and the draft, restore controls, allow exactly one native fallback without recursive fetches, and permit a subsequent enhanced retry; runtime and Netlify contracts remain unchanged.
- **Verification:** The new suite (3 tests) and existing contact-form suite (11 tests) passed together: 14 passed, 0 failed; focused ESLint passed. Vitest required a workspace-local temporary directory after a sandbox EPERM error; all fetches and native submissions were intercepted, so live Netlify delivery, reCAPTCHA and browser navigation remain unverified.
- **Impact:** High
- **Effort:** Medium

### IMP-QUALITY-02 — Protect the service worker's document fallback order

- **Affected area:** Existing network-first document responses and offline fallback selection.
- **Evidence:** `sw.template.js:27-42`; `tools/qa/check-references.mjs` — `collectPrecacheReferences` and `checkGeneratedRelease`; `vitest.config.mjs:16`; current `tests/` contains only contact-form, lightbox, navigation and cookie suites.
- **Current implementation:** Same-origin GET document requests use the network, copy status-200 responses into the HTML cache, and fall back after a network rejection to the requested cached document, then `offline.html`, then `index.html`. Reference checks inspect paths and generated precache declarations, not responses from this handler.
- **Proposed improvement:** Add a small isolated test of document response selection using the canonical worker template.
- **Expected quality value:** Detect regressions that bypass an available cached page or select the wrong offline fallback despite valid asset references.
- **Implementation scope:** In the existing Vitest runner, evaluate `sw.template.js` in an isolated worker-like context with in-memory placeholder substitution and mocked `self`, fetch and Cache Storage. Limit assertions to the document branch; preserve cache names, strategies and generator ownership. Do not generate or edit either `sw.js`, add browser tooling, or extend this into a worker lifecycle campaign.
- **Acceptance criteria:** A successful network response is returned and a status-200 response is copied to the HTML cache; a non-200 response is returned without that write. On network rejection, assert requested-page precedence, offline-page fallback, and final index fallback using controlled cache availability. Tests use no real network or browser cache and execute the template's handler rather than a copied implementation.
- **Impact:** Medium
- **Effort:** Medium

### IMP-QUALITY-03 — Validate accessibility references in maintained HTML

- **Affected area:** Document-owned ID relationships for labels, section names, descriptions and navigation controls.
- **Evidence:** `index.html:306`, `index.html:1107`, `index.html:1155-1223`, `index.html:1347`; `tools/qa/check-references.mjs:161-181` and `tools/qa/check-references.mjs:407-415`; `tests/contact-form.test.js` — `FORM_FIXTURE`; `tests/navigation.test.js` — `NAVIGATION_FIXTURE`.
- **Current implementation:** Maintained pages contain explicit label and ARIA ID references. Component tests use copied minimal markup. The reference validator checks URL-bearing attributes, skips fragment-only links and does not validate document IDs or ARIA relationships; the archived audit records a one-time DOM inspection, not a maintained assertion.
- **Proposed improvement:** Add one source-document integrity suite that parses the 15 canonical HTML pages with the existing jsdom tooling.
- **Expected quality value:** Catch markup edits that disconnect accessible names or controls while component fixtures and file-path checks continue to pass.
- **Implementation scope:** Read root, `services/` and `legal/` pages directly; exclude generated output and templates. Check only unique IDs and resolution of explicit `label[for]`, `aria-labelledby`, `aria-describedby` and `aria-controls` references. Keep the current component suites and reference validator intact; add no accessibility framework.
- **Acceptance criteria:** Every maintained page is included; duplicate IDs and unresolved reference tokens fail with the page path, attribute and offending ID. Space-separated ARIA references are checked individually. A deliberately invalid in-memory document demonstrates each diagnostic without modifying project HTML. Passing establishes reference integrity only, not accessible-name quality or WCAG conformance.
- **Impact:** Medium
- **Effort:** Small

### IMP-QUALITY-04 — Protect theme initialization and synchronized controls

- **Affected area:** Light/dark/system theme selection across the early initializer and interactive module.
- **Evidence:** `js/theme-init.js:1-11`; `js/components/theme.js:5-44`; `js/core/init.js` — `initApp`; `tests/` — no theme suite.
- **Current implementation:** The early script selects a stored light/dark preference or the system preference. The interactive module also selects the theme, updates theme-aware logos and button ARIA state, saves explicit toggles, and subscribes to system changes when no saved value exists at initialization. Current component tests do not exercise these contracts.
- **Proposed improvement:** Add a focused theme-state suite covering initialization agreement and observable control synchronization.
- **Expected quality value:** Detect divergence between early and interactive selection or stale logos and accessible button states after theme changes.
- **Implementation scope:** Execute the real initializer and module using controlled storage, a minimal logo/button fixture and a mock media query. Preserve storage key `theme`, existing preference semantics, relative logo URLs and Polish accessible labels; do not redesign theme ownership or controls.
- **Acceptance criteria:** Stored light and dark preferences override an opposing system preference in both initialization stages. With no saved preference, both stages select the mocked system theme; a system change updates the interactive state before any manual selection. Button activation updates `data-theme`, both logo sources, `aria-pressed`, the action label and stored preference consistently. Initialization does not persist a system-derived choice. Media listeners, storage and root attributes are restored between cases.
- **Impact:** Medium
- **Effort:** Small

### IMP-QUALITY-05 — Verify continuity when browser storage operations fail

- **Affected area:** Existing best-effort persistence boundary for message drafts and the project-information/cookie modal.
- **Evidence:** `js/utils/storage.js:1-19`; `js/components/forms.js:60-69`, `js/components/forms.js:173-177`; `js/components/cookies.js` — `initCookieBanner` and `save`; `tests/contact-form.test.js` — `contact form draft persistence`; `tests/cookies.test.js` — `cookie modal acceptance`.
- **Current implementation:** Shared wrappers catch storage read, write and removal exceptions; reads return null. The form and modal use these wrappers, but existing tests exercise functioning localStorage rather than throwing operations. Modal acceptance also writes a separate cookie before dismissing and restoring focus.
- **Proposed improvement:** Add narrowly targeted failure-injection cases proving that optional persistence does not interrupt the existing interactions.
- **Expected quality value:** Preserve usable form and modal behavior when browser storage is denied or cannot accept writes, and protect the deliberate exception boundary from regression.
- **Implementation scope:** Use the existing Vitest mocking facilities to make storage methods throw. Test the wrappers and representative form/modal outcomes without changing persistence formats, adding retries, promising unavailable persistence or changing consent semantics. Keep these cases separate from the normal-storage production POST tests in IMP-QUALITY-01.
- **Acceptance criteria:** Throwing reads return null without aborting form/modal initialization; throwing writes do not interrupt typing, counter updates or modal acceptance. Modal acceptance still dismisses the dialog and restores scrolling/focus when localStorage writes fail. A throwing removal does not prevent the local success state and form reset; no assertion claims that the inaccessible draft was deleted. Restore all storage spies before cleanup.
- **Impact:** Medium
- **Effort:** Small

## Selection summary

These five independent proposals protect concrete existing contracts using the current test stack. Their objectives are distinct: external submission handling, worker document responses, source-markup references, theme synchronization, and continuity at a failing persistence boundary. IMP-QUALITY-01 and IMP-QUALITY-05 can touch the same form suite, so coordinating their edits is useful, but neither depends on the other.

The mix of small and medium tasks is a practical candidate backlog for focused development, potentially around one working day depending on harness complexity. This is not a delivery estimate or approval to implement. No dependency changes, framework replacement, architecture refactor, CI restructuring or repeated completed improvement is proposed.

## Analysis limitations

- Analysis was primarily static. Only the reference-integrity command was executed; Vitest, lint, browser scenarios, Lighthouse and pa11y were not run in this task. Historical passing results were treated as context, not current verification.
- No production output was generated, and the reference check skipped its post-build branch. Live Netlify delivery, reCAPTCHA, worker installation and real offline navigation remain unverified; proposed mocks cannot establish those integration outcomes.
- No claim is made about measured performance, formal accessibility compliance, cross-browser behavior or production readiness. The proposals identify assurance gaps, not confirmed runtime failures.
- Only this report was created. No proposal was implemented, and no source, test, configuration, dependency, generated artifact or other documentation file was changed.
