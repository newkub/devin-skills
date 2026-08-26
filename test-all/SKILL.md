---
name: test-all
description: รัน tests ทั้งหมดตาม tech stack: unit, integration, e2e, coverage
related:
  - run-check
  - follow-tasks
  - ship
  - report-table
  - resolve-errors
---

## Goal

รัน tests ครบทุกระดับ: unit, integration, e2e, coverage ตาม tech stack ทีตรวจพบ

## Scope

ใช้เมื่อต้องการตรวจสอบความถูกต้องของ code ด้วย testing ทั้งหมด ก่อน ship หรือหลังตั้งค่า scripts

## Execute

### 1. Detect Test Stack

> Goal: รู้ test commands ทีใช้

1. ตรวจสอบ `package.json` หรือ `Cargo.toml` หรือ `pyproject.toml`
2. หา scripts: `test`, `test:unit`, `test:integration`, `test:e2e`, `test:coverage`
3. ถ้าไม่มี scripts → ใช้ `/follow-tasks` เพื่อตั้งค่าก่อน
4. บันทึก commands พร้อม tech stack

### 2. Run Unit Tests

> Goal: unit tests ผ่าน

1. รัน `test` หรือ `test:unit` script
2. ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)
3. บันทึกผล: passed, failed, skipped, time

### 3. Run Integration Tests

> Goal: integration tests ผ่าน

1. ถ้ามี `test:integration` → รัน
2. ถ้าไม่มี → ข้ามและ report
3. ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)
4. บันทึกผล

### 4. Run E2E Tests

> Goal: e2e tests ผ่าน

1. ถ้ามี `test:e2e` → รัน
2. ถ้าไม่มี → ข้ามและ report
3. ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)
4. บันทึกผล

### 5. Run Coverage

> Goal: ตรวจ coverage

1. ถ้ามี `test:coverage` → รัน
2. ถ้าไม่มี coverage script → ข้ามหรือทำ manual coverage report
3. ตรวจสอบ coverage threshold ถ้ามี `package.json`
4. ถ้า coverage ต่ำกว่า threshold → report

### 6. Report

> Goal: สรุปผลการ test

1. ใช้ `/report-table` แสดง: Type, Command, Status, Duration, Notes
2. ระบุ test ที fail หรือขาด
3. ถ้าผ่านทั้งหมด → return `passed`
4. ถ้ามีบางส่วน fail → return `failed` พร้อม next action

## Rules

- รัน unit ก่อน integration ก่อน e2e (fail fast)
- ถ้าไม่มี test scripts → ใช้ `/follow-tasks` ก่อน
- ถ้า test fail → ไม่ proceed ไป ship
- coverage ต่ำกว่า threshold ถือว่า fail ถ้า project ระบุ threshold
- ไม่ mock test เพื่อให้ผ่าน

## Expected Outcome

- unit, integration, e2e tests รันครบ
- coverage report ชัดเจน
- รายงาน test results เป็น table
- พร้อมสำหรับ `/ship` ถ้าผ่านทั้งหมด
