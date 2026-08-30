---
name: ship-verify
description: Ship workspace ด้วยการเลือก verify บน local หรือ CI ตาม context
related:
  - ship-code
  - ship-local
  - ship-ci
  - run-verify
  - run-test-all
  - watch-cicd-and-resolve
  - resolve-errors
  - deep-validate
  - git-commit
  - git-push
  - report
  - report-table
  - suggest-next-action
  - ship-release
  - ship-github-issue
---

## Goal

Ship workspace โดยเลือก verify strategy ทีเหมาะสม: verify บนเครื่องก่อน (`/ship-local`) หรือ verify บน CI (`/ship-ci`) แล้วดำเนินการต่อ

## Scope

ใช้หลัง `/ship-code` เสร็จ เพื่อตัดสินใจว่าควร verify ทีไหน และดำเนินการ commit/push ตาม path ทีเลือก
- ไม่ release/deploy
- ไม่ตั้งค่า CI/CD เอง (ถ้าเลือก CI ให้ `/ship-ci` จัดการ)

## Execute

### 1. Ship Code

> Goal: prepare workspace ก่อน verify

1. ทำ `/ship-code`
2. ถ้า fail → stop และ report

### 2. Decide Verify Strategy

> Goal: เลือกระหว่าง local verify หรือ CI verify ตาม context

ทำตามเกณฑ์ด้านล่างเพื่อเลือก path:

- ใช้ `/ship-local` เมื่อ:
  - เปลี่ยนแปลงเล็กน้อย หรือ low-risk
  - ต้องการผลลัพธ์เร็ว ไม่อยากรอ CI
  - CI ยังไม่พร้อม หรือ CI pipeline ไม่เสถียร
  - ทดสอบ/verify บนเครื่องตัวเองได้ครบทุก scenario ทีจำเป็น
  - อยู่บน branch ทำงาน ไม่ต้องการ push

- ใช้ `/ship-ci` เมื่อ:
  - เปลี่ยนแปลงใหญ่ หรือ high-risk
  - ต้องการ verify บน multiple platforms/environments
  - มี CI/CD พร้อมใช้งานและเสถียร
  - ต้องการ push branch ขึ้น remote เพื่อ PR/merge
  - ต้องการให้คนอื่นตรวจสอบผล CI

- ถ้าไม่ชัด → ทำ `/ask-me`

### 3. Run Chosen Path

> Goal: ดำเนินการตาม verify path ทีเลือก

1. ถ้าเลือก local → ทำ `/ship-local`
2. ถ้าเลือก CI → ทำ `/ship-ci`
3. ถ้า path ไม่ผ่าน → stop และ report ผลการ resolve

### 4. Report

> Goal: สรุปการ ship

1. ทำ `/report` พร้อม `/report-table`
2. สรุป path ทีเลือก (local/CI), สถานะ, commits, และ CI status (ถ้ามี)
3. ทำ `/suggest-next-action` เพื่อแนะนำ `ship-release` หรือ `ship-github-issue`

## Rules

### 1. No Release/Deploy

- `ship-verify` ไม่ release หรือ deploy
- ถ้าต้องการ release/deploy → ใช้ `/ship-release`

### 2. Preserve User Choice

- ถ้า user ระบุ local หรือ CI ชัดเจน → ใช้ตามที user ระบุ
- ถ้า user ไม่ระบุ → ใช้เกณฑ์ใน `## Execute` ตัดสินใจ

### 3. Safety

- ถ้า project ไม่มี CI/CD พร้อม → ไม่บังคับใช้ `/ship-ci`
- ถ้า local verify ไม่ผ่าน → resolve ก่อน commit ไม่ว่าจะเลือก path ใด
- ไม่ force push

### 4. Submodule First

- ถ้ามี submodules → commit ใน submodule ก่อนเสมอ แล้วจึง update root pointer

## Expected Outcome

- `/ship-code` สำเร็จ
- เลือก verify path ชัดเจน (local/CI)
- `/ship-local` หรือ `/ship-ci` สำเร็จตามทีเลือก
- รายงานสถานะ, path, และ next action ครบถ้วน
