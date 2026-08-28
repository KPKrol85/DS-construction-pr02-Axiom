import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..", "..");
const sourceRoot = path.join(rootDir, "assets", "img");
const outputRoot = path.join(sourceRoot, "_optimized");

const args = new Set(process.argv.slice(2));
const skipDirs = new Set(["favicon", "icon", "logo", "shortcuts", "screenshots", "og", "_optimized"]);
const rasterExts = new Set([".jpg", ".jpeg", ".png"]);
const responsiveWidths = [480, 768, 1024, 1440, 1920];
const minProcessDimension = 420;
const sizeSuffixPattern = /-\d{3,4}x\d{3,4}$/;

const webpOptions = { quality: 80, effort: 5 };
const avifOptions = { quality: 45, effort: 4 };

const formatBytes = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const safeRel = (filePath) => path.relative(sourceRoot, filePath).split(path.sep).join("/");

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const removeDir = async (dirPath) => {
  await fs.rm(dirPath, { recursive: true, force: true });
};

const walk = async (dirPath) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) {
        continue;
      }
      files.push(...(await walk(fullPath)));
      continue;
    }
    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
};

if (args.has("--clean")) {
  await removeDir(outputRoot);
  console.log(`[img:clean] Removed ${safeRel(outputRoot)}`);
  process.exit(0);
}

const run = async () => {
  const files = await walk(sourceRoot);
  const skipped = [];
  let processedCount = 0;
  let inputBytes = 0;
  let outputBytes = 0;
  let responsiveSkipped = 0;

  for (const filePath of files) {
    const relPath = safeRel(filePath);
    const ext = path.extname(filePath).toLowerCase();

    if (!rasterExts.has(ext)) {
      skipped.push({ file: relPath, reason: `format:${ext || "unknown"}` });
      continue;
    }

    let metadata;
    try {
      metadata = await sharp(filePath).metadata();
    } catch (error) {
      skipped.push({ file: relPath, reason: "unreadable" });
      continue;
    }

    if (!metadata.width || !metadata.height) {
      skipped.push({ file: relPath, reason: "missing-dimensions" });
      continue;
    }

    const maxDimension = Math.max(metadata.width, metadata.height);
    if (maxDimension < minProcessDimension) {
      skipped.push({ file: relPath, reason: `too-small:${metadata.width}x${metadata.height}` });
      continue;
    }

    const stat = await fs.stat(filePath);
    inputBytes += stat.size;

    const relDir = path.dirname(relPath);
    const outputDir = path.join(outputRoot, relDir);
    await ensureDir(outputDir);

    const baseName = path.parse(filePath).name;
    const isSizeTagged = sizeSuffixPattern.test(baseName);

    const outputs = [
      {
        format: "webp",
        options: webpOptions,
      },
      {
        format: "avif",
        options: avifOptions,
      },
    ];

    for (const { format, options } of outputs) {
      const baseOutput = path.join(outputDir, `${baseName}.${format}`);
      await sharp(filePath).rotate().toFormat(format, options).toFile(baseOutput);
      outputBytes += (await fs.stat(baseOutput)).size;

      if (isSizeTagged) {
        responsiveSkipped += 1;
        continue;
      }
      for (const width of responsiveWidths) {
        if (width >= metadata.width) {
          continue;
        }
        const sizedOutput = path.join(outputDir, `${baseName}-${width}w.${format}`);
        await sharp(filePath)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .toFormat(format, options)
          .toFile(sizedOutput);
        outputBytes += (await fs.stat(sizedOutput)).size;
      }
    }

    processedCount += 1;
  }

  console.log(`[img:build] Processed files: ${processedCount}`);
  console.log(`[img:build] Input size: ${formatBytes(inputBytes)}`);
  console.log(`[img:build] Output size: ${formatBytes(outputBytes)}`);
  console.log(`[img:build] Responsive variants skipped (size-tagged sources): ${responsiveSkipped}`);

  if (skipped.length) {
    console.log(`[img:build] Skipped files (${skipped.length}):`);
    skipped.forEach((entry) => {
      console.log(`- ${entry.file} (${entry.reason})`);
    });
  }
};

run().catch((error) => {
  console.error("[img:build] Failed:", error);
  process.exit(1);
});
