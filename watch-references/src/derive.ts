import { statSync } from "node:fs"
import { dirname, extname, join, resolve } from "node:path"
import { relPosix, toPosix } from "./config"
import { CODE_EXTENSIONS, CONFIG_EXTENSIONS } from "./astgrep"
import type { Reference } from "./types"
import { refId } from "./store"

// Derived references: categories that ast-grep node kinds cannot express directly.
// Kept separate from scan.ts so the extractor stays a pure function of (file, text, hits).

export const KIND_CATEGORY: Record<string, Reference["category"]> = {
  function_declaration: "function",
  method_definition: "function",
  arrow_function: "function",
  class_declaration: "class",
  interface_declaration: "type",
  type_alias_declaration: "type",
  enum_declaration: "type",
  lexical_declaration: "variable",
  import_statement: "import",
  comment: "comment",
}

const NAME_PATTERNS: [RegExp, string][] = [
  [/^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/, "function_declaration"],
  [/^\s*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+([A-Za-z_$][\w$]*)/, "class_declaration"],
  [/^\s*(?:export\s+)?(?:declare\s+)?interface\s+([A-Za-z_$][\w$]*)/, "interface_declaration"],
  [/^\s*(?:export\s+)?type\s+([A-Za-z_$][\w$]*)/, "type_alias_declaration"],
  [/^\s*(?:export\s+)?(?:const\s+)?enum\s+([A-Za-z_$][\w$]*)/, "enum_declaration"],
  [/^\s*(?:export\s+)?(?:declare\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)/, "lexical_declaration"],
  [/^\s*(?:pub\s+)?(?:async\s+)?fn\s+([A-Za-z_]\w*)/, "function_declaration"],
  [/^\s*(?:pub\s+)?struct\s+([A-Za-z_]\w*)/, "class_declaration"],
  [/^\s*(?:pub\s+)?trait\s+([A-Za-z_]\w*)/, "interface_declaration"],
  [/^\s*(?:pub\s+)?(?:enum|type)\s+([A-Za-z_]\w*)/, "type_alias_declaration"],
  [/^\s*func\s+(?:\([^)]*\)\s*)?([A-Za-z_]\w*)/, "function_declaration"],
  [/^\s*type\s+([A-Za-z_]\w*)\s+struct/, "class_declaration"],
  [/^\s*(?:def|async\s+def)\s+([A-Za-z_]\w*)/, "function_declaration"],
  [/^\s*class\s+([A-Za-z_]\w*)/, "class_declaration"],
]

const PY_ASSIGN = /^\s*([A-Za-z_]\w*)\s*(?::[^=]+)?=(?!=)/

export function declarationName(text: string, kind: string, language: string): string | null {
  for (const [re] of NAME_PATTERNS) {
    const m = text.match(re)
    if (m) return m[1]
  }
  if (language === "python" && (kind === "assignment" || kind === "lexical_declaration")) {
    const m = text.match(PY_ASSIGN)
    if (m) return m[1]
  }
  if (kind === "method_definition") {
    const m = text.match(/^\s*(?:async\s+)?(?:get\s+|set\s+|static\s+)?([A-Za-z_$][\w$]*)\s*[(<]/)
    if (m) return m[1]
  }
  if (kind === "arrow_function") {
    const m = text.match(/^\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)/)
    if (m) return m[1]
  }
  return null
}

export function importSpecifier(text: string): string | null {
  const from = text.match(/\bfrom\s+["']([^"']+)["']/)
  if (from) return from[1]
  const side = text.match(/^\s*import\s+["']([^"']+)["']/)
  if (side) return side[1]
  const req = text.match(/\brequire\(\s*["']([^"']+)["']\s*\)/)
  if (req) return req[1]
  return null
}

export function resolveImport(root: string, fromFile: string, spec: string): string | null {
  if (!spec.startsWith(".")) return null
  const base = resolve(root, dirname(fromFile), spec)
  const candidates: string[] = [base]
  if (!extname(base)) {
    for (const ext of CODE_EXTENSIONS) candidates.push(base + ext)
    for (const ext of CODE_EXTENSIONS) candidates.push(join(base, `index${ext}`))
  }
  for (const candidate of candidates) {
    if (candidate.startsWith(resolve(root))) {
      const rel = toPosix(candidate.slice(resolve(root).length + 1))
      if (existsSyncSafe(candidate)) return rel
    }
  }
  return null
}

