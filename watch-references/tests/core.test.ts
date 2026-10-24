import { afterAll, describe, expect, jest, test } from "bun:test"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  rmdirSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { tmpdir } from "node:os"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { astgrepVersion } from "../src/astgrep"
import {
  CliError,
  isInside,
  mergeConfig,
  pathsFor,
  requireInside,
  type Config,
  type Paths,
} from "../src/config"
import { detectDevCommand, devStatus, startDev, stopDev } from "../src/devproc"
import {
  applyFixPlan,
  createFeedback,
  listFeedback,
  loadFixPlan,
  planFix,
  runChecks,
  saveFixPlan,
  updateFeedback,
  verifyFeedback,
} from "../src/feedback"
import { createServer, TOOL_NAMES } from "../src/mcp"
import { pidAlive } from "../src/runproc"
import { listFiles, scanPaths, scanProject } from "../src/scan"
import { generateSkills, validateSkills } from "../src/skills"
import { loadIndex } from "../src/store"
import type { Index } from "../src/types"
import {
  captureEvidence,
  evidenceDir,
  ingestEvidence,
  listEvidence,
  pruneEvidence,
} from "../src/visual"
import {
  acquireWatchLock,
  readWatchLock,
  releaseWatchLock,
  watchIndex,
  watchProject,
} from "../src/watch"

jest.setTimeout(60_000)

const CLI = join(import.meta.dir, "..", "src", "cli.ts")
const ASTGREP = await astgrepVersion(process.cwd())
  .then(() => true)
  .catch(() => false)

const roots: string[] = []

