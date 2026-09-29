// fix2.ts — inside each "## Check: X" region, /host self-refs -> own section anchor
// also fix remaining moved-script paths
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "C:/Users/Veerapong/AppData/Roaming/devin/skills";
const APPLY = process.argv.includes("--apply");
const log: string[] = [];

const HOSTS = ["review-code-quality", "review-test", "review-api", "review-security", "review-bundle", "review-database", "review-release", "review-iac", "review-delivery", "review-backend", "review-docs", "review-diff"];

for (const host of HOSTS) {
  const fp = join(ROOT, host, "SKILL.md");
  let t: string;
  try { t = readFileSync(fp, "utf8"); } catch { continue; }
  const orig = t;
  // split into regions by top-level headings
  const lines = t.split("\n");
  let curSec = "";
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^## (.+)/);
    if (m) curSec = m[1];
    if (curSec.startsWith("Check: ")) {
      const sec = "`## Check: " + curSec.slice(7) + "`";
      lines[i] = lines[i].replace(new RegExp("`?/" + host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`?", "g"), sec);
    }
    if (curSec === "Review Before Refactor") {
      lines[i] = lines[i].replace(new RegExp("`?/" + host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`?", "g"), "`## Execute`");
    }
  }
  t = lines.join("\n");
  if (t !== orig) {
    if (APPLY) writeFileSync(fp, t);
    log.push(`fixed sections: ${host}`);
  }
}
console.log(log.join("\n"));
