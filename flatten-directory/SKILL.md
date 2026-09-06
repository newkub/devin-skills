---
name: flatten-directory
description: Collapse nested directories ที่ลึกเกินหรือซ้ำชื่อ — พร้อม update references
argument-hint: "<path> [--depth N]"
related:
  - move-to
  - update-references
  - restructure
  - list-file-structure
  - review-restructure
  - report-table
---

## Goal

ลดความลึกของ directory structure — collapse nested dirs ที่ซ้ำซ้อน (`src/components/components/`, single-child chains) — พร้อมอัปเดต references ทั้งหมด

## Scope

- ใช้เมื่อ structure ลึกเกิน: `a/a/a/`, single-child chains ยาว, wrapper dirs ที่ไม่มีค่า
- ครอบคลุม: single-child collapse, redundant name nesting, shallow-merge ของ dirs ที่แยกเกิน
- Destructive-adjacent: move files จริง — dry-run + confirm + `/update-references` เสมอ

## Execute

### 1. Analyze Depth

> Goal: map structure และหาจุดที่ลึกเกิน

1. ทำ `/list-file-structure` ดู tree ปัจจุบัน
2. หา patterns: single-child chains (`a/b/c/` ที่ b,c มีลูกเดียว), name repetition (`foo/foo/`, `src/src/`), wrapper dirs ที่มีแค่ dir เดียว
3. วัด depth ต่อ leaf — flag paths ที่ลึกกว่า threshold (default: >4 จาก root)

### 2. Plan Flattening

> Goal: ออกแบบ target structure ก่อนย้าย

1. ทำ `/review-restructure` — วางแผน relocation ที่ไม่ทำลาย grouping ที่มีค่า
2. เสนอ mapping: `old path → new path` ต่อไฟล์ที่ย้าย
3. flag collisions: ไฟล์ชื่อซ้ำที่จะชนกันหลัง flatten — ต้อง rename หรือเก็บ nested
4. แสดง preview ให้ user confirm — flatten เป็น structural change

### 3. Execute Flattening

> Goal: ย้ายไฟล์ตามแผน

1. ทำ `/move-to` ย้ายตาม mapping — ทีละกลุ่มเพื่อ rollback ง่าย
2. ลบ empty dirs ที่เหลือ (`/clean-empty-dirs` flow)
3. ถ้า git repo → ใช้ `git mv` เพื่อรักษา history

### 4. Update References

> Goal: แก้ทุก import/path ที่อ้างถึงตำแหน่งเดิม

1. ทำ `/update-references` เสมอ — imports, config paths, docs, scripts
2. ค้น path เดิมทั้ง repo: `search-files-patterns` หา string literals ที่ยังอ้าง
3. Verify build/tests ผ่านหลัง flatten

### 5. Report

> Goal: สรุป structural change

1. ใช้ `/report-table`: `No.`, `Old Path`, `New Path`, `Files Moved`, `Refs Updated`
2. Before/after depth comparison
3. ระบุ manual follow-ups ถ้ามี (docs นอก repo, external links)

## Rules

### 1. Confirm Before Move

- structural change ต้อง preview + user confirm — ไม่ flatten เอง
- preserve git history — `git mv` ไม่ใช่ copy+delete

### 2. References Always

- ทำ `/update-references` ทุกครั้งที่ย้าย — ไม่มีข้อยกเว้น
- verify ว่าไม่มี references เก่าเหลือก่อนจบ

### 3. Value Preserving

- flatten เฉพาะ nesting ที่ไม่มีค่า — grouping ที่มีเหตุผล (feature boundaries) เก็บไว้
- ระวัง framework conventions (`app/`, `pages/` ที่ router expect)

## Expected Outcome

- Structure ตื้นขึ้นและสื่อความหมาย — ไม่มี redundant nesting
- ทุก reference อัปเดตและ verify ผ่าน
- Git history รักษาไว้ผ่าน `git mv`
