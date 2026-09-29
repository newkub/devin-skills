// migrate-checks-v2.ts — fix + redo inline merges correctly
// 1) restore host SKILL.md from HEAD  2) re-merge with CRLF-safe strip, script-path masking, section refs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Glob } from "bun";
import { execSync } from "node:child_process";

const ROOT = "C:/Users/Veerapong/AppData/Roaming/devin/skills";
const APPLY = process.argv.includes("--apply");
const log: string[] = [];
const p = (s: string) => log.push(s);

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
const SKILL_MERGE: Record<string, { host: string; title: string }> = {
  "review-refactor": { host: "review-code-quality", title: "Review Before Refactor" },
};
const SUBSKILL: { src: string; host: string; dir: string }[] = [
  { src: "check-broken-symlinks", host: "check-repo-hygiene", dir: "broken-symlinks" },
  { src: "check-console-logs", host: "check-repo-hygiene", dir: "console-logs" },
  { src: "check-commit-quality", host: "git-commit", dir: "commit-quality" },
  { src: "check-skill-usage", host: "update-devin-global-skills", dir: "skill-usage" },
  { src: "check-devin-knowledge", host: "update-devin-harness", dir: "devin-knowledge" },
  { src: "check-broken-skills-references", host: "review-devin-global-harness", dir: "broken-skills-references" },
  { src: "check-skills-related", host: "review-devin-global-harness", dir: "skills-related" },
];
const RENAMES: Record<string, string> = {
  "check-correctness": "check-content-correctness",
  "review-quality": "review-code-quality",
};
const FILE_MOVES: [string, string][] = [
  ["check-function-quality/scripts/check-function-quality.ts", "shared/scripts/check-function-quality.ts"],
  ["check-single-responsibility/scripts/check-single-responsibility.ts", "shared/scripts/check-single-responsibility.ts"],
  ["check-routes-status/scripts/check-routes-status.ps1", "shared/scripts/check-routes-status.ps1"],
  ["check-all-routes/subagents/route-checker.md", "review-delivery/subagents/route-checker.md"],
];
const HOST_HEAD: Record<string, string> = { "review-code-quality": "review-quality" };

