// Service worker precache declarations.
//
// The single owner of the fixed precache entries of both service worker
// profiles and of the rule that turns a manifest icon into a precache URL.
// tools/sw/build-sw.mjs renders both service workers from these declarations,
// and tools/qa/check-references.mjs resolves the production entries without a
// build. Both import them, so generation and validation cannot drift apart.
//
// Side-effect free: importing this module reads nothing and writes nothing.

// Production precache base: the fixed URLs served from the deployment root that
// build:dist assembles.
//
// The production CSS and JavaScript bundles are deliberately absent: their URLs
// carry a content hash and are read from dist/build-manifest.json per build, so
// this module never constructs or hardcodes one.
export const BASE_PRECACHE = [
  "/",
  "/offline.html",
  "/js/offline.js",
  "/js/theme-init.js",
  "/manifest.webmanifest",
];

// Local precache base: the URLs served from the repository root by
// `npm run serve`. The production bundles do not exist there; all 15
// maintained HTML pages load css/main.css, js/main.js, and js/theme-init.js
// directly, while offline.html additionally loads js/offline.js for recovery.
// Those are the files a locally installed service worker can precache. The
// remaining entries are shared with the production profile.
export const LOCAL_PRECACHE = [
  "/",
  "/offline.html",
  "/css/main.css",
  "/js/main.js",
  "/js/offline.js",
  "/js/theme-init.js",
  "/manifest.webmanifest",
];

// The precache URLs of the icons a parsed web app manifest declares, in
// declaration order: every non-empty string `src`, rooted at the serving root.
// Whether an icon file exists is the caller's concern - build-sw.mjs skips a
// missing one, while check-references.mjs reports it.
export const manifestIconUrls = (manifest) => {
  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];

  return icons
    .filter((icon) => typeof icon?.src === "string" && icon.src)
    .map((icon) => (icon.src.startsWith("/") ? icon.src : `/${icon.src}`));
};
