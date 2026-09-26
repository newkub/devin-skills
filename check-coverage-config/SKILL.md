---
name: check-coverage-config
description: ตรวจ coverage config — thresholds ถูกตั้ง, include/exclude ครบ, ไม่มีไฟล์หลุด report
argument-hint: "[scope]"
allowed-tools:
  - exec
  - grep
  - find_file_by_name
  - read
related:
  - run-test-coverage
  - improve-test-coverage-to-100
  - check-test-quality
  - review-test
  - report
---

## Goal

ตรวจ coverage configuration ให้ซื่อสัตย์ — thresholds ตั้งไว้และบังคับจริง, include/exclude ครอบทุก source ที่ตั้งใจ, raw reporter มีครบ — เพราะ coverage illusion เกิดจาก config ไม่ใช่ตัวเลข

## Scope

- ครอบคลุม coverage configs: Vitest (`coverage.v8`/`istanbul`), Jest (`collectCoverage*`), `nyc`/`.nycrc`, `coverage.py`, `cargo-llvm-cov`, codecov/coveralls config
- Read-only: ตรวจ config + report — แก้ผ่าน `/update-tests` หรือ edit config แยก

## Execute

### 1. Locate Coverage Config

> Goal: หา config จริงที่ coverage ใช้

1. ตรวจ `vitest.config.*` (test.coverage block), `jest.config.*` (collectCoverage*, coverageThreshold), `.nycrc`, `pyproject.toml`/`tox.ini` (coverage), `.cargo/config.toml`, CI workflow coverage steps
2. ถ้าไม่มี coverage config เลย → finding: suite วัดไม่ได้ ต้องตั้งค่าก่อน — report แล้วจบ

### 2. Verify Thresholds Enforced

> Goal: thresholds บังคับผ่าน/ไม่ผ่านจริง ไม่ใช่แค่แสดงผล

1. ตรวจ `thresholds`/`coverageThreshold` มี statements/functions/branches/lines ครบ
2. ตรวจ CI fails เมื่อต่ำกว่า threshold — มี `--coverage.thresholds` หรือ exit-code enforcement ไม่ใช่แค่ print
3. threshold = 0 หรือไม่มี → Warning: ตัวเลขถูกวัดแต่ไม่บังคับ

### 3. Verify Include/Exclude Integrity

> Goal: ไม่มี source หลุดจากการวัดเงียบๆ

1. เทียบ `include`/`collectCoverageFrom` กับ source dirs จริง (`git ls-files` src tree) — ไฟล์/dir ที่ไม่อยู่ใน include = blind spot
2. ตรวจ `exclude` ไม่ swallow source จริง — exclude ควรจำกัดเฉพาะ tests, generated, type-only, entrypoints ที่เหตุผลชัด
3. ระวัง `all: false`/`allFiles: false` ที่ทำให้ไฟล์ที่ไม่ถูก import หายจาก report ทั้งไฟล์

### 4. Verify Raw Reporter Output

> Goal: มี machine-readable output สำหรับ audit

1. ตรวจ reporters มี `json`/`lcov` ไม่ใช่แค่ `text`/`html` — summary table เดียว audit ไม่ได้
2. ตรวจ output path ไม่ collide กับ source และไม่ถูก commit ผิดที่

### 5. Report

> Goal: รายงาน config issues พร้อม severity

1. ทำ `/report` ตาราง: `No.`, `Config`, `Issue`, `Severity` (Critical/Warning/Info), `Fix`
2. Critical: ไม่มี threshold enforcement, source หลุด include; Warning: reporter ไม่ครบ, exclude กว้าง
3. เสร็จ → แนะนำ `/run-test-coverage` วัดจริงบน config ที่ถูกต้อง

## Rules

- Read-only — ไม่แก้ config ใน skill นี้
- ทุก finding ต้องชี้ไฟล์ config + key ที่ผิด
- ไม่ flag exclusions ที่มีเหตุผลชัดเจน (comment/docs บันทึกไว้)
- ใช้ /run-test-coverage ถ้าจำเป็น · ใช้ /improve-test-coverage-to-100 ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Coverage config ผ่าน audit: thresholds บังคับ, include ครบ, raw reporter มี
- Blind spots (ไฟล์หลุดการวัด) ถูกระบุชัดเจน
- พร้อมให้ `/run-test-coverage` วัดตัวเลขที่เชื่อถือได้
