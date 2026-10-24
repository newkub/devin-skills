import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { CliError, ensureDir, readJson, requireInside, type Config, type Paths } from "./config"
import { atomicWrite, hashId, loadIndex } from "./store"
import { scanPaths } from "./scan"
import { runShell } from "./runproc"
import type { FeedbackRecord, FeedbackStatus, FixOp, FixPlan } from "./types"

// Decision: feedback never edits source on its own. A fix is a separate, explicit
// step that carries its own authorization flag and validates every operation before
// touching a file, so an agent can inspect exactly what will change.

export type FeedbackInput = {
  category: string
  description: string
  locations?: string[]
  referenceIds?: string[]
}

export type CheckResult = {
  name: string
  command: string
  exitCode: number
  output: string
}

const STATUSES: FeedbackStatus[] = ["open", "accepted", "fixed", "verified", "rejected", "wontfix"]

function recordPath(paths: Paths, id: string): string {
  return join(paths.feedback, `${id}.json`)
}

function planPath(paths: Paths, feedbackId: string): string {
  return join(paths.feedback, `${feedbackId}.plan.json`)
}

function assertStatus(status: string): FeedbackStatus {
  if (!STATUSES.includes(status as FeedbackStatus)) {
    throw new CliError(2, `invalid feedback status: ${status} (expected ${STATUSES.join("|")})`)
  }
  return status as FeedbackStatus
}

export async function createFeedback(paths: Paths, input: FeedbackInput): Promise<FeedbackRecord> {
  const description = input.description.trim()
  if (!description) throw new CliError(2, "feedback description is required")
  ensureDir(paths.feedback)
  const now = new Date().toISOString()
  const id = `fb-${hashId("feedback", input.category, description, now)}`
  const record: FeedbackRecord = {
    id,
    category: input.category,
    description,
    status: "open",
    locations: [...new Set(input.locations ?? [])].toSorted(),
    referenceIds: [...new Set(input.referenceIds ?? [])].toSorted(),
    createdAt: now,
    updatedAt: now,
    verifiedAt: null,
    verification: null,
    fix: null,
  }
  atomicWrite(recordPath(paths, id), JSON.stringify(record, null, 2) + "\n")
  return record
}

export async function listFeedback(
  paths: Paths,
  filter: { status?: FeedbackStatus } = {},
): Promise<FeedbackRecord[]> {
  const glob = new Bun.Glob("*.json")
  const out: FeedbackRecord[] = []
  try {
    for await (const rel of glob.scan({ cwd: paths.feedback, absolute: false })) {
      if (rel.endsWith(".plan.json")) continue
      const record = await readJson<FeedbackRecord>(join(paths.feedback, rel))
      if (!record || typeof record.id !== "string") continue
      if (filter.status && record.status !== filter.status) continue
      out.push(record)
    }
  } catch {
    return []
  }
  return out.toSorted((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0))
}

export async function getFeedback(paths: Paths, id: string): Promise<FeedbackRecord | null> {
  return readJson<FeedbackRecord>(recordPath(paths, id))
}

export async function updateFeedback(
  paths: Paths,
  id: string,
  patch: { status?: FeedbackStatus; description?: string; locations?: string[] },
): Promise<FeedbackRecord> {
  const record = await getFeedback(paths, id)
  if (!record) throw new CliError(2, `feedback not found: ${id}`)
  if (patch.status !== undefined) record.status = assertStatus(patch.status)
  if (patch.description !== undefined) {
    const text = patch.description.trim()
    if (!text) throw new CliError(2, "feedback description is required")
    record.description = text
  }
  if (patch.locations !== undefined) record.locations = [...new Set(patch.locations)].toSorted()
  record.updatedAt = new Date().toISOString()
  atomicWrite(recordPath(paths, id), JSON.stringify(record, null, 2) + "\n")
  return record
}

export async function saveFixPlan(paths: Paths, plan: FixPlan): Promise<FixPlan> {
  ensureDir(paths.feedback)
  atomicWrite(planPath(paths, plan.feedbackId), JSON.stringify(plan, null, 2) + "\n")
  return plan
}

export async function loadFixPlan(paths: Paths, feedbackId: string): Promise<FixPlan | null> {
  return readJson<FixPlan>(planPath(paths, feedbackId))
}

export function planFix(
  feedbackId: string,
  ops: FixOp[],
  scope?: string[],
): FixPlan {
  const files = [...new Set(ops.map((op) => op.file))]
  return {
    version: 1,
    feedbackId,
    createdAt: new Date().toISOString(),
    scope: [...new Set(scope ?? files)].toSorted(),
    ops,
  }
}

function readLines(path: string): string[] {
  return readFileSync(path, "utf8").split(/\r?\n/)
}

function validateOp(root: string, op: FixOp, scope: Set<string>): void {
  if (!scope.has(op.file)) throw new CliError(2, `fix op outside plan scope: ${op.file}`)
  if (op.startLine < 1 || op.endLine < op.startLine) {
    throw new CliError(2, `invalid line range ${op.startLine}..${op.endLine} in ${op.file}`)
  }
  const abs = requireInside(root, op.file)
  if (!existsSync(abs)) throw new CliError(2, `fix target does not exist: ${op.file}`)
  const lines = readLines(abs)
  if (op.endLine > lines.length) {
    throw new CliError(2, `fix range ${op.startLine}..${op.endLine} exceeds ${op.file} (${lines.length} lines)`)
  }
  const actual = lines.slice(op.startLine - 1, op.endLine).join("\n")
  if (actual !== op.expectedText) {
    throw new CliError(2, `fix precondition failed for ${op.file}:${op.startLine} (source changed since planning)`)
  }
}

