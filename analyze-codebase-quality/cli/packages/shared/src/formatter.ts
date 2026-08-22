import type { AnalysisIssue, AnalysisResult, ConsolidatedReport, Severity } from "./types.js";
import { CATEGORY_LABELS } from "./constants.js";
import { sortIssuesBySeverity } from "./utils.js";
import { COLORS, SEVERITY_COLORS, SEVERITY_ICONS, bold, colorize, dim } from "./colors.js";

export function formatTable(report: ConsolidatedReport): string {
	const lines: string[] = [];

	lines.push("");
	lines.push(bold("  Codebase Quality Analyzer"));
	lines.push(dim(`  ${report.projectPath}`));
	lines.push(dim(`  ${report.timestamp}`));
	lines.push("");

	const header = `  ${"Category".padEnd(25)} ${"Total".padStart(6)} ${"🔴".padStart(5)} ${"🟠".padStart(5)} ${"🟡".padStart(5)} ${"🔵".padStart(5)} ${"Status".padStart(8)}`;
	lines.push(dim(header));
	lines.push(dim(`  ${"─".repeat(68)}`));

	for (const result of report.results) {
		const label = CATEGORY_LABELS[result.category] ?? result.category;
		const status = getStatusBadge(result.stats);
		const row = `  ${label.padEnd(25)} ${String(result.stats.total).padStart(6)} ${String(result.stats.critical).padStart(5)} ${String(result.stats.high).padStart(5)} ${String(result.stats.medium).padStart(5)} ${String(result.stats.low).padStart(5)} ${status.padStart(8)}`;
		lines.push(row);
	}

	lines.push(dim(`  ${"─".repeat(68)}`));

	const totalRow = `  ${"TOTAL".padEnd(25)} ${String(report.stats.total).padStart(6)} ${String(report.stats.critical).padStart(5)} ${String(report.stats.high).padStart(5)} ${String(report.stats.medium).padStart(5)} ${String(report.stats.low).padStart(5)} ${getOverallStatus(report.stats).padStart(8)}`;
	lines.push(bold(totalRow));
	lines.push("");

	return lines.join("\n");
}

export function formatDetails(
	report: ConsolidatedReport,
	options: { minSeverity?: Severity; showRecommendations?: boolean; } = {},
): string {
	const severityOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
	const minSeverity = options.minSeverity ? severityOrder[options.minSeverity] : 3;
	const showRecs = options.showRecommendations ?? true;
	const lines: string[] = [];

	for (const result of report.results) {
		if (result.issues.length === 0) continue;

		const filtered = result.issues.filter((i) => severityOrder[i.severity] <= minSeverity);
		if (filtered.length === 0) continue;

		lines.push("");
		lines.push(bold(`  ${CATEGORY_LABELS[result.category] ?? result.category}`));
		lines.push(dim(`  ${result.summary}`));
		lines.push("");

		for (const issue of sortIssuesBySeverity(filtered)) {
			lines.push(formatIssueDetail(issue, showRecs));
		}
	}

	return lines.join("\n");
}

function formatIssueDetail(issue: AnalysisIssue, showRecs: boolean): string {
	const icon = SEVERITY_ICONS[issue.severity];
	const sevColor = SEVERITY_COLORS[issue.severity];
	const loc = issue.file ? ` ${dim(issue.file)}${issue.line ? dim(`:${issue.line}`) : ""}` : "";
	const lines: string[] = [];

	lines.push(`  ${icon} ${colorize(issue.title, sevColor)}${loc}`);
	lines.push(`     ${dim(issue.description)}`);
	if (showRecs) {
		lines.push(`     ${colorize("→", COLORS.green)} ${issue.recommendation}`);
	}
	lines.push("");

	return lines.join("\n");
}

function getStatusBadge(stats: { critical: number; high: number; medium: number; low: number; }): string {
	if (stats.critical > 0) return colorize("FAIL", COLORS.brightRed);
	if (stats.high > 5) return colorize("WARN", COLORS.red);
	if (stats.high > 0 || stats.medium > 10) return colorize("WARN", COLORS.yellow);
	return colorize("PASS", COLORS.green);
}

function getOverallStatus(stats: { critical: number; high: number; }): string {
	if (stats.critical > 0) return colorize("FAIL", COLORS.brightRed);
	if (stats.high > 5) return colorize("WARN", COLORS.red);
	return colorize("PASS", COLORS.green);
}

export function formatSummary(report: ConsolidatedReport): string {
	const lines: string[] = [];
	lines.push("");
	lines.push(`  ${bold("Summary")}`);
	lines.push(`  ${dim("─".repeat(40))}`);
	lines.push(`  Total Issues:  ${bold(String(report.stats.total))}`);
	lines.push(`  ${SEVERITY_ICONS.critical} Critical:    ${colorize(String(report.stats.critical), SEVERITY_COLORS.critical)}`);
	lines.push(`  ${SEVERITY_ICONS.high} High:        ${colorize(String(report.stats.high), SEVERITY_COLORS.high)}`);
	lines.push(`  ${SEVERITY_ICONS.medium} Medium:      ${colorize(String(report.stats.medium), SEVERITY_COLORS.medium)}`);
	lines.push(`  ${SEVERITY_ICONS.low} Low:         ${colorize(String(report.stats.low), SEVERITY_COLORS.low)}`);
	lines.push("");

	return lines.join("\n");
}

export function formatSingleResultTable(result: AnalysisResult): string {
	const lines: string[] = [];
	lines.push("");
	lines.push(bold(`  ${CATEGORY_LABELS[result.category] ?? result.category}`));
	lines.push(dim(`  ${result.summary}`));
	lines.push("");

	const header = `  ${"Severity".padEnd(10)} ${"Title".padEnd(40)} ${"File".padEnd(30)}`;
	lines.push(dim(header));
	lines.push(dim(`  ${"─".repeat(82)}`));

	for (const issue of sortIssuesBySeverity(result.issues)) {
		const icon = SEVERITY_ICONS[issue.severity];
		const sevColor = SEVERITY_COLORS[issue.severity];
		const title = issue.title.length > 38 ? `${issue.title.slice(0, 35)}...` : issue.title;
		const file = issue.file ? (issue.file.length > 28 ? `${issue.file.slice(0, 25)}...` : issue.file) : "-";
		const row = `  ${colorize(`${icon} ${issue.severity}`.padEnd(10), sevColor)} ${title.padEnd(40)} ${dim(file.padEnd(30))}`;
		lines.push(row);
	}

	lines.push(dim(`  ${"─".repeat(82)}`));
	lines.push(`  ${bold(`Total: ${result.stats.total}`)} (${result.stats.critical} critical, ${result.stats.high} high, ${result.stats.medium} medium, ${result.stats.low} low)`);
	lines.push("");

	return lines.join("\n");
}
