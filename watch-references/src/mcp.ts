import { join } from "node:path"
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { astgrepVersion } from "./astgrep"
import { CliError, loadConfig, pathsFor, projectRoot, relPosix, requireInside, type Config, type Paths } from "./config"
import { devStatus, readLogTail } from "./devproc"
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
} from "./feedback"
import { scanProject, statsSummary } from "./scan"
import { generateSkills, validateSkills } from "./skills"
import {
  affectedBy,
  byCategory,
  loadIndex,
  loadLatestChanges,
  loadStatus,
  refById,
  search,
} from "./store"
import { CATEGORIES, type FeedbackStatus, type FixOp, type Reference } from "./types"
import { captureEvidence, captureRuntime, ingestEvidence, listEvidence, pruneEvidence } from "./visual"
import { readWatchLock, watchIndex, watchProject, type IndexWatch, type Watcher } from "./watch"

export const TOOL_NAMES = [
  "search_references",
  "inspect_symbol",
  "reference_details",
  "system_status",
  "refresh_references",
  "run_checks",
  "affected_references",
  "submit_feedback",
  "list_feedback",
  "get_feedback",
  "update_feedback",
  "request_fix",
  "apply_fix",
  "verify_fix",
  "list_evidence",
  "capture_screen",
  "capture_video",
  "ingest_evidence",
  "prune_evidence",
  "capture_runtime",
  "dev_status",
  "dev_logs",
  "skills_generate",
  "skills_validate",
] as const

const RESOURCE_URIS = {
  index: "watchref://index",
  status: "watchref://status",
  categories: "watchref://categories",
  feedback: "watchref://feedback",
  changes: "watchref://changes",
  evidence: "watchref://evidence",
} as const

export const RESOURCE_URI_LIST = Object.values(RESOURCE_URIS)

type ToolResult = { content: { type: "text"; text: string }[]; isError?: boolean }

function ok(value: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] }
}

function fail(err: unknown): ToolResult {
  const message = err instanceof Error ? err.message : String(err)
  return { content: [{ type: "text", text: message }], isError: true }
}

async function guarded(run: () => Promise<unknown> | unknown): Promise<ToolResult> {
  try {
    return ok(await run())
  } catch (err) {
    return fail(err)
  }
}

function describe(ref: Reference) {
  return {
    id: ref.id,
    category: ref.category,
    kind: ref.kind,
    name: ref.name,
    file: ref.file,
    language: ref.language,
    location: `${ref.file}:${ref.startLine}:${ref.startColumn + 1}`,
    lines: [ref.startLine, ref.endLine],
    columns: [ref.startColumn, ref.endColumn],
    excerpt: ref.excerpt,
    provenance: ref.provenance,
    meta: ref.meta ?? null,
  }
}

function resource(uri: string, value: unknown) {
  return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(value, null, 2) }] }
}

export type ServerOptions = { watch?: boolean }

export type ServerHandle = {
  server: McpServer
  root: string
  paths: Paths
  close: () => Promise<void>
}

/**
 * The MCP surface is a thin projection of the same core the CLI uses: every tool
 * reads or writes the index through the same store functions, so a CLI scan and a
 * tool call can never disagree about what a reference is.
 */
