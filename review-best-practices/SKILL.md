---
name: review-best-practices
description: ตรวจสอบ code หรือ project ว่าปฏิบัติตาม best practices หรือไม และแนะนำการแก้ไข
argument-hint: "<file-or-target>"
allowed-tools:
  - read
  - grep
  - find_file_by_name
  - exec
  - skill
  - run_subagent
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - follow-best-practice
  - deep-thinking
  - deep-analyze
  - scan-codebase
  - deep-review
  - deep-validate
  - resolve-errors
  - check-code-structure
  - check-dead-code
  - check-unused-deps
  - check-bottlenecks
  - report
  - update-references
---

## Goal

ตรวจสอบไฟล์ โฟลเดอร์ หรือ project ทั้งหมด วิเคราะห์วามาตรฐาน best practices แล้วแนะนำการแก้ไขเพื่อให้ code สอดคล้องกับแนวทางทีถูกต้อง

## Scope

ใช้เมื่อต้องการ review code หรือ project ว่า follow best practices ในเรื่อง การจัดโครงสร้าง การตั้งชื่อ การจัดการ dependencies, error handling, testing, security, performance, และ maintainability

## Execute

### 1. Identify Target

1. รับ `file-or-target` จาก argument
2. ถ้าไม่ระบุ ให้ถาม user ว่าต้องการ review ไฟล์ โฟลเดอร์ หรือ project ใด
3. ตรวจสอบวา target มีอยู่จริง
4. ถ้า target เป็น project ให้หา `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml` เพื่อ detect ecosystem

### 2. Gather Context

1. อ่าน target ไฟล์หรือไฟล์สำคัญใน target
2. ทำ `/scan-codebase` เพื่อหา patterns, consumers, references
3. ใช้ `grep` หาสัญญาณทีบ่งบอกปัญหา เช่น `TODO`, `FIXME`, `any`, `console.log`, `eval`, `dangerouslySetInnerHTML`
4. ดู `AGENTS.md` และ `global_rules.md` ถ้ามี เพื่อรู้ standards ของ project

### 3. Apply Best Practice Review

1. ทำ `/follow-best-practice` สำหรับ topic ทีเกี่ยวข้อง เช่น framework, language, library, architecture
2. ตรวจ check ต่าง ๆ ตาม context:
   - `/check-code-structure` — โครงสร้างไฟล์และการจัดระเบียบ
   - `/check-dead-code` — code ทีไม่ถูกใช้
   - `/check-unused-deps` — dependencies ส่วนเกิน
   - `/check-bottlenecks` — performance issues
   - `/check-secrets-leak` — การรั่วไหลของ secrets
3. ทำ `/deep-thinking` เพื่อวิเคราะห์ gaps และ trade-offs

### 4. Prioritize Findings

1. จัดลำดับ findings ตาม severity:
   - `Critical` — อาจเกิดข้อผิดพลาดร้ายแรง เช่น security, data loss
   - `High` — ผลกระทบสูง ควรแก้ก่อน
   - `Medium` — ปรับปรุงได้ มีผลต่อ maintainability
   - `Low` — แนะนำทั่วไป ไม่จำเป็น
2. บันทึก findings ลง `todo_write`
3. แยก quick wins กับ major improvements

### 5. Recommend Fixes

1. สรุป findings แต่ละข้อพร้อมเหตุผลและ evidence
2. แนะนำวิธีแก้ไขหรือ skill ทีควรใช้
3. ถ้า user ตกลง → ใช้ `/resolve-errors`, `/refactor`, `/update-references` หรือ skill ทีเหมาะสมในการแก้
4. ถ้าเป็น Critical หรือ High ให้ถามก่อนลงมือ

### 6. Validate

1. ทำ `/deep-validate` หลังแก้ไข
2. รัน `run-check`, `run-typecheck`, หรือ `run-test` ตาม project
3. อ่านไฟล์อีกครั้งเพื่อตรวจว่าแก้ถูกต้อง
4. ทำ `/report` สรุป before-after

## Rules

- ต้องมี evidence ก่อนระบุวา code ผิด best practice
- ไม่เดา ต้องอ้างอิงจาก official docs, style guides, หรือ patterns ทีพบใน codebase
- ไม่แก้ไข code โดยไม่ได้ user confirmation (ยกเว้น quick wins ทีปลอดภัย)
- ถ้าหลาย best practices ขัดแย้งกัน ให้ถาม user ว่าอยาก prioritize อันไหน
- ถ้า project มี `AGENTS.md` ให้ follow ก่อน generic best practices
- ไม่เพิ่ม dependency ใหม่ ถ้าทำได้ด้วย built-in หรือ refactoring

## Expected Outcome

- รายการ findings พร้อม severity, evidence, และ recommendation
- User ตัดสินใจได้ว่าจะแก้ไขหรือไม่
- ถ้าแก้ไขแล้ว code ผ่าน validation ตามมาตรฐาน project
- รายงาน before-after ชัดเจน
