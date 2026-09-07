---
name: batch-rename-files
description: Mass rename ไฟล์ตาม pattern พร้อม preview/dry-run และ reference updates
argument-hint: "<pattern> <replacement> [path]"
related:
  - update-references
  - report
---

## Goal

Rename ไฟล์จำนวนมากตาม pattern — preview ก่อนเปลี่ยนจริง, จัดการ collisions และ update references หลัง rename

## Scope

- ใช้เมื่อ: normalize naming (`PascalCase`→`kebab-case`), เพิ่ม/ลบ prefix/suffix, renumber, fix extensions, pattern rename
- ครอบคลุม: regex/pattern transforms, case changes, sequential numbering, extension changes
- Destructive-adjacent: rename files จริง — preview + confirm เสมอ, git-aware

## Execute

### 1. Define Rename Rules

> Goal: ระบุ pattern และ transform ชัดเจน

1. รับ pattern + replacement จาก argument — หรือถาม user ผ่าน `/ask-me`
2. รองรับ: literal replace, regex (`-replace`), case transforms, numbering
3. ระบุ scope: files only, recursive, include/exclude patterns

### 2. Preview Changes

> Goal: แสดง mapping ก่อนทำจริง — dry-run เป็น default

1. Generate `old → new` mapping สำหรับทุกไฟล์ที่ match
2. flag issues:
   - Collisions: หลายไฟล์ map ไปชื่อเดียวกัน
   - No-ops: names ที่ไม่เปลี่ยนจริง
   - Case-only: Windows ที่ rename case-only ต้องสองขั้น (via temp name)
   - Locked files: ทำ `/check-file-locks` ถ้าสงสัย
3. ใช้ `/report`: `No.`, `Old Name`, `New Name`, `Status`, `Issue`

### 3. Confirm And Execute

> Goal: rename หลัง user confirm เท่านั้น

1. รอ confirmation — mass rename คือ irreversible-adjacent
2. Git repo → ใช้ `git mv` รักษา history (Windows case-only: `git mv -f` via temp)
3. Rename ตามลำดับที่ไม่ชนกัน (collisions → two-phase: rename เป็น temp ก่อน)
4. จัดการ errors ต่อไฟล์ — หยุดทั้ง batch ถ้า error >0 ใน critical scope

### 4. Update References

> Goal: แก้ทุกอ้างอิงที่ชี้ชื่อเดิม

1. ทำ `/update-references` เสมอ — imports, requires, config, docs
2. ค้น filenames เดิมใน code/content: `search-files-patterns`
3. Verify: build/tests/lint ผ่านหลัง rename

### 5. Report

> Goal: สรุป rename operation

1. สรุป: renamed count, skipped (collisions/no-ops), failed
2. ระบุ references ที่อัปเดต และที่ต้อง manual fix
3. Undo path: git revert หรือ rename back ถ้าต้องการ

## Rules

### 1. Preview First

- แสดง mapping ครบก่อน execute — ไม่ rename เองโดยไม่ confirm
- collisions/no-ops ต้อง resolve ก่อน rename

### 2. Git Aware

- ใช้ `git mv` ใน repo — history ต้องไม่หาย
- case-only renames บน Windows ต้องระวัง — filesystem case-insensitive

### 3. References Mandatory

- ทำ `/update-references` ทุกครั้ง — ไม่มีข้อยกเว้นสำหรับ mass rename
- verify ไม่มี references เก่าเหลือก่อนจบ

## Expected Outcome

- ไฟล์ rename ตาม pattern ครบพร้อม collision handling
- References อัปเดตและ verified
- มี undo path ชัดเจน (git revert)
