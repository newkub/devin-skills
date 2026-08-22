import type { AnalysisConfig, AnalysisIssue, AnalysisResult } from "../../shared/index.js";
import { createIssue, createResult } from "../../shared/index.js";
import { join, basename } from "node:path";
import { existsSync, readdirSync, statSync } from "node:fs";
import { walkFiles, readFileContent } from "../../adapters/filesystem/file-adapter.js";

export function analyzeFeatures(config: AnalysisConfig): AnalysisResult {
  const issues: AnalysisIssue[] = [];

  if (!config.hasComplexFeatures) {
    return createResult("features", [], "Skipped - no complex features detected");
  }

  const files = walkFiles(config.projectPath);
  const features = discoverFeatures(config.projectPath, files);

  for (const feature of features) {
    checkFeatureCompleteness(feature, issues);
    checkFeatureDocumentation(feature, issues);
    checkFeatureTests(feature, issues);
  }

  checkFeatureDependencies(features, issues);
  checkFeatureIsolation(features, issues);

  return createResult("features", issues, `Discovered ${features.length} features`);
}

interface Feature {
  name: string;
  path: string;
  files: string[];
  hasDocs: boolean;
  hasTests: boolean;
  hasSchema: boolean;
  hasComponents: boolean;
  hasServices: boolean;
}

function discoverFeatures(projectPath: string, files: string[]): Feature[] {
  const featureDirs = new Set<string>();
  const modulePaths = ["src/modules", "src/features", "modules", "features"];

  for (const mp of modulePaths) {
    const fullPath = join(projectPath, mp);
    if (existsSync(fullPath)) {
      try {
        const entries = readdirSync(fullPath);
        for (const entry of entries) {
          const entryPath = join(fullPath, entry);
          if (statSync(entryPath).isDirectory()) {
            featureDirs.add(entryPath);
          }
        }
      } catch {
      }
    }
  }

  return Array.from(featureDirs).map((dir) => {
    const name = basename(dir);
    const featureFiles = files.filter((f) => f.includes(`${name}/`));
    return {
      name,
      path: dir,
      files: featureFiles,
      hasDocs: featureFiles.some((f) => f.endsWith(".md")),
      hasTests: featureFiles.some((f) => f.includes("test") || f.includes("spec")),
      hasSchema: featureFiles.some((f) => f.includes("schema")),
      hasComponents: featureFiles.some((f) => f.includes("component")),
      hasServices: featureFiles.some((f) => f.includes("service")),
    };
  });
}

function checkFeatureCompleteness(feature: Feature, issues: AnalysisIssue[]): void {
  if (feature.files.length < 3) {
    issues.push(
      createIssue("features", "low", "Thin feature module",
        `${feature.name} has only ${feature.files.length} files`,
        "Consider if this feature needs more structure or should be merged", feature.name),
    );
  }
  if (feature.hasComponents && !feature.hasServices) {
    issues.push(
      createIssue("features", "medium", "Missing service layer",
        `${feature.name} has components but no services`,
        "Add service layer for business logic separation", feature.name),
    );
  }
}

function checkFeatureDocumentation(feature: Feature, issues: AnalysisIssue[]): void {
  if (!feature.hasDocs) {
    issues.push(
      createIssue("features", "low", "Missing feature documentation",
        `${feature.name} has no documentation`,
        "Add README.md or documentation for the feature", feature.name),
    );
  }
}

function checkFeatureTests(feature: Feature, issues: AnalysisIssue[]): void {
  if (!feature.hasTests) {
    issues.push(
      createIssue("features", "medium", "Missing feature tests",
        `${feature.name} has no test files`,
        "Add test files for the feature", feature.name),
    );
  }
}

function checkFeatureDependencies(features: Feature[], issues: AnalysisIssue[]): void {
  for (const feature of features) {
    const otherFeatures = features.filter((f) => f.name !== feature.name);
    for (const other of otherFeatures) {
      const imports = feature.files.some((f) => {
        const content = readFileContent(join(feature.path, f.split("/").pop() || ""));
        return content.includes(other.name);
      });
      if (imports) {
        issues.push(
          createIssue("features", "low", "Cross-feature dependency",
            `${feature.name} may import from ${other.name}`,
            "Consider using a shared interface instead of direct imports", feature.name),
        );
      }
    }
  }
}

function checkFeatureIsolation(features: Feature[], issues: AnalysisIssue[]): void {
  for (const feature of features) {
    if (feature.files.length > 20) {
      issues.push(
        createIssue("features", "medium", "Large feature module",
          `${feature.name} has ${feature.files.length} files`,
          "Consider splitting into sub-features", feature.name),
      );
    }
  }
}
