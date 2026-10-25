# Axiom — Workflow Improvements

**Analysis date:** 2026-10-25
**Project type:** Static multi-page website built with HTML, CSS and vanilla JavaScript, with custom Node.js/npm build and QA tooling
**Analysis mode:** Evidence-based workflow improvement review
**Focus:** Project-wide workflow

## Improvement overview

Axiom already has a structured production build, content-addressed bundles, explicit local and production service-worker generation, static validation and focused component tests. Canonical inputs are the HTML pages, `css/`, `js/`, `sw.template.js` and `tools/templates/`. Production output in `dist/` is ignored; the generated root `sw.js` and optimized images are tracked. These ownership rules should remain unchanged.

The opportunities below improve environment reproducibility, control over existing generators and checks, and command-documentation maintenance. The archived plan marks its work complete; archived DESIGN, UI, UX and QUALITY reports were consulted to avoid repeating completed objectives. No active workflow report existed. Static-hosting preparation is present, but no tracked CI/CD workflow or deployment command was found; the proposals preserve the current build and hosting arrangements.

## Proposed improvements

### IMP-WORKFLOW-01 — Declare a reproducible Node/npm setup

- **Status:** COMPLETED — implemented and verified.
- **Result:** Declared Node.js `^22.22.2` in the package and root lockfile metadata; both README installation sections record the verified Node.js `22.23.3` / npm `10.9.9` Windows x64 baseline and distinguish reproducible `npm ci` installation from intentional dependency maintenance with `npm install`. Dependency versions, integrity data, scripts and the build workflow remain unchanged.
- **Verification:** The declared range and baseline satisfy all 611 locked Node engine requirements; prior isolated `npm ci` evidence remains valid for the unchanged dependency graph and recorded no lockfile drift. `npm run lint` and navigation Vitest tests (29/29) passed; Vitest required a rerun outside the sandbox after a temporary-file `EPERM` error. `git diff --check` and final status/diff review passed; no build or browser audit was run.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-02 — Make reference-check scope explicit

- **Affected workflow:** Source validation and production artifact verification.
- **Evidence:** `package.json:50`; `tools/qa/check-references.mjs:3-22`, `tools/qa/check-references.mjs:524-539` and `tools/qa/check-references.mjs:724-736`; `docs/settings.md:85-88`.
- **Current workflow:** `qa:references` always checks maintained sources and automatically adds release checks when `dist/build-manifest.json` exists. Without that manifest it reports the release stage as skipped. Its verification scope therefore depends on local artifact state; there is no explicit source-only or required-release selection.
- **Proposed improvement:** Add explicit scope selection to the existing checker: source-only verification and source verification with a required generated release. Retain automatic selection as the existing default.
- **Expected practical value:** Lets maintainers choose the relevant verification scope without changing local build artifacts, and makes a deliberate release check distinguish missing inputs from successful artifact verification.
- **Implementation scope:** Extend the existing checker and its usage documentation, reusing all current validators. Preserve default behavior, bundle/header contracts, read-only execution and existing failure classifications; add no umbrella runner or browser tooling.
- **Acceptance criteria:** Default invocation retains its current behavior. Source-only selection checks all existing source contracts regardless of `dist/`. Required-release selection fails clearly without the necessary artifacts and executes all existing release checks when they are available. Every result identifies the selected scope, and no mode writes files.
- **Impact:** Medium
- **Effort:** Medium

### IMP-WORKFLOW-03 — Regenerate variants for a selected image source

- **Affected workflow:** Responsive image preparation after a localized asset change.
- **Evidence:** `tools/images/build-images.mjs:11-49`, `tools/images/build-images.mjs:87-115` and `tools/images/build-images.mjs:145-202`; `docs/settings.md:5-13`; `README.md:257-262`. Read-only Git inspection confirms 164 tracked files under `assets/img/_optimized/`.
- **Current workflow:** The generator declares 20 responsive sources and processes every eligible declared source on each normal run. It writes full-size and responsive WebP/AVIF outputs using the declared settings. Its only implemented argument behavior is full-directory cleaning; changing one photograph still uses the full generation pass.
- **Proposed improvement:** Add an optional source selector restricted to the existing declaration map, allowing one photograph's complete variant set to be regenerated independently.
- **Expected practical value:** Avoids re-encoding unrelated photographs during a localized content update and makes the intended generated-file footprint easier to review. No execution-time saving is quantified.
- **Implementation scope:** Update the existing image script and its command reference. Preserve the default full run, source map, widths, formats, encoding settings, filenames and tracked-output policy. Selection must not clean the output directory or introduce incremental-cache state.
- **Acceptance criteria:** Selecting one declared source writes only that source's existing variant set and leaves unrelated outputs untouched. Invalid selectors and incompatible cleaning arguments fail before writes; a missing selected source still fails. The default full run retains its existing completeness checks, and regenerated candidates satisfy `qa:references`.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-04 — Preview HTML head regeneration before writing pages

