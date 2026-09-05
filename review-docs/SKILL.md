---
name: review-docs
description: ตรวจสอบ docs structure ก่อน update-docs แก้ไข ครอบคลุม VitePress config และ content
related:
  - scan-codebase
  - check-monorepo
  - report-table
  - suggest-next-action
  - update-docs
  - review-features
  - review-readme-md
  - improve-docs
---

## Goal

Review documentation structure ก่อนเรียก `update-docs` เพื่อยืนยันว่า `docs/` directory, VitePress config, nav/sidebar, content pages, frontmatter และ links ครบถ้วน

## Scope

ใช้ก่อนเรียก `update-docs` — ตรวจ `docs/` structure, VitePress config, content quality และ link integrity ทำ review เท่านั้น ไม่แก้ไข docs ไม่ตรวจ features coverage (scope ของ `review-features`)

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ docs target

1. ทำ `/scan-codebase`
2. ทำ `/check-monorepo`
3. ตรวจว่า `docs/` directory มีอยู่ที่ root ถ้าไม่ → flag เป็น critical
4. บันทึก workspace list ถ้าเป็น monorepo

### 2. Check Docs Structure

> Goal: ตรวจ `docs/` directory structure ครบถ้วน

1. ทำตาม `references/structure.md`

### 3. Check VitePress Config

> Goal: ตรวจ nav และ sidebar ครบถ้วน

1. ทำตาม `references/vitepress-config.md`

### 4. Check Frontmatter

> Goal: ตรวจ frontmatter ในทุก markdown ไฟล์

1. ทำตาม `references/frontmatter.md`

### 5. Check Content Quality

> Goal: ตรวจ content quality และ real data

1. ทำตาม `references/content-quality.md`

### 6. Check No Workspace Duplicates

> Goal: ตรวจไม่มี duplicated docs ใน monorepo

1. ทำตาม `references/workspace-links.md#check-no-workspace-duplicates`

### 7. Check Links

> Goal: ตรวจ internal links และ references

1. ทำตาม `references/workspace-links.md#check-links`

### 8. Score And Report

> Goal: สรุป review score และ findings

1. ทำตาม `references/scoring.md`
2. ทำ `/report-table` พร้อม findings
3. ทำ `/suggest-next-action`

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข docs ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-docs`
- ทุก finding ต้องมี file path และ evidence

### 2. Scope Coordination

- ตรวจ `docs/` structure, VitePress config, content quality, links
- ไม่ตรวจ features coverage — ใช้ `review-features`
- ไม่ตรวจ README format — ใช้ `review-readme-md`
- ถ้า findings ซ้อนทับ → อ้างอิงแทน ไม่ทำซ้ำ

### 3. Severity Ratings

- `Critical`: ไม่มี `docs/`, ไม่มี VitePress config, ไม่มี required pages
- `High`: nav/sidebar ขาด, frontmatter ขาด, placeholder แทนข้อมูลจริง
- `Medium`: collapsed ขาด, description เกิน 120, HTML แทน markdown
- `Low`: workspace duplicates, ผสมภาษา, links ไม่ตรง
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 4. Scoring

- review score = weighted average ของ findings
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำ `update-docs`

### 5. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

- ใช้ /improve-docs ถ้าจำเป็น

## Expected Outcome

- รายงาน Docs Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence, action
- ยืนยัน docs structure, VitePress config, frontmatter
- ยืนยัน content quality และ links
- ยืนยันไม่มี workspace duplicates
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
