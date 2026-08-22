# analyze-codebase-quality
> 🚀 Analyze codebase quality across 8 dimensions with a beautiful CLI

A static analysis CLI tool that scans your codebase for quality issues across structure, foundation, runtime, UX, localization, features, errors, and missing implementation.

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![Bun](https://img.shields.io/badge/runtime-Bun-f9f1e1?logo=bun)
![TypeScript](https://img.shields.io/badge/lang-TypeScript-3178c6?logo=typescript)

## Quick Start

1. **Install** — `terminal`
   Install the CLI globally or use directly with bun
   ```bash
   bun add -g analyze-codebase-quality
   ```
2. **Analyze** — `terminal`
   Run the analyzer on your project
   ```bash
   analyze-codebase-quality .
   ```
3. **View Report** — `terminal`
   Get a colored table report with issue details
   ```text
   Category                   Total    🔴    🟠    🟡    🔵   Status
   Code Structure                11     0     0     8     3     PASS
   Code Foundation               20     0     1    18     1     WARN
   Runtime Patterns               8     1     3     3     1     FAIL
   ```

## Features

| :---: | Feature | Description | Benefit | Usage |
|------|---------|-------------|---------|-------|
| ![icon](https://api.iconify.design/mdi:file-tree.svg?color=303f9f) | Code Structure | File tree, SRP violations, naming, barrel exports | Catch structural issues early | `--category=structure` |
| ![icon](https://api.iconify.design/mdi:foundation.svg?color=388e3c) | Code Foundation | Type safety, hard code, anti-patterns, complexity | Prevent foundational problems | `--category=foundation` |
| ![icon](https://api.iconify.design/mdi:run-fast.svg?color=d32f2f) | Runtime Patterns | Error handling, async, concurrency, security | Find runtime bugs before production | `--category=runtime` |
| ![icon](https://api.iconify.design/mdi:accessibility.svg?color=7b1fa2) | UX & Accessibility | WCAG, ARIA, keyboard nav, responsive | Ensure inclusive user experience | `--category=ux` |
| ![icon](https://api.iconify.design/mdi:translate.svg?color=c2185b) | Localization | Hardcoded strings, RTL, locale, pluralization | Prepare for international markets | `--category=localization` |
| ![icon](https://api.iconify.design/mdi:view-module.svg?color=f57c00) | Features | Feature discovery, docs, tests, isolation | Track feature completeness | `--category=features` |
| ![icon](https://api.iconify.design/mdi:alert-circle.svg?color=d32f2f) | Errors | Build artifacts, test failures, error patterns | Identify error-prone code | `--category=errors` |
| ![icon](https://api.iconify.design/mdi:clipboard-list.svg?color=0097a7) | Missing Implementation | TODOs, mock data, placeholders, gaps | Find unfinished work | `--category=missing-implementation` |
| ![icon](https://api.iconify.design/mdi:table.svg?color=1976d2) | Table Output | Colored summary table with status badges | Quick overview of project health | Default mode |
| ![icon](https://api.iconify.design/mdi:format-list-bulleted.svg?color=388e3c) | Detail View | Issue details with file location and fix recommendations | Understand and fix each issue | Default mode |
| ![icon](https://api.iconify.design/mdi:filter-variant.svg?color=f57c00) | Severity Filter | Show only critical/high/medium/low issues | Focus on what matters most | `--severity=high` |
| ![icon](https://api.iconify.design/mdi:export.svg?color=00796b) | Multiple Formats | Table, JSON, Markdown, Plain text output | Integrate with any workflow | `--format=json` |
| ![icon](https://api.iconify.design/mdi:palette.svg?color=7b1fa2) | Colored Output | ANSI colors with severity-based highlighting | Read reports faster | Default, `--no-color` to disable |
| ![icon](https://api.iconify.design/mdi:package-variant.svg?color=303f9f) | SDK Library | Import analyzers as a library | Build custom analysis tools | `import { analyzeAll }` |

## Usage

### terminal — Default table report

```bash
# Analyze current directory
analyze-codebase-quality .

# Analyze specific project
analyze-codebase-quality /path/to/project
```

### terminal — JSON output

```bash
analyze-codebase-quality . --json --output=report.json
```

### terminal — Single category with severity filter

```bash
analyze-codebase-quality . --category=structure --severity=high
```

### terminal — Quiet mode (table only, no details)

```bash
analyze-codebase-quality . --quiet
```

### terminal — Markdown format

```bash
analyze-codebase-quality . --format=markdown --output=report.md
```

### library.ts — Use as SDK

```typescript
import { analyzeAll, createConfig } from "analyze-codebase-quality";

const config = createConfig("./my-project");
const report = analyzeAll(config);

console.log(`Found ${report.totalIssues} issues`);
for (const result of report.results) {
  console.log(`${result.category}: ${result.stats.total} issues`);
}
```

## Project

<details><summary>Goal</summary>

| :---: | Goal | Status | Description |
|------|------|--------|-------------|
| ![icon](https://api.iconify.design/mdi:target.svg?color=388e3c) | Multi-dimensional analysis | ✓ Goal | Analyze codebase across 8 quality dimensions |
| ![icon](https://api.iconify.design/mdi:console.svg?color=388e3c) | CLI-first | ✓ Goal | Beautiful CLI with table output and colored details |
| ![icon](https://api.iconify.design/mdi:package.svg?color=388e3c) | SDK library | ✓ Goal | Usable as both CLI and importable library |
| ![icon](https://api.iconify.design/mdi:close.svg?color=d32f2f) | Auto-fix | ✗ Not Goal | Does not automatically fix code |
| ![icon](https://api.iconify.design/mdi:close.svg?color=d32f2f) | LSP server | ✗ Not Goal | Does not provide language server protocol |

</details>

<details><summary>Scope</summary>

| :---: | Scope | Status | Description |
|------|-------|--------|-------------|
| ![icon](https://api.iconify.design/mdi:check.svg?color=388e3c) | Static analysis | ✓ In Scope | Pattern-based code scanning |
| ![icon](https://api.iconify.design/mdi:check.svg?color=388e3c) | TypeScript/JS | ✓ In Scope | Analyze .ts, .tsx, .js, .jsx files |
| ![icon](https://api.iconify.design/mdi:check.svg?color=388e3c) | Multiple formats | ✓ In Scope | Table, JSON, Markdown, Plain output |
| ![icon](https://api.iconify.design/mdi:check.svg?color=388e3c) | Configurable | ✓ In Scope | Severity filter, category filter, color toggle |
| ![icon](https://api.iconify.design/mdi:close.svg?color=d32f2f) | Runtime analysis | ✗ Out of Scope | Does not execute code |
| ![icon](https://api.iconify.design/mdi:close.svg?color=d32f2f) | AST parsing | ✗ Out of Scope | Uses regex patterns, not full AST |

</details>

<details><summary>Key Concepts</summary>

| :---: | Concept | Description |
|------|---------|-------------|
| ![icon](https://api.iconify.design/mdi:lightbulb.svg?color=303f9f) | Pure functions | Each analyzer is a pure function returning AnalysisResult |
| ![icon](https://api.iconify.design/mdi:lightbulb.svg?color=303f9f) | Orchestrator | Runs all analyzers and consolidates into a single report |
| ![icon](https://api.iconify.design/mdi:lightbulb.svg?color=303f9f) | Severity levels | critical, high, medium, low with icons and colors |
| ![icon](https://api.iconify.design/mdi:lightbulb.svg?color=303f9f) | Category-based | 8 independent categories that can run individually |

</details>

<details><summary>Core Principles</summary>

| :---: | Principle | Description |
|------|-----------|-------------|
| ![icon](https://api.iconify.design/mdi:shield.svg?color=388e3c) | Zero dependencies | Runtime has no external dependencies |
| ![icon](https://api.iconify.design/mdi:speedometer.svg?color=f57c00) | Fast | Pattern-based scanning completes in milliseconds |
| ![icon](https://api.iconify.design/mdi:eye.svg?color=1976d2) | Readable | Colored table output with clear issue details |
| ![icon](https://api.iconify.design/mdi:puzzle.svg?color=7b1fa2) | Extensible | Add new analyzers by implementing the Analyzer interface |

</details>

<details><summary>When To Use</summary>

| :---: | Use Case | Description |
|------|----------|-------------|
| ![icon](https://api.iconify.design/mdi:clock-outline.svg?color=0097a7) | Pre-commit check | Run before commits to catch quality issues |
| ![icon](https://api.iconify.design/mdi:ci.svg?color=388e3c) | CI/CD pipeline | Integrate into CI for automated quality gates |
| ![icon](https://api.iconify.design/mdi:magnify.svg?color=303f9f) | Code review | Generate reports to guide review focus areas |
| ![icon](https://api.iconify.design/mdi:chart-line.svg?color=f57c00) | Tech debt tracking | Track issues over time to measure improvement |

</details>

<details><summary>Best Practices</summary>

| :---: | Practice | Description |
|------|----------|-------------|
| ![icon](https://api.iconify.design/mdi:check-circle.svg?color=388e3c) | Use --severity=high | Focus on critical issues first |
| ![icon](https://api.iconify.design/mdi:check-circle.svg?color=388e3c) | Use --quiet for CI | Table-only output for concise CI logs |
| ![icon](https://api.iconify.design/mdi:check-circle.svg?color=388e3c) | Use --json for tools | Pipe to other tools for custom processing |
| ![icon](https://api.iconify.design/mdi:check-circle.svg?color=388e3c) | Run per-category | Use --category to focus on specific dimensions |

</details>

## API References

<details><summary>CLI Options</summary>

| Option | Description | Default |
|--------|-------------|---------|
| `[path]` | Project path to analyze | `.` |
| `--output=<path>` | Save report to file | stdout |
| `--format=<type>` | Output format: table, json, markdown, plain | `table` |
| `--category=<name>` | Run single category | all |
| `--severity=<level>` | Min severity: critical, high, medium, low | `low` |
| `--json` | Shortcut for --format=json | - |
| `--quiet, -q` | Summary only, no details | false |
| `--no-detail` | Table only, no issue details | false |
| `--no-color` | Disable colored output | false |
| `--list-categories` | List all analysis categories | - |
| `--help, -h` | Show help | - |

</details>

<details><summary>SDK Functions</summary>

| Function | Description |
|----------|-------------|
| `createConfig(path)` | Create analysis configuration for a project path |
| `analyzeAll(config)` | Run all analyzers and return ConsolidatedReport |
| `analyzeCategory(category, config)` | Run single analyzer and return AnalysisResult |
| `createIssue(...)` | Create an AnalysisIssue object |
| `createResult(...)` | Create an AnalysisResult object |
| `createStats(issues)` | Create AnalysisStats from issues |
| `sortIssuesBySeverity(issues)` | Sort issues by severity (critical first) |
| `formatTable(report)` | Format report as colored table |
| `formatDetails(report, opts)` | Format issue details section |
| `formatSummary(report)` | Format summary section |
| `formatResult(result)` | Format single result as markdown |

</details>

<details><summary>Types</summary>

| Type | Description |
|------|-------------|
| `AnalysisIssue` | Single issue with severity, title, description, file, recommendation |
| `AnalysisResult` | Result from one analyzer with issues and stats |
| `ConsolidatedReport` | All results combined with total stats |
| `AnalysisConfig` | Configuration for analysis including thresholds |
| `AnalysisStats` | Issue counts by severity |
| `Severity` | `critical` \| `high` \| `medium` \| `low` |
| `AnalysisCategory` | 8 category names |

</details>

## Development

<details><summary>Tech Stack</summary>

| Layer | Technology | Version | Description |
|-------|-------------|---------|-------------|
| Runtime | Bun | >= 1.3.0 | JavaScript runtime and package manager |
| Language | TypeScript | ^5.8.0 | Type-safe development |
| Monorepo | Turborepo | ^2.5.0 | Task orchestration across workspaces |
| Build | bunup | ^0.16.32 | TypeScript bundler |
| Linting | Biome | ^2.5.2 | Linting and formatting |
| Testing | Bun Test | built-in | Unit testing framework |

</details>

<details><summary>How It Work</summary>

```text
  ┌──────────┐     ┌──────────────┐     ┌─────────────────┐
  │  CLI Args │────▶│  createConfig │────▶│   Orchestrator   │
  └──────────┘     └──────────────┘     └────────┬────────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          ▼                     ▼                     ▼
                   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
                   │  structure   │      │ foundation   │      │  runtime    │
                   │  analyzer    │      │  analyzer    │      │  analyzer   │
                   └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
                          │                     │                     │
                          ▼                     ▼                     ▼
                   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
                   │     ux       │      │ localization │      │  features   │
                   │  analyzer    │      │  analyzer    │      │  analyzer   │
                   └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
                          │                     │                     │
                          ▼                     ▼                     ▼
                   ┌─────────────┐      ┌─────────────────┐
                   │   errors     │      │ missing-impl     │
                   │  analyzer    │      │    analyzer      │
                   └──────┬──────┘      └────────┬────────┘
                          │                      │
                          └──────────┬───────────┘
                                     ▼
                          ┌──────────────────┐
                          │ ConsolidatedReport │
                          └────────┬─────────┘
                                   ▼
                          ┌──────────────────┐
                          │  Table / JSON /   │
                          │  Markdown Output   │
                          └──────────────────┘
```

</details>

<details><summary>Architecture</summary>

```text
analyze-codebase-quality/
├── apps/cli/                    CLI application
│   ├── src/
│   │   ├── analyzers/           8 analysis modules
│   │   │   ├── structure.ts
│   │   │   ├── foundation.ts
│   │   │   ├── runtime.ts
│   │   │   ├── ux.ts
│   │   │   ├── localization.ts
│   │   │   ├── features.ts
│   │   │   ├── errors.ts
│   │   │   └── missing-implementation.ts
│   │   ├── config.ts            Config detection
│   │   ├── file-utils.ts        File system utilities
│   │   ├── orchestrator.ts      Runs all analyzers
│   │   ├── cli.ts               CLI entry point
│   │   └── index.ts             Library exports
│   └── test/                    Unit tests
├── packages/shared/             Shared types and utilities
│   ├── src/
│   │   ├── types.ts             Core type definitions
│   │   ├── constants.ts         Category order, labels, defaults
│   │   ├── utils.ts             Issue/result factory functions
│   │   ├── colors.ts            ANSI color constants
│   │   ├── formatter.ts         Table and detail formatters
│   │   └── index.ts             Barrel exports
│   └── dist/                    Built output
├── biome.jsonc                  Biome configuration
├── turbo.json                   Turborepo configuration
└── tsconfig.json                TypeScript configuration
```

</details>

<details><summary>Scripts</summary>

```jsonc
{
  // Build all workspaces
  "build": "turbo run build",
  // Lint all workspaces
  "lint": "turbo run lint",
  // Type check all workspaces
  "typecheck": "turbo run typecheck",
  // Run tests
  "test": "turbo run test",
  // Run lint + typecheck + test + build
  "verify": "turbo run verify",
  // Watch mode development
  "dev": "turbo run dev"
}
```

</details>

## License

MIT © Wrikka
