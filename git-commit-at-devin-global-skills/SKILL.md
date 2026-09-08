---
name: git-commit-at-devin-global-skills
description: Commit เปลี่ยนแปลงใน devin global skills หลังตรวจ conventions ผ่าน
argument-hint: "[message]"
allowed-tools:
  - exec
  - read
  - skill
  - ask_user_question
  - find_file_by_name
  - todo_write
related:
  - git-commit
  - review-devin-global-skills
  - deep-validate
  - check-broken-skills-references
  - update-references
  - check-circular-dependencies
  - run-check
  - report
  - suggest-next-action
  - resolve-errors
---

## Goal

Commit ทุกไฟล์ที่เปลี่ยนแปลงใน devin global skills repo หลังจาก `review-devin-global-skills`, `deep-validate` และ `check-broken-skills-references` ผ่านเกณฑ์

## Scope

ใช้สำหรับ `%APPDATA%\devin\skills` บน Windows หรือ `~/.devin/skills` บน Unix

- เป็น wrapper รอบ `/git-commit` ที่เพิ่ม pre-commit validation สำหรับ devin global skills
- ไม่ใช่ tool สำหรับ push, deploy หรือ merge — ถ้าต้องการ push ให้ใช้ `/git-commit-and-push` หลังจากนี้
- ไม่แก้ไข code ให้เอง — ถ้า validation พบ Critical/High ให้ stop และส่งต่อ `/resolve-errors`

## Execute

### 1. Navigate And Check Status

> Goal: ตรวจสอบว่าอยู่ใน repo ที่ถูกต้องและมี changes จริง

1. เปลี่ยน working directory ไปยัง `%APPDATA%\devin\skills`
2. รัน `git status --porcelain`
3. ถ้าไม่มี changes ที่จะ commit → stop และ report `no changes to commit`

### 2. Review Devin Global Skills

> Goal: ตรวจ conventions และ cross-skill consistency

1. ทำ `/review-devin-global-skills`
2. บันทึก findings, severity และ category
3. ถ้ามี Critical หรือ High → stop, รายงานผล, แนะนำ `/resolve-errors`

### 3. Deep Validate

> Goal: ตรวจสอบความถูกต้องละเอียดของ skill ที่เปลี่ยนแปลง

1. ทำ `/deep-validate` บน scope ที่เปลี่ยนแปลง
2. บันทึก findings พร้อม severity
3. ถ้ามี Critical หรือ High → stop, รายงานผล, แนะนำ `/resolve-errors`

### 4. Check Skill References

> Goal: ตรวจหา broken references และ circular dependencies ระหว่าง skills

1. ทำ `/check-broken-skills-references`
2. ถ้าพบ broken references → stop, แนะนำ `/update-references` แล้วรอผู้ใช้แก้
3. ทำ `/check-circular-dependencies` ถ้ามีการแก้ไข `related`
4. ถ้าผ่าน → ดำเนินต่อ

### 5. Stage Changes

> Goal: เตรียมไฟล์สำหรับ commit อย่างปลอดภัย

1. รัน `git diff --name-only` เพื่อดูไฟล์ที่จะ stage
2. รัน `git add .` ภายใน `%APPDATA%\devin\skills`
3. รัน `git diff --cached --stat` เพื่อตรวจสอบ
4. ถ้ามีไฟล์นอก scope หรือไฟล์ที่ไม่ต้องการ commit → แยกออกก่อน

### 6. Commit

> Goal: สร้าง commit ตาม conventional commits

1. ทำ `/git-commit`
2. ถ้า `git-commit` ล้มเหลว → อ่าน error, แก้ไข, แล้วลองใหม
3. ถ้าต้องการ scope เฉพาะ skill ใด skill หนึ่ง → ใช้ `/git-commit-selected-files` แทน

### 7. Verify

> Goal: ยืนยันว่า commit ถูกต้องและ working directory สะอาด

1. รัน `git log --oneline -5`
2. รัน `git status --porcelain`
3. ถ้า working directory สะอาด → รายงานสำเร็จ
4. ถ้ามีไฟล์ค้าง → รายงานและแนะนำ action ถัดไปผ่าน `/suggest-next-action`

## Rules

### 1. Repo Scope

- ใช้เฉพาะใน devin global skills repo
- ไม่ commit ไฟล์นอก `%APPDATA%\devin\skills` หรือ `~/.devin/skills`

### 2. Validation Gate

- ต้องผ่าน `/review-devin-global-skills`, `/deep-validate` และ `/check-broken-skills-references` ก่อน commit
- ถ้ามี Critical/High findings ให้ stop และส่งต่อ `/resolve-errors`
- ไม่ใช้ `--no-verify` เพื่อ bypass validation

### 3. Commit Discipline

- ใช้ `/git-commit` เพื่อรักษามาตรฐาน conventional commits
- subject ไม่เกิน 72 ตัวอักษร
- ใช้ภาษาอังกฤษเท่านั้นใน commit message

### 4. Post-Commit

- ถ้าต้องการ push ให้ใช้ `/git-commit-and-push`
- ถ้าต้องการ refactor history ให้ใช้ `/refactor-commit`
- ถ้ามี findings หลัง commit ให้ใช้ `/resolve-errors`

- ใช้ `/run-check` ถ้าจำเป็น
- ใช้ `/report` ถ้าต้องการสรุปผล
- ใช้ `/suggest-next-action` เสมอหลังจบ

## Expected Outcome

- ทุก skill ที่เปลี่ยนแปลงได้รับการ review/validate/check references ก่อน commit
- Commit ถูกสร้างด้วย conventional commits
- Working directory สะอาด
- ไม่มี Critical/High findings ค้าง
- มีรายงานสรุปผลการ validate และ commit
