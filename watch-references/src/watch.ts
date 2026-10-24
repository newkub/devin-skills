import { existsSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { CliError, ensureDir, pathsFor, type Config, type Paths } from "./config"
import { listFiles, scanPaths } from "./scan"
import { updateStatus } from "./store"
import { pidAlive } from "./runproc"
import type { ChangeEntry } from "./types"

// Decision: polling instead of fs.watch. chokidar/fs.watch differ per platform, miss
// events on network drives, and cannot be tested deterministically. A stat poll of the
// already-filtered file list is portable, cheap for typical repos, and trivially testable.

const LOCK_FILE = "watch.lock"

// One writer per project: two watchers would race on index.json and the loser's refs would
// silently vanish. The lock is pid-guarded so a crashed watcher never blocks the next one.
export type WatchLock = { pid: number; startedAt: string }

function lockPath(paths: Paths): string {
  return join(paths.out, LOCK_FILE)
}

export function readWatchLock(paths: Paths): WatchLock | null {
  const file = lockPath(paths)
  if (!existsSync(file)) return null
  try {
    const raw = JSON.parse(readFileSync(file, "utf8")) as Partial<WatchLock>
    if (typeof raw.pid !== "number") return null
    return { pid: raw.pid, startedAt: raw.startedAt ?? "" }
  } catch {
    return null
  }
}

export function acquireWatchLock(paths: Paths): WatchLock {
  const existing = readWatchLock(paths)
  if (existing && existing.pid !== process.pid && pidAlive(existing.pid)) {
    throw new CliError(1, `another watcher is already running (pid ${existing.pid}, since ${existing.startedAt})`)
  }
  ensureDir(paths.out)
  const lock: WatchLock = { pid: process.pid, startedAt: new Date().toISOString() }
  writeFileSync(lockPath(paths), JSON.stringify(lock, null, 2) + "\n")
  return lock
}

export function releaseWatchLock(paths: Paths): void {
  const existing = readWatchLock(paths)
  if (!existing || existing.pid !== process.pid) return
  rmSync(lockPath(paths), { force: true })
}

export type IndexWatch = { stop: () => void; changed: () => boolean }

// The watcher owns index.json writes, but the MCP server may run in a different process
// (or alongside a watcher started elsewhere). Watching the file itself is what keeps both
// in step without a second lock.
export function watchIndex(paths: Paths, onChanged: () => void, intervalMs = 1000): IndexWatch {
  let last = mtime(paths.index)
  let seen = last
  let running = true
  const loop = (async () => {
    while (running) {
      await Bun.sleep(intervalMs)
      if (!running) break
      const now = mtime(paths.index)
      if (now === last) continue
      last = now
      seen = now
      try {
        onChanged()
      } catch (err) {
        process.stderr.write(`watch-ref: index change handler failed: ${(err as Error).message}\n`)
      }
    }
  })()
  return {
    stop: () => {
      running = false
      void loop
    },
    changed: () => seen !== mtime(paths.index),
  }
}

function mtime(path: string): number {
  try {
    return statSync(path).mtimeMs
  } catch {
    return 0
  }
}

export type Snapshot = Map<string, string>

export type WatchUpdate = {
  at: string
  detected: string[]
  changed: ChangeEntry[]
  references: number
  error: string | null
}

export type WatchHealth = {
  running: boolean
  healthy: boolean
  lastEventAt: string | null
  lastFlushAt: string | null
  pending: number
  ignored: number
  cycles: number
  errors: number
}

export type WatchOptions = {
  source?: string
  onUpdate?: (update: WatchUpdate) => void
  pollIntervalMs?: number
  debounceMs?: number
}

export type Watcher = {
  stop: () => void
  close: () => Promise<void>
  flush: () => Promise<WatchUpdate | null>
  poll: () => Promise<WatchUpdate | null>
  health: () => WatchHealth
  lock: WatchLock
}

export async function snapshot(root: string, cfg: Config): Promise<Snapshot> {
  const out: Snapshot = new Map()
  for (const rel of await listFiles(root, cfg)) {
    try {
      const st = statSync(resolve(root, rel))
      if (!st.isFile()) continue
      out.set(rel, `${st.mtimeMs}:${st.size}`)
    } catch {
      // The file vanished between listing and stat: the next poll reports it as removed.
    }
  }
  return out
}

export function diffSnapshots(prev: Snapshot, next: Snapshot): { changed: string[]; removed: string[] } {
  const changed: string[] = []
  const removed: string[] = []
  for (const [rel, sig] of next) {
    const before = prev.get(rel)
    if (before === undefined || before !== sig) changed.push(rel)
  }
  for (const rel of prev.keys()) if (!next.has(rel)) removed.push(rel)
  return { changed, removed }
}

export async function watchProject(root: string, cfg: Config, opts: WatchOptions = {}): Promise<Watcher> {
  const paths = pathsFor(root, cfg)
  const pollIntervalMs = opts.pollIntervalMs ?? cfg.watch.pollIntervalMs
  const debounceMs = opts.debounceMs ?? cfg.watch.debounceMs
  const source = opts.source ?? "watch"
  const outDir = cfg.outDir.split("\\").join("/").replace(/^\.\//, "")
  const lock = acquireWatchLock(paths)

  let running = true
  let prev = await snapshot(root, cfg)
  let pending = new Set<string>()
  let lastEventAt: string | null = null
  let lastEventMs = 0
  let lastFlushAt: string | null = null
  let cycles = 0
  let errors = 0
  let ignored = 0
  const startedAt = new Date().toISOString()

  await updateStatus(paths, (status) => {
    status.state = "watching"
    status.watcher = { healthy: true, startedAt, lastEventAt: null, pending: 0, ignored: 0 }
  })

  function isIgnored(rel: string): boolean {
    return outDir !== "" && (rel === outDir || rel.startsWith(`${outDir}/`))
  }

  async function flush(): Promise<WatchUpdate | null> {
    if (pending.size === 0) return null
    const rels = [...pending].toSorted()
    pending = new Set()
    let update: WatchUpdate
    try {
      const result = await scanPaths(root, cfg, rels, source)
      errors = 0
      lastFlushAt = new Date().toISOString()
      update = { at: lastFlushAt, detected: rels, changed: result.changed, references: result.references, error: null }
      await updateStatus(paths, (status) => {
        status.state = "watching"
        status.lastError = null
        status.watcher.healthy = true
        status.watcher.pending = 0
        status.watcher.lastEventAt = lastEventAt
      })
    } catch (err) {
      errors++
      const message = (err as Error).message
      update = { at: new Date().toISOString(), detected: rels, changed: [], references: 0, error: message }
      await updateStatus(paths, (status) => {
        status.state = errors >= 3 ? "error" : "watching"
        status.lastError = message
        status.watcher.healthy = errors < 3
        status.watcher.lastEventAt = lastEventAt
      })
    }
    opts.onUpdate?.(update)
    return update
  }

  async function poll(): Promise<WatchUpdate | null> {
    cycles++
    let next: Snapshot
    try {
      next = await snapshot(root, cfg)
    } catch (err) {
      errors++
      await updateStatus(paths, (status) => {
        status.state = errors >= 3 ? "error" : "watching"
        status.lastError = (err as Error).message
        status.watcher.healthy = errors < 3
      })
      return null
    }
    const delta = diffSnapshots(prev, next)
    prev = next
    for (const rel of [...delta.changed, ...delta.removed]) {
      if (isIgnored(rel)) {
        ignored++
        continue
      }
      pending.add(rel)
    }
    if (delta.changed.length + delta.removed.length > 0) {
      lastEventMs = Date.now()
      lastEventAt = new Date(lastEventMs).toISOString()
    }
    const quiet = Date.now() - lastEventMs >= debounceMs
    if (pending.size === 0) return null
    if (!quiet) {
      await updateStatus(paths, (status) => {
        status.watcher.pending = pending.size
      })
      return null
    }
    return flush()
  }

  const loop = (async () => {
    while (running) {
      await poll()
      if (!running) break
      await Bun.sleep(pollIntervalMs)
    }
  })()

  return {
    stop: () => {
      running = false
      releaseWatchLock(paths)
      void loop
    },
    close: async () => {
      running = false
      try {
        await flush()
      } catch (err) {
        process.stderr.write(`watch-ref: flush on shutdown failed: ${(err as Error).message}\n`)
      }
      releaseWatchLock(paths)
      void loop
    },
    flush,
    poll,
    lock,
    health: () => ({
      running,
      healthy: running && errors < 3,
      lastEventAt,
      lastFlushAt,
      pending: pending.size,
      ignored,
      cycles,
      errors,
    }),
  }
}
