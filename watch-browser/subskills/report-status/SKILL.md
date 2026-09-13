---
name: watch-browser-report-status
description: สร้าง browser watch status report — timeline, errors, state changes ระหว่าง session
argument-hint: "[session-or-url]"
related:
  - report
  - use-agent-browser
  - create-report-in-dot-devin
---

## Goal

แปลง watch session ของ `/watch-browser` เป็น status report — timeline ของ events, errors, state changes

## Scope

- ใช้เมื่อ `/watch-browser` dispatch มาที่ `report`/`status` หรือเรียกหลัง watch จบ
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Collect Events

> Goal: รวม events จาก watch session

1. รวมจาก agent-browser: navigation, console errors, network fails, state changes, screenshots ที่จับได้
2. จัดเรียงเป็น timeline พร้อม timestamps
3. dedupe events ที่ซ้ำ (error เดิม fire หลายครั้ง)

### 2. Build Status Report

> Goal: report ที่ตอบว่า app ทำงานยังไงระหว่าง watch

1. Summary: session duration, pages visited, error count
2. ตาราง: `No.`, `Time`, `Event`, `Severity`, `Detail`
3. Screenshots reference ถ้ามี — link path ไม่ embed

### 3. Verdict

> Goal: สรุป health ของ session

1. Verdict: `healthy` / `warnings` / `errors-found`
2. Top issues ที่ต้อง follow-up (`/watch-browser-fix` หรือ `/resolve-errors`)
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- timeline ต้องมี timestamps จริง — ไม่ reconstruct จาก memory
- error เดิมที่ซ้ำ count ไว้ ไม่ list ซ้ำ
- screenshots เป็น references ไม่ inline

## Expected Outcome

- Status report พร้อม timeline + error counts + verdict
