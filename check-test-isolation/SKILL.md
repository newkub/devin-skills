---
name: check-test-isolation
description: ตรวจ tests ที่พึ่ง execution order หรือ shared state — flaky by design
argument-hint: "[test-path]"
related:
  - improve-test-coverage
  - improve-test-data
  - use-astgrep
  - report-table
---

## Goal

ตรวจหา tests ที่ไม่ isolated — พึ่งลำดับการรัน, shared mutable state, external resources ร่วมกัน หรือ leak state ข้าม test — สาเหตุหลักของ flaky tests

## Scope

- ตรวจ test files: unit, integration, e2e ตาม runner ที่ใช้ (Vitest, Jest, Playwright, Cargo, go test)
- ครอบคลุม: shared globals, missing cleanup, order dependencies, port/resource conflicts, DB state ร่วม, env mutations ที่ไม่ restore
- Read-only: รายงาน violations — แก้ผ่าน `/improve-test-data` หรือ `/improve-test-coverage`

## Execute

### 1. Scan For Shared State

> Goal: หา state ที่ tests แชร์กัน

1. ใช้ `use-astgrep` หา: module-level mutable variables, shared fixtures ที่ถูก mutate, singleton patterns ใน tests
2. หา `beforeAll` ที่ setup state แต่ไม่มี `afterAll`/`afterEach` cleanup
3. หา `process.env` mutations ที่ไม่ restore, `vi.spyOn`/`jest.spyOn` ที่ไม่ `restore()`

### 2. Detect Order Dependencies

> Goal: หา tests ที่พึ่งลำดับ

1. หา sequential patterns: test B อ่านค่าที่ test A สร้าง (comment hints, shared ids, `test.serial` chains)
2. หา describe-level state ที่ tests ในกลุ่มพึ่งกัน
3. flag `test.only`, `test.skip` ที่ค้าง — บิดสถิติ isolation

### 3. Detect Resource Conflicts

> Goal: หา shared resources ที่ชนกันเมื่อ parallel

1. fixed ports, fixed file paths (`tmp/test.db`), fixed DB schemas ที่ tests ใช้ร่วม
2. global mocks ที่ leak ข้าม test files
3. clock/time mocks ที่ไม่ reset

### 4. Verify With Shuffle/Repeat

> Goal: พิสูจน์ด้วยการรันจริงถ้าเป็นไปได้

1. รัน suite ด้วย random order (`--sequence.shuffle`, `--random`) ถ้า runner รองรับ
2. รัน test file เดียวซ้ำหลายรอบ — ดู deterministic ไหม
3. เก็บ failures ที่เกิดเฉพาะตอน shuffled = order dependency evidence

### 5. Report

> Goal: สรุป isolation violations

1. ใช้ `/report-table` คอลัมน์: `No.`, `Test/File`, `Violation Type`, `Shared Resource`, `Severity`, `Fix`
2. Severity: `high` (proven flaky จาก shuffle run), `medium` (shared state pattern), `low` (potential risk)
3. แนะนำ: per-test fixtures, `beforeEach` cleanup, dynamic ports, isolated DB per test

## Rules

### 1. Evidence-Based

- pattern findings จาก code + ยืนยันด้วย shuffle runs เมื่อทำได้
- ระบุ shared resource ที่ชัดเจน ไม่ใช่เดา

### 2. Read-Only

- ไม่แก้ tests — รายงานให้ `/improve-test-data`/`/improve-test-coverage` แก้
- shuffle run ไม่แก้ผลการทดสอบจริง — แค่เผยปัญหา

### 3. Runner Aware

- isolation semantics ต่างกัน: Vitest isolate per file by default, Jest sandbox, Playwright workers — ตรวจตาม runner จริง
- บาง shared setup ตั้งใจ (DB container ร่วม) — แยก "intentional shared infra" จาก "accidental shared state"

## Expected Outcome

- รายการ isolation violations พร้อมประเภทและ severity
- Shuffle-run evidence ถ้าทำได้
- คำแนะนำ isolation fixes ต่อ pattern
