import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const rootDir = process.cwd();
const reportsDir = path.join(rootDir, "reports", "pa11y");

await fs.mkdir(reportsDir, { recursive: true });

const pa11yBin = path.join(
  rootDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "pa11y.cmd" : "pa11y",
);

const checks = [
  { url: "http://localhost:8080/", report: "index.json" },
  {
    url: "http://localhost:8080/services/budowa-domow.html",
    report: "budowa-domow.json",
  },
  { url: "http://localhost:8080/legal/regulamin.html", report: "regulamin.json" },
];

const runPa11y = async (url) => {
  const args = [url, "--reporter", "json"];

  return new Promise((resolve, reject) => {
    const stdoutChunks = [];
    const stderrChunks = [];

    const child = spawn(pa11yBin, args, {
      cwd: rootDir,
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk) => stderrChunks.push(chunk));
    child.on("error", reject);

    child.on("close", (code) => {
      const stdout = Buffer.concat(stdoutChunks).toString("utf8");
      const stderr = Buffer.concat(stderrChunks).toString("utf8").trim();

      if (code === 0) {
        resolve(stdout);
        return;
      }

      const message = stderr || `pa11y failed for ${url} with exit code ${code}`;
      reject(new Error(message));
    });
  });
};

for (const check of checks) {
  const output = await runPa11y(check.url);
  const reportPath = path.join(reportsDir, check.report);

  await fs.writeFile(reportPath, output, "utf8");
  console.log(`Saved ${path.relative(rootDir, reportPath)}`);
}
