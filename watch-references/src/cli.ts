#!/usr/bin/env bun
import { existsSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { astgrepVersion } from "./astgrep"
import {
  CliError,
  CONFIG_FILE,
  configPath,
  loadConfig,
  pathsFor,
  projectRoot,
  type Config,
  type Paths,
} from "./config"
import {
  applyFixPlan,
  createFeedback,
  getFeedback,
  listFeedback,
  loadFixPlan,
  planFix,
  runChecks,
  saveFixPlan,
  updateFeedback,
  verifyFeedback,
  type CheckResult,
} from "./feedback"
import { detectDevCommand, devStatus, ensureDev, readLogTail, restartDev, startDev, stopDev } from "./devproc"
import { scanProject, statsSummary } from "./scan"
import { generateSkills, validateSkills } from "./skills"
import { byCategory, loadIndex, loadStatus, refById, search } from "./store"
import {
  captureEvidence,
  captureRuntime,
  ingestEvidence,
  listEvidence,
  pruneEvidence,
  type EvidenceKind,
} from "./visual"
import { readWatchLock, watchProject } from "./watch"
import type { FixOp, Reference } from "./types"

// Decision: one parser and one renderer for every command. Flags that take values are
// distinguished from switches by an explicit list, so `--limit 10` can never swallow the
// next positional and `--json` can never consume a command name.

type Flags = Record<string, string | boolean | undefined>

const BOOLEAN_FLAGS = new Set([
  "json",
  "help",
  "force",
  "yes",
  "once",
  "apply",
  "no-watch",
  "quiet",
])

const EXIT = { ok: 0, failed: 1, usage: 2 }

const GLOBAL_FLAGS = ["root", "json", "help"]

// Every command declares the flags it honours, so a typo fails loudly instead of
// being ignored. Grouped commands map each action to its own flags; an unknown action
// falls through to the handler, which owns the "unknown action" message.
const COMMAND_FLAGS: Record<string, string[] | Record<string, string[]>> = {
  init: ["force", "quiet"],
  scan: ["force", "quiet"],
  watch: ["once", "force", "debounce", "interval", "quiet"],
  serve: ["no-watch"],
  status: [],
  search: ["category", "file", "limit"],
  inspect: [],
  check: [],
  references: { list: [], show: ["limit"] },
  feedback: {
    list: ["status"],
    show: [],
    create: ["category", "description", "locations", "refs"],
    update: ["status", "description", "locations"],
    fix: ["ops", "scope"],
    apply: ["yes"],
    verify: [],
  },
  screen: { list: [], capture: ["label", "command"], ingest: ["label"], prune: ["days", "apply"] },
  videos: { list: [], capture: ["label", "command"], ingest: ["label"], prune: ["days", "apply"] },
  runtime: { list: [], capture: ["label"], prune: ["days", "apply"] },
  dev: {
    start: ["command", "cwd"],
    stop: [],
    restart: ["command", "cwd"],
    status: [],
    logs: ["lines"],
    ensure: ["command", "cwd"],
    detect: [],
  },
  skills: { generate: [], validate: [] },
}

const DEFAULT_ACTION: Record<string, string> = {
  references: "list",
  feedback: "list",
  screen: "list",
  videos: "list",
  runtime: "list",
  dev: "status",
  skills: "generate",
}

function validateFlags(command: string, args: string[], flags: Flags): void {
  const spec = COMMAND_FLAGS[command]
  if (spec === undefined) return
  const allowed = new Set(GLOBAL_FLAGS)
  let where = command
  if (Array.isArray(spec)) {
    for (const name of spec) allowed.add(name)
  } else {
    const action = args[0] ?? DEFAULT_ACTION[command] ?? ""
    const names = spec[action]
    if (names === undefined) return
    where = `${command} ${action}`
    for (const name of names) allowed.add(name)
  }
  for (const name of Object.keys(flags)) {
    if (!allowed.has(name)) {
      throw new CliError(EXIT.usage, `unknown flag --${name} for "${where}"; run "watch-ref help ${command}"`)
    }
  }
}

export function parseArgs(argv: string[]): { positionals: string[]; flags: Flags } {
  const positionals: string[] = []
  const flags: Flags = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith("--")) {
      positionals.push(arg)
      continue
    }
    const body = arg.slice(2)
    const eq = body.indexOf("=")
    if (eq >= 0) {
      flags[body.slice(0, eq)] = body.slice(eq + 1)
      continue
    }
    const next = argv[i + 1]
    if (BOOLEAN_FLAGS.has(body) || next === undefined || next.startsWith("--")) {
      flags[body] = true
      continue
    }
    flags[body] = next
    i++
  }
  return { positionals, flags }
}

