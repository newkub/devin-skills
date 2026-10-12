---
name: learn-from-references-and-improve-skills
description: เรียนรู้จาก reference sources (docs, URLs, files, codebase) แล้วอัปเดต skills ให้ตรง — ใช้ /improve-coverage เติม gaps
argument-hint: "[refs-source] [target-skill(s)]"
related:
  - learn-from-web
  - learn-from-codebase
  - learn-from-cli
  - check-types-definition
  - improve-coverage
  - update-devin-global-skills
  - check-reference
  - deep-validate
  - update-references
  - report
---

## Goal

เรียนรู้จาก reference sources (official docs, URLs, local files, codebase, CLI, type declarations) แล้ว sync ความรู้นั้นเข้า skills เป้าหมาย — แก้ stale claims, เติมส่วนที่ขาด, อัปเดต versions — จน skill ตรงกับ source of truth

## Scope

ใช้เมื่อมี reference material ใหม่/ใหม่กว่า (เช่น docs ที่เพิ่งอัปเดต, release notes, API reference, codebase ที่เปลี่ยน) และต้องการให้ skills ที่เกี่ยวข้องตามทัน — **ต่างจาก `learn-from-*` ตัวอื่นตรงที่นี่ "เขียนกลับเข้า skills"** ไม่ใช่แค่สกัดความรู้; ไม่ใช่ coverage check ล้วน (ใช้ `/improve-coverage`) และไม่ใช่ review (ใช้ `/deep-review`)

## Execute

### 1. Collect References

> Goal: รวบรวม reference sources ทั้งหมดที่ user ให้หรือที่เกี่ยวข้อง

1. รับ refs จาก user — URLs, file paths, directory, repo, package name หรือ topic
2. Route ตามประเภท source:
   - URL/docs/topic → ทำ `/learn-from-web` step 1-2 (official docs → DeepWiki → Context7 → Web Search)
   - Local files/directory → อ่านตรงๆ ด้วย `read`/`grep`
   - Codebase → ทำ `/learn-from-codebase` step 1
   - CLI binary → ทำ `/learn-from-cli`
   - `.d.ts` API surface → ทำ `/check-types-definition`
3. ถ้า refs ไม่ชัด → ถาม user ก่อน (source ไหน, target skill ไหน)

### 2. Extract Knowledge

> Goal: สกัด claims ที่ตรวจสอบได้จาก sources

1. สร้าง claims table: `claim | type | source` — types: `api`, `version`, `config`, `pattern`, `deprecation`, `breaking-change`
2. จับ version + date ของ source เสมอ (เช่น `v66.10.5, verified YYYY-MM-DD`)
3. แยก "facts ที่ verify แล้ว" ออกจาก "inference" — inference ต้อง flag ชัด
4. บันทึก source URLs/paths ทุก claim — ทุก claim ต้อง trace กลับ source ได้

### 3. Audit Target Skills

> Goal: เทียบ knowledge ที่ได้กับ skill content ปัจจุบัน หา drift

1. ระบุ target skills (user ระบุ หรือ match จาก claims → `follow-*`/`skill` ที่เกี่ยว)
2. อ่าน `SKILL.md` + `references/` + `best-practices/` + `workflows/` ทั้งหมดของแต่ละ target
3. สร้าง drift table: `skill | file | claim | status` — statuses:
   - `stale` — ข้อมูลเก่า/version ต่ำกว่า source
   - `wrong` — ขัดกับ source
   - `missing` — source มีแต่ skill ไม่มี
   - `ok` — ตรงแล้ว
4. เรียง priority: `wrong` > `stale` > `missing`

### 4. Update Skills

> Goal: sync skill content ให้ตรง source ตาม conventions

1. แก้ `stale`/`wrong` ก่อน — minimal edit, ไม่ rewrite ทั้งไฟล์
2. เติม `missing` เฉพาะที่ relevant กับ scope ของ skill — ไม่ dump ทั้ง reference
3. ทุกการแก้ต้องตาม `/update-devin-global-skills` conventions: frontmatter ครบ, section order, backticks, ≤250 บรรทัด/ไฟล์, ไม่มี TODO/MOCK/placeholder
4. Content ใหม่ที่เป็น detail ยาว → เขียนลง `references/` แทน `SKILL.md` (Write References spec)
5. อัปเดต version strings พร้อม `verified YYYY-MM-DD` เมื่อ verify จาก source จริง

### 5. Ensure Coverage

> Goal: skill ที่อัปเดตครอบคลุมครบ ไม่เหลือ gaps

1. ทำ `/improve-coverage` กับ target skills ทุกตัวที่เพิ่งแก้ — เติม `references/`/`examples`/edge-cases ที่ยังขาดจาก claims ที่ยังไม่ได้ใช้
2. ตรวจทุก file ที่สร้าง/แก้ผ่าน `/check-reference` — claims ตรง source, ไม่มี dangling links

### 6. Validate

> Goal: ยืนยัน changes ถูกต้องตาม repo conventions

1. ทำ `/deep-validate` ตรวจ conventions ทั้ง repo (frontmatter, `related` resolve จริง, line limits)
2. ทำ `/update-references` ถ้ามีการเพิ่มไฟล์/โฟลเดอร์ใหม่
3. ตรวจ `related` ของทุก skill ที่แตะ — ทุก entry มีอยู่จริงและถูกกล่าวถึงใน body

### 7. Report

> Goal: สรุปว่าอะไรเปลี่ยนจากอะไร

1. ทำ `/report` table: `Skill | Source | Claims Updated | Gaps Filled | Status`
2. แนบ drift summary: จำนวน stale/wrong/missing ที่แก้ และ claims ที่เหลือ (out of scope)
3. แนะนำ next actions ถ้ามี skills อื่นที่น่าได้รับผลกระทบจาก source เดียวกัน

## Rules

### 1. Source Of Truth

- References คือ truth — skill ต้องตาม source ไม่ใช่กลับกัน
- ทุก claim ที่เขียนลง skill ต้อง trace กลับ source ได้ — ห้ามเดา
- Source ขัดกันเอง → เลือก official/current แล้วบันทึก conflict ไว้ใน report

### 2. Minimal Diff

- แก้เฉพาะจุดที่ drift — ห้าม rewrite ทั้ง skill ถ้าไม่จำเป็น
- ไม่เปลี่ยน structure/frontmatter/style ของ skill ถ้าไม่เกี่ยวกับ claims
- ไม่แตะ skills ที่ไม่ได้อยู่ใน target list

### 3. Conventions

- ทุกไฟล์ที่แตะต้องผ่าน `/update-devin-global-skills` conventions และ `/check-reference`
- File ใหม่ใน `references/`/`best-practices/` ต้องถูกอ้างจาก `SKILL.md` (ไม่ใช่ orphan)
- ใช้ `/learn-from-web` `/learn-from-codebase` `/learn-from-cli` `/check-types-definition` เป็น source adapters — ห้ามเขียน logic ซ้ำ

## Expected Outcome

- Target skills sync กับ reference sources ครบ — ไม่มี stale/wrong claims เหลือ
- Gaps เติมครบผ่าน `/improve-coverage`, references ไม่ dangling
- ทุก change traceable กลับ source, version/date ระบุชัด
- Report แสดง before/after drift ชัดเจน
