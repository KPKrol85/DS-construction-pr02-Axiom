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

- **Affected journey:** Correcting several fields after enhanced contact-form validation.
- **Evidence:** `index.html:1155-1157`; `js/components/forms.js:18-33`, `js/components/forms.js:128-145`; `tests/contact-form.test.js`, the error-summary tests.
- **Current experience:** When the script generates an error summary, it lists invalid field labels as plain text, focuses the first invalid field and exposes a shortcut back to that first field. The remaining fields can be reached through normal form navigation.
- **Proposed improvement:** Make each field named in the existing summary a direct link to that field, retaining the first-error shortcut.
- **Expected user value:** Someone reviewing several errors could choose the field to correct without moving sequentially through the form.
- **Implementation scope:** Restrict changes to summary construction and field-link focus handling in `js/components/forms.js`, with minimal form styling if needed. Preserve field IDs, validation rules, native validation, existing announcements, the keyboard shortcut and submission processing.
- **Acceptance criteria:** When enhanced validation identifies multiple invalid fields, each summary entry has a meaningful Polish field name and targets the correct control. Pointer and keyboard activation focus that control without clearing any values. The first-error shortcut still works, and the summary is hidden when no invalid fields remain.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-02 — Keep successful submission confirmation available

- **Affected journey:** Understanding completion after an enhanced contact-form submission.
- **Evidence:** `js/components/forms.js:163-192`; `index.html:1223-1225`; `success.html:114-124`; `tests/contact-form-production.test.js:133-197`.
- **Current experience:** Following an acknowledged enhanced submission, the form resets and shows a success message and “Wysłano ✓” button state. A timer clears that message and restores the button label after six seconds. The native submission path instead has a dedicated confirmation page.
- **Proposed improvement:** Retain the inline success confirmation until the visitor starts another message, independently of the button's temporary sent state.
- **Expected user value:** A visitor who looks away briefly could still establish that the previous submission completed after returning to the reset form.
- **Implementation scope:** Adjust only the inline status lifecycle in `js/components/forms.js`. Preserve acknowledged-success gating, form reset, draft removal, pending-request protection, button re-enabling, native fallback and `/success.html`; add no response-time promises or delivery claims beyond the existing acknowledgement.
- **Acceptance criteria:** After simulated successful enhanced submission, confirmation remains visible beyond six seconds while the button returns to its normal usable state. Starting another message replaces the old confirmation appropriately. Validation and pending/failure messages remain usable; unsuccessful requests never display success. Focus is not moved merely to announce completion.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-03 — Explain restored message drafts and offer a fresh start

- **Affected journey:** Returning to a partially written contact message.
- **Evidence:** `js/components/forms.js:52-70`, `js/components/forms.js:173-176`; `index.html:1192-1204`; `js/core/config.js`, `CONTACT_FORM.messageStorageKey`; `legal/polityka-prywatnosci.html:281-301`.
- **Current experience:** The message body is saved under `contactFormMessage` and restored during form initialization, with the character counter updated. The form provides no contextual restoration notice or dedicated discard action; visitors can edit or delete the restored text themselves. Other contact fields are not restored by this mechanism.
- **Proposed improvement:** Show a brief Polish notice beside a restored message explaining that it came from this browser, with an explicit action to discard that draft and start with an empty message.
- **Expected user value:** Returning visitors could recognize why text is already present and deliberately choose whether to continue it.
- **Implementation scope:** Use `index.html`, `js/components/forms.js` and existing form styles. Retain the current storage key and safe-storage wrappers; store no additional personal fields or metadata. Discard affects only the message and its saved draft, preserving other entered values and the separate theme/project preferences.
- **Acceptance criteria:** A non-empty stored draft produces the notice and an operable discard button on restoration. Discard clears the message, resets its counter, removes only its storage entry and leaves focus in the message field. With no saved draft, no restoration notice appears. Storage exceptions do not prevent editing or submission and do not produce an unsupported claim that persistent data was removed.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-04 — Expose the lightbox's existing photograph position visually

