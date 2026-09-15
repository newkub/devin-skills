#!/usr/bin/env bun
// check-function-quality.ts — ast-grep powered function quality metrics
// Usage: bun check-function-quality.ts <paths...> [--json] [--max-lines N] [--max-params N]
//        [--max-returns N] [--max-depth N] [--max-complexity N]

type Pos = { line: number; column: number };
type SgMatch = {
  file: string;
  range: { start: Pos; end: Pos };
  text?: string;
  ruleId?: string;
};

const DEFAULTS = { lines: 40, params: 4, returns: 3, depth: 4, complexity: 10 };
const args = Bun.argv.slice(2);
const jsonOut = args.includes("--json");
const num = (flag: string, dflt: number) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : dflt;
};
const limits = {
  lines: num("--max-lines", DEFAULTS.lines),
  params: num("--max-params", DEFAULTS.params),
  returns: num("--max-returns", DEFAULTS.returns),
  depth: num("--max-depth", DEFAULTS.depth),
  complexity: num("--max-complexity", DEFAULTS.complexity),
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

// kind-based collection catches annotated signatures (`function f(): T {}`) that
// simple `function $N($$$P) { $$$ }` patterns miss
async function runKinds(sg: string[], kinds: string[]): Promise<SgMatch[]> {
  const langs = ["TypeScript", "Tsx", "JavaScript"];
  const docs = kinds
    .flatMap((kind) =>
      kind === "lexical_declaration"
        ? langs.map(
            (l) =>
              `id: fq-arrow\nlanguage: ${l}\nseverity: info\nrule:\n  kind: ${kind}\n  has:\n    kind: arrow_function\n    stopBy: end`,
          )
        : langs.map((l) => `id: fq-${kind}\nlanguage: ${l}\nseverity: info\nrule:\n  kind: ${kind}`),
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

function fnName(text: string): string {
  const decl = text.match(/\b(?:function\*?|const|let|var)\s+([A-Za-z_$][\w$]*)/);
  if (decl) return decl[1];
  const paren = text.indexOf("(");
  const before = paren >= 0 ? text.slice(0, paren) : text;
  const tail = before.match(/([A-Za-z_#$][\w$]*)\s*$/);
  return tail?.[1] ?? "<anonymous>";
}

function countParams(text: string): number {
  const open = text.indexOf("(");
  if (open < 0) return 0;
  let depth = 0;
  let end = -1;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const inner = text.slice(open + 1, end > 0 ? end : text.length).trim();
  if (!inner) return 0;
  let d = 0;
  let n = 1;
  for (const ch of inner) {
    if ("({[".includes(ch)) d++;
    else if (")}]".includes(ch)) d--;
    else if (ch === "," && d === 0) n++;
  }
  return n;
}

function maxDepth(text: string): number {
  let d = 0;
  let max = 0;
  for (const ch of text) {
    if (ch === "{") {
      d++;
      if (d > max) max = d;
    } else if (ch === "}") d--;
  }
  return Math.max(0, max - 1); // exclude the function body itself
}

function stripNoise(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\/(?![/*])[^/\n\\]*(?:\\.[^/\n\\]*)*\/[gimsuy]*/g, "RE");
}

function metrics(text: string) {
  const clean = stripNoise(text);
  return {
    params: countParams(text),
    returns: (clean.match(/\breturn\b/g) ?? []).length,
    depth: maxDepth(clean),
    complexity: (clean.match(/\b(if|for|while|case|catch|else\s+if)\b|&&|\|\||\?/g) ?? []).length,
  };
}

function severity(v: { lines: number } & ReturnType<typeof metrics>): string {
  if (v.lines > 150 || v.depth > 6) return "critical";
  if (v.lines > limits.lines * 2 || v.params > limits.params + 2 || v.returns > limits.returns * 2 || v.complexity > limits.complexity + 5) return "high";
  if (v.lines > limits.lines || v.params > limits.params || v.returns > limits.returns || v.depth > limits.depth || v.complexity > limits.complexity) return "medium";
  return "ok";
}

const sg = await resolveSg();
const matches = await runKinds(sg, [
  "function_declaration",
  "generator_function_declaration",
  "method_definition",
  "lexical_declaration", // filtered to arrow_function via `has` in the rule
]);
const seen = new Set<string>();
const findings = [];
let scanned = 0;
for (const m of matches) {
  const key = `${m.file}:${m.range.start.line}:${m.range.start.column}`;
  if (seen.has(key)) continue;
  seen.add(key);
  scanned++;
  const text = await matchText(m);
  const v = { lines: m.range.end.line - m.range.start.line + 1, ...metrics(text) };
  const sev = severity(v);
  if (sev === "ok") continue;
  findings.push({ file: m.file, line: m.range.start.line + 1, name: fnName(text), ...v, severity: sev });
}
const order = { critical: 0, high: 1, medium: 2 };
findings.sort((a, b) => order[a.severity as keyof typeof order] - order[b.severity as keyof typeof order] || b.lines - a.lines);

if (jsonOut) {
  console.log(JSON.stringify({ paths, limits, scanned, findings }, null, 2));
  process.exit(findings.length ? 1 : 0);
}
if (findings.length === 0) {
  console.log(`no findings — ${scanned} functions scanned in ${paths.join(" ")}`);
  process.exit(0);
}
console.log(`file:line  function  lines params returns depth cplx  severity`);
for (const f of findings) {
  console.log(`${f.file}:${f.line}  ${f.name}  ${f.lines} ${f.params} ${f.returns} ${f.depth} ${f.complexity}  ${f.severity}`);
}
process.exit(1);
