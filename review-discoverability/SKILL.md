---
name: review-discoverability
description: Review discoverability of code, docs, and features with a checklist, score, and action items
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---


## Goal

Review discoverability ครอบคลุม code, docs, features พร้อม review score

## Scope

discoverability review สำหรับ: code discoverability (naming, file/folder structure, exports, barrel files, searchability, `JSDoc`/`TSDoc`, comments, consistent conventions), docs discoverability (`README`, setup guides, API docs, examples, changelogs, doc search/indexing), features discoverability (entry points, navigation, command palette, feature flags, onboarding, help text, error messages) — อยู่ภายใต้ `/review-codebase` เมื่อต้องการ review delivery ทั้งหมด

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ project structure, tools และ discoverability context

1. ทำ `/scan-codebase` เพื่อหา code, docs, features ที่เกี่ยวข้อง
2. ระบุ doc tools, search/index tools, navigation patterns, feature entry points
3. อ่าน `README`, `AGENTS.md` และ docs หลัก

### 2. Review Code Discoverability

> Goal: ตรวจสอบว่า code ค้นหาและเข้าใจได้ง่าย

1. ตรวจสอบ naming conventions: variable, function, class, file, directory, API, database (ใช้ `/review-naming` ถ้าต้องการละเอียด)
2. ตรวจสอบ file/folder structure: logical grouping, kebab-case/PascalCase consistency, barrel exports, index files
3. ตรวจสอบ searchability: ไม่มีชื่อกำกวม, ไม่ใช้ `data`/`temp`/`info`, ไม่ใช้ single-letter นอก loop, consistent terminology across layers
4. ตรวจสอบ `JSDoc`/`TSDoc` บน public API, module exports, top-level functions
5. ตรวจสอบ comments: complex logic อธิบายชัด, ไม่มี redundant/stale comments, ไม่มี `TODO`/`FIXME` ที่ไม่ได้จัดประเภท
6. ตรวจสอบ exports: public surface ชัดเจน, ไม่มี dead exports, ไม่มี deep import paths, barrel files สะท้อน structure
7. Critical: misleading name ใน critical path, ไม่มี docs สำหรับ public API, broken barrel export, ไม่มี module boundary, single source of truth เสีย
8. High: inconsistent naming across layers, ไม่มี `JSDoc` บน public function, deep หรือ circular import paths, ไม่มี index/barrel, ไม่ชัด module name

### 3. Review Docs Discoverability

> Goal: ตรวจสอบว่า docs ช่วยให้หาและใช้งาน project ได้

1. ตรวจสอบ `README`: overview, installation, usage, contributing, badge/status, links ไป docs เต็ม
2. ตรวจสอบ setup guide: clean environment รันได้, prerequisites, env vars, troubleshooting
3. ตรวจสอบ API docs: ครอบคลุม public functions/classes/endpoints, examples, correctness
4. ตรวจสอบ examples: runnable, up-to-date, อ้างอิงจาก `README` หรือ docs
5. ตรวจสอบ doc navigation/search: sidebar, TOC, index, search box, tags/categories, ไม่มี orphan pages
6. ตรวจสอบ changelogs: format, breaking changes, migration notes, version mapping
7. Critical: ไม่มี `README`, setup เสีย, ไม่มี API docs สำหรับ public surface, ไม่มี doc navigation
8. High: example ล้าสมัย, doc link เสีย, ไม่มี changelog entry, ไม่มี search

### 4. Review Feature Discoverability

> Goal: ตรวจสอบว่า users/developers พบและใช้ feature ได้

1. ตรวจสอบ entry points: main menu, command palette, CLI commands, routes, navigation
2. ตรวจสอบ feature flags: naming, location, default values, docs, discoverability
3. ตรวจสอบ onboarding: first-run guide, tooltips, empty states, help links
4. ตรวจสอบ error messages และ help text: actionable, ชี้ไป docs, บอก next step ชัด
5. ตรวจสอบ cross-feature search: global search, filter, tags, categories
6. ตรวจสอบ UX writing: consistent terminology, action-oriented labels, ไม่มี jargon
7. Critical: feature เข้าไม่ถึงจาก UI/CLI, ไม่มี docs สำหรับ key feature, ไม่มี error recovery path, ไม่มี help บน critical action
8. High: ไม่มี onboarding สำหรับ feature ใหม่, ไม่มี command/route, feature naming ไม่สม่ำเสมอ, feature ค้นหาไม่เจอ

### 5. Validate And Report

> Goal: ตรวจสอบ findings และรายงานผล

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate`
3. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Scope

- ไม่ review SEO — ใช้ `/review-seo`
- ไม่ review code quality — ใช้ `/review-code-quality`
- ไม่ review naming โดยละเอียด — ใช้ `/review-naming`
- ไม่ review docs โดยละเอียด — ใช้ `/review-docs`
- อยู่ภายใต้ `/review-codebase` เมื่อ review delivery ทั้งหมด

### 2. Severity Classification

- Critical: feature เข้าไม่ถึง, ไม่มี `README`, broken public API docs, misleading name ใน critical path, ไม่มี module boundary, ไม่มี help บน critical action
- High: docs ล้าสมัย, ไม่มี example, ไม่มี barrel/index, inconsistent terminology across layer, ไม่มี onboarding, doc link เสีย, ไม่มี search
- Medium: guide ไม่สมบูรณ์, ไม่มี changelog entry, ไม่มี `JSDoc` บน non-public API, minor naming inconsistency
- Low: formatting, cosmetic improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path หรือ URL
- ระบุ code, doc section หรือ feature ที่ขาดหรือ unclear

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- แยก review process ออกจาก fix process

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน findings ครอบคลุม code, docs, features
- Review score พร้อม severity
- Recommended actions
- Next actions