function text(flags: Flags, name: string): string | undefined {
  const value = flags[name]
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined
}

function num(flags: Flags, name: string): number | undefined {
  const raw = text(flags, name)
  if (raw === undefined) return undefined
  const value = Number(raw)
  if (!Number.isFinite(value)) throw new CliError(EXIT.usage, `--${name} must be a number, got: ${raw}`)
  return value
}

function splitList(flags: Flags, name: string): string[] | undefined {
  const raw = text(flags, name)
  if (raw === undefined) return undefined
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "")
}

function required(flags: Flags, name: string, command: string): string {
  const value = text(flags, name)
  if (value === undefined) throw new CliError(EXIT.usage, `${command} requires --${name}`)
  return value
}

function render(value: unknown, flags: Flags): void {
  if (flags.json === true) {
    console.log(JSON.stringify(value, null, 2))
    return
  }
  if (flags.quiet === true) return
  if (typeof value === "string") {
    if (value !== "") console.log(value)
    return
  }
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (item === null || item === undefined) continue
    if (typeof item === "object") {
      console.log(`${key}:`)
      console.log(JSON.stringify(item, null, 2))
    } else {
      console.log(`${key}: ${String(item)}`)
    }
  }
}

function table(rows: Record<string, unknown>[], flags: Flags, columns?: string[]): void {
  if (flags.json === true) {
    console.log(JSON.stringify(rows, null, 2))
    return
  }
  if (rows.length === 0) {
    console.log("no rows")
    return
  }
  const keys = columns ?? Object.keys(rows[0])
  const cells = rows.map((row) => keys.map((key) => cell(row[key])))
  const widths = keys.map((key, index) =>
    Math.min(80, Math.max(key.length, ...cells.map((line) => line[index].length))),
  )
  const line = (values: string[]) =>
    values.map((value, index) => value.slice(0, widths[index]).padEnd(widths[index])).join("  ").trimEnd()
  console.log(line(keys))
  console.log(line(widths.map((width) => "-".repeat(width))))
  for (const values of cells) console.log(line(values))
}

function cell(value: unknown): string {
  if (value === null || value === undefined) return ""
  const raw = typeof value === "object" ? JSON.stringify(value) : String(value)
  return raw.replace(/\s+/g, " ").trim()
}

function refRow(ref: Reference, withExcerpt = false): Record<string, unknown> {
  const row: Record<string, unknown> = {
    name: ref.name,
    category: ref.category,
    file: `${ref.file}:${ref.startLine}`,
    id: ref.id,
  }
  if (withExcerpt) row.excerpt = ref.excerpt
  return row
}

async function requireIndex(paths: Paths): Promise<NonNullable<Awaited<ReturnType<typeof loadIndex>>>> {
  const index = await loadIndex(paths)
  if (!index) {
    throw new CliError(EXIT.failed, `no index at ${paths.index}; run "watch-ref scan" (or "watch-ref init") first`)
  }
  return index
}

function initConfig(root: string, flags: Flags): { created: boolean; configFile: string } {
  const file = configPath(root)
  if (existsSync(file) && flags.force !== true) return { created: false, configFile: file }
  // Only the fields a project usually changes; everything else comes from DEFAULT_CONFIG.
  const body = {
    version: 1,
    checks: [],
    dev: { command: null },
    visual: { capture: { screen: null, video: null } },
  }
  writeFileSync(file, JSON.stringify(body, null, 2) + "\n")
  return { created: true, configFile: file }
}

