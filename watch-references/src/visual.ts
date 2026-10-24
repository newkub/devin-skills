import { createHash } from "node:crypto"
import { copyFileSync, createReadStream, existsSync, statSync, unlinkSync } from "node:fs"
import { extname, join } from "node:path"
import { CliError, ensureDir, readJson, relPosix, requireInside, type Config, type Paths } from "./config"
import { runShell } from "./runproc"
import { atomicWriteJson, emptyIndex, loadIndex, refId, saveIndex } from "./store"
import type { Reference, VisualEvidence } from "./types"

// Decision: visual evidence lives in the manifest, and the index carries one reference per
// artifact so agents can search screenshots and recordings next to code. Evidence refs are
// never given a FileRecord, because a full scan treats every unlisted path as deleted.

export type EvidenceKind = VisualEvidence["kind"]
export const EVIDENCE_KINDS: EvidenceKind[] = ["screen", "video", "runtime"]

export type EvidenceManifest = { version: number; evidence: VisualEvidence[] }

const MANIFEST = "manifest.json"
const EXTENSIONS: Record<EvidenceKind, string> = { screen: ".png", video: ".mp4", runtime: ".log" }
const REF_KINDS: Record<EvidenceKind, string> = { screen: "screenshot", video: "recording", runtime: "log" }

function manifestPath(paths: Paths): string {
  return join(paths.visual, MANIFEST)
}

export function evidenceDir(root: string, cfg: Config, kind: EvidenceKind): string {
  const configured =
    kind === "screen" ? cfg.visual.screensDir : kind === "video" ? cfg.visual.videosDir : cfg.visual.runtimeDir
  return requireInside(root, configured)
}

export async function loadManifest(paths: Paths): Promise<EvidenceManifest> {
  const raw = await readJson<EvidenceManifest>(manifestPath(paths))
  if (!raw || !Array.isArray(raw.evidence)) return { version: 1, evidence: [] }
  return { version: 1, evidence: raw.evidence }
}

export async function listEvidence(paths: Paths, kind?: EvidenceKind): Promise<VisualEvidence[]> {
  const manifest = await loadManifest(paths)
  const out = kind ? manifest.evidence.filter((e) => e.kind === kind) : manifest.evidence
  return out.toSorted((a, b) => (a.capturedAt < b.capturedAt ? 1 : a.capturedAt > b.capturedAt ? -1 : 0))
}

async function fileSha256(abs: string): Promise<string> {
  const hash = createHash("sha256")
  for await (const chunk of createReadStream(abs)) hash.update(chunk as Buffer)
  return hash.digest("hex")
}

function slug(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "evidence"
  )
}

function stamp(iso: string): string {
  return iso.replace(/[:.]/g, "-").replace("T", "_").replace("Z", "")
}

function uniqueTarget(dir: string, base: string, ext: string): string {
  let candidate = join(dir, `${base}${ext}`)
  let n = 1
  while (existsSync(candidate)) {
    candidate = join(dir, `${base}-${n}${ext}`)
    n++
  }
  return candidate
}

/**
 * Registers an already-written artifact. The caller owns writing the file; this function
 * only hashes it and publishes the evidence record, so a failed capture never leaves a
 * manifest entry pointing at a partial file.
 */
export async function recordEvidence(
  root: string,
  paths: Paths,
  kind: EvidenceKind,
  absFile: string,
  opts: { label: string; source: string },
): Promise<VisualEvidence> {
  const label = opts.label.trim()
  if (!label) throw new CliError(2, "evidence label is required")
  if (!existsSync(absFile)) throw new CliError(1, `evidence file not found: ${absFile}`)
  const bytes = statSync(absFile).size
  if (bytes <= 0) throw new CliError(1, `evidence file is empty: ${absFile}`)

  const rel = relPosix(root, absFile)
  const sha256 = await fileSha256(absFile)
  const capturedAt = new Date().toISOString()
  const record: VisualEvidence = {
    id: `ev-${refId(kind, rel, 1, label, kind).split("-").pop() ?? ""}`,
    kind,
    label,
    file: rel,
    sha256,
    bytes,
    capturedAt,
    source: opts.source,
  }

  ensureDir(paths.visual)
  const manifest = await loadManifest(paths)
  manifest.evidence = manifest.evidence.filter((e) => e.file !== rel).concat(record)
  await atomicWriteJson(manifestPath(paths), manifest)

  const index = (await loadIndex(paths)) ?? emptyIndex(root)
  const ref: Reference = {
    id: refId(kind, rel, 1, label, REF_KINDS[kind]),
    category: kind,
    kind: REF_KINDS[kind],
    name: label,
    file: rel,
    language: extname(rel).slice(1) || "binary",
    startLine: 1,
    endLine: 1,
    startColumn: 0,
    endColumn: 0,
    excerpt: `${REF_KINDS[kind]} ${bytes} bytes (${rel})`,
    provenance: { generator: "visual", capturedAt, source: opts.source },
    meta: { sha256, bytes, evidenceId: record.id },
  }
  index.refs = index.refs.filter((r) => r.file !== rel).concat(ref)
  index.generatedAt = capturedAt
  await saveIndex(paths, index)
  return record
}

