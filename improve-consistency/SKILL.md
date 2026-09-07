---
name: improve-consistency
description: ปรับ consistency ข้าม codebase — patterns, API shapes, error handling, config และ doc style
argument-hint: "[path-or-dimension]"
related:
  - improve-naming
  - follow-best-practice
  - update-references
  - report-table
---

## Goal

ทำให้ codebase consistent ในระดับ patterns และ conventions — ไม่ใช่แค่ naming แต่รวม code patterns, API shapes, error handling, config format และ documentation style

## Scope

- ครอบคลุม dimensions ที่ซ้ำกันหลายจุดแต่เขียนต่างกัน:
  - patterns — วิธีทำสิ่งเดียวกันหลายแบบ (fetch แบบต่างกัน, state handling ปนกัน)
  - API shapes — response format, error format, pagination, naming conventions ของ endpoints
  - error handling — throw style, error types, user-facing messages
  - config — env naming, config file structure, default values style
  - docs/comments — comment style, JSDoc/docstring coverage, README structure
- Naming ลงลึก (rename ข้าม codebase) → ส่งต่อ `/improve-naming`
- Action-oriented: แก้จริง — ต้อง `/update-references` เมื่อมีการย้าย/เปลี่ยนชื่อ

## Execute

### 1. Inventory Existing Patterns

> Goal: รู้ว่า codebase ใช้ patterns อะไรอยู่กี่แบบ

1. เลือก dimension จาก `[path-or-dimension]` — ถ้าไม่ระบุให้สแกนทุก dimension แบบ quick pass
2. ใช้ `/scan-codebase` และ `search-files-patterns`/`use-astgrep` เก็บตัวอย่าง pattern ที่ทำสิ่งเดียวกัน
3. จัดกลุ่ม variants ที่พบ พร้อมนับจำนวน occurrences ต่อ variant

### 2. Choose Canonical Pattern

> Goal: ตัดสินใจว่าจะยึด pattern ไหนเป็นมาตรฐาน

1. เลือก variant ที่: ใช้มากสุด, ตรง `/follow-best-practice`, หรือ user ระบุ
2. ถ้าไม่มีตัวชนะชัดเจน → ทำ `/ask-me` ให้ user เลือก พร้อมแสดงตัวอย่างแต่ละ variant
3. เขียน canonical rule ที่ตรวจได้ (เช่น "API error ต้อง `{ error: { code, message } }`")

### 3. Normalize Systematically

> Goal: แปลงทุกจุดให้ตรง canonical

1. เรียงตาม risk: internal helpers ก่อน → public API/exports ทีหลัง
2. ใช้ `use-astgrep` หรือ codemod สำหรับแปลง pattern ซ้ำจำนวนมาก
3. ทุก batch แก้เสร็จ → `/run-typecheck` + `/run-lint` + `/run-test` ถ้ามี
4. ถ้าแก้หลายไฟล์ → ทำ `/use-scripts`

### 4. Prevent Regression

> Goal: กันไม่ให้ inconsistency กลับมา

1. ถ้ามี linter/formatter ที่บังคับได้ (eslint rule, clippy, biome) → เพิ่ม rule
2. ถ้าเป็น convention ที่เครื่องมือบังคับไม่ได้ → บันทึกใน `AGENTS.md` หรือ `.devin/rules/` ผ่าน `/update-devin-project-rules`
3. ถ้าต้อง ast-grep rules → ทำ `/update-project-rules`

### 5. Report

> Goal: สรุปสิ่งที่ normalize

1. ใช้ `/report-table` คอลัมน์: No., Dimension, Canonical, Variants Fixed, Files, Status
2. ระบุจุดที่ตั้งใจทิ้งไว้ต่างกัน (ถ้ามี) พร้อมเหตุผล

## Rules

- Infer convention จาก codebase จริงก่อนเสนอ — ห้ามบังคับ style ส่วนตัว
- เปลี่ยนทีละ dimension/batch — ห้ามแก้หลายมิติพร้อมกันในคอมมิตเดียว
- ทุก rename/move ต้อง `/update-references`
- ถ้า inconsistency มีเหตุผล (เช่น legacy boundary ที่ตั้งใจแยก) → เก็บไว้และบันทึกเหตุผล
- ห้าม normalize จน breaking public API โดยไม่แจ้ง user

## Expected Outcome

- Patterns ที่เลือก normalize ตรง canonical ทั้ง codebase
- Regression guard (lint rule หรือ documented convention) ถูกตั้งไว้
- ตารางสรุป variants ที่แก้ พร้อม files ที่เปลี่ยน
