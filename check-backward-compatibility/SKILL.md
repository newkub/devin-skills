---
name: check-backward-compatibility
description: ตรวจหา breaking changes ใน public API หรือ schema
argument-hint: "[base-ref] [head-ref]"
related:
  - review-references
  - run-release
---

## Goal
ตรวจสอบว่าการเปลี่ยนแปลงใน public API หรือ schema ทำให้ consumer เดิมใช้ไม่ได้หรือไม่

## Scope
- รองรับ REST API, GraphQL, gRPC, library public API
- เปรียบเทียบสองเวอร์ชัน
- รายงาน breaking, deprecated, non-breaking changes

## Execute
### 1. Identify Public API

> Goal: Identify Public API

1. ระบุ public API หรือ schema ที่ต้องตรวจ
2. ใช้ OpenAPI, GraphQL schema, หรือ exports ของ library
3. เก็บ snapshot ของ base version

### 2. Compare

> Goal: Compare

1. ใช้ `oasdiff` สำหรับ OpenAPI
2. ใช้ `graphql-inspector` สำหรับ GraphQL
3. ใช้ `ts-api-guardian` หรือ `api-extractor` สำหรับ TypeScript library
4. ใช้ `buf breaking` สำหรับ gRPC/Protobuf

### 3. Classify

> Goal: Classify

1. แบ่งเป็น breaking, deprecated, non-breaking
2. ระบุ consumers ทีอาจ affected
3. ตรวจสอบ semantic version bump ทีเหมาะสม

### 4. Report

> Goal: Report

1. สรุป changes พร้อม migration guide
2. ระบุ version bump แนะนำ
3. แนะนำ next action: fix, deprecate, หรือ bump major

## Rules
### 1. Public Only

- ตรวจเฉพาะ public API ไม่ใช่ internal
- ข้าม internal modules โดย default
- ระบุ stability level ถ้ามี

### 2. Semver

- แนะนำ version bump ตาม semver
- breaking change → major
- new feature non-breaking → minor
- bug fix → patch

## Expected Outcome
- รายการ breaking และ deprecated changes
- recommended version bump
- migration guide สั้นๆ
