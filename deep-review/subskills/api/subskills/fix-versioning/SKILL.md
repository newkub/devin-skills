---
name: review-api-fix-versioning
description: Fix API versioning strategy — version scheme, deprecation policy, backward compatibility
argument-hint: "[scope-or-findings]"
related:
  - review-api
  - check-api-versioning
  - check-backward-compatibility
  - check-api-contract
  - run-test

  - ask-me
  - report
  - resolve-errors
---

## Goal

แก้ versioning findings จาก `/review-api` — versioning scheme ไม่สม่ำเสมอ, breaking changes ไม่มี deprecation path, ไม่มี sunset policy หรือ backward compatibility พัง

## Scope

- ครอบคลุม: version scheme (URL path, header, media type), version consistency ข้าม endpoints, deprecation/sunset headers และ timeline, migration docs, backward compatibility guarantees
- ไม่ครอบคลุม contract drift ที่ไม่ใช่ breaking → ใช้ `subskills/fix-contract/SKILL.md`

## Execute

### 1. Audit Versioning State

> Goal: รู้ versioning approach ปัจจุบันและจุดที่ผิด

1. ทำ `/check-api-versioning` — เก็บรายการ endpoints ที่ version ไม่สม่ำเสมอหรือไม่มี
2. ระบุ scheme ที่ project ใช้ (URL path `/v1`, header, media type) — ยึด convention เดิม
3. หา breaking changes ที่ถูก ship โดยไม่มี version bump หรือ deprecation

### 2. Unify Version Scheme

> Goal: ทุก endpoint อยู่ภายใต้ versioning strategy เดียวกัน

1. นำ endpoints ที่หลุด scheme กลับเข้า convention เดิม — เลือก route structure ตาม existing pattern
2. ถ้า project ไม่มี convention → เสนอ scheme ผ่าน `/ask-me` ก่อน implement (เสี่ยงสูง)
3. ใส่ version ที่ boundary เดียว (router mount/gateway) ไม่กระจายใน handlers

### 3. Establish Deprecation Policy

> Goal: breaking changes มี path ให้ client migrate

1. เพิ่ม deprecation signals: `Deprecation`/`Sunset` headers, warning ใน response หรือ docs
2. กำหนด timeline และ migration docs สำหรับ version ที่จะถอด — ห้ามลบ version เก่าทิ้งทันที
3. ตั้ง policy ชัด: ระยะ overlap ของ versions, ช่องทางแจ้ง client, เกณฑ์ยกเลิก support

### 4. Protect Backward Compatibility

> Goal: client เดิมไม่พังจากการเปลี่ยนแปลง

1. ทำ `/check-backward-compatibility` — additive changes (new optional fields) ปลอดภัยกว่า breaking
2. Prefer additive: เพิ่ม field/endpoint ใหม่แทนเปลี่ยนของเดิม — default values สำหรับ fields ใหม่
3. ถ้าต้อง breaking → version ใหม่ควบคู่ของเดิม พร้อม deprecation timeline

### 5. Verify

> Goal: versioning สม่ำเสมอและ clients ปลอดภัย

1. ทำ `/check-api-versioning` ซ้ำ — ไม่มี endpoint หลุด scheme
2. รัน `/run-test` (api) และ `/run-test` — version เดิมและใหม่ทำงานควบคู่
3. ทำ `/check-api-contract` — contract แต่ละ version ถูกต้อง

## Rules

- ตัดสินตาม existing conventions ของ project — ไม่บังคับ versioning style ใหม่
- ห้ามลบ version เก่าโดยไม่มี deprecation timeline และ user confirmation (`/ask-me`)
- ทุก breaking change ต้องมี migration path — document ใน API docs
- ถ้า check ไม่ผ่าน → `/resolve-errors` สูงสุด 3 รอบแล้ว report

## Expected Outcome

- Versioning scheme เดียวครอบคลุมทุก endpoint
- Deprecation/sunset policy ชัดเจนพร้อม headers และ timeline
- Backward compatibility ผ่านการตรวจ — รายงานผ่าน `/report`

