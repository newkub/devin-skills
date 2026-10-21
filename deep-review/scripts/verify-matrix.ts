// usage: bun scripts/verify-matrix.ts [--scope-maps <improve.md>,<optimize.md>]
// Proves the references/review.md + references/checks.md invariants (see `## Dimension Matrix` → `### Matrix Notes`): exits 1 with one line per violation.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SKILL = dirname(import.meta.dir);
const MATRIX_FILE = "references/review.md";
const CHECKS_FILE = "references/checks.md";
const matrixSource = readFileSync(join(SKILL, MATRIX_FILE), "utf8");
const checksSource = readFileSync(join(SKILL, CHECKS_FILE), "utf8");

function section(text: string, file: string, title: string): string {
  // match only a real level-2 heading — inline mentions like `## Dimension Checks` in prose must not win
  const start = text.indexOf(`\n## ${title}`);
  if (start < 0) throw new Error(`${file}: section "## ${title}" not found`);
  const next = text.indexOf("\n## ", start + 1);
  return text.slice(start + 1, next < 0 ? undefined : next);
}

const TIERS = ["always", "artifact-match", "on-demand"];
const GATES = ["pr", "release", "nightly", "on-demand"];
const EVIDENCE = ["cli", "capture", "manual"];
const ENFORCEMENT = ["cli-check", "ast-grep", "devin-rule", "test", "none"];
const COLUMNS = 13;

