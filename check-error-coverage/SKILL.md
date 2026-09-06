---
name: check-error-coverage
description: ตรวจ errors ที่ throw แล้วไม่มี handler จับ และ catch blocks ที่ swallow errors
argument-hint: "[path]"
related:
  - improve-error-handling
  - use-astgrep
  - review-stability
  - run-test
  - follow-asynchronous
  - report-table
---

## Goal

ตรวจ error handling coverage — หา errors ที่ถูก throw/reject แต่ไม่มี catch ที่จับ, catch blocks ที่ swallow errors เงียบๆ, และ error paths ที่ไม่มี test

## Scope

- ตรวจ `throw`, `Promise.reject`, `Result.err` และ call sites ของ fallible functions
- ตรวจ `catch` blocks: empty catch, catch ที่ไม่ rethrow/log, catch ที่ return default เงียบๆ
- ตรวจ async error paths: unhandled rejection, missing `.catch()`, `await` ที่ไม่อยู่ใน try
- Read-only: รายงาน gaps — แก้ไขผ่าน `/improve-error-handling`

## Execute

### 1. Map Error Sources

> Goal: หาจุดที่ errors เกิดทั้งหมด

1. ใช้ `use-astgrep` ค้นหา `throw`, `Promise.reject`, `new Error`, custom error classes
2. หา fallible boundaries: API calls, file I/O, parsing, DB queries, external services
3. จัดกลุ่มตาม module/layer

### 2. Trace Error Paths

> Goal: ตรวจว่าแต่ละ error ถูกจัดการหรือไม่

1. ตรวจ call sites ของ fallible functions — มี try/catch หรือ `.catch()` ครอบไหม
2. สำหรับ async: ตรวจ floating promises และ missing `await` (ทำ `/check-async-misuse` ร่วม)
3. ตรวจ top-level handlers: Express error middleware, Elysia `onError`, global `unhandledRejection`
4. flag errors ที่ propagate ขึ้นไปแต่ไม่มี handler ปลายทาง

### 3. Detect Swallowed Errors

> Goal: หา catch ที่กลืน error เงียบๆ

1. flag empty catch blocks `catch {}` หรือ `catch (e) {}`
2. flag catch ที่ comment `// ignore` โดยไม่ log หรือ metric
3. flag catch ที่ return `null`/`[]`/`false` เงียบๆ ทำให้ caller ไม่รู้ว่า fail
4. ข้าม intentional swallow ที่มี comment อธิบายเหตุผล

### 4. Check Test Coverage Of Error Paths

> Goal: ตรวจว่า error paths มี test ครอบคลุม

1. เทียบ error branches กับ test files — มี test ที่ trigger error นั้นไหม
2. flag critical error paths (auth, payment, data loss) ที่ไม่มี test
3. ทำ `/run-test` หรือ `/run-test-coverage` ถ้าต้องการตัวเลขจริง

### 5. Report

> Goal: สรุป coverage gaps พร้อม severity

1. ใช้ `/report-table` คอลัมน์: `No.`, `Location`, `Issue Type`, `Error`, `Severity`, `Fix`
2. Issue types: `unhandled`, `swallowed`, `untested`, `no-top-level-handler`
3. แนะนำ `/improve-error-handling` สำหรับ remediation

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี file:line และ error path ที่ trace ได้
- ไม่ flag theoretical paths — เฉพาะที่ reachable จริง

### 2. Read-Only

- ไม่แก้ error handling — รายงานแล้วทำ `/improve-error-handling`

### 3. Context Aware

- Background jobs/event handlers อาจตั้งใจให้ fail silently + retry — ตรวจ context ก่อน flag
- Library code อาจ throw ให้ consumer จัดการ — ตรวจว่าเป็น intentional API design

## Expected Outcome

- รายการ unhandled/swallowed errors พร้อมตำแหน่งและ severity
- Error paths ที่ไม่มี test coverage
- สรุป % coverage และ prioritized fix list
