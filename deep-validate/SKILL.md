---
name: deep-validate
description: Validate ละเอียดหลายมิติ cross-reference, type safety, runtime, security, compliance
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

Validate ละเอียดหลายมิติ: correctness, type safety, runtime, security, compliance, cross-reference พร้อม severity ratings

## Scope

ใช้สำหรับ validation ที่ต้องการความละเอียดสูง ครอบคลุมทุกมิติของระบบ

สำหรับ validate แบบปกติ ใช้ `/validate`, สำหรับ validate tests ใช้ `/run-test`, สำหรับ validate review ใช้ `/validate`

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

### 2. Check Correctness
> Goal: Check Correctness

ทำ `/review-correctness` เพื่อตรวจสอบความถูกต้อง

- ตรวจสอบความถูกต้องตาม principle หรือ standard
- ตรวจสอบว่าทำงานได้ตาม requirement และไม่มี errors
- ตรวจสอบ logic และ edge cases ได้รับการจัดการ
- ตรวจสอบ error handling ครบถ้วน
- บันทึก findings พร้อม severity

### 3. Check Type Safety
> Goal: Check Type Safety

ตรวจสอบ type safety อย่างละเอียด

- ทำ `/run-typecheck` เพื่อตรวจสอบ type errors
- ตรวจสอบไม่มี `any` ที่ไม่จำเป็น
- ตรวจสอบ type flow: schema → validation → API → UI
- ตรวจสอบ type inference ใช้ถูกต้อง
- ตรวจสอบไม่มี `@ts-ignore` หรือ `@ts-nocheck`
- บันทึก findings พร้อม severity

### 4. Check Quality
> Goal: Check Quality

ตรวจสอบคุณภาพโดยรวม

- ทำ `/follow-code-quality` เพื่อตรวจสอบ code quality
- ตรวจสอบ readability, completeness, consistency
- ตรวจสอบมี documentation เพียงพอหรือ clear
- ตรวจสอบใช้ best practices และไม่มี redundancy
- ตรวจสอบ naming conventions สม่ำเสมอ
- บันทึก findings พร้อม severity

### 5. Check Security
> Goal: Check Security

ตรวจสอบ security อย่างละเอียด

- ตรวจสอบ input validation และ sanitization
- ตรวจสอบ authentication และ authorization patterns
- ตรวจสอบไม่มี hardcoded secrets หรือ API keys
- ตรวจสอบ API security และ rate limiting
- ตรวจสอบ parameterized queries ป้องกัน SQL injection
- บันทึก findings พร้อม severity

### 6. Check Compliance
> Goal: Check Compliance

ตรวจสอบความสอดคล้องกับ standards และ constraints

Goal reminder: ตรวจสอบความเหมาะสมกับ requirements และ context

- ตรวจสอบความเหมาะสมกับ requirements หรือ context
- ตรวจสอบความเหมาะสมกับ capabilities หรือ constraints
- ตรวจสอบความเหมาะสมกับ scalability หรือ maintainability
- ตรวจสอบ compliance กับ project conventions (`AGENTS.md`)
- ตรวจสอบ compliance กับ regulatory requirements ถ้ามี
- บันทึก findings พร้อม severity

### 7. Cross-Reference Validation
> Goal: Cross-Reference Validation

ตรวจสอบ cross-references ทั้งหมด

- ทำ `/validate` เพื่อตรวจสอบ config files และ environment variables
- ตรวจสอบ references ระหว่าง modules ถูกต้อง
- ตรวจสอบ API contracts ตรงกับ implementation
- ตรวจสอบ documentation ตรงกับ code จริง
- ตรวจสอบ dependencies ไม่ conflict กับ existing versions
- บันทึก findings พร้อม severity

### 8. Report And Suggest
> Goal: Report And Suggest

ทำ `/report-table` เพื่อสร้างตารางสรุปผล

- ตาราง: Dimension, Finding, Severity, Location, Recommendation
- จัดกลุ่ม findings ตาม dimension
- จัดลำดับตาม severity (Critical, High, Medium, Low)
- สรุปสิ่งที่ดีอยู่แล้วเสมอ
- ให้ข้อเสนอแนะ actionable และระบุ priority
- ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

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

- ทำ validate เท่านั้น ไม่แก้ไข code ระหว่าง validate
- แยก validation process จาก fix process
- ถ้าต้องแก้ไข ให้ทำ `/resolve-errors` หลัง validate

## Expected Outcome

- ความถูกต้องได้รับการตรวจสอบครบทุกมิติ
- Type safety ได้รับการตรวจสอบ
- คุณภาพได้รับการประเมิน
- Security ได้รับการตรวจสอบ
- Compliance กับ standards และ constraints ได้รับการตรวจสอบ
- Cross-references ถูกต้องทั้งหมด
- ตารางสรุปผล: dimension, finding, severity, location, recommendation
- ข้อเสนอแนะที่ actionable และมี priority
