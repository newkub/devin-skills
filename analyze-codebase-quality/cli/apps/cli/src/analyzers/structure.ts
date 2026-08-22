import type { AnalysisConfig, AnalysisIssue, AnalysisResult } from "@analyze-codebase-quality/shared";
import { createIssue, createResult } from "@analyze-codebase-quality/shared";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { walkFiles, countLines, readFileContent } from "../file-utils.js";

export function analyzeStructure(config: AnalysisConfig): AnalysisResult {
  const issues: AnalysisIssue[] = [];
  const files = walkFiles(config.projectPath);

  for (const file of files) {
    const fullPath = join(config.projectPath, file);
    const lines = countLines(fullPath);

    if (lines > config.maxFileLines) {
      issues.push(
        createIssue(
          "structure",
          "high",
          "File exceeds line limit",
          `${file} has ${lines} lines (max ${config.maxFileLines})`,
          "Split file into smaller modules with single responsibility",
          file,
          1,
        ),
      );
    }

    const content = readFileContent(fullPath);
    const importCount = countImports(content);
    if (importCount > config.maxImports) {
      issues.push(
        createIssue(
          "structure",
          "medium",
          "High import count",
          `${file} has ${importCount} imports (max ${config.maxImports})`,
          "Reduce coupling by extracting or consolidating modules",
          file,
          1,
        ),
      );
    }

    const methodCount = countMethods(content);
    if (methodCount > config.maxMethods) {
      issues.push(
        createIssue(
          "structure",
          "medium",
          "SRP violation - too many functions",
          `${file} has ${methodCount} functions/methods (max ${config.maxMethods})`,
          "Split into separate modules with single responsibility",
          file,
          1,
        ),
      );
    }

    checkNamingConventions(file, issues);
  }

  checkDirectoryStructure(config.projectPath, issues);
  checkBarrelExports(config.projectPath, files, issues);

  return createResult("structure", issues, `Analyzed ${files.length} files`);
}

function countImports(content: string): number {
  const importRegex = /^(?:import|export\s+.*\s+from)\s+/gm;
  return (content.match(importRegex) || []).length;
}

function countMethods(content: string): number {
  const methodRegex = /(?:function|class|const\s+\w+\s*=\s*(?:async\s+)?\(|export\s+(?:async\s+)?function|public\s+|private\s+|protected\s+)/g;
  return (content.match(methodRegex) || []).length;
}

function checkNamingConventions(file: string, issues: AnalysisIssue[]): void {
  const parts = file.split("/");
  for (const part of parts) {
    if (part === part.toUpperCase() && part.length > 1 && !part.includes(".")) continue;
    if (part.includes(" ") || part.includes("_")) {
      issues.push(
        createIssue(
          "structure",
          "low",
          "Inconsistent naming convention",
          `${file} uses underscores or spaces`,
          "Use kebab-case for files",
          file,
        ),
      );
    }
  }
}

function checkDirectoryStructure(projectPath: string, issues: AnalysisIssue[]): void {
  const expectedDirs = ["src", "test", "docs"];
  for (const dir of expectedDirs) {
    if (!existsSync(join(projectPath, dir))) {
      issues.push(
        createIssue(
          "structure",
          "low",
          `Missing ${dir} directory`,
          `Expected ${dir}/ directory not found`,
          `Create ${dir}/ directory for better organization`,
        ),
      );
    }
  }
}

function checkBarrelExports(projectPath: string, files: string[], issues: AnalysisIssue[]): void {
  const dirs = new Set<string>();
  for (const file of files) {
    const dir = file.split("/").slice(0, -1).join("/");
    if (dir) dirs.add(dir);
  }
  for (const dir of dirs) {
    const indexPath = join(projectPath, dir, "index.ts");
    if (existsSync(indexPath)) continue;
    const dirFiles = files.filter((f) => f.startsWith(`${dir}/`) && f !== `${dir}/index.ts`);
    if (dirFiles.length > 5) {
      issues.push(
        createIssue(
          "structure",
          "low",
          "Missing barrel export",
          `${dir}/ has ${dirFiles.length} files but no index.ts`,
          "Create index.ts barrel export for cleaner imports",
          `${dir}/index.ts`,
        ),
      );
    }
  }
}
