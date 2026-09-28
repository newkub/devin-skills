---
name: review-api-report-endpoints
description: สร้าง endpoint inventory report — method/path/auth/validation status ต่อ endpoint
argument-hint: "[scope]"
related:
  - review-api
  - report
  - create-report-in-dot-devin
---

## Goal

แปลง API findings ของ `/review-api` เป็น endpoint inventory — ทุก route พร้อม auth, validation, docs status ที่ audit ได้ทันที

## Scope

- ใช้เมื่อ `/review-api` dispatch มาที่ `endpoints`/`report-endpoints` หรือเรียก standalone
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Inventory Endpoints

> Goal: list ครบจาก code จริง

1. scan routes จาก framework (router files, decorators, route manifests)
2. normalize เป็น `METHOD /path` — เทียบกับ spec/docs ถ้ามี

### 2. Build Endpoint Table

> Goal: ทุก endpoint เห็น posture ทันที

1. ตาราง: `No.`, `Endpoint`, `Auth`, `Validation`, `Docs`, `Severity`, `Issue`
2. `Auth` = required/none/public — flag ผิดจาก convention
3. `Validation` = schema present/missing; `Docs` = in-spec/undocumented
4. group ตาม resource หรือ path prefix

### 3. Summarize

> Goal: posture + priorities

1. counts: endpoints ทั้งหมด, missing auth, missing validation, undocumented
2. top risks: mutation endpoints ที่ไม่มี auth/validation
3. fix route → parent `## Fix`; drift findings → `../update-contract/SKILL.md`

## Rules

- inventory จาก route definitions จริง — ห้ามเดา endpoints
- internal/admin endpoints แยก section อย่ารวมกับ public
- persistent artifact อยู่ใน `.devin/` เท่านั้น — endpoint list เปิดเผย attack surface

## Expected Outcome

- Endpoint inventory ครบทุก route พร้อม auth/validation/docs status
- Undocumented + unprotected endpoints flagged พร้อม priority
