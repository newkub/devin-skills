import type { AnalysisConfig } from "./shared/index.js";
import { ALL_CATEGORIES, DEFAULT_CONFIG } from "./shared/index.js";
import { existsSync } from "node:fs";
import { join } from "node:path";

export function detectFrontend(projectPath: string): boolean {
  const frontendIndicators = [
    "index.html",
    "vite.config.ts",
    "vite.config.js",
    "next.config.js",
    "next.config.mjs",
    "nuxt.config.ts",
    "svelte.config.js",
    "angular.json",
    "src/App.tsx",
    "src/App.vue",
    "src/app.html",
  ];
  for (const indicator of frontendIndicators) {
    if (existsSync(join(projectPath, indicator))) return true;
  }
  return false;
}

export function detectErrors(projectPath: string): boolean {
  const errorIndicators = ["test-results", "playwright-report", "coverage", ".turbo"];
  for (const indicator of errorIndicators) {
    if (existsSync(join(projectPath, indicator))) return true;
  }
  return false;
}

export function detectComplexFeatures(projectPath: string): boolean {
  const complexIndicators = [
    "src/modules",
    "src/features",
    "src/services",
    "packages",
    "apps",
  ];
  let count = 0;
  for (const indicator of complexIndicators) {
    if (existsSync(join(projectPath, indicator))) count++;
  }
  return count >= 2;
}

export function createConfig(projectPath: string): AnalysisConfig {
  const absPath = projectPath.startsWith("/")
    ? projectPath
    : projectPath.startsWith("D:") || projectPath.startsWith("C:")
      ? projectPath
      : join(process.cwd(), projectPath);

  return {
    projectPath: absPath,
    hasFrontend: detectFrontend(absPath),
    hasErrors: detectErrors(absPath),
    hasComplexFeatures: detectComplexFeatures(absPath),
    categories: [...ALL_CATEGORIES],
    maxFileLines: DEFAULT_CONFIG.maxFileLines,
    maxImports: DEFAULT_CONFIG.maxImports,
    maxMethods: DEFAULT_CONFIG.maxMethods,
    maxComplexity: DEFAULT_CONFIG.maxComplexity,
    maxNestingDepth: DEFAULT_CONFIG.maxNestingDepth,
    maxParams: DEFAULT_CONFIG.maxParams,
    maxFanOut: DEFAULT_CONFIG.maxFanOut,
    maxDependencyDepth: DEFAULT_CONFIG.maxDependencyDepth,
  };
}
