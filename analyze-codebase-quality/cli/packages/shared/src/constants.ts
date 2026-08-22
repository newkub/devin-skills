import type { AnalysisCategory, AnalysisCategoryOrder } from "./types.js";

export const DEFAULT_CATEGORY_ORDER: AnalysisCategoryOrder = [
  "structure",
  "foundation",
  "runtime",
  "ux",
  "localization",
  "missing-implementation",
  "features",
  "errors",
];

export const ALL_CATEGORIES: AnalysisCategory[] = [
  "structure",
  "foundation",
  "runtime",
  "ux",
  "localization",
  "features",
  "errors",
  "missing-implementation",
];

export const SEVERITY_ORDER = ["critical", "high", "medium", "low"] as const;

export const SEVERITY_SYMBOLS: Record<string, string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "🔵",
};

export const CATEGORY_LABELS: Record<AnalysisCategory, string> = {
  structure: "Code Structure",
  foundation: "Code Foundation",
  runtime: "Runtime Patterns",
  ux: "UX & Accessibility",
  localization: "Localization & i18n",
  features: "Features",
  errors: "Errors",
  "missing-implementation": "Missing Implementation",
};

export const DEFAULT_CONFIG = {
  maxFileLines: 250,
  maxImports: 10,
  maxMethods: 7,
  maxComplexity: 10,
  maxCognitiveComplexity: 15,
  maxNestingDepth: 4,
  maxParams: 4,
  maxFanOut: 7,
  maxDependencyDepth: 5,
} as const;

export const FILE_EXTENSIONS = {
  typescript: [".ts", ".tsx"],
  javascript: [".js", ".jsx"],
  vue: [".vue"],
  css: [".css", ".scss", ".less"],
  html: [".html"],
  json: [".json", ".jsonc"],
  markdown: [".md"],
} as const;

export const IGNORE_PATTERNS = [
  "node_modules",
  "dist",
  "build",
  ".turbo",
  ".git",
  "coverage",
  ".next",
  ".nuxt",
  ".output",
  "vendor",
  "__pycache__",
  ".venv",
  "target",
  "bin",
  "obj",
] as const;
