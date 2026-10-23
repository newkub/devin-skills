#!/usr/bin/env bun
// usage: bun scripts/verify-matrix.ts [--scope-maps <improve.md>,<optimize.md>]
// Proves the references/review.md invariants (see `## Dimension Matrix` → `### Matrix Notes`): exits 1 with one line per violation.
// Also proves the Impact/Cost/Fix-mode contract — a high-cost row never gates `pr`, and a codemod row is always backed by a mechanical detector.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SKILL = dirname(import.meta.dir);
const REVIEW_FILE = "references/review.md";
const source = readFileSync(join(SKILL, REVIEW_FILE), "utf8");

function section(text: string, file: string, title: string): string {
  // match only a real level-2 heading — inline mentions like `## Dimension Matrix` in prose must not win
  const start = text.indexOf(`\n## ${title}`);
  if (start < 0) throw new Error(`${file}: section "## ${title}" not found`);
  const next = text.indexOf("\n## ", start + 1);
  return text.slice(start + 1, next < 0 ? undefined : next);
}

const TIERS = ["always", "artifact-match", "on-demand"];
const GATES = ["pr", "release", "nightly", "on-demand"];
const EVIDENCE = ["cli", "capture", "manual"];
const ENFORCEMENT = ["cli-check", "ast-grep", "devin-rule", "test", "none"];
const IMPACTS = ["security", "data", "money", "compliance", "user", "perf", "ops", "dx"];
const COSTS = ["cheap", "medium", "high"];
const FIX_MODES = ["codemod", "test-first", "agent", "decision"];
const COLUMNS = 17;

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

const matrix = readTable(section(source, REVIEW_FILE, "Dimension Matrix"), "| Dimension |", COLUMNS, `${REVIEW_FILE}#dimension-matrix`);
const rows = matrix.map((c) => ({
  dim: c[0],
  tier: c[1],
  impact: c[3],
  cost: c[4],
  fixMode: c[5],
  evidence: c[6],
  severity: c[7],
  na: c[8],
  check: c[9],
  authority: c[10],
  cli: c[11],
  enforcement: c[12],
  gate: c[13],
  aliases: c[14],
  tools: c[15],
  fix: c[16],
}));
const names = rows.map((r) => r.dim);
const problems: string[] = [];
const notes: string[] = [];

// 1. unique dimension names
if (new Set(names).size !== names.length) problems.push("## Dimension Matrix: duplicate dimension name");

