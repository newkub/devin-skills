---
name: watch-browser-test-report-status
description: สร้าง browser test watch report — scenarios pass/fail, failure evidence, flaky signals
argument-hint: "[session-or-url]"
related:
  - report
  - create-report-in-dot-devin
  - run-test
---

## Goal

แปลง session ของ `/watch-browser-test` เป็น report — test scenarios ที่ผ่าน/ไม่ผ่าน พร้อม failure evidence

## Scope

- ใช้เมื่อ `/watch-browser-test` dispatch มาที่ `report`/`status` หรือเรียกหลัง session จบ
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Collect Test Results

> Goal: รวมผลต่อ scenario

1. รวมต่อ scenario: pass/fail, duration, failure point (step ที่พัง)
2. รวม evidence ต่อ failure: screenshot, console error, network fail
3. flag flaky signals: pass บ้าง fail บ้างข้าม runs

### 2. Build Report

> Goal: ตอบว่า flows สำคัญทำงานไหม

1. ตาราง: `No.`, `Scenario`, `Result`, `Duration`, `Failure Point`, `Evidence`
2. Summary: pass rate, slowest scenarios, failures by cause
3. Flaky scenarios แยก section

### 3. Verdict

> Goal: ตัดสิน test health

1. Verdict: `all-pass` / `has-failures` / `flaky`
2. failures → แนะนำ `/resolve-errors` หรือ `/review-test fix-flaky`
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- failure ต้องมี evidence (screenshot/console) — ไม่ใช่แค่ status
- แยก product bug จาก test bug (selector หลุด, timing)
- flaky ต้องมีอย่างน้อย 2 runs ที่ผลต่างกันก่อน flag

## Expected Outcome

- Test report พร้อม per-scenario results + flaky signals + verdict
