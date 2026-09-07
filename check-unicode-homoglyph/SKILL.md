---
name: check-unicode-homoglyph
description: ตรวจ invisible characters และ homoglyphs ใน code — trojan source attack surface
argument-hint: "[path]"
related:
  - search-files-patterns
  - improve-security
  - report-table
---

## Goal

ตรวจหา Unicode characters อันตรายใน source code — zero-width chars, homoglyphs (ตัวอักษรหน้าตาเหมือนกัน), bidirectional overrides — ที่ทำให้ code อ่านอย่างหนึ่งแต่ execute อีกอย่าง (Trojan Source)

## Scope

- ตรวจ source files ทุกภาษา: identifiers, strings, comments
- ครอบคลุม: zero-width chars (ZWSP, ZWJ, ZWNJ, BOM กลางไฟล์), bidi controls (U+202A-E, U+2066-9), homoglyphs ใน identifiers, confusable characters
- Read-only: รายงานตำแหน่ง — ลบ/แก้ผ่าน `/improve-security`

## Execute

### 1. Scan For Invisible Characters

> Goal: หา control/format chars ที่มองไม่เห็น

1. ใช้ script หรือ `search-files-patterns` หา: `\u200B-\u200F`, `\u202A-\u202E`, `\u2060-\u206F`, `\uFEFF` (นอกบรรทัดแรก)
2. flag ทุก occurrence พร้อม file:line:column และ codepoint

### 2. Detect Bidi Override Attacks

> Goal: หา bidi controls ที่ reorder code ให้หลอกตา

1. ตรวจ bidi control chars ใน comments/strings — pattern คลาสสิกของ Trojan Source (CVE-2021-42574)
2. ตัวอย่างเสี่ยง: comment ที่มี RLO/LRO ทำให้ code ข้างหลัง "กลับ" ตอนแสดงผล
3. Severity สูงสุดสำหรับ bidi chars ใน source files

### 3. Detect Homoglyph Identifiers

> Goal: หา identifiers ที่หน้าตาเหมือนกันแต่ต่าง codepoint

1. เทียบ identifiers ที่ normalize แล้วเท่ากันแต่ raw ต่างกัน (เช่น `а` Cyrillic vs `a` Latin)
2. flag mixed-script identifiers — Latin ปน Cyrillic/Greek ในคำเดียว
3. ข้าม non-ASCII identifiers ที่ตั้งใจ (i18n projects, math symbols) — รายงานแยกเป็น info

### 4. Report

> Goal: สรุป findings พร้อม severity

1. ใช้ `/report-table` คอลัมน์: `No.`, `File:Line:Col`, `Codepoint`, `Type`, `Severity`, `Rendered As`
2. Severity: `critical` (bidi controls, zero-width ใน code), `high` (homoglyph identifiers), `info` (non-ASCII ที่ดูตั้งใจ)
3. แนะนำ: strip chars, linter rule (`eslint-plugin-security`, unicode-aware linters), pre-commit check

## Rules

### 1. Evidence-Based

- ทุก finding ต้องระบุ exact codepoint และตำแหน่ง — hex dump ได้
- แสดง rendered vs actual bytes เพื่อให้เห็นการหลอก

### 2. No False Positives On Intent

- ไฟล์ i18n/locale และ docs ภาษาไทย/จีน/ญี่ปุ่นมี non-ASCII ปกติ — ข้ามหรือ flag info
- ตรวจ code regions เป็นหลัก ไม่ใช่ทุก byte

### 3. Read-Only

- ไม่ลบ characters — รายงานให้ `/improve-security` แก้
- ห้ามแก้ไฟล์ที่อาจเป็น intentionally internationalized โดยไม่ยืนยัน

## Expected Outcome

- รายการ dangerous Unicode chars พร้อมตำแหน่งและ type
- Trojan Source exposure assessment
- คำแนะนำ linter/pre-commit rule ป้องกันระยะยาว
