---
name: watch-release-report-status
description: สร้าง release watch report — registry/github propagation timeline, live confirmation
argument-hint: "[scope]"
related:
  - report
  - ship
---

## Goal

แปลง watch session ของ `/watch-release` เป็น status report — release propagation บน registry/GitHub จน live

## Scope

- ใช้เมื่อ `/watch-release` dispatch มาที่ `report`/`status` หรือเรียกหลัง watch จบ
- Chat-only report — ไม่สร้างไฟล์ถาวร

## Execute

### 1. Collect Propagation Events

> Goal: รวมเหตุการณ์ตามลำดับ

1. รวม: tag pushed, CI release run, registry publish, GitHub release created, deploy target updated
2. timestamps ต่อ event — คำนวณ propagation delay
3. flag steps ที่ค้างหรือข้าม

### 2. Build Status Report

> Goal: ตอบว่า release live ครบทุกช่องทางไหม

1. ตาราง: `No.`, `Channel`, `Expected`, `Observed`, `Status`, `Time`
2. channels: git tag, GitHub release, package registry, deploy target
3. สรุป time-to-live รวม

### 3. Verdict

> Goal: ตัดสิน release completeness

1. Verdict: `fully-live` / `partial` / `stuck`
2. partial → ระบุ channel ที่ขาด + น่าจะ pending CI หรือ fail
3. แนะนำ `ship/subskills/verify-release/SKILL.md` สำหรับ artifact check เชิงลึก

## Rules

- สถานะต้องมาจาก remote (registry API, GitHub) — ไม่ใช่ local
- ระบุ propagation delay ปกติ vs ผิดปกติ (registry lag มีปกติ)
- ไม่ re-publish ใน subskill นี้

## Expected Outcome

- Status report พร้อม per-channel status + verdict
