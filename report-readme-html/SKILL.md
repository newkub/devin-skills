---
name: report-readme-html
description: สร้าง README.html report ใน temp dir ด้วย Element Plus + Tailwind, เปิดผ่าน /open-web
argument-hint: "[file]"
related:
  - report-html
  - report
  - update-docs
  - open-web
  - create-files-in-os-temp
  - run-docs
---

## Goal

สร้างไฟล์ `README.html` แบบ single-file interactive report ใน OS temp dir — Element Plus + Tailwind CSS, tab system 7 tabs พร้อม search, sorting, grouping และ expand/collapse — แล้วเปิดด้วย `/open-web`

## Scope

สรุป README/docs ของ project เป็น HTML report ชั่วคราว — ไม่เขียนลง project root (เขียนใน temp เท่านั้น)

- 7 tabs: Features, Dependencies, Architecture, API Endpoints, Database Schema, Environment Variables, Getting Started
- Generic single-file HTML report (non-README data) → `/report-html`
- Permanent docs → `/update-docs` แทน

## Execute

### 1. Collect Data

> Goal: มีข้อมูลครบก่อน render

1. อ่าน `README.md` (argument `file` → ใช้ไฟล์นั้น) + `package.json`/`Cargo.toml` + โครงสร้างโปรเจกต์
2. สรุปเป็นข้อมูลต่อ tab: features, deps (name/version/license/type), architecture tree, API endpoints, db schema, env vars, getting-started steps

### 2. Build HTML In Temp

> Goal: single-file HTML ใน temp dir

1. ทำ `/create-files-in-os-temp` — สร้าง `<temp>/readme-report/README.html`
2. Vue 3 ผ่าน unpkg CDN (`vue.global.prod.js`) + Element Plus JS (`index.full.min.js`) + CSS (base + dark) — ต้องโหลด JS ด้วยและเรียก `app.use(ElementPlus)` ก่อน mount
3. Tailwind CSS browser build + `tailwind.config = { darkMode: 'class' }`
4. สร้าง `<el-tabs>` 7 panes ตาม Scope

### 3. Tab Content Patterns

> Goal: แต่ละ tab มี structure ชัดเจน

1. Features — `<el-collapse>` ตาม category + `<el-table>` 7 cols (feature/status/category/description/benefit/priority/module), `sortable` + `<el-input>` search
2. Dependencies — `<el-table>` 6 cols (library `<el-link>`/version/license/type/security/source) + `<el-tag>` color coding
3. Architecture — `<el-tree>` หรือ nested `<el-collapse-item>` จัดกลุ่มตาม layers
4. API Endpoints — `<el-card>` ต่อ endpoint (method/path/description/params) + search
5. Database Schema — table per entity (columns, types, relations)
6. Environment Variables — table (name/required/description/example) — ห้ามใส่ค่า secret จริง
7. Getting Started — numbered steps + code blocks

### 4. Open And Report

> Goal: เปิดผลลัพธ์ให้ user ดู

1. ทำ `/open-web` กับ path ของ HTML file ใน temp
2. ทำ `/report` สรุป path + tab coverage

## Rules

- เขียนลง temp dir เท่านั้น — ห้ามเขียน `README.html` ลง project root
- Single file self-contained — assets ทั้งหมดจาก CDN, ไม่ต้อง build
- ห้ามใส่ secrets/env values จริงใน Environment Variables tab
- ใช้ `/open-web` เปิดผลลัพธ์ — ห้าม `Start-Process` ตรงๆ ถ้า `/open-web` ใช้ได้

- ใช้ `/report-html` ถ้าต้องการ generic interactive report
- ใช้ `/create-files-in-os-temp`, `/open-web` เสมอ
- ใช้ `/update-docs` ถ้าต้องการ permanent docs แทน

## Expected Outcome

- `README.html` ใน temp เปิดใน browser ผ่าน `/open-web`
- 7 tabs ครบพร้อม search/sort/group
- ไม่มีไฟล์ report ค้างใน project
