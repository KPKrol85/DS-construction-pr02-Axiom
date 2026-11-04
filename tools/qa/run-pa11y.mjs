import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

import { startLocalQaServer } from "./local-server.mjs";

const rootDir = process.cwd();
const reportsDir = path.join(rootDir, "reports", "pa11y");

// Resolved the same repository-local way the server helper resolves
// http-server: the package entry point, run with the current Node binary.
const pa11yEntry = path.join(rootDir, "node_modules", "pa11y", "bin", "pa11y.js");

const checks = [
  { url: "http://localhost:8080/", report: "index.json" },
  {
    url: "http://localhost:8080/services/budowa-domow.html",
    report: "budowa-domow.json",
  },
  { url: "http://localhost:8080/legal/regulamin.html", report: "regulamin.json" },
];

// Chromium glyph-mask measurements at 1440x900 and 390x844, in both themes,
// verified minima of 8.46:1 (brand) and 10.06:1 (descriptor). HTMLCS instead
// compares white text with body #f6f7f9, missing the photograph and scrim.
// Reverify these exceptions after changes to HERO imagery, overlays or type.
const heroFalsePositives = new Map([
  [
    "#main > section:nth-child(1) > div > h1 > span:nth-child(1)",
    '<span class="hero__brand">Axiom Construction</span>',
  ],
  [
    "#main > section:nth-child(1) > div > h1 > span:nth-child(2)",
    '<span class="hero__descriptor">Budownictwo • Remonty • Wykończ...</span>',
  ],
]);
const heroFalsePositiveReason =
  "Verified HERO false positive: HTMLCS uses the body background instead of the photograph and gradient scrim; Chromium pixel measurements passed WCAG AA in desktop/mobile and light/dark states.";

const isAcceptedFalsePositive = (url, issue) =>
  url === "http://localhost:8080/" &&
  issue.runner === "htmlcs" &&
  issue.type === "error" &&
  issue.code === "WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.Fail" &&
  issue.message ===
    "This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 3:1, but text in this element has a contrast ratio of 1.07:1. Recommendation:  change background to #939496." &&
  heroFalsePositives.get(issue.selector) === issue.context;

const parseIssues = (output) => {
  const issues = JSON.parse(output);
  const types = { error: 1, warning: 2, notice: 3 };
  if (
    !Array.isArray(issues) ||
    issues.some(
      (issue) =>
        !issue ||
        !["code", "message", "context", "selector", "runner"].every(
          (key) => typeof issue[key] === "string" && issue[key].length > 0,
        ) ||
        !Object.hasOwn(types, issue.type) ||
        issue.typeCode !== types[issue.type],
    )
  ) {
    throw new Error("Malformed Pa11y issue report");
  }
  return issues;
};

const runPa11y = async (url) => {
  const args = [pa11yEntry, url, "--reporter", "json"];

  return new Promise((resolve, reject) => {
    const stdoutChunks = [];
    const stderrChunks = [];

    const child = spawn(process.execPath, args, {
      cwd: rootDir,
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk) => stderrChunks.push(chunk));
    child.on("error", reject);

    child.on("close", (code) => {
      const stdout = Buffer.concat(stdoutChunks).toString("utf8");
      const stderr = Buffer.concat(stderrChunks).toString("utf8").trim();

      // Exit 2 means a completed audit with violations, not an execution error.
      if (code === 0 || code === 2) {
        resolve({ output: stdout, exitCode: code });
        return;
      }

      const message = stderr || `pa11y failed for ${url} with exit code ${code}`;
      reject(new Error(message));
    });
  });
};

const run = async () => {
  await fs.mkdir(reportsDir, { recursive: true });

  const server = await startLocalQaServer({ rootDir });

  try {
    let failedChecks = 0;
    for (const check of checks) {
      const reportPath = path.join(reportsDir, check.report);
      try {
        const { output, exitCode } = await runPa11y(check.url);
        // Preserve the original output even if parsing or validation fails.
        await fs.writeFile(reportPath, output, "utf8");
        const issues = parseIssues(output);
        if ((exitCode === 2) !== issues.some((issue) => issue.type === "error")) {
          throw new Error(`Pa11y exit code ${exitCode} does not match its report`);
        }
        let unexpectedIssues = 0;
        const report = issues.map((issue) => {
          if (isAcceptedFalsePositive(check.url, issue)) {
            return { ...issue, acceptedFalsePositive: { reason: heroFalsePositiveReason } };
          }
          unexpectedIssues += 1;
          return issue;
        });
        await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
        const accepted = issues.length - unexpectedIssues;
        console.log(`Saved ${path.relative(rootDir, reportPath)} (${accepted} accepted false positives, ${unexpectedIssues} unexpected issues)`);

        if (unexpectedIssues) throw new Error(`${unexpectedIssues} unexpected accessibility issues`);
      } catch (error) {
        failedChecks += 1;
        console.error(`${check.url}: ${error.message}`);
      }
    }
    if (failedChecks) throw new Error(`${failedChecks} page checks failed; see saved reports and errors above`);
  } finally {
    await server.stop();
  }
};

try {
  await run();
} catch (error) {
  console.error(`Accessibility audit failed: ${error.message}`);
  process.exitCode = 1;
}
