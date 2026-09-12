---
name: review-cli
description: Review CLI/TUI app ทุกมิติ — commands, stdin, I/O contract, exit codes, security, distribution
argument-hint: "[scope]"
related:
  - deep-review-then-fix
  - deep-review
  - review-quality
  - review-test
  - review-docs
  - deep-validate
  - report
  - suggest-next-action
  - run-test-cli
  - run-review
---

## Goal

Review CLI/TUI application แบบเจาะลึก — command structure, arguments/flags, help text, stdout/stderr contract, exit codes, piping, interactive prompts, error handling, TUI behavior, tests, build และ distribution พร้อม severity ratings และ review score

## Scope

CLI review สำหรับ project ที่ ship เป็น command-line tool (Node/Bun, Rust, Go, Python ฯลฯ) — ตรวจทั้ง code และ runtime behavior ของ CLI binary

ไม่รวม:
- multi-platform spot check (CLI เป็นแค่ dimension เดียว) → ใช้ `/deep-review`
- general code quality, bug-prone patterns → ใช้ `/review-quality`
- docs completeness โดยละเอียด → ใช้ `/review-docs`
- แก้ findings → ใช้ `/deep-review-then-fix` (dedicated fix pass; fix guide: `review-quality/references/fix-improve-cli-ux.md`)

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

### 3. I/O Contract And Exit Code Review

> Goal: ตรวจ stdin/stdout/stderr contract และ exit codes

1. ตรวจ stdin: อ่านจาก stdin เมื่อไม่มี args หรือเมื่อ pipe เข้ามา, รองรับ `-` เป็น stdin convention
2. ตรวจ file arguments: multi-file, glob expansion, missing file errors, `--` separator สำหรับ args ที่ขึ้นต้น `-`
3. ตรวจ EOF/Ctrl+D handling และไม่ hang เมื่อ stdin เป็น TTY แต่รอ input
4. ตรวจ input size limits, streaming vs buffering สำหรับ input ใหญ่
5. ตรวจ idempotency: รันซ้ำด้วย input เดิมได้ผลเดิม, `--dry-run` สำหรับ destructive commands
6. ตรวจผลลัพธ์ไป `stdout` และ errors/warnings/diagnostics ไป `stderr` เสมอ
7. ตรวจ piping: output เป็น machine-readable เมื่อ pipe (`--json`, `--format`), ไม่มี ANSI เมื่อ `NO_COLOR` หรือ non-TTY
8. ตรวจ progress/spinner ถูก suppress ใน non-interactive mode และ `CI=true`
9. ตรวจ `--quiet`/`--verbose`/`--debug` verbosity levels consistent
10. ตรวจ output ไม่ leak secrets, tokens, absolute paths ที่ไม่จำเป็น
11. ตรวจ exit code `0` เมื่อ success และ non-zero เมื่อ fail — ทดสอบจริงทุก error path หลัก
12. ตรวจ exit codes มี semantic ถ้าเอกสารสัญญาไว้ (เช่น `2` = usage error)
13. ตรวจไม่มี `unwrap`/`expect`/`panic`/uncaught exceptions ใน production paths
14. ตรวจ error messages actionable — บอกว่าผิดอะไรและแก้ยังไง ไม่ใช่ stack trace ดิบ
15. ตรวจ retry, timeout, graceful degradation สำหรับ network/external calls
16. ตรวจ cleanup เมื่อถูก interrupt (SIGINT/SIGTERM) — temp files, locks, terminal state

### 4. Interactive And TUI Review

> Goal: ตรวจ interactive prompts และ TUI

1. ตรวจ prompts: confirm, select, input — รองรับ cancellation และมี `--yes`/`--force` bypass
2. ตรวจ prompts ถูก skip เมื่อ non-interactive หรือ flags ครบแล้ว
3. ตรวจ TUI: layout, resize handling, focus management, keyboard/mouse input
4. ตรวจ terminal detection: `TERM`, `COLORTERM`, `NO_COLOR`, `CI`

### 5. Security Review

> Goal: ตรวจ CLI security surface

1. ตรวจ argument injection: args ที่ผ่านไป shell/subprocess ต้อง escaped — ไม่มี command injection ผ่าน user input
2. ตรวจ path traversal: file args ที่ชี้นอก scope ต้องถูกจัดการหรือ reject
3. ตรวจ secrets: ไม่รับ secrets ผ่าน positional args (เห็นใน `ps`/shell history) — ใช้ env/flags/stdin แทน
4. ตรวจ file permissions: files ที่สร้าง (config, keys, cache) มี perms ถูกต้อง (0600 สำหรับ secrets)
5. ตรวจไม่มี privilege escalation: sudo/root check เมื่อจำเป็น, ไม่ write นอก user scope โดยไม่เตือน
6. ตรวจ temp files: secure creation (`mktemp`-equivalent), cleanup หลังจบ

### 6. Config, Environment And Cross-Platform Review

> Goal: ตรวจ config, env vars, precedence และ Windows/Unix compatibility