- **Affected journey:** Browsing photographs in the homepage and six service galleries.
- **Evidence:** `js/components/lightbox.js:108-128`, `js/components/lightbox.js:174-199`, `js/components/lightbox.js:258-271`; `index.html:1106-1114`; `css/base/base.css:41-53`.
- **Current experience:** The lightbox tracks the current image within its originating gallery, wraps previous/next navigation and announces “Zdjęcie X z N” in a visually hidden live region. Captions and navigation controls are present, but the position text is not visible.
- **Proposed improvement:** Add a visible current-image/total indicator using the position already calculated by the lightbox.
- **Expected user value:** Visitors could tell where they are in a gallery and recognize when navigation wraps to its beginning.
- **Implementation scope:** Extend the shared lightbox rendering in `js/components/lightbox.js` and its canonical CSS; adjust canonical lightbox markup only if necessary. Preserve image order, alt-derived captions, live announcements, swipe and arrow navigation, focus trapping, fullscreen controls and focus return. No thumbnails, filters or new gallery model are needed.
- **Acceptance criteria:** Opening any thumbnail displays its correct position within that gallery. Previous/next buttons, arrow keys and swipes update the indicator, including wraparound. Reopening another gallery resets the total correctly. The indicator remains readable without obscuring controls or captions at narrow widths and in fullscreen/immersive modes, with no duplicate live announcement.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-05 — Indicate the current homepage section in navigation

- **Affected journey:** Moving through the long homepage using anchors or scrolling.
- **Evidence:** `index.html:283-291`; `js/components/navigation.js:4-123`; `css/layout/layout.css:325-338`; `js/sections/hero.js`, `initHeroReveal` (its observer controls content reveal, not navigation state).
- **Current experience:** The homepage navigation links to five content sections and marks “Strona Główna” as the current page. The navigation script manages opening, closing and breakpoint state; it does not indicate which homepage section is currently being read. Section headings and working anchor destinations already provide orientation.
- **Proposed improvement:** Supplement the existing page indicator with a current-section marker for the homepage's section links, synchronized with scrolling and anchor navigation.
- **Expected user value:** Visitors could identify their position among the existing homepage sections before choosing their next destination, including when reopening the mobile menu.
- **Implementation scope:** Limit enhancement to homepage section tracking in `js/components/navigation.js` and shared navigation styling. Keep `aria-current="page"` and all destinations unchanged; use a separate section-state marker rather than overwriting page identity. Preserve mobile-menu focus, dismissal and scroll behavior, service-page navigation, theme support and static navigation when JavaScript or observation APIs are unavailable.
- **Acceptance criteria:** On the homepage, the section at the reading position below the sticky header has one distinguishable marker in desktop navigation and the opened mobile menu. Direct fragment entry, anchor activation and manual scrolling update it consistently; the hero/top position has no section marker. Page-current semantics remain intact, service/legal pages receive no homepage scroll state, and tracking never changes focus, scroll position, URL or browser history.
- **Impact:** Medium
- **Effort:** Medium

## Selection summary

All five proposals refine existing workflows without changing the framework, routes, backend or demonstration purpose. Each can be implemented independently. IMP-UX-01–03 share the form module and should be coordinated to preserve validation, draft and submission-state contracts; none depends on implementing another proposal.

The set is a bounded candidate backlog for focused development, predominantly small changes with one medium navigation task. Relative impact and effort reflect source-level judgment, not measured user outcomes or a guarantee that the complete set fits one working day. Implementation requires separate approval.

## Analysis limitations

- This review inspected canonical sources, interaction/state code, existing test definitions and project records. Tests were read, not executed; historical verification results were not treated as current runs.
- No browser inspection, real-device use, screen-reader testing, formal WCAG audit or user research was performed. Responsive/fullscreen behavior and focus outcomes in the acceptance criteria remain future verification requirements.
- Live Netlify delivery, production reCAPTCHA, service-worker lifecycle and actual offline recovery were not exercised. Local submissions are simulated by the implementation and cannot establish delivery. The proposals do not depend on claims about those external/runtime outcomes.
