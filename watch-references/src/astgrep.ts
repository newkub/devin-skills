import { extname } from "node:path"

// Decision: drive the installed ast-grep binary instead of adding @ast-grep/napi.
// The CLI is already present on this machine, keeps the dependency surface small, and
// returns exact ranges per node kind, which is all the indexer needs.

export type NodeHit = {
  text: string
  startLine: number
  startColumn: number
  endLine: number
  endColumn: number
  file: string
  kind: string
}

export type KindSpec = {
  kind: string
  category: "variable" | "function" | "class" | "type" | "import" | "comment"
}

const TS_KINDS: KindSpec[] = [
  { kind: "function_declaration", category: "function" },
  { kind: "method_definition", category: "function" },
  { kind: "arrow_function", category: "function" },
  { kind: "class_declaration", category: "class" },
  { kind: "interface_declaration", category: "type" },
  { kind: "type_alias_declaration", category: "type" },
  { kind: "enum_declaration", category: "type" },
  { kind: "lexical_declaration", category: "variable" },
  { kind: "import_statement", category: "import" },
  { kind: "comment", category: "comment" },
]

const PY_KINDS: KindSpec[] = [
  { kind: "function_definition", category: "function" },
  { kind: "class_definition", category: "class" },
  { kind: "assignment", category: "variable" },
  { kind: "import_statement", category: "import" },
  { kind: "import_from_statement", category: "import" },
  { kind: "comment", category: "comment" },
]

const RS_KINDS: KindSpec[] = [
  { kind: "function_item", category: "function" },
  { kind: "struct_item", category: "class" },
  { kind: "enum_item", category: "type" },
  { kind: "trait_item", category: "type" },
  { kind: "impl_item", category: "class" },
  { kind: "const_item", category: "variable" },
  { kind: "static_item", category: "variable" },
  { kind: "use_declaration", category: "import" },
  { kind: "line_comment", category: "comment" },
]

const GO_KINDS: KindSpec[] = [
  { kind: "function_declaration", category: "function" },
  { kind: "method_declaration", category: "function" },
  { kind: "type_declaration", category: "type" },
  { kind: "var_declaration", category: "variable" },
  { kind: "const_declaration", category: "variable" },
  { kind: "import_declaration", category: "import" },
  { kind: "comment", category: "comment" },
]

const GENERIC_KINDS: KindSpec[] = [
  { kind: "function_declaration", category: "function" },
  { kind: "class_declaration", category: "class" },
  { kind: "comment", category: "comment" },
]

export const LANG_BY_EXT: Record<string, { lang: string; kinds: KindSpec[]; label: string }> = {
  ".ts": { lang: "typescript", kinds: TS_KINDS, label: "typescript" },
  ".mts": { lang: "typescript", kinds: TS_KINDS, label: "typescript" },
  ".cts": { lang: "typescript", kinds: TS_KINDS, label: "typescript" },
  ".tsx": { lang: "tsx", kinds: TS_KINDS, label: "tsx" },
  ".js": { lang: "javascript", kinds: TS_KINDS, label: "javascript" },
  ".mjs": { lang: "javascript", kinds: TS_KINDS, label: "javascript" },
  ".cjs": { lang: "javascript", kinds: TS_KINDS, label: "javascript" },
  ".jsx": { lang: "jsx", kinds: TS_KINDS, label: "jsx" },
  ".py": { lang: "python", kinds: PY_KINDS, label: "python" },
  ".rs": { lang: "rust", kinds: RS_KINDS, label: "rust" },
  ".go": { lang: "go", kinds: GO_KINDS, label: "go" },
  ".java": { lang: "java", kinds: GENERIC_KINDS, label: "java" },
  ".kt": { lang: "kotlin", kinds: GENERIC_KINDS, label: "kotlin" },
  ".rb": { lang: "ruby", kinds: GENERIC_KINDS, label: "ruby" },
  ".php": { lang: "php", kinds: GENERIC_KINDS, label: "php" },
  ".cs": { lang: "csharp", kinds: GENERIC_KINDS, label: "csharp" },
  ".swift": { lang: "swift", kinds: GENERIC_KINDS, label: "swift" },
  ".c": { lang: "c", kinds: GENERIC_KINDS, label: "c" },
  ".h": { lang: "c", kinds: GENERIC_KINDS, label: "c" },
  ".cpp": { lang: "cpp", kinds: GENERIC_KINDS, label: "cpp" },
  ".cc": { lang: "cpp", kinds: GENERIC_KINDS, label: "cpp" },
  ".lua": { lang: "lua", kinds: GENERIC_KINDS, label: "lua" },
  ".zig": { lang: "zig", kinds: GENERIC_KINDS, label: "zig" },
}

