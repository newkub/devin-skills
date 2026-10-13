---
name: test-cli
description: Run CLI tests — command parsing, flags/options, exit codes, stdout/stderr contracts
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

Run CLI tests — command parsing, flags/options, exit codes, stdout/stderr contracts — signals: `bin` field, commander/clap/cobra defs, `*.cli.test.*`, `cli/` test dirs

## Scope

Use when CLI tests must be run — run-only, does not fix tests (deep analysis → `/deep-test cli`)

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` skills must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix it or report it before running (the test)

### 1. Detect

`bin` field, command defs, `*.cli.test.*`, `bats` files, stdout snapshots; runner = project runner (spawn via `child_process`/`assert_cmd`) or `bats`; binary must be built first → build before running

### 2. Run

scope CLI files (`bunx vitest run '*.cli.test.*'`); `bats tests/`; capture every case = exit code + stdout + stderr; record per-command status, exit-code mismatches, output diffs

### 3. Classify

crash/wrong exit code/unexpected stderr → source → `/res
