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

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added an isolated Node VM suite executing the canonical worker template with in-memory placeholder substitution and mocked network/cache APIs. It protects network-first document responses, asynchronous storage of a cloned HTTP 200 response in the revision-specific HTML cache, non-200 responses without cache writes, and requested-document → offline → index fallback precedence; runtime and generated outputs remain unchanged.
- **Verification:** Focused Vitest suite: 5 passed, 0 failed; focused ESLint and `git diff --check` passed. Vitest required a workspace-local temporary directory after a sandbox EPERM error before test execution; mocked tests do not verify browser offline navigation, worker lifecycle or production PWA behavior.
- **Impact:** Medium
- **Effort:** Medium

### IMP-QUALITY-03 — Validate accessibility references in maintained HTML

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added a Vitest/jsdom suite reading all 15 canonical source pages independently, with an explicit inventory checked against root, services and legal HTML files. It detects duplicate non-empty IDs and unresolved label[for], aria-labelledby, aria-describedby and aria-controls tokens; in-memory cases verify diagnostics and document isolation without changing application sources or existing validators.
- **Verification:** Focused Vitest suite: 26 passed, 0 failed across all 15 source pages and diagnostic cases; focused ESLint and `git diff --check` passed. Parsing executes no page scripts or external resource requests; this verifies reference integrity only, not accessible-name quality, browser behavior or WCAG conformance.
- **Impact:** Medium
- **Effort:** Small

### IMP-QUALITY-04 — Protect theme initialization and synchronized controls

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added an isolated Vitest/jsdom suite executing both real theme initialization stages, covering stored-preference precedence and system changes through modern and legacy media-query APIs without persistence. Manual toggles synchronize the root theme, both relative logo URLs, Polish ARIA action labels, pressed state and stored preference; production behavior remains unchanged.
- **Verification:** Focused Vitest suite: 8 passed, 0 failed; focused ESLint and `git diff --check` passed. Vitest required a workspace-local temporary directory after a sandbox EPERM error before test execution; jsdom checks do not verify visual appearance, FOUC, real operating-system or cross-browser behavior, or WCAG compliance.
- **Impact:** Medium
- **Effort:** Small

### IMP-QUALITY-05 — Verify continuity when browser storage operations fail

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added eight failure-injection tests exercising the real storage wrappers, form and modal: read/write/removal exceptions preserve initialization, typing and counters, local submission success/reset without native fallback, and modal acceptance with cookie writing and scroll/focus restoration. Storage spies are restored before cleanup; runtime behavior, persistence formats and consent semantics remain unchanged.
- **Verification:** Focused Vitest suites: 25 passed, 0 failed (storage: 3, contact form: 14, cookie modal: 8); focused ESLint and `git diff --check` passed. Vitest required a workspace-local temporary directory after a sandbox EPERM error before test execution; jsdom checks do not establish real-browser storage behavior, successful persistence/deletion under failure, or production network submission.
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
