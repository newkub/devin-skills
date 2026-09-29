---
name: review-stability-report-degradation
description: สร้าง degradation matrix report — dependency down → impact → fallback status
argument-hint: "[scope]"
related:
  - review-stability
  - report
  - create-report-in-dot-devin
---

## Goal

แปลง stability findings ของ `/review-stability` เป็น degradation matrix — dependency ล้มแต่ละตัวส่งผลอะไร และมี fallback ไหม

## Scope

- ใช้เมื่อ `/review-stability` dispatch มาที่ `degradation`/`matrix`/`report` หรือเรียก standalone
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Build Degradation Matrix

> Goal: dep ล้ม → impact เห็นครบ — parent Execute §8

ทำตาม `../../subagents/stability-reviewer/degradation.md`

1. inventory external dependencies — APIs, DB, cache, queue, third-party, storage
2. ตาราง: `No.`, `Dependency`, `Failure Scenario`, `Current Behavior`, `Fallback`, `Severity`
3. `Fallback` = graceful/retry/hard-fail/unknown — flag `hard-fail` บน non-critical deps

### 2. Blast Radius

> Goal: cascade paths เห็นชัด

1. chain failures — dep A ล้มแล้วดึง B/C ลงด้วย (shared pools, sync chains)
2. single points — dep ที่ล้ม = app ล้มทั้งตัวโดยไม่จำเป็น

### 3. Summarize

> Goal: resilience posture + priorities

1. counts per fallback type + worst single points
2. fix route → `../improve-resilience/SKILL.md` หรือ parent `## Fix`
3. ถ้าต้องเก็บถาวร → `/create-report-in-dot-devin`

## Rules

- matrix จาก code/config จริง — `unknown` เมื่อ behavior ตรวจไม่ได้ ห้ามเดา
- ทุก row ระบุ evidence: call site + timeout/retry config
- artifact อยู่ใน `.devin/` เท่านั้น — matrix เปิดเผย weakness map

## Expected Outcome

- Degradation matrix ครบทุก dependency พร้อม fallback status
- Single points of failure + cascade risks flagged
