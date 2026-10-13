---
name: check-monorepo-config
description: Check workspace config consistency: declared workspaces vs actual dirs, manifest coherence
argument-hint: "[workspace-or-package]"
related:
  - follow-monorepo
  - list-workspaces
  - report
---

## Goal

Check monorepo config consistency — workspace globs match real directories, manifests agree with each other, and tool config does not drift.

## Scope

- Use when `/check-monorepo` dispatches to `config`, or call it standalone
- Covers: `package.json` workspaces, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `.moon/*`, `lerna.json`, `Cargo.toml` workspace
- Read-only: report only — fix via `/update-config` or `/follow-monorepo`

## Execute

### 1. Declared Vs Actual

> Goal: Declared globs match existing directories

1. Read workspace patterns from `package.json`/`pnpm-workspace.yaml`/`.moon/workspace.yml`
2. Expand the globs against real directories — flag dirs not covered by any pattern (unmanaged packages)
3. Flag patterns that match nothing (dead globs)

### 2. Manifest Coherence

> Goal: Package manifests are coherent with each other

1. Check that `name` fields are unique across packages
2. Check that internal deps use the proper workspace protocol (`workspace:*`, `catalog:`) instead of hard-pinned versions
3. Check that the `packageManager` field agrees across all packages and matches the actual lockfile
4. Flag a root `package.json` holding deps that belong in a sub-package (or vice versa)

### 3. Tool Config Consistency

> Goal: Monorepo tool configs do not conflict

1. If multiple tool markers exist (`turbo.json` + `.moon/` + `nx.json`) → flag the ambiguity over which one is canonical
2. Check shared config inheritance: `tsconfig.base.json` and shared eslint/biome config are extended by every package
3. Record findings with evidence

### 4. Report

> Goal: Summarize config health

1. Use `/report` with columns: `No.`, `Config`, `Issue`, `Severity`, `Fix`
2. Recommend: fix globs, consolidate tool config, use the workspace protocol

## Rules

- Every finding needs evidence (file path, glob, package name)
- Unmanaged package dir = High (the build may not cover it); dead glob = Low; tool ambiguity = Medium
- Distinguish "intentional excludes" (`.npmrc`/ignore comment present) from "accidentally uncovered"

## Expected Outcome

- List of declared-vs-actual mismatches with severity
- Manifest/tool config drift that needs syncing
