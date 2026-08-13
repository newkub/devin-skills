---
name: review-cli
description: Review คุณภาพ CLI applications ครอบคลุม design, UX, error handling, tests
related:
  - report-format-table
  - suggest-next-action
  - resolve-errors
---

## Goal

Review CLI applications ให้ครอบคลุม design, structure, UX, error handling, testing, และ distribution readiness

## Scope

ใช้สำหรับ CLI ที่สร้างด้วย Rust หรือ Bun ก่อน ship หรือหลัง major refactor

## Execute

### 1. Review Structure

ตรวจสอบโครงสร้างและ architecture

> Goal: แยก concerns ถูกต้อง

1. ตรวจสอบ Clean Architecture หรือ Layered Architecture
2. ตรวจสอบ separation: domain, application, adapters, presentation
3. ตรวจสอบ naming conventions ของ commands, options, files
4. ตรวจสอบว่า business logic ไม่อยู่ใน entry point

### 2. Review CLI Design

ตรวจสอบ UX และ CLI design

> Goal: CLI ใช้งานง่ายและถูกต้อง

1. ตรวจสอบ command structure และ subcommands
2. ตรวจสอบ options: short, long, defaults, validation
3. ตรวจสอบ `--help` และ `--version`
4. ตรวจสอบ output formatting: colors, tables, JSON, progress
5. ตรวจสอบ interactive prompts ถ้ามี

### 3. Review Error Handling

ตรวจสอบ error handling และ resilience

> Goal: CLI แสดง errors ชัดเจนและ recover ได้

1. ตรวจสอบ error types และ messages
2. ตรวจสอบ exit codes
3. ตรวจสอบ `unwrap`/`expect`/`panic` ใน Rust หรือ `throw` ที่ไม่มี catch
4. ตรวจสอบ logging/tracing
5. ตรวจสอบ input validation

### 4. Review Tests And Build

ตรวจสอบ tests, build, และ distribution

> Goal: CLI พร้อมสำหรับ production

1. ตรวจสอบ unit tests สำหรับ pure functions
2. ตรวจสอบ integration tests สำหรับ commands
3. ตรวจสอบ build configuration สำหรับ release
4. ตรวจสอบ build artifacts และ binaries
5. ตรวจสอบ shell completions ถ้ามี

### 5. Report Findings

รายงานผล review

> Goal: ได้ action items ที่ชัดเจน

1. ทำ `/report-format-table` สำหรับ findings: Category, Item, Severity, Evidence, Recommendation
2. จัดลำดับตาม severity: Critical > High > Medium > Low
3. ทำ `/suggest-next-action`

## Rules

### 1. Review Criteria

- ทุก CLI ต้องมี `--help` และ `--version`
- Error messages ต้องชัดเจนและ actionable
- ไม่มี `unwrap`/`expect` ใน production code ยกเว้น invariant ที่ชัดเจน
- Commands ต้องมี tests ครอบคลุม

### 2. Severity

- Critical: crash, data loss, security vulnerability
- High: ใช้งานยาก, error handling ไม่ครบ, tests ขาด critical paths
- Medium: output ไม่สวย, naming ไม่ consistent
- Low: docs ขาด, minor refactor

### 3. Follow-Up

- ถ้าพบ Critical/High ต้องแก้ก่อน ship
- ทำ `/resolve-errors` ถ้าต้องแก้
- รีวิวซ้ำหลังแก้ (max 3)

## Expected Outcome

- รายงาน findings ด้วย severity และ evidence
- Action items สำหรับ CLI improvements
- CLI ที่ผ่าน review criteria