/**
 * Apply a planned fix. Refuses unless the caller passes `authorize: true`, so a
 * feedback submission can never silently rewrite source. Every op is validated
 * before any file is written; ops are applied bottom-up per file so earlier line
 * numbers stay valid.
 */
export async function applyFixPlan(
  root: string,
  paths: Paths,
  feedbackId: string,
  opts: { authorize: boolean },
): Promise<{ applied: number; record: FeedbackRecord }> {
  if (opts.authorize !== true) {
    throw new CliError(2, "applying a fix requires explicit authorization")
  }
  const record = await getFeedback(paths, feedbackId)
  if (!record) throw new CliError(2, `feedback not found: ${feedbackId}`)
  if (record.status === "rejected" || record.status === "wontfix") {
    throw new CliError(2, `feedback ${feedbackId} is ${record.status}; reopen it before fixing`)
  }
  const plan = await loadFixPlan(paths, feedbackId)
  if (!plan) throw new CliError(2, `no fix plan for ${feedbackId}; request a fix first`)

  const scope = new Set(plan.scope)
  for (const op of plan.ops) validateOp(root, op, scope)

  const byFile = new Map<string, FixOp[]>()
  for (const op of plan.ops) {
    const list = byFile.get(op.file) ?? []
    list.push(op)
    byFile.set(op.file, list)
  }

  for (const [file, ops] of byFile) {
    const abs = requireInside(root, file)
    const lines = readLines(abs)
    for (const op of ops.toSorted((a, b) => b.startLine - a.startLine)) {
      const replacement = op.replacement === "" ? [] : op.replacement.split("\n")
      lines.splice(op.startLine - 1, op.endLine - op.startLine + 1, ...replacement)
    }
    atomicWrite(abs, lines.join("\n"))
  }

  record.status = "fixed"
  record.updatedAt = new Date().toISOString()
  record.fix = {
    requestedAt: plan.createdAt,
    authorized: true,
    scope: plan.scope,
    planPath: planPath(paths, feedbackId),
    appliedAt: record.updatedAt,
  }
  record.verification = null
  record.verifiedAt = null
  atomicWrite(recordPath(paths, feedbackId), JSON.stringify(record, null, 2) + "\n")
  return { applied: plan.ops.length, record }
}

function runCheck(root: string, check: Config["checks"][number], timeoutMs = 120_000): CheckResult {
  const cwd = check.cwd ? requireInside(root, check.cwd) : root
  const res = runShell(check.command, { cwd, timeoutMs })
  return { name: check.name, command: check.command, exitCode: res.exitCode, output: res.output }
}

export function runChecks(
  root: string,
  cfg: Config,
  names?: string[],
): CheckResult[] {
  const wanted = names && names.length > 0 ? new Set(names) : null
  const selected = wanted ? cfg.checks.filter((c) => wanted.has(c.name)) : cfg.checks
  if (wanted) {
    const known = new Set(cfg.checks.map((c) => c.name))
    const unknown = [...wanted].filter((n) => !known.has(n))
    if (unknown.length > 0) {
      throw new CliError(2, `unknown check: ${unknown.join(", ")} (configured: ${[...known].join(", ") || "none"})`)
    }
  }
  return selected.map((check) => runCheck(root, check))
}

/**
 * Verification is the only path to `verified`. It runs configured checks and
 * re-scans the touched files; if either signal is missing or failing the record
 * stays `fixed` and says so, rather than claiming a pass.
 */
export async function verifyFeedback(
  root: string,
  cfg: Config,
  paths: Paths,
  id: string,
): Promise<{ record: FeedbackRecord; results: CheckResult[] }> {
  const record = await getFeedback(paths, id)
  if (!record) throw new CliError(2, `feedback not found: ${id}`)

  const results = cfg.checks.map((check) => runCheck(root, check))
  const checksPassed = results.every((r) => r.exitCode === 0)

  const touched = record.fix?.scope ?? record.locations
  await scanPaths(root, cfg, touched, "verify")
  const index = await loadIndex(paths)
  const scanClean =
    index !== null &&
    index.refs.every((ref) => ref.category !== "diagnostic" || !touched.includes(ref.file))

  const failed = results.filter((r) => r.exitCode !== 0)
  const checkedAt = new Date().toISOString()
  record.verification = {
    command: results.map((r) => `${r.name}: ${r.command}`).join(" && ") || undefined,
    exitCode: results.length === 0 ? undefined : failed.length > 0 ? failed[0].exitCode : 0,
    output: results.length > 0 ? results.map((r) => `[${r.name}] exit ${r.exitCode}\n${r.output}`).join("\n\n") : "no checks configured",
    scanClean,
  }
  if (checksPassed && scanClean && results.length > 0) {
    record.status = "verified"
    record.verifiedAt = checkedAt
  } else {
    record.status = "fixed"
    record.verifiedAt = null
  }
  record.updatedAt = checkedAt
  atomicWrite(recordPath(paths, id), JSON.stringify(record, null, 2) + "\n")
  return { record, results }
}
