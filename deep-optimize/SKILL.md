---
name: deep-optimize
description: Optimize codebase ครบทุก layer แล้ว dispatch ไป review-* ตาม domain พร้อม validate
argument-hint: "<target>"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - skill
  - run_subagent
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - review-performance
  - review-redundancy
  - check-bottlenecks
  - check-unused
  - deep-refactor
  - deep-analyze
  - review-bundle
  - review-assets
  - review-dependencies
  - review-api
  - review-database
  - resolve-errors
  - run-verify
  - run-build
  - run-test-all
---

## Goal

Optimize codebase แบบละเอียดครบทุก layer — performance, bundle, dead code, dependencies, architecture, SEO, accessibility, API, database, network, cost — โดย dispatch ไปยัง section `## Fix` ของ `review-*` ที่ตรง domain แล้ว implement และ validate

รวม scope จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: optimize-codebase-everything, improve-codebase-everything)

## Scope

ใช้เมื่อ optimize ทั่วไปไม่เพียงพอ หรือต้องการ optimize หลายมิติพร้อมกัน รองรับ web project, monorepo, platform ที่มี frontend, backend, API, database

## Execute

### 1. Define Scope

> Goal: Define Scope

1. รับ `target` จาก argument
2. ตรวจ ecosystem, build system, test setup (`package.json`, `vite.config.ts`, `wrangler.jsonc`, `turbo.json`, `apps/*`, `packages/*`)
3. ระบุ goals: faster build, smaller bundle, less dead code, better structure
4. ทำ `/run-build` เพื่อสร้าง production artifacts สำหรับ baseline
5. ถาม user ถ้า scope ไม่ชัด

### 2. Deep Analysis

> Goal: Deep Analysis

1. ทำ `/deep-analyze` บน target
2. ทำ `/review-performance` เพื่อหา hotspots
3. ทำ `/review-redundancy` เพื่อหา duplicate logic
4. ทำ `/check-unused` และ `/check-bottlenecks`
5. วิเคราะห์ bundle / build output ถ้ามี

### 3. Plan Optimizations

> Goal: วางแผน Optimizations

1. จัดลำดับ optimizations ตาม impact และ effort
2. แยก quick wins กับ major changes
3. ระบุ public API ทีอาจเปลี่ยน
4. สร้าง plan แล้วทำ `/plan` เพื่อ user confirm

### 4. Implement By Domain

> Goal: implement แยกตาม domain ผ่าน sub-skills

Dispatch ตาม layer — เรียก section `## Fix` ของ review skill ที่ตรง domain ทำทีละ layer แล้ว verify ก่อนไปต่อ:

| No. | Domain | Skill |
|-----|--------|-------|
| 1 | Bundle / code splitting / tree-shaking | `/review-bundle` |
| 2 | Images, fonts, media | `/review-assets` |
| 3 | Rendering / re-renders / hydration | `/review-frontend` |
| 4 | CWV / long tasks / third-party scripts | `/review-performance` |
| 5 | Network / caching / CDN | `/review-performance` |
| 6 | Memory leaks / GC pressure | `/review-performance` |
| 7 | Heavy หรือ duplicate deps | `/review-dependencies` |
| 8 | Algorithms / hot paths | `/review-algorithm` |
| 9 | Infrastructure cost | `/review-cost` |
| 10 | SEO / meta / structured data | `/review-seo` |
| 11 | Accessibility / UX | `/review-uxui` |
| 12 | API endpoints | `/review-api` |
| 13 | Data validation | `/review-data-validation` |
| 14 | Database / queries / indexes | `/review-database` |
| 15 | Test coverage | `/review-test` |
| 16 | Dead code / redundant logic | ลบและรวมเอง หรือ `/deep-refactor` ถ้าใหญ่ |

### 5. Validate

> Goal: Validate

1. ทำ `/run-verify`
2. ทำ `/run-test-all` ถ้ามี
3. ทำ `/run-build` หรือ `/deep-build` ถ้ามี build
4. ตรวจ `git diff` ย่อย ๆ
5. ถ้า fail → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 รอบ

### 6. Measure

> Goal: Measure

1. บันทึก before/after metrics
2. วัด bundle size, build time, test time, dead code count, API latency, query time
3. ทำ `/report-before-after`

### 7. Report

> Goal: Report

1. สรุป optimizations ทีทำ
2. บอก metrics ก่อน-หลัง
3. ระบุ items ทีค้างและ recommendations
4. ทำ `/report-progress` และ `/suggest-next-action`

## Rules

- ต้องมี user confirmation ก่อนเปลี่ยน public API หรือ architecture
- ไม่ลบ code โดยไม่ตรวจ consumers
- ทุก major change ต้องมี validation — ผ่าน build, typecheck, tests
- ไม่ลด security หรือ accessibility เพื่อ performance
- ถ้า codebase ใหญ่ ให้ใช้ subagents แยกตาม module/package
- ไม่เพิ่ม dependency ใหม่ถ้าไม่จำเป็น
- เก็บ evidence ของ metrics ก่อนและหลัง
- หลีกเลี่ยง over-engineering — แก้เฉพาะจุดที่ metrics บ่งชี้

## Expected Outcome

- Codebase ถูก optimize ครบทุก layer ที่เกี่ยวข้อง
- Metrics before/after ชัดเจน (bundle, build time, latency, query time, cost)
- Validation ผ่าน ไม่มี regression
- User ทราบสิ่งทีเปลี่ยนและผลกระทบ
