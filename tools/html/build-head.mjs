import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

const templatePath = path.join(projectRoot, "tools/templates/head.partial.html");
const metaPath = path.join(projectRoot, "tools/templates/pages.meta.json");
const sitemapPath = path.join(projectRoot, "sitemap.xml");
// Page metadata uses root-relative paths resolved against this public origin.
const siteOrigin = "https://ds-construction-pr02-axiom.netlify.app";
const defaultOgImage = "/assets/img/og/og-1200x630.jpg";
const defaultRobots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== "--preview")) {
  console.error(`Invalid arguments: ${args.join(" ")}. Usage: node tools/html/build-head.mjs [--preview]`);
  process.exit(1);
}
const preview = args.length === 1;

const template = fs.readFileSync(templatePath, "utf8").trimEnd();
const pageMeta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
if (!pageMeta || typeof pageMeta !== "object" || Array.isArray(pageMeta)) {
  throw new Error("Page metadata must be an object keyed by HTML page paths");
}

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const buildAssetPrefix = (filePath) => {
  const depth = filePath.split("/").length - 1;
  return depth > 0 ? "../".repeat(depth) : "";
};

const renderHead = (filePath, meta) => {
  const ogTitle = meta.og_title ?? meta.title;
  const ogDescription = meta.og_description ?? meta.description;
  const ogImage = meta.og_image ?? defaultOgImage;
  const twitterTitle = meta.twitter_title ?? ogTitle;
  const twitterDescription = meta.twitter_description ?? ogDescription;
  const twitterImageAlt = meta.twitter_image_alt ?? meta.og_image_alt;

  const replacements = {
    "{{TITLE}}": meta.title,
    "{{DESCRIPTION}}": meta.description,
    "{{CANONICAL}}": meta.canonical,
    "{{ROBOTS}}": meta.robots ?? defaultRobots,
    "{{OG_TITLE}}": ogTitle,
    "{{OG_DESCRIPTION}}": ogDescription,
    "{{OG_URL}}": meta.canonical,
    "{{OG_IMAGE}}": ogImage,
    "{{OG_IMAGE_ALT}}": meta.og_image_alt,
    "{{TWITTER_TITLE}}": twitterTitle,
    "{{TWITTER_DESCRIPTION}}": twitterDescription,
    "{{TWITTER_IMAGE_ALT}}": twitterImageAlt,
    "{{ASSET_PREFIX}}": buildAssetPrefix(filePath)
  };

  return Object.entries(replacements).reduce((output, [token, value]) => {
    if (typeof value !== "string") {
      throw new Error(`Missing required metadata value for ${token} in ${filePath}`);
    }

    const renderedValue = ["{{CANONICAL}}", "{{OG_URL}}", "{{OG_IMAGE}}"].includes(token)
      ? new URL(value, siteOrigin).href
      : value;

    return output.replaceAll(token, escapeAttr(renderedValue));
  }, template);
};

const indentBlock = (block, spaces = 4) => {
  const prefix = " ".repeat(spaces);
  const [firstLine, ...restLines] = block.trim().split("\n");
  // The retained block is matched from `<script` onwards, so its first line never
  // carries the source indentation. Measuring the dedent baseline across every line
  // therefore always yields zero and stacks another prefix onto the continuation
  // lines on each run, so the baseline is measured on the continuation lines only.
  const contentLines = restLines.filter((line) => line.trim().length > 0);
  const baseIndent =
    contentLines.length > 0 ? Math.min(...contentLines.map((line) => line.match(/^[ \t]*/)[0].length)) : 0;
  const outerIndent = new RegExp(`^[ \\t]{0,${baseIndent}}`);

  const normalized = restLines.map((line) =>
    line.trim().length > 0 ? `${prefix}${line.replace(outerIndent, "")}` : line
  );

  return [`${prefix}${firstLine.replace(/^[ \t]+/, "")}`, ...normalized].join("\n");
};

