// migrate-checks.ts — merge check-* skills into domain owners
// usage: bun .devin/tmp/migrate-checks.ts [--apply]
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Glob } from "bun";
import { execSync } from "node:child_process";

const ROOT = "C:/Users/Veerapong/AppData/Roaming/devin/skills";
const APPLY = process.argv.includes("--apply");
const log: string[] = [];
const p = (s: string) => log.push(s);

// ---------- config ----------
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
const FILE_MOVES: { from: string; to: string }[] = [
  { from: "check-function-quality/scripts/check-function-quality.ts", to: "shared/scripts/check-function-quality.ts" },
  { from: "check-single-responsibility/scripts/check-single-responsibility.ts", to: "shared/scripts/check-single-responsibility.ts" },
  { from: "check-routes-status/scripts/check-routes-status.ps1", to: "shared/scripts/check-routes-status.ps1" },
  { from: "check-all-routes/subagents/route-checker.md", to: "review-delivery/subagents/route-checker.md" },
];

// ---------- helpers ----------
function demote(body: string, levels: number): string {
  return body.replace(/^(#{1,5}) /gm, (_, h) => "#".repeat(Math.min(h.length + levels, 6)) + " ");
}
function stripFm(text: string): { fm: string; body: string } {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { fm: m[1], body: m[2].trim() } : { fm: "", body: text.trim() };
}
function fmRelated(fm: string): string[] {
  const m = fm.match(/^related:\n((?:  - .+\n?)*)/m);
  return m ? m[1].split("\n").filter(Boolean).map((l) => l.replace(/^  - /, "").trim()) : [];
}
function mergeRelated(hostPath: string, add: string[], removedNames: Set<string>) {
  let text = readFileSync(hostPath, "utf8");
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return;
  const fm = m[1];
  const rm = fm.match(/^(related:\n)((?:  - .+\n?)*)/m);
  let newFm: string;
  if (rm) {
    const cur = rm[2].split("\n").filter(Boolean).map((l) => l.replace(/^  - /, "").trim());
    const dedup = [...new Set([...cur, ...add])].filter((r) => !removedNames.has(r));
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
function shortScope(name: string) {
  return name.replace(/^check-/, "");
}
function setFmName(path: string, name: string) {
  const text = readFileSync(path, "utf8");
  writeFileSync(path, text.replace(/^name: .+$/m, `name: ${name}`));
}
function mv(from: string, to: string) {
  if (APPLY) {
    mkdirSync(join(ROOT, to.split("/").slice(0, -1).join("/")), { recursive: true });
    execSync(`git mv "${from}" "${to}"`, { cwd: ROOT });
  }
  p(`mv ${from} -> ${to}`);
}
function rm(dir: string) {
  if (APPLY) rmSync(join(ROOT, dir), { recursive: true, force: true });
  p(`rm ${dir}/`);
}

// ---------- 1. renames ----------
for (const [from, to] of Object.entries(RENAMES)) {
  if (existsSync(join(ROOT, from))) {
    mv(from, to);
    if (APPLY) setFmName(join(ROOT, to, "SKILL.md"), to);
  }
}
if (APPLY) {
  const f = join(ROOT, "review-code-quality/SKILL.md");
  if (existsSync(f)) {
    let t = readFileSync(f, "utf8");
    t = t.replace(/^description: .+$/m, "description: Review code quality, best practices, correctness, tech debt และ pre-refactor baseline targets");
    writeFileSync(f, t);
  }
}

// ---------- 2. file relocations ----------
for (const m of FILE_MOVES) {
  if (existsSync(join(ROOT, m.from))) mv(m.from, m.to);
  else p(`skip (missing) ${m.from}`);
}

// ---------- 3. subskill / exec moves ----------
const removedNames = new Set<string>([...Object.keys(INLINE), ...Object.keys(SKILL_MERGE), ...SUBSKILL.map((s) => s.src)]);
for (const s of SUBSKILL) {
  const dst = `${s.host}/subskills/${s.dir}`;
  if (existsSync(join(ROOT, s.src))) {
    mv(s.src, dst);
    if (APPLY) setFmName(join(ROOT, dst, "SKILL.md"), `${s.host}-${s.dir}`);
  }
}

// ---------- 4. inline merges ----------
function collectSections(src: string, baseLevel: number): string {
  let out = "";
  const { body } = stripFm(readFileSync(join(ROOT, src, "SKILL.md"), "utf8"));
  out += demote(body, baseLevel);
  const sub = join(ROOT, src, "subskills");
  if (existsSync(sub)) {
    for (const d of readdirSync(sub)) {
      const sf = join(sub, d, "SKILL.md");
      if (!existsSync(sf)) continue;
      const { body: sb } = stripFm(readFileSync(sf, "utf8"));
      const title = d.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
      out += `\n\n${"#".repeat(baseLevel + 2)} ${title}\n\n` + demote(sb, baseLevel + 2);
    }
  }
  return out;
}
const dispatchRows: Record<string, string[]> = {};
function doMerge(src: string, host: string, title: string, secName: string) {
  const hp = join(ROOT, host, "SKILL.md");
  if (!existsSync(hp)) { p(`!! host missing ${host}`); return; }
  if (!existsSync(join(ROOT, src))) { p(`skip ${src}`); return; }
  const content = `## ${secName}: ${title}\n\n` + collectSections(src, 1);
  if (APPLY) {
    insertBeforeSection(hp, content);
    const { fm } = stripFm(readFileSync(join(ROOT, src, "SKILL.md"), "utf8"));
    mergeRelated(hp, fmRelated(fm), removedNames);
  }
  (dispatchRows[host] ??= []).push(`| \`${shortScope(src)}\` | \`## ${secName}: ${title}\` |`);
  p(`inline ${src} -> ${host} (## ${secName}: ${title})`);
  rm(src);
}
for (const [src, c] of Object.entries(SKILL_MERGE)) doMerge(src, c.host, c.title, "Section");
for (const [src, c] of Object.entries(INLINE)) doMerge(src, c.host, c.title, "Check");
for (const [host, rows] of Object.entries(dispatchRows)) {
  const hp = join(ROOT, host, "SKILL.md");
  const table = `### Domain Checks\n\n> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg\n\n| Scope | Section |\n|-------|---------|\n${rows.join("\n")}\n`;
  if (APPLY) insertBeforeSection(hp, table);
  p(`dispatch table -> ${host} (${rows.length} rows)`);
}

// ---------- 5. global ref rewrite ----------
const refMap: Record<string, string> = {};
for (const [src, c] of Object.entries(INLINE)) refMap[src] = c.host;
for (const [src, c] of Object.entries(SKILL_MERGE)) refMap[src] = c.host;
for (const s of SUBSKILL) refMap[s.src] = s.host;
for (const [from, to] of Object.entries(RENAMES)) refMap[from] = to;
const pathMap: [RegExp, string][] = FILE_MOVES.map((m) => [
  new RegExp(m.from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), m.to,
]);
const hostOf: Record<string, string> = {};
const titleOf: Record<string, string> = {};
const secOf: Record<string, string> = {};
for (const [src, c] of Object.entries({ ...INLINE, ...SKILL_MERGE })) { hostOf[src] = c.host; titleOf[src] = c.title; }
for (const [src] of Object.entries(SKILL_MERGE)) secOf[src] = "Section";
for (const [src] of Object.entries(INLINE)) secOf[src] = "Check";

const mdFiles = [...new Glob("**/SKILL.md").scanSync(ROOT), ...new Glob("*.md").scanSync(ROOT), ...new Glob("**/references/*.md").scanSync(ROOT), ...new Glob("**/templates/*.md").scanSync(ROOT), ...new Glob("**/subagents/*.md").scanSync(ROOT), "AGENTS.md"];
const hostSkillPaths = new Set(Object.values({ ...INLINE, ...SKILL_MERGE }).map((c) => `${c.host}/SKILL.md`));
let changed = 0;
for (const rel of mdFiles) {
  const fp = join(ROOT, rel);
  if (!existsSync(fp)) continue;
  let t = readFileSync(fp, "utf8");
  const orig = t;
  for (const [re, to] of pathMap) t = t.replace(re, to);
  for (const [old, nw] of Object.entries(refMap)) {
    if (hostSkillPaths.has(rel) && hostOf[old] === rel.split("/")[0]) {
      t = t.replace(new RegExp("`/" + old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`", "g"), `\`## ${secOf[old]}: ${titleOf[old]}\``);
    }
    const re = new RegExp(`\\b${old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z0-9-])`, "g");
    t = t.replace(re, nw);
  }
  if (t !== orig) {
    if (APPLY) writeFileSync(fp, t);
    changed++;
    p(`refs updated: ${rel}`);
  }
}
if (APPLY) {
  for (const rel of new Glob("**/SKILL.md").scanSync(ROOT)) {
    const fp = join(ROOT, rel);
    const t = readFileSync(fp, "utf8");
    const m = t.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = m[1];
    const rm = fm.match(/^(related:\n)((?:  - .+\n?)*)/m);
    if (!rm) continue;
    const items = rm[2].split("\n").filter(Boolean).map((l) => l.replace(/^  - /, "").trim());
    const self = rel.replace(/\/SKILL\.md$/, "");
    const dedup = [...new Set(items)].filter((r) => r !== "" && r !== self);
    const nf = fm.replace(rm[0], rm[1] + dedup.map((r) => `  - ${r}\n`).join(""));
    if (nf !== fm) writeFileSync(fp, t.replace(fm, nf));
  }
}
p(`\nfiles with ref updates: ${changed}`);
console.log(log.join("\n"));
