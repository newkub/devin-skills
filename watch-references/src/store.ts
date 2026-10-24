import { renameSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { createHash } from "node:crypto"
import { readJson, writeJson, type Paths } from "./config"
import type { ChangeEntry, ChangeSet, Index, Reference, Status } from "./types"

// Decision: every write goes through a temp file + rename so a crash can never leave a
// half-written index behind. The MCP server and the watcher both read this file.

export function hashId(...parts: (string | number)[]): string {
  const h = createHash("sha256")
  h.update(parts.join("\u0000"))
  return h.digest("hex").slice(0, 16)
}

export function refId(category: string, file: string, startLine: number, name: string, kind: string): string {
  return `${category}-${hashId(category, file, startLine, name, kind)}`
}

export function atomicWrite(path: string, content: string): void {
  const tmp = `${path}.tmp-${process.pid}`
  try {
    writeFileSync(tmp, content)
    renameSync(tmp, path)
  } catch (err) {
    try {
      rmSync(tmp, { force: true })
    } catch {}
    throw err
  }
}

export async function atomicWriteJson(path: string, value: unknown): Promise<void> {
  const tmp = `${path}.tmp-${process.pid}`
  try {
    await writeJson(tmp, value)
    renameSync(tmp, path)
  } catch (err) {
    try {
      rmSync(tmp, { force: true })
    } catch {}
    throw err
  }
}

export function sortRefs(refs: Reference[]): Reference[] {
  return refs.toSorted((a, b) => {
    if (a.file !== b.file) return a.file < b.file ? -1 : 1
    if (a.startLine !== b.startLine) return a.startLine - b.startLine
    if (a.category !== b.category) return a.category < b.category ? -1 : 1
    if (a.name !== b.name) return a.name < b.name ? -1 : 1
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  })
}

export async function loadIndex(paths: Paths): Promise<Index | null> {
  return readJson<Index>(paths.index)
}

export async function saveIndex(paths: Paths, index: Index): Promise<void> {
  index.refs = sortRefs(index.refs)
  await atomicWriteJson(paths.index, index)
}

export function emptyIndex(root: string): Index {
  return { version: 1, generatedAt: new Date().toISOString(), root, files: {}, refs: [] }
}

export function replaceFileRefs(
  index: Index,
  file: string,
  refs: Reference[],
  record: Index["files"][string],
): void {
  index.files[file] = record
  index.refs = index.refs.filter((r) => r.file !== file).concat(refs)
}

export function dropFile(index: Index, file: string): number {
  const before = index.refs.length
  index.refs = index.refs.filter((r) => r.file !== file)
  delete index.files[file]
  return before - index.refs.length
}

export function emptyStatus(now = new Date().toISOString()): Status {
  return {
    version: 1,
    state: "idle",
    initializedAt: now,
    lastScanAt: null,
    lastChangeAt: null,
    lastError: null,
    files: 0,
    references: 0,
    watcher: { healthy: false, startedAt: null, lastEventAt: null, pending: 0, ignored: 0 },
  }
}

export async function loadStatus(paths: Paths): Promise<Status | null> {
  return readJson<Status>(paths.status)
}

export async function saveStatus(paths: Paths, status: Status): Promise<void> {
  await atomicWriteJson(paths.status, status)
}

export async function updateStatus(
  paths: Paths,
  mutate: (status: Status) => void,
): Promise<Status> {
  const status = (await loadStatus(paths)) ?? emptyStatus()
  mutate(status)
  await saveStatus(paths, status)
  return status
}

function changeFile(paths: Paths, at: string): string {
  const safe = at.replace(/[:.]/g, "-")
  return join(paths.changes, `${safe}.json`)
}

export async function appendChanges(paths: Paths, entries: ChangeEntry[]): Promise<ChangeSet | null> {
  if (entries.length === 0) return null
  const at = new Date().toISOString()
  const set: ChangeSet = { version: 1, at, entries }
  await atomicWriteJson(changeFile(paths, at), set)
  return set
}

export async function loadLatestChanges(paths: Paths): Promise<ChangeSet | null> {
  const glob = new Bun.Glob("*.json")
  const files: string[] = []
  try {
    for await (const rel of glob.scan({ cwd: paths.changes, absolute: false })) files.push(rel)
  } catch {
    return null
  }
  if (files.length === 0) return null
  files.sort()
  return readJson<ChangeSet>(join(paths.changes, files[files.length - 1]))
}

export function search(
  index: Index,
  query: string,
  filter: { category?: string; file?: string; limit?: number } = {},
): Reference[] {
  const q = query.toLowerCase()
  const limit = filter.limit ?? 50
  const out: Reference[] = []
  for (const ref of index.refs) {
    if (filter.category && ref.category !== filter.category) continue
    if (filter.file && ref.file !== filter.file) continue
    const hay = `${ref.name}\n${ref.kind}\n${ref.excerpt}\n${ref.file}`.toLowerCase()
    if (q && !hay.includes(q)) continue
    out.push(ref)
    if (out.length >= limit) break
  }
  return out
}

export function refById(index: Index, id: string): Reference | null {
  return index.refs.find((r) => r.id === id) ?? null
}

export function refsInFile(index: Index, file: string): Reference[] {
  return index.refs.filter((r) => r.file === file)
}

export function affectedBy(index: Index, file: string): { inside: Reference[]; dependents: Reference[] } {
  const inside = refsInFile(index, file)
  const dependents = index.refs.filter(
    (r) => r.category === "architecture" && r.meta?.target === file,
  )
  return { inside, dependents }
}

export function countRefs(index: Index, category: string): number {
  let n = 0
  for (const ref of index.refs) if (ref.category === category) n++
  return n
}

export function byCategory(index: Index): Record<string, number> {
  const out: Record<string, number> = {}
  for (const ref of index.refs) out[ref.category] = (out[ref.category] ?? 0) + 1
  return out
}

export function pathsSummary(paths: Paths): Record<string, string> {
  return {
    root: paths.root,
    out: paths.out,
    index: paths.index,
    status: paths.status,
    changes: paths.changes,
    feedback: paths.feedback,
    visual: paths.visual,
    skills: paths.skills,
    dev: paths.dev,
    configFile: paths.configFile,
  }
}