async function commandInit(root: string, cfg: Config, flags: Flags): Promise<number> {
  const result = initConfig(root, flags)
  const scan = await scanProject(root, cfg, { source: "init" })
  render({ configFile: result.configFile, created: result.created, ...statsSummary(scan.stats) }, flags)
  return EXIT.ok
}

async function commandScan(root: string, cfg: Config, flags: Flags): Promise<number> {
  const result = await scanProject(root, cfg, { force: flags.force === true, source: "cli" })
  render({ root, ...statsSummary(result.stats) }, flags)
  return EXIT.ok
}

async function commandWatch(root: string, cfg: Config, flags: Flags): Promise<number> {
  if (flags.once === true) {
    const result = await scanProject(root, cfg, { force: flags.force === true, source: "watch-once" })
    render({ root, ...statsSummary(result.stats) }, flags)
    return EXIT.ok
  }
  const watcher = await watchProject(root, cfg, {
    source: "watch",
    debounceMs: num(flags, "debounce"),
    pollIntervalMs: num(flags, "interval"),
    onUpdate: (update) => {
      if (flags.json === true) {
        console.log(JSON.stringify(update))
        return
      }
      if (flags.quiet === true) return
      const parts = [`${update.at}`, `${update.changed.length} change(s)`, `${update.references} ref(s)`]
      if (update.error) parts.push(`ERROR ${update.error}`)
      console.log(parts.join("  "))
    },
  })
  if (flags.quiet !== true) {
    process.stderr.write(
      `watch-ref: watching ${root} (pid ${watcher.lock.pid}, debounce ${num(flags, "debounce") ?? cfg.watch.debounceMs}ms)\n`,
    )
  }
  const shutdown = async () => {
    await watcher.close()
    process.exit(EXIT.ok)
  }
  process.on("SIGINT", () => void shutdown())
  process.on("SIGTERM", () => void shutdown())
  await new Promise(() => {})
  return EXIT.ok
}

async function commandServe(root: string, cfg: Config, flags: Flags): Promise<number> {
  const { runStdioServer } = await import("./mcp")
  await runStdioServer(root, { watch: flags["no-watch"] !== true })
  return EXIT.ok
}

async function commandStatus(root: string, cfg: Config, flags: Flags): Promise<number> {
  const paths = pathsFor(root, cfg)
  const [status, index, lock] = await Promise.all([loadStatus(paths), loadIndex(paths), Promise.resolve(readWatchLock(paths))])
  const astgrep = await astgrepVersion(root).catch(() => null)
  const value = {
    root,
    configFile: paths.configFile,
    outDir: paths.out,
    initialized: status !== null,
    state: status?.state ?? "uninitialized",
    lastScanAt: status?.lastScanAt ?? null,
    lastChangeAt: status?.lastChangeAt ?? null,
    lastError: status?.lastError ?? null,
    files: index ? Object.keys(index.files).length : 0,
    references: index?.refs.length ?? 0,
    categories: index ? byCategory(index) : {},
    watcher: {
      healthy: status?.watcher.healthy ?? false,
      startedAt: status?.watcher.startedAt ?? null,
      lastEventAt: status?.watcher.lastEventAt ?? null,
      pending: status?.watcher.pending ?? 0,
      lock: lock ? { pid: lock.pid, startedAt: lock.startedAt } : null,
    },
    astgrep,
  }
  render(value, flags)
  return EXIT.ok
}

async function commandSearch(root: string, cfg: Config, flags: Flags, args: string[]): Promise<number> {
  const query = args.join(" ").trim()
  if (!query) throw new CliError(EXIT.usage, "search requires a query, e.g. watch-ref search renderUser")
  const index = await requireIndex(pathsFor(root, cfg))
  const results = search(index, query, {
    category: text(flags, "category"),
    file: text(flags, "file"),
    limit: num(flags, "limit"),
  })
  if (flags.json === true) {
    console.log(JSON.stringify(results, null, 2))
  } else if (results.length === 0) {
    console.log(`no references match "${query}"`)
  } else {
    table(results.map((ref) => refRow(ref, true)), flags)
  }
  return EXIT.ok
}