export async function createServer(rootArg?: string, opts: ServerOptions = {}): Promise<ServerHandle> {
  const root = projectRoot(rootArg)
  const cfg = loadConfig(root)
  const paths = pathsFor(root, cfg)
  const server = new McpServer({ name: "watch-references", version: "0.1.0" })

  async function index() {
    return (await loadIndex(paths)) ?? { version: 1, generatedAt: "", root, files: {}, refs: [] }
  }

  function notifyResources(): void {
    for (const uri of [RESOURCE_URIS.index, RESOURCE_URIS.status, RESOURCE_URIS.changes]) {
      try {
        void server.server.sendResourceUpdated({ uri }).catch(() => {})
      } catch {
        // Clients that did not subscribe still see fresh data on their next read.
      }
    }
  }

  async function summary() {
    const [status, idx, lock, astgrep] = await Promise.all([
      loadStatus(paths),
      loadIndex(paths),
      Promise.resolve(readWatchLock(paths)),
      astgrepVersion(root).catch(() => null),
    ])
    return {
      root,
      configFile: paths.configFile,
      initialized: status !== null,
      state: status?.state ?? "uninitialized",
      lastScanAt: status?.lastScanAt ?? null,
      lastChangeAt: status?.lastChangeAt ?? null,
      lastError: status?.lastError ?? null,
      files: idx ? Object.keys(idx.files).length : 0,
      references: idx?.refs.length ?? 0,
      categories: idx ? byCategory(idx) : {},
      watcher: {
        healthy: status?.watcher.healthy ?? false,
        startedAt: status?.watcher.startedAt ?? null,
        lastEventAt: status?.watcher.lastEventAt ?? null,
        pending: status?.watcher.pending ?? 0,
        lock: lock ? { pid: lock.pid, startedAt: lock.startedAt } : null,
      },
      astgrep,
    }
  }

  function relativeFile(file: string): string {
    const abs = requireInside(root, file)
    return relPosix(root, abs)
  }

  server.registerResource(
    "index",
    RESOURCE_URIS.index,
    { title: "Reference index", description: "Every extracted reference with provenance and source location", mimeType: "application/json" },
    async (uri) => resource(uri.href, await index()),
  )

  server.registerResource(
    "status",
    RESOURCE_URIS.status,
    { title: "Index status", description: "Watcher state, last successful scan, and index health", mimeType: "application/json" },
    async (uri) => resource(uri.href, await summary()),
  )

  server.registerResource(
    "categories",
    RESOURCE_URIS.categories,
    { title: "Categories", description: "Supported reference categories and how many of each are indexed", mimeType: "application/json" },
    async (uri) => {
      const idx = await index()
      const counts = byCategory(idx)
      return resource(
        uri.href,
        CATEGORIES.map((category) => ({ category, count: counts[category] ?? 0 })),
      )
    },
  )

  server.registerResource(
    "feedback",
    RESOURCE_URIS.feedback,
    { title: "Feedback", description: "Open and historical agent feedback records", mimeType: "application/json" },
    async (uri) => resource(uri.href, await listFeedback(paths)),
  )

  server.registerResource(
    "changes",
    RESOURCE_URIS.changes,
    { title: "Latest changes", description: "The most recent incremental scan result", mimeType: "application/json" },
    async (uri) => resource(uri.href, await loadLatestChanges(paths)),
  )

  server.registerResource(
    "evidence",
    RESOURCE_URIS.evidence,
    { title: "Evidence", description: "Screen, video, and runtime evidence captured for this project", mimeType: "application/json" },
    async (uri) => resource(uri.href, await listEvidence(paths)),
  )

  const referenceTemplate = new ResourceTemplate("watchref://references/{category}", {
    list: async () => {
      const idx = await loadIndex(paths)
      const counts = idx ? byCategory(idx) : {}
      return {
        resources: CATEGORIES.map((category) => ({
          name: `references:${category}`,
          uri: `watchref://references/${category}`,
          mimeType: "application/json",
          description: `${counts[category] ?? 0} ${category} reference(s)`,
        })),
      }
    },
  })

  server.registerResource(
    "references",
    referenceTemplate,
    { title: "References by category", description: "All references in one category", mimeType: "application/json" },
    async (uri, variables) => {
      const category = String(variables.category ?? "")
      if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
        throw new CliError(2, `unknown category "${category}" (expected ${CATEGORIES.join("|")})`)
      }
      const idx = await index()
      return resource(uri.href, idx.refs.filter((ref) => ref.category === category))
    },
  )

  server.registerTool(
    "search_references",
    {
      title: "Search references",
      description: "Find references by name, kind, excerpt, or file. Filter by category or file and cap the result count.",
      inputSchema: {
        query: z.string().describe("Case-insensitive text matched against name, kind, excerpt, and file").optional(),
        category: z.string().optional().describe(`One of: ${CATEGORIES.join(", ")}`),
        file: z.string().optional().describe("Project-relative file path"),
        limit: z.number().int().positive().max(500).optional().describe("Default 50"),
      },
    },
    (args) =>
      guarded(async () => {
        const idx = await index()
        const file = args.file ? relativeFile(args.file) : undefined
        const refs = search(idx, args.query ?? "", { category: args.category, file, limit: args.limit })
        return { query: args.query ?? "", count: refs.length, references: refs.map(describe) }
      }),
  )

  server.registerTool(
    "inspect_symbol",
    {
      title: "Inspect symbol",
      description: "Look up a named symbol (function, class, type, variable) with its exact source location and provenance.",
      inputSchema: {
        name: z.string().describe("Symbol name; exact match wins, otherwise a case-insensitive substring match"),
        file: z.string().optional().describe("Restrict to one project-relative file"),
        limit: z.number().int().positive().max(200).optional(),
      },
    },
    (args) =>
      guarded(async () => {
        const idx = await index()
        const file = args.file ? relativeFile(args.file) : undefined
        const pool = file ? idx.refs.filter((ref) => ref.file === file) : idx.refs
        const exact = pool.filter((ref) => ref.name === args.name)
        const matches = exact.length > 0 ? exact : pool.filter((ref) => ref.name.toLowerCase().includes(args.name.toLowerCase()))
        const limit = args.limit ?? 25
        return {
          name: args.name,
          file: file ?? null,
          exact: exact.length > 0,
          count: matches.length,
          references: matches.slice(0, limit).map(describe),
        }
      }),
  )

  server.registerTool(
    "reference_details",
    {
      title: "Reference details",
      description: "Fetch one reference by its id, including the full excerpt and provenance.",
      inputSchema: { id: z.string().describe("Reference id from search or inspect results") },
    },
    (args) =>
      guarded(async () => {
        const idx = await index()
        const ref = refById(idx, args.id)
        if (!ref) throw new CliError(2, `no reference with id ${args.id}; run search_references to find one`)
        return describe(ref)
      }),
  )

  server.registerTool(
    "system_status",
    {
      title: "System status",
      description: "Report index size, watcher health, lock owner, ast-grep availability, and the MCP surface version.",
      inputSchema: {},
    },
    () => guarded(async () => ({ ...(await summary()), resources: RESOURCE_URI_LIST, tools: TOOL_NAMES })),
  )

  server.registerTool(
    "refresh_references",
    {
      title: "Refresh references",
      description: "Re-scan the project and update the index. Use force to ignore content hashes and re-parse every file.",
      inputSchema: { force: z.boolean().optional() },
    },
    (args) =>
      guarded(async () => {
        const result = await scanProject(root, cfg, { force: args.force === true, source: "mcp" })
        notifyResources()
        return { stats: statsSummary(result.stats), changed: result.changes }
      }),
  )

  server.registerTool(
    "run_checks",
    {
      title: "Run checks",
      description: "Run the project checks configured in watch-references.json. Omit checks to run all of them.",
      inputSchema: { checks: z.array(z.string()).optional() },
    },
    (args) =>
      guarded(async () => {
        const results = runChecks(root, cfg, args.checks)
        return { passed: results.every((result) => result.exitCode === 0), results }
      }),
  )

  server.registerTool(
    "affected_references",
    {
      title: "Affected references",
      description: "List references defined in a file plus architecture references that point at it.",
      inputSchema: { file: z.string().describe("Project-relative file path") },
    },
    (args) =>
      guarded(async () => {
        const rel = relativeFile(args.file)
        const idx = await index()
        const { inside, dependents } = affectedBy(idx, rel)
        return { file: rel, inside: inside.map(describe), dependents: dependents.map(describe) }
      }),
  )

  server.registerTool(
    "submit_feedback",
    {
      title: "Submit feedback",
      description: "Record an observation about the code or the references. This never modifies source.",
      inputSchema: {
        category: z.string().describe("Observation category, for example correctness, docs, test, uxui"),
        description: z.string().describe("What is wrong or missing, and why it matters"),
        locations: z.array(z.string()).optional().describe("Project-relative files or file:line locations"),
        reference_ids: z.array(z.string()).optional(),
      },
    },
    (args) =>
      guarded(async () => {
        const locations = (args.locations ?? []).map(relativeFile)
        return createFeedback(paths, {
          category: args.category,
          description: args.description,
          locations,
          referenceIds: args.reference_ids,
        })
      }),
  )

  server.registerTool(
    "list_feedback",
    {
      title: "List feedback",
      description: "List feedback records, newest first, optionally filtered by status.",
      inputSchema: {
        status: z.enum(["open", "accepted", "fixed", "verified", "rejected", "wontfix"]).optional(),
      },
    },
    (args) => guarded(async () => listFeedback(paths, { status: args.status as FeedbackStatus | undefined })),
  )

  server.registerTool(
    "get_feedback",
    {
      title: "Get feedback",
      description: "Fetch one feedback record with its verification result and fix metadata.",
      inputSchema: { id: z.string() },
    },
    (args) =>
      guarded(async () => {
        const record = await getFeedback(paths, args.id)
        if (!record) throw new CliError(2, `feedback not found: ${args.id}`)
        return { record, fixPlan: await loadFixPlan(paths, args.id) }
      }),
  )

  server.registerTool(
    "update_feedback",
    {
      title: "Update feedback",
      description: "Change a feedback record's status or description. Statuses are open, accepted, fixed, verified, rejected, wontfix.",
      inputSchema: {
        id: z.string(),
        status: z.enum(["open", "accepted", "fixed", "verified", "rejected", "wontfix"]).optional(),
        description: z.string().optional(),
      },
    },
    (args) =>
      guarded(async () =>
        updateFeedback(paths, args.id, {
          status: args.status as FeedbackStatus | undefined,
          description: args.description,
        }),
      ),
  )

  server.registerTool(
    "request_fix",
    {
      title: "Request a fix",
      description:
        "Write a fix plan for a feedback record. Nothing is applied: inspect the plan, then call apply_fix with authorize=true to execute it.",
      inputSchema: {
        feedback_id: z.string(),
        scope: z.array(z.string()).optional().describe("Project-relative files the fix may touch; defaults to the op files"),
        ops: z
          .array(
            z.object({
              file: z.string().describe("Project-relative file path"),
              start_line: z.number().int().positive(),
              end_line: z.number().int().positive(),
              expected_text: z.string().describe("Exact current text; the apply step refuses a mismatch"),
              replacement: z.string().describe("Replacement text; empty string deletes the lines"),
            }),
          )
          .min(1),
      },
    },
    (args) =>
      guarded(async () => {
        const record = await getFeedback(paths, args.feedback_id)
        if (!record) throw new CliError(2, `feedback not found: ${args.feedback_id}`)
        const ops: FixOp[] = args.ops.map((op) => ({
          file: relativeFile(op.file),
          startLine: op.start_line,
          endLine: op.end_line,
          expectedText: op.expected_text,
          replacement: op.replacement,
        }))
        const scope = args.scope?.map(relativeFile)
        const plan = planFix(args.feedback_id, ops, scope)
        await saveFixPlan(paths, plan)
        if (record.status === "open") await updateFeedback(paths, args.feedback_id, { status: "accepted" })
        return { plan, planPath: join(paths.feedback, `${args.feedback_id}.plan.json`) }
      }),
  )

  server.registerTool(
    "apply_fix",
    {
      title: "Apply an authorized fix",
      description:
        "Apply a saved fix plan. Requires authorize=true, validates every operation and its scope first, and refuses on an expected-text mismatch.",
      inputSchema: {
        feedback_id: z.string(),
        authorize: z.boolean().describe("Must be true; the agent must have been asked to apply this plan"),
      },
    },
    (args) =>
      guarded(async () => {
        const result = await applyFixPlan(root, paths, args.feedback_id, { authorize: args.authorize === true })
        notifyResources()
        return result
      }),
  )

  server.registerTool(
    "verify_fix",
    {
      title: "Verify a fix",
      description:
        "Run the configured checks and re-scan the touched files. The record only becomes verified when both signals pass.",
      inputSchema: { feedback_id: z.string() },
    },
    (args) =>
      guarded(async () => {
        const result = await verifyFeedback(root, cfg, paths, args.feedback_id)
        return {
          status: result.record.status,
          verified: result.record.status === "verified",
          verification: result.record.verification,
          results: result.results,
        }
      }),
  )

  server.registerTool(
    "list_evidence",
    {
      title: "List evidence",
      description: "List captured screen, video, and runtime evidence with hashes and timestamps.",
      inputSchema: { kind: z.enum(["screen", "video", "runtime"]).optional() },
    },
    (args) => guarded(async () => listEvidence(paths, args.kind)),
  )

  server.registerTool(
    "capture_screen",
    {
      title: "Capture a screen",
      description:
        "Run the configured screen capture command. The command must write to WATCH_REF_EVIDENCE_PATH; a non-zero exit or a missing file fails.",
      inputSchema: {
        label: z.string().describe("Short human label for the evidence"),
        command: z.string().optional().describe("Override visual.capture.screen for this capture"),
      },
    },
    (args) => guarded(async () => captureEvidence(root, cfg, paths, "screen", { label: args.label, command: args.command })),
  )

  server.registerTool(
    "capture_video",
    {
      title: "Capture a video",
      description:
        "Run the configured video capture command. The command must write to WATCH_REF_EVIDENCE_PATH; a non-zero exit or a missing file fails.",
      inputSchema: {
        label: z.string().describe("Short human label for the evidence"),
        command: z.string().optional().describe("Override visual.capture.video for this capture"),
      },
    },
    (args) => guarded(async () => captureEvidence(root, cfg, paths, "video", { label: args.label, command: args.command })),
  )

  server.registerTool(
    "ingest_evidence",
    {
      title: "Ingest evidence",
      description: "Copy an existing screen or video artifact into the evidence store. It is hashed and never overwritten.",
      inputSchema: {
        kind: z.enum(["screen", "video"]),
        source: z.string().describe("Project-relative path to the artifact"),
        label: z.string(),
      },
    },
    (args) => guarded(async () => ingestEvidence(root, cfg, paths, args.kind, args.source, { label: args.label })),
  )

  server.registerTool(
    "capture_runtime",
    {
      title: "Capture runtime evidence",
      description: "Store a runtime trace or dump produced by the app itself. It becomes a runtime reference.",
      inputSchema: {
        label: z.string(),
        source: z.string().describe("Project-relative path to the runtime artifact"),
      },
    },
    (args) => guarded(async () => captureRuntime(root, cfg, paths, { label: args.label, sourceFile: args.source })),
  )

  server.registerTool(
    "prune_evidence",
    {
      title: "Prune evidence",
      description:
        "Remove evidence older than a retention window. Defaults to a dry run; pass apply=true to delete files and their references.",
      inputSchema: {
        days: z.number().positive().optional().describe("Retention window in days; defaults to visual.retentionDays"),
        apply: z.boolean().optional().describe("Delete for real; without it this is a dry run"),
      },
    },
    (args) => guarded(async () => pruneEvidence(root, cfg, paths, { retentionDays: args.days, apply: args.apply === true })),
  )

  server.registerTool(
    "dev_status",
    {
      title: "Dev server status",
      description: "Report the managed dev server process, its log path, and the last error-looking log lines.",
      inputSchema: {},
    },
    () => guarded(async () => devStatus(paths)),
  )

  server.registerTool(
    "dev_logs",
    {
      title: "Dev server logs",
      description: "Read the tail of the managed dev server log.",
      inputSchema: { lines: z.number().int().positive().max(500).optional().describe("Default 60") },
    },
    (args) =>
      guarded(async () => {
        const status = await devStatus(paths)
        return { logPath: status.logPath, running: status.running, tail: readLogTail(status.logPath, args.lines ?? 60) }
      }),
  )

  server.registerTool(
    "skills_generate",
    {
      title: "Generate agent skills",
      description: "Write the watch-references skill guides from the checked-in definitions.",
      inputSchema: {},
    },
    () => guarded(async () => ({ outDir: paths.skills, written: generateSkills(paths) })),
  )

  server.registerTool(
    "skills_validate",
    {
      title: "Validate agent skills",
      description: "Check the generated skill guides: frontmatter, section order, length, related links, and tool names.",
      inputSchema: {},
    },
    () => guarded(async () => ({ issues: validateSkills(paths, [...TOOL_NAMES]) })),
  )

  let watcher: Watcher | null = null
  let poller: IndexWatch | null = null
  if (opts.watch === true) {
    try {
      watcher = await watchProject(root, cfg, { source: "mcp", onUpdate: notifyResources })
    } catch (err) {
      process.stderr.write(
        `watch-ref: watcher unavailable (${(err as Error).message}); polling the index instead\n`,
      )
      poller = watchIndex(paths, notifyResources)
    }
  }

  return {
    server,
    root,
    paths,
    close: async () => {
      poller?.stop()
      if (watcher) await watcher.close()
    },
  }
}

export async function runStdioServer(rootArg?: string, opts: ServerOptions = {}): Promise<void> {
  const handle = await createServer(rootArg, opts)
  const transport = new StdioServerTransport()
  const shutdown = async () => {
    try {
      await handle.close()
      await handle.server.close()
    } finally {
      process.exit(0)
    }
  }
  process.on("SIGINT", () => void shutdown())
  process.on("SIGTERM", () => void shutdown())
  process.stderr.write(`watch-ref: MCP server ready on stdio (root ${handle.root})\n`)
  await handle.server.connect(transport)
}
