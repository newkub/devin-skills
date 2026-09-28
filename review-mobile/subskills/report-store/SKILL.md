---
name: review-mobile-report-store
description: สร้าง store-readiness report — per-platform checklist verdict + rejection risks
argument-hint: "[ios|android|all]"
related:
  - review-mobile
  - report
  - create-report-in-dot-devin
---

## Goal

แปลง mobile findings ของ `/review-mobile` เป็น store-readiness report — go/no-go checklist ที่เห็น rejection risks ก่อน submit

## Scope

- ใช้เมื่อ `/review-mobile` dispatch มาที่ `store`/`report-store` หรือเรียก standalone
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Build Readiness Table

> Goal: checklist ที่ตอบ go/no-go ได้ — parent Execute §6

1. ตาราง: `No.`, `Requirement`, `Platform`, `Status`, `Evidence`, `Fix`
2. cover: signing/bundles, permissions + usage strings, privacy manifest/data labels, icons/screenshots, version/build numbering, content rating
3. `Status` = ผ่าน/ไม่ผ่าน/unknown — unknown ต้องมี next check ชัด

### 2. Rejection Risks

> Goal: top risks ที่เคยโดน reject

1. permission misuse, placeholder/unfinished content, broken signup/deep links
2. crash paths จาก stability findings
3. เทียบ platform-specific rejection themes (App Store guidelines vs Play policies)

### 3. Verdict

> Goal: submit decision

1. verdict: `ready` / `ready-with-fixes` / `blocked` + blockers list
2. fix route → parent `## Fix` ตาม dimension
3. ถ้าต้องเก็บถาวร → `/create-report-in-dot-devin`

## Rules

- ทุก requirement มี evidence — config file, asset existence, หรือ behavior test
- ห้ามเดา status — ตรวจไม่ได้ให้ `unknown` + ระบุวิธีเช็ค
- verdict ต้อง conservative — blocker 1 ตัว = blocked

## Expected Outcome

- Store readiness table per platform พร้อม pass/fail/unknown
- Rejection risks + go/no-go verdict ชัดเจน
