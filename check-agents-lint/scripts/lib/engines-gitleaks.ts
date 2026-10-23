import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { finding } from "./catalog.ts";
import { firstLine, makeTempDir, removeTempDir, run, which } from "./exec.ts";
import { normalizeFile, type EngineRun } from "./engines.ts";
import { missing, skipped } from "./engines-shared.ts";
import type { Ctx, Finding, RuleMeta } from "./types.ts";

interface GitleaksEntry {
  RuleID?: string;
  Description?: string;
  File?: string;
  StartLine?: number;
}

function readGitleaksReport(path: string): GitleaksEntry[] {
  if (!existsSync(path)) return [];
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as unknown;
    if (Array.isArray(raw)) return raw as GitleaksEntry[];
    if (raw && typeof raw === "object" && Array.isArray((raw as { findings?: unknown }).findings))
      return (raw as { findings: GitleaksEntry[] }).findings;
    return [];
  } catch {
    return [];
  }
}

const GITLEAKS_CONFIG = [
  "[extend]",
  "useDefault = true",
  "",
  "[allowlist]",
  'description = "skip vendored and generated files"',
  "paths = [",
  "  '''node_modules''',",
  "  '''\\.git''',",
  "  '''package-lock\\.json''',",
  "  '''bun\\.lockb?''',",
  "  '''pnpm-lock\\.yaml''',",
  "  '''yarn\\.lock''',",
  "  '''Cargo\\.lock''',",
  "]",
  "",
].join("\n");

export function runGitleaks(ctx: Ctx, rules: RuleMeta[]): EngineRun {
  if (!rules.some((rule) => rule.id === "sec/no-secret")) return skipped("gitleaks", "no selected rules");
  if (!which("gitleaks")) return missing("gitleaks", "gitleaks is not installed");
  if (!ctx.skills.length) return skipped("gitleaks", "no skills selected");

  const dirs = ctx.skills.map((skill) => skill.dir);
  const inScope = (file: string) => dirs.some((dir) => file === dir || file.startsWith(`${dir}/`));

  const temp = makeTempDir("agents-lint-gitleaks");
  try {
    const config = join(temp, "gitleaks.toml");
    const reportPath = join(temp, "report.json");
    writeFileSync(config, GITLEAKS_CONFIG, "utf8");
    const result = run(
      "gitleaks",
      [
        "detect",
        "--no-git",
        "--source",
        ctx.root,
        "--config",
        config,
        "--report-format",
        "json",
        "--report-path",
        reportPath,
        "--redact",
        "--exit-code",
        "0",
      ],
      { cwd: ctx.root, timeoutMs: 300_000 },
    );
    if (result.missing) return missing("gitleaks", "gitleaks disappeared");
    const report = readGitleaksReport(reportPath);
    if (!report.length && !result.ok && !existsSync(reportPath)) {
      const note = firstLine(result.stderr) || `exit ${result.status}`;
      return { findings: [], status: { name: "gitleaks", status: "ok", note, findings: 0 }, error: note };
    }
    const findings: Finding[] = [];
    for (const entry of report) {
      const file = normalizeFile(ctx.root, entry.File ?? "");
      if (!file || !inScope(file)) continue;
      const rule = entry.RuleID?.trim() || "secret";
      const description = entry.Description?.trim() || "credential-shaped value";
      findings.push(finding("sec/no-secret", file, entry.StartLine ?? 1, `${rule}: ${description}`, "critical"));
    }
    return {
      findings,
      status: { name: "gitleaks", status: "ok", note: `${ctx.skills.length} skills`, findings: findings.length },
    };
  } finally {
    removeTempDir(temp);
  }
}
