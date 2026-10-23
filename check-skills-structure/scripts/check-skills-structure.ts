#!/usr/bin/env bun
// check-skills-structure — single command: table what every skill package contains
// usage: bun check-skills-structure.ts [root] [--skill <name>] [--json] [--findings] [--detail] [--anchors] [--tables]
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { inspect } from "./lib/scan";
import type { Row } from "./lib/scan";
import { anchorChecker } from "./lib/citations";

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(n);
const flagVal = (n: string) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
const VALUE_FLAGS = new Set(["--root", "--skill"]);
const positional = args.filter(
  (a, i) => !a.startsWith("--") && !VALUE_FLAGS.has(args[i - 1] ?? ""),
);
const root =
  flagVal("--root") ??
  positional[0] ??
  join(process.env.APPDATA ?? process.env.HOME ?? ".", "devin", "skills");
const only = flagVal("--skill");
const asJson = flag("--json");
const findingsOnly = flag("--findings");
const showDetail = flag("--detail") || !!only;
const wantAnchors = flag("--anchors");
const wantTables = flag("--tables");

// `reports/` is gitignored review output (see .gitignore) — never a skill package
const NON_SKILL_DIRS = new Set(["scripts", "templates", "references", "guide", "examples", "reports"]);
// a submodule checkout has a `.git` FILE (not a dir) — it ships its own package, not a skill
const isSubmodule = (name: string) => {
  const g = join(root, name, ".git");
  return existsSync(g) && statSync(g).isFile();
};

const dirs = readdirSync(root, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith("."))
  .map((e) => e.name)
  .filter((n) => !only || n === only)
  .filter((n) => only || (!NON_SKILL_DIRS.has(n) && !isSubmodule(n)))
  .sort();

const gates = { anchors: wantAnchors ? anchorChecker(root) : undefined, tables: wantTables };
const rows = dirs.map((d) => inspect(join(root, d), gates));

if (asJson) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const cols: [keyof Row, string][] = [
  ["skill", "Skill"],
  ["fm", "Frontmatter"],
  ["nameOk", "Name"],
  ["related", "Related"],
  ["refs", "References"],
  ["wf", "Workflows"],
  ["sub", "Subagents"],
  ["bp", "BestPractices"],
  ["uc", "UseCases"],
  ["src", "Source"],
  ["scripts", "Scripts"],
  ["mcp", "MCP"],
  ["web", "Website"],
  ["lines", "Lines"],
];

if (!findingsOnly) {
  for (const r of rows) {
    const fields = cols
      .slice(1)
      .map(([k, h]) => `${h}: ${r[k]}`)
      .join(", ");
    console.log(`- ${r.skill} — ${fields}`);
  }
}

if (showDetail) {
  for (const r of rows) {
    const parts = Object.entries(r.detail)
      .filter(([, items]) => items.length)
      .map(([k, items]) => `  ${k}: ${items.join(", ")}`);
    if (parts.length) console.log(`\n${r.skill}\n${parts.join("\n")}`);
  }
}

const warned = rows.filter((r) => r.warn.length);
console.log(`\n${rows.length} skill(s) scanned — ${warned.length} with findings`);
for (const r of warned) console.log(`  [WARN] ${r.skill}: ${r.warn.join(", ")}`);
if (only && rows.length === 0) {
  console.log(`skill '${only}' not found under ${root}`);
  process.exit(1);
}