afterAll(() => {
  for (const root of roots) {
    try {
      rmSync(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
    } catch {
      // A detached dev process may still hold its cwd; OS temp cleanup is not this suite's job.
    }
  }
})

// ---------------------------------------------------------------- fixtures

const APP = [
  'export const greeting = "hello"',
  "",
  "export function greet(name: string): string {",
  "  return `${greeting}, ${name}`",
  "}",
  "",
  "export class Greeter {",
  "  greet(who: string): string {",
  "    return greet(who)",
  "  }",
  "}",
  "",
].join("\n")

const USE = [
  'import { greet } from "./app"',
  "",
  "export function run(): string {",
  '  return greet("world")',
  "}",
  "",
].join("\n")

const PKG = [
  "{",
  '  "name": "fixture",',
  '  "scripts": {',
  '    "dev": "run-dev-here"',
  "  },",
  '  "retries": 3',
  "}",
  "",
].join("\n")

const README = "# Fixture project\n"

const BASE: Record<string, string> = {
  "src/app.ts": APP,
  "src/use.ts": USE,
  "package.json": PKG,
  "README.md": README,
}

type Fixture = {
  root: string
  cfg: Config
  paths: Paths
  write: (rel: string, text: string) => void
  read: (rel: string) => string
  remove: (rel: string) => void
}

function project(files: Record<string, string> = {}, config?: unknown): Fixture {
  const root = mkdtempSync(join(tmpdir(), "watch-ref-"))
  roots.push(root)
  const cfg = mergeConfig(config ?? null)

  const write = (rel: string, text: string) => {
    const abs = join(root, rel)
    mkdirSync(dirname(abs), { recursive: true })
    writeFileSync(abs, text)
  }
  for (const [rel, text] of Object.entries(files)) write(rel, text)

  return {
    root,
    cfg,
    paths: pathsFor(root, cfg),
    write,
    read: (rel: string) => readFileSync(join(root, rel), "utf8"),
    remove: (rel: string) => rmSync(join(root, rel), { force: true }),
  }
}

// ---------------------------------------------------------------- helpers

type CliRun = { code: number; stdout: string; stderr: string }

function runCli(root: string, args: string[], env: Record<string, string> = {}): CliRun {
  const res = Bun.spawnSync({
    cmd: [process.execPath, CLI, ...args],
    cwd: root,
    env: { ...process.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  })
  return {
    code: res.exitCode ?? -1,
    stdout: res.stdout.toString(),
    stderr: res.stderr.toString(),
  }
}

async function waitFor(predicate: () => boolean | Promise<boolean>, timeoutMs = 5000): Promise<void> {
  const deadline = Date.now() + timeoutMs
  for (;;) {
    if (await predicate()) return
    if (Date.now() > deadline) throw new Error("timed out waiting for condition")
    await Bun.sleep(25)
  }
}

function assertConsistent(index: Index): void {
  const ids = new Set<string>()
  const perFile = new Map<string, number>()
  for (const ref of index.refs) {
    expect(ids.has(ref.id)).toBe(false)
    ids.add(ref.id)
    perFile.set(ref.file, (perFile.get(ref.file) ?? 0) + 1)
    if (ref.category === "change") continue
    if (ref.category === "screen" || ref.category === "video" || ref.category === "runtime") continue
    const record = index.files[ref.file]
    expect(record).toBeDefined()
    expect(ref.provenance.fileHash).toBe(record.hash)
  }
  for (const [file, record] of Object.entries(index.files)) {
    expect(perFile.get(file) ?? 0).toBe(record.refs)
  }
}

function resourceJson(result: unknown): any {
  const contents = (result as { contents?: Array<{ text?: string }> }).contents
  const text = contents?.[0]?.text
  return text ? JSON.parse(text) : null
}

function toolText(result: unknown): string {
  const content = (result as { content?: Array<{ text?: string }> }).content
  return content?.[0]?.text ?? ""
}

function toolJson(result: unknown): any {
  const text = toolText(result)
  return text === "" ? null : JSON.parse(text)
}

function toolFailed(result: unknown): boolean {
  return (result as { isError?: boolean }).isError === true
}

async function withMcp<T>(root: string, run: (client: Client) => Promise<T>): Promise<T> {
  const handle = await createServer(root)
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  await handle.server.connect(serverTransport)
  const client = new Client({ name: "watch-ref-test", version: "1.0.0" })
  await client.connect(clientTransport)
  try {
    return await run(client)
  } finally {
    await client.close()
    await handle.close()
  }
}

const maybeTest = ASTGREP ? test : test.skip

// ---------------------------------------------------------------- extraction

describe("reference extraction", () => {
  test("indexes every file with a file reference, config keys, and provenance", async () => {
    const f = project(BASE)
    const first = await scanProject(f.root, f.cfg, { source: "test" })

    expect(Object.keys(first.index.files).toSorted()).toEqual([
      "README.md",
      "package.json",
      "src/app.ts",
      "src/use.ts",
    ])
    expect(first.stats.files).toBe(4)
    expect(first.stats.changed).toBe(4)
    expect(first.stats.removed).toBe(0)
    assertConsistent(first.index)

    for (const rel of Object.keys(first.index.files)) {
      const ref = first.index.refs.find((r) => r.file === rel && r.category === "file")
      expect(ref).toBeDefined()
      expect(ref?.startLine).toBe(1)
      expect(ref?.provenance.generator).toBe("watch-ref/file")
    }

    const configNames = first.index.refs
      .filter((r) => r.category === "config")
      .map((r) => r.name)
      .toSorted()
    expect(configNames).toEqual(["dev", "name", "retries", "scripts"])

    const syntax = first.index.refs.filter((r) => r.category === "diagnostic")
    expect(syntax).toEqual([])

    const files = await listFiles(f.root, f.cfg)
    expect(files).toEqual(["README.md", "package.json", "src/app.ts", "src/use.ts"])
  })

  maybeTest("extracts symbols, classes, variables, and import edges with ast-grep", async () => {
    const f = project(BASE)
    const { index } = await scanProject(f.root, f.cfg, { source: "test" })

    const greet = index.refs.find((r) => r.category === "function" && r.name === "greet")
    expect(greet?.file).toBe("src/app.ts")
    expect(greet?.startLine).toBe(3)
    expect(greet?.kind).toBe("function.function_declaration")
    expect(greet?.provenance.astgrepKind).toBe("function_declaration")
    expect(greet?.provenance.generator).toBe("watch-ref/astgrep")

    const greeting = index.refs.find((r) => r.category === "variable" && r.name === "greeting")
    expect(greeting?.startLine).toBe(1)

    const klass = index.refs.find((r) => r.category === "class" && r.name === "Greeter")
    expect(klass?.startLine).toBe(7)

    const method = index.refs.find((r) => r.category === "symbol" && r.name === "greet")
    expect(method?.startLine).toBe(8)
    expect(method?.kind).toBe("symbol.function")
    expect(method?.meta?.declaration).toBe("function")

    const importRef = index.refs.find((r) => r.category === "import" && r.file === "src/use.ts")
    expect(importRef?.name).toBe("./app")

    const edge = index.refs.find((r) => r.category === "architecture" && r.file === "src/use.ts")
    expect(edge?.meta?.target).toBe("src/app.ts")
    expect(edge?.meta?.resolved).toBe(true)
    expect(edge?.meta?.external).toBe(false)
  })

  test("keeps line numbers 1-based and reference ids unique", async () => {
    const f = project(BASE)
    const { index } = await scanProject(f.root, f.cfg, { source: "test" })
    expect(index.refs.every((ref) => ref.startLine >= 1 || ref.category === "change")).toBe(true)
    expect(new Set(index.refs.map((ref) => ref.id)).size).toBe(index.refs.length)
  })
})

// ---------------------------------------------------------------- parse errors

describe("parsing errors", () => {
  test("a syntactically broken file is recorded instead of aborting the scan", async () => {
    const f = project({ ...BASE, "src/broken.ts": "export function broken( {\n" })
    const result = await scanProject(f.root, f.cfg, { source: "test" })
    expect(result.stats.files).toBe(5)
    expect(result.index.files["src/broken.ts"]).toBeDefined()
    assertConsistent(result.index)
  })

  test("an unavailable analyzer produces one diagnostic per file, not one per kind", async () => {
    const f = project(BASE)
    const emptyBin = join(f.root, "bin")
    mkdirSync(emptyBin, { recursive: true })

    const res = runCli(f.root, ["scan", "--json"], { PATH: emptyBin, Path: emptyBin })
    expect(res.code).toBe(0)
    const stats = JSON.parse(res.stdout)
    expect(stats.astgrep).toBeNull()
    expect(String(stats.error)).toContain("ast-grep")
    expect(stats.diagnostics).toBe(2)

    const index = JSON.parse(readFileSync(f.paths.index, "utf8")) as Index
    assertConsistent(index)
    const diagnostics = index.refs.filter((r) => r.category === "diagnostic")
    expect(diagnostics.length).toBe(2)
    expect(diagnostics.map((r) => r.file).toSorted()).toEqual(["src/app.ts", "src/use.ts"])
    expect(diagnostics.every((r) => r.kind === "diagnostic.parse")).toBe(true)
    expect(diagnostics.every((r) => r.meta?.severity === "warning")).toBe(true)
    // files are still indexed, so a failed analyzer never hides the tree
    expect(Object.keys(index.files).length).toBe(4)
  })
})

// ---------------------------------------------------------------- incremental

describe("incremental updates", () => {
  test("an unchanged tree is reused instead of re-parsed", async () => {
    const f = project(BASE)
    const first = await scanProject(f.root, f.cfg, { source: "test" })
    const second = await scanProject(f.root, f.cfg, { source: "test" })

    expect(second.stats.changed).toBe(0)
    expect(second.stats.reused).toBe(4)
    expect(second.index.refs.length).toBe(first.index.refs.length)
    assertConsistent(second.index)

    f.write("src/app.ts", APP.replace('"hello"', '"hi"'))
    const incremental = await scanPaths(f.root, f.cfg, ["src/app.ts"], "test")
    expect(incremental.changed.length).toBe(1)
    expect(incremental.changed[0].path).toBe("src/app.ts")
    expect(incremental.changed[0].kind).toBe("modified")

    const forced = await scanProject(f.root, f.cfg, { force: true, source: "test" })
    expect(forced.stats.changed).toBe(4)
  })
})

// ---------------------------------------------------------------- deletion

describe("file deletion and renaming", () => {
  test("deleting a file drops its references and its record", async () => {
    const f = project(BASE)
    await scanProject(f.root, f.cfg, { source: "test" })
    f.remove("src/use.ts")

    const result = await scanProject(f.root, f.cfg, { source: "test" })
    expect(result.stats.removed).toBe(1)
    expect(result.index.files["src/use.ts"]).toBeUndefined()
    expect(result.index.refs.some((r) => r.file === "src/use.ts")).toBe(false)
    expect(result.changes).toContainEqual(expect.objectContaining({ path: "src/use.ts", kind: "removed" }))
    assertConsistent(result.index)
  })

  test("an incremental scan reports the removal", async () => {
    const f = project(BASE)
    await scanProject(f.root, f.cfg, { source: "test" })
    f.remove("src/use.ts")

    const result = await scanPaths(f.root, f.cfg, ["src/use.ts"], "test")
    expect(result.changed).toContainEqual(expect.objectContaining({ path: "src/use.ts", kind: "removed" }))
    const index = (await loadIndex(f.paths)) as Index
    expect(index.files["src/use.ts"]).toBeUndefined()
    assertConsistent(index)
  })

  maybeTest("renaming a file re-analyzes dependents so import edges stop resolving", async () => {
    const f = project(BASE)
    await scanProject(f.root, f.cfg, { source: "test" })
    renameSync(join(f.root, "src/app.ts"), join(f.root, "src/core.ts"))

    const result = await scanProject(f.root, f.cfg, { source: "test" })
    expect(result.changes).toContainEqual(expect.objectContaining({ path: "src/app.ts", kind: "removed" }))
    expect(result.changes).toContainEqual(expect.objectContaining({ path: "src/core.ts", kind: "added" }))
    // the dependent file's bytes never changed, but its edge target did
    expect(result.changes).toContainEqual(expect.objectContaining({ path: "src/use.ts", kind: "modified" }))

    const edge = result.index.refs.find((r) => r.category === "architecture" && r.file === "src/use.ts")
    expect(edge?.meta?.resolved).toBe(false)
    expect(edge?.meta?.target).toBe("")
    assertConsistent(result.index)
  })

  maybeTest("an incremental removal re-analyzes dependents in the same pass", async () => {
    const f = project(BASE)
    await scanProject(f.root, f.cfg, { source: "test" })
    f.remove("src/app.ts")

    await scanPaths(f.root, f.cfg, ["src/app.ts"], "test")
    const index = (await loadIndex(f.paths)) as Index
    const edge = index.refs.find((r) => r.category === "architecture" && r.file === "src/use.ts")
    expect(edge?.meta?.resolved).toBe(false)
    assertConsistent(index)
  })
})

// ---------------------------------------------------------------- stale refs

describe("stale reference cleanup", () => {
  maybeTest("renaming a symbol removes the old references instead of accumulating them", async () => {
    const f = project(BASE)
    const first = await scanProject(f.root, f.cfg, { source: "test" })
    expect(first.index.refs.filter((r) => r.file === "src/app.ts" && r.name === "greet").length).toBeGreaterThan(0)

    f.write("src/app.ts", APP.split("greet").join("hail"))
    await scanPaths(f.root, f.cfg, ["src/app.ts"], "test")

    const index = (await loadIndex(f.paths)) as Index
    expect(index.refs.some((r) => r.file === "src/app.ts" && r.name === "greet")).toBe(false)
    expect(index.refs.some((r) => r.file === "src/app.ts" && r.name === "hail")).toBe(true)
    assertConsistent(index)
  })

  test("references stay consistent across repeated changes and a final full scan", async () => {
    const f = project(BASE)
    await scanProject(f.root, f.cfg, { source: "test" })

    for (let i = 0; i < 4; i++) {
      f.write("src/extra.ts", `export function extra${i}(): number { return ${i} }\n`)
      await scanPaths(f.root, f.cfg, ["src/extra.ts"], "test")
      const index = (await loadIndex(f.paths)) as Index
      expect(index.files["src/extra.ts"]).toBeDefined()
      assertConsistent(index)
    }

    f.remove("src/extra.ts")
    const final = await scanProject(f.root, f.cfg, { source: "test" })
    expect(final.index.files["src/extra.ts"]).toBeUndefined()
    expect(final.index.refs.some((r) => r.file === "src/extra.ts")).toBe(false)
    assertConsistent(final.index)
  })
})

// ---------------------------------------------------------------- watcher

describe("watcher", () => {
  test("a live lock blocks a second watcher and a dead pid is reclaimed", async () => {
    const f = project({ "src/a.ts": "export const a = 1\n" })
    mkdirSync(f.paths.out, { recursive: true })
    const child = Bun.spawn([process.execPath, "-e", "setInterval(() => {}, 1000)"], {
      stdout: "ignore",
      stderr: "ignore",
    })
    try {
      await waitFor(() => pidAlive(child.pid))
      writeFileSync(
        join(f.paths.out, "watch.lock"),
        JSON.stringify({ pid: child.pid, startedAt: new Date().toISOString() }),
      )
      expect(() => acquireWatchLock(f.paths)).toThrow(/already running/)
    } finally {
      child.kill()
      await child.exited
    }
    await waitFor(() => !pidAlive(child.pid))

    writeFileSync(
      join(f.paths.out, "watch.lock"),
      JSON.stringify({ pid: child.pid, startedAt: new Date().toISOString() }),
    )
    const lock = acquireWatchLock(f.paths)
    expect(lock.pid).toBe(process.pid)
    releaseWatchLock(f.paths)
    expect(readWatchLock(f.paths)).toBeNull()
  })

  test("indexes creations and deletions and releases its lock on close", async () => {
    const f = project({ "src/a.ts": "export const a = 1\n" })
    await scanProject(f.root, f.cfg, { source: "test" })
    const watcher = await watchProject(f.root, f.cfg, {
      pollIntervalMs: 25,
      debounceMs: 10,
      source: "test",
    })
    try {
      f.write("src/new.ts", "export function created(): number { return 1 }\n")
      await waitFor(async () => (await loadIndex(f.paths))?.files["src/new.ts"] !== undefined)
      expect(watcher.health().errors).toBe(0)

      f.remove("src/new.ts")
      await waitFor(async () => (await loadIndex(f.paths))?.files["src/new.ts"] === undefined)
      expect(watcher.health().errors).toBe(0)
      expect(watcher.health().healthy).toBe(true)
    } finally {
      await watcher.close()
    }
    expect(readWatchLock(f.paths)).toBeNull()
  })

  test(
    "recovers after an index write failure",
    async () => {
      const f = project({ "src/a.ts": "export const a = 1\n" })
      await scanProject(f.root, f.cfg, { source: "test" })
      rmSync(f.paths.index, { force: true })
      mkdirSync(f.paths.index)

      const watcher = await watchProject(f.root, f.cfg, {
        pollIntervalMs: 25,
        debounceMs: 10,
        source: "test",
      })
      try {
        f.write("src/a.ts", "export const a = 2\n")
        await waitFor(() => watcher.health().errors > 0, 20000)
        // One failed write is tolerated; the watcher only reports error state at three.
        expect(watcher.health().healthy).toBe(true)

        rmdirSync(f.paths.index)
        f.write("src/a.ts", "export const a = 3\n")
        await waitFor(() => watcher.health().errors === 0 && existsSync(f.paths.index), 20000)
        const index = (await loadIndex(f.paths)) as Index
        expect(index.files["src/a.ts"]).toBeDefined()
        expect(watcher.health().healthy).toBe(true)
      } finally {
        await watcher.close()
      }
    },
    60000,
  )

  test(
    "watchIndex notices a rewritten index",
    async () => {
      const f = project({ "src/a.ts": "export const a = 1\n" })
      await scanProject(f.root, f.cfg, { source: "test" })
      const seen: number[] = []
      const watch = watchIndex(f.paths, () => seen.push(Date.now()), 20)
      try {
        await Bun.sleep(30)
        await scanProject(f.root, f.cfg, { force: true, source: "test" })
        await waitFor(() => seen.length > 0, 20000)
      } finally {
        watch.stop()
      }
    },
    60000,
  )
})

// ---------------------------------------------------------------- MCP

describe("MCP surface", () => {
  test("exposes every tool and resource over the same index", async () => {
    const f = project(BASE)
    await scanProject(f.root, f.cfg, { source: "test" })

    await withMcp(f.root, async (client) => {
      const tools = await client.listTools()
      expect(tools.tools.map((tool) => tool.name).toSorted()).toEqual([...TOOL_NAMES].toSorted())

      const resources = await client.listResources()
      const uris = resources.resources.map((resource) => String(resource.uri))
      expect(uris).toEqual(
        expect.arrayContaining([
          "watchref://index",
          "watchref://status",
          "watchref://categories",
          "watchref://changes",
          "watchref://feedback",
          "watchref://evidence",
        ]),
      )
      const templates = await client.listResourceTemplates()
      expect(templates.resourceTemplates.map((template) => template.uriTemplate)).toContain(
        "watchref://references/{category}",
      )

      const index = resourceJson(await client.readResource({ uri: "watchref://index" }))
      expect(Object.keys(index.files).length).toBe(4)
      const status = resourceJson(await client.readResource({ uri: "watchref://status" }))
      expect(status.references).toBe(index.refs.length)
      const categories = resourceJson(await client.readResource({ uri: "watchref://categories" }))
      expect(categories.find((row: any) => row.category === "file").count).toBe(4)
      await expect(client.readResource({ uri: "watchref://references/nope" })).rejects.toThrow()

      const search = toolJson(await client.callTool({ name: "search_references", arguments: { query: "README.md" } }))
      expect(search.count).toBeGreaterThan(0)
      const details = toolJson(
        await client.callTool({ name: "reference_details", arguments: { id: search.references[0].id } }),
      )
      expect(details.id).toBe(search.references[0].id)

      const affected = toolJson(
        await client.callTool({ name: "affected_references", arguments: { file: "src/app.ts" } }),
      )
      expect(affected.file).toBe("src/app.ts")
      expect(affected.inside.some((ref: any) => ref.category === "file")).toBe(true)

      const system = toolJson(await client.callTool({ name: "system_status", arguments: {} }))
      expect(system.tools.length).toBe(TOOL_NAMES.length)
      expect(system.resources.length).toBe(6)

      const refused = await client.callTool({ name: "search_references", arguments: { file: "../secret.txt" } })
      expect(toolFailed(refused)).toBe(true)

      const refreshed = toolJson(await client.callTool({ name: "refresh_references", arguments: {} }))
      expect(refreshed.stats.files).toBe(4)

      if (ASTGREP) {
        const symbol = toolJson(await client.callTool({ name: "inspect_symbol", arguments: { name: "greet" } }))
        expect(symbol.exact).toBe(true)
        expect(symbol.count).toBeGreaterThanOrEqual(2)
        expect(affected.dependents.some((ref: any) => ref.category === "architecture")).toBe(true)
      }
    })
  })

  test("feedback, fix, and verify tools never claim success early", async () => {
    const f = project(BASE)
    await scanProject(f.root, f.cfg, { source: "test" })

    await withMcp(f.root, async (client) => {
      const submitted = toolJson(
        await client.callTool({
          name: "submit_feedback",
          arguments: { category: "docs", description: "heading is stale", locations: ["README.md"] },
        }),
      )
      expect(submitted.status).toBe("open")
      const id = submitted.id as string
      expect(f.read("README.md")).toBe(README)

      const listed = toolJson(await client.callTool({ name: "list_feedback", arguments: {} }))
      expect(listed.map((record: any) => record.id)).toContain(id)

      const updated = toolJson(
        await client.callTool({ name: "update_feedback", arguments: { id, status: "accepted" } }),
      )
      expect(updated.status).toBe("accepted")

      const plan = toolJson(
        await client.callTool({
          name: "request_fix",
          arguments: {
            feedback_id: id,
            ops: [
              {
                file: "README.md",
                start_line: 1,
                end_line: 1,
                expected_text: "# Fixture project",
                replacement: "# Fixed project",
              },
            ],
          },
        }),
      )
      expect(plan.plan.ops.length).toBe(1)
      expect(plan.planPath).toContain(id)
      expect(f.read("README.md")).toBe(README)

      const refused = await client.callTool({ name: "apply_fix", arguments: { feedback_id: id, authorize: false } })
      expect(toolFailed(refused)).toBe(true)
      expect(f.read("README.md")).toBe(README)

      const applied = toolJson(
        await client.callTool({ name: "apply_fix", arguments: { feedback_id: id, authorize: true } }),
      )
      expect(applied.applied).toBe(1)
      expect(applied.record.status).toBe("fixed")
      expect(f.read("README.md").startsWith("# Fixed project")).toBe(true)

      const verified = toolJson(
        await client.callTool({ name: "verify_fix", arguments: { feedback_id: id } }),
      )
      expect(verified.status).toBe("fixed")
      expect(verified.verified).toBe(false)
      expect(verified.verification.scanClean).toBe(true)
      expect(verified.results).toEqual([])

      const got = toolJson(await client.callTool({ name: "get_feedback", arguments: { id } }))
      expect(got.record.status).toBe("fixed")
      expect(got.fixPlan.ops.length).toBe(1)
    })
  })
})

// ---------------------------------------------------------------- CLI

describe("CLI", () => {
  test("help, unknown flags, and missing arguments have predictable exit codes", () => {
    const f = project({ "src/a.ts": "export const a = 1\n" })

    const help = runCli(f.root, ["help"])
    expect(help.code).toBe(0)
    expect(help.stdout).toContain("watch-ref")
    expect(help.stdout).toContain("Exit codes")

    expect(runCli(f.root, ["help", "scan"]).code).toBe(0)
    const badHelp = runCli(f.root, ["help", "bogus"])
    expect(badHelp.code).toBe(2)
    expect(badHelp.stderr).toContain("unknown command")

    expect(runCli(f.root, ["bogus"]).code).toBe(2)

    const unknownFlag = runCli(f.root, ["scan", "--bogus"])
    expect(unknownFlag.code).toBe(2)
    expect(unknownFlag.stderr).toContain("unknown flag --bogus")

    expect(runCli(f.root, ["search"]).code).toBe(2)

    const noIndex = runCli(f.root, ["search", "anything"])
    expect(noIndex.code).toBe(1)
    expect(noIndex.stderr).toContain("no index")
  })

  test("init is idempotent and quiet mode prints nothing", () => {
    const f = project({ "src/a.ts": "export const a = 1\n" })

    const first = runCli(f.root, ["init", "--json"])
    expect(first.code).toBe(0)
    const firstOut = JSON.parse(first.stdout)
    expect(firstOut.created).toBe(true)
    expect(firstOut.files).toBe(2)
    expect(existsSync(join(f.root, "watch-references.json"))).toBe(true)

    const second = runCli(f.root, ["init", "--json"])
    expect(JSON.parse(second.stdout).created).toBe(false)

    const quiet = runCli(f.root, ["scan", "--quiet"])
    expect(quiet.code).toBe(0)
    expect(quiet.stdout.trim()).toBe("")

    const status = runCli(f.root, ["status", "--json"])
    expect(status.code).toBe(0)
    const statusOut = JSON.parse(status.stdout)
    expect(statusOut.initialized).toBe(true)
    expect(statusOut.files).toBeGreaterThanOrEqual(2)
  })
})

// ---------------------------------------------------------------- feedback

describe("feedback lifecycle", () => {
  test("moves between statuses and rejects an invalid one", async () => {
    const f = project(BASE)
    const record = await createFeedback(f.paths, {
      category: "docs",
      description: "stale docs",
      locations: ["README.md"],
    })
    expect(record.status).toBe("open")
    expect(record.locations).toEqual(["README.md"])

    const accepted = await updateFeedback(f.paths, record.id, { status: "accepted" })
    expect(accepted.status).toBe("accepted")

    await expect(updateFeedback(f.paths, record.id, { status: "bogus" as never })).rejects.toThrow(
      /invalid feedback status/,
    )

    const listed = await listFeedback(f.paths, { status: "accepted" })
    expect(listed.map((item) => item.id)).toContain(record.id)
    expect(await listFeedback(f.paths, { status: "verified" })).toEqual([])
  })

  test("an unauthorized fix is refused and an authorized one validates preconditions", async () => {
    const f = project(BASE)
    await scanProject(f.root, f.cfg, { source: "test" })
    const record = await createFeedback(f.paths, {
      category: "docs",
      description: "fix heading",
      locations: ["README.md"],
    })
    await saveFixPlan(
      f.paths,
      planFix(record.id, [
        {
          file: "README.md",
          startLine: 1,
          endLine: 1,
          expectedText: "# Fixture project",
          replacement: "# Fixture project (fixed)",
        },
      ]),
    )

    await expect(applyFixPlan(f.root, f.paths, record.id, { authorize: false })).rejects.toThrow(/authorization/)
    expect(f.read("README.md")).toBe(README)

    const applied = await applyFixPlan(f.root, f.paths, record.id, { authorize: true })
    expect(applied.applied).toBe(1)
    expect(applied.record.status).toBe("fixed")
    expect(applied.record.fix?.authorized).toBe(true)
    expect(f.read("README.md").startsWith("# Fixture project (fixed)")).toBe(true)

    // the plan stays readable after apply, but applying it twice fails the precondition
    expect(await loadFixPlan(f.paths, record.id)).not.toBeNull()
    await expect(applyFixPlan(f.root, f.paths, record.id, { authorize: true })).rejects.toThrow(/precondition/)
  })

  test("a fix cannot leave its scope or the project root", async () => {
    const f = project(BASE)
    const record = await createFeedback(f.paths, {
      category: "docs",
      description: "scope test",
      locations: ["README.md"],
    })

    await saveFixPlan(
      f.paths,
      planFix(
        record.id,
        [
          {
            file: "src/app.ts",
            startLine: 1,
            endLine: 1,
            expectedText: 'export const greeting = "hello"',
            replacement: 'export const greeting = "hi"',
          },
        ],
        ["README.md"],
      ),
    )
    await expect(applyFixPlan(f.root, f.paths, record.id, { authorize: true })).rejects.toThrow(
      /outside plan scope/,
    )

    await saveFixPlan(
      f.paths,
      planFix(
        record.id,
        [{ file: "../escape.ts", startLine: 1, endLine: 1, expectedText: "x", replacement: "y" }],
        ["../escape.ts"],
      ),
    )
    await expect(applyFixPlan(f.root, f.paths, record.id, { authorize: true })).rejects.toThrow(
      /escapes project root/,
    )
    expect(f.read("src/app.ts")).toBe(APP)
  })

  test("rejected feedback refuses to apply", async () => {
    const f = project(BASE)
    const record = await createFeedback(f.paths, {
      category: "docs",
      description: "reject me",
      locations: ["README.md"],
    })
    await saveFixPlan(
      f.paths,
      planFix(record.id, [
        {
          file: "README.md",
          startLine: 1,
          endLine: 1,
          expectedText: "# Fixture project",
          replacement: "# X",
        },
      ]),
    )
    await updateFeedback(f.paths, record.id, { status: "rejected" })
    await expect(applyFixPlan(f.root, f.paths, record.id, { authorize: true })).rejects.toThrow(/reopen/)
    expect(f.read("README.md")).toBe(README)
  })

  test("an unknown check name is a usage error", () => {
    const f = project(BASE)
    expect(() => runChecks(f.root, f.cfg, ["nope"])).toThrow(/unknown check/)
  })
})

// ---------------------------------------------------------------- verification

describe("verification results", () => {
  test("only a configured, passing check can mark a fix verified", async () => {
    const f = project({
      ...BASE,
      "tools/check-pass.ts": "process.exit(0)\n",
      "tools/check-fail.ts": "process.exit(1)\n",
    })
    await scanProject(f.root, f.cfg, { source: "test" })
    const record = await createFeedback(f.paths, {
      category: "docs",
      description: "verify me",
      locations: ["README.md"],
    })
    await saveFixPlan(
      f.paths,
      planFix(record.id, [
        {
          file: "README.md",
          startLine: 1,
          endLine: 1,
          expectedText: "# Fixture project",
          replacement: "# Fixture project!",
        },
      ]),
    )
    await applyFixPlan(f.root, f.paths, record.id, { authorize: true })

    const noChecks = await verifyFeedback(f.root, f.cfg, f.paths, record.id)
    expect(noChecks.record.status).toBe("fixed")
    expect(noChecks.record.verification?.output).toBe("no checks configured")
    expect(noChecks.record.verification?.scanClean).toBe(true)
    expect(noChecks.record.verifiedAt).toBeNull()

    const passing = mergeConfig({
      checks: [{ name: "pass", command: `${process.execPath} tools/check-pass.ts`, cwd: null }],
    })
    const verified = await verifyFeedback(f.root, passing, f.paths, record.id)
    expect(verified.record.status).toBe("verified")
    expect(verified.record.verifiedAt).not.toBeNull()
    expect(verified.record.verification?.exitCode).toBe(0)
    expect(verified.results.length).toBe(1)

    const failing = mergeConfig({
      checks: [{ name: "fail", command: `${process.execPath} tools/check-fail.ts`, cwd: null }],
    })
    const failed = await verifyFeedback(f.root, failing, f.paths, record.id)
    expect(failed.record.status).toBe("fixed")
    expect(failed.record.verification?.exitCode).toBe(1)
    expect(failed.record.verifiedAt).toBeNull()
  })
})

// ---------------------------------------------------------------- evidence

describe("visual evidence and path safety", () => {
  test("capture requires a command that actually writes the evidence path", async () => {
    const f = project({
      ...BASE,
      "tools/shot.ts":
        "const target = process.env.WATCH_REF_EVIDENCE_PATH\nif (!target) process.exit(2)\nawait Bun.write(target, \"png-bytes\")\n",
      "tools/noop.ts": 'console.log("nothing")\n',
      "tools/fail.ts": "process.exit(3)\n",
    })
    await scanProject(f.root, f.cfg, { source: "test" })

    await expect(captureEvidence(f.root, f.cfg, f.paths, "screen", { label: "no-command" })).rejects.toThrow(
      /no capture command/,
    )
    await expect(
      captureEvidence(f.root, f.cfg, f.paths, "screen", {
        label: "noop",
        command: `${process.execPath} tools/noop.ts`,
      }),
    ).rejects.toThrow(/did not write/)
    await expect(
      captureEvidence(f.root, f.cfg, f.paths, "screen", {
        label: "fail",
        command: `${process.execPath} tools/fail.ts`,
      }),
    ).rejects.toThrow(/capture command failed/)

    const evidence = await captureEvidence(f.root, f.cfg, f.paths, "screen", {
      label: "home page",
      command: `${process.execPath} tools/shot.ts`,
    })
    expect(evidence.kind).toBe("screen")
    expect(evidence.bytes).toBeGreaterThan(0)
    expect(existsSync(join(f.root, evidence.file))).toBe(true)
    expect((await listEvidence(f.paths, "screen")).map((item) => item.id)).toContain(evidence.id)

    const index = (await loadIndex(f.paths)) as Index
    const ref = index.refs.find((item) => item.category === "screen")
    expect(ref?.name).toBe("home page")
    expect(ref?.kind).toBe("screenshot")
    expect(ref?.provenance.generator).toBe("visual")

    // a full scan must not treat an evidence artifact as a deleted source file
    const rescanned = await scanProject(f.root, f.cfg, { source: "test" })
    expect(rescanned.index.refs.some((item) => item.category === "screen" && item.file === evidence.file)).toBe(
      true,
    )
    assertConsistent(rescanned.index)
  })

  test("ingest copies without overwriting and refuses paths outside the root", async () => {
    const f = project({ ...BASE, "assets/extra.png": "png-one" })
    const one = await ingestEvidence(f.root, f.cfg, f.paths, "screen", "assets/extra.png", { label: "extra" })
    const two = await ingestEvidence(f.root, f.cfg, f.paths, "screen", "assets/extra.png", { label: "extra" })

    expect(two.file).not.toBe(one.file)
    expect(one.source).toBe("assets/extra.png")
    expect(existsSync(join(f.root, one.file))).toBe(true)
    expect(existsSync(join(f.root, two.file))).toBe(true)

    await expect(
      ingestEvidence(f.root, f.cfg, f.paths, "screen", "../outside.png", { label: "x" }),
    ).rejects.toThrow(/escapes project root/)
    await expect(
      ingestEvidence(f.root, f.cfg, f.paths, "screen", "assets/missing.png", { label: "x" }),
    ).rejects.toThrow(/not found/)
  })

  test("prune defaults to a dry run and needs both a window and apply", async () => {
    const f = project({ ...BASE, "assets/extra.png": "png-one" })
    await scanProject(f.root, f.cfg, { source: "test" })
    const evidence = await ingestEvidence(f.root, f.cfg, f.paths, "screen", "assets/extra.png", { label: "old" })

    const manifestPath = join(f.paths.visual, "manifest.json")
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
    manifest.evidence[0].capturedAt = "2020-01-01T00:00:00.000Z"
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

    const off = await pruneEvidence(f.root, f.cfg, f.paths, { retentionDays: 0, apply: true })
    expect(off.removed).toEqual([])
    expect(existsSync(join(f.root, evidence.file))).toBe(true)

    const dry = await pruneEvidence(f.root, f.cfg, f.paths, { retentionDays: 1 })
    expect(dry.dryRun).toBe(true)
    expect(dry.removed.map((item) => item.id)).toEqual([evidence.id])
    expect(existsSync(join(f.root, evidence.file))).toBe(true)

    const applied = await pruneEvidence(f.root, f.cfg, f.paths, { retentionDays: 1, apply: true })
    expect(applied.dryRun).toBe(false)
    expect(applied.removed.map((item) => item.id)).toEqual([evidence.id])
    expect(existsSync(join(f.root, evidence.file))).toBe(false)
    expect(((await loadIndex(f.paths)) as Index).refs.some((ref) => ref.category === "screen")).toBe(false)
  })

  test("path helpers reject anything outside the project root", () => {
    const f = project({})
    expect(isInside(f.root, join(f.root, "src"))).toBe(true)
    expect(isInside(f.root, join(f.root, ".."))).toBe(false)
    expect(() => requireInside(f.root, "../escape.ts")).toThrow(CliError)
    expect(() => requireInside(f.root, "../escape.ts")).toThrow(/escapes project root/)
    expect(() => evidenceDir(f.root, mergeConfig({ visual: { screensDir: "../screens" } }), "screen")).toThrow(
      /escapes project root/,
    )
  })
})

// ---------------------------------------------------------------- dev process

describe("persistent dev process", () => {
  test("detects the project command and reuses one running process", async () => {
    const f = project({
      "package.json": JSON.stringify({ name: "devfixture", scripts: { dev: "run-dev-here" } }, null, 2) + "\n",
      "bun.lock": "",
      "tools/dev-server.ts": "await Bun.sleep(10_000)\n",
    })
    expect(await detectDevCommand(f.root, f.cfg)).toBe("bun run dev")

    const command = `${process.execPath} tools/dev-server.ts`
    const started = await startDev(f.root, f.cfg, f.paths, { command })
    expect(started.action).toBe("started")
    try {
      expect(pidAlive(started.state.pid)).toBe(true)

      const again = await startDev(f.root, f.cfg, f.paths, { command })
      expect(again.action).toBe("reused")
      expect(again.state.pid).toBe(started.state.pid)

      const status = await devStatus(f.paths)
      expect(status.running).toBe(true)
      expect(status.logPath).not.toBeNull()
    } finally {
      const stopped = await stopDev(f.root, f.paths)
      expect(stopped.stopped).toBe(true)
    }
    expect((await devStatus(f.paths)).running).toBe(false)
  })

  test("refuses to start when no command can be detected", async () => {
    const f = project({ "README.md": "# empty\n" })
    expect(await detectDevCommand(f.root, f.cfg)).toBeNull()
    await expect(startDev(f.root, f.cfg, f.paths)).rejects.toThrow(/no dev command/)
  })
})

// ---------------------------------------------------------------- skills

describe("generated skill guides", () => {
  test("generate three guides and validate them against the real tool list", () => {
    const f = project({})
    const written = generateSkills(f.paths)
    expect(written.map((item) => item.name).toSorted()).toEqual([
      "watch-references",
      "watch-references-feedback",
      "watch-references-maintenance",
    ])
    expect(validateSkills(f.paths, [...TOOL_NAMES])).toEqual([])

    const path = join(f.paths.skills, "watch-references", "SKILL.md")
    const text = readFileSync(path, "utf8").split("`search_references`").join("`not_a_tool`")
    writeFileSync(path, `${text}\n**bold**\n`)

    const codes = validateSkills(f.paths, [...TOOL_NAMES]).map((issue) => issue.code)
    expect(codes).toContain("tools")
    expect(codes).toContain("bold")
  })
})
