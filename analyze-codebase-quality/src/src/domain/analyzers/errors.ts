import type { AnalysisConfig, AnalysisIssue, AnalysisResult } from "../../shared/index.js";
import { createIssue, createResult } from "../../shared/index.js";
import { join } from "node:path";
import { existsSync, readdirSync } from "node:fs";
import { walkFiles, readFileContent } from "../../adapters/filesystem/file-adapter.js";

export function analyzeErrors(config: AnalysisConfig): AnalysisResult {
  const issues: AnalysisIssue[] = [];

  if (!config.hasErrors) {
    return createResult("errors", [], "Skipped - no error indicators detected");
  }

  checkBuildArtifacts(config.projectPath, issues);
  checkTestFailures(config.projectPath, issues);
  checkLintErrors(config.projectPath, issues);
  checkTypeErrors(config.projectPath, issues);

  for (const file of walkFiles(config.projectPath)) {
    const fullPath = join(config.projectPath, file);
    const content = readFileContent(fullPath);
    checkErrorPatterns(file, content, issues);
  }

  return createResult("errors", issues, "Analyzed error patterns in codebase");
}

function checkBuildArtifacts(projectPath: string, issues: AnalysisIssue[]): void {
  const buildDirs = ["dist", "build", ".turbo", ".next", ".nuxt", ".output"];
  for (const dir of buildDirs) {
    const path = join(projectPath, dir);
    if (existsSync(path)) {
      issues.push(
        createIssue("errors", "low", "Stale build artifacts",
          `${dir}/ directory exists - may contain outdated builds`,
          "Clean build artifacts with rm -rf dist/ before building", dir),
      );
    }
  }
}

function checkTestFailures(projectPath: string, issues: AnalysisIssue[]): void {
  const testResultDirs = ["test-results", "playwright-report", "coverage"];
  for (const dir of testResultDirs) {
    const path = join(projectPath, dir);
    if (existsSync(path)) {
      try {
        const entries = readdirSync(path);
        if (entries.length > 0) {
          issues.push(
            createIssue("errors", "medium", "Test results present",
              `${dir}/ has ${entries.length} entries - check for failures`,
              "Review test results and fix any failures", dir),
          );
        }
      } catch {
      }
    }
  }
}

function checkLintErrors(projectPath: string, issues: AnalysisIssue[]): void {
  const lintConfigs = [".eslintrc", ".eslintrc.js", ".eslintrc.json", "biome.jsonc", "biome.json"];
  for (const config of lintConfigs) {
    if (existsSync(join(projectPath, config))) {
      issues.push(
        createIssue("errors", "low", "Lint configuration detected",
          `${config} found - run lint to check for errors`,
          "Run `bun run lint` to identify lint issues", config),
      );
      break;
    }
  }
}

function checkTypeErrors(projectPath: string, issues: AnalysisIssue[]): void {
  if (existsSync(join(projectPath, "tsconfig.json"))) {
    issues.push(
      createIssue("errors", "low", "TypeScript configuration detected",
        "tsconfig.json found - run typecheck to check for type errors",
        "Run `bun run typecheck` to identify type issues", "tsconfig.json"),
    );
  }
}

function checkErrorPatterns(file: string, content: string, issues: AnalysisIssue[]): void {
  const errorRegex = /\bthrow\s+new\s+Error\s*\(\s*["'`]/g;
  const errorCount = (content.match(errorRegex) || []).length;
  if (errorCount > 5) {
    issues.push(
      createIssue("errors", "low", "High error throw count",
        `${file} throws ${errorCount} errors`,
        "Consider using Result type or error boundaries", file),
    );
  }

  const undefinedRegex = /===?\s*(?:undefined|null)\b/g;
  const undefinedCount = (content.match(undefinedRegex) || []).length;
  if (undefinedCount > 10) {
    issues.push(
      createIssue("errors", "medium", "Frequent null/undefined checks",
        `${file} has ${undefinedCount} null/undefined comparisons`,
        "Use optional chaining or nullish coalescing", file),
    );
  }

  const anyRegex = /:\s*any\b/g;
  const anyCount = (content.match(anyRegex) || []).length;
  if (anyCount > 5) {
    issues.push(
      createIssue("errors", "high", "Excessive any types",
        `${file} has ${anyCount} any type annotations`,
        "Replace any with unknown or proper types", file),
    );
  }
}
