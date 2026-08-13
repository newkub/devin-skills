---
name: review-docs
description: Review documentation quality: README, API docs, examples, guides, JSDoc, and changelogs
auto_execution_mode: 3
related:
  - /scan-codebase
  - /deep-validate
  - /validate
  - /report
  - /report-format-table
  - /suggest-next-action
  - /review-seo
  - /review-code-quality
  - /review-delivery
---

## Goal

Review documentation quality ครอบคลุม README, API docs, examples, guides, `JSDoc`/`TSDoc`, `VitePress` content, และ changelogs พร้อม health score

## Scope

ใช้สำหรับ review documentation ใน project — อยู่ภายใต้ `/review-delivery` เมื่อต้องการ review delivery ทั้งหมด — SEO สำหรับ docs อยู่ใน `/review-seo`

## Execute

### 1. Gather Context

รวบรวม context ก่อน review docs

> Goal: เข้าใจ doc setup, tools, และ target audience

1. ทำ `/scan-codebase` เพื่อหา docs files, README, API docs, `VitePress`
2. ระบุ doc tools: `VitePress`, `Docusaurus`, `Storybook`, custom docs
3. ระบุ target audience: developers, users, contributors

### 2. Review README and Setup

ตรวจสอบ README และ setup guide

> Goal: README สมบูรณ์และ setup ทำงานได้

1. ตรวจสอบ README มี overview, installation, usage, contributing
2. ตรวจสอบ setup guide ทำงานได้จริงบน clean environment
3. ตรวจสอบ prerequisites, env vars, และ troubleshooting

### 3. Review API and Code Examples

ตรวจสอบ API docs และ examples

> Goal: API docs ถูกต้องและ examples รันได้

1. ตรวจสอบ API docs ครอบคลุม public functions, classes, endpoints
2. ตรวจสอบ examples runnable และ up-to-date
3. ตรวจสอบ `JSDoc`/`TSDoc` completeness บน public API

### 4. Review VitePress and Changelogs

ตรวจสอบ `VitePress` content และ changelogs

> Goal: docs สมัยใหม่และ changelog ถูกต้อง

1. ตรวจสอบ `VitePress` content ตรงกับ code ปัจจุบัน
2. ตรวจสอบ broken links, missing pages, stale screenshots
3. ตรวจสอบ changelog format, entry completeness, breaking changes documentation

### 5. Validate and Report

ตรวจสอบและรายงานผล findings

> Goal: report สรุป findings

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate`
3. ให้ severity, คำนวณ health score
4. ทำ `/report` พร้อม `/report-format-table`
5. ทำ `/suggest-next-action`

## Rules

### 1. Scope

- ไม่ review SEO — ใช้ `/review-seo`
- ไม่ review code quality — ใช้ `/review-code-quality`
- อยู่ภายใต้ `/review-delivery` เมื่อ review delivery ทั้งหมด

### 2. Severity

- Critical: missing README, broken setup guide, incorrect API docs, public API ไม่มี docs
- High: outdated example, broken link, missing `@param`, stale docs
- Medium: incomplete guide, missing changelog entry
- Low: formatting, cosmetic improvement

### 3. Evidence

- ทุก finding ต้องมี file path หรือ URL
- ระบุ doc section ที่ขาดหรือ outdated

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงาน docs findings
- Health score
- Recommendations
- Next actions