function resolveTarget(index: Awaited<ReturnType<typeof loadIndex>>, target: string): Reference[] {
  if (!index) return []
  const direct = refById(index, target)
  if (direct) return [direct]
  const name = target.toLowerCase()
  const byName = index.refs.filter((ref) => ref.name.toLowerCase() === name)
  if (byName.length > 0) return byName
  const byFile = index.refs.filter((ref) => ref.file === target || ref.file.startsWith(`${target.replace(/\/$/, "")}/`))
  if (byFile.length > 0) return byFile
  return index.refs.filter((ref) => ref.name.toLowerCase().includes(name))
}

async function commandInspect(root: string, cfg: Config, flags: Flags, args: string[]): Promise<number> {
  const target = args.join(" ").trim()
  if (!target) throw new CliError(EXIT.usage, "inspect requires a name, file path, or reference id")
  const index = await requireIndex(pathsFor(root, cfg))
  const matches = resolveTarget(index, target)
  if (matches.length === 0) {
    throw new CliError(EXIT.failed, `no reference or file matches "${target}"; try "watch-ref search ${target}"`)
  }
  if (flags.json === true) {
    console.log(JSON.stringify(matches.length === 1 ? matches[0] : matches, null, 2))
    return EXIT.ok
  }
  if (matches.length > 1) {
    table(matches.slice(0, 50).map((ref) => refRow(ref)), flags)
    console.log(`${matches.length} match(es); pass an id from the table to see one reference in full`)
    return EXIT.ok
  }
  render(matches[0] as unknown as Record<string, unknown>, flags)
  return EXIT.ok
}

async function commandCheck(root: string, cfg: Config, flags: Flags, args: string[]): Promise<number> {
  const results: CheckResult[] = runChecks(root, cfg, args.length > 0 ? args : undefined)
  if (flags.json === true) {
    console.log(JSON.stringify(results, null, 2))
  } else if (results.length === 0) {
    console.log(`no checks configured in ${CONFIG_FILE}; add a checks[] entry such as {"name":"test","command":"bun test"}`)
  } else {
    table(
      results.map((result) => ({ name: result.name, exit: result.exitCode, command: result.command })),
      flags,
    )
    for (const result of results) {
      if (result.exitCode !== 0) console.log(`\n[${result.name}] exit ${result.exitCode}\n${result.output}`)
    }
  }
  return results.every((result) => result.exitCode === 0) ? EXIT.ok : EXIT.failed
}

async function commandReferences(root: string, cfg: Config, flags: Flags, args: string[]): Promise<number> {
  const index = await requireIndex(pathsFor(root, cfg))
  const action = args[0] ?? "list"
  if (action === "list") {
    const counts = byCategory(index)
    const rows = Object.entries(counts)
      .toSorted((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count }))
    table(rows, flags)
    console.log(`total: ${index.refs.length} reference(s) in ${Object.keys(index.files).length} file(s)`)
    return EXIT.ok
  }
  if (action === "show") {
    const category = args[1]
    if (!category) throw new CliError(EXIT.usage, "references show requires a category, e.g. references show function")
    const refs = index.refs.filter((ref) => ref.category === category)
    if (refs.length === 0) throw new CliError(EXIT.failed, `no references in category "${category}"`)
    table(refs.slice(0, num(flags, "limit") ?? 200).map((ref) => refRow(ref)), flags)
    console.log(`${refs.length} reference(s) in "${category}"`)
    return EXIT.ok
  }
  throw new CliError(EXIT.usage, `unknown references action "${action}" (expected list|show)`)
}

