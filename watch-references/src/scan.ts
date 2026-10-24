import { createHash } from "node:crypto"
import { extname, resolve } from "node:path"
import {
  CODE_EXTENSIONS,
  CONFIG_EXTENSIONS,
  astgrepVersion,
  chunk,
  langFor,
  scanKind,
  type KindSpec,
} from "./astgrep"
import { ensureDir, pathsFor, relPosix, type Config } from "./config"
import {
  architectureRef,
  configRefs,
  declarationName,
  diagnosticRef,
  fileRef,
  importSpecifier,
  isConfigFile,
  symbolRef,
  type HitInput,
} from "./derive"
import {
  appendChanges,
  dropFile,
  emptyIndex,
  loadIndex,
  refId,
  replaceFileRefs,
  saveIndex,
  updateStatus,
} from "./store"
import type { ChangeEntry, FileRecord, Index, Reference } from "./types"

// Decision: one scan pass = walk, hash, analyze only changed files, then replace that file's
// refs wholesale. Whole-file replacement is what makes deleted refs disappear; hashing is what
// keeps an unchanged tree from being re-parsed on every watch event.

const MAX_ANALYZE_BYTES = 2 * 1024 * 1024
const MAX_REFS_PER_FILE = 5000
const MAX_CHANGE_REFS = 500
const BATCH_FILES = 40
const CHANGE_FILE = ".watch-references/changelog"

const TEXT_EXTENSIONS = new Set([
  ...CODE_EXTENSIONS,
  ...CONFIG_EXTENSIONS,
  ".md",
  ".mdx",
  ".txt",
  ".css",
  ".scss",
  ".less",
  ".html",
  ".htm",
  ".sql",
  ".sh",
  ".bash",
  ".ps1",
  ".vue",
  ".svelte",
  ".astro",
  ".graphql",
  ".gql",
  ".proto",
  ".xml",
  ".svg",
])

// Nested callables have no module-level identity, so they are indexed as symbols only.
const NESTED_SYMBOL_KINDS = new Set(["method_definition", "arrow_function"])

export type ScanStats = {
  files: number
  changed: number
  reused: number
  removed: number
  references: number
  diagnostics: number
  durationMs: number
  astgrep: string | null
  error: string | null
}

type Loaded = { rel: string; bytes: number; hash: string; text: string | null }

export async function listFiles(root: string, cfg: Config): Promise<string[]> {
  const excludes = cfg.exclude.map((pattern) => new Bun.Glob(pattern))
  const excludedDirs = new Set<string>()
  for (const pattern of cfg.exclude) {
    const m = pattern.match(/^\*\*\/([A-Za-z0-9_.-]+)\/\*\*$/)
    if (m) excludedDirs.add(m[1])
  }
  const out: string[] = []
  const seen = new Set<string>()
  outer: for (const pattern of cfg.include) {
    const glob = new Bun.Glob(pattern)
    for await (const rel of glob.scan({ cwd: root, onlyFiles: true, dot: true })) {
      const posix = rel.split("\\").join("/")
      if (seen.has(posix)) continue
      if (isExcluded(posix, excludes, excludedDirs)) continue
      seen.add(posix)
      out.push(posix)
      if (out.length >= cfg.watch.maxFiles) break outer
    }
  }
  return out.toSorted()
}

function isExcluded(rel: string, globs: Bun.Glob[], dirs: Set<string>): boolean {
  for (const segment of rel.split("/")) {
    if (dirs.has(segment)) return true
  }
  for (const glob of globs) {
    if (glob.match(rel)) return true
  }
  return false
}

async function loadFile(root: string, rel: string): Promise<Loaded | null> {
  const abs = resolve(root, rel)
  try {
    const file = Bun.file(abs)
    if (!(await file.exists())) return null
    const buf = new Uint8Array(await file.arrayBuffer())
    const hash = createHash("sha256").update(buf).digest("hex")
    const ext = extname(rel).toLowerCase()
    const text = buf.byteLength <= MAX_ANALYZE_BYTES && TEXT_EXTENSIONS.has(ext) ? new TextDecoder().decode(buf) : null
    return { rel, bytes: buf.byteLength, hash, text }
  } catch {
    return null
  }
}

