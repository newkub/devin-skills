---
name: review-cli
description: Review CLI/TUI app — commands, flags, help, stdout/stderr, exit codes, distribution
argument-hint: "[scope]"
related:
  - review-platform
  - review-quality
  - review-test
  - review-docs
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

Review CLI/TUI application แบบเจาะลึก — command structure, arguments/flags, help text, stdout/stderr contract, exit codes, piping, interactive prompts, error handling, TUI behavior, tests, build และ distribution พร้อม severity ratings และ review score

## Scope

CLI review สำหรับ project ที่ ship เป็น command-line tool (Node/Bun, Rust, Go, Python ฯลฯ) — ตรวจทั้ง code และ runtime behavior ของ CLI binary

ไม่รวม:
- multi-platform spot check (CLI เป็นแค่ dimension เดียว) → ใช้ `/review-platform`
- general code quality, bug-prone patterns → ใช้ `/review-quality`
- docs completeness โดยละเอียด → ใช้ `/review-docs`

## Execute

### 1. Prepare And Discover

> Goal: เข้าใจ CLI structure และ entry points

1. ระบุ CLI entry point จาก package manifest (`bin`, `binstall`), `Cargo.toml`, หรือ build config
2. สร้าง command inventory: commands, subcommands, aliases, flags ทั้งหมด
3. build/run CLI binary — ถ้ารันไม่ได้ → stop และ report
4. รัน `<cli> --help` และ `<cli> --version` เก็บ baseline output

### 2. Command Structure Review

> Goal: ตรวจ command design และ consistency

1. ตรวจ subcommand nesting, naming convention (kebab-case), verb-first naming
2. ตรวจ options: short/long flags, defaults, required args, mutually exclusive flags
3. ตรวจ argument validation และ error messages เมื่อ args ผิด
4. ตรวจ `--help` ทุก command: ครบ, มี examples, consistent format
5. ตรวจ shell completions (bash/zsh/fish) ถ้ามี

### 3. Output Contract Review

> Goal: ตรวจ stdout/stderr contract และ output formats

1. ตรวจผลลัพธ์ไป `stdout` และ errors/warnings/diagnostics ไป `stderr` เสมอ
2. ตรวจ piping: output เป็น machine-readable เมื่อ pipe (`--json`, `--format`), ไม่มี ANSI เมื่อ `NO_COLOR` หรือ non-TTY
3. ตรวจ progress/spinner ถูก suppress ใน non-interactive mode และ `CI=true`
4. ตรวจ `--quiet`/`--verbose`/`--debug` verbosity levels consistent
5. ตรวจ output ไม่ leak secrets, tokens, absolute paths ที่ไม่จำเป็น

### 4. Exit Codes And Error Handling Review

> Goal: ตรวจ exit code contract และ resilience

1. ตรวจ exit code `0` เมื่อ success และ non-zero เมื่อ fail — ทดสอบจริงทุก error path หลัก
2. ตรวจ exit codes มี semantic ถ้าเอกสารสัญญาไว้ (เช่น `2` = usage error)
3. ตรวจไม่มี `unwrap`/`expect`/`panic`/uncaught exceptions ใน production paths
4. ตรวจ error messages actionable — บอกว่าผิดอะไรและแก้ยังไง ไม่ใช่ stack trace ดิบ
5. ตรวจ retry, timeout, graceful degradation สำหรับ network/external calls
6. ตรวจ cleanup เมื่อถูก interrupt (SIGINT/SIGTERM) — temp files, locks, terminal state

### 5. Interactive And TUI Review

> Goal: ตรวจ interactive prompts และ TUI

1. ตรวจ prompts: confirm, select, input — รองรับ cancellation และมี `--yes`/`--force` bypass
2. ตรวจ prompts ถูก skip เมื่อ non-interactive หรือ flags ครบแล้ว
3. ตรวจ TUI: layout, resize handling, focus management, keyboard/mouse input
4. ตรวจ terminal detection: `TERM`, `COLORTERM`, `NO_COLOR`, `CI`

