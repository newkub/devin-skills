import { spawnSync } from "node:child_process";
import { accessSync, constants, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";

const IS_WIN = process.platform === "win32";
const PATHEXT = (process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD").split(";").filter(Boolean);

export interface RunResult {
  ok: boolean;
  status: number;
  stdout: string;
  stderr: string;
  missing: boolean;
}

export interface RunOptions {
  cwd?: string;
  timeoutMs?: number;
  input?: string;
  env?: Record<string, string>;
}

export function which(name: string): string | null {
  if (!name) return null;
  const extensions = IS_WIN && !/\.[A-Za-z0-9]+$/.test(name) ? ["", ...PATHEXT.map((e) => e.toLowerCase())] : [""];
  const dirs = (process.env.PATH ?? "").split(delimiter).filter(Boolean);
  for (const dir of dirs) {
    for (const ext of extensions) {
      const candidate = join(dir, `${name}${ext}`);
      try {
        accessSync(candidate, constants.X_OK);
        return candidate;
      } catch {
        // keep looking
      }
    }
  }
  return null;
}

function winQuote(arg: string): string {
  if (!/[\s"&|<>^()]/.test(arg)) return arg;
  return `"${arg.replace(/"/g, '""')}"`;
}

export function run(cmd: string, args: string[], opts: RunOptions = {}): RunResult {
  const exe = which(cmd);
  if (!exe) return { ok: false, status: -1, stdout: "", stderr: `${cmd} is not installed`, missing: true };

  const viaCmd = IS_WIN && /\.(?:cmd|bat)$/i.test(exe);
  const file = viaCmd ? (process.env.ComSpec || "cmd.exe") : exe;
  const argv = viaCmd ? ["/d", "/s", "/c", [winQuote(exe), ...args.map(winQuote)].join(" ")] : args;

  const result = spawnSync(file, argv, {
    cwd: opts.cwd,
    input: opts.input,
    timeout: opts.timeoutMs ?? 180_000,
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
    encoding: "utf8",
    env: opts.env ? { ...process.env, ...opts.env } : process.env,
  });

  const stdout = typeof result.stdout === "string" ? result.stdout : "";
  const stderr = typeof result.stderr === "string" ? result.stderr : "";
  return {
    ok: !result.error && result.status === 0,
    status: typeof result.status === "number" ? result.status : -1,
    stdout,
    stderr,
    missing: false,
  };
}

export function firstLine(text: string): string {
  return (text.split(/\r?\n/).find((line) => line.trim()) ?? "").trim();
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

// Windows keeps the skills store on D:; never spill temp reports onto a full C:.
export function tempRoot(): string {
  if (IS_WIN) {
    const preferred = process.env.AGENTS_LINT_TMP?.trim() || "D:\\tmp";
    try {
      mkdirSync(preferred, { recursive: true });
      return preferred;
    } catch {
      // fall through to the OS temp dir
    }
  }
  return tmpdir();
}

export function makeTempDir(prefix: string): string {
  return mkdtempSync(join(tempRoot(), `${prefix}-`));
}

export function removeTempDir(path: string): void {
  try {
    rmSync(path, { recursive: true, force: true });
  } catch {
    // best effort cleanup
  }
}
