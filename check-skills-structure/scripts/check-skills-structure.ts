#!/usr/bin/env bun
// check-skills-structure — single command: table what every skill package contains
// usage: bun check-skills-structure.ts [root] [--skill <name>] [--json] [--findings]
import { readdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

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

const FM_KEYS = [
  "name",
  "description",
  "argument-hint",
  "allowed-tools",
  "related",
  "model",
  "triggers",
  "permissions",
  "subagent",
  "agent",
];

interface Row {
  skill: string;
  fm: string; // present frontmatter keys "n/10" or "-"
  nameOk: string;
  related: number | "-";
  relatedNames: string[];
  missingFm: string[];
  refs: number;
  wf: number;
  sub: number;
  bp: number;
  src: string;
  scripts: number;
  mcp: string;
  web: string;
  lines: number | "-";
  warn: string[];
  detail: Record<string, string[]>;
}

function dirList(dir: string, file?: string): string[] {
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir, { withFileTypes: true }).filter((e) =>
      file ? e.isFile() && e.name.endsWith(file) : true,
    ).map((e) => e.name);
  } catch {
    return [];
  }
}

function dirCount(dir: string, file?: string): number {
  return dirList(dir, file).length;
}

function nestedList(dir: string, file: string): string[] {
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir, { withFileTypes: true }).filter(
      (e) => e.isDirectory() && existsSync(join(dir, e.name, file)),
    ).map((e) => e.name);
  } catch {
    return [];
  }
}

function countNested(dir: string, file: string): number {
  return nestedList(dir, file).length;
}

function parseFm(text: string): { keys: string[]; name?: string; desc?: string; related: string[] } {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { keys: [], related: [] };
  const keys: string[] = [];
  let name: string | undefined;
  let desc: string | undefined;
  const related: string[] = [];
  let inRelated = false;
  for (const line of m[1].split(/\r?\n/)) {
    const km = line.match(/^([a-z-]+):\s*(.*)$/);
    if (km) {
      inRelated = false;
      if (FM_KEYS.includes(km[1]) && (km[2].trim() !== "" || km[1] === "related")) {
        keys.push(km[1]);
        if (km[1] === "name") name = km[2].trim().replace(/^["']|["']$/g, "");
        if (km[1] === "description") desc = km[2].trim().replace(/^["']|["']$/g, "");
        if (km[1] === "related") inRelated = true;
      }
    } else if (inRelated && /^\s+-\s+(\S+)/.test(line)) {
      related.push(line.trim().replace(/^-\s+/, ""));
    }
  }
  return { keys, name, desc, related };
}

function inspect(dir: string): Row {
  const skillMd = join(dir, "SKILL.md");
  const name = dir.split(/[\\/]/).pop()!;
  const r: Row = {
    skill: name,
    fm: "-",
    nameOk: "-",
    related: "-",
    relatedNames: [],
    missingFm: [],
    refs: 0,
    wf: 0,
    sub: 0,
    bp: 0,
    src: "-",
    scripts: 0,
    mcp: "-",
    web: "-",
    lines: "-",
    warn: [],
    detail: {},
  };
  if (!existsSync(skillMd)) {
    r.warn.push("no SKILL.md");
    return r;
  }
  const text = readFileSync(skillMd, "utf8");
  r.lines = text.replace(/\r?\n?$/, "").split("\n").length;
  const fm = parseFm(text);
  r.fm = `${fm.keys.length}/${FM_KEYS.length}`;
  r.related = fm.related.length;
  r.relatedNames = fm.related;
  r.missingFm = ["name", "description", "argument-hint", "related"].filter((k) => !fm.keys.includes(k));
  r.nameOk = fm.name === name ? "ok" : fm.name ? `!= ${fm.name}` : "missing";
  if (fm.name !== name) r.warn.push(fm.name ? `name!=dir (${fm.name})` : "no name");
  if (!fm.keys.includes("description")) r.warn.push("no description");
  else if (fm.desc && [...fm.desc].length > 100)
    r.warn.push(`desc ${[...fm.desc].length} >100 chars`);
  if (fm.keys.length === 0) r.warn.push("no frontmatter");
  if (r.lines > 250) r.warn.push(`${r.lines} lines >250`);

  // Body-level conventions (update-devin-global-skills): a `related` entry must be
  // mentioned in the body, `related` stays <=15, and no ** bold outside code.
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---/, "");
  const orphan = fm.related.filter((ref) => {
    const re = new RegExp(`(^|[^A-Za-z0-9-])${ref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-z0-9-]|$)`);
    return !re.test(body);
  });
  if (orphan.length) r.warn.push(`related not in body: ${orphan.join(", ")}`);
  if (fm.related.length > 15) r.warn.push(`related ${fm.related.length} >15`);

  let fence = false;
  let bold = 0;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const outside = line.split("`").filter((_, i) => i % 2 === 0).join("");
    if (/\*\*[^*]+\*\*/.test(outside)) bold++;
  }
  if (bold) r.warn.push(`${bold} line(s) with ** bold`);

  const refFiles = dirList(join(dir, "references"), ".md");
  const wfDirs = nestedList(join(dir, "workflows"), "SKILL.md");
  const subFiles = [...dirList(join(dir, "subagents"), ".md"), ...nestedList(join(dir, "subagents"), "AGENT.md").map((n) => `${n}/AGENT.md`)];
  const bpFiles = dirList(join(dir, "best-practices"), ".md");
  const scriptFiles = dirList(join(dir, "scripts"));
  r.refs = refFiles.length;
  r.wf = wfDirs.length;
  r.sub = subFiles.length;
  r.bp = bpFiles.length;
  r.src = existsSync(join(dir, "src")) ? "yes" : "-";
  r.scripts = scriptFiles.length;
  r.detail = {
    "related": r.relatedNames,
    "references": refFiles,
    "workflows": wfDirs,
    "subagents": subFiles,
    "best-practices": bpFiles,
    "scripts": scriptFiles,
    "frontmatter-missing": r.missingFm,
  };

  const lc = text.toLowerCase();
  const hasMcpRef = /\bmcp\b|mcp_config|mcp-server|mcpserver/.test(lc);
  const srcPkg = join(dir, "src", "package.json");
  const srcIsMcp =
    existsSync(srcPkg) && /mcp/i.test(readFileSync(srcPkg, "utf8"));
  r.mcp = hasMcpRef || srcIsMcp ? "yes" : "-";

  const hasWebRef = /website|viewer|vitepress|\bvite\b/.test(lc);
  const srcIsWeb =
    existsSync(srcPkg) && /vite|react|solid|vue|svelte|next/i.test(readFileSync(srcPkg, "utf8"));
  r.web = hasWebRef || srcIsWeb ? "yes" : "-";

  return r;
}

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

const rows = dirs.map((d) => inspect(join(root, d)));

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
