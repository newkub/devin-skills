---
title: Reference Index
description: ตาราง mapping reference files ของ review-features
related:
  - review-features
---

## Goal

Map reference file แต่ละไฟล์ไปยัง responsibility ของมันใน `review-features`

## Scope

ใช้สำหรับค้นหา reference file ที่เกี่ยวข้องกับแต่ละ Execute step ของ `review-features`

## Reference Files

| File | Responsibility | Execute Step |
| --- | --- | --- |
| `references/format.md` | ตรวจ format ของ `docs/project/features.md` — markdown table columns, domain grouping, no HTML | Check Format |
| `references/coverage.md` | ตรวจ features coverage จาก source code — routes, modules, database schema, server handlers, API routes | Check Coverage |
| `references/duplication.md` | ตรวจ no duplication — ไม่มี `docs/` ในแต่ละ workspace, ไม่มี `.devin/features/`, ไม่มี duplicate docs | Check No Duplication |
| `references/monorepo.md` | ตรวจ monorepo coverage — ทุก workspace ถูกวิเคราะห์, แต่ละ feature ระบุ workspace | Check Monorepo Coverage |
| `references/scoring.md` | คำนวณ review score และ grade — severity to score, grade thresholds, action threshold | Score And Report |

## Usage

1. ก่อนเริ่ม Execute step ใด ให้อ่าน reference file ที่เกี่ยวข้อง
2. ใช้ตารางด้านบนเพื่อหา reference file ตาม Execute step
3. แต่ละ reference file มี single responsibility — ไม่ซ้ำซ้อนกัน
4. ถ้า reference file ขาด → stop และ report

## Expected Outcome

- ค้นหา reference file ที่ถูกต้องสำหรับแต่ละ Execute step ได้รวดเร็ว
- แต่ละ reference file ครอบคลุม concern เดียวชัดเจน
