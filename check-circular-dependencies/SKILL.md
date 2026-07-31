---
name: check-circular-dependencies
description: ตรวจจับและรายงาน circular dependencies ใน codebase
---

## Goal

ตรวจจับ circular dependencies ใน codebase และรายงาน findings พร้อมคำแนะนำ

## Scope

ใช้สำหรับทุก workspace ที่มี module imports — ครอบคลุม JavaScript/TypeScript, Rust, Python และภาษาอื่นๆ ที่มี dependency graph

## Execute

### 1. Define Scope

กำหนดขอบเขตการตรวจสอบ

> Goal: รู้ว่าจะตรวจสอบที่ไหนและใช้ tool อะไร

1. ระบุ target: workspace, directory หรือทั้ง project
2. ระบุภาษาและ tool ที่เหมาะสม:
   - JavaScript/TypeScript → `madge --circular --extensions ts,tsx`
   - Rust → `cargo depgraph` หรือ `cargo modules`
   - Python → `pydeps` หรือ `pylint --disable=all --enable=cyclic-imports`
3. ถ้าเป็น monorepo → ตรวจสอบทุก workspaces หรือระบุ workspace
4. ถ้า target ไม่มีอยู่ → stop และ report

### 2. Scan

สแกน circular dependencies ตามภาษา

> Goal: พบ circular dependencies ทั้งหมด

1. รัน tool ที่เลือกบน target directory
2. จับผลลัพธ์เป็น list ของ cycles: module A → module B → module A
3. ตรวจสอบทั้ง direct และ indirect (transitive) cycles
4. ถ้าไฟล์มากกว่า 10 ไฟล์ → ทำ `/use-scripts` สำหรับ batch scanning

### 3. Analyze Findings

วิเคราะห์ severity และ root cause ของแต่ละ cycle

> Goal: เข้าใจ impact และสาเหตุของแต่ละ circular dependency

1. จัดประเภท findings:
   - Critical: cycles ที่ทำให้ build ล้มเหลวหรือ runtime error
   - Warning: cycles ที่ทำงานได้แต่กระทบ maintainability
   - Info: cycles เล็กๆ ที่เกิดจาก type-only imports
2. ระบุ root cause: barrel export cycles, shared state, God module, หรือ missing abstraction
3. กรอง false positives: type-only imports ที่ไม่สร้าง runtime cycle
4. จัดลำดับตาม impact: Critical ก่อน, Warning ตามด้วย, Info สุดท้าย

### 4. Report

รายงานผลและคำแนะนำ

> Goal: ผู้ใช้รู้ issues และวิธีแก้

1. สร้าง report เป็นตาราง: cycle, modules, severity, root cause, recommendation
2. ถ้ามี critical issues → แนะนำทำ `/resolve-errors` หรือ `/use-or-refactor-to-modules`
3. ถ้าไม่พบ issues → report "no circular dependencies found"
4. ทำ `/suggest-next-action`

## Rules

### 1. Accuracy

- กรอง false positives ก่อน report — type-only imports อาจไม่สร้าง runtime cycle
- ระบุ cycle path ชัดเจน: A → B → C → A
- ตรวจสอบทั้ง direct และ transitive cycles

### 2. Completeness

- ตรวจครบทุก workspaces ใน monorepo
- รวม barrel exports (`index.ts`) ในการตรวจสอบ
- ตรวจสอบ cross-workspace dependencies ใน monorepo

### 3. Actionable

- ทุก finding ต้องมี recommendation เช่น: แยก shared types, ใช้ dependency injection, restructure module boundaries
- ถ้า issue ซับซ้อน → แนะนำ `/use-or-refactor-to-modules` หรือ `/follow-import-export`
- ถ้า cycle เกิดจาก barrel exports → แนะนำการแยก barrel file หรือใช้ type-only imports

## Expected Outcome

- รายการ circular dependencies พร้อม severity และ recommendations
- ไม่มี false positives
- ผู้ใช้รู้ next action ที่ชัดเจน
