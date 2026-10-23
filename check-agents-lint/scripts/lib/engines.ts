import { existsSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { finding } from "./catalog.ts";
import { chunk, firstLine, run, which } from "./exec.ts";
import { lineOfOffset, packageFiles, readText } from "./files.ts";
import { runContent } from "./rules-content.ts";
import { runGraph } from "./rules-graph.ts";
import { runMeta } from "./rules-meta.ts";
import { runSec } from "./rules-sec.ts";
import { runFm } from "./rules-struct-fm.ts";
import { runShape } from "./rules-struct-shape.ts";
import type { Ctx, EngineStatus, Finding, RuleMeta, Severity } from "./types.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
export const PACKAGE_ROOT = resolve(HERE, "../..");
export const SG_CONFIG = join(PACKAGE_ROOT, "scripts", "ast-grep", "sgconfig.yml");

const BIOME_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".jsonc", ".css"]);
const BIOME_CHUNK = 150;
const SG_CHUNK = 80;

export interface EngineRun {
  findings: Finding[];
  status: EngineStatus;
  error?: string;
}

export function normalizeFile(root: string, file: string): string {
  if (!file) return "";
  const abs = isAbsolute(file) ? file : resolve(root, file);
  const rel = relative(root, abs).split("\\").join("/");
  return rel.startsWith("..") ? file.split("\\").join("/") : rel;
}

function absoluteFile(root: string, file: string): string {
  return isAbsolute(file) ? file : resolve(root, file);
}

function lineAt(root: string, file: string, offset: number | undefined): number {
  if (offset === undefined || !Number.isFinite(offset)) return 1;
  return lineOfOffset(readText(absoluteFile(root, file)), offset);
}

function severityFrom(level: string | undefined, fallback: Severity): Severity {
  switch ((level ?? "").toLowerCase()) {
    case "error":
    case "fatal":
      return "critical";
    case "warning":
    case "warn":
      return "warning";
    case "info":
    case "information":
    case "hint":
    case "style":
      return "info";
    default:
      return fallback;
  }
}

export function runOwn(ctx: Ctx, rules: RuleMeta[]): EngineRun {
  const ids = new Set(rules.filter((rule) => rule.engine === "own").map((rule) => rule.id));
  const started = Date.now();
  const all = [
    ...runFm(ctx),
    ...runShape(ctx),
    ...runMeta(ctx),
    ...runGraph(ctx),
    ...runContent(ctx),
    ...runSec(ctx),
  ];
  const findings = all.filter((item) => ids.has(item.rule));
  return {
    findings,
    status: {
      name: "own",
      status: "ok",
      note: `${ids.size} rules · ${Date.now() - started}ms`,
      findings: findings.length,
    },
  };
}

interface BiomeDiagnostic {
  category?: string;
  severity?: string;
  description?: string;
  message?: { content?: string }[];
  location?: { path?: { file?: string }; span?: [number, number] };
}

interface BiomeReport {
  diagnostics?: BiomeDiagnostic[];
}

function biomeMessage(diagnostic: BiomeDiagnostic): string {
  if (diagnostic.description?.trim()) return diagnostic.description.trim();
  return (diagnostic.message ?? [])
    .map((part) => part.content ?? "")
    .join("")
    .trim();
}