export function languageOf(rel: string): string {
  const spec = langFor(rel)
  if (spec) return spec.label
  const ext = extname(rel).toLowerCase().slice(1)
  return ext || "text"
}

function firstLine(text: string): string {
  return (text.split("\n")[0] ?? "").trim().slice(0, 200)
}

function directRef(
  rel: string,
  language: string,
  hit: HitInput,
  category: KindSpec["category"],
  fileHash: string,
  source: string,
  capturedAt: string,
): Reference | null {
  if (!hit.text.trim()) return null
  const name =
    category === "import"
      ? (importSpecifier(hit.text) ?? firstLine(hit.text).slice(0, 80))
      : (declarationName(hit.text, hit.kind, language) ?? firstLine(hit.text).slice(0, 80))
  if (!name) return null
  return {
    id: refId(category, rel, hit.startLine, name, hit.kind),
    category,
    kind: `${category}.${hit.kind}`,
    name,
    file: rel,
    language,
    startLine: hit.startLine,
    endLine: hit.endLine,
    startColumn: hit.startColumn,
    endColumn: hit.endColumn,
    excerpt: firstLine(hit.text),
    provenance: { generator: "watch-ref/astgrep", astgrepKind: hit.kind, language, fileHash, capturedAt, source },
    meta: { category },
  }
}

function normalizeRel(root: string, file: string): string {
  return relPosix(root, resolve(root, file))
}

async function analyzeBatch(
  root: string,
  files: Loaded[],
  capturedAt: string,
  source: string,
): Promise<Map<string, Reference[]>> {
  const out = new Map<string, Reference[]>()
  const byRel = new Map<string, Loaded>()
  for (const f of files) {
    byRel.set(f.rel, f)
    out.set(f.rel, [])
  }

  type Group = { lang: string; rels: string[] }
  const groups = new Map<string, Group>()
  for (const f of files) {
    if (!f.text) continue
    const spec = langFor(f.rel)
    if (!spec) continue
    const group = groups.get(spec.lang) ?? { lang: spec.lang, rels: [] }
    group.rels.push(f.rel)
    groups.set(spec.lang, group)
  }

  for (const group of groups.values()) {
    const specs = langFor(group.rels[0])?.kinds ?? []
    for (const spec of specs) {
      for (const batch of chunk(group.rels, BATCH_FILES)) {
        let result: Awaited<ReturnType<typeof scanKind>>
        try {
          result = await scanKind(
            root,
            batch.map((rel) => resolve(root, rel)),
            group.lang,
            spec.kind,
          )
        } catch (err) {
          const message = String((err as Error).message ?? err)
          for (const rel of batch) addDiagnostic(out, byRel, rel, message, capturedAt, source, root)
          continue
        }
        for (const hit of result.hits) {
          const rel = normalizeRel(root, hit.file)
          const loaded = byRel.get(rel)
          if (!loaded) continue
          const refs = out.get(rel)!
          if (refs.length >= MAX_REFS_PER_FILE) break
          const language = langFor(rel)?.label ?? group.lang
          if (NESTED_SYMBOL_KINDS.has(hit.kind)) {
            const ref = symbolRef(root, rel, language, hit, loaded.hash, source, capturedAt)
            if (ref) refs.push(ref)
            continue
          }
          const ref = directRef(rel, language, hit, spec.category, loaded.hash, source, capturedAt)
          if (ref) refs.push(ref)
          if (spec.category === "import") {
            const edge = architectureRef(root, rel, language, hit, loaded.hash, source, capturedAt)
            if (edge) refs.push(edge)
          }
        }
        for (const diagnostic of result.diagnostics) {
          addDiagnostic(out, byRel, normalizeRel(root, diagnostic.file), diagnostic.message, capturedAt, source, root)
        }
      }
    }
  }

  for (const f of files) {
    const refs = out.get(f.rel)!
    const language = languageOf(f.rel)
    if (f.text && isConfigFile(f.rel)) refs.push(...configRefs(root, f.rel, f.text, f.hash, source, capturedAt))
    refs.push(fileRef(root, f.rel, language, f.bytes, f.hash, source, capturedAt))
    if (refs.length > MAX_REFS_PER_FILE) refs.length = MAX_REFS_PER_FILE
  }
  return out
}