- **Affected workflow:** Applying metadata and shared head-template changes.
- **Evidence:** `tools/html/build-head.mjs:9-16`, `tools/html/build-head.mjs:81-92` and `tools/html/build-head.mjs:95-122`; `docs/settings.md:95-98`.
- **Current workflow:** `build:head` reads the template and metadata, then renders and writes every listed HTML page in one loop. It preserves inline JSON-LD and the theme initializer, but has no read-only preview mode and writes pages even when their rendered bytes are unchanged. Maintainers inspect the resulting diff after generation.
- **Proposed improvement:** Provide a read-only preview/check mode using the same renderer, showing which pages would change before applying regeneration. Prepare all rendered results before the write phase and write only changed pages when applying them.
- **Expected practical value:** Makes the scope of a metadata update reviewable before mutation and avoids unnecessary writes during an unchanged generation pass.
- **Implementation scope:** Limit work to the existing generator and its usage description. Preserve the template/metadata ownership, default generated content, page line endings, retained inline scripts and all content outside `<head>`; create no parallel renderer or generated-file hand-editing procedure.
- **Acceptance criteria:** Previewing a controlled metadata change identifies affected pages without writing files. Applying generation produces the previewed heads, and a subsequent preview reports no differences. Invalid metadata is reported before page writes. Inline JSON-LD, the early theme initializer and content outside `<head>` remain intact.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-05 — Maintain one detailed npm-command reference

- **Affected workflow:** Keeping development instructions synchronized with package scripts.
- **Evidence:** `README.md:125-188`, `README.md:400-463` and `README.md:257-263`; `docs/settings.md:3-108`; `package.json:33-54`.
- **Current workflow:** Detailed command behavior, generated-output descriptions and validation instructions are maintained in both README language sections and again in `docs/settings.md`. The README already designates a script reference, but still repeats substantial operational detail. A command-contract change can require equivalent prose changes in three locations.
- **Proposed improvement:** Make the existing `docs/settings.md` the sole detailed command reference. Keep concise, task-oriented installation, source-preview, build and verification recipes in both README languages, linking to that reference for granular behavior and prerequisites.
- **Expected practical value:** Reduces repeated manual synchronization while retaining an accessible bilingual entry point and the existing documentation files.
- **Implementation scope:** Consolidate only overlapping command-reference and maintenance passages in `README.md` and `docs/settings.md`. Keep executable truth in `package.json` and the referenced scripts. Preserve source/generated ownership, hosting instructions and the established changelog policy; add no new documentation file or generator.
- **Acceptance criteria:** Every existing npm script remains discoverable in the detailed reference. Both README languages retain usable quick-start recipes and links to the correct reference sections. Detailed prerequisites and output contracts have one prose owner, with a brief instruction to update it when those contracts change. No executable command changes are required.
- **Impact:** Medium
- **Effort:** Small

## Selection summary

These five proposals address existing maintenance actions rather than introducing a new development model. They preserve the custom build, npm, generated-file ownership, validation coverage and static-hosting preparation. Their value comes from repeatable setup, deliberate execution scope and less duplicated maintenance.

Each can be implemented independently. IMP-WORKFLOW-02 through IMP-WORKFLOW-04 require corresponding reference updates; if selected together, complete IMP-WORKFLOW-05 last to consolidate those descriptions once. IMP-WORKFLOW-01 can provide a documented environment for later verification without blocking the other designs. The set is bounded enough to consider for a focused working-day backlog, subject to verification effort; no completion time is guaranteed. These are proposals requiring separate approval.

## Analysis limitations

- Analysis covered tracked documentation and archives, npm scripts and lockfile, build/generation tools, QA runners, lint/test configuration, Git ownership rules and static-hosting configuration. Runtime compatibility across the locked graph and clean dependency installation were not executed; IMP-WORKFLOW-01 requires that verification before selecting a baseline.
- The single focused validation command executed was `npm run qa:references`: exit code 0, 1,359 local references checked across 15 HTML pages, 20 CSS files, the web manifest and 11 precache entries. The checker reported that production verification was skipped because `dist/build-manifest.json` was absent. This result does not verify generated production output.
- No build, asset/head/service-worker generation, lint run, test suite, browser audit or deployment was executed. No productivity measurements or active hosting state were established. Existing documentation inconsistencies and historical audit findings were not treated as optional defect-repair tasks.
- No improvements were implemented, no dependencies were installed or updated, and only `IMPROVEMENTS-WORKFLOW.md` was created.
