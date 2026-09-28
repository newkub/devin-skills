---
name: review-config-setup-env-validation
description: Setup env validation จากศูนย์ — startup schema, safe defaults, clear errors
argument-hint: "[entrypoint-or-scope]"
related:
  - review-config
  - follow-lib-zod
  - follow-config
  - run-check
  - report-before-after
---

## Goal

สร้าง env validation จากศูนย์ตาม findings ของ `/review-config` — เมื่อ app boot ผ่านแม้ env ขาด/ผิดแล้วพังทีหลัง

## Scope

- ใช้เมื่อ findings คือ "ไม่มี env validation" — fix vars ที่ขาด/ผิดทำใน parent `## Fix`
- ครอบคลุม: validation schema ที่ startup, defaults, coercion, error messages

## Execute

### 1. Inventory Vars

> Goal: env contract ครบก่อนเขียน schema

1. list vars ทั้งหมดที่ code ใช้ + ที่ infra ต้องการ (จาก `../check-env/SKILL.md` findings)
2. จำแนก: required vs optional, type (string/number/boolean/url/enum), sensitive vs public
3. client-exposed vars แยก schema (prefix rules)

### 2. Build Validation

> Goal: boot fail ชัดเจนเมื่อ env ผิด

1. schema ที่ startup entrypoint จุดเดียว — zod/valibot ตาม stack (`/follow-lib-zod` ถ้าใช้ zod)
2. coercion — string→number/boolean ผ่าน schema ไม่ใช่ `parseInt` กระจาย
3. defaults — safe defaults เฉพาะ non-sensitive optional; required missing → error บอกชื่อ var + expected format
4. access pattern — export typed config object เดียว ห้าม `process.env` กระจาย (เพิ่ม lint rule ถ้ามี)

### 3. Verify

> Goal: validation ทำงานจริงทุก env

1. boot ด้วย env ขาด/ผิด → error ชัดเจนไม่ใช่ runtime crash ทีหลัง
2. boot ปกติทุก env (dev/test/prod-like) ผ่าน
3. `/run-check` + `/report-before-after` — unvalidated vars เหลือ 0

## Rules

- validate ที่ boundary เดียว (entrypoint) — ห้าม schema กระจายหลายจุด
- error message ระบุ var name + expected — ห้าม generic "config invalid"
- ห้าม default secrets — sensitive vars required เสมอ
- preserve behavior — vars เดิมที่ valid ต้อง boot เหมือนเดิม

## Expected Outcome

- Startup validation ครบทุก var พร้อม typed config access
- Boot errors ชัดเจนเมื่อ env ขาด/ผิด
