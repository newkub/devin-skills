---
name: edit-relative
description: แก้ไขไฟล์และอัปเดต references ทีเกี่ยวข้องทั้ง relative paths และ semantic relations
argument-hint: "[@files...]"
related:
  - update-references
  - resolve-errors
  - refactor
  - check-broken-skills-references
  - scan-codebase
  - report
---

## Goal

แก้ไขไฟล์ทีระบุ และอัปเดตไฟล์ทีเกี่ยวข้องทั้ง relative paths, imports, links, และ semantic references ให้สอดคล้อง

## Scope

ใช้เมื่อแก้ไขไฟล์หนึ่งแล้วมีไฟล์อื่นทีอ้างอิงถึง เช่น:
- แก้ชื่อ function/class/variable แล้วต้อง update call sites
- ย้ายหรือ rename ไฟล์ แล้วต้อง update imports
- แก้ skill แล้วต้อง update `related`, body references, `AGENTS.md`, `global_rules.md`
- แก้ barrel/export แล้วต้อง update consumers

## Execute

### 1. Identify Targets And Changes

> Goal: รู้ไฟล์เป้าหมายและสิ่งทีจะเปลี่ยน

1. รับ `@files...` จาก argument
2. อ่านไฟล์เป้าหมาย
3. บันทึก baseline: names, paths, imports, exports, public API
4. ระบุ changes ทีจะทำ

### 2. Apply Edits

> Goal: แก้ไขไฟล์เป้าหมาย

1. แก้ไขตาม user request หรือ `/refactor`
2. รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน
3. ทำ dry run ถ้ามี destructive changes

### 3. Find Related Files

> Goal: หาไฟล์ทีอ้างอิงถึงไฟล์เป้าหมาย

1. ทำ `/scan-codebase` เพื่อหา imports, references, call sites
2. หา relative path references
3. หา semantic references: function names, class names, skill names, `related` lists
4. รวมไฟล์ทีต้องอัปเดตเป็น list

### 4. Update Relative References

> Goal: อัปเดต paths ให้ถูกต้อง

1. ทำ `/update-references` สำหรับ relative paths
2. ถ้าย้ายไฟล์ → อัปเดต imports ตาม directory ใหม่
3. ถ้า rename ไฟล์ → อัปเดตชื่อในทุก references
4. ถ้ามี markdown links → อัปเดต path

### 5. Update Semantic References

> Goal: อัปเดตชื่อ/symbols ทีเปลี่ยนไป

1. ถ้า rename function/class/variable → update call sites
2. ถ้า rename skill → update `related`, body, `AGENTS.md`, `global_rules.md`
3. ถ้าเปลี่ยน API signature → update consumers ทีเรียก
4. ใช้ `/scan-codebase` + grep เพื่อหาทุก occurrence

### 6. Validate

> Goal: ไม่มี broken references

1. ทำ `/check-broken-skills-references`
2. ทำ `/resolve-errors` ถ้ามี build/lint/typecheck errors
3. ถ้าไม่ผ่าน → แก้และ recheck (max 3)

### 7. Report

> Goal: สรุปผล

1. ทำ `/report` สรุปไฟล์ทีแก้ ไฟล์ที update references และผล validation
2. ทำ `/suggest-next-action`

## Rules

1. แก้ไขเฉพาะไฟล์ทีจำเป็น + related files ทีได้รับผลกระทบ
2. ไม่ทำลาย public API โดยไม่ระบุ
3. ทุก rename/move ต้อง update references ทันที
4. ใช้ dry run ก่อน destructive actions
5. ถ้าไม่แน่ใจเรื่อง impact → ทำ `/ask-me`

## Expected Outcome

- ไฟล์เป้าหมายถูกแก้ไข
- ไฟล์ที่เกี่ยวข้องอัปเดต references ครบ
- ไม่มี broken references
- ผ่าน lint/typecheck/test/build ถ้ามี
- รายงานการเปลี่ยนแปลงครบ
