---
name: test-cli
description: รัน CLI tests — command parsing, flags/options, exit codes, stdout/stderr contracts
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

รัน CLI tests — command parsing, flags/options, exit codes, stdout/stderr contracts — signals: `bin` field, commander/clap/cobra defs, `*.cli.test.*`, `cli/` test dirs

## Scope

ใช้เมื่อต้องรัน CLI tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test cli`)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`bin` field, command defs, `*.cli.test.*`, `bats` files, stdout snapshots; runner = project runner (spawn ผ่าน `child_process`/`assert_cmd`) หรือ `bats`; binary ต้อง build ก่อน → build ก่อนรัน

### 2. Run

scope CLI files (`bunx vitest run '*.cli.test.*'`); `bats tests/`; capture ทุก case = exit code + stdout + stderr; บันทึก per-command status, exit-code mismatches, output diffs

### 3. Classify

crash/wrong exit code/unexpected stderr → source → `/res
