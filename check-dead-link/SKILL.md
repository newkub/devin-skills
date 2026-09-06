---
name: check-dead-link
description: ตรวจ markdown links ขาดใน docs, skills และ project ทั้ง relative และ external URLs
argument-hint: "[path-or-glob]"
related:
  - check-broken-skills-references
  - check-reference
  - review-docs
  - search-files-patterns
  - use-pwsh-shell
  - report-table
  - check-broken-symlinks
---

## Goal

ตรวจหา dead links ใน markdown files: relative links ที่ชี้ไปไฟล์ที่ไม่มีอยู่ และ external URLs ที่ตอบกลับ error — ครอบคลุม docs, skills และ project files

## Scope

- ใช้กับ `*.md` files ใน project, `docs/`, `.devin/`, `references/` และ skill directories
- ครอบคลุม relative links `[text](path)`, image links `![alt](path)`, reference links และ external `http(s)` URLs
- Read-only: ตรวจและรายงานเท่านั้น ไม่แก้ไขไฟล์
- ไม่ซ้ำกับ `/check-broken-skills-references` ที่เช็คเฉพาะ `/skill-name` references ใน skills repo — skill นี้เช็ค markdown links ทั่วไป

## Execute

### 1. Collect Target Files

> Goal: รู้ว่าต้องตรวจไฟล์ไหน

1. รับ `path-or-glob` จาก argument — default คือ `**/*.md` ใน current workspace
2. ใช้ `find_file_by_name` รวบรวม markdown files โดย exclude `node_modules`, `.git`, `dist`, `build`
3. ถ้า scope เป็น skills repo → ครอบ `*/SKILL.md`, `*/references/*.md`, `*/templates/*.md`

### 2. Extract Links

> Goal: ดึง links ทั้งหมดจากแต่ละไฟล์

1. ใช้ `grep` หรือ script ดึง patterns: `[text](target)`, `![alt](src)`, `[text]: target`, bare `https://` URLs
2. แยกประเภท: `relative`, `anchor` (`#...`), `external` (`http(s)`), `mailto`, `skill` (`/skill-name`)
3. บันทึก file, line number และ raw target ต่อ link

### 3. Verify Relative Links

> Goal: ตรวจว่า relative targets มีอยู่จริง

1. Resolve path เทียบกับ directory ของไฟล์ต้นทาง
2. `Test-Path` (หรือ `fs.existsSync` ใน script) ต่อ target — ตัด `#anchor` และ query ออกก่อน
3. Flag `dead` ถ้าไฟล์ไม่มีอยู่
4. ถ้า target เป็น directory → ตรวจว่ามี `index.md` หรือไฟล์ default
5. ตรวจ anchor `#heading` เทียบกับ headings ในไฟล์เป้าหมายถ้าทำได้

### 4. Verify External Links

> Goal: ตรวจว่า URLs ยังตอบกลับ

1. ใช้ `curl -sIL -o NUL -w "%{http_code}" <url>` (Windows) หรือ equivalent — HEAD ก่อน fallback GET
2. Flag `dead` สำหรับ `404`, `410`, DNS failure; flag `redirect` สำหรับ `301/302` ที่ย้าย domain
3. จำกัด concurrency และ timeout (≤10s ต่อ URL) เพื่อไม่ค้าง
4. ข้าม localhost URLs และ URLs ที่ต้อง auth

### 5. Report

> Goal: สรุป dead links แก้ไขได้ทันที

1. ทำ `/report-table` คอลัมน์: `No.`, `File`, `Line`, `Link`, `Type`, `Status`, `Suggestion`
2. จัดกลุ่มตามไฟล์และเรียง `dead` ก่อน `redirect`
3. เสนอ fix: path ที่น่าจะถูก (จาก `find_file_by_name`) หรือลบ link
4. สรุป counts: total links, dead, redirect, ok

## Rules

### 1. Read-Only

- ไม่แก้ไขไฟล์ — รายงานพร้อม suggestion เท่านั้น
- ไม่ลบ dead links อัตโนมัติ

### 2. Evidence

- ทุก dead link ต้องมี file:line และเหตุผล (`not found`, `404`, `DNS fail`)
- ไม่ flag จากการเดา

### 3. Scope Discipline

- อย่าเช็ค `/skill-name` references ซ้ำกับ `/check-broken-skills-references` — รวมเฉพาะเป็น type `skill` ในรายงาน
- ข้าม generated files และ vendored docs

- ใช้ /check-broken-skills-references ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น
- ใช้ /search-files-patterns ถ้าจำเป็น

## Expected Outcome

- รายการ dead links ครบพร้อม file:line และ suggestion ต่อรายการ
- แยกชัดระหว่าง relative, external, anchor และ skill links
- พร้อมส่งต่อให้ `/update-references` หรือแก้ไขตาม suggestion
