---
name: update-version-to-latest-migrate-major
description: อัปเกรด major version อย่างปลอดภัย — breaking changes scan, codemods, staged rollout, rollback
argument-hint: "<package-or-scope>"
related:
  - update-version-to-latest
  - use-astgrep
  - migration-by-astgrep
  - check-deprecated-apis
  - run-verify
  - test-usage
  - ask-me
  - report-before-after
---

## Goal

อัปเกรด dependency/runtime ข้าม major version อย่างปลอดภัย — สแกน breaking changes ครบ, ใช้ codemods, แบ่ง rollout เป็น stages และมี rollback path ชัดเจน

## Scope

- ใช้เมื่อ `/update-version-to-latest` พบ major updates ที่มี breaking changes เสี่ยงสูง หรือ user สั่ง migrate major โดยตรง
- ครอบคลุม: npm/bun packages, frameworks, runtime majors — ทีละ package หรือทีละ batch ที่เกี่ยวข้องกัน
- ไม่ใช้กับ patch/minor — ทำผ่าน `/update-version-to-latest` flow ปกติ

## Execute

### 1. Scan Breaking Changes

> Goal: รู้ทุก breaking change ก่อนแก้ code

1. อ่าน CHANGELOG, migration guide และ release notes ของ package จาก official docs/repo — ถ้าไม่มี guide ให้ `/learn` (web)
2. สร้าง checklist: removed APIs, renamed APIs, behavior changes, new required config, peer dep requirements
3. `scan-codebase` หา call sites ทุกจุดที่ใช้ API ที่เปลี่ยน — ระบุ file:line ทั้งหมด
4. ประเมิน risk — ถ้ากระทบ public API หรือหลาย workspace → `/ask-me` confirm ก่อนเริ่ม

### 2. Prepare Rollback

> Goal: rollback ได้ทุกเมื่อ

1. ตรวจ `git status` clean — commit หรือ stash งานค้างก่อน
2. บันทึก current version และ lockfile state — rollback = revert commit + reinstall
3. เขียน rollback steps ชัดเจนก่อนเริ่ม migrate

### 3. Apply Codemods Then Manual Fixes

> Goal: แปลง code ด้วยเครื่องมือก่อน manual edit

1. รัน official codemod ถ้า package มีให้ — ดู migration guide
2. ถ้าไม่มี codemod → ใช้ `/use-astgrep` หรือ `/migration-by-astgrep` เขียน patterns แปลง renamed/removed APIs
3. manual fix ส่วนที่ codemod ทำไม่ได้ — behavior changes, config moves, type changes
4. อัปเดต version ใน manifest แล้ว install — แยก commit: `chore: migrate <pkg> to v<N>`

### 4. Staged Verify And Rollout

> Goal: verify ทีละชั้น ไม่ big-bang

1. ต่อ package/batch: typecheck → lint → unit tests → `/run-verify` → `/test-usage`
2. monorepo → verify ทีละ workspace ที่ depend, leaf packages ก่อน consumers
3. ทำ `/check-deprecated-apis` เพื่อหา deprecated usage ที่เหลือ
4. runtime smoke test บน critical paths ที่ใช้ package นั้น

### 5. Report

> Goal: สรุปผลพร้อมสิ่งที่ค้าง

1. ทำ `/report-before-after` — version, breaking changes ที่เจอ, call sites ที่แก้
2. ระบุ follow-ups ที่ยังไม่ได้ทำ เช่น deprecated APIs ที่ยังใช้อยู่

## Rules

- ห้ามอัปเดตหลาย unrelated majors พร้อมกัน — ทีละ batch ที่เกี่ยวข้องกันเท่านั้น
- ต้องมี breaking changes checklist และ rollback plan ก่อน write
- ใช้ codemods/ast-grep แทน manual edit เมื่อเป็นไปได้
- ห้าม commit ถ้า verify ไม่ผ่าน — revert แล้ว report
- ถ้า breaking changes กระทบ public API ของ project เอง → `/ask-me` ก่อน

## Expected Outcome

- major version ถูก migrate ครบ พร้อม verify ผ่านทุก stage
- breaking changes ทั้งหมดถูกจัดการ ไม่มี deprecated usage ค้างโดยไม่รู้ตัว
- rollback path ชัดเจน — revert commit เดียวกลับได้
