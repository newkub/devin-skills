import { closeSync, openSync } from "node:fs"

// Decision: every child process in this package (checks, captures, dev server) goes
// through these four helpers. Spawning rules differ per platform and per call site
// would drift; one shim keeps exit codes, truncation, and detach semantics identical.

export type ShellResult = {
  exitCode: number
  output: string
}

export function truncateOutput(text: string, limit = 4000): string {
  return text.length > limit ? `${text.slice(0, limit)}\n... (truncated)` : text
}

export function shellOf(command: string): string[] {
  return process.platform === "win32"
    ? ["cmd.exe", "/d", "/s", "/c", command]
    : ["sh", "-c", command]
}

/**
 * Signal 0 probes existence without delivering a signal. EPERM means the process
 * exists but belongs to another user, which is still "alive" for lock purposes.
 */
export function pidAlive(pid: number | null | undefined): boolean {
  if (pid === null || pid === undefined || pid <= 0) return false
  try {
    process.kill(pid, 0)
    return true
  } catch (err) {
    return (err as NodeJS.ErrnoException).code === "EPERM"
  }
}

export function runShell(
  command: string,
  opts: { cwd: string; env?: Record<string, string>; timeoutMs?: number },
): ShellResult {
  const res = Bun.spawnSync(shellOf(command), {
    cwd: opts.cwd,
    env: opts.env ? { ...process.env, ...opts.env } : process.env,
    stdout: "pipe",
    stderr: "pipe",
    timeout: opts.timeoutMs ?? 120_000,
  })
  const merged = `${res.stdout.toString()}${res.stderr.toString()}`.trim()
  return { exitCode: res.exitCode ?? 1, output: truncateOutput(merged) }
}

/**
 * Detached so the dev server outlives the CLI call that started it. stdout and
 * stderr go to one append-mode log file so `dev logs` has a single source.
 */
export function spawnDetached(
  command: string,
  opts: { cwd: string; logPath: string; env?: Record<string, string> },
): { pid: number | null } {
  const fd = openSync(opts.logPath, "a")
  try {
    const child = Bun.spawn(shellOf(command), {
      cwd: opts.cwd,
      env: opts.env ? { ...process.env, ...opts.env } : process.env,
      detached: true,
      stdio: ["ignore", fd, fd],
    })
    child.unref()
    return { pid: child.pid ?? null }
  } finally {
    closeSync(fd)
  }
}
