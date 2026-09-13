---
name: review-docs
description: ตรวจสอบ docs structure, VitePress config และ README.md ก่อน update แก้ไข
argument-hint: "[scope]"
related:
  - scan-codebase
  - check-monorepo
  - report
  - suggest-next-action
  - update-docs
  - run-docs
  - run-review
---

## Goal

Review documentation structure ก่อนเรียก `update-docs` เพื่อยืนยันว่า `docs/` directory, VitePress config, nav/sidebar, content pages, frontmatter และ links ครบถ้วน

## Scope

ใช้ก่อนเรียก `update-docs` — ตรวจ `docs/` structure, VitePress config, content quality และ link integrity ทำ review เท่านั้น ไม่แก้ไข docs ไม่ตรวจ features coverage (scope ของ `review-docs`)

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: review-content-coverage, review-readme-md) — content coverage ดู `references/content-coverage-checklist.md`, README checks ดู `references/readme-*.md`

สำหรับ dedicated fix pass อยู่ที่ `/deep-review-then-fix`

- merged from: `review-usage-md`, `review-features` — USAGE.md refs `references/usage-md-*.md`, features docs refs `references/features-*.md`

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

### 8. Check README.md (merged from: review-readme-md)

สำหรับ dedicated fix pass อยู่ที่ `/deep-review-then-fix`

> Goal: ตรวจ `README.md` ทั้ง root และ workspace — section order, tables, coverage

1. ตรวจ section order ตาม `references/readme-section-order.md`
2. ตรวจ table columns และ icon format ตาม `references/readme-tables-icons.md`
3. ตรวจ content standards ตาม `references/readme-content-standards.md`
4. ตรวจ Usage coverage ตาม `references/readme-usage-coverage.md` และ Features coverage ตาม `references/readme-features-coverage.md`
5. ตรวจ workspace READMEs ตาม `references/readme-workspace-consistency.md`
6. คำนวณ README score ตาม `references/readme-scoring.md`
7. ถ้า README score < 70 → แนะนำ `update-docs readme-md`

### 9. Drift And Changelog

> Goal: coverage เพิ่มเติมของ domain

1. API docs drift vs OpenAPI/implementation จริง
2. changelog hygiene — entries ครบ, format consistent, unreleased section

### 10. Score And Report

> Goal: สรุป review score และ findings

1. ทำตาม `references/scoring.md`
2. ทำ `/report` พร้อม findings
3. ทำ `/suggest-next-action`

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข docs ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-docs`
- ทุก finding ต้องมี file path และ evidence (docs)

### 2. Scope Coordination

- ตรวจ `docs/` structure, VitePress config, content quality, links และ `README.md`
- ไม่ตรวจ features coverage — ใช้ `review-docs`
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
- รายงานเป็นตารางด้วย `/report`
- ใช้ /review-writing ถ้าจำเป็น
- ใช้ /review-quality ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. accuracy: commands/APIs/env vars ตรง source จริง — verify หรือรันจริง
2. coverage: features/public APIs ที่ขาด docs → เขียนตาม conventions
3. freshness: stale sections update/ลบ; onboarding walkthrough ตามจริง
4. links/structure: `/check-repo-hygiene dead-link`, heading hierarchy, TOC/sidebar sync
5. verify: docs build ผ่านไม่มี warnings
- ใช้ /run-docs ถ้าจำเป็น
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- รายงาน Docs Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence, action
- ยืนยัน docs structure, VitePress config, frontmatter
- ยืนยัน content quality และ links
- ยืนยันไม่มี workspace duplicates
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
