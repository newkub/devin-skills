---
name: review-docs
description: Review documentation quality ครอบคลุม README, setup, API docs, examples, guides, changelogs พร้อม...
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

Review documentation ของ project ครอบคลุม README, setup guide, API docs, examples, guides, changelogs พร้อม findings, severity, และ review score

## Scope

ใช้สำหรับ review documentation ใน project — ไม่รวม SEO review หรือ code quality review — เน้น review เท่านั้น ไม่แก้ไข docs ระหว่าง review

## Execute

### 1. Prepare And Scan

เตรียม context และ scan หา docs

> Goal: เข้าใจ doc setup, target audience, และ coverage

1. ทำ `/scan-codebase` เพื่อหา docs files: README, `docs/`, `*.md`, `VitePress`, `Docusaurus`, `Storybook`
2. ระบุ target audience: users, developers, contributors
3. ระบุ doc tools และ framework ทีใช้
4. ถ้าไม่มี docs → stop และ report

### 2. Review README And Setup

ตรวจสอบ README และ setup guide

> Goal: README สมบูรณ์และ setup ทำงานได้

1. ตรวจสอบ README มี overview, installation, usage, contributing
2. ตรวจสอบ setup guide ระบุ prerequisites, env vars, และ troubleshooting
3. ตรวจสอบว่า setup instructions ทำงานได้จริงบน clean environment
4. ตรวจสอบ link ภายใน README ไม่ broken

### 3. Review API And Code Examples

ตรวจสอบ API docs และ examples

> Goal: API docs ถูกต้องและ examples รันได้

1. ตรวจสอบ API docs ครอบคลุม public functions, classes, endpoints
2. ตรวจสอบ `JSDoc`/`TSDoc` completeness บน public API
3. ตรวจสอบ examples runnable และ up-to-date
4. ตรวจสอบ parameter types, return types, และ error cases ใน docs

### 4. Review Guides And Changelogs

ตรวจสอบ guides, concepts, และ changelogs

> Goal: docs ทันสมัยและครอบคลุม

1. ตรวจสอบ guides ตรงกับ code ปัจจุบัน
2. ตรวจสอบ broken links, missing pages, stale screenshots
3. ตรวจสอบ changelog format, entry completeness, breaking changes documentation
4. ตรวจสอบ migration guides ถ้ามี breaking changes

### 5. Validate Findings

ตรวจสอบความถูกต้องของ findings

> Goal: findings ถูกต้อง ลด false positives

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues
3. จัดลำดับ severity: Critical → High → Medium → Low
4. ระบุ false positives

### 6. Rate And Report

ให้คะแนนและรายงาน

> Goal: สรุปผล review เป็นตาราง

1. ให้ severity: Critical, High, Medium, Low, Info
2. คำนวณ review score
3. ทำ `/report` พร้อม `/report-table`
4. ทำ `/suggest-next-action`

## Rules

### 1. Severity Classification

- Critical: missing README, broken setup guide, incorrect API docs, public API ไม่มี docs
- High: outdated example, broken link, missing `@param`, stale docs
- Medium: incomplete guide, missing changelog entry
- Low: formatting, cosmetic improvement

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path หรือ URL
- ระบุ doc section ที่ขาดหรือ outdated

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข docs ระหว่าง review
- ถ้าต้องแก้ไข → แนะนำ `/improve-docs` หลัง report

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน findings ตาม doc category
- Review score
- Recommendations
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

