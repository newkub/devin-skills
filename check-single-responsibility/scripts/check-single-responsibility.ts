#!/usr/bin/env bun
// check-single-responsibility.ts — ast-grep powered SRP metrics per file/class
// Usage: bun check-single-responsibility.ts <paths...> [--json]
//        [--max-symbols N] [--max-members N] [--max-exports N]

type Pos = { line: number; column: number };
type Range = { start: Pos; end: Pos };
type SgMatch = { file: string; range: Range; text?: string; ruleId?: string };

const args = Bun.argv.slice(2);
const jsonOut = args.includes("--json");
const num = (flag: string, dflt: number) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : dflt;
};
const limits = {
  symbols: num("--max-symbols", 5),
  members: num("--max-members", 10),
  exports: num("--max-exports", 8),
};
const paths = args.filter((a, i) => !a.startsWith("--") && args[i - 1]?.startsWith("--") !== true);
if (paths.length === 0) paths.push("src");

async function resolveSg(): Promise<string[]> {
  for (const cmd of [["ast-grep"], ["sg"], ["bunx", "-p", "@ast-grep/cli", "ast-grep"]]) {
    const r = await Bun.$`${cmd} --version`.quiet().nothrow();
    if (r.exitCode === 0) return cmd;
  }
  console.error("ast-grep not found — install with `bun add -D @ast-grep/cli`");
  process.exit(2);
}

// kind-based collection catches annotated forms (`class C implements I`, `const x: T = v`)
// JS grammar lacks TS-only kinds — map/skip per language or the whole scan errors out
const JS_KIND: Record<string, string | null> = {
  interface_declaration: null,
  type_alias_declaration: null,
  enum_declaration: null,
  public_field_definition: "field_definition",
};
async function runKinds(sg: string[], kinds: string[]): Promise<SgMatch[]> {
  const docs = ["TypeScript", "Tsx", "JavaScript"]
    .flatMap((l) =>
      kinds
        .map((k) => (l === "JavaScript" && k in JS_KIND ? JS_KIND[k] : k))
        .filter((k): k is string => k !== null)
        .map((k) => `id: srp-${k}\nlanguage: ${l}\nseverity: info\nrule:\n  kind: ${k}`),
    )
    .join("\n---\n");
  const r = await Bun.$`${sg} scan --inline-rules ${docs} --json ${paths}`.quiet().nothrow();
  if (r.exitCode !== 0) return [];
  try {
    return JSON.parse(r.stdout.toString() || "[]") as SgMatch[];
  } catch {
    return [];
  }
}

const textCache = new Map<string, string[]>();
async function fileLines(file: string): Promise<string[]> {
  if (!textCache.has(file)) textCache.set(file, (await Bun.file(file).text()).split("\n"));
  return textCache.get(file)!;
}

async function matchText(m: SgMatch): Promise<string> {
  if (m.text) return m.text;
  const lines = await fileLines(m.file);
  return lines.slice(m.range.start.line, m.range.end.line + 1).join("\n");
}

async function declName(m: SgMatch): Promise<string> {
  const text = await matchText(m);
  const mm = text.match(/\b(?:function\*?|class|interface|type|enum|const|let|var)\s+([A-Za-z_$][\w$]*)/);
  return mm?.[1] ?? "<destructured>";
}

const inside = (inner: Range, outer: Range) =>
  inner.start.line >= outer.start.line && inner.end.line <= outer.end.line;

const sg = await resolveSg();

const declKinds = [
  "function_declaration",
  "generator_function_declaration",
  "class_declaration",
  "interface_declaration",
  "type_alias_declaration",
  "enum_declaration",
  "lexical_declaration",
];
const [declMatches, memberMatches, exportMatches] = await Promise.all([
  runKinds(sg, declKinds),
  runKinds(sg, ["method_definition", "public_field_definition"]),
  runKinds(sg, ["export_statement"]),
]);

type Decl = { file: string; range: Range; kind: string; name: string };
const decls: Decl[] = [];
const seen = new Set<string>();
for (const m of declMatches) {
  const key = `${m.file}:${m.range.start.line}:${m.range.start.column}`;
  if (seen.has(key)) continue;
  seen.add(key);
  decls.push({ file: m.file, range: m.range, kind: m.ruleId?.replace(/^srp-/, "") ?? "decl", name: await declName(m) });
}

const containers = decls.filter((d) => d.kind === "class_declaration" || d.kind === "function_declaration" || d.kind === "generator_function_declaration" || d.kind === "lexical_declaration");
const classes = decls.filter((d) => d.kind === "class_declaration");

const files = new Map<string, { symbols: Decl[]; exports: number }>();
for (const d of decls) {
  // top-level approximation: not inside any class/function declaration
  const nested = containers.some((o) => o !== d && o.file === d.file && inside(d.range, o.range));
  if (nested) continue;
  const f = files.get(d.file) ?? { symbols: [], exports: 0 };
  f.symbols.push(d);
  files.set(d.file, f);
}
for (const m of exportMatches) {
  const f = files.get(m.file) ?? { symbols: [], exports: 0 };
  f.exports++;
  files.set(m.file, f);
}

type Finding = { file: string; symbols?: number; names?: string[]; exports?: number; class?: string; members?: number; severity: string; issue: string };
const findings: Finding[] = [];

for (const [file, f] of files) {
  const n = f.symbols.length;
  const names = f.symbols.map((s) => s.name);
  if (n > limits.symbols * 2) findings.push({ file, symbols: n, names, exports: f.exports, severity: "critical", issue: "many top-level symbols" });
  else if (n > limits.symbols) findings.push({ file, symbols: n, names, exports: f.exports, severity: "high", issue: "top-level symbols over threshold" });
  else if (n >= limits.symbols - 1 && n > 1) findings.push({ file, symbols: n, names, exports: f.exports, severity: "medium", issue: "multiple top-level symbols" });
  if (f.exports > limits.exports) findings.push({ file, exports: f.exports, severity: f.exports > limits.exports * 1.5 ? "high" : "medium", issue: "large public surface" });
}

for (const c of classes) {
  const count = memberMatches.filter((m) => m.file === c.file && inside(m.range, c.range)).length;
  if (count > limits.members * 2) findings.push({ file: c.file, class: c.name, members: count, severity: "critical", issue: "god class" });
  else if (count > limits.members) findings.push({ file: c.file, class: c.name, members: count, severity: "high", issue: "class members over threshold" });
  else if (count >= limits.members - 4) findings.push({ file: c.file, class: c.name, members: count, severity: "medium", issue: "class approaching member limit" });
}

const order = { critical: 0, high: 1, medium: 2 };
findings.sort((a, b) => order[a.severity as keyof typeof order] - order[b.severity as keyof typeof order]);

if (jsonOut) {
  console.log(JSON.stringify({ paths, limits, files: files.size, findings }, null, 2));
  process.exit(findings.length ? 1 : 0);
}
if (findings.length === 0) {
  console.log(`no SRP findings — ${decls.length} symbols in ${files.size} files (${paths.join(" ")})`);
  process.exit(0);
}
for (const f of findings) {
  const detail = f.class
    ? `class ${f.class}: ${f.members} members`
    : `${f.symbols ?? "-"} symbols (${(f.names ?? []).slice(0, 6).join(", ")}${(f.names?.length ?? 0) > 6 ? "…" : ""}), ${f.exports ?? 0} exports`;
  console.log(`${f.severity.toUpperCase()}  ${f.file}  ${f.issue} — ${detail}`);
}
process.exit(1);
