---
name: report-my-tech-stack-update
description: Report the weekly update of the tech stack used in development
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - deep-research

  - report
  - suggest-next-action
---

## Goal

Collect and summarize weekly news and updates of the tech stack used in development, so the user can follow important changes and trends

## Scope

Covers checking and collecting updates from:
- Runtimes and package managers (Bun, Cargo)
- Frameworks and libraries (TanStack, Vue, SolidJS, Vite, etc.)
- Tools and services (Biome, Drizzle, Supabase, Stripe, etc.)
- Infrastructure and deployment (Cloudflare, Vercel, etc.)

## Execute

### 1. Identify Current Tech Stack

> Goal: Identify the current tech stack

1. Run `/deep-review-codebase` to identify the whole tech stack
2. Read `package.json`, `Cargo.toml`, `go.mod` for the current dependencies
3. State the current version of each dependency
4. Group by category: Runtime, Framework, Data, Frontend, Dev Tools, Infrastructure, Services

### 2. Check For Updates

> Goal: Check the available updates

1. Run `bun outdated` to check npm packages with updates
2. Run `cargo outdated` to check Rust crates with updates (if there is a Rust project)
3. Use `mcp7_list_releases` for tracked repositories
4. Search with `search_web` using the query `<library-name> latest release <month> <year>`
5. Collect the list of dependencies with updates and their new versions

### 3. Research Release Notes

> Goal: Find release notes and changelogs

1. Run `/deep-research` for libraries with significant updates
2. Use `mcp7_list_releases` for GitHub release tracking
3. Use `read_url_content` to read interesting changelogs
4. Identify breaking changes and important new features
5. Check migration guides for major version bumps

### 4. Categorize Updates

> Goal: Group updates by type

1. Group by category: Runtime, Framework, Data, Frontend, Dev Tools, Infrastructure, Services
2. Order by impact: Breaking Changes, New Features, Bug Fixes, Security
3. Identify libraries needing urgent updates (security patches, breaking changes)
4. Identify libraries with major version bumps that require migration

### 5. Compile Report

> Goal: Build the weekly update report

1. Run `/report` to build the update table
2. Define columns: No., Library, Category, Current Version, Latest Version, Impact, Summary
3. Group by category and order by impact
4. Add a short summary for each update
5. Run `/report` to build the executive summary with top highlights

## Rules

### Report UX/UI

> Goal: report easy to read, key findings summarized at the top, leading to action (my tech stack update)

1. Summarize key findings at the top before details (my tech stack update)
2. Use `/report` for comparison tables with multiple columns (my tech stack update)
3. Use `/report` for status/progress/logs reports
4. Use the "No." column as the first column, ordered 1, 2, 3, ... with clear headers, grouped/ordered by importance (my tech stack update)
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always run `/suggest-next-action` at the end of the report

### 1. Update Categories

- Breaking Changes: updates that may impact current usage and require migration
- New Features: interesting new features
- Bug Fixes: important bug fixes
- Security: security vulnerability fixes
- Priority order: Security > Breaking Changes > New Features > Bug Fixes

### 2. Source Selection

- Use `bun outdated` for npm packages
- Use `cargo outdated` for Rust crates
- Use `mcp7_list_releases` for GitHub release tracking
- Use `search_web` to find release notes
- Use `read_url_content` to read full changelogs
- Follow `/deep-review-codebase` for tech stack categories

### 3. Freshness Requirements

- Check only updates that happened this week or last week
- Use queries that state the year and week, e.g. `<library-name> release July 2026`
- Verify the release dates of every item
- Follow `/deep-research` Rules item 6 Information Freshness

### 4. Report Format

- Use `/report` for structured output
- The table must have the "No." column first, ordered 1, 2, 3, ... on every row
- Group by category and order by impact
- Use `/report` for the executive summary
- Summarize the top 5 highlights of the week

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- Weekly tech stack update report
- News grouped by category and ordered by impact
- Breaking changes and security updates clearly identified
- Migration guides for major version bumps
- Executive summary with top highlights
- Usable as a weekly briefing for the user
- Report easy to read with key findings at the top
- Clear next action