async function commandFeedback(root: string, cfg: Config, flags: Flags, args: string[]): Promise<number> {
  const paths = pathsFor(root, cfg)
  const action = args[0] ?? "list"
  const id = args[1]

  if (action === "list") {
    const status = text(flags, "status")
    const records = await listFeedback(paths, { status: status as never })
    table(
      records.map((record) => ({
        id: record.id,
        status: record.status,
        category: record.category,
        description: record.description,
      })),
      flags,
    )
    return EXIT.ok
  }

  if (action === "show") {
    if (!id) throw new CliError(EXIT.usage, "feedback show requires a feedback id")
    const record = await getFeedback(paths, id)
    if (!record) throw new CliError(EXIT.failed, `feedback not found: ${id}`)
    render(record as unknown as Record<string, unknown>, flags)
    return EXIT.ok
  }

  if (action === "create") {
    const record = await createFeedback(paths, {
      category: required(flags, "category", "feedback create"),
      description: required(flags, "description", "feedback create"),
      locations: splitList(flags, "locations"),
      referenceIds: splitList(flags, "refs"),
    })
    render({ id: record.id, status: record.status, createdAt: record.createdAt }, flags)
    return EXIT.ok
  }

  if (action === "update") {
    if (!id) throw new CliError(EXIT.usage, "feedback update requires a feedback id")
    const record = await updateFeedback(paths, id, {
      status: text(flags, "status") as never,
      description: text(flags, "description"),
      locations: splitList(flags, "locations"),
    })
    render({ id: record.id, status: record.status, updatedAt: record.updatedAt }, flags)
    return EXIT.ok
  }

  if (action === "fix") {
    if (!id) throw new CliError(EXIT.usage, "feedback fix requires a feedback id")
    const raw = required(flags, "ops", "feedback fix")
    let ops: FixOp[]
    let scope: string[] | undefined
    try {
      const parsed = JSON.parse(raw) as FixOp[] | { ops: FixOp[]; scope?: string[] }
      if (Array.isArray(parsed)) {
        ops = parsed
      } else {
        ops = parsed.ops
        scope = parsed.scope
      }
    } catch (err) {
      throw new CliError(EXIT.usage, `--ops must be JSON: ${(err as Error).message}`)
    }
    if (!Array.isArray(ops) || ops.length === 0) throw new CliError(EXIT.usage, "--ops must be a non-empty array")
    const record = await getFeedback(paths, id)
    if (!record) throw new CliError(EXIT.failed, `feedback not found: ${id}`)
    const plan = planFix(id, ops, scope ?? splitList(flags, "scope"))
    await saveFixPlan(paths, plan)
    render(
      {
        feedbackId: id,
        planPath: join(paths.feedback, `${id}.plan.json`),
        scope: plan.scope,
        ops: plan.ops.length,
        note: "plan saved; nothing was changed. Run \"watch-ref feedback apply <id> --yes\" to apply it.",
      },
      flags,
    )
    return EXIT.ok
  }

  if (action === "apply") {
    if (!id) throw new CliError(EXIT.usage, "feedback apply requires a feedback id")
    const plan = await loadFixPlan(paths, id)
    if (!plan) throw new CliError(EXIT.failed, `no fix plan for ${id}; run "watch-ref feedback fix ${id} --ops <json>" first`)
    const result = await applyFixPlan(root, paths, id, { authorize: flags.yes === true })
    render({ id, applied: result.applied, status: result.record.status, scope: result.record.fix?.scope ?? [] }, flags)
    return EXIT.ok
  }

  if (action === "verify") {
    if (!id) throw new CliError(EXIT.usage, "feedback verify requires a feedback id")
    const result = await verifyFeedback(root, cfg, paths, id)
    render(
      {
        id,
        status: result.record.status,
        verifiedAt: result.record.verifiedAt,
        exitCode: result.record.verification?.exitCode ?? "none",
        scanClean: result.record.verification?.scanClean ?? null,
        checks: result.results.map((check) => ({ name: check.name, exit: check.exitCode })),
      },
      flags,
    )
    return result.record.status === "verified" ? EXIT.ok : EXIT.failed
  }

  throw new CliError(EXIT.usage, `unknown feedback action "${action}" (expected list|show|create|update|fix|apply|verify)`)
}

const KIND_BY_COMMAND: Record<string, EvidenceKind> = { screen: "screen", videos: "video", runtime: "runtime" }

