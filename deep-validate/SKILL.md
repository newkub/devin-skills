---
name: deep-validate
description: Validate ละเอียดหลายมิติ cross-reference, type safety, runtime, security, compliance
argument-hint: "[scope|correctness|type-safety|quality|security|compliance|cross-reference]"
related:
  - rethink
  - run-test
  - review-quality
  - run-typecheck
  - report
  - suggest-next-action
  - resolve-errors
  - run-check
  - run-build
  - run-test-all
  - run-verify
---

## Goal

Validate ละเอียดหลายมิติ: correctness, type safety, runtime, security, compliance, cross-reference พร้อม severity ratings

## Scope

ใช้สำหรับ validation ที่ต้องการความละเอียดสูง ครอบคลุมทุกมิติของระบบ

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: run-verify) — ถ้าต้อง verify หลัง `/merge` หรือ parallel work ดู `references/post-merge-verify.md`
- สำหรับ validate tests ใช้ `/run-test`; สำหรับ validate review ใช้ `/review-quality`

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ (Step N ขึ้นกับ Step N-1)

### 1. Define Validation Scope

> Goal: Define Validation Scope

กำหนดขอบเขตการ validate ตามสิ่งที่ต้องตรวจสอบ

- ระบุสิ่งที่ต้อง validate: code, documentation, design, decision, workflow, configuration
- ระบุ dimensions ที่เกี่ยวข้อง: correctness, type safety, runtime, security, compliance, cross-reference
- กำหนด success criteria สำหรับแต่ละ dimension
- ระบุ standards หรือ principles ที่ใช้เป็นเกณฑ์
- ถ้าไม่ทราบ scope ให้ถามผู้ใช้

### Subskills

> Goal: dispatch ไปยัง dimension subskill ตาม argument — หรือรันครบทุก dimension ถ้าไม่ระบุ

| Dimension/Argument | Subskill |
|--------------------|----------|
| `correctness` | `subskills/check-correctness/SKILL.md` — requirements, logic, edge cases, error handling |
| `type-safety`, `types` | `subskills/check-type-safety/SKILL.md` — typecheck, `any`/`@ts-ignore`, type flow |
| `quality` | `subskills/check-quality/SKILL.md` — readability, consistency, docs, best practices |
| `security` | `subskills/check-security/SKILL.md` — input validation, auth, secrets, injection |
| `compliance` | `subskills/check-compliance/SKILL.md` — requirements fit, conventions, regulatory |
| `cross-reference`, `refs` | `subskills/check-cross-references/SKILL.md` — config/env, module refs, API contracts, docs |
| `report`, `findings` | `subskills/report-findings/SKILL.md` — รวม findings ทุก dimension เป็น severity matrix |

1. ถ้า argument ระบุ dimension เดียว → อ่าน `subskills/check-<dim>/SKILL.md` แล้วทำตาม flow ในนั้น — ข้าม dimensions อื่น แต่ยังทำ Step 8 (Report)
2. ถ้าไม่ระบุ → ทำ Steps 2-7 ตามลำดับ โดยแต่ละ step อ่าน subskill ที่ตรงมา execute

### 2. Check Correctness

> Goal: Check Correctness

ทำตาม `subskills/check-correctness/SKILL.md` — ตรวจ requirements, logic, edge cases, error handling พร้อมบันทึก findings + severity

### 3. Check Type Safety

> Goal: Check Type Safety

ทำตาม `subskills/check-type-safety/SKILL.md` — typecheck, weak types (`any`/`@ts-ignore`), type flow พร้อมบันทึก findings + severity

### 4. Check Quality

> Goal: Check Quality

ทำตาม `subskills/check-quality/SKILL.md` — readability, consistency, docs, conventions พร้อมบันทึก findings + severity

### 5. Check Security

> Goal: Check Security

ทำตาม `subskills/check-security/SKILL.md` — input validation, auth, secrets, injection, rate limiting พร้อมบันทึก findings + severity

### 6. Check Compliance

> Goal: Check Compliance

ทำตาม `subskills/check-compliance/SKILL.md` — requirements fit, conventions (`AGENTS.md`), regulatory พร้อมบันทึก findings + severity

### 7. Cross-Reference Validation

> Goal: Cross-Reference Validation

ทำตาม `subskills/check-cross-references/SKILL.md` — config/env, module refs, API contracts, docs พร้อมบันทึก findings + severity

### 8. Report And Suggest

> Goal: Report And Suggest

ทำตาม `subskills/report-findings/SKILL.md` — รวม findings เป็น severity matrix พร้อม recommendations แล้วทำ `/suggest-next-action`

## Rules

### 1. Validation Approach

- ตรวจสอบอย่างเคร่งครัดและ systematic
- พิจารณา context และ constraints ที่เกี่ยวข้อง
- ใช้ criteria ที่ชัดเจนในการตรวจสอบ
- ทุก finding ต้องมี evidence (file path, line number, code snippet)

### 2. Severity Classification

- Critical: blocking production, security vulnerability, data loss risk
- High: core functionality at risk, significant issue
- Medium: code quality issue, minor gap
- Low: cosmetic, naming convention, minor improvement

### 3. Dimension Coverage

- ครอบคลุมทุก dimension ที่เกี่ยวข้องกับสิ่งที่ตรวจสอบ
- ถ้าไม่มี database ให้ข้าม database validation
- ถ้าไม่มี API ให้ข้าม API validation
- ปรับ scope ตาม characteristics ของสิ่งที่ตรวจสอบ

### 4. Feedback Style

- ให้ feedback ที่ชัดเจนและ constructive
- ระบุสิ่งที่ดีอยู่แล้วเสมอ
- ให้ข้อเสนอแนะที่เป็นรูปธรรมและ actionable
- ระบุ priority ของการปรับปรุง (Critical, High, Medium, Low)

### 5. Independence

- ทำ `/deep-validate` เท่านั้น ไม่แก้ไข code ระหว่างดำเนินการ
- แยก validation process จาก fix process
- ถ้าต้องแก้ไข ให้ทำ `/resolve-errors` หลัง validate

- ใช้ /rethink ถ้าจำเป็น
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-build ถ้าจำเป็น
- ใช้ /run-test-all ถ้าจำเป็น
- ใช้ /run-typecheck ถ้าจำเป็น


## Expected Outcome

- ความถูกต้องได้รับการตรวจสอบครบทุกมิติ
- Type safety ได้รับการตรวจสอบ
- คุณภาพได้รับการประเมิน
- Security ได้รับการตรวจสอบ
- Compliance กับ standards และ constraints ได้รับการตรวจสอบ
- Cross-references ถูกต้องทั้งหมด
- ตารางสรุปผล: dimension, finding, severity, location, recommendation
- ข้อเสนอแนะที่ actionable และมี priority
