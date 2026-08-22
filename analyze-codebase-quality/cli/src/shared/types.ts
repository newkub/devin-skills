export interface AnalysisIssue {
  category: string;
  severity: Severity;
  title: string;
  description: string;
  file?: string;
  line?: number;
  recommendation: string;
}

export type Severity = "critical" | "high" | "medium" | "low";

export type AnalysisCategory =
  | "structure"
  | "foundation"
  | "runtime"
  | "ux"
  | "localization"
  | "features"
  | "errors"
  | "missing-implementation";

export interface AnalysisResult {
  category: AnalysisCategory;
  issues: AnalysisIssue[];
  summary: string;
  stats: AnalysisStats;
}

export interface AnalysisStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface AnalysisConfig {
  projectPath: string;
  hasFrontend: boolean;
  hasErrors: boolean;
  hasComplexFeatures: boolean;
  categories: AnalysisCategory[];
  maxFileLines: number;
  maxImports: number;
  maxMethods: number;
  maxComplexity: number;
  maxNestingDepth: number;
  maxParams: number;
  maxFanOut: number;
  maxDependencyDepth: number;
}

export interface ConsolidatedReport {
  results: AnalysisResult[];
  totalIssues: number;
  stats: AnalysisStats;
  projectPath: string;
  timestamp: string;
}

export type AnalysisCategoryOrder = AnalysisCategory[];

export interface Analyzer {
  name: string;
  category: AnalysisCategory;
  analyze(config: AnalysisConfig): Promise<AnalysisResult>;
}
