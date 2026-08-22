import type { AnalysisConfig, AnalysisIssue, AnalysisResult } from "@analyze-codebase-quality/shared";
import { createIssue, createResult } from "@analyze-codebase-quality/shared";
import { join } from "node:path";
import { walkFiles, readFileContent } from "../file-utils.js";

export function analyzeFoundation(config: AnalysisConfig): AnalysisResult {
  const issues: AnalysisIssue[] = [];
  const files = walkFiles(config.projectPath);

  for (const file of files) {
    const fullPath = join(config.projectPath, file);
    const content = readFileContent(fullPath);

    checkTypeSafety(file, content, issues);
    checkHardCode(file, content, issues);
    checkAntiPatterns(file, content, issues);
    checkDeadCode(file, content, issues);
    checkSideEffects(file, content, issues);
    checkComplexity(file, content, issues, config);
    checkNaming(file, content, issues);
  }

  return createResult("foundation", issues, `Analyzed ${files.length} files for foundation quality`);
}

function checkTypeSafety(file: string, content: string, issues: AnalysisIssue[]): void {
  const anyTypeRegex = /:\s*any\b/g;
  const anyMatches = content.match(anyTypeRegex) || [];
  if (anyMatches.length > 0) {
    issues.push(
      createIssue("foundation", "high", "`any` type usage",
        `${file} has ${anyMatches.length} \`any\` type annotations`,
        "Replace `any` with `unknown` or proper types", file),
    );
  }

  if (content.includes("@ts-ignore") || content.includes("@ts-nocheck")) {
    issues.push(
      createIssue("foundation", "high", "TypeScript suppression",
        `${file} uses @ts-ignore or @ts-nocheck`,
        "Fix the underlying type error instead of suppressing", file),
    );
  }

  const asAnyRegex = /\bas\s+any\b/g;
  if (asAnyRegex.test(content)) {
    issues.push(
      createIssue("foundation", "medium", "Unsafe type assertion",
        `${file} uses \`as any\` type assertion`,
        "Use proper type guards or runtime validation", file),
    );
  }
}

function checkHardCode(file: string, content: string, issues: AnalysisIssue[]): void {
  const urlRegex = /https?:\/\/[^ "'`]+/g;
  const urls = content.match(urlRegex) || [];
  if (urls.length > 0) {
    issues.push(
      createIssue("foundation", "medium", "Hardcoded URL",
        `${file} has ${urls.length} hardcoded URLs`,
        "Move URLs to configuration or environment variables", file),
    );
  }

  const magicNumberRegex = /(?<![\w.])\d{4,}(?![\w.])/g;
  const magicNumbers = content.match(magicNumberRegex) || [];
  if (magicNumbers.length > 2) {
    issues.push(
      createIssue("foundation", "low", "Magic numbers",
        `${file} has ${magicNumbers.length} magic numbers`,
        "Extract magic numbers to named constants", file),
    );
  }
}

function checkAntiPatterns(file: string, content: string, issues: AnalysisIssue[]): void {
  const consoleRegex = /console\.(log|error|warn|debug|info)\(/g;
  const consoleMatches = content.match(consoleRegex) || [];
  if (consoleMatches.length > 3) {
    issues.push(
      createIssue("foundation", "medium", "Console statements in production",
        `${file} has ${consoleMatches.length} console statements`,
        "Use a proper logger instead of console", file),
    );
  }

  const emptyCatchRegex = /catch\s*\([^)]*\)\s*\{\s*\}/g;
  if (emptyCatchRegex.test(content)) {
    issues.push(
      createIssue("foundation", "high", "Empty catch block",
        `${file} has empty catch blocks that swallow errors`,
        "Handle errors properly or re-throw them", file),
    );
  }

  const deepNestingRegex = /\{[^{}]*\{[^{}]*\{[^{}]*\{[^{}]*\{/g;
  if (deepNestingRegex.test(content)) {
    issues.push(
      createIssue("foundation", "medium", "Deep nesting",
        `${file} has nesting deeper than 4 levels`,
        "Extract nested logic to separate functions", file),
    );
  }
}

function checkDeadCode(file: string, content: string, issues: AnalysisIssue[]): void {
  const commentedRegex = /^\s*\/\/.*(?:TODO|FIXME|HACK|XXX|BUG)/gm;
  const todos = content.match(commentedRegex) || [];
  if (todos.length > 0) {
    issues.push(
      createIssue("foundation", "low", "TODO/FIXME comments",
        `${file} has ${todos.length} TODO/FIXME/HACK comments`,
        "Resolve or track these in issue tracker", file),
    );
  }
}

function checkSideEffects(file: string, content: string, issues: AnalysisIssue[]): void {
  const globalMutationRegex = /^(?:let|var)\s+\w+/gm;
  const globals = content.match(globalMutationRegex) || [];
  if (globals.length > 5) {
    issues.push(
      createIssue("foundation", "low", "Mutable module-level variables",
        `${file} has ${globals.length} mutable top-level variables`,
        "Prefer const and functional patterns", file),
    );
  }
}

function checkComplexity(file: string, content: string, issues: AnalysisIssue[], config: AnalysisConfig): void {
  const ifRegex = /\bif\s*\(/g;
  const elseRegex = /\belse\b/g;
  const forRegex = /\bfor\s*\(/g;
  const whileRegex = /\bwhile\s*\(/g;
  const caseRegex = /\bcase\s/g;
  const complexity = (content.match(ifRegex) || []).length + (content.match(elseRegex) || []).length +
    (content.match(forRegex) || []).length + (content.match(whileRegex) || []).length +
    (content.match(caseRegex) || []).length;
  if (complexity > config.maxComplexity) {
    issues.push(
      createIssue("foundation", "medium", "High cyclomatic complexity",
        `${file} has complexity ${complexity} (max ${config.maxComplexity})`,
        "Refactor to reduce branching - extract functions or use polymorphism", file),
    );
  }
}

function checkNaming(file: string, content: string, issues: AnalysisIssue[]): void {
  const genericNames = /\b(?:Manager|Handler|Processor|Utility|Helper|Util|Stuff|Thing|Object|Data|Info)\b/g;
  const generics = content.match(genericNames) || [];
  if (generics.length > 2) {
    issues.push(
      createIssue("foundation", "low", "Generic naming",
        `${file} uses generic names: ${generics.slice(0, 3).join(", ")}`,
        "Use domain-specific names that describe responsibility", file),
    );
  }
}