async function commandEvidence(root: string, cfg: Config, flags: Flags, command: string, args: string[]): Promise<number> {
  const paths = pathsFor(root, cfg)
  const kind = KIND_BY_COMMAND[command]
  const action = args[0] ?? "list"

  if (action === "list") {
    const items = await listEvidence(paths, kind)
    table(
      items.map((item) => ({
        id: item.id,
        label: item.label,
        file: item.file,
        bytes: item.bytes,
        capturedAt: item.capturedAt,
      })),
      flags,
    )
    return EXIT.ok
  }

  if (action === "capture" || action === "ingest") {
    if (kind === "runtime") {
      const source = args[1]
      if (!source) throw new CliError(EXIT.usage, "runtime capture requires a source file, e.g. runtime capture .watch-ref/dev/stdout.log --label server")
      const item = await captureRuntime(root, cfg, paths, { label: required(flags, "label", "runtime capture"), sourceFile: source })
      render(item as unknown as Record<string, unknown>, flags)
      return EXIT.ok
    }
    if (action === "ingest") {
      const source = args[1]
      if (!source) throw new CliError(EXIT.usage, `${command} ingest requires a source file`)
      const item = await ingestEvidence(root, cfg, paths, kind, source, { label: required(flags, "label", "ingest") })
      render(item as unknown as Record<string, unknown>, flags)
      return EXIT.ok
    }
    const label = args[1]
    if (!label) throw new CliError(EXIT.usage, `${command} capture requires a label, e.g. ${command} capture home-page`)
    const item = await captureEvidence(root, cfg, paths, kind, { label, command: text(flags, "command") })
    render(item as unknown as Record<string, unknown>, flags)
    return EXIT.ok
  }

  if (action === "prune") {
    const result = await pruneEvidence(root, cfg, paths, {
      retentionDays: num(flags, "days"),
      apply: flags.apply === true,
    })
    render(
      {
        dryRun: result.dryRun,
        retentionDays: result.retentionDays,
        removed: result.removed.length,
        kept: result.kept,
        files: result.removed.map((item) => item.file),
        note:
          result.dryRun && result.removed.length > 0
            ? "dry run: re-run with --apply to delete these files"
            : result.retentionDays <= 0
              ? "retention is off; pass --days N or set visual.retentionDays"
              : undefined,
      },
      flags,
    )
    return EXIT.ok
  }

  throw new CliError(EXIT.usage, `unknown ${command} action "${action}" (expected list|capture|ingest|prune)`)
}

async function commandDev(root: string, cfg: Config, flags: Flags, args: string[]): Promise<number> {
  const paths = pathsFor(root, cfg)
  const action = args[0] ?? "status"
  const opts = { command: text(flags, "command"), cwd: text(flags, "cwd") }

  if (action === "detect") {
    const command = await detectDevCommand(root, cfg)
    render({ command: command ?? null, note: command ? undefined : "no dev command detected; pass --command" }, flags)
    return command ? EXIT.ok : EXIT.failed
  }
  if (action === "start" || action === "ensure") {
    const result = action === "start" ? await startDev(root, cfg, paths, opts) : await ensureDev(root, cfg, paths, opts)
    render({ action: result.action, ...result.state }, flags)
    return EXIT.ok
  }
  if (action === "stop") {
    const result = await stopDev(root, paths)
    render({ stopped: result.stopped, ...result.state }, flags)
    return EXIT.ok
  }
  if (action === "restart") {
    const result = await restartDev(root, cfg, paths, opts)
    render({ action: result.action, ...result.state }, flags)
    return EXIT.ok
  }
  if (action === "status") {
    const status = await devStatus(paths)
    render(
      {
        running: status.running,
        pid: status.state.pid,
        command: status.state.command,
        startedAt: status.state.startedAt,
        restarts: status.state.restarts,
        logPath: status.logPath,
        errors: status.errors,
      },
      flags,
    )
    return status.running ? EXIT.ok : EXIT.failed
  }
  if (action === "logs") {
    const status = await devStatus(paths)
    const lines = num(flags, "lines") ?? 80
    const tail = readLogTail(status.logPath, lines)
    render(tail === "" ? `no log at ${status.logPath ?? "(not started)"}` : tail, flags)
    return EXIT.ok
  }
  throw new CliError(EXIT.usage, `unknown dev action "${action}" (expected start|stop|restart|status|logs|ensure|detect)`)
}

