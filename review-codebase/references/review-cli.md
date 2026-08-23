---
name: review-cli
description: Review CLI apps for design, UX, errors, tests, build, distribution, and config
auto_execution_mode: 3
related:
  - /scan-codebase
  - /validate
  - /run-check
  - /follow-config
  - /report
  - /report-table
  - /suggest-next-action
  - /resolve-errors

---


## Goal

Review CLI applications ครอบคลุม design, UX, error handling, tests, build, distribution, และ config พร้อม severity และ actionable findings

## Scope

ใช้สำหรับ CLI ที่สร้างด้วย Rust, Bun/Node, Go, Python ก่อน ship หรือหลัง major refactor รวมถึง monorepo ที่มี CLI workspace

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ tech stack, structure, และ entry points

1. ทำ `/scan-codebase` เพื่อเข้าใจ structure และ manifest files
2. ระบุ tech stack: `Cargo.toml`, `package.json`, `go.mod`, `pyproject.toml`
3. ระบุ entry points, commands, และ config files ทั้งหมด
4. ถ้าเป็น monorepo → ระบุ CLI workspace และ root config

### 2. Review CLI Design And UX

ตรวจสอบ design และ UX ของ CLI

> Goal: CLI ใช้งานง่าย, consistent, และเข้าใจได้ทันที

1. ตรวจสอบ command structure: subcommands, nesting, naming convention
2. ตรวจสอบ options: short flags, long flags, defaults, required, validation
3. ตรวจสอบ `--help`, `--version`, และ examples ใน help text
4. ตรวจสอบ output formatting: colors, tables, JSON, progress, spinner
5. ตรวจสอบ stdout vs stderr: ข้อมูลผลลัพธ์ไป stdout, errors/warnings ไป stderr
6. ตรวจสอบ piping และ stream compatibility (non-interactive mode)
7. ตรวจสอบ interactive prompts ถ้ามี: confirm, select, input, cancellation
8. ตรวจสอบ shell completions และ man page / docs

### 3. Review Error Handling And Resilience

ตรวจสอบ error handling

> Goal: CLI แจ้ง errors ชัดเจน, recover ได้, และไม่ crash

1. ตรวจสอบ error types และ messages ที่ actionable
2. ตรวจสอบ exit codes: 0 สำหรับ success, non-zero สำหรับ errors
3. ตรวจสอบไม่มี `unwrap`/`expect`/`panic` ใน production code ยกเว้น invariant ที่ชัดเจน
4. ตรวจสอบไม่มี `throw` ที่ไม่มี catch หรือ unhandled promise rejection
5. ตรวจสอบ input validation สำหรับ args, flags, files, env vars
6. ตรวจสอบ logging/tracing: level, context, PII scrubbing
7. ตรวจสอบ retry, timeout, graceful degradation สำหรับ external calls

### 4. Review Tests

ตรวจสอบ tests

> Goal: CLI มี tests ครอบคลุม critical paths

1. ตรวจสอบ unit tests สำหรับ pure functions และ internal logic
2. ตรวจสอบ integration tests สำหรับ command invocation, options, exit codes
3. ตรวจสอบ snapshot tests สำหรับ output format ถ้าเหมาะสม
4. ตรวจสอบ fixtures, mocks ไม่ over-mock external systems
5. ตรวจสอบ test isolation และไม่ depend on global state
6. ตรวจสอบ coverage thresholds และ untested critical paths
7. ตรวจสอบ `CI=true` หรือ `NO_COLOR=1` testing path

### 5. Review Build And Distribution

ตรวจสอบ build และ distribution readiness

> Goal: build ได้, output ถูกต้อง, พร้อม distribute

1. ตรวจสอบ build configuration: release profile, target, minify, sourcemap
2. ตรวจสอบ build artifacts: binary name, executable permission, artifact size
3. ตรวจสอบ cross-compilation หรือ multi-platform builds ถ้ามี
4. ตรวจสอบ packaging: tarball, zip, installer, npm package, crate
5. ตรวจสอบ distribution channels: GitHub Releases, homebrew, scoop, winget, apt, crates.io, npm
6. ตรวจสอบ release automation: CI/CD pipeline, checksums, signing
7. ตรวจสอบ installation docs และ upgrade path

### 6. Review Config

ตรวจสอบ project config

> Goal: config ถูกต้อง, consistent, และ maintainable ทั้ง root และ workspaces

1. ทำ `/follow-config` เพื่อตรวจสอบ root และ workspace config
2. ตรวจสอบ package manifest scripts: `dev`, `build`, `test`, `lint`, `format`, `typecheck`, `check`, `verify`, `ci`
3. ตรวจสอบ build tool config: `Cargo.toml`, `tsup.config.ts`, `vite.config.ts`, `esbuild`, `webpack`
4. ตรวจสอบ shared config: `tsconfig.json`, `biome.jsonc`, `lefthook.yml`, `turbo.json`, `.gitignore`
5. ตรวจสอบ workspace overrides extend จาก root ได้ถูกต้อง
6. ตรวจสอบ env vars: validation, `.env.example`, secret management, client/server exposure
7. ตรวจสอบ config consistency ระหว่ง root และ CLI workspace

### 7. Validate And Report

ตรวจสอบ findings และรายงาน

> Goal: ได้ action items ที่ชัดเจนและพร้อมทำต่อ

1. ทำ `/validate` เพื่อตรวจสอบ findings
2. ทำ `/run-check` เพื่อ verify lint, typecheck, build ถ้ามี
3. ให้ severity: Critical, High, Medium, Low, Info
4. ทำ `/report` พร้อม `/report-table` สำหรับ findings
5. ทำ `/suggest-next-action`
6. ถ้าพบ Critical/High → แนะนำ `/resolve-errors` เป็น action ถัดไป

## Rules

### 1. Review Only

- นี่เป็น review-only reference
- ไม่แก้ไข source code, config, หรือ build artifacts ในระหว่ง review
- ไม่ลบไฟล์หรือส่วนประกอบใดๆ ในระหว่ง review
- ทุก finding ต้องมี evidence

### 2. Severity Classification

- Critical: crash, data loss, security vulnerability, broken critical path
- High: ใช้งานยาก, error handling ไม่ครบ, tests ขาด critical paths, config ขาดหรือผิด
- Medium: output ไม่สวย, naming ไม่ consistent, build suboptimal, coverage ต่ำ
- Low: docs ขาด, minor refactor, cosmetic UX

### 3. Evidence And Criteria

- ทุก finding ต้องมี file path, line number, และ code snippet
- ทุก CLI ต้องมี `--help` และ `--version`
- Error messages ต้องชัดเจนและ actionable
- Exit codes ต้องสอดคล้องกับผลลัพธ์
- Config ต้อง consistent ระหว่ง root และ workspaces

### 4. Follow-Up

- Critical/High ต้องแก้ก่อน ship
- ทำ review ซ้ำหลังแก้ไขสูงสุด 3 รอบ
- ใช้ `/resolve-errors` สำหรับ findings ที่ต้องแก้

## Expected Outcome

- รายงาน findings ด้วย severity, evidence, และ recommendation
- Review score ต่อ dimension และ overall
- Action items สำหรับ CLI improvements
- CLI ที่ผ่าน review criteria หรือมี roadmap ชัดเจน