export function runBiome(ctx: Ctx, rules: RuleMeta[]): EngineRun {
  const lint = rules.some((rule) => rule.id === "code/biome-lint");
  const format = rules.some((rule) => rule.id === "code/biome-format");
  const selected = lint || format;
  const base = { name: "biome" as const, status: "skipped" as const, findings: 0 };
  if (!selected) return { findings: [], status: { ...base, note: "no selected rules" } };
  if (!which("biome")) return { findings: [], status: { ...base, status: "missing", note: "biome is not installed" } };

  const files = ctx.skills
    .flatMap((skill) => packageFiles(skill.dirPath, "all"))
    .filter((file) => BIOME_EXTS.has(extname(file).toLowerCase()));

  if (!files.length) return { findings: [], status: { ...base, note: "no TypeScript, JSON, or CSS files" } };

  const findings: Finding[] = [];
  const failures: string[] = [];
  const groups = chunk(files, BIOME_CHUNK);
  for (const group of groups) {
    const result = run("biome", ["check", "--reporter=json", "--no-errors-on-unmatched", "--max-diagnostics=200", ...group], {
      cwd: ctx.root,
    });
    if (result.missing) return { findings: [], status: { ...base, status: "missing", note: "biome disappeared" } };
    let report: BiomeReport | null = null;
    try {
      report = JSON.parse(result.stdout) as BiomeReport;
    } catch {
      failures.push(firstLine(result.stderr) || `exit ${result.status}`);
      continue;
    }
    for (const diagnostic of report.diagnostics ?? []) {
      const category = diagnostic.category ?? "";
      const isFormat = category.startsWith("format");
      if (isFormat && !format) continue;
      if (!isFormat && !category.startsWith("lint") && !category.startsWith("parse")) continue;
      if (!isFormat && !lint) continue;
      const rule = isFormat ? "code/biome-format" : "code/biome-lint";
      const file = diagnostic.location?.path?.file ?? "";
      if (!file) continue;
      findings.push(
        finding(
          rule,
          normalizeFile(ctx.root, file),
          lineAt(ctx.root, file, diagnostic.location?.span?.[0]),
          biomeMessage(diagnostic) || category || "biome diagnostic",
          severityFrom(diagnostic.severity, "warning"),
        ),
      );
    }
  }

  const note = failures.length ? `failed on ${failures.length} chunk(s): ${failures[0]}` : `${files.length} files`;
  return {
    findings,
    status: { name: "biome", status: "ok", note, findings: findings.length },
    error: failures.length === groups.length ? note : undefined,
  };
}

interface SgMatch {
  ruleId?: string;
  severity?: string;
  message?: string;
  file?: string;
  range?: { start?: { line?: number; column?: number } };
}

export function runAstGrep(ctx: Ctx, rules: RuleMeta[]): EngineRun {
  const selected = rules.some((rule) => rule.id === "sec/dynamic-exec");
  const base = { name: "ast-grep" as const, status: "skipped" as const, findings: 0 };
  if (!selected) return { findings: [], status: { ...base, note: "no selected rules" } };
  if (!which("sg")) return { findings: [], status: { ...base, status: "missing", note: "sg is not installed" } };
  if (!existsSync(SG_CONFIG)) return { findings: [], status: { ...base, status: "missing", note: `missing ${SG_CONFIG}` } };

  const dirs = ctx.skills.map((skill) => skill.dirPath);
  if (!dirs.length) return { findings: [], status: { ...base, note: "no skills selected" } };

  const findings: Finding[] = [];
  const unknown = new Set<string>();
  const failures: string[] = [];
  let runs = 0;
  for (const group of chunk(dirs, SG_CHUNK)) {
    runs++;
    const result = run("sg", ["scan", "--config", SG_CONFIG, "--json", ...group], { cwd: ctx.root });
    if (result.missing) return { findings: [], status: { ...base, status: "missing", note: "sg disappeared" } };
    let matches: SgMatch[] | null = null;
    try {
      matches = JSON.parse(result.stdout) as SgMatch[];
    } catch {
      failures.push(firstLine(result.stderr) || `exit ${result.status}`);
      continue;
    }
    for (const match of matches) {
      const ruleId = match.ruleId ?? "";
      if (!ruleId.includes("no-eval")) {
        if (ruleId) unknown.add(ruleId);
        continue;
      }
      if (!match.file) continue;
      findings.push(
        finding(
          "sec/dynamic-exec",
          normalizeFile(ctx.root, match.file),
          (match.range?.start?.line ?? 0) + 1,
          match.message || "eval or new Function executes arbitrary code",
          severityFrom(match.severity, "warning"),
        ),
      );
    }
  }

  const parts = [`${dirs.length} skills`];
  if (unknown.size) parts.push(`ignored rules: ${[...unknown].join(", ")}`);
  if (failures.length) parts.push(`failed: ${failures[0]}`);
  return {
    findings,
    status: { name: "ast-grep", status: "ok", note: parts.join(" · "), findings: findings.length },
    error: failures.length === runs ? failures[0] : undefined,
  };
}

export function readShellFiles(ctx: Ctx): string[] {
  return ctx.skills
    .flatMap((skill) => packageFiles(skill.dirPath, "all"))
    .filter((file) => extname(file).toLowerCase() === ".sh");
}
