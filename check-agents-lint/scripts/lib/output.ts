import { readFileSync } from "node:fs";
import { byId } from "./catalog.ts";
import { SEVERITY_RANK, type EngineStatus, type Finding, type Severity } from "./types.ts";

export const VERSION = "1.0.0";
export const TOOL_NAME = "agents-lint";

export interface Summary {
  critical: number;
  warning: number;
  info: number;
  total: number;
  skills: number;
  baselined: number;
}

export interface RunResult {
  version: string;
  root: string;
  generatedAt: string;
  changed: boolean;
  summary: Summary;
  engines: EngineStatus[];
  findings: Finding[];
}

export function baselineKey(finding: Finding): string {
  return `${finding.rule}|${finding.file}|${finding.message}`;
}

export function loadBaseline(file: string): Set<string> {
  const raw = JSON.parse(readFileSync(file, "utf8")) as unknown;
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as { findings?: unknown }).findings)
      ? ((raw as { findings: unknown[] }).findings as unknown[])
      : null;
  if (!list) throw new Error("baseline must be a findings array or an agents-lint JSON report");
  const keys = new Set<string>();
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const entry = item as { rule?: unknown; file?: unknown; message?: unknown };
    if (typeof entry.rule === "string" && typeof entry.file === "string" && typeof entry.message === "string")
      keys.add(`${entry.rule}|${entry.file}|${entry.message}`);
  }
  return keys;
}

export interface Prepared {
  findings: Finding[];
  baselined: number;
}

export function prepare(findings: Finding[], baseline?: Set<string>): Prepared {
  const seen = new Set<string>();
  const unique: Finding[] = [];
  for (const finding of findings) {
    const key = `${finding.rule}|${finding.file}|${finding.line}|${finding.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(finding);
  }
  unique.sort(
    (a, b) =>
      SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] ||
      a.file.localeCompare(b.file) ||
      a.line - b.line ||
      a.rule.localeCompare(b.rule),
  );
  if (!baseline) return { findings: unique, baselined: 0 };
  const kept = unique.filter((finding) => !baseline.has(baselineKey(finding)));
  return { findings: kept, baselined: unique.length - kept.length };
}

export function summarize(findings: Finding[], skills: number, baselined: number): Summary {
  let critical = 0;
  let warning = 0;
  let info = 0;
  for (const finding of findings) {
    if (finding.severity === "critical") critical++;
    else if (finding.severity === "warning") warning++;
    else info++;
  }
  return { critical, warning, info, total: findings.length, skills, baselined };
}

function engineLine(engines: EngineStatus[]): string {
  return engines
    .map((engine) => `${engine.name} ${engine.status}${engine.note ? ` (${engine.note})` : ""}`)
    .join(" · ");
}

export interface TextOptions {
  findingsOnly?: boolean;
}

export function formatText(result: RunResult, opts: TextOptions = {}): string {
  const lines = result.findings.map(
    (finding) =>
      `${finding.severity.padEnd(8)}  ${finding.rule}  ${finding.file}:${finding.line}  ${finding.message}  → ${finding.fix}`,
  );
  if (opts.findingsOnly) return lines.length ? `${lines.join("\n")}\n` : "";
  const { summary } = result;
  const out = [
    `${TOOL_NAME} ${result.version} · ${summary.skills} skills · ${result.root}`,
    `${summary.critical} critical · ${summary.warning} warning · ${summary.info} info`,
    "",
  ];
  if (lines.length) out.push(...lines, "");
  else out.push("no findings", "");
  out.push(`engines: ${engineLine(result.engines)}`);
  if (summary.baselined) out.push(`baseline: ${summary.baselined} finding(s) suppressed`);
  return `${out.join("\n")}\n`;
}

export function toJson(result: RunResult): string {
  return `${JSON.stringify(result, null, 2)}\n`;
}

function sarifLevel(severity: Severity): "error" | "warning" | "note" {
  return severity === "critical" ? "error" : severity === "warning" ? "warning" : "note";
}

function uri(file: string): string {
  return file.split("/").map(encodeURIComponent).join("/");
}

export function toSarif(result: RunResult): string {
  const used = new Map<string, Finding>();
  for (const finding of result.findings) if (!used.has(finding.rule)) used.set(finding.rule, finding);
  const rules = [...used.keys()].sort().map((id) => {
    const meta = byId.get(id);
    return {
      id,
      name: id.replace(/\//g, "-"),
      shortDescription: { text: meta?.proves ?? id },
      defaultConfiguration: { level: sarifLevel(meta?.severity ?? "warning") },
      properties: { engine: meta?.engine ?? "own", fixOwner: meta?.fix ?? "" },
    };
  });
  const results = result.findings.map((finding) => ({
    ruleId: finding.rule,
    level: sarifLevel(finding.severity),
    message: { text: finding.message },
    locations: [
      {
        physicalLocation: {
          artifactLocation: { uri: uri(finding.file) },
          region: { startLine: finding.line, startColumn: 1 },
        },
      },
    ],
    properties: { fixOwner: finding.fix, severity: finding.severity },
  }));
  const sarif = {
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    version: "2.1.0",
    runs: [
      {
        tool: {
          driver: {
            name: TOOL_NAME,
            version: result.version,
            rules,
          },
        },
        results,
        properties: {
          skills: result.summary.skills,
          baselined: result.summary.baselined,
          engines: result.engines,
        },
      },
    ],
  };
  return `${JSON.stringify(sarif, null, 2)}\n`;
}

export function exitFor(findings: Finding[], failOn: Severity | "none"): number {
  if (failOn === "none") return 0;
  const limit = SEVERITY_RANK[failOn];
  return findings.some((finding) => SEVERITY_RANK[finding.severity] <= limit) ? 1 : 0;
}
