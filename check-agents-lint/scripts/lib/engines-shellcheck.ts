import { finding } from "./catalog.ts";
import { chunk, firstLine, run, which } from "./exec.ts";
import { normalizeFile, readShellFiles, type EngineRun } from "./engines.ts";
import { missing, skipped } from "./engines-shared.ts";
import type { Ctx, Finding, RuleMeta, Severity } from "./types.ts";

const SH_CHUNK = 100;

interface ShellcheckComment {
  file?: string;
  line?: number;
  level?: string;
  code?: number;
  message?: string;
}

interface ShellcheckReport {
  comments?: ShellcheckComment[];
}

export function runShellcheck(ctx: Ctx, rules: RuleMeta[]): EngineRun {
  const syntax = rules.some((rule) => rule.id === "code/sh-syntax");
  const lint = rules.some((rule) => rule.id === "code/sh-lint");
  if (!syntax && !lint) return skipped("shellcheck", "no selected rules");
  if (!which("shellcheck")) return missing("shellcheck", "shellcheck is not installed");

  const files = readShellFiles(ctx);
  if (!files.length) return skipped("shellcheck", "no shell scripts");

  const findings: Finding[] = [];
  const failures: string[] = [];
  let runs = 0;
  for (const group of chunk(files, SH_CHUNK)) {
    runs++;
    const result = run("shellcheck", ["--format=json1", "--severity=style", "--shell=sh", ...group], { cwd: ctx.root });
    if (result.missing) return missing("shellcheck", "shellcheck disappeared");
    let report: ShellcheckReport | null = null;
    try {
      report = JSON.parse(result.stdout) as ShellcheckReport;
    } catch {
      failures.push(firstLine(result.stderr) || `exit ${result.status}`);
      continue;
    }
    for (const comment of report.comments ?? []) {
      const level = (comment.level ?? "").toLowerCase();
      const rule = level === "error" ? "code/sh-syntax" : "code/sh-lint";
      if (rule === "code/sh-syntax" ? !syntax : !lint) continue;
      if (!comment.file) continue;
      const severity: Severity = rule === "code/sh-syntax" ? "critical" : level === "warning" ? "warning" : "info";
      const code = comment.code ? `SC${comment.code}` : "shellcheck";
      findings.push(
        finding(
          rule,
          normalizeFile(ctx.root, comment.file),
          comment.line ?? 1,
          `${code}: ${comment.message ?? "shellcheck diagnostic"}`,
          severity,
        ),
      );
    }
  }

  const note = failures.length ? `failed on ${failures.length} chunk(s): ${failures[0]}` : `${files.length} scripts`;
  return {
    findings,
    status: { name: "shellcheck", status: "ok", note, findings: findings.length },
    error: failures.length === runs ? note : undefined,
  };
}
