---
name: deep-analyze
description: Deep project analysis across every dimension via tools, scripts, CLI, and external research
argument-hint: "[scope|report]"
related:
  - deep-thinking
  - scan-codebase
  - check-long-files
  - check-code-structure
  - use-astgrep
  - report-deep
  - deep-research
  - run-audit
  - use-scripts
  - deep-review
  - deep-analyze-by-use-scripts

---

## Goal

Analyze the project deeply across every dimension to understand its architecture, patterns, quality, and opportunities for improvements

## Scope

Covers analysis across many dimensions:

- Architecture and design patterns
- Code quality and technical debt
- Features and business logic
- Dependencies and tech stack
- Performance and security
- External research for best practices
- Recommendations for improvements

## Execute

### Workflows

| Argument | Workflow |
|----------|----------|
| `report`, `report-analysis` | `workflows/report-analysis/SKILL.md` — analysis report with evidence + root cause chains |

1. If the argument is `report` → read `workflows/report-analysis/SKILL.md` and follow its flow — use existing analysis results, don't re-analyze
2. If no argument is given → run Steps 1-10 as usual, where Step 10 reads and executes the `report-analysis` workflow

### 1. Deep Thinking And Quick Scan

> Goal: analyze the problem and plan before starting

1. Run `/deep-thinking` to define objectives, sub-problems, assumptions, and an action plan
2. Define scope and thresholds per ## Rules item 4
3. Run `/scan-codebase` to see structure, patterns, and quality within 2 minutes
4. Run `eza --tree --level 2` to see the physical layout and file-level issues within 1 minute
5. Use `/use-astgrep` to find initial patterns, and `/use-scripts` to collect metrics if needed
6. If analysis with the review CLI, ast-grep NAPI, or Bun scripts is needed:
   - Check `tools/review-codebase` and `tools/analyze`
   - Use `@ast-grep/napi` or `oxc-parser` for programmatic AST analysis
   - Collect metrics from knip, biome, vitest, madge, `ast-grep scan`
7. Build structured data for the analysis

### 2. Structure Analysis

> Goal: analyze file structure and symbols

1. Run `eza --tree --level 2` or `tree` to view the directory structure
2. Run `/check-code-structure` to use `ast-grep outline`
3. Analyze top-level symbols, exports, members, SRP violations, and cohesion
4. Check file patterns, naming conventions, and cross-layer imports

### 3. Architecture Analysis

> Goal: analyze architecture and design patterns

1. Use `/use-astgrep` to identify architectural patterns
2. Analyze data flow with `Grep`
3. Identify design patterns and adherence to principles
4. Analyze coupling and cohesion

### 4. Features Analysis

> Goal: analyze features and business logic

1. Discover and inventory all features
2. Categorize and group features
3. Document features in a systematic format
4. Validate and review features

### 5. Code Quality Analysis

> Goal: analyze code quality in detail

1. Use `/use-astgrep` to find patterns, anti-patterns, and design patterns
2. Use `/use-astgrep-programmatic` for AST-based metrics if needed
3. Find code smells with `Grep` multiline mode
4. Use `/use-scripts` to compute metrics (complexity, coupling, cohesion)
5. Run `/deep-review` and `/follow-tool-knip` in parallel
6. Scan for hardcoded secrets with `Grep`

### 6. Dependencies And Tech Stack

> Goal: analyze dependencies and tech stack

1. Read manifest files in parallel
2. Identify the tech stack and versions
3. Analyze the dependency graph
4. Check for outdated dependencies
5. Analyze security vulnerabilities with `/run-audit`

### 7. Performance And Security

> Goal: analyze performance and security

1. Analyze performance bottlenecks
2. Check for security vulnerabilities
3. Analyze error handling and resilience
4. Check caching strategies
5. Analyze database queries if present

### 8. Domain Dispatch

> Goal: cover every dimension — dispatch to `review-*` per detected stack

- Full dispatch catalog of 61 domains with priority order + pipeline phases → read `deep-review/SKILL.md` (single source of truth — never duplicate the table here)
- Dispatch only the domains the stack actually has — never run all of them every time
- Parallelize via `/use-subagents` when many domains
- Merge all findings into one report with domain tags
- Dedup: the same finding from multiple domains → merge into one item tagged with every domain that found it
- If `/deep-review` already ran in this session → reuse its findings, don't re-dispatch the same domains

### 9. External Research

> Goal: run `/deep-research` to find best practices

1. Find best practices for the tech stack in use
2. Find better alternatives for dependencies
3. Find official documentation
4. Compare findings against the current project
5. Identify gaps between the current implementation and best practices

### 10. Comprehensive Report

> Goal: produce a complete report

1. Follow `workflows/report-analysis/SKILL.md` — organize findings, root cause chains, evidence
2. Aggregate per-domain scores from the dispatched `review-*` → overall score + grade — table `No. | Domain | Score | Grade | Top Finding`
3. Run `/report-deep` or `/create-report-in-dot-devin` for a persistent artifact
4. Provide recommendations by priority and impact with action items + roadmap

## Rules

### 1. Analysis Depth

- Always start with `/deep-thinking`
- Use `/scan-codebase` for a quick overview
- Use specialized workflows for each dimension
- Use `/deep-research` for external validation
- Don't skip any analysis step

### 2. Tool Selection

- Structure: `/scan-codebase`, `eza --tree`, `ast-grep outline`, `/check-code-structure`
- Architecture: `/use-astgrep`, `Grep`
- Features: `/scan-codebase`, `/use-astgrep`
- Code Quality: `/use-astgrep`, `/use-astgrep-programmatic`, `Grep`, `/use-scripts`
- Dependencies: manifest files, `/run-audit`
- Research: `/deep-research`, DeepWiki, Context7, WebSearch

### 3. Parallel Processing

- Read manifest files together
- Run many checks concurrently
- Run `Grep` patterns concurrently
- Run ast-grep patterns concurrently

### 4. Metric Thresholds

- Long functions: > 50 lines
- Deep nesting: > 3 levels
- High complexity: cyclomatic complexity > 10
- Large files: > 300 lines
- High coupling: > 7 dependencies
- Low cohesion: < 0.3

### 5. Research Validation

- Use multiple sources for validation
- Check the credibility of sources
- Compare against the project context
- State the assumptions used

### 6. Report Quality

- Group findings by category
- Provide recommendations + roadmap + action items by priority and impact
- Use `/report-deep` for a detailed report or `/report` for a chat table
- Alias stub: `/deep-analyze-by-use-scripts` — forwards to this skill (extracted from the old `workflows/by-use-scripts`)

### 7. Deep Analysis Scripts

- Check `tools/review-codebase` and `tools/analyze` before use
- Use `@ast-grep/napi` for programmatic AST analysis
- Collect metrics from knip, biome, vitest, madge
- Run `bunx ast-grep outline` to view structure and `eza --tree --level 2` to view the physical layout

## Expected Outcome

- Understanding of the architecture and design patterns used
- Code quality, performance, and security issues identified with severity
- Features, dependencies, tech stack, and outdated dependencies identified
- Gaps between the current implementation and best practices identified
- Recommendations + roadmap for improvements by priority and impact