const gitShow = (p: string) => execSync(`git show HEAD:${p}`, { cwd: ROOT, encoding: "utf8" });
const gitLs = (p: string) => execSync(`git ls-tree -r HEAD --name-only "${p}"`, { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);

function demote(body: string, levels: number): string {
  return body.replace(/^(#{1,5}) /gm, (_, h) => "#".repeat(Math.min(h.length + levels, 6)) + " ");
}
function stripFm(text: string): { fm: string; body: string } {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return m ? { fm: m[1], body: m[2].trim() } : { fm: "", body: text.trim() };
}
function fmRelated(fm: string): string[] {
  const m = fm.match(/^related:\r?\n((?:  - .+\r?\n?)*)/m);
  return m ? m[1].split(/\r?\n/).filter(Boolean).map((l) => l.replace(/^  - /, "").trim()) : [];
}
const removedNames = new Set([...Object.keys(INLINE), ...Object.keys(SKILL_MERGE), ...SUBSKILL.map((s) => s.src), "review-quality"]);

// ---------- 1. restore host SKILL.md from HEAD ----------
const hosts = [...new Set([...Object.values(INLINE), ...Object.values(SKILL_MERGE)].map((c) => c.host))];
for (const host of hosts) {
  const headPath = HOST_HEAD[host] ?? host;
  const content = gitShow(`${headPath}/SKILL.md`);
  const dest = join(ROOT, host, "SKILL.md");
  if (APPLY) {
    let t = content;
    if (host === "review-code-quality") {
      t = t.replace(/^name: .+$/m, "name: review-code-quality")
           .replace(/^description: .+$/m, "description: Review code quality, best practices, correctness, tech debt และ pre-refactor baseline targets");
    }
    writeFileSync(dest, t);
  }
  p(`restore ${host}/SKILL.md <- HEAD:${headPath}`);
}

// ---------- 2. merge sections ----------
function mergeRelated(hostPath: string, add: string[]) {
  let text = readFileSync(hostPath, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return;
  const fm = m[1];
  const rm = fm.match(/^(related:\r?\n)((?:  - .+\r?\n?)*)/m);
  let newFm: string;
  if (rm) {
    const cur = rm[2].split(/\r?\n/).filter(Boolean).map((l) => l.replace(/^  - /, "").trim());
    const dedup = [...new Set([...cur, ...add])].filter((r) => !removedNames.has(r) && r !== "review-code-quality");
    newFm = fm.replace(rm[0], rm[1] + dedup.map((r) => `  - ${r}\n`).join(""));
  } else {
    const add2 = add.filter((r) => !removedNames.has(r));
    if (!add2.length) return;
    newFm = fm + `\nrelated:\n` + add2.map((r) => `  - ${r}\n`).join("");
  }
  writeFileSync(hostPath, text.replace(fm, newFm));
}
function insertBeforeSection(hostPath: string, content: string) {
  const text = readFileSync(hostPath, "utf8");
  const anchors = ["\n## Rules", "\n## Fix", "\n## Expected Outcome"];
  for (const a of anchors) {
    const i = text.indexOf(a);
    if (i !== -1) {
      writeFileSync(hostPath, text.slice(0, i) + "\n" + content.trim() + "\n" + text.slice(i));
      return true;
    }
  }
  writeFileSync(hostPath, text.trimEnd() + "\n\n" + content.trim() + "\n");
  return false;
}
const dispatchRows: Record<string, string[]> = {};
function doMerge(src: string, host: string, title: string, wrap: boolean) {
  const hp = join(ROOT, host, "SKILL.md");
  let body = stripFm(gitShow(`${src}/SKILL.md`)).body;
  // subskills of the source, inlined deeper
  for (const f of gitLs(src)) {
    if (!f.includes("/subskills/") || !f.endsWith("/SKILL.md")) continue;
    const d = f.split("/subskills/")[1].split("/")[0];
    const t = d.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
    body += `\n\n#### ${t}\n\n` + demote(stripFm(gitShow(f)).body, 3);
  }
  const heading = wrap ? `## Check: ${title}` : `## ${title}`;
  const content = heading + "\n\n" + demote(body, 1);
  if (APPLY) {
    insertBeforeSection(hp, content);
    mergeRelated(hp, fmRelated(stripFm(gitShow(`${src}/SKILL.md`)).fm));
  }
  const scope = src === "review-refactor" ? "`refactor`, `baseline`" : `\`${src.replace(/^check-/, "")}\``;
  (dispatchRows[host] ??= []).push(`| ${scope} | \`${heading}\` |`);
  p(`merge ${src} -> ${host} (${heading})`);
}
for (const [src, c] of Object.entries(SKILL_MERGE)) doMerge(src, c.host, c.title, false);
for (const [src, c] of Object.entries(INLINE)) doMerge(src, c.host, c.title, true);
for (const [host, rows] of Object.entries(dispatchRows)) {
  const hp = join(ROOT, host, "SKILL.md");
  const table = `### Domain Checks\n\n> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg\n\n| Scope | Section |\n|-------|---------|\n${rows.join("\n")}\n`;
  if (APPLY) insertBeforeSection(hp, table);
  p(`dispatch -> ${host} (${rows.length} rows)`);
}

// ---------- 3. rewrite inside-host self refs to sections ----------
if (APPLY) {
  for (const host of hosts) {
    const fp = join(ROOT, host, "SKILL.md");
    let t = readFileSync(fp, "utf8");
    const orig = t;
    for (const [src, c] of Object.entries({ ...INLINE, ...SKILL_MERGE })) {
      if (c.host !== host) continue;
      const esc = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const sec = src === "review-refactor" ? `## ${c.title}` : `## Check: ${c.title}`;
      t = t.replace(new RegExp("`?/" + esc + "`?", "g"), `\`${sec}\``);
    }
    if (t !== orig) { writeFileSync(fp, t); p(`host section-refs: ${host}`); }
  }
}

// ---------- 4. global rewrite on restored host files + leftovers ----------
const refMap: Record<string, string> = {};
for (const [src, c] of Object.entries(INLINE)) refMap[src] = c.host;
for (const [src, c] of Object.entries(SKILL_MERGE)) refMap[src] = c.host;
for (const s of SUBSKILL) refMap[s.src] = s.host;
for (const [from, to] of Object.entries(RENAMES)) refMap[from] = to;
const MASK = "SHARED_SCRIPTS";
const pathMap: [RegExp, string][] = FILE_MOVES.map(([f, t]) => [
  new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), t,
]);
const allMd = new Set<string>();
for (const g of ["**/SKILL.md", "**/references/*.md", "**/templates/*.md", "**/subagents/*.md", "*.md"]) {
  for (const rel of new Glob(g).scanSync(ROOT)) allMd.add(rel.replace(/\\/g, "/"));
}
allMd.add("AGENTS.md");
let changed = 0;
for (const rel of allMd) {
  const fp = join(ROOT, rel);
  if (!existsSync(fp)) continue;
  let t = readFileSync(fp, "utf8");
  const orig = t;
  for (const [re, to] of pathMap) t = t.replace(re, to);
  t = t.replaceAll("shared/scripts/", MASK);
  for (const [old, nw] of Object.entries(refMap)) {
    const esc = old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    t = t.replace(new RegExp(`\\b${esc}/`, "g"), `${nw}/`);          // path refs
    t = t.replace(new RegExp(`\\b${esc}(?![a-z0-9-])`, "g"), nw);    // token refs
  }
  t = t.replaceAll(MASK, "shared/scripts/");
  if (t !== orig) { if (APPLY) writeFileSync(fp, t); changed++; }
}
p(`rewrite pass touched ${changed} files`);

// ---------- 5. dedupe related lists (normalized paths) ----------
if (APPLY) {
  for (const rel of new Glob("*/SKILL.md").scanSync(ROOT)) {
    const relN = rel.replace(/\\/g, "/");
    const fp = join(ROOT, rel);
    const t = readFileSync(fp, "utf8");
    const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    const fm = m[1];
    const rm = fm.match(/^(related:\r?\n)((?:  - .+\r?\n?)*)/m);
    if (!rm) continue;
    const items = rm[2].split(/\r?\n/).filter(Boolean).map((l) => l.replace(/^  - /, "").trim());
    const self = relN.replace(/\/SKILL\.md$/, "");
    const dedup = [...new Set(items)].filter((r) => r !== "" && r !== self && !removedNames.has(r) || (r === "check-content-correctness" ? true : !removedNames.has(r) && r !== self));
    const dedup2 = [...new Set(items)].filter((r) => r !== "" && r !== self && !removedNames.has(r));
    const nf = fm.replace(rm[0], rm[1] + dedup2.map((r) => `  - ${r}\n`).join(""));
    if (nf !== fm) writeFileSync(fp, t.replace(fm, nf));
  }
}
console.log(log.join("\n"));
