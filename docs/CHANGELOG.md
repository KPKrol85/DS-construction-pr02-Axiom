# Changelog

All significant changes to Axiom are documented in this file.

This is the canonical record of significant completed changes. Evaluate each implementation task for a changelog update and record verified changes when its scope permits. If the task excludes this file, report any required update without editing it. Omit routine cleanup, pending work and unsupported claims.

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

- Added the Axiom construction website with a home page, six service pages, five legal pages, a contact success page, an offline page and a custom 404 page.
- Added responsive mobile navigation, a compact scrolling header, a back-to-top control and accessible gallery lightboxes.
- Added light, dark and system theme support with persistent preferences and flash-free initialization.
- Added a cookie consent dialog with browser-local persistence, keyboard focus management and scroll locking.
- Added a Netlify contact form with validation, an accessible error summary, a message counter, spam protection and a dedicated success page.
- Added a demonstration careers form with recruitment controls explicitly disabled and no application submission or processing.
- Added a service worker with versioned precaching, differentiated caching strategies and offline fallback.
- Added offline connection-status announcements, retry handling and automatic recovery.
- Added PWA metadata with installable application icons, shortcuts and screenshots.
- Added canonical URLs, social metadata, structured data, robots directives and an XML sitemap.
- Added a layered CSS architecture with shared design tokens, responsive layouts and reduced-motion support.
- Added guarded browser-storage utilities for theme and cookie preferences.
- Introduced a shared SVG icon system for the four canonical KP_Code social profiles, replacing duplicated footer icons and obsolete contact actions.
- Aligned business structured-data social profiles with the footer destinations.
- Improved legal-table accessibility with horizontal overflow containment, keyboard focus and accessible labels.
- Updated contact-form privacy acknowledgement to reference the Privacy Policy without presenting consent as the default legal basis for processing.
- Redesigned the Certificates page as an explicitly demonstrational showcase without fabricated qualifications or verification claims.

### Fixed

- Migrated the canonical production origin to `https://ds-construction-pr02-axiom.netlify.app` across regenerated page metadata, JSON-LD, the sitemap, robots.txt, the Terms of Service link and README, preserving URL paths and fragments; verified reference integrity and head-generation idempotence.
- Restored reliable offline retry and connection-status updates.
- Kept scroll-reveal content accessible when JavaScript is unavailable.
- Fixed initial gallery-lightbox focus trapping to include dynamically created controls.
- Corrected dark-theme hover backgrounds for feature cards and related interactive elements.
- Aligned active navigation colors with the selected site theme rather than the operating-system preference.
- Removed inactive mobile-theme handling and unsupported analytics event calls without changing working theme or form behavior.
- Corrected the public site origin across metadata, structured data, the sitemap and robots directives.
- Set utility pages and the demonstrational Certificates page to `noindex, follow`.
- Removed conflicting HTTP indexing directives while preserving per-page robots metadata.
- Aligned cookie-policy instructions with the implemented consent mechanism and browser-storage controls.

### Build and Tooling

- Added a Node-based production pipeline for CSS, JavaScript, service-worker generation and deployment output.
- Introduced content-hashed CSS and JavaScript bundles with deterministic builds, a shared build manifest and immutable production caching.
- Reduced the production payload to compiled application bundles and required standalone scripts, excluding unused source modules.
- Added separate local and production service-worker precache profiles generated from `sw.template.js`.
- Added explicit service-worker build commands while retaining the combined generation command for compatibility.
- Included the pre-paint theme initializer in the production offline precache and cache-revision inputs.
- Added responsive WebP and AVIF image generation with Sharp, limited to variants referenced by the website.
- Removed unused image variants and duplicate sources from the production asset set.
- Added shared HTML head templates and page metadata with idempotent generation.
- Added ESLint flat configuration for application modules, build tools and automated tests.
- Added local development and production preview servers.
- Aligned HTTP cache headers with generated assets, standalone scripts, fonts and images.
- Removed unused configuration, inactive modules and redundant structured-data sources.
- Removed unused Poppins font assets and aligned the bundled font-license notices.
- Added a reproducible dependency lockfile and Git ignore rules for generated reports and build output.

### Testing

- Added Lighthouse and pa11y runners for representative marketing, service and legal pages.
- Added `npm run qa:references` to validate local assets, links, metadata references and production build contracts.
- Automated QA server startup, readiness checks and cleanup without requiring a separately running preview server.
- Added Vitest and jsdom tests for the contact form, gallery lightbox, mobile navigation and cookie modal.
- Extended automated coverage to focus management, keyboard interactions, ARIA synchronization, consent persistence and form validation.
- Established a verified baseline of 33 passing tests across four test files.

### Security

- Added static-hosting security headers, including Content Security Policy, HSTS, framing restrictions, content-type protection, referrer rules and permissions restrictions.
- Aligned cache-control policies with fingerprinted production assets and unversioned resources.
- Removed unsupported tracking integrations without introducing analytics scripts or additional CSP permissions.

### Documentation

- Added bilingual README documentation covering project architecture, setup, development workflows and deployment.
- Added `settings.md` documenting project scripts and their intended usage.
- Added the KP_Code proprietary license and third-party attribution notices for redistributed fonts and icons.
- Updated the Terms of Service, Privacy Policy and Cookies Policy to project-specific legal templates reflecting Axiom's implemented functionality and external services.
- Clarified the Simply.com email-hosting provider and its location within the European Economic Area.
