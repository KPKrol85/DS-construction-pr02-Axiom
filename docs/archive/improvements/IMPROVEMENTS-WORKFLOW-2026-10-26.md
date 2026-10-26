# Axiom — Workflow Improvements

**Analysis date:** 2026-10-25
**Completion date:** 2026-10-26
**Status:** COMPLETED — 5/5 improvements implemented and verified.
**Scope:** Project-wide development, build, validation and documentation workflows.

## Overview

Five workflow improvements were completed to strengthen environment reproducibility, validation control, asset generation and documentation maintenance.

The changes introduced an explicit Node.js baseline, selectable reference-validation scopes, targeted image regeneration, read-only HTML head previews and a single detailed npm-command reference.

The existing architecture, build pipeline, source/generated-file ownership, deployment configuration and application behavior were preserved. No new dependencies or development frameworks were introduced.

## Completed improvements

### IMP-WORKFLOW-01 — Declare a reproducible Node/npm setup

- **Status:** COMPLETED — implemented and verified.
- **Result:** Declared Node.js `^22.22.2` in package metadata and documented the verified Node.js 22.23.3 / npm 10.9.9 baseline. Clarified reproducible installation through `npm ci` and intentional dependency maintenance through `npm install`.
- **Verification:** All 611 locked dependency engine requirements were compatible. Previous isolated `npm ci` verification showed no lockfile drift; ESLint and focused Vitest tests (29/29) passed. No build or browser audit was performed for this improvement.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-02 — Make reference-check scope explicit

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added `auto`, `source` and `release` scopes to `qa:references`, preserving automatic detection as the default. Introduced explicit scope reporting and distinct exit codes for validation failures (`1`) and invalid arguments or execution errors (`2`).
- **Verification:** Focused CLI scenarios covered missing and generated releases, invalid arguments, injected failures and read-only execution. An isolated production build provided the release fixture. ESLint and `git diff --check` passed; no browser audit or deployment was performed.
- **Impact:** Medium
- **Effort:** Medium

### IMP-WORKFLOW-03 — Regenerate variants for a selected image source

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added strict `--source=<relative-path>` selection for regenerating one declared image's complete WebP/AVIF variant set. Preserved full generation, cleanup, source declarations, encoding settings, output naming and completeness checks.
- **Verification:** Isolated tests confirmed 10 hero and 4 service-card variants, full generation of 164 variants from 20 sources, rejection of 20 invalid CLI cases and successful source-reference checks. Hash, size and modification-time comparisons confirmed all 164 original optimized assets remained unchanged. ESLint and diff checks passed.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-04 — Preview HTML head regeneration before writing pages

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added read-only `--preview` and preflight validation across all declared HTML pages. Apply mode writes only changed pages while preserving existing rendering, metadata ownership, JSON-LD, theme initialization, line endings and content outside `<head>`.
- **Verification:** Isolated 15-page verification covered 53 instrumented runs, including invalid inputs, CLI rejection, selective writes and no-op stability. Generated HTML matched the previous renderer byte-for-byte; SHA-256 and modification-time checks confirmed write isolation. ESLint and diff checks passed; 660 protected worktree files remained unchanged.
- **Impact:** Medium
- **Effort:** Small

### IMP-WORKFLOW-05 — Maintain one detailed npm-command reference

- **Status:** COMPLETED — implemented and verified.
- **Result:** Consolidated detailed npm-command documentation in `docs/settings.md`, preserving `package.json` and implementation scripts as executable truth. Both README languages retain concise workflows with corrected links, production build ordering and descriptions of all nine Vitest test files.
- **Verification:** Read-only checks confirmed coverage of all 21 npm scripts, 44 valid local README links and 12 reference anchors. Build sequences matched `package.json`, and test descriptions were checked against current sources. `git diff --check` passed; no runtime tests, build or browser audits were performed for this documentation-only improvement.
- **Impact:** Medium
- **Effort:** Small

## Completion summary

- **Completed:** 5/5 improvements.
- **Impact:** Medium across all five items.
- **Effort:** Four Small, one Medium.
- **Architecture:** Preserved.
- **Dependencies:** No additions or updates.

All approved workflow improvements are closed. No implementation tasks remain open in this review.

## Verification limitations

Verification was scoped to each improvement rather than performed as one combined release regression.

Generator and CLI checks used isolated fixtures where appropriate. An isolated production build verified release-reference behavior during IMP-WORKFLOW-02, but no final combined production-build verification was performed.

Selected checks required reruns after Windows filesystem or sandbox restrictions. Successful reruns are reflected in the individual verification records.

No comprehensive browser regression, deployment or live-hosting verification was performed. No execution-time or productivity improvements were quantitatively measured.

**Final status:** COMPLETED — archived workflow improvement review.