async function commandSkills(root: string, cfg: Config, flags: Flags, args: string[]): Promise<number> {
  const paths = pathsFor(root, cfg)
  const action = args[0] ?? "generate"
  if (action === "generate") {
    const written = generateSkills(paths)
    render({ outDir: paths.skills, skills: written.map((item) => item.path) }, flags)
    return EXIT.ok
  }
  if (action === "validate") {
    const { TOOL_NAMES } = await import("./mcp")
    const issues = validateSkills(paths, [...TOOL_NAMES])
    if (flags.json === true) {
      console.log(JSON.stringify({ issues }, null, 2))
    } else if (issues.length === 0) {
      console.log(`ok: every generated skill in ${paths.skills} is valid`)
    } else {
      table(
        issues.map((issue) => ({ skill: issue.skill, code: issue.code, message: issue.message })),
        flags,
      )
    }
    return issues.length === 0 ? EXIT.ok : EXIT.failed
  }
  throw new CliError(EXIT.usage, `unknown skills action "${action}" (expected generate|validate)`)
}

const COMMANDS: Record<string, { usage: string; summary: string; detail: string[] }> = {
  init: {
    usage: "init [--force] [--quiet]",
    summary: "Create watch-references.json and run the first scan",
    detail: ["Writes a minimal config (defaults stay in code) and indexes the project.", "Refuses to overwrite an existing config unless --force is passed."],
  },
  scan: {
    usage: "scan [--force]",
    summary: "Index the project once",
    detail: ["Only changed files are re-parsed unless --force is passed.", "Removed and renamed files are dropped in the same pass."],
  },
  watch: {
    usage: "watch [--once] [--debounce ms] [--interval ms]",
    summary: "Keep the index up to date as files change",
    detail: ["Holds .watch-references/watch.lock so two watchers cannot corrupt the index.", "Flushes pending changes on SIGINT/SIGTERM."],
  },
  serve: {
    usage: "serve [--no-watch]",
    summary: "Run the MCP server over stdio",
    detail: ["Resources: watchref://index, status, categories, feedback, changes, evidence, references/{category}.", "Use --no-watch when another process already runs watch-ref watch."],
  },
  status: {
    usage: "status",
    summary: "Show index counts, watcher health, and lock state",
    detail: [],
  },
  search: {
    usage: "search <query> [--category c] [--file path] [--limit n]",
    summary: "Search indexed references by text",
    detail: ["Matches name, kind, excerpt, and file path, case-insensitively."],
  },
  inspect: {
    usage: "inspect <name|file|id>",
    summary: "Show one reference with provenance, or list matches",
    detail: [],
  },
  check: {
    usage: "check [name...]",
    summary: "Run configured checks and exit non-zero on failure",
    detail: ["Checks come from checks[] in watch-references.json."],
  },
  references: {
    usage: "references [list|show <category>]",
    summary: "List category counts or references in one category",
    detail: [],
  },
  feedback: {
    usage: "feedback <list|show|create|update|fix|apply|verify> [...]",
    summary: "Record agent feedback and run the authorized fix loop",
    detail: [
      "create --category c --description text [--locations a,b] [--refs id1,id2]",
      "fix <id> --ops '<json>'        save a plan; does not touch source",
      "apply <id> --yes               apply the saved plan (requires --yes)",
      "verify <id>                    run checks and re-scan touched files",
    ],
  },
  screen: {
    usage: "screen <list|capture|ingest|prune> [...]",
    summary: "Manage screenshot evidence",
    detail: ["capture <label> [--command cmd]   cmd must write $WATCH_REF_EVIDENCE_PATH", "prune [--days n] [--apply]         dry run unless --apply"],
  },
  videos: {
    usage: "videos <list|capture|ingest|prune> [...]",
    summary: "Manage video evidence",
    detail: [],
  },
  runtime: {
    usage: "runtime <list|capture|prune> [...]",
    summary: "Manage runtime log evidence",
    detail: ["capture <file> --label name"],
  },
  dev: {
    usage: "dev <start|stop|restart|status|logs|ensure|detect> [--command cmd]",
    summary: "Keep one development server session across agent calls",
    detail: ["start reuses a live server instead of spawning a second one."],
  },
  skills: {
    usage: "skills <generate|validate>",
    summary: "Generate and validate the agent guides under .watch-references/skills",
    detail: ["validate checks frontmatter, section order, and that every tool name exists."],
  },
  help: {
    usage: "help [command]",
    summary: "Show this help",
    detail: [],
  },
}

