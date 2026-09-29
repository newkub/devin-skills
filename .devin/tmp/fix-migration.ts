// fix-migration.ts — surgical fixes for v1 migration damage
// 1. remove leaked source frontmatter inside merged sections
// 2. fix moved-script paths (masked filenames got name-rewritten)
// 3. inside-host self-refs -> merged section anchors
// 4. '## Section: X' -> '## X', dispatch scope fixes
// 5. dedupe repeated `/x` tokens within a line (all md files)
// 6. collapse stray blank line before frontmatter close
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Glob } from "bun";
import { execSync } from "node:child_process";

const ROOT = "C:/Users/Veerapong/AppData/Roaming/devin/skills";
const APPLY = process.argv.includes("--apply");
const log: string[] = [];
const p = (s: string) => log.push(s);
const gitShow = (pth: string) => execSync(`git show HEAD:${pth}`, { cwd: ROOT, encoding: "utf8" });
const gitLs = (pth: string) => execSync(`git ls-tree -r HEAD --name-only "${pth}"`, { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const title = (s: string) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

const INLINE: Record<string, { host: string; title: string }> = {
  "check-function-quality": { host: "review-code-quality", title: "Function Quality" },
  "check-single-responsibility": { host: "review-code-quality", title: "Single Responsibility" },
  "check-file-relations": { host: "review-code-quality", title: "File Relations" },
  "check-deprecated-apis": { host: "review-code-quality", title: "Deprecated APIs" },
  "check-flaky-tests": { host: "review-test", title: "Flaky Tests" },
  "check-test-isolation": { host: "review-test", title: "Test Isolation" },
  "check-test-quality": { host: "review-test", title: "Test Quality" },
  "check-coverage-config": { host: "review-test", title: "Coverage Config" },
  "check-types-coverage": { host: "review-test", title: "Types Coverage" },
  "check-error-coverage": { host: "review-test", title: "Error Coverage" },
  "check-api-contract": { host: "review-api", title: "API Contract" },
  "check-api-versioning": { host: "review-api", title: "API Versioning" },
  "check-rate-limiting": { host: "review-api", title: "Rate Limiting" },
  "check-webhook": { host: "review-api", title: "Webhook" },
  "check-idempotency": { host: "review-api", title: "Idempotency" },
  "check-backward-compatibility": { host: "review-api", title: "Backward Compatibility" },
  "check-cors-policy": { host: "review-security", title: "CORS Policy" },
  "check-security-headers": { host: "review-security", title: "Security Headers" },
  "check-supply-chain": { host: "review-security", title: "Supply Chain" },
  "check-unicode-homoglyph": { host: "review-security", title: "Unicode Homoglyph" },
  "check-bundle-regression": { host: "review-bundle", title: "Bundle Regression" },
  "check-source-maps": { host: "review-bundle", title: "Source Maps" },
  "check-size": { host: "review-bundle", title: "Bundle Size" },
  "check-migrations": { host: "review-database", title: "Migrations" },
  "check-schema-change": { host: "review-database", title: "Schema Change" },
  "check-release-drift": { host: "review-release", title: "Release Drift" },
  "check-release-notes": { host: "review-release", title: "Release Notes" },
  "check-infra": { host: "review-iac", title: "Infra" },
  "check-all-routes": { host: "review-delivery", title: "All Routes" },
  "check-routes-status": { host: "review-delivery", title: "Routes Status" },
  "check-async-misuse": { host: "review-backend", title: "Async Misuse" },
  "check-content-outdate": { host: "review-docs", title: "Content Outdate" },
  "check-git-diff": { host: "review-diff", title: "Git Diff" },
};
const SKILL_MERGE_SRC = "review-refactor";
const HOST_MAIN = "review-code-quality";

const hostChecks: Record<string, string[]> = {};
for (const [src, c] of Object.entries(INLINE)) (hostChecks[c.host] ??= []).push(src);

for (const [host, srcs] of Object.entries(hostChecks)) {
  const fp = join(ROOT, host, "SKILL.md");
  if (!existsSync(fp)) continue;
  let t = readFileSync(fp, "utf8");
  const orig = t;

  // 1. remove leaked frontmatter blocks (start `---` + `name:` until closing `---`)
  t = t.replace(/\n---\r?\nname:[\s\S]*?\r?\n---\r?\n/g, "\n");

  // 2. heading fix + dispatch scope fix
  t = t.replaceAll("## Section: Review Before Refactor", "## Review Before Refactor");
  t = t.replace("| `review-code-quality` | `## Review Before Refactor` |", "| `refactor`, `baseline` | `## Review Before Refactor` |");
  t = t.replace("| `review-code-quality` | `## Section: Review Before Refactor` |", "| `refactor`, `baseline` | `## Review Before Refactor` |");

  // 3. per-section fixes
  for (const src of srcs) {
    const secHead = `## Check: ${INLINE[src].title}`;
    const si = t.indexOf(secHead);
    if (si === -1) continue;
    const next = t.indexOf("\n## ", si + 1);
    const end = next === -1 ? t.length : next;
    let region = t.slice(si, end);
    const reg0 = region;

    // 3a. moved script path: shared/scripts/<host>.<ext> -> shared/scripts/<src>.<ext>
    for (const ext of ["ts", "ps1", "js"]) {
      region = region.replaceAll(`shared/scripts/${host}.${ext}`, `shared/scripts/${src}.${ext}`);
    }
    // 3b. subskill path mentions -> inlined headings
    for (const f of gitLs(src).filter((f) => f.includes("/subskills/"))) {
      const d = f.split("/subskills/")[1].split("/")[0];
      region = region.replace(new RegExp(`subskills/${escRe(d)}(/SKILL\\.md)?`, "g"), `\`#### ${title(d)}\``);
    }
    // 3c. sequential `/host` self-refs -> sections of the sibling checks cited in the ORIGINAL body
    let origBody: string;
    try {
      origBody = gitShow(`${src}/SKILL.md`).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
    } catch { origBody = ""; }
    const seq = [...origBody.matchAll(/`\/([a-z][a-z0-9-]*)`/g)].map((m) => m[1]).filter((r) => INLINE[r]?.host === host);
    let i = 0;
    region = region.replace(new RegExp("`/" + escRe(host) + "`", "g"), () => {
      const r = seq[i++];
      return r ? `\`## Check: ${INLINE[r].title}\`` : `\`## Check: ${INLINE[src].title}\``;
    });
    if (region !== reg0) t = t.slice(0, si) + region + t.slice(end);
  }

  // refactor-merge section: `/host` inside it meant the main flow -> point at ## Execute
  const rsi = t.indexOf("## Review Before Refactor");
  if (rsi !== -1) {
    const re0 = t.indexOf("\n## ", rsi + 1);
    const rend = re0 === -1 ? t.length : re0;
    const region = t.slice(rsi, rend).replace(new RegExp("`?/" + escRe(HOST_MAIN) + "`?", "g"), "code quality review ใน `## Execute` ด้านบน");
    if (region !== t.slice(rsi, rend)) t = t.slice(0, rsi) + region + t.slice(rend);
  }

  // 4. frontmatter: drop blank line before closing ---
  t = t.replace(/^(---\r?\n[\s\S]*?)\n\r?\n---/m, "$1\n---");

  if (t !== orig) {
    if (APPLY) writeFileSync(fp, t);
    p(`fixed host: ${host}`);
  }
}

// 5. dedupe repeated `/x` tokens per line + collapse `x, x` in every md file
const allMd = new Set<string>();
for (const g of ["**/SKILL.md", "**/references/*.md", "**/templates/*.md", "**/subagents/*.md", "*.md"]) {
  for (const rel of new Glob(g).scanSync(ROOT)) allMd.add(rel.replace(/\\/g, "/"));
}
allMd.add("AGENTS.md");
let dupFixed = 0;
for (const rel of allMd) {
  const fp = join(ROOT, rel);
  if (!existsSync(fp)) continue;
  const t = readFileSync(fp, "utf8");
  const out = t.split("\n").map((line) => {
    if (!line.includes("/")) return line;
    const seen = new Set<string>();
    // dedupe `x`, `x` repeated backticked token sequences like `/a`, `/b`, `/a` -> keep first occurrence set
    const tokens = [...line.matchAll(/`\/([a-z][a-z0-9-]*)`/g)].map((m) => m[0]);
    const count = new Map<string, number>();
    for (const tk of tokens) count.set(tk, (count.get(tk) ?? 0) + 1);
    if (![...count.values()].some((c) => c > 1)) return line;
    let res = line;
    const emitted = new Set<string>();
    res = res.replace(/`\/[a-z][a-z0-9-]*`(\s*,\s*|\s+และ\s+|\s*\||\s*$)/g, (m) => {
      const tok = m.match(/`\/[a-z][a-z0-9-]*`/)![0];
      if (emitted.has(tok)) {
        if (/\|\s*$/.test(m)) return m.match(/\|\s*$/)![0];
        if (/และ\s*$/.test(m)) return " และ ";
        return "";
      }
      emitted.add(tok);
      return m;
    });
    return res.replace(/,\s*\|/g, " |").replace(/,\s*$/g, "").replace(/,\s*,/g, ",");
  }).join("\n");
  if (out !== t) {
    if (APPLY) writeFileSync(fp, out);
    dupFixed++;
    p(`dedup tokens: ${rel}`);
  }
}
p(`dup-token files fixed: ${dupFixed}`);
console.log(log.join("\n"));
