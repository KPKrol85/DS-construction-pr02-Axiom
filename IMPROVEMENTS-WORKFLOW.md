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

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added documented `auto`, `source` and `release` scope selection, preserving default automatic detection and all existing validators. Every run reports its scope and release outcome; missing required releases fail with code `1`, while invalid CLI usage fails with code `2`.
- **Verification:** Focused CLI scenarios passed for absent and built releases, source selection with zero generated-file probes, invalid arguments and injected source/release/read failures with expected codes `0`/`1`/`2`; the release fixture came from a successful isolated `npm run build`. Read-only checks confirmed unchanged file hashes, sizes, modification times and fixture file inventory; `npm run lint`, `git diff --check` and final diff/status review passed. No browser audit or deployment was run.
- **Impact:** Medium
- **Effort:** Medium

### IMP-WORKFLOW-03 — Regenerate variants for a selected image source

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added strict `--source=<relative-path>` selection for one declared source, reusing the existing processing logic and checking completeness within the selected scope. Default full generation, cleanup, source declarations, widths, encoding, output naming and npm scripts remain unchanged; the command reference documents selection and rejected argument combinations.
- **Verification:** Isolated checks passed for hero/card selection (10/4 outputs), 20 invalid CLI cases, missing/invalid/undersized/non-file inputs, cleanup, full generation (20 sources/164 decoded variants), completeness failures and no upscaling; source reference checks passed after selective and full generation. Inventory, hash, size and modification-time comparisons confirmed unrelated outputs and all 164 original optimized files unchanged; lint, diff checks and final status/diff review passed. Cleanup required a rerun after releasing a Windows file lock; no browser audit or deployment was run.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-04 — Preview HTML head regeneration before writing pages

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added strict `--preview` selection and a shared preflight that validates and renders all declared pages before any HTML write; both modes report ordered change counts, and apply writes only changed pages. Documented both npm commands while preserving the existing renderer, metadata/template ownership, retained scripts, page line endings and content outside `<head>`.
- **Verification:** Isolated 15-page checks passed across 53 instrumented runs: metadata/template changes, selective writes, no-op stability, LF/CRLF and script preservation, plus 22 invalid-input runs and 10 rejected CLI cases with expected codes `0`/`1`; rendered outputs matched the previous generator byte-for-byte. Npm preview/apply checks, SHA-256 and modification-time comparisons, lint, diff checks and final status/diff review passed; 660 protected worktree files remained unchanged, and no production build, browser audit or deployment was run.
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