function printHelp(command?: string): number {
  if (command && COMMANDS[command]) {
    const entry = COMMANDS[command]
    console.log(`watch-ref ${entry.usage}\n\n${entry.summary}\n`)
    for (const line of entry.detail) console.log(`  ${line}`)
    return EXIT.ok
  }
  if (command) throw new CliError(EXIT.usage, `unknown command "${command}"; run "watch-ref help"`)
  console.log("watch-ref — keep a searchable, provenance-carrying index of a project\n")
  console.log("Commands:")
  const pad = Math.max(...Object.values(COMMANDS).map((entry) => entry.usage.length))
  for (const entry of Object.values(COMMANDS)) {
    console.log(`  ${entry.usage.padEnd(pad)}  ${entry.summary}`)
  }
  console.log("\nGlobal options:")
  console.log("  --root <dir>  Project root (default: current directory)")
  console.log("  --json        Machine-readable output")
  console.log("  --quiet       Suppress human-readable output (init, scan, watch)")
  console.log("\nExit codes: 0 ok, 1 runtime or check failure, 2 usage or config error")
  console.log("\nExamples:")
  console.log("  watch-ref init")
  console.log("  watch-ref watch")
  console.log("  watch-ref search renderUser --category function --limit 10")
  console.log("  watch-ref serve")
  console.log("  watch-ref feedback verify fb-1234")
  return EXIT.ok
}

export async function main(argv: string[]): Promise<number> {
  const { positionals, flags } = parseArgs(argv)
  const [command, ...rest] = positionals
  if (command === undefined || command === "help") return printHelp(command === "help" ? rest[0] : undefined)
  if (flags.help === true) return printHelp(command)
  validateFlags(command, rest, flags)
  const root = projectRoot(text(flags, "root"))
  const cfg = loadConfig(root)

  switch (command) {
    case "init":
      return commandInit(root, cfg, flags)
    case "scan":
      return commandScan(root, cfg, flags)
    case "watch":
      return commandWatch(root, cfg, flags)
    case "serve":
      return commandServe(root, cfg, flags)
    case "status":
      return commandStatus(root, cfg, flags)
    case "search":
      return commandSearch(root, cfg, flags, rest)
    case "inspect":
      return commandInspect(root, cfg, flags, rest)
    case "check":
      return commandCheck(root, cfg, flags, rest)
    case "references":
      return commandReferences(root, cfg, flags, rest)
    case "feedback":
      return commandFeedback(root, cfg, flags, rest)
    case "screen":
    case "videos":
    case "runtime":
      return commandEvidence(root, cfg, flags, command, rest)
    case "dev":
      return commandDev(root, cfg, flags, rest)
    case "skills":
      return commandSkills(root, cfg, flags, rest)
    default:
      throw new CliError(EXIT.usage, `unknown command "${command}"; run "watch-ref help"`)
  }
}

if (import.meta.main) {
  try {
    process.exitCode = await main(process.argv.slice(2))
  } catch (err) {
    const code = err instanceof CliError ? err.exitCode : EXIT.failed
    process.stderr.write(`watch-ref: ${(err as Error).message}\n`)
    if (code === EXIT.usage) process.stderr.write(`run "watch-ref help" for usage\n`)
    process.exitCode = code
  }
}
