import type { AnalysisConfig, AnalysisIssue, AnalysisResult } from "@analyze-codebase-quality/shared";
import { createIssue, createResult } from "@analyze-codebase-quality/shared";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { walkFiles, readFileContent } from "../file-utils.js";

export function analyzeMissingImplementation(config: AnalysisConfig): AnalysisResult {
  const issues: AnalysisIssue[] = [];
  const files = walkFiles(config.projectPath);

  for (const file of files) {
    const fullPath = join(config.projectPath, file);
    const content = readFileContent(fullPath);

    checkTodoComments(file, content, issues);
    checkMockData(file, content, issues);
    checkPlaceholderCode(file, content, issues);
    checkMissingTypes(file, content, issues);
    checkMissingValidation(file, content, issues);
  }

  checkInfrastructureGaps(config.projectPath, issues);
  checkMissingConfig(config.projectPath, issues);

  return createResult("missing-implementation", issues, `Analyzed ${files.length} files for missing implementation`);
}

function checkTodoComments(file: string, content: string, issues: AnalysisIssue[]): void {
  const todoRegex = /(?:\/\/|\/\*|<!--|#)\s*(?:TODO|FIXME|HACK|XXX|BUG|PLACEHOLDER|STUB|MOCK|FAKE)/gi;
  const matches = content.match(todoRegex) || [];
  if (matches.length > 0) {
    issues.push(
      createIssue("missing-implementation", "high", "TODO/FIXME comments",
        `${file} has ${matches.length} TODO/FIXME/HACK/MOCK comments`,
        "Implement or track in issue tracker", file),
    );
  }
}

function checkMockData(file: string, content: string, issues: AnalysisIssue[]): void {
  const mockRegex = /(?:mock|fake|stub|dummy)\s*(?:data|response|api|function|service)/gi;
  const matches = content.match(mockRegex) || [];
  if (matches.length > 0) {
    issues.push(
      createIssue("missing-implementation", "high", "Mock data usage",
        `${file} uses mock/fake/stub data`,
        "Replace with real API calls and data sources", file),
    );
  }

  const hardcodedDataRegex = /(?:const|let)\s+\w+\s*:\s*\w+\[\]\s*=\s*\[/g;
  const hardcodedCount = (content.match(hardcodedDataRegex) || []).length;
  if (hardcodedCount > 3) {
    issues.push(
      createIssue("missing-implementation", "medium", "Hardcoded data arrays",
        `${file} has ${hardcodedCount} hardcoded data arrays`,
        "Fetch data from API or database instead", file),
    );
  }
}

function checkPlaceholderCode(file: string, content: string, issues: AnalysisIssue[]): void {
  const placeholderRegex = /(?:pass|placeholder|not\s+implemented|coming\s+soon|wip|todo)/gi;
  const matches = content.match(placeholderRegex) || [];
  if (matches.length > 2) {
    issues.push(
      createIssue("missing-implementation", "medium", "Placeholder code",
        `${file} has ${matches.length} placeholder references`,
        "Implement the actual functionality", file),
    );
  }

  const emptyFunctionRegex = /(?:function|const)\s+\w+\s*(?:\([^)]*\))?\s*(?::\s*\w+)?\s*(?:=>\s*\{?\s*\}?\s*$|\{\s*\})/gm;
  if (emptyFunctionRegex.test(content)) {
    issues.push(
      createIssue("missing-implementation", "medium", "Empty function bodies",
        `${file} has empty function bodies`,
        "Implement the function logic", file),
    );
  }
}

function checkMissingTypes(file: string, content: string, issues: AnalysisIssue[]): void {
  const anyReturnRegex = /:\s*any\s*[,)\n]/g;
  if (anyReturnRegex.test(content)) {
    issues.push(
      createIssue("missing-implementation", "medium", "Missing return types",
        `${file} has functions returning any`,
        "Define proper return types", file),
    );
  }

  const paramRegex = /\(([^)]+)\)\s*:/g;
  const params = content.matchAll(paramRegex);
  for (const match of params) {
    if (match[1] && !match[1].includes(":") && !match[1].includes("...")) {
      issues.push(
        createIssue("missing-implementation", "low", "Missing parameter types",
          `${file} has function parameters without type annotations`,
          "Add type annotations for all parameters", file),
      );
      break;
    }
  }
}

function checkMissingValidation(file: string, content: string, issues: AnalysisIssue[]): void {
  const apiRegex = /(?:createServerFn|api\.|router\.|procedure|handler)\s*\(/g;
  const zodRegex = /z\.(?:object|string|number|boolean|array|enum|union|optional)/g;
  const hasApi = apiRegex.test(content);
  const hasValidation = zodRegex.test(content);
  if (hasApi && !hasValidation) {
    issues.push(
      createIssue("missing-implementation", "high", "Missing API input validation",
        `${file} has API handlers without Zod validation`,
        "Add Zod schema validation for all API inputs", file),
    );
  }
}

function checkInfrastructureGaps(projectPath: string, issues: AnalysisIssue[]): void {
  const infraFiles = [
    { file: ".env.example", msg: "Missing .env.example file", rec: "Create .env.example with required env vars" },
    { file: "Dockerfile", msg: "Missing Dockerfile", rec: "Add Dockerfile for containerized deployment" },
    { file: "README.md", msg: "Missing README.md", rec: "Create README.md with project documentation" },
    { file: "AGENTS.md", msg: "Missing AGENTS.md", rec: "Create AGENTS.md for AI agent instructions" },
  ];
  for (const { file, msg, rec } of infraFiles) {
    if (!existsSync(join(projectPath, file))) {
      issues.push(
        createIssue("missing-implementation", "medium", "Missing infrastructure file", msg, rec, file),
      );
    }
  }
}

function checkMissingConfig(projectPath: string, issues: AnalysisIssue[]): void {
  if (!existsSync(join(projectPath, "tsconfig.json"))) {
    issues.push(
      createIssue("missing-implementation", "high", "Missing tsconfig.json",
        "TypeScript configuration file not found",
        "Create tsconfig.json with strict mode enabled", "tsconfig.json"),
    );
  }

  if (!existsSync(join(projectPath, ".gitignore"))) {
    issues.push(
      createIssue("missing-implementation", "medium", "Missing .gitignore",
        "Git ignore file not found",
        "Create .gitignore with standard patterns", ".gitignore"),
    );
  }
}
