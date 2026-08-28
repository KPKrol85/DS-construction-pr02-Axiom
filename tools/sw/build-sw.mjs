import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const TEMPLATE_PATH = path.join(ROOT, "sw.template.js");
const OUTPUT_PATH = path.join(ROOT, "dist", "sw.js");
const MANIFEST_PATH = path.join(ROOT, "manifest.webmanifest");

const REVISION_INPUTS = [
  path.join(ROOT, "dist/style.min.css"),
  path.join(ROOT, "dist/script.min.js"),
  MANIFEST_PATH,
];

const BASE_PRECACHE = [
  "/",
  "/offline.html",
  "/style.min.css",
  "/script.min.js",
  "/manifest.webmanifest",
];

const readFileBuffer = async (filePath) => fs.readFile(filePath);

const buildRevision = async () => {
  const hash = crypto.createHash("sha256");

  for (const filePath of REVISION_INPUTS) {
    const data = await readFileBuffer(filePath);
    hash.update(data);
  }

  return hash.digest("hex").slice(0, 16);
};

const getManifestIcons = async () => {
  const manifestRaw = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestRaw);
  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];

  const existingIconUrls = [];
  for (const icon of icons) {
    if (!icon?.src || typeof icon.src !== "string") continue;
    const iconUrl = icon.src.startsWith("/") ? icon.src : `/${icon.src}`;
    const iconFilePath = path.join(ROOT, iconUrl.replace(/^\//, ""));

    try {
      await fs.access(iconFilePath);
      existingIconUrls.push(iconUrl);
    } catch {
      // Ignore missing manifest icons.
    }
  }

  return existingIconUrls;
};

const buildServiceWorker = async () => {
  const [template, revision, manifestIcons] = await Promise.all([
    fs.readFile(TEMPLATE_PATH, "utf8"),
    buildRevision(),
    getManifestIcons(),
  ]);

  const precacheAssets = JSON.stringify([...new Set([...BASE_PRECACHE, ...manifestIcons])]);

  const output = template
    .replace("__SW_REVISION__", revision)
    .replace("__PRECACHE_ASSETS__", precacheAssets);

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, output, "utf8");
  console.log(`Generated sw.js (revision: ${revision})`);
};

buildServiceWorker().catch((error) => {
  console.error("Failed to build service worker", error);
  process.exitCode = 1;
});