function existsSyncSafe(path: string): boolean {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

export type HitInput = {
  text: string
  kind: string
  startLine: number
  endLine: number
  startColumn: number
  endColumn: number
}

export function categoryForKind(kind: string): Reference["category"] | null {
  return KIND_CATEGORY[kind] ?? null
}

export function symbolRef(
  root: string,
  file: string,
  language: string,
  hit: HitInput,
  fileHash: string,
  source: string,
  capturedAt: string,
): Reference | null {
  const name = declarationName(hit.text, hit.kind, language)
  if (!name) return null
  const category = categoryForKind(hit.kind) ?? "symbol"
  return {
    id: refId("symbol", file, hit.startLine, name, hit.kind),
    category: "symbol",
    kind: `symbol.${category}`,
    name,
    file: relPosix(root, join(root, file)),
    language,
    startLine: hit.startLine,
    endLine: hit.endLine,
    startColumn: hit.startColumn,
    endColumn: hit.endColumn,
    excerpt: `${name} (${hit.kind})`,
    provenance: { generator: "watch-ref/symbol", astgrepKind: hit.kind, language, fileHash, capturedAt, source },
    meta: { declaration: category, target: file },
  }
}

export function architectureRef(
  root: string,
  file: string,
  language: string,
  hit: HitInput,
  fileHash: string,
  source: string,
  capturedAt: string,
): Reference | null {
  const spec = importSpecifier(hit.text)
  if (!spec) return null
  const target = resolveImport(root, file, spec)
  return {
    id: refId("architecture", file, hit.startLine, spec, "import_edge"),
    category: "architecture",
    kind: "architecture.import",
    name: spec,
    file: relPosix(root, join(root, file)),
    language,
    startLine: hit.startLine,
    endLine: hit.endLine,
    startColumn: hit.startColumn,
    endColumn: hit.endColumn,
    excerpt: hit.text.split("\n")[0]?.slice(0, 200) ?? spec,
    provenance: { generator: "watch-ref/architecture", astgrepKind: hit.kind, language, fileHash, capturedAt, source },
    meta: { target: target ?? "", external: target === null, resolved: target !== null },
  }
}

export function isConfigFile(file: string): boolean {
  return CONFIG_EXTENSIONS.includes(extname(file).toLowerCase())
}

export type ConfigEntry = { key: string; line: number; kind: string }

export function configEntries(file: string, text: string): ConfigEntry[] {
  const ext = extname(file).toLowerCase()
  if (ext === ".json" || ext === ".jsonc") {
    const out: ConfigEntry[] = []
    const lines = text.split(/\r?\n/)
    const re = /^\s{0,4}"([^"]+)"\s*:/
    lines.forEach((line, i) => {
      const m = line.match(re)
      if (m) out.push({ key: m[1], line: i + 1, kind: "json" })
    })
    return out
  }
  const out: ConfigEntry[] = []
  const lines = text.split(/\r?\n/)
  const re = /^\s*([A-Za-z0-9_.-]+)\s*[:=]/
  lines.forEach((line, i) => {
    if (!line.trim() || line.trim().startsWith("#") || line.trim().startsWith("//")) return
    const m = line.match(re)
    if (m) out.push({ key: m[1], line: i + 1, kind: ext.slice(1) || "config" })
  })
  return out
}

export function configRefs(
  root: string,
  file: string,
  text: string,
  fileHash: string,
  source: string,
  capturedAt: string,
): Reference[] {
  const rel = relPosix(root, join(root, file))
  return configEntries(file, text).slice(0, 500).map((entry) => ({
    id: refId("config", rel, entry.line, entry.key, entry.kind),
    category: "config" as const,
    kind: `config.${entry.kind}`,
    name: entry.key,
    file: rel,
    language: "config",
    startLine: entry.line,
    endLine: entry.line,
    startColumn: 0,
    endColumn: entry.key.length,
    excerpt: entry.key,
    provenance: { generator: "watch-ref/config", language: "config", fileHash, capturedAt, source },
    meta: { format: entry.kind },
  }))
}

export function fileRef(
  root: string,
  file: string,
  language: string,
  bytes: number,
  fileHash: string,
  source: string,
  capturedAt: string,
): Reference {
  const rel = relPosix(root, join(root, file))
  return {
    id: refId("file", rel, 0, rel, "file"),
    category: "file",
    kind: "file.entry",
    name: rel,
    file: rel,
    language,
    startLine: 1,
    endLine: 1,
    startColumn: 0,
    endColumn: 0,
    excerpt: `${rel} (${bytes} bytes)`,
    provenance: { generator: "watch-ref/file", language, fileHash, capturedAt, source },
    meta: { bytes },
  }
}

export function diagnosticRef(
  root: string,
  file: string,
  language: string,
  message: string,
  line: number,
  fileHash: string,
  source: string,
  capturedAt: string,
): Reference {
  const rel = relPosix(root, join(root, file))
  return {
    id: refId("diagnostic", rel, line, message.slice(0, 80), "parse"),
    category: "diagnostic",
    kind: "diagnostic.parse",
    name: message.slice(0, 120),
    file: rel,
    language,
    startLine: line,
    endLine: line,
    startColumn: 0,
    endColumn: 0,
    excerpt: message.slice(0, 300),
    provenance: { generator: "watch-ref/diagnostic", language, fileHash, capturedAt, source },
    meta: { severity: "warning" },
  }
}