export const CODE_EXTENSIONS = Object.keys(LANG_BY_EXT)
export const CONFIG_EXTENSIONS = [".json", ".jsonc", ".yaml", ".yml", ".toml", ".ini", ".env"]

export function langFor(file: string) {
  return LANG_BY_EXT[extname(file).toLowerCase()] ?? null
}

export class AstGrepNotFound extends Error {}

type ExecResult = { stdout: string; stderr: string; code: number }

async function exec(bin: string, args: string[], cwd: string): Promise<ExecResult> {
  const proc = Bun.spawn([bin, ...args], { cwd, stdout: "pipe", stderr: "pipe" })
  const [stdout, stderr, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])
  return { stdout, stderr, code }
}

let cachedBin: string | null | undefined

export async function astgrepBinary(cwd: string): Promise<string> {
  if (cachedBin !== undefined) {
    if (cachedBin === null) throw new AstGrepNotFound("ast-grep binary not found (tried ast-grep, sg)")
    return cachedBin
  }
  for (const candidate of ["ast-grep", "sg"]) {
    const res = await exec(candidate, ["--version"], cwd)
    if (res.code === 0) {
      cachedBin = candidate
      return candidate
    }
  }
  cachedBin = null
  throw new AstGrepNotFound("ast-grep binary not found (tried ast-grep, sg)")
}

export async function astgrepVersion(cwd: string): Promise<string> {
  const bin = await astgrepBinary(cwd)
  const res = await exec(bin, ["--version"], cwd)
  return res.stdout.trim()
}

let cachedNoIgnore: string[] | undefined

// ast-grep 0.51 turned `--no-ignore` into a repeatable, valued flag; older builds take it bare.
async function noIgnoreArgs(cwd: string): Promise<string[]> {
  if (cachedNoIgnore) return cachedNoIgnore
  const m = (await astgrepVersion(cwd)).match(/(\d+)\.(\d+)/)
  const valued = m ? Number(m[1]) > 0 || Number(m[2]) >= 51 : true
  cachedNoIgnore = valued
    ? ["--no-ignore", "hidden", "--no-ignore", "dot", "--no-ignore", "exclude", "--no-ignore", "vcs"]
    : ["--no-ignore"]
  return cachedNoIgnore
}

/**
 * Run one kind filter over a batch of files. Parse failures are reported through
 * `diagnostics` instead of aborting the batch: a single unparsable file must not
 * hide the rest of the project.
 */
export async function scanKind(
  cwd: string,
  files: string[],
  lang: string,
  kind: string,
): Promise<{ hits: NodeHit[]; diagnostics: { file: string; message: string }[] }> {
  if (files.length === 0) return { hits: [], diagnostics: [] }
  const bin = await astgrepBinary(cwd)
  const res = await exec(
    bin,
    ["run", "--kind", kind, "--lang", lang, "--json", ...(await noIgnoreArgs(cwd)), "--color", "never", ...files],
    cwd,
  )
  const diagnostics: { file: string; message: string }[] = []
  if (res.code !== 0) {
    // ast-grep exits 1 on "no matches" in some versions; only treat stderr text as a diagnostic.
    const text = res.stderr.trim()
    if (text && !/no (matches|files)/i.test(text)) {
      diagnostics.push({ file: files[0], message: text.split("\n").slice(-8).join("\n") })
    }
    return { hits: [], diagnostics }
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(res.stdout || "[]")
  } catch {
    return {
      hits: [],
      diagnostics: [{ file: files[0], message: `unparsable ast-grep output for kind ${kind}` }],
    }
  }
  const hits: NodeHit[] = []
  for (const item of Array.isArray(parsed) ? parsed : []) {
    const rec = item as Record<string, any>
    const range = rec.range ?? {}
    const start = range.start ?? {}
    const end = range.end ?? {}
    if (typeof rec.file !== "string" || typeof rec.text !== "string") continue
    hits.push({
      file: rec.file,
      kind,
      text: rec.text,
      startLine: Number(start.line ?? 0) + 1,
      startColumn: Number(start.column ?? 0),
      endLine: Number(end.line ?? 0) + 1,
      endColumn: Number(end.column ?? 0),
    })
  }
  return { hits, diagnostics }
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}
