import type { AnalysisConfig, AnalysisIssue, AnalysisResult } from "../../shared/index.js";
import { createIssue, createResult } from "../../shared/index.js";
import { join } from "node:path";
import { walkFiles, readFileContent } from "../../adapters/filesystem/file-adapter.js";

export function analyzeLocalization(config: AnalysisConfig): AnalysisResult {
  const issues: AnalysisIssue[] = [];

  if (!config.hasFrontend) {
    return createResult("localization", [], "Skipped - no frontend detected");
  }

  const files = walkFiles(config.projectPath);

  for (const file of files) {
    if (!isFrontendFile(file)) continue;
    const fullPath = join(config.projectPath, file);
    const content = readFileContent(fullPath);

    checkHardcodedStrings(file, content, issues);
    checkRtlSupport(file, content, issues);
    checkLocaleHandling(file, content, issues);
    checkPluralization(file, content, issues);
  }

  return createResult("localization", issues, `Analyzed ${files.length} files for localization`);
}

function isFrontendFile(file: string): boolean {
  return /\.(tsx|jsx|vue|html|ts)$/i.test(file);
}

function checkHardcodedStrings(file: string, content: string, issues: AnalysisIssue[]): void {
  const stringRegex = /(?:["'`])([A-Z][a-z]+(?:\s+[a-z]+){2,})["'`]/g;
  const matches = content.matchAll(stringRegex);
  let count = 0;
  for (const _ of matches) {
    count++;
    if (count > 10) break;
  }
  if (count > 10) {
    issues.push(
      createIssue("localization", "medium", "Excessive hardcoded strings",
        `${file} has ${count}+ hardcoded user-facing strings`,
        "Extract strings to i18n translation files", file),
    );
  }
}

function checkRtlSupport(file: string, content: string, issues: AnalysisIssue[]): void {
  const marginLeftRegex = /margin-left\s*:/gi;
  const marginRightRegex = /margin-right\s*:/gi;
  const logicalMarginRegex = /margin-(?:inline-start|inline-end)\s*:/gi;
  const physicalCount = (content.match(marginLeftRegex) || []).length + (content.match(marginRightRegex) || []).length;
  const logicalCount = (content.match(logicalMarginRegex) || []).length;
  if (physicalCount > 3 && logicalCount === 0) {
    issues.push(
      createIssue("localization", "low", "Physical CSS properties instead of logical",
        `${file} uses margin-left/right instead of logical properties`,
        "Use margin-inline-start/end for RTL support", file),
    );
  }

  const textAlignLeftRegex = /text-align\s*:\s*(?:left|right)/gi;
  const textAlignLogicalRegex = /text-align\s*:\s*(?:start|end)/gi;
  const physicalAlign = (content.match(textAlignLeftRegex) || []).length;
  const logicalAlign = (content.match(textAlignLogicalRegex) || []).length;
  if (physicalAlign > 2 && logicalAlign === 0) {
    issues.push(
      createIssue("localization", "low", "Physical text alignment",
        `${file} uses text-align: left/right instead of start/end`,
        "Use text-align: start/end for RTL support", file),
    );
  }
}

function checkLocaleHandling(file: string, content: string, issues: AnalysisIssue[]): void {
  const toLocaleStringRegex = /toLocaleString\s*\(/g;
  const toFixedRegex = /toFixed\s*\(/g;
  const toLocaleCount = (content.match(toLocaleStringRegex) || []).length;
  const toFixedCount = (content.match(toFixedRegex) || []).length;
  if (toFixedCount > 2 && toLocaleCount === 0) {
    issues.push(
      createIssue("localization", "low", "Non-locale-aware number formatting",
        `${file} uses toFixed() without locale-aware alternatives`,
        "Use toLocaleString() or Intl.NumberFormat", file),
    );
  }

  const dateRegex = /(?:new\s+Date|Date\.(?:now|parse))\s*\(/g;
  const toLocaleDateRegex = /toLocaleDateString\s*\(/g;
  const dateCount = (content.match(dateRegex) || []).length;
  const localeDateCount = (content.match(toLocaleDateRegex) || []).length;
  if (dateCount > 3 && localeDateCount === 0) {
    issues.push(
      createIssue("localization", "low", "Non-locale-aware date handling",
        `${file} uses Date without locale-aware formatting`,
        "Use toLocaleDateString() or Intl.DateTimeFormat", file),
    );
  }
}

function checkPluralization(file: string, content: string, issues: AnalysisIssue[]): void {
  const pluralRegex = /\?\s*["'`]s["'`]\s*:\s*["'`]["'`]/g;
  if (pluralRegex.test(content)) {
    issues.push(
      createIssue("localization", "low", "Hardcoded pluralization",
        `${file} uses hardcoded plural rules (e.g., ? 's' : '')`,
        "Use ICU MessageFormat or i18n plural rules", file),
    );
  }
}
