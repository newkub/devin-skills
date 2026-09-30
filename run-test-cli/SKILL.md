---
name: run-test-cli
description: รัน CLI tests — command parsing, flags, exit codes, stdout/stderr contracts
argument-hint: "[scope]"
related:
  - run-test-all
  - run-test
  - deep-test
  - deep-review
  - update-tests
  - resolve-errors
  - create-report-in-dot-devin
  - report
---

## Goal

รัน CLI tests ของ project — command parsing, flags/options, exit codes, stdout/stderr contracts — detect tooling แล้ว classify failures ว่า source หรือ test ผิด

## Scope

Runner ของ CLI domain เท่านั้น — analysis ลึกไป `/deep-test cli` (`deep-test/references/cli.md`); เขียน/แก้ tests → `/update-tests`; เลือกโดย `/run-test-all` เมื่อพบ signals: `bin` field, commander/clap/cobra definitions, `*.cli.test.*`, `cli/` test dirs

- ถ้าต้องการเขียน CLI tests ใหม่ → `/update-tests` (run-only skill นี้ไม่เขียน tests)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test cli)

### 1. Detect CLI Tooling

> Goal: เลือก runner ตาม artifacts ที่พบจริง

1. ตรวจ entry — `bin` field, `#[command]`/clap defs, cobra commands, `cli/` entry points
2. ตรวจ suite — `*.cli.test.*`, `cli/` test dirs, `bats` files, snapshot tests ของ stdout
3. Runner: project test runner (spawn ผ่าน `child_process`/`assert_cmd`) หรือ `bats` สำหรับ shell-oriented CLIs
4. ถ้า binary ต้อง build ก่อน → build ก่อนรัน (`bun run build`, `cargo build`, `go build`)

### 2. Run CLI Tests

> Goal: รันครอบทุก command surface

1. Project runner → scope CLI files (`bunx vitest run '*.cli.test.*'`); `bats` → `bats tests/`
2. Capture ทุก case: exit code + stdout + stderr — CLI contract = ทั้งสามอย่าง
3. บันทึกผล: per-command status, exit-code mismatches, output diffs

### 3. Classify Failures

> Goal: แยก source issue กับ test issue

1. crash/wrong exit code/unexpected stderr → source bug → `/resolve-errors`
2. output format เปลี่ยนตั้งใจ → test outdated → `/update-tests`
3. missing binary/build stale → environment — build ใหม่แล้วรันซ้ำ
4. Failure เดิมซ้ำ ≥3 รอบโดยไม่คืบหน้า → stop และ report

### 4. Report

> Goal: รายงาน audit ได้

1. สรุป commands covered, pass/fail, contract violations, classification ต่อ failure
2. persist → `.devin/temp/report/<workspace>/cli-test-<time>.md` ตาม format `/create-report-in-dot-devin`
3. ผ่านหมดและต้องการ verify ครบวงจร → `/run-verify`

## Rules

### 1. Run Only

- ไม่เขียน/แก้ CLI tests ใน skill นี้ → `/update-tests`
- วิเคราะห์ command surface coverage ลึก → `/deep-test cli`

### 2. Failure Discipline

- ห้าม `.skip`/`xit` เพื่อให้ผ่าน — แยก source/test/environment ก่อนแก้
- ห้ามแก้ assertion/snapshot ให้เข้ากับ output ที่ผิด

### 3. Deterministic

- snapshot tests ต้อง stable — ระวัง timestamps/colors/TTY ใน output
- ใช้ /run-test-all ถ้าจำเป็น · ใช้ /run-check ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- CLI tests รันครบทุก command surface ด้วย runner ที่ตรง
- Failures classify เป็น source/test/environment พร้อม evidence
- Report persisted พร้อม per-command results
