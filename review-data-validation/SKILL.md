---
name: review-data-validation
description: ตรวจสอบ data validation ใน API, forms, schemas ว่าครอบคลุม, ปลอดภัย และ type-safe หรือไม่
argument-hint: "[schema-or-api-pattern]"
related:
  - scan-codebase
  - report
  - review-security
  - run-review
  - use-subagents

---

## Goal

ตรวจสอบ data validation ใน API, forms, schemas ว่าครอบคลุม, ปลอดภัย และ type-safe หรือไม่ ก่อนส่งต่อไปยัง section `## Fix` — domain checklist อยู่ใน `subagents/data-validation-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้กับ backend, API routes, forms, database operations โดย audit validation logic โดยไม่แก้ไข code

| Dimension | Checklist |
|-----------|-----------|
| `coverage` — boundaries, endpoints, input sources | `subagents/data-validation-reviewer/coverage.md` |
| `schema-lifecycle` — versioning, PII tagging, business rules | `subagents/data-validation-reviewer/schema-lifecycle.md` |
| overview — full-dimension checklist | `subagents/data-validation-reviewer/checklist.md` |

## Execute

### 1. Prepare And Baseline

> Goal: รู้ว่าใช้ validation library อะไร

1. ทำ `/scan-codebase` หา schemas, validation files และ `package.json` สำหรับ `zod`, `valibot`, `arktype`, `joi`, `class-validator`
2. ตรวจ schemas ใน `src/schemas`, `src/validations`
3. ตรวจ API routes สำหรับ input validation และ forms สำหรับ client-side validation
4. ทำ `/run-review` เก็บ analyzer baseline (ใช้เป็น findings-file ให้ subagent cross-check)

### 2. Dispatch Data-Validation-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension (`coverage`, `schema-lifecycle`)
2. Spawn `subagents/data-validation-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย bounded context → spawn หลาย instance ทีละ scope ขนานกัน

### 3. Aggregate And Score

> Goal: findings รวมกันพร้อม severity + score ต่อ dimension

1. รวม findings จากทุก instance — dedup ตาม endpoint/schema + issue type
2. classify severity ตาม impact (data leak, injection, crash): Critical → Info
3. security risk สูงนอกขอบเขต → ระบุเป็น info + เชื่อม `/review-security`

### 4. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report` ด้วย columns: No., Endpoint/Form, Issue, Severity, Fix + score ต่อ dimension และ overall
2. ชี้ไป section `## Fix` สำหรับการแก้ไข
3. ทำ `/suggest-next-action`

### Subagents

> Goal: domain reviewer ที่ถือ checklist ทั้งหมด — spawn ผ่าน `/use-subagents`

| Agent | Path |
|-------|------|
| `data-validation-reviewer` — validation dimensions พร้อม severity + evidence | `subagents/data-validation-reviewer/AGENT.md` |

## Rules

### 1. Read Only

- ห้ามแก้ไข schemas หรือ validation rules ระหว่าง review
- ห้ามรัน queries หรือ submit ข้อมูลจริง
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/data-validation-reviewer/` เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องอ้างอิง schema file/line หรือ API route
- ระบุ severity ตาม impact (data leak, injection, crash)

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. แก้ตาม finding — validation ใน API, forms, schemas ให้ครอบคลุม ปลอดภัย และ type-safe (data validation)
3. preserve behavior + verify + report — canonical ที่ `../shared/review-fix.md`

## Expected Outcome

- รายงาน findings ครอบคลุม coverage, security, type safety
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
