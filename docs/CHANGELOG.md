# Changelog

All significant changes to Axiom are documented in this file.

## Entry policy

A change is significant when a future maintainer or the project owner would reasonably need to know that one of the following changed:

- user-visible behavior, including meaningful UI, UX, or public content changes;
- accessibility behavior or accessibility contracts;
- build behavior, build guards, or npm scripts;
- test infrastructure or verification tooling;
- the dependency set;
- deployment or hosting workflow;
- PWA, service-worker, cache, or offline behavior;
- architecture, sources of truth, or important project maintenance contracts.

Judge by impact, not by file count: a visually small change is recorded when it changes user-visible or accessibility behavior, and editing a file is not by itself a reason for an entry.

Not recorded: improvement-report status updates and archiving, commit-only or tracking-document bookkeeping, temporary verification probes, minor wording corrections in internal documentation, and isolated cosmetic or implementation details, such as a single spacing or border correction, that do not change behavior, accessibility, or a shared component contract.

When an implementation task is defined, apply this policy and state `Changelog: yes` or `Changelog: no`. Add an entry only within an approved task marked `Changelog: yes`; this policy does not authorize changelog edits outside that scope.

## [Unreleased]

### Added

- Added the Axiom Construction website with a home page, six service pages, five legal pages, a contact success page, an offline page and a custom 404 page.
- Added responsive mobile navigation, a compact scrolling header and accessible back-to-top navigation.
- Added responsive service galleries with accessible lightboxes, keyboard controls and focus management.
- Added light, dark and system themes with persistent preferences and pre-paint initialization.
- Added a Netlify contact form with validation, an accessible error summary, a character counter, spam protection and a dedicated success page.
- Added a demonstrational careers form with recruitment submission and processing disabled.
- Added PWA installation metadata, application icons, shortcuts and screenshots.
- Added service-worker caching with offline fallback, connection-status announcements, retry handling and automatic recovery.
- Added canonical URLs, social metadata, structured data, robots directives and an XML sitemap.
- Added modular CSS with shared design tokens, responsive layouts and reduced-motion support.
- Added a shared SVG icon system for the canonical KP_Code Digital Studio social profiles.
- Improved legal-table accessibility with keyboard focus, accessible labels and horizontal overflow handling.

### Changed

- Introduced the Construction Dossier visual direction across the home page, service pages, galleries, contact section and footer.
- Rebuilt the hero and About section with a readable text overlay, ruled typography and responsive editorial composition.
- Replaced elevated service cards with flat, ruled catalogue entries and restrained interactive states.
- Standardized all six service pages with editorial photography, scope checklists, numbered work sequences and project-oriented CTAs.
- Reworked galleries into responsive photographic layouts with visible descriptions, accessible focus indicators and preserved lightbox interactions.
- Redesigned the contact section with a ruled form layout, improved field states and clearer validation feedback.
- Refined the shared footer and closing service-page CTAs to match the Construction Dossier layout.
- Centered the home contact-form submit button and closing CTA groups across the six service pages.
- Applied the KP_Code Digital Studio demonstration standard to public content, contact information, metadata and legal documents.
- Identified Axiom Construction as a fictional brand and KP_Code Digital Studio as the author through a concise disclosure in the shared footer.
- Added discreet service-disclosure notes to all six service pages without altering their marketing content.
- Replaced the home FAQ with project-oriented questions and synchronized its `FAQPage` structured data.
- Clarified contact CTAs, form instructions, inquiry categories and the success page to identify KP_Code Digital Studio as the message recipient.
- Replaced fictional-business structured data with an author `Person` node and removed unsupported service-provider and operating-area claims.
- Removed the mandatory first-visit information modal, its persistence mechanism, styles, configuration and associated tests.
- Redesigned the Certificates page as a demonstrational presentation without fabricated qualifications or verification claims.
- Updated the contact-form privacy acknowledgement and legal descriptions to reflect actual data processing and project functionality.

### Fixed

- Standardized the production origin as `https://ds-construction-pr02-axiom.netlify.app` across metadata, structured data, sitemap, robots directives, legal links and documentation.
- Corrected gallery-lightbox focus trapping, initial focus, fullscreen exit and caption readability across viewport orientations.
- Preserved scroll-reveal content accessibility when JavaScript is unavailable.
- Restored reliable offline retry handling and connection-status updates.
- Corrected dark-theme interactive states and active navigation colors to follow the selected theme.
- Removed inactive mobile-theme handling and unsupported analytics calls.
- Set utility pages and the demonstrational Certificates page to `noindex, follow`.
- Removed conflicting HTTP indexing directives while preserving page-level robots metadata.
- Aligned the Cookies Policy with the removal of the first-visit modal and its browser-storage mechanism.

### Build and Tooling

- Added a Node.js production pipeline for CSS, JavaScript, service-worker generation and deployment output.
- Introduced content-hashed application bundles, deterministic builds, a shared build manifest and immutable asset caching.
- Limited production output to required application bundles, standalone scripts and referenced assets.
- Added separate development and production service-worker precache profiles generated from `sw.template.js`.
- Consolidated service-worker precache definitions and included the pre-paint theme initializer in offline caching.
- Added responsive WebP and AVIF generation with Sharp and removed unused image variants.
- Centralized HTML head generation, canonical page metadata and structured metadata defaults.
- Added idempotent metadata generation and reference-integrity checks.
- Added ESLint flat configuration for application code, build tools and tests.
- Added local development and production preview servers.
- Aligned HTTP caching rules with generated assets, fonts, images and standalone scripts.
- Removed unused configuration, inactive modules, redundant structured-data sources and unused Poppins assets.
- Added a reproducible dependency lockfile and Git ignore rules for generated output and reports.
- Added GitHub Actions CI on Node.js 22 for linting, automated tests, source and release reference checks, and production builds.
- Kept Netlify deployment manual and separate from CI validation.

### Testing

- Added Vitest and jsdom coverage for the contact form, gallery lightbox and mobile navigation.
- Extended regression tests for keyboard interactions, focus management, ARIA synchronization and form validation.
- Added Lighthouse and pa11y runners for representative marketing, service and legal pages.
- Added `npm run qa:references` to validate local links, assets, metadata references and production-build contracts.
- Automated QA server startup, readiness checks and cleanup.

### Security

- Added hosting security headers, including Content Security Policy, HSTS, framing restrictions, content-type protection, referrer rules and permissions restrictions.
- Applied cache-control policies appropriate to fingerprinted assets and unversioned resources.
- Removed unsupported tracking integrations without introducing additional analytics scripts or CSP permissions.

### Documentation

- Added bilingual README documentation covering project architecture, setup, development and deployment.
- Added `docs/settings.md` with project scripts and usage guidance.
- Added the KP_Code proprietary license and third-party attribution notices for redistributed fonts and icons.
- Updated the Terms of Service, Privacy Policy and Cookies Policy to describe the demonstrational project, author contact details and implemented functionality.
- Clarified the Simply.com email-hosting provider and its location within the European Economic Area.
