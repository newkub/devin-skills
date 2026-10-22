import type { Finding } from "./types";

export interface ReportMeta {
  totalSkills: number;
  submoduleSkills: string[];
  skillsWithIssues: number;
  totalFindings: number;
  totalObservations: number;
  score: number;
  grade: string;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
}

export interface Report {
  meta: ReportMeta;
  findings: Finding[];
  observations: Finding[];
}

const SEVERITIES = ["Critical", "High", "Medium", "Low", "Info"];

const cell = (value: unknown) => String(value).replace(/\|/g, "\\|");

function table(headers: string[], rows: unknown[][]): string[] {
  return [
    `| ${headers.join(" | ")} |`,
    `|${headers.map(() => "---").join("|")}|`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
  ];
}

function counts(values: Record<string, number>, order?: string[]): unknown[][] {
  const keys = order ?? Object.keys(values).sort();
  return keys.map((key) => [key, values[key] ?? 0]);
}

export function formatReport(report: Report): string {
  const { meta, findings, observations } = report;
  const out: string[] = [];

  out.push(`## Review — ${meta.totalSkills} skills`, "");
  out.push(
    ...table(["Metric", "Value"], [
      ["Skills reviewed", meta.totalSkills],
      ["Submodules skipped", meta.submoduleSkills.join(", ") || "—"],
      ["Skills with issues", meta.skillsWithIssues],
      ["Findings", meta.totalFindings],
      ["Observations", meta.totalObservations],
      ["Score", `${meta.score} (Grade ${meta.grade})`],
    ]),
    "",
  );

  out.push("### By severity", "", ...table(["Severity", "Count"], counts(meta.bySeverity, SEVERITIES)), "");
  out.push("### By category", "", ...table(["Category", "Count"], counts(meta.byCategory)), "");

  out.push("### Findings", "");
  if (findings.length === 0) {
    out.push("No findings.", "");
  } else {
    out.push(
      ...table(
        ["No.", "Skill", "Category", "Severity", "Finding", "Evidence", "File"],
        findings.map((f, i) => [i + 1, f.skill, f.category, f.severity, f.finding, f.evidence, `${f.file}:${f.line}`]),
      ),
      "",
    );
  }

  out.push("### Observations", "");
  if (observations.length === 0) {
    out.push("No observations.", "");
  } else {
    for (const [i, o] of observations.entries()) {
      out.push(`${i + 1}. [${o.severity}/${o.category}] ${o.finding} — ${o.evidence} (${o.skill})`);
    }
    out.push("");
  }

  return out.join("\n");
}
