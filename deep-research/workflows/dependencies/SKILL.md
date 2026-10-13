---
name: deep-research-dependencies
description: Research dependencies for a project — analyze manifest, compare alternatives, find fast/modern deps
argument-hint: "[package or manifest]"
related:
  - deep-research
  - list-dependencies
  - open-web-dependencies
  - run-bench-deps
  - run-install
  - report
---

## Goal

Research dependencies or libraries suitable for the project — analyze the manifest, compare alternatives, find fast/modern deps (merged `/research-dependencies`)

## Scope

- Choose new dependencies, compare libraries, find compatible versions, audit the project's deps
- Supports `Cargo.toml`, `package.json`, `go.mod`, `pyproject.toml`
- Never edit manifest files directly — hand off to `/list-dependencies` or `/deep-review`
- Bench/compare table for existing deps → `/run-bench-deps` (CLI report, no research)

## Execute

### 1. Identify Dependency Need

> Goal: determine what kind of dependency is needed

1. If a manifest file exists → read `Cargo.toml`, `package.json`, `go.mod`, `pyproject.toml`
2. Specify the package name or capability needed, e.g. "HTTP client in Bun" or "outdated existing deps"
3. Identify the ecosystem: `npm` / `crates.io` / `go` / `pypi`
4. Define constraints: fast, modern, minimal bundle, secure, maintained

### 2. Analyze Manifest

> Goal: inventory the existing dependencies

1. Use `/list-dependencies` or `/follow-tool-madge` to view the tree
2. Check the current version and source of each dep
3. Identify outdated, duplicate, heavy, or unused deps
4. Record the baseline: dep count, size, number of outdated

### 3. Search Modern/Fast Alternatives

> Goal: find deps that fit the current tech stack

1. Run `/search-github-star` to find popular/quality libraries
2. Run `/search-raindrop` to find saved bookmarks or comparisons
3. Run `/search-npmx` for JS/TS packages
4. Use package registries: `npm`, `crates.io`, `pkg.go.dev`, `pypi`
5. Search with keywords matching the capability + `fast`, `modern`, `lightweight`, `zero-dependency`

### 4. Compare Candidates

> Goal: weigh the options

1. Gather 2-5 candidates — compare: downloads/stars/maintenance, license, bundle size/compile time, API stability, docs quality, type safety, last release (prefer ≤ 6 months)
2. Verify compatibility with the current tech stack
3. Prioritize fast, modern, minimal deps

### 5. Deep Check

> Goal: inspect each candidate in detail

1. Read official docs via `context7` or `webfetch`
2. Check GitHub: open issues, recent commits, release frequency
3. Review security advisories
4. Look up benchmarks/comparisons if needed

### 6. Recommend

> Goal: pick the best dependency

1. Build a `/report` with columns: `No.`, `Package`, `Version`, `License`, `Maintenance`, `Size`, `Pros`, `Cons`, `Verdict`
2. State the primary recommendation + alternatives + the install command for the ecosystem
3. If analyzing project deps → flag outdated/heavy/duplicate ones with suggestions
4. If the deps' websites need opening → `/open-web-dependencies`; run `/suggest-next-action` at the end of the report

## Rules

- Use the package manager matching the ecosystem: `bun add`, `cargo add`, `go get`, `pip install` — never recommend a dep that duplicates an existing one
- Prefer zero/low-dependency, fast, modern APIs — avoid deprecated, archived, heavy/legacy; last commit ≤ 6 months; license compatible with the project
- Time budget: small ≤ 5 minutes, medium ≤ 15 minutes — anything deeper goes back to `/deep-research` (general pipeline)
- Safety: never edit manifests directly; if a dep has security issues → warn and find alternatives
- Use `/follow-best-practice`, `/check-reference`, `/run-install` when needed

## Expected Outcome

- Dep comparison table + primary recommendation + install command + security/maintenance notes
