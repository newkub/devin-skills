import { createConfig } from "../src/config.js";
import { analyzeStructure } from "../src/domain/analyzers/structure.js";
import { analyzeFoundation } from "../src/domain/analyzers/foundation.js";
import { analyzeRuntime } from "../src/domain/analyzers/runtime.js";
import { analyzeAll, analyzeCategory } from "../src/application/orchestrator.js";
import {
  formatTable,
  formatSummary,
  formatDetails,
  formatSingleResultTable,
  createIssue,
  createStats,
  sortIssuesBySeverity,
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  SEVERITY_ICONS,
} from "../src/shared/index.js";
import { join } from "node:path";

const projectPath = join(import.meta.dir, "..");

describe("config", () => {
  it("should create config with correct path", () => {
    const config = createConfig(projectPath);
    expect(config.projectPath).toBe(projectPath);
    expect(config.maxFileLines).toBe(250);
    expect(config.maxImports).toBe(10);
  });

  it("should detect categories", () => {
    const config = createConfig(projectPath);
    expect(config.categories.length).toBeGreaterThan(0);
  });
});

describe("structure analyzer", () => {
  it("should return a result with issues array", () => {
    const config = createConfig(projectPath);
    const result = analyzeStructure(config);
    expect(result.category).toBe("structure");
    expect(Array.isArray(result.issues)).toBe(true);
    expect(result.stats.total).toBe(result.issues.length);
  });

  it("should have stats matching issue count", () => {
    const config = createConfig(projectPath);
    const result = analyzeStructure(config);
    expect(result.stats.total).toBe(result.issues.length);
    expect(result.stats.critical + result.stats.high + result.stats.medium + result.stats.low).toBe(
      result.stats.total,
    );
  });
});

describe("foundation analyzer", () => {
  it("should return a result with issues array", () => {
    const config = createConfig(projectPath);
    const result = analyzeFoundation(config);
    expect(result.category).toBe("foundation");
    expect(Array.isArray(result.issues)).toBe(true);
  });
});

describe("runtime analyzer", () => {
  it("should return a result with issues array", () => {
    const config = createConfig(projectPath);
    const result = analyzeRuntime(config);
    expect(result.category).toBe("runtime");
    expect(Array.isArray(result.issues)).toBe(true);
    expect(result.stats.total).toBe(result.issues.length);
  });
});

describe("orchestrator", () => {
  it("should run all analyzers and return consolidated report", () => {
    const config = createConfig(projectPath);
    const report = analyzeAll(config);
    expect(report.results.length).toBeGreaterThan(0);
    expect(report.totalIssues).toBeGreaterThanOrEqual(0);
    expect(report.stats.total).toBe(report.totalIssues);
  });

  it("should run single category via analyzeCategory", () => {
    const config = createConfig(projectPath);
    const result = analyzeCategory("structure", config);
    expect(result.category).toBe("structure");
    expect(Array.isArray(result.issues)).toBe(true);
  });
});

describe("shared utils", () => {
  it("should create issue with correct fields", () => {
    const issue = createIssue("test", "high", "Title", "Desc", "Rec", "file.ts", 10);
    expect(issue.category).toBe("test");
    expect(issue.severity).toBe("high");
    expect(issue.title).toBe("Title");
    expect(issue.file).toBe("file.ts");
    expect(issue.line).toBe(10);
  });

  it("should create stats from issues", () => {
    const issues = [
      createIssue("test", "critical", "A", "D", "R"),
      createIssue("test", "high", "B", "D", "R"),
      createIssue("test", "low", "C", "D", "R"),
    ];
    const stats = createStats(issues);
    expect(stats.total).toBe(3);
    expect(stats.critical).toBe(1);
    expect(stats.high).toBe(1);
    expect(stats.low).toBe(1);
  });

  it("should sort issues by severity (critical first)", () => {
    const issues = [
      createIssue("test", "low", "Low", "D", "R"),
      createIssue("test", "critical", "Critical", "D", "R"),
      createIssue("test", "medium", "Medium", "D", "R"),
    ];
    const sorted = sortIssuesBySeverity(issues);
    expect(sorted[0].severity).toBe("critical");
    expect(sorted[1].severity).toBe("medium");
    expect(sorted[2].severity).toBe("low");
  });
});

describe("formatters", () => {
  const mockReport = {
    results: [
      {
        category: "structure" as const,
        issues: [createIssue("structure", "high", "Test issue", "Test desc", "Test rec", "test.ts", 1)],
        summary: "Test summary",
        stats: createStats([createIssue("structure", "high", "Test issue", "D", "R")]),
      },
    ],
    totalIssues: 1,
    stats: createStats([createIssue("structure", "high", "Test issue", "D", "R")]),
    projectPath: "/test",
    timestamp: "2026-01-01T00:00:00.000Z",
  };

  it("should format table with header and rows", () => {
    const output = formatTable(mockReport);
    expect(output).toContain("Codebase Quality Analyzer");
    expect(output).toContain("Category");
    expect(output).toContain("TOTAL");
  });

  it("should format summary with counts", () => {
    const output = formatSummary(mockReport);
    expect(output).toContain("Summary");
    expect(output).toContain("Total Issues:");
  });

  it("should format details with issue info", () => {
    const output = formatDetails(mockReport);
    expect(output).toContain("Test issue");
    expect(output).toContain("test.ts");
  });

  it("should format single result table", () => {
    const result = mockReport.results[0];
    const output = formatSingleResultTable(result);
    expect(output).toContain("Code Structure");
    expect(output).toContain("Severity");
    expect(output).toContain("Total:");
  });
});

describe("constants", () => {
  it("should have 8 categories", () => {
    expect(ALL_CATEGORIES.length).toBe(8);
  });

  it("should have labels for all categories", () => {
    for (const cat of ALL_CATEGORIES) {
      expect(CATEGORY_LABELS[cat]).toBeTruthy();
    }
  });

  it("should have icons for all severities", () => {
    expect(SEVERITY_ICONS.critical).toBeTruthy();
    expect(SEVERITY_ICONS.high).toBeTruthy();
    expect(SEVERITY_ICONS.medium).toBeTruthy();
    expect(SEVERITY_ICONS.low).toBeTruthy();
  });
});
