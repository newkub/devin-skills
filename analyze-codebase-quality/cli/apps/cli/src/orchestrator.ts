import type {
  AnalysisCategory,
  AnalysisConfig,
  AnalysisResult,
  ConsolidatedReport,
} from "@analyze-codebase-quality/shared";
import { DEFAULT_CATEGORY_ORDER, createStats } from "@analyze-codebase-quality/shared";
import { analyzeStructure } from "./analyzers/structure.js";
import { analyzeFoundation } from "./analyzers/foundation.js";
import { analyzeRuntime } from "./analyzers/runtime.js";
import { analyzeUx } from "./analyzers/ux.js";
import { analyzeLocalization } from "./analyzers/localization.js";
import { analyzeFeatures } from "./analyzers/features.js";
import { analyzeErrors } from "./analyzers/errors.js";
import { analyzeMissingImplementation } from "./analyzers/missing-implementation.js";

const ANALYZERS: Record<AnalysisCategory, (config: AnalysisConfig) => AnalysisResult> = {
  structure: analyzeStructure,
  foundation: analyzeFoundation,
  runtime: analyzeRuntime,
  ux: analyzeUx,
  localization: analyzeLocalization,
  features: analyzeFeatures,
  errors: analyzeErrors,
  "missing-implementation": analyzeMissingImplementation,
};

export function analyzeAll(config: AnalysisConfig): ConsolidatedReport {
  const results: AnalysisResult[] = [];
  const categories = config.categories.length > 0
    ? config.categories
    : DEFAULT_CATEGORY_ORDER;

  for (const category of categories) {
    const analyzer = ANALYZERS[category];
    if (!analyzer) continue;
    const result = analyzer(config);
    results.push(result);
  }

  return consolidateReport(results, config.projectPath);
}

export function analyzeCategory(
  category: AnalysisCategory,
  config: AnalysisConfig,
): AnalysisResult {
  const analyzer = ANALYZERS[category];
  if (!analyzer) {
    throw new Error(`Unknown analysis category: ${category}`);
  }
  return analyzer(config);
}

function consolidateReport(results: AnalysisResult[], projectPath: string): ConsolidatedReport {
  const allIssues = results.flatMap((r) => r.issues);
  const stats = createStats(allIssues);

  return {
    results,
    totalIssues: allIssues.length,
    stats,
    projectPath,
    timestamp: new Date().toISOString(),
  };
}
