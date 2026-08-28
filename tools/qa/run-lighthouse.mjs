import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const rootDir = process.cwd();
const reportsDir = path.join(rootDir, "reports", "lighthouse");

await fs.mkdir(reportsDir, { recursive: true });

const lhciBin = path.join(
  rootDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "lhci.cmd" : "lhci",
);

const args = [
  "collect",
  "--url=http://localhost:8080/",
  "--url=http://localhost:8080/services/budowa-domow.html",
  "--url=http://localhost:8080/legal/regulamin.html",
  "--outputDir=reports/lighthouse",
];

await new Promise((resolve, reject) => {
  const child = spawn(lhciBin, args, {
    cwd: rootDir,
    stdio: "inherit",
  });

  child.on("error", reject);

  child.on("close", (code) => {
    if (code === 0) {
      resolve();
      return;
    }

    reject(new Error(`lhci collect failed with exit code ${code}`));
  });
});
