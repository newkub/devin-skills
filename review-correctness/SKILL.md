---
name: review-correctness
description: Review correctness, logic, edge cases, and validation for code, config, rules, workflows, and skills
auto_execution_mode: 3
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - scan-codebase
  - validate
  - deep-validate
  - report
  - report-table
  - suggest-next-action
---

## Goal

Review ความถูกต้องของ code, configuration, rule files, workflows, หรือ skills ตาม criteria, standards, และ requirements ที่ระบุ โดยเน้น correctness, logic, edge cases, และ validation พร้อมรายงาน findings และ review score

## Scope

correctness review สำหรับ: code, configuration, rule files, workflows, skills. ตรวจสอบความถูกต้องตาม criteria ที่ user กำหนด ครอบคลุม:

- correctness: การทำงานตาม requirements, calculations, transformations
- logic: control flow, conditions, type safety, ordering
- edge cases: null, empty, boundary, concurrency, unexpected states
- validation: input, output, schema, sanitization, error handling

ทำ review เท่านั้น ไม่แก้ไข code โดยไม่ได้รับอนุญาต

## Execute

### 1. Prepare And Gather Criteria

> Goal: รวบรวม criteria และ context สำหรับ review

1. อ่าน requirements, rules, standards ที่ user ระบุ
2. ถ้าเป็น skill → อ่าน `global_rules.md` และ skill conventions
3. ระบุ criteria ที่ concrete และ measurable
4. ถ้า criteria ไม่ชัด → stop และ `/ask-me`

### 2. Review Checklist

> Goal: ตรวจสอบ correctness, logic, edge cases, และ validation โดยไม่แก้ไข code

ใช้ `read`, `grep`, `exec` หรือ `/use-scripts` scan ไฟล์ที่เกี่ยวข้อง บันทึก findings พร้อม evidence

#### Correctness

- ตรวจสอบว่า code/config ทำงานตาม requirements และ criteria ที่ระบุ
- ตรวจสอบ calculations, transformations, data mappings, serialization
- ตรวจสอบ error handling, defaults, assumptions, invariants
- ตรวจสอบ references, links, และ configuration values

#### Logic

- ตรวจสอบ control flow: `if/else`, `switch`, loops ว่า complete และ correct
- ตรวจสอบ boolean expressions, conditions, short-circuit
- ตรวจสอบ ordering, sequencing, dependencies
- ตรวจสอบ type safety, narrowing, assertions
- หา non-exhaustive `switch`/`if-else` หรือ discriminated unions ที่ขาด case

#### Edge Cases

- ตรวจสอบ `null`/`undefined`, empty, zero, negative, maximum, minimum
- ตรวจสอบ concurrency, race conditions, timeouts, async cancellation
- ตรวจสอบ malformed input, boundary values, unexpected states
- ตรวจสอบ recovery paths และ fallback behavior
- หา implicit assumptions และ unsafe defaults

#### Validation

- ตรวจสอบ input validation, schema validation, output validation
- ตรวจสอบ data contracts, sanitization, type coercion
- ตรวจสอบ error messages, validation coverage across layers
- ตรวจสอบ verify ด้วย tests, commands, scripts เช่น `bun run lint`, `bun run typecheck`

### 3. Validate And Report

> Goal: ยืนยัน findings และรายงานผล

1. ทำ `/validate` เพื่อตรวจ findings
2. ทำ `/deep-validate` เพื่อ validate หลายมิติถ้าจำเป็น
3. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

### 4. Fix

> Goal: แก้ไข issues ที review พบ

1. เรียงลำดับตาม severity Critical → High → Medium → Low
2. ใช้ `/follow-best-practice` หรือ `/learn-from-web` หา pattern ทีเหมาะสม
3. แก้ไขปัญหาแต่ละข้อด้วย `edit` หรือ `write` ด้วย minimal changes
4. ทดสอบแก้ไขด้วยคำสั่งหรือ script ทีเหมาะสม
5. ทำ `/validate` และ `/run-check` หลังแก้
6. ถ้าไม่ผ่าน → `/resolve-errors` แล้ว retry สูงสุด 3 รอบ
7. ถ้าพบปัญหาใหม่ระหว่างแก้ → บันทึกและจัดลำดับใหม่
8. ทำ `/suggest-next-action` หลังผ่าน

## Rules

### 1. Evidence First

- ห้ามเดา issues โดยไม่มี evidence
- ทุก issue ต้องระบุไฟล์ บรรทัด หรือ output
- ใช้ tools หรือ scripts ก่อน manual inspection

### 2. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- แยก review process จาก fix process
- ถ้าต้องแก้ไข ให้ทำ `/resolve-errors` หรือขออนุญาตก่อน

### 3. Scope Control

- review เฉพาะ scope ที่ระบุ
- ถ้าพบ issues นอก scope → รายงาน ไม่แก้โดยไม่ได้รับอนุญาต

### 4. Safety

- ทำ dry run ก่อน destructive fixes
- ไม่แก้ security policies, credentials, หรือ compliance controls

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

### 6. Fix Rules

- ใช้ minimal changes
- ไม่แก้นอก scope
- ทำ dry run ก่อน destructive changes
- ถ้าไม่แน่ใจ → stop และ `/ask-me`

## Expected Outcome

- รายงาน findings ครอบคลุม correctness, logic, edge cases, validation
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