const strip = (s: string) => s.replace(/`/g, "").trim();

function readTable(text: string, header: string, columns: number, where: string): string[][] {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith(header));
  if (start < 0) throw new Error(`${where}: header "${header}" not found`);
  const rows: string[][] = [];
  for (const line of lines.slice(start + 1)) {
    if (!line.startsWith("|")) break;
    const cells = line.split("|").slice(1, -1).map(strip);
    if (cells.every((c) => /^-+$/.test(c))) continue;
    if (cells.length !== columns) throw new Error(`${where}: row with ${cells.length} cells (want ${columns}): ${cells[0]}`);
    rows.push(cells);
  }
  return rows;
}

function scopeMapPaths(): string[] {
  const arg = process.argv.indexOf("--scope-maps");
  const explicit = arg >= 0 ? process.argv[arg + 1] : process.env.DEEP_REVIEW_SCOPE_MAPS;
  if (explicit) return explicit.split(",").map((p) => p.trim());
  return [
    join(SKILL, "../improve/references/scope-map.md"),
    join(SKILL, "../optimize/references/scope-map.md"),
  ];
}

const matrix = readTable(section(matrixSource, MATRIX_FILE, "Dimension Matrix"), "| Dimension |", COLUMNS, `${MATRIX_FILE}#dimension-matrix`);
const checks = readTable(section(checksSource, CHECKS_FILE, "Dimension Checks"), "| Dimension |", 2, `${CHECKS_FILE}#dimension-checks`);
const rows = matrix.map((c) => ({
  dim: c[0],
  tier: c[1],
  evidence: c[3],
  cli: c[7],
  enforcement: c[8],
  gate: c[9],
  aliases: c[10],
  fix: c[12],
}));
const names = rows.map((r) => r.dim);
const problems: string[] = [];
const notes: string[] = [];

// 1. row parity + order
const checkNames = checks.map((c) => c[0]);
for (const n of names) if (!checkNames.includes(n)) problems.push(`## Dimension Checks: missing row for "${n}"`);
for (const n of checkNames) if (!names.includes(n)) problems.push(`## Dimension Matrix: missing row for "${n}"`);
const common = names.filter((n) => checkNames.includes(n));
if (common.join() !== checkNames.filter((n) => names.includes(n)).join()) problems.push("row order differs between ## Dimension Matrix and ## Dimension Checks");
if (new Set(names).size !== names.length) problems.push("## Dimension Matrix: duplicate dimension name");
if (new Set(checkNames).size !== checkNames.length) problems.push("## Dimension Checks: duplicate dimension name");

// 2. column vocabularies + slice consistency
const aliases: { alias: string; dim: string }[] = [];
for (const r of rows) {
  if (!TIERS.includes(r.tier)) problems.push(`${r.dim}: unknown Tier "${r.tier}"`);
  if (!GATES.includes(r.gate)) problems.push(`${r.dim}: unknown Gate "${r.gate}"`);
  if (!ENFORCEMENT.includes(r.enforcement)) problems.push(`${r.dim}: unknown Enforcement "${r.enforcement}"`);
  const evidence = r.evidence.split("+").map((s) => s.trim());
  for (const e of evidence) if (!EVIDENCE.includes(e)) problems.push(`${r.dim}: unknown Evidence "${e}"`);
  if (evidence.includes("cli") && r.cli === "—") problems.push(`${r.dim}: Evidence "cli" but CLI domain "—" (no slice can exist)`);
  if (r.enforcement === "cli-check" && r.cli === "—") problems.push(`${r.dim}: Enforcement "cli-check" but CLI domain "—"`);
  if (!r.aliases || r.aliases === "—") continue;
  for (const alias of r.aliases.split(",").map((s) => s.trim())) {
    aliases.push({ alias, dim: r.dim });
    if (alias === r.dim) problems.push(`${r.dim}: alias equals its own row name`);
    if (names.includes(alias) && alias !== r.dim) problems.push(`${r.dim}: alias "${alias}" is another row's name`);
  }
}

// 3. Fix owner reachable from a scope-map or a domain-map route
const scopePaths = scopeMapPaths().filter((p) => existsSync(p));
if (scopePaths.length === 0) notes.push("scope-maps not found — pass --scope-maps to check Fix owner reachability");
// names answered by their own top-level skill or a scope-map row, not by a per-label file
const STANDALONE = new Set(["review-test", "review-devin-global-harness", "review-issues", "review-gaps", "usage"]);
const scopes = new Set<string>();
const labels: string[] = [];
for (const path of scopePaths) {
  const md = readFileSync(path, "utf8");
  const optimize = path.includes("optimize");
  const scopeIdx = optimize ? 1 : 0;
  const labelIdx = optimize ? 2 : 1;
  for (const line of md.split(/\r?\n/)) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map(strip);
    if (/^-+$/.test(cells[0]) || cells[0].startsWith("Scope") || cells[0].startsWith("Signal")) continue;
    if (cells[scopeIdx]) scopes.add(cells[scopeIdx]);
    for (const piece of (cells[labelIdx] ?? "").split(/[,+]/)) {
      const token = piece.trim().split(/\s+/)[0] ?? "";
      if (!/^[a-z0-9][a-z0-9-]*$/.test(token) || STANDALONE.has(token)) continue;
      labels.push(token.replace(/^review-/, ""));
    }
  }
}
const domainMap = section(checksSource, CHECKS_FILE, "Domain Map");
const domainRoutes = new Set([...domainMap.matchAll(/(?<![\w/])\/([a-z][a-z0-9]*(?:-[a-z0-9]+)+)/g)].map((m) => m[1]));
for (const r of rows) {
  for (const owner of [...r.fix.matchAll(/`([^`]+)`/g)].map((m) => m[1])) {
    const route = owner.match(/^\/(improve|optimize)\s+(\S+)$/);
    if (route) {
      if (scopePaths.length > 0 && !scopes.has(route[2])) problems.push(`${r.dim}: Fix owner "${owner}" — scope "${route[2]}" not in either scope-map`);
    } else if (!domainRoutes.has(route?.[2] ?? owner.slice(1))) {
      problems.push(`${r.dim}: Fix owner "${owner}" is neither an improve/optimize scope nor a domain-map route`);
    }
  }
}

// 4. label resolution — every scope-map label must equal a row name or an Aliases entry (only when the scope-maps are readable)
if (scopePaths.length > 0) {
  const resolvable = new Set([...names, ...aliases.map((a) => a.alias)]);
  for (const label of [...new Set(labels)]) {
    if (!resolvable.has(label)) problems.push(`review-${label} resolves to no matrix row (matrix gap)`);
  }
}

notes.push(`${rows.length} dimensions, ${aliases.length} aliases, ${scopes.size} scopes, ${new Set(labels).size} labels`);
for (const note of notes) console.log(`note: ${note}`);
for (const problem of problems) console.log(`FAIL: ${problem}`);
console.log(problems.length === 0 ? "ok — matrix invariants hold" : `${problems.length} violation(s)`);
process.exit(problems.length === 0 ? 0 : 1);
