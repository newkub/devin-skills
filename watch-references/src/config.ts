import { resolve, relative, join, dirname, sep, isAbsolute } from "node:path"
import { existsSync, mkdirSync, readFileSync } from "node:fs"

export const CONFIG_FILE = "watch-references.json"
export const STATE_VERSION = 1

export type Config = {
  version: number
  outDir: string
  include: string[]
  exclude: string[]
  watch: { debounceMs: number; pollIntervalMs: number; maxFiles: number }
  visual: {
    screensDir: string
    videosDir: string
    runtimeDir: string
    retentionDays: number
    capture: { screen: string | null; video: string | null }
  }
  dev: { command: string | null; cwd: string | null; autoRestart: boolean }
  checks: { name: string; command: string; cwd: string | null }[]
}

export const DEFAULT_CONFIG: Config = {
  version: STATE_VERSION,
  outDir: ".watch-references",
  include: ["**/*"],
  exclude: [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.next/**",
    "**/.cache/**",
    "**/.devin/**",
    "**/.watch-references/**",
    "**/*.lock",
    "**/*.min.js",
    "**/*.map",
  ],
  watch: { debounceMs: 250, pollIntervalMs: 400, maxFiles: 20000 },
  visual: {
    screensDir: ".watch-references/visual/screens",
    videosDir: ".watch-references/visual/videos",
    runtimeDir: ".watch-references/visual/runtime",
    retentionDays: 0,
    capture: { screen: null, video: null },
  },
  dev: { command: null, cwd: null, autoRestart: false },
  checks: [],
}

export type Paths = {
  root: string
  out: string
  index: string
  status: string
  changes: string
  feedback: string
  visual: string
  skills: string
  dev: string
  configFile: string
}

export function toPosix(p: string): string {
  return p.split(sep).join("/")
}

export function pathsFor(root: string, cfg: Config): Paths {
  const out = resolve(root, cfg.outDir)
  return {
    root,
    out,
    index: join(out, "index.json"),
    status: join(out, "status.json"),
    changes: join(out, "changes"),
    feedback: join(out, "feedback"),
    visual: join(out, "visual"),
    skills: join(out, "skills"),
    dev: join(out, "dev"),
    configFile: join(root, CONFIG_FILE),
  }
}

export function configPath(root: string): string {
  return join(root, CONFIG_FILE)
}

export async function readJson<T>(path: string): Promise<T | null> {
  const file = Bun.file(path)
  if (!(await file.exists())) return null
  try {
    return (await file.json()) as T
  } catch {
    return null
  }
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  await Bun.write(path, JSON.stringify(value, null, 2) + "\n")
}

export function loadConfig(root: string): Config {
  const p = configPath(root)
  // Config files are small and read on every command; sync read keeps the CLI deterministic.
  if (!existsSync(p)) return mergeConfig(null)
  try {
    return mergeConfig(JSON.parse(readFileSync(p, "utf8")))
  } catch (err) {
    throw new CliError(2, `invalid config ${CONFIG_FILE}: ${(err as Error).message}`)
  }
}

export function mergeConfig(raw: unknown): Config {
  const input = (raw && typeof raw === "object" ? raw : {}) as Partial<Config>
  return {
    version: STATE_VERSION,
    outDir: input.outDir ?? DEFAULT_CONFIG.outDir,
    include: input.include ?? DEFAULT_CONFIG.include,
    exclude: input.exclude ? [...DEFAULT_CONFIG.exclude, ...input.exclude] : [...DEFAULT_CONFIG.exclude],
    watch: { ...DEFAULT_CONFIG.watch, ...(input.watch ?? {}) },
    visual: {
      ...DEFAULT_CONFIG.visual,
      ...(input.visual ?? {}),
      capture: { ...DEFAULT_CONFIG.visual.capture, ...(input.visual?.capture ?? {}) },
    },
    dev: { ...DEFAULT_CONFIG.dev, ...(input.dev ?? {}) },
    checks: input.checks ?? DEFAULT_CONFIG.checks,
  }
}

export function projectRoot(explicit?: string): string {
  return resolve(explicit ?? process.cwd())
}

export function isInside(root: string, target: string): boolean {
  const rel = relative(resolve(root), resolve(target))
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel))
}

export function requireInside(root: string, target: string): string {
  const abs = resolve(root, target)
  if (!isInside(root, abs)) throw new CliError(2, `path escapes project root: ${target}`)
  return abs
}

export function relPosix(root: string, target: string): string {
  return toPosix(relative(root, target))
}

export class CliError extends Error {
  constructor(
    public exitCode: number,
    message: string,
  ) {
    super(message)
  }
}

export function ensureDir(path: string): void {
  // Bun.write creates parent directories for files, but not for empty evidence dirs.
  if (!existsSync(path)) mkdirSync(path, { recursive: true })
}

export function outPath(root: string, cfg: Config, ...parts: string[]): string {
  return join(resolve(root, cfg.outDir), ...parts)
}

export function parentOf(path: string): string {
  return dirname(path)
}
