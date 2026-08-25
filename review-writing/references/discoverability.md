# Discoverability Checks

Checklist สำหรับ review discoverability ของ code, docs, features พร้อม severity classification

## Code Discoverability

### Checks

- ตรวจ naming conventions: variable, function, class, file, directory, API, database
- ตรวจ file/folder structure: logical grouping, kebab-case/PascalCase consistency, barrel exports, index files
- ตรวจ searchability: ไม่มีชื่อกำกวม, ไม่ใช้ `data`/`temp`/`info`, ไม่ใช้ single-letter นอก loop, consistent terminology across layers
- ตรวจ `JSDoc`/`TSDoc` บน public API, module exports, top-level functions
- ตรวจ comments: complex logic อธิบายชัด, ไม่มี redundant/stale comments, ไม่มี `TODO`/`FIXME` ที่ไม่ได้จัดประเภท
- ตรวจ exports: public surface ชัดเจน, ไม่มี dead exports, ไม่มี deep import paths, barrel files สะท้อน structure

### Severity

- `Critical`: misleading name ใน critical path, ไม่มี docs สำหรับ public API, broken barrel export, ไม่มี module boundary, single source of truth เสีย
- `High`: inconsistent naming across layers, ไม่มี `JSDoc` บน public function, deep หรือ circular import paths, ไม่มี index/barrel, ไม่ชัด module name

## Docs Discoverability

### Checks

- ตรวจ `README`: overview, installation, usage, contributing, badge/status, links ไป docs เต็ม
- ตรวจ setup guide: clean environment รันได้, prerequisites, env vars, troubleshooting
- ตรวจ API docs: ครอบคลุม public functions/classes/endpoints, examples, correctness
- ตรวจ examples: runnable, up-to-date, อ้างอิงจาก `README` หรือ docs
- ตรวจ doc navigation/search: sidebar, TOC, index, search box, tags/categories, ไม่มี orphan pages
- ตรวจ changelogs: format, breaking changes, migration notes, version mapping

### Severity

- `Critical`: ไม่มี `README`, setup เสีย, ไม่มี API docs สำหรับ public surface, ไม่มี doc navigation
- `High`: example ล้าสมัย, doc link เสีย, ไม่มี changelog entry, ไม่มี search

## Feature Discoverability

### Checks

- ตรวจ entry points: main menu, command palette, CLI commands, routes, navigation
- ตรวจ feature flags: naming, location, default values, docs, discoverability
- ตรวจ onboarding: first-run guide, tooltips, empty states, help links
- ตรวจ error messages และ help text: actionable, ชี้ไป docs, บอก next step ชัด
- ตรวจ cross-feature search: global search, filter, tags, categories
- ตรวจ UX writing: consistent terminology, action-oriented labels, ไม่มี jargon

### Severity

- `Critical`: feature เข้าไม่ถึงจาก UI/CLI, ไม่มี docs สำหรับ key feature, ไม่มี error recovery path, ไม่มี help บน critical action
- `High`: ไม่มี onboarding สำหรับ feature ใหม่, ไม่มี command/route, feature naming ไม่สม่ำเสมอ, feature ค้นหาไม่เจอ

## Severity Classification Summary

- `Critical`: feature เข้าไม่ถึง, ไม่มี `README`, broken public API docs, misleading name ใน critical path, ไม่มี module boundary, ไม่มี help บน critical action
- `High`: docs ล้าสมัย, ไม่มี example, ไม่มี barrel/index, inconsistent terminology across layer, ไม่มี onboarding, doc link เสีย, ไม่มี search
- `Medium`: guide ไม่สมบูรณ์, ไม่มี changelog entry, ไม่มี `JSDoc` บน non-public API, minor naming inconsistency
- `Low`: formatting, cosmetic improvement, documentation gap

## Evidence Requirements

- ทุก finding ต้องมี file path หรือ URL
- ระบุ code, doc section หรือ feature ที่ขาดหรือ unclear
- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