const extractHeadExtras = (headInner) => {
  const scriptRegex = /<script\b[\s\S]*?<\/script>/gi;
  const extras = [];

  for (const match of headInner.matchAll(scriptRegex)) {
    const script = match[0];
    if (script.includes("application/ld+json") || script.includes("theme-init.js")) {
      extras.push(indentBlock(script));
    }
  }

  return extras;
};

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Directives are compared whole, so only `noindex` (or `none`, which implies it) excludes a page;
// `index` or `max-snippet:-1` never match by substring.
const isIndexable = (meta) => {
  const directives = (meta.robots ?? defaultRobots).split(",").map((directive) => directive.trim().toLowerCase());
  return !directives.includes("noindex") && !directives.includes("none");
};

const isCalendarDate = (value) => {
  const time = Date.parse(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(time) && new Date(time).toISOString().startsWith(value);
};

// Sitemap fields in protocol order. Values stay strings, so a priority keeps its declared form such as "1.0".
const sitemapFields = {
  lastmod: isCalendarDate,
  changefreq: (value) => ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].includes(value),
  priority: (value) => /^(?:0(?:\.\d+)?|1(?:\.0+)?)$/.test(value)
};

const renderSitemapUrl = (filePath, meta) => {
  const loc = new URL(meta.canonical, siteOrigin);
  if (loc.origin !== siteOrigin) {
    throw new Error(`Sitemap URL for ${filePath} must use ${siteOrigin}`);
  }

  const fields = Object.entries(sitemapFields).map(([field, isValid]) => {
    const value = meta[field];
    if (typeof value !== "string" || !isValid(value)) {
      throw new Error(`Missing or invalid sitemap value for ${field} in ${filePath}`);
    }

    return `    <${field}>${escapeXml(value)}</${field}>`;
  });

  return ["  <url>", `    <loc>${escapeXml(loc.href)}</loc>`, ...fields, "  </url>"].join("\n");
};

// Validate and render every page before allowing any HTML writes.
const preparedPages = Object.entries(pageMeta).map(([filePath, meta]) => {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    throw new Error(`Invalid metadata object for ${filePath}`);
  }

  const absolutePath = path.join(projectRoot, filePath);
  const html = fs.readFileSync(absolutePath, "utf8");
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  const headTags = html.match(/<\/?head\b[^>]*>/gi) ?? [];

  if (!headMatch || headTags.length !== 2) {
    throw new Error(`Expected exactly one valid <head>...</head> in ${filePath}`);
  }

  const currentHeadInner = headMatch[1];
  const extraBlocks = extractHeadExtras(currentHeadInner);
  const generatedHead = renderHead(filePath, meta);

  const headSections = [generatedHead, ...extraBlocks];
  // The template and each page carry the repository line endings, so the assembled
  // head is normalised back to the page's own convention to keep runs byte-stable.
  const eol = html.includes("\r\n") ? "\r\n" : "\n";
  const nextHeadInner = `\n${headSections.join("\n\n")}\n  `.replace(/\r\n|\n/g, eol);

  const updatedHtml = html.replace(headMatch[0], `<head>${nextHeadInner}</head>`);

  return { filePath, absolutePath, content: updatedHtml, changed: updatedHtml !== html };
});

// The sitemap lists every indexable page under its canonical URL, in metadata order, and is
// validated and rendered with the pages, so a sitemap error also prevents every write.
const sitemapUrls = Object.entries(pageMeta)
  .filter(([, meta]) => isIndexable(meta))
  .map(([filePath, meta]) => renderSitemapUrl(filePath, meta));
const updatedSitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls,
  "</urlset>\n"
].join("\n");
const currentSitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : null;

const outputs = [
  ...preparedPages,
  {
    filePath: "sitemap.xml",
    absolutePath: sitemapPath,
    content: updatedSitemap,
    changed: updatedSitemap !== currentSitemap
  }
];
const changedCount = outputs.filter((output) => output.changed).length;
const unchangedCount = outputs.length - changedCount;

for (const { filePath, absolutePath, content, changed } of outputs) {
  if (!preview && changed) {
    fs.writeFileSync(absolutePath, content, "utf8");
  }
  console.log(`${changed ? "CHANGED" : "UNCHANGED"}: ${filePath}`);
}

console.log(
  `${preview ? "Preview" : "Apply"}: ${changedCount} changed, ${unchangedCount} unchanged; ` +
    (preview ? "no files written." : `${changedCount} files written.`)
);