/**
 * Capture runs the configured command with WATCH_REF_EVIDENCE_PATH pointing at the file it
 * must produce. A command that exits non-zero or writes nothing is a failure, never an
 * empty reference.
 */
export async function captureEvidence(
  root: string,
  cfg: Config,
  paths: Paths,
  kind: Exclude<EvidenceKind, "runtime">,
  opts: { label: string; command?: string },
): Promise<VisualEvidence> {
  const label = opts.label.trim()
  if (!label) throw new CliError(2, "capture label is required")
  const command = (opts.command ?? cfg.visual.capture[kind])?.trim()
  if (!command) {
    throw new CliError(
      2,
      `no capture command for ${kind}; pass --command or set visual.capture.${kind} in ${"watch-references.json"}`,
    )
  }

  const dir = evidenceDir(root, cfg, kind)
  ensureDir(dir)
  const capturedAt = new Date().toISOString()
  const target = uniqueTarget(dir, `${slug(label)}-${stamp(capturedAt)}`, EXTENSIONS[kind])
  const result = runShell(command, {
    cwd: root,
    env: { WATCH_REF_ROOT: root, WATCH_REF_EVIDENCE_PATH: target, WATCH_REF_EVIDENCE_KIND: kind },
  })
  if (result.exitCode !== 0) {
    throw new CliError(1, `capture command failed (exit ${result.exitCode}): ${result.output}`)
  }
  if (!existsSync(target)) {
    throw new CliError(1, `capture command did not write WATCH_REF_EVIDENCE_PATH: ${target}`)
  }
  return recordEvidence(root, paths, kind, target, { label, source: command })
}

/** Copies an artifact produced elsewhere in the project into the evidence directory. */
export async function ingestEvidence(
  root: string,
  cfg: Config,
  paths: Paths,
  kind: EvidenceKind,
  sourceFile: string,
  opts: { label: string },
): Promise<VisualEvidence> {
  const sourceAbs = requireInside(root, sourceFile)
  if (!existsSync(sourceAbs)) throw new CliError(2, `evidence source not found: ${sourceFile}`)
  if (statSync(sourceAbs).size <= 0) throw new CliError(1, `evidence source is empty: ${sourceFile}`)

  const dir = evidenceDir(root, cfg, kind)
  ensureDir(dir)
  const ext = extname(sourceAbs) || EXTENSIONS[kind]
  const target = uniqueTarget(dir, `${slug(opts.label)}-${stamp(new Date().toISOString())}`, ext)
  copyFileSync(sourceAbs, target)
  return recordEvidence(root, paths, kind, target, {
    label: opts.label,
    source: relPosix(root, sourceAbs),
  })
}

export function captureRuntime(
  root: string,
  cfg: Config,
  paths: Paths,
  opts: { label: string; sourceFile: string },
): Promise<VisualEvidence> {
  return ingestEvidence(root, cfg, paths, "runtime", opts.sourceFile, { label: opts.label })
}

export type PruneResult = { dryRun: boolean; retentionDays: number; removed: VisualEvidence[]; kept: number }

/**
 * Retention defaults to off and to a dry run. Deleting evidence is destructive, so the
 * caller has to ask for both a window and `apply: true`.
 */
export async function pruneEvidence(
  root: string,
  cfg: Config,
  paths: Paths,
  opts: { retentionDays?: number; apply?: boolean } = {},
): Promise<PruneResult> {
  const retentionDays = opts.retentionDays ?? cfg.visual.retentionDays
  const dryRun = opts.apply !== true
  const manifest = await loadManifest(paths)
  if (!Number.isFinite(retentionDays) || retentionDays <= 0) {
    return { dryRun, retentionDays, removed: [], kept: manifest.evidence.length }
  }

  const cutoff = Date.now() - retentionDays * 86_400_000
  const removed = manifest.evidence.filter((e) => Date.parse(e.capturedAt) < cutoff)
  if (dryRun || removed.length === 0) {
    return { dryRun, retentionDays, removed, kept: manifest.evidence.length - removed.length }
  }

  const gone = new Set(removed.map((e) => e.file))
  for (const entry of removed) {
    const abs = requireInside(root, entry.file)
    if (existsSync(abs)) unlinkSync(abs)
  }
  manifest.evidence = manifest.evidence.filter((e) => !gone.has(e.file))
  await atomicWriteJson(manifestPath(paths), manifest)

  const index = await loadIndex(paths)
  if (index) {
    index.refs = index.refs.filter((ref) => !gone.has(ref.file))
    await saveIndex(paths, index)
  }
  return { dryRun, retentionDays, removed, kept: manifest.evidence.length }
}
