// Service worker precache declarations.
//
// The single owner of the fixed precache entries of both service worker
// profiles and of the rule that turns a manifest icon into a precache URL.
// tools/sw/build-sw.mjs renders both service workers from these declarations,
// and tools/qa/check-references.mjs resolves the production entries without a
// build. Both import them, so generation and validation cannot drift apart.
//
// Side-effect free: importing this module reads nothing and writes nothing.

import { readFile } from "node:fs/promises";
import path from "node:path";

import { getCssImportPath, parseJsImports, resolveJsImport } from "../source-imports.mjs";

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
  // Both theme logos offline.html renders. The first page view is not yet
  // controlled by the worker, so the runtime image cache never stores them.
  "/assets/img/logo/logo-light.svg",
  "/assets/img/logo/logo-dark.svg",
];

// Local pages load the source graph directly. Follow the same imports as the
// production bundlers so a first visit caches every required stylesheet and module.
export const getLocalPrecache = async (root) => {
  const files = new Set();
  const visit = async (filePath, resolveImports) => {
    if (files.has(filePath)) return;
    files.add(filePath);

    const source = await readFile(filePath, "utf8");
    for (const dependency of resolveImports(source, filePath)) {
      await visit(dependency, resolveImports);
    }
  };

  await visit(path.join(root, "css/main.css"), (source, filePath) =>
    source.split(/\r?\n/).map(getCssImportPath).filter(Boolean)
      .map((importPath) => path.resolve(path.dirname(filePath), importPath)),
  );
  await visit(path.join(root, "js/main.js"), (source, filePath) =>
    parseJsImports(source).map(({ path: importPath }) => resolveJsImport(importPath, filePath)),
  );

  const sourceUrls = Array.from(files, (filePath) => `/${path.relative(root, filePath).split(path.sep).join("/")}`);
  return [...BASE_PRECACHE, ...sourceUrls];
};

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
