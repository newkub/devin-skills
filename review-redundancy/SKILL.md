---
name: review-redundancy
description: ตรวจ duplicates/redundant content/unused — code, skills, docs, config — report-only
argument-hint: "[scope]"
related:
  - review
  - deep-review
  - review-devin-global-harness
  - review-gaps
  - idea-merge
  - batch-rename-files
  - check-repo-hygiene
  - report
  - ask-me
---

## Goal

ตรวจหา redundancy ทุกรูปแบบใน scope — duplicate purpose, overlapping scope, redundant content, unused artifacts — report-only พร้อม merge/remove/rename actions; ใช้ได้ทั้ง code, skills, docs และ config

## Scope

- 4 redundancy dimensions: **duplicate purpose** (ทำอย่างเดียวกัน), **overlapping scope** (ครอบกันบางส่วน), **redundant content** (เนื้อหาซ้ำ verbatim/near-dup), **unused** (ไม่มี consumer)
- ใช้กับทุก artifact type: functions/files (code), skills/subskills (harness), docs sections, config keys
- report-only — merge/remove/rename ต้อง user confirm และทำผ่าน `/idea-merge`, `/batch-rename-files`, `/delete` เท่านั้น

## Execute

### 1. Inventory And Group

> Goal: รวบรวม items ทั้งหมดและจัดกลุ่มตาม domain

1. ระบุ scope จาก argument — code (functions/files), skills (SKILL.md set), docs, config
2. List items ทั้งหมด + purpose/scope ของแต่ละตัว (description/frontmatter/exports)
3. Group ตาม domain/prefix — items ในกลุ่มเดียวกันคือ merge candidates แรก

### 2. Detect Redundancy

> Goal: หา redundancy 4 มิติพร้อม evidence

1. **Duplicate purpose**: items ที่ description/goal เหมือนกัน >80% — เทียบ purpose statements
2. **Overlapping scope**: items ที่ scope ครอบกัน — ระบุว่า subset หรือ partial
3. **Redundant content**: เนื้อหาซ้ำ — code clones (`/check-repo-hygiene`), doc sections ซ้ำ, config keys ซ้ำ
4. **Unused**: ไม่มี incoming references/consumers — static ref scan หรือ `/check-skill-usage` (skills), import graph (code)
5. ทุก finding ระบุ: pair/group, dimension, evidence (paths+lines), overlap %

### 3. Score And Recommend

> Goal: จัด priority ให้แต่ละ finding

1. Score: overlap% × blast radius (consumers ที่กระทบถ้า merge/remove)
2. Recommend action ต่อ finding: **merge** (purpose เดียวกัน) → `/idea-merge`, **rename** (boundary ชัดแต่ชื่อคล้าย) → `/batch-rename-files`, **extract shared** (content ซ้ำบางส่วน), **remove** (unused จริง) → `/delete`
3. severity: Critical = duplicate purpose สมบูรณ์ / High = scope ซ้อนมาก / Medium = content ซ้ำ / Low = unused ที่อาจมีผู้ใช้ภายนอก

### 4. Report

> Goal: report พร้อม action list

1. ทำ `/report` ตาราง: `No.`, `Item A`, `Item B`, `Dimension`, `Overlap%`, `Severity`, `Evidence`, `Action`
2. สรุป merge candidates เป็น prioritized list — Foundation (absorber ที่มี refs เยอะ) ก่อน
3. ทำ `/ask-me` ก่อน execute merge/remove เสมอ — ไม่ลบเงียบๆ

## Rules

### 1. Report Only

- ห้าม merge/remove/rename ใน review pass — actions ทำหลัง user confirm เท่านั้น
- unused finding ต้องมี evidence (0 incoming refs) — leaf skills/consumers ภายนอกไม่ใช่ proof ของ unused

### 2. Evidence Based

- ทุก finding ต้องมี file paths + evidence — ห้ามเดาว่าซ้ำจากชื่อ
- near-duplicate ต้องระบุว่า diverge ตรงไหน — ต่างกันน้อยแต่ตั้งใจ = ไม่ใช่ redundancy

### 3. Canonical Preference

- เลือก absorber = ตัวที่มี references/consumers มากกว่าเสมอ — merge ยังชีวิตของ dependents
- เก็บ alias stub สำหรับชื่อเดิมหลัง merge — backward compat

- ใช้ /idea-merge ถ้าจำเป็น
- ใช้ /batch-rename-files ถ้าจำเป็น
- ใช้ /check-repo-hygiene ถ้าจำเป็น

## Expected Outcome

- Redundancy report 4 มิติพร้อม evidence + overlap % + severity
- Merge/rename/extract/remove recommendations เป็น prioritized list
- Canonical absorber ระบุชัด + alias plan
- ไม่มีการแก้ไขโดยไม่ confirm
