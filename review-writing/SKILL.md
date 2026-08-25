---
name: review-writing
description: Review writing quality, naming conventions, and discoverability across docs, code, features
---

## Goal

ปรับปรุงคุณภาพการเขียน, naming conventions, และ discoverability ทั่ว project ให้ชัดเจน กระชับ สม่ำเสมอ และค้นหาเข้าถึงได้

## Scope

ครอบคลุม 3 ด้าน:
- `writing-quality` — documentation, code comments, commit messages, changelogs, technical writing ให้ชัดเจน กระชับ สม่ำเสมอ
- `naming` — naming conventions สำหรับ variables, functions, files, components, types, API endpoints, database tables/columns, CSS classes, constants
- `discoverability` — code, docs, features discoverability พร้อม checklist และ review score

ไม่รวม UX copy (ใช้ `/review-frontend`), content coverage (ใช้ `/review-delivery`), SEO (ใช้ `/review-platform`), code quality (ใช้ `/review-quality`) — อยู่ภายใต้ `/review-codebase` เมื่อ review delivery ทั้งหมด

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ project structure และระบุขอบเขต review

1. ทำ `/scan-codebase` เพื่อหา code, docs, features ที่เกี่ยวข้อง
2. ระบุ doc tools, search/index tools, navigation patterns, feature entry points
3. อ่าน `README`, `AGENTS.md` และ docs หลัก
4. จัดประเภท review areas: writing, naming, discoverability — จัดลำดับตาม impact

### 2. Review Writing Quality

> Goal: ตรวจสอบและปรับปรุงคุณภาพการเขียน

ดู `references/writing-quality.md` สำหรับรายการตรวจสอบละเอียด

1. ตรวจ documentation: `README`, docs, API docs — structure, heading hierarchy, navigation
2. ตรวจ code comments: complex logic มี comment ครบ, ลด obvious/stale comments, เปลี่ยน what → why
3. ตรวจ commit messages และ changelogs: conventional commits format, active voice, user-facing language
4. ตรวจ writing consistency: glossary, terminology, voice, tone, formatting
5. จัดลำดับ: `README`/docs → API docs → code comments → changelogs → commit messages

### 3. Review Naming Conventions

> Goal: วิเคราะห์และสร้างไอเดียปรับปรุง naming

ดู `references/naming.md` สำหรับรายการตรวจสอบละเอียด

1. ทำ `/deep-review` เพื่อวิเคราะห์ naming patterns และ inconsistencies
2. ทำ `/follow-best-practice` สำหรับ naming conventions ของภาษาและ framework ที่ใช้
3. ระบุ naming categories: variable, function, file, component, type, API, database, CSS, constant
4. สร้างไอเดีย Extends (ปรับปรุงจากเดิม) และ New (เพิ่มใหม่) — ระบุ problem, current, proposed
5. จัดลำดับตาม impact: API → database → component → function → variable → file → CSS

### 4. Review Discoverability

> Goal: ตรวจสอบว่า code, docs, features ค้นหาและเข้าถึงได้

ดู `references/discoverability.md` สำหรับ checklist ละเอียด

1. ตรวจ code discoverability: naming, file/folder structure, exports, barrel files, searchability, `JSDoc`/`TSDoc`
2. ตรวจ docs discoverability: `README`, setup guide, API docs, examples, navigation/search, changelogs
3. ตรวจ feature discoverability: entry points, feature flags, onboarding, error messages, cross-feature search
4. จัดประเภท severity: Critical → High → Medium → Low — ดู `references/discoverability.md`

### 5. Validate And Report

> Goal: ตรวจสอบผลลัพธ์ คำนวณ score และรายงาน

ดู `references/scoring.md` สำหรับสูตรคำนวณ score

1. ทำ `/deep-validate` และ `/validate` เพื่อ validate findings
2. คำนวณ review score ตาม `references/scoring.md`
3. รัน `tsc --noEmit`, รัน `bunx biome lint`, ทำ `/run-verify` — ถ้าแก้ไขเอกสารที่เกี่ยวกับ code
4. ถ้า validation fail → ทำ `/resolve-errors` แล้ว retry (max 3 → stop/report)
5. ทำ `/report` พร้อม `/report-table` — ตาราง: area | category | issues found | issues fixed | severity | status
6. ทำ `/suggest-next-action`

## Rules

### 1. Writing Priority And Principles

- แก้ `README` และ docs ก่อนเสมอ — impact สูงสุดต่อผู้ใช้และ contributors
- ชัดเจนก่อนสวยงาม — เข้าใจง่ายก่อน แล้วค่อยคิดเรื่อง style
- กระชับ — เขียนสั้นที่สุดเท่าที่จะยังเข้าใจได้ — ตัด noise และ redundant content
- active voice — ใช้ active voice สำหรับ instructions
- อธิบาย why ไม่ใช่แค่ what — บอกเหตุผลและบริบท
- หลีกเลี่ยง jargon — ใช้ศัพท์เทคนิคเมื่อจำเป็น และอธิบายเมื่อใช้

### 2. Naming Principles

- ทุกไอเดียต้อง solve real naming problem — ไม่เสนอการเปลี่ยนชื่อเพราะเท่ห์อย่างเดียว
- เปลี่ยนชื่อเมื่อชื่อปัจจุบันสับสน ไม่สื่อความหมาย หรือ inconsistent
- อ้างอิง official style guides และ community conventions
- พิจารณา impact ของการเปลี่ยนชื่อต่อ codebase ทั้งหมด
- ใช้ `/rename` สำหรับ rename code identifiers รายตัวที่ได้จากไอเดีย

### 3. Discoverability Scope And Severity

- ไม่ review SEO, code quality, naming โดยละเอียด, docs โดยละเอียด — ใช้ skills เฉพาะทาง
- Severity: Critical (feature เข้าไม่ถึง, ไม่มี `README`, broken public API docs) → High (docs ล้าสมัย, ไม่มี example, inconsistent terminology) → Medium (guide ไม่สมบูรณ์, minor naming inconsistency) → Low (formatting, cosmetic)
- ทุก finding ต้องมี file path หรือ URL

### 4. Safety And Scope Control

- การแก้ไข API docs ที่เกี่ยวกับ public API ต้องมี dry run และ user confirmation
- ถ้าแก้ไขเอกสารที่เกี่ยวกับ code → รัน typecheck และ lint หลังแก้ไข
- ไม่ลบเนื้อหาสำคัญ — ทำ `/simplify` เก็บ context ครบ
- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review — แยก review ออกจาก fix

### 5. Output Format

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`
- ตาราง naming: ใช้ continuous numbering ไม่เกิน 40 row พร้อม Type (Extends/New) และ impact indicators
- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ

## Expected Outcome

- documentation ชัดเจน กระชับ สื่อสารได้ตรงประเด็น
- code comments สื่อความหมาย ไม่ใช่ noise
- commit messages และ changelogs บบอก what และ why
- terminology, voice, tone สม่ำเสมอทั่วทั้ง project
- ตาราง naming improvements พร้อม continuous numbering, Current และ Proposed
- รายงาน discoverability findings ครอบคลุม code, docs, features พร้อม severity
- Review score พร้อม weighted average
- ตาราง report: area | category | issues found | issues fixed | severity | status
