#!/usr/bin/env bun
import { createConfig } from "../../config.js";
import { analyzeAll, analyzeCategory } from "../../application/orchestrator.js";
import {
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  COLORS,
  bold,
  colorize,
  dim,
  formatDetails,
  formatResult,
  formatSingleResultTable,
  formatSummary,
  formatTable,
} from "../../shared/index.js";
import type { AnalysisCategory, Severity } from "../../shared/index.js";
import { writeFileSync } from "node:fs";

type OutputFormat = "table" | "json" | "markdown" | "plain";

const args = process.argv.slice(2);
const projectPath = args.find((a) => !a.startsWith("-")) || ".";
const outputFlag = getFlagValue(args, "--output");
const categoryFlag = getFlagValue(args, "--category");
const singleCategory = categoryFlag as AnalysisCategory | undefined;
const formatFlag = getFlagValue(args, "--format") as OutputFormat | undefined;
const severityFlag = getFlagValue(args, "--severity") as Severity | undefined;
const jsonFlag = args.includes("--json");
const quietFlag = args.includes("--quiet") || args.includes("-q");
const noDetailFlag = args.includes("--no-detail");
const noColorFlag = args.includes("--no-color");
const helpFlag = args.includes("--help") || args.includes("-h");
const listFlag = args.includes("--list-categories");

if (helpFlag) {
  printHelp();
  process.exit(0);
}

if (listFlag) {
  printCategories();
  process.exit(0);
}

const format: OutputFormat = formatFlag ?? (jsonFlag ? "json" : "table");
const minSeverity = severityFlag ?? "low";
const showDetail = !noDetailFlag && !quietFlag;
const showColor = !noColorFlag;

if (!showColor) {
  disableColors();
}

const config = createConfig(projectPath);

if (singleCategory) {
  if (!ALL_CATEGORIES.includes(singleCategory)) {
    console.error(`${colorize("Error", COLORS.brightRed)}: Unknown category: ${singleCategory}`);
    console.error(`Available: ${ALL_CATEGORIES.join(", ")}`);
    process.exit(1);
  }
  const result = analyzeCategory(singleCategory, config);

  if (format === "json") {
    outputOrPrint(JSON.stringify(result, null, 2), outputFlag);
  } else if (format === "markdown" || format === "plain") {
    outputOrPrint(formatResult(result), outputFlag);
  } else {
    outputOrPrint(formatSingleResultTable(result), outputFlag);
    if (showDetail) {
      const detailText = formatDetails(
        { results: [result], totalIssues: result.stats.total, stats: result.stats, projectPath: config.projectPath, timestamp: new Date().toISOString() },
        { minSeverity },
      );
      if (detailText.trim()) console.log(detailText);
    }
  }
  process.exit(0);
}

const report = analyzeAll(config);

if (format === "json") {
  outputOrPrint(JSON.stringify(report, null, 2), outputFlag);
} else if (format === "markdown" || format === "plain") {
  const lines: string[] = [
    "# Codebase Quality Report",
    `Project: ${report.projectPath}`,
    `Date: ${report.timestamp}`,
    "",
    "## Summary",
    `Total issues: ${report.totalIssues}`,
    `Critical: ${report.stats.critical} | High: ${report.stats.high} | Medium: ${report.stats.medium} | Low: ${report.stats.low}`,
    "",
  ];
  for (const result of report.results) {
    lines.push(formatResult(result));
  }
  outputOrPrint(lines.join("\n"), outputFlag);
} else {
  const parts: string[] = [];
  parts.push(formatTable(report));
  parts.push(formatSummary(report));
  if (showDetail) {
    const detailText = formatDetails(report, { minSeverity });
    if (detailText.trim()) parts.push(detailText);
  }
  outputOrPrint(parts.join("\n"), outputFlag);
}

process.exit(0);

function getFlagValue(argList: string[], flag: string): string | undefined {
  const found = argList.find((a) => a.startsWith(`${flag}=`));
  return found?.split("=")[1];
}

function outputOrPrint(content: string, outputPath?: string): void {
  if (outputPath) {
    writeFileSync(outputPath, content);
    console.log(`${colorize("✓", COLORS.green)} Report saved to ${bold(outputPath)}`);
  } else {
    console.log(content);
  }
}

function disableColors(): void {
  for (const key of Object.keys(COLORS)) {
    COLORS[key] = "";
  }
}

function printHelp(): void {
  const lines: string[] = [
    "",
    bold("  Codebase Quality Analyzer"),
    dim("  Analyze codebase quality across 8 dimensions"),
    "",
    bold("  Usage:"),
    `    ${dim("$")} analyze-codebase-quality ${dim("[path]")} ${dim("[options]")}`,
    "",
    bold("  Options:"),
    `    ${colorize("--output=<path>", COLORS.cyan)}     Save report to file`,
    `    ${colorize("--format=<type>", COLORS.cyan)}     Output format: table, json, markdown, plain ${dim("(default: table)")}`,
    `    ${colorize("--category=<name>", COLORS.cyan)}   Run single category ${dim("(see --list-categories)")}`,
    `    ${colorize("--severity=<level>", COLORS.cyan)}  Min severity: critical, high, medium, low ${dim("(default: low)")}`,
    `    ${colorize("--json", COLORS.cyan)}              Shortcut for --format=json`,
    `    ${colorize("--quiet, -q", COLORS.cyan)}         Summary only, no details`,
    `    ${colorize("--no-detail", COLORS.cyan)}         Table only, no issue details`,
    `    ${colorize("--no-color", COLORS.cyan)}          Disable colored output`,
    `    ${colorize("--list-categories", COLORS.cyan)}   List all analysis categories`,
    `    ${colorize("--help, -h", COLORS.cyan)}          Show this help`,
    "",
    bold("  Categories:"),
    ...ALL_CATEGORIES.map((c) => `    ${colorize(c.padEnd(25), COLORS.cyan)} ${CATEGORY_LABELS[c]}`),
    "",
    bold("  Examples:"),
    `    ${dim("$")} analyze-codebase-quality ${dim("./my-project")}`,
    `    ${dim("$")} analyze-codebase-quality . ${colorize("--format=json", COLORS.cyan)} ${colorize("--output=report.json", COLORS.cyan)}`,
    `    ${dim("$")} analyze-codebase-quality . ${colorize("--category=structure", COLORS.cyan)} ${colorize("--severity=high", COLORS.cyan)}`,
    `    ${dim("$")} analyze-codebase-quality . ${colorize("--quiet", COLORS.cyan)}`,
    "",
  ];
  console.log(lines.join("\n"));
}

function printCategories(): void {
  const lines: string[] = [
    "",
    bold("  Analysis Categories:"),
    "",
    ...ALL_CATEGORIES.map((c) => `  ${colorize(c.padEnd(25), COLORS.cyan)} ${CATEGORY_LABELS[c]}`),
    "",
    `  ${dim("Use with: --category=<name>")}`,
    "",
  ];
  console.log(lines.join("\n"));
}
