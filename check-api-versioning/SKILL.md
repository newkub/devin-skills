---
name: check-api-versioning
description: ตรวจ API versioning strategy — deprecated versions ที่ยัง live และ breaking change hygiene
argument-hint: "[api-scope]"
related:
  - check-api-contract
  - check-backward-compatibility
  - check-deprecated-apis
  - review-api
  - gen-openapi
  - report
---

## Goal

ตรวจ API versioning ว่า consistent และจัดการ lifecycle ถูกต้อง — version strategy ชัดเจน, deprecated versions มี sunset plan, breaking changes ถูกจัดการ

## Scope

- ตรวจ versioned endpoints: URL paths (`/v1/`, `/v2/`), header versioning, query versioning
- ครอบคลุม: version strategy consistency, deprecated-but-live versions, sunset headers, version docs, breaking change policy
- Read-only: รายงาน — แก้ผ่าน `/review-api` remediation

## Execute

### 1. Map API Versions

> Goal: รวบรวม versions ทั้งหมดที่ live

1. หา versioned routes/handlers — `/v1/*`, `/v2/*`, `Accept-Version` headers, query params
2. ระบุ versions ที่ active, deprecated, sunset — จาก code + docs + config
3. flag: endpoints ที่ไม่มี version เลยปนกับที่มี (inconsistent strategy)

### 2. Check Strategy Consistency

> Goal: ตรวจว่า versioning approach เดียวกันทั้ง API

1. Path vs header vs query — mixing strategies = inconsistency
2. Default version behavior — unversioned requests ไป version ไหน
3. Version granularity — per-resource vs per-API
4. ทำ `/check-api-contract` ตรวจ spec กับ impl ตรงกันไหมต่อ version

### 3. Check Deprecation Lifecycle

> Goal: ตรวจว่า old versions ตายอย่างเป็นระบบ

1. Deprecated versions ต้องมี: `Sunset`/`Deprecation` headers, docs, timeline
2. flag: versions ที่ deprecated นานแต่ยัง serve traffic เต็ม — ไม่มี sunset plan
3. flag: consumers ที่ยังใช้ old versions (จาก logs/analytics ถ้ามี)
4. ทำ `/check-deprecated-apis` ร่วมสำหรับ deprecated symbols ใน code

### 4. Check Breaking Change Hygiene

> Goal: ตรวจว่า changes ไม่ break existing versions

1. ทำ `/check-backward-compatibility` เทียบ version ปัจจุบันกับก่อนหน้า
2. flag: fields ที่หาย/เปลี่ยน type ใน version เดียวกัน
3. flag: version bumps ที่ไม่มี changelog/migration guide

### 5. Report

> Goal: สรุป versioning health

1. ใช้ `/report`: `No.`, `Version`, `Status`, `Consumers`, `Issue`, `Severity`, `Action`
2. Severity: `critical` (breaking ใน live version), `high` (deprecated ไม่มี sunset), `medium` (inconsistent strategy)

## Rules

### 1. Evidence-Based

- version status ต้องมาจาก code/docs/headers จริง — ไม่เดา
- consumer data ใช้เฉพาะที่มีจริง — ไม่มีให้ระบุ `unknown`

### 2. Read-Only

- ไม่แก้ routes/versions — รายงานให้ remediation แยก
- ไม่ deprecate version เอง

### 3. Contract Aware

- ทุก version ต้องมี spec/contract ที่ตรง — ทำ `/gen-openapi` per version ถ้าขาด
- breaking changes ระหว่าง versions ต้อง documented

## Expected Outcome

- Version inventory พร้อม status ต่อ version
- Deprecation/sunset gaps และ breaking change risks
- Strategy consistency assessment
