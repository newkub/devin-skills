---
name: update-usage-md
description: Create/update USAGE.md docs to reflect the real public API and CLI
argument-hint: "[scope]"
related:
  - design-usage-with-me-first
  - update-docs
  - deep-review-codebase
  - report-usage
  - report
  - suggest-next-action
  - deep-validate
  - update-project
  - follow-tool-usage
---

## Goal

Create or update `USAGE.md` at the workspace root to reflect real usage — public API, CLI commands, examples, and configuration — always written from the actual code

## Scope

- Use when the public API, CLI, or features change, or when `USAGE.md` is missing/outdated
- `USAGE.md` is the manual usage documentation written from the actual code, not generated from a spec file
- Invoked from `/update-project` or `/update-docs` when syncing project docs
- If the project uses the `usage` CLI spec tool (has `usage.kdl`) → use `/follow-tool-usage` instead
- Wording, ordering or examples of the doc are not agreed with the user yet → design it first in chat via `/design-usage-with-me-first`, then write it here

## Execute

### 1. Review Current State

> Goal: Understand the current state of `USAGE.md`

1. Check whether `<workspace>/USAGE.md` exists
2. If it does → run `/deep-review-codebase` to find gaps and stale content
3. If it doesn't → record status `missing` and prepare to create it
4. Record the findings from the review

### 2. Detect Usage Surface

> Goal: Identify the workspace's real public API and CLI

1. Read the package manifest (`Cargo.toml`, `package.json`, `pyproject.toml`) — name, version, bin targets
2. Read `README.md` for the overview and installation
3. Scan the public API from the actual code:
   - Rust: `pub` items in `src/lib.rs`, bin targets in `src/main.rs`/`src/bin/`
   - TypeScript/JS: `exports` in `index.ts`, `bin` in `package.json`
   - Python: `__all__` in `__init__.py`, entry points in `pyproject.toml`
4. Read `examples/` or tests for real usage patterns
5. Identify what changed relative to the previous `USAGE.md` (if any)

### 3. Write USAGE.md

> Goal: `USAGE.md` covers real usage

Create or update `<workspace>/USAGE.md` with these sections:

- `## Overview` — a short 1-3 line paragraph
- `## Installation` — the install command or dependency declaration per ecosystem
- `## Usage` — basic usage by workspace type (library import / CLI commands / binary)
- `## API Reference` (library) or `## Commands` (CLI) — a table of public items with short signatures
- `## Examples` — code examples taken from the actual code
- `## Configuration` — config options (if any)

### 4. Validate

> Goal: `USAGE.md` is correct and complete

1. Every public API / CLI command in the code must appear in `USAGE.md`
2. Code examples must have correct syntax and come from the actual code
3. Check that `USAGE.md` stays under 250 lines
4. Check that the version and package name match the manifest

### 5. Report

> Goal: Report the update results

1. Run `/report-usage` or `/report` to summarize the sections and what changed
2. Run `/suggest-next-action` to recommend the next step

## Rules

### 1. Code Is Source Of Truth

- Always write `USAGE.md` from the actual code; never document APIs or commands that don't exist in the code
- If the project uses a `usage.kdl` spec → delegate to `/follow-tool-usage` instead of writing it yourself

### 2. Coverage

- Every public API must appear in `USAGE.md` or state the reason for the exception
- Every CLI command must have a help or description
- Every major feature must have at least 1 example

### 3. Examples

- Examples must be copied or adapted from the actual code (`src/`, `examples/`, tests)
- Never write mock examples that can't run

### 4. Idempotency

- Re-running against the same code must produce an identical `USAGE.md`
- Overwrite `USAGE.md` only when the file is maintained by this skill or the user confirms

- Use /deep-validate if needed

## Expected Outcome

- `<workspace>/USAGE.md` reflects the real public API and CLI
- Covers Overview, Installation, Usage, API Reference/Commands, Examples
- Version and package name match the manifest
- The change summary report is complete