### 6. Config And Environment Review

> Goal: ตรวจ config files, env vars, และ precedence

1. ตรวจ config discovery order: flags > env vars > config file > defaults
2. ตรวจ env vars: validation, documentation, secret handling
3. ตรวจ config file: schema validation, error เมื่อ malformed, `.example` มีให้
4. ตรวจ XDG/platform conventions สำหรับ config/cache paths

### 7. Tests Review

> Goal: ตรวจ test coverage ของ CLI surface

1. ตรวจ integration tests: command invocation, options, exit codes, stdout/stderr snapshots
2. ตรวจ `CI=true`/`NO_COLOR=1` test paths มีครอบคลุม
3. ตรวจไม่ over-mock external systems และ test isolation จาก global state
4. ถ้าไม่มี tests เลย → flag เป็น High finding

### 8. Build And Distribution Review

> Goal: ตรวจ packaging และ release pipeline

1. ตรวจ build artifacts: binary name, executable permission, size, cross-compilation
2. ตรวจ distribution channels: npm/bunx, crates.io, homebrew, scoop, winget, GitHub Releases
3. ตรวจ release automation: CI pipeline, checksums, signing, version sync กับ `--version`
4. ตรวจ install/upgrade docs และ migration path ระหว่าง versions

### 9. Validate Findings

> Goal: findings ถูกต้องและจัดลำดับ severity

1. ทำ `/deep-validate` — reproduce commands จริงก่อน flag
2. จัดลำดับตาม severity: Critical → High → Medium → Low → Info
3. ระบุ false positives ที่พบ

### 10. Report

> Goal: รายงาน findings พร้อม reproduction commands

1. ทำ `/report` ตาราง: `No.`, `Command/Area`, `Finding`, `Severity`, `Evidence`, `Recommendation`
2. คำนวณ review score ต่อ dimension และ overall (0-100, grade A-F)
3. ทำ `/suggest-next-action` แนะนำ fix order

## Rules

### 1. Scope Boundary

- เน้น CLI surface: commands, I/O contract, exit codes, distribution
- ไม่ซ้ำ `/review-platform` (spot check), `/review-quality` (code patterns), `/review-test` (test quality ทั่วไป)

### 2. Skip Conditions

- ถ้า project ไม่มี CLI entry point → stop และ report
- ถ้า CLI ไม่มี interactive mode → ข้าม prompt checks
- ถ้า CLI ไม่มี TUI → ข้าม TUI checks
- ถ้าไม่มี distribution pipeline → ข้าม section 8 แต่ flag เป็น Info

### 3. Severity Classification

- Critical: command พัง, exit code ผิดบน error paths, secrets leak ใน output, TUI crash
- High: ไม่มี help text, error messages สับสน, stdout/stderr ปนกัน, non-interactive พัง, ไม่มี tests
- Medium: output format ไม่ consistent, ไม่รองรับ `NO_COLOR`, missing completions, coverage ต่ำ
- Low: docs ขาด, cosmetic UX, minor naming inconsistency
- Info: suggestions, best practice recommendations

### 4. Evidence-Based Findings

- ทุก finding ต้องมี command ที่ reproduce ได้ + actual output หรือ file:line
- ไม่เดา — รัน command จริงเพื่อ verify exit codes และ output contract
- ระบุ command, flag, หรือ code path ที่เกี่ยวข้อง

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่รัน commands ที่มี side effects จริง (deploy, delete, publish) โดยไม่ได้รับอนุญาต — ใช้ `--dry-run` ถ้ามี

### 6. Formatting

- ห้ามใช้ `**` bold markers — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report` ทุก report table เริ่มด้วยคอลัมน์ `No.`

## Expected Outcome

- command inventory พร้อมผลตรวจครบทุก command/flag
- รายงานตาราง findings พร้อม severity, reproduction command และ evidence
- stdout/stderr contract และ exit code matrix ที่ verify แล้ว
- Review score ต่อ dimension และ overall พร้อม grade
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
