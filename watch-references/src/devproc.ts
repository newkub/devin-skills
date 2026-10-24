import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { CliError, ensureDir, readJson, relPosix, requireInside, type Config, type Paths } from "./config"
import { pidAlive, runShell, spawnDetached } from "./runproc"
import { atomicWriteJson } from "./store"
import type { DevState } from "./types"

// Decision: the dev server is a long-lived process the agent starts once and reuses.
// Its pid + log path live in the state file, so every later command can answer "is it
// still up?" without the original terminal.

const STATE = "state.json"
const SCRIPT_ORDER = ["dev", "start", "serve", "watch"]
const LOCKFILES: [string, string][] = [
  ["bun.lock", "bun run"],
  ["bun.lockb", "bun run"],
  ["pnpm-lock.yaml", "pnpm run"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm run"],
]

export type DevStatus = {
  state: DevState
  running: boolean
  logPath: string | null
  logTail: string
  errors: string[]
}

function statePath(paths: Paths): string {
  return join(paths.dev, STATE)
}

export function emptyDevState(): DevState {
  return {
    pid: null,
    command: null,
    cwd: null,
    startedAt: null,
    logPath: null,
    exitCode: null,
    restarts: 0,
  }
}

export async function loadDevState(paths: Paths): Promise<DevState> {
  return (await readJson<DevState>(statePath(paths))) ?? emptyDevState()
}

export async function saveDevState(paths: Paths, state: DevState): Promise<DevState> {
  ensureDir(paths.dev)
  await atomicWriteJson(statePath(paths), state)
  return state
}

/**
 * Explicit config wins. Otherwise the project's own package manager runs its standard
 * script, so the reported command is one the user could type themselves.
 */
export async function detectDevCommand(root: string, cfg: Config): Promise<string | null> {
  if (cfg.dev.command) return cfg.dev.command
  const pkg = await readJson<{ scripts?: Record<string, string> }>(join(root, "package.json"))
  if (pkg?.scripts) {
    const script = SCRIPT_ORDER.find((name) => typeof pkg.scripts?.[name] === "string")
    if (script) {
      const runner = LOCKFILES.find(([file]) => existsSync(join(root, file)))?.[1] ?? "bun run"
      return `${runner} ${script}`
    }
  }
  if (existsSync(join(root, "Cargo.toml"))) return "cargo run"
  return null
}

function resolveCwd(root: string, cfg: Config, explicit?: string): string {
  const raw = explicit ?? cfg.dev.cwd ?? "."
  return requireInside(root, raw)
}

function newLogPath(paths: Paths): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  return join(paths.dev, `dev-${stamp}.log`)
}

async function launch(
  root: string,
  cfg: Config,
  paths: Paths,
  state: DevState,
  opts: { command?: string; cwd?: string },
): Promise<DevState> {
  const command = (opts.command ?? cfg.dev.command ?? (await detectDevCommand(root, cfg)))?.trim()
  if (!command) {
    throw new CliError(2, "no dev command detected; set dev.command in watch-references.json or pass --command")
  }
  const cwd = resolveCwd(root, cfg, opts.cwd)
  if (!existsSync(cwd)) throw new CliError(2, `dev cwd does not exist: ${opts.cwd ?? cfg.dev.cwd ?? "."}`)

  ensureDir(paths.dev)
  const logPath = newLogPath(paths)
  const { pid } = spawnDetached(command, { cwd, logPath })
  if (pid === null) throw new CliError(1, `failed to spawn dev command: ${command}`)

  // Give a command that dies immediately (bad script, port in use) a chance to fail here
  // rather than surfacing as a healthy pid that is already gone.
  await Bun.sleep(400)
  if (!pidAlive(pid)) {
    const tail = readLogTail(logPath)
    throw new CliError(1, `dev command exited immediately: ${command}\n${tail}`.trim())
  }

  return {
    ...state,
    pid,
    command,
    cwd: relPosix(root, cwd) || ".",
    startedAt: new Date().toISOString(),
    logPath,
    exitCode: null,
  }
}

export async function startDev(
  root: string,
  cfg: Config,
  paths: Paths,
  opts: { command?: string; cwd?: string } = {},
): Promise<{ state: DevState; action: "started" | "reused" }> {
  const current = await loadDevState(paths)
  if (pidAlive(current.pid)) return { state: current, action: "reused" }
  const state = await launch(root, cfg, paths, { ...current, pid: null }, opts)
  await saveDevState(paths, state)
  return { state, action: "started" }
}

export async function stopDev(root: string, paths: Paths): Promise<{ state: DevState; stopped: boolean }> {
  const state = await loadDevState(paths)
  if (!pidAlive(state.pid) || state.pid === null) {
    const next = { ...state, pid: null }
    await saveDevState(paths, next)
    return { state: next, stopped: false }
  }

  try {
    process.kill(state.pid, "SIGTERM")
  } catch {}
  for (let i = 0; i < 30; i++) {
    if (!pidAlive(state.pid)) break
    await Bun.sleep(100)
  }
  if (pidAlive(state.pid)) {
    if (process.platform === "win32") {
      runShell(`taskkill /pid ${state.pid} /T /F`, { cwd: root })
    } else {
      try {
        process.kill(state.pid, "SIGKILL")
      } catch {}
    }
    await Bun.sleep(200)
  }

  const next = { ...state, pid: null, exitCode: pidAlive(state.pid) ? state.exitCode : null }
  await saveDevState(paths, next)
  return { state: next, stopped: !pidAlive(state.pid) }
}

export function readLogTail(logPath: string | null, lines = 60): string {
  if (!logPath || !existsSync(logPath)) return ""
  try {
    return readFileSync(logPath, "utf8").split(/\r?\n/).slice(-lines).join("\n").trimEnd()
  } catch {
    return ""
  }
}

const ERROR_PATTERN = /error|exception|failed|EADDRINUSE/i

export async function devStatus(paths: Paths): Promise<DevStatus> {
  const state = await loadDevState(paths)
  const running = pidAlive(state.pid)
  const logTail = readLogTail(state.logPath)
  const errors = logTail
    .split(/\r?\n/)
    .filter((line) => ERROR_PATTERN.test(line))
    .slice(-10)
  return { state, running, logPath: state.logPath, logTail, errors }
}

export async function ensureDev(
  root: string,
  cfg: Config,
  paths: Paths,
  opts: { command?: string; cwd?: string } = {},
): Promise<{ state: DevState; action: "started" | "reused" }> {
  return startDev(root, cfg, paths, opts)
}

export async function restartDev(
  root: string,
  cfg: Config,
  paths: Paths,
  opts: { command?: string; cwd?: string } = {},
): Promise<{ state: DevState; action: "restarted" }> {
  await stopDev(root, paths)
  const state = await loadDevState(paths)
  const next = await launch(root, cfg, paths, { ...state, restarts: state.restarts + 1 }, opts)
  await saveDevState(paths, next)
  return { state: next, action: "restarted" }
}
