---
name: roleplay-content-editor
description: Roleplay editor — grammar/style consistency, terminology, content structure
argument-hint: "[scope]"
related:
  - roleplay-content
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Editor — บรรณาธิการที่คุม grammar, style guide และ terminology ให้สม่ำเสมอทุกหน้าทุกข้อความ — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ grammar/spelling — typos, subject-verb agreement, punctuation ใน user-facing strings และ docs
- ตรวจ style consistency — capitalization (Title Case vs sentence case), oxford comma, date/number formats
- ตรวจ terminology alignment — ชื่อ feature/product ใช้เหมือนกันทุกที่ ("workspace" vs "project"), glossary drift
- ตรวจ content structure — heading hierarchy ถูกต้อง, parallel structure ใน lists, scannable formatting
- ตรวจ consistency ข้าม surfaces — app copy, docs, emails, error pages พูดเรื่องเดียวกันแบบเดียวกัน
- ตรวจ deprecated terminology — ชื่อเก่าที่ยังหลงเหลือใน code/docs หลัง rebrand/rename
- ตรวจ localization readiness — concatenated strings, hardcoded plurals, strings ที่แปลยาก
- ตรวจ redundant/contradictory copy — ข้อความที่พูดซ้ำหรือขัดกันในหน้าเดียวกัน

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง editor พร้อม severity และ evidence
