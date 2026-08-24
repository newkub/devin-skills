---
name: review-docs
description: Review documentation quality including README, setup, API docs, examples, guides, changelogs, and co
allowed-tools:
  - ask_user_question
  - edit
  - exec
  - glob
  - grep
  - read
triggers:
  - model
  - user
related:
  - review-codebase
  - review-correctness
  - review-frontend
  - review-infrastructure
  - review-performance
  - review-quality
  - review-reliability
  - review-security
  - suggest-next-action
  - validate
---

## Goal

Review documentation ของ project ครอบคลุม README, setup guide, API docs, examples, guides, changelogs พร้อม findings, severity, และ review score Review content coverage ครอบคลุมทุก features, APIs, use cases โดย research จากแหล่งข้อมูลหลายชั้น พร้อมระบุ gaps และ score

## Scope

ใช้สำหรับ review documentation ใน project — ไม่รวม SEO review หรือ code quality review — เน้น review เท่านั้น ไม่แก้ไข docs ระหว่าง review ใช้สำหรับ review content coverage ของ skill, project, หรือ documentation — วิเคราะห์ gaps ระหว่าง inventory และ coverage surface โดยไม่เขียนหรือลบ content

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
### Content Coverage Deep Checks

> Goal: เข้าใจ content structure และ coverage surface

1. ทำ `/scan-codebase` อ่านทุกไฟล์ content ใน target directory
2. ระบุ content inventory: guides, examples, references, key-concepts, principles, index files
3. ระบุ coverage surface: features, APIs, use cases, concepts, best practices
4. ถ้า target directory ไม่มี → stop และ report


> Goal: ตรวจสอบว่า research sources ครอบคลุม

1. ตรวจสอบการใช้ `DeepWiki` สำหรับ GitHub repositories
2. ตรวจสอบการใช้ `Context7` สำหรับ libraries และ frameworks
3. ตรวจสอบ `Official Documentation` ถูกอ้างอิง
4. ตรวจสอบ `Web Search` ใช้เฉพาะ fallback



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
- ถ้าต้องแก้ไข → แนะนำ `/review-docs` หลัง report

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

### 1. Review Only

- เป็น review reference เท่านั้น ไม่แก้ไข ไม่ลบ ไม่สร้าง content ใหม่
- ห้ามลบไฟล์หรือ content ที่มีอยู่

### 2. Coverage Surface

- ทุก features ต้องมี guide
- ทุก APIs ต้องมี examples
- ทุก use cases ต้องมี documentation
- ทุก concepts ต้องมี explanations
- ทุก best practices ต้องมี guidelines

### 3. Source Priority

- ลำดับแหล่งข้อมูล: `DeepWiki` → `Context7` → `Web Search` → `Official Docs`
- ใช้ `DeepWiki` ก่อนถ้าเป็น GitHub repository
- ใช้ `Context7` สำหรับ libraries และ frameworks
- อ้างอิง `Official Documentation` เสมอ

### 4. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder, generic filler

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน findings ตาม doc category
- Review score
- Recommendations
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

- ตาราง: category | coverage % | gaps found | severity | action item