// 2. column vocabularies + slice/evidence/check consistency
const aliases: { alias: string; dim: string }[] = [];
for (const r of rows) {
  if (!TIERS.includes(r.tier)) problems.push(`${r.dim}: unknown Tier "${r.tier}"`);
  if (!GATES.includes(r.gate)) problems.push(`${r.dim}: unknown Gate "${r.gate}"`);
  if (!ENFORCEMENT.includes(r.enforcement)) problems.push(`${r.dim}: unknown Enforcement "${r.enforcement}"`);
  if (!COSTS.includes(r.cost)) problems.push(`${r.dim}: unknown Cost "${r.cost}"`);
  if (!FIX_MODES.includes(r.fixMode)) problems.push(`${r.dim}: unknown Fix mode "${r.fixMode}"`);
  for (const impact of r.impact.split("+").map((s) => s.trim())) if (!IMPACTS.includes(impact)) problems.push(`${r.dim}: unknown Impact "${impact}"`);
  if (r.cost === "high" && r.gate === "pr") problems.push(`${r.dim}: Cost "high" with Gate "pr" (a merge gate must be cheap or medium)`);
  if (r.fixMode === "codemod" && !["ast-grep", "cli-check"].includes(r.enforcement)) problems.push(`${r.dim}: Fix mode "codemod" needs Enforcement "ast-grep"/"cli-check"`);
  const evidence = r.evidence.split("+").map((s) => s.trim());
  for (const e of evidence) if (!EVIDENCE.includes(e)) problems.push(`${r.dim}: unknown Evidence "${e}"`);
  if (evidence.includes("cli") && r.cli === "—") problems.push(`${r.dim}: Evidence "cli" but CLI domain "—" (no slice can exist)`);
  if (r.enforcement === "cli-check" && r.cli === "—") problems.push(`${r.dim}: Enforcement "cli-check" but CLI domain "—"`);
  if (r.check.length < 20) problems.push(`${r.dim}: Check statement is missing or too short to dispatch`);
  if (!r.severity) problems.push(`${r.dim}: Default severity empty`);
  if (!r.na) problems.push(`${r.dim}: N/A condition empty`);
  if (!r.authority) problems.push(`${r.dim}: Authority empty`);
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
const STANDALONE = new Set(["review-test", "review-dot-agents-global-and-fix", "review-issues", "review-gaps", "usage"]);
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
const domainMap = section(source, REVIEW_FILE, "Domain Map");
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

// 5. preset map — every preset resolves to a skill dir, a dispatcher door, resolvable labels, and an owned fix route
const PRESETS_FILE = "references/presets.md";
const presetsSource = readFileSync(join(SKILL, PRESETS_FILE), "utf8");
const presetTable = readTable(section(presetsSource, PRESETS_FILE, "Preset Map"), "| Preset |", 4, `${PRESETS_FILE}#preset-map`);
const dispatcherPath = join(SKILL, "..", "deep-review", "SKILL.md");
const dispatcher = existsSync(dispatcherPath) ? readFileSync(dispatcherPath, "utf8") : "";
if (!dispatcher) problems.push(`deep-review dispatcher missing (${dispatcherPath})`);
const presetNames = presetTable.map((c) => c[0]);
if (new Set(presetNames).size !== presetNames.length) problems.push(`${PRESETS_FILE}: duplicate preset name`);
const ENGINE = "deep-review-codebase-everything";
if (!presetNames.includes(ENGINE)) problems.push(`${PRESETS_FILE}: engine row "${ENGINE}" missing`);
const presetResolvable = new Set([...names, ...aliases.map((a) => a.alias)]);
for (const c of presetTable) {
  const [preset, tier, seeded, fixRoute] = c;
  if (preset !== ENGINE && !preset.startsWith("review-")) {
    problems.push(`${preset}: a door must be named review-* (only the engine keeps the deep-review- prefix)`);
  }
  if (!["core", "on-demand"].includes(tier)) problems.push(`${preset}: unknown Tier "${tier}"`);
  const skillPath = preset === ENGINE ? join(SKILL, "SKILL.md") : join(SKILL, "..", preset, "SKILL.md");
  if (!existsSync(skillPath)) problems.push(`${preset}: SKILL.md not found`);
  if (dispatcher && !dispatcher.includes(preset)) problems.push(`${preset}: no door in deep-review/SKILL.md`);
  if (preset !== ENGINE && existsSync(skillPath)) {
    const door = readFileSync(skillPath, "utf8");
    const frontmatter = door.slice(0, door.indexOf("\n---", 4));
    const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = (frontmatter.match(/^description:\s*(.+)$/m)?.[1] ?? "").trim().replace(/^"|"$/g, "");
    if (name !== preset) problems.push(`${preset}: frontmatter name is "${name ?? "missing"}"`);
    if (description.length > 100) problems.push(`${preset}: description is ${description.length} characters (max 100)`);
    if (!frontmatter.includes("  - use-subagents")) problems.push(`${preset}: related must include use-subagents`);
    if (!door.includes("/use-subagents")) problems.push(`${preset}: body must state /use-subagents`);
    for (const heading of ["## Goal", "## Scope", "## Execute", "## Rules", "## Expected Outcome"]) {
      if (!door.includes(`\n${heading}`)) problems.push(`${preset}: missing ${heading}`);
    }
    if (door.split(/\r?\n/).length > 250) problems.push(`${preset}: SKILL.md exceeds 250 lines`);
  }
  if (seeded === "all") {
    if (preset !== ENGINE) problems.push(`${preset}: only the engine preset may seed "all"`);
  } else if (seeded !== "—") {
    const seeds = seeded.split(",").map((s) => s.trim()).filter(Boolean);
    if (seeds.length < 2) problems.push(`${preset}: seeds ${seeds.length} label(s) — a preset spans at least two rows`);
    for (const seed of seeds) if (!presetResolvable.has(seed)) problems.push(`${preset}: label "${seed}" resolves to no matrix row`);
  }
  const routes = [...fixRoute.matchAll(/(?<![\w/])\/([a-z][a-z0-9]*(?:-[a-z0-9]+)*)/g)].map((m) => m[1]);
  if (routes.length === 0 && seeded !== "all") problems.push(`${preset}: no fix route`);
  for (const route of routes) {
    if (route === "improve" || route === "optimize") continue;
    if (!existsSync(join(SKILL, "..", route, "SKILL.md"))) problems.push(`${preset}: fix route "/${route}" has no skill`);
  }
  for (const m of fixRoute.matchAll(/\/(?:improve|optimize)\s+([a-z0-9-]+)/g)) {
    if (scopePaths.length > 0 && !scopes.has(m[1])) problems.push(`${preset}: fix scope "${m[1]}" not in either scope-map`);
  }
}

notes.push(`${rows.length} dimensions, ${aliases.length} aliases, ${scopes.size} scopes, ${new Set(labels).size} labels, ${presetTable.length} presets`);
for (const note of notes) console.log(`note: ${note}`);
for (const problem of problems) console.log(`FAIL: ${problem}`);
console.log(problems.length === 0 ? "ok — matrix invariants hold" : `${problems.length} violation(s)`);
process.exit(problems.length === 0 ? 0 : 1);
