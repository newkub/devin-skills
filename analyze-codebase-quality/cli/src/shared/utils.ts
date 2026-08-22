import type { AnalysisIssue, AnalysisResult, AnalysisStats, Severity } from "./types.js";

export function createStats(issues: AnalysisIssue[]): AnalysisStats {
  return {
    total: issues.length,
    critical: issues.filter((i) => i.severity === "critical").length,
    high: issues.filter((i) => i.severity === "high").length,
    medium: issues.filter((i) => i.severity === "medium").length,
    low: issues.filter((i) => i.severity === "low").length,
  };
}

export function createResult(
  category: AnalysisResult["category"],
  issues: AnalysisIssue[],
  summary: string,
): AnalysisResult {
  return {
    category,
    issues,
    summary,
    stats: createStats(issues),
  };
}

export function createIssue(
  category: string,
  severity: Severity,
  title: string,
  description: string,
  recommendation: string,
  file?: string,
  line?: number,
): AnalysisIssue {
  return {
    category,
    severity,
    title,
    description,
    recommendation,
    file,
    line,
  };
}

export function sortIssuesBySeverity(issues: AnalysisIssue[]): AnalysisIssue[] {
  const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...issues].sort((a, b) => order[a.severity] - order[b.severity]);
}

export function formatIssue(issue: AnalysisIssue): string {
  const loc = issue.file ? ` (${issue.file}${issue.line ? `:${issue.line}` : ""})` : "";
  return `[${issue.severity.toUpperCase()}] ${issue.title}${loc}\n  ${issue.description}\n  → ${issue.recommendation}`;
}

export function formatResult(result: AnalysisResult): string {
  const lines: string[] = [
    `## ${result.category}`,
    result.summary,
    "",
    `Stats: ${result.stats.total} issues (${result.stats.critical} critical, ${result.stats.high} high, ${result.stats.medium} medium, ${result.stats.low} low)`,
    "",
  ];
  for (const issue of sortIssuesBySeverity(result.issues)) {
    lines.push(formatIssue(issue));
    lines.push("");
  }
  return lines.join("\n");
}