function addDiagnostic(
  out: Map<string, Reference[]>,
  byRel: Map<string, Loaded>,
  rel: string,
  message: string,
  capturedAt: string,
  source: string,
  root: string,
): void {
  const loaded = byRel.get(rel)
  if (!loaded) return
  const ref = diagnosticRef(root, rel, languageOf(rel), message, 1, loaded.hash, source, capturedAt)
  // One failure must produce one diagnostic, even when every kind scan in the batch fails.
  const refs = out.get(rel)!
  if (refs.some((existing) => existing.id === ref.id)) return
  refs.push(ref)
}

// Import edges are derived from the importing file, so deleting or renaming a target leaves
// `resolved: true` pointing at nothing until the dependents are re-parsed. They are cheap to
// redo (hash reuse covers everything else) and this is what keeps the graph honest.
function dependentsOf(index: Index, removed: string[]): Set<string> {
  const out = new Set<string>()
  if (removed.length === 0) return out
  const targets = new Set(removed)
  for (const ref of index.refs) {
    if (ref.category !== "architecture") continue
    const target = ref.meta?.target
    if (typeof target === "string" && targets.has(target)) out.add(ref.file)
  }
  return out
}

function changeRefs(changes: ChangeEntry[]): Reference[] {
  return changes.map((entry) => ({
    id: refId("change", entry.path, 0, entry.kind, entry.at),
    category: "change" as const,
    kind: `change.${entry.kind}`,
    name: `${entry.kind} ${entry.path}`,
    file: CHANGE_FILE,
    language: "meta",
    startLine: 0,
    endLine: 0,
    startColumn: 0,
    endColumn: 0,
    excerpt: `${entry.kind}: ${entry.path} (${entry.refsChanged} refs)`,
    provenance: {
      generator: "watch-ref/change",
      capturedAt: entry.at,
      source: "change-log",
    },
    meta: { at: entry.at, refsChanged: entry.refsChanged, path: entry.path },
  }))
}

function mergeChangeRefs(index: Index, changes: ChangeEntry[]): void {
  if (changes.length === 0) return
  const fresh = changeRefs(changes)
  const kept = index.refs.filter((r) => r.category === "change").slice(0, Math.max(0, MAX_CHANGE_REFS - fresh.length))
  index.refs = index.refs.filter((r) => r.category !== "change").concat(fresh, kept)
}

export async function scanProject(
  root: string,
  cfg: Config,
  opts: { force?: boolean; source?: string } = {},
): Promise<{ index: Index; stats: ScanStats; changes: ChangeEntry[] }> {
  const started = Date.now()
  const paths = pathsFor(root, cfg)
  ensureDir(paths.out)
  ensureDir(paths.changes)
  const capturedAt = new Date().toISOString()
  const source = opts.source ?? "scan"
  const index = (await loadIndex(paths)) ?? emptyIndex(root)
  const rels = await listFiles(root, cfg)
  const current = new Set(rels)

  const changes: ChangeEntry[] = []
  let removed = 0
  const removedRels: string[] = []
  for (const rel of Object.keys(index.files)) {
    if (current.has(rel)) continue
    removed++
    removedRels.push(rel)
    changes.push({ path: rel, kind: "removed", at: capturedAt, refsChanged: dropFile(index, rel) })
  }
  const dependents = dependentsOf(index, removedRels)

  const loaded: Loaded[] = []
  for (const rel of rels) {
    const file = await loadFile(root, rel)
    if (file) loaded.push(file)
  }

  const changed: Loaded[] = []
  const hadFile = new Set<string>()
  let reused = 0
  for (const file of loaded) {
    const record = index.files[file.rel]
    if (!opts.force && !dependents.has(file.rel) && record && record.hash === file.hash) {
      reused++
      continue
    }
    if (record) hadFile.add(file.rel)
    changed.push(file)
  }

  const refsByFile = await analyzeBatch(root, changed, capturedAt, source)
  let diagnostics = 0
  for (const file of changed) {
    const refs = refsByFile.get(file.rel) ?? []
    for (const ref of refs) if (ref.category === "diagnostic") diagnostics++
    const record: FileRecord = {
      hash: file.hash,
      language: languageOf(file.rel),
      bytes: file.bytes,
      refs: refs.length,
      scannedAt: capturedAt,
    }
    replaceFileRefs(index, file.rel, refs, record)
    changes.push({
      path: file.rel,
      kind: hadFile.has(file.rel) ? "modified" : "added",
      at: capturedAt,
      refsChanged: refs.length,
    })
  }

  mergeChangeRefs(index, changes)
  index.root = root
  index.generatedAt = capturedAt
  await saveIndex(paths, index)
  await appendChanges(paths, changes)

  await updateStatus(paths, (status) => {
    status.state = "idle"
    status.lastScanAt = capturedAt
    status.lastError = null
    status.files = Object.keys(index.files).length
    status.references = index.refs.length
    if (changes.length > 0) status.lastChangeAt = capturedAt
  })

  let astgrep: string | null = null
  try {
    astgrep = await astgrepVersion(root)
  } catch {
    astgrep = null
  }

  return {
    index,
    changes,
    stats: {
      files: loaded.length,
      changed: changed.length,
      reused,
      removed,
      references: index.refs.length,
      diagnostics,
      durationMs: Date.now() - started,
      astgrep,
      error: astgrep === null ? "ast-grep binary not found; code categories were skipped" : null,
    },
  }
}

