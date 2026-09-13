---
name: watch-all-task-report-status
description: สร้าง all-tasks watch report — per-task status, blockers, completion summary
argument-hint: "[scope]"
related:
  - report
  - report-progress
  - run-task-all
---

## Goal

แปลง watch session ของ `/watch-all-task` เป็น status report — per-task progress, blockers, overall completion

## Scope

- ใช้เมื่อ `/watch-all-task` dispatch มาที่ `report`/`status` หรือเรียกหลัง watch จบ
- Chat-only report — ไม่สร้างไฟล์ถาวร

## Execute

### 1. Collect Task States

> Goal: รวมสถานะทุก task

1. รวมต่อ task: status (pending/running/done/failed/blocked), elapsed, last output
2. ระบุ dependency chains — task ไหน block ตัวไหน
3. รวม failures พร้อม error summary

### 2. Build Status Report

> Goal: dashboard แบบ text ที่เห็นภาพรวม

1. Progress summary: done/total + %
2. ตาราง: `No.`, `Task`, `Status`, `Elapsed`, `Blocker/Notes`
3. Failed/blocked tasks แยก section พร้อม error สั้นๆ

### 3. Verdict And Next

> Goal: ตัดสินว่าชุดงานเสร็จ/ติดอะไร

1. Verdict: `all-done` / `in-progress` / `blocked` / `has-failures`
2. แนะนำ action ต่อ failure (`/resolve-errors`) หรือ blocker
3. ทำ `/report-progress` สำหรับ progress bar format

## Rules

- รายงานจาก task state จริง — ไม่เดา
- failed tasks ขึ้นก่อนเสมอในรายงาน
- เก็บ task logs reference ให้ drill-down ได้

## Expected Outcome

- Status report พร้อม per-task table + failures + verdict