1. ตรวจ config discovery order: flags > env vars > config file > defaults
2. ตรวจ env vars: validation, documentation, secret handling
3. ตรวจ config file: schema validation, error เมื่อ malformed, `.example` มีให้
4. ตรวจ XDG/platform conventions สำหรับ config/cache paths
5. ตรวจ path handling: separators, `~`/HOME expansion, spaces ใน paths, Windows long paths
6. ตรวจ line endings (CRLF/LF) และ signal handling บน Windows (SIGINT only, ไม่มี SIGTERM/SIGHUP)
7. ตรวจ Unicode: emoji/CJK width ใน TUI, non-UTF8 input, NFC/NFD normalization
8. ตรวจ symlinks, junctions, case-sensitivity ข้าม filesystems

### 7. Versioning, Docs And Upgrade Review

> Goal: ตรวจ version contract และ documentation parity

1. ตรวจ `--version` output ตรงกับ manifest/tag, มี commit/build info ถ้า claim
2. ตรวจ `--help` parity กับ docs/man pages — ไม่มี flags ที่ undocumented หรือ documented-but-missing
3. ตรวจ deprecation notices: warnings ก่อน remove, migration guide สำหรับ breaking changes
4. ตรวจ update mechanism: self-update หรือ update-notifier เป็น opt-in, ไม่ auto-mutate โดยไม่บอก
5. ตรวจ man pages หรือ `help <cmd>` ถ้ามี — generate จาก source เดียวกันไม่ให้ drift

### 8. Tests Review

> Goal: ตรวจ test coverage ของ CLI surface

1. ตรวจ integration tests: command invocation, options, exit codes, stdout/stderr snapshots
2. ตรวจ `CI=true`/`NO_COLOR=1` test paths มีครอบคลุม
3. ตรวจไม่ over-mock external systems และ test isolation จาก global state
4. ถ้าไม่มี tests เลย → flag เป็น High finding

### 9. Build And Distribution Review

> Goal: ตรวจ packaging และ release pipeline

1. ตรวจ build artifacts: binary name, executable permission, size, cross-compilation
2. ตรวจ distribution channels: npm/bunx, crates.io, homebrew, scoop, winget, GitHub Releases
3. ตรวจ release automation: CI pipeline, checksums, signing, version sync กับ `--version`
4. ตรวจ install/upgrade docs และ migration path ระหว่าง versions

### 10. Validate And Report

> Goal: findings ถูกต้อง จัดลำดับ severity และรายงานพร้อม reproduction commands

1. ทำ `/deep-validate` — reproduce commands จริงก่อน flag
2. จัดลำดับตาม severity: Critical → High → Medium → Low → Info และระบุ false positives
3. ทำ `/report` ตาราง: `No.`, `Command/Area`, `Finding`, `Severity`, `Evidence`, `Recommendation`
4. คำนวณ review score ต่อ dimension และ overall (0-100, grade A-F) — ใช้ `references/checklist.md` เป็น checklist ครบทุกมิติ
5. ทำ `/suggest-next-action` แนะนำ fix order

## Rules

### 1. Scope Boundary

- เน้น CLI surface: commands, I/O contract, exit codes, distribution
- ไม่ซ้ำ `/deep-review` (spot check), `/review-quality` (code patterns), `/review-test` (test quality ทั่วไป)

### 2. Skip Conditions

- ถ้า project ไม่มี CLI entry point → stop และ report
- ถ้า CLI ไม่มี interactive mode → ข้าม prompt checks
- ถ้า CLI ไม่มี TUI → ข้าม TUI checks
- ถ้าไม่มี distribution pipeline → ข้าม section Build And Distribution แต่ flag เป็น Info
- ถ้า CLI รองรับ platform เดียว → ข้าม section Cross-Platform ที่ไม่เกี่ยว

### 3. Severity Classification

- Critical: command พัง, exit code ผิดบน error paths, secrets leak ใน output/`ps`, command injection ผ่าน args, TUI crash
- High: ไม่มี help text, error messages สับสน, stdout/stderr ปนกัน, non-interactive พัง, stdin hang, ไม่มี tests, config perms ผิด
- Medium: output format ไม่ consistent, ไม่รองรับ `NO_COLOR`, missing completions, coverage ต่ำ, help/docs drift, ไม่มี `--dry-run` สำหรับ destructive
- Low: docs ขาด, cosmetic UX, minor naming inconsistency, Unicode width glitches
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
- ใช้ /run-test-cli ถ้าจำเป็น
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- command inventory พร้อมผลตรวจครบทุก command/flag
- รายงานตาราง findings พร้อม severity, reproduction command และ evidence
- stdout/stderr contract, stdin contract และ exit code matrix ที่ verify แล้ว
- security, cross-platform, versioning/docs coverage ที่ตรวจแล้ว
- Review score ต่อ dimension และ overall พร้อม grade
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. help/discovery: `--help` ครบทุก command, naming consistent, no-args → help ไม่ใช่ crash
2. errors/exit codes: message บอกสาเหตุ+ทำอะไรต่อ, exit codes ถูก, stderr/stdout แยก
3. output: `--json` flag, TTY-only spinners, destructive → confirm + dry-run
4. verify: รัน commands จริงทั้ง TTY/non-TTY + `/run-test-cli`
5. fix guide: `review-quality/references/fix-improve-cli-ux.md`