export async function scanPaths(
  root: string,
  cfg: Config,
  rels: string[],
  source = "watch",
): Promise<{ changed: ChangeEntry[]; references: number }> {
  const paths = pathsFor(root, cfg)
  ensureDir(paths.out)
  ensureDir(paths.changes)
  const capturedAt = new Date().toISOString()
  const index = (await loadIndex(paths)) ?? emptyIndex(root)
  const changes: ChangeEntry[] = []
  const present: Loaded[] = []
  const existedBefore = new Map<string, boolean>()
  const removedRels: string[] = []

  for (const rel of [...new Set(rels)].toSorted()) {
    const existed = index.files[rel] !== undefined
    const file = await loadFile(root, rel)
    if (!file) {
      if (existed) {
        removedRels.push(rel)
        changes.push({ path: rel, kind: "removed", at: capturedAt, refsChanged: dropFile(index, rel) })
      }
      continue
    }
    if (existed && index.files[rel].hash === file.hash) continue
    existedBefore.set(rel, existed)
    present.push(file)
  }

  const queued = new Set(present.map((file) => file.rel))
  for (const rel of dependentsOf(index, removedRels)) {
    if (queued.has(rel) || !index.files[rel]) continue
    const file = await loadFile(root, rel)
    if (!file) continue
    queued.add(rel)
    existedBefore.set(rel, true)
    present.push(file)
  }

  const refsByFile = await analyzeBatch(root, present, capturedAt, source)
  for (const file of present) {
    const refs = refsByFile.get(file.rel)
    if (!refs) continue
    const record: FileRecord = {
      hash: file.hash,
      language: languageOf(file.rel),
      bytes: file.bytes,
      refs: refs.length,
      scannedAt: capturedAt,
    }
    replaceFileRefs(index, file.rel, refs, record)
    changes.push({
      path: file.rel,
      kind: existedBefore.get(file.rel) ? "modified" : "added",
      at: capturedAt,
      refsChanged: refs.length,
    })
  }

  if (changes.length > 0) {
    mergeChangeRefs(index, changes)
    index.generatedAt = capturedAt
    await saveIndex(paths, index)
    await appendChanges(paths, changes)
    await updateStatus(paths, (status) => {
      status.lastChangeAt = capturedAt
      status.files = Object.keys(index.files).length
      status.references = index.refs.length
    })
  }
  return { changed: changes, references: index.refs.length }
}

export function statsSummary(stats: ScanStats): Record<string, string | number | boolean | null> {
  return {
    files: stats.files,
    changed: stats.changed,
    reused: stats.reused,
    removed: stats.removed,
    references: stats.references,
    diagnostics: stats.diagnostics,
    durationMs: stats.durationMs,
    astgrep: stats.astgrep,
    error: stats.error,
  }
}
