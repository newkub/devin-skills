---
name: review-codebase-everything
description: Master orchestrator สำหรับ review ทุกมิติของ codebase ผ่านทุก review-* workflow
argument-hint: optional workspace path or name
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-frontend
  - review-backend
  - review-code-quality
  - review-security
  - review-auth
  - review-compliance
  - review-infrastructure
  - review-app-stability
  - review-observability
  - review-performance
  - review-memory
  - review-platform
  - review-cli
  - review-business
  - review-docs
  - review-dx
  - review-workflow-content
  - review-coverage
  - review-debugging
  - review-test
  - review-formal-verification
  - review-simplicity
  - review-codebase-issue
  - review-workspace
  - review-pr
  - run-check
  - resolve-errors
  - read-related-skills
  - follow-agents-md
  - update-review-cli
  - run-dev
  - deep-analyze
  - run-review
  - deep-validate
  - validate
  - implement-all
  - update-reference
  - git-commit
  - report-format-terminal
  - report-format-table
  - report
  - suggest-next-action
---

## Goal

Review codebase ครบทุกมิติอย่างลึกซึ้ง ผ่าน group orchestrators, category workflows และทุก review-* skill โดยจัดกลุ่มตามลำดับความสำคัญ และ validate issues ที่พบ

## Scope

ใช้สำหรับ comprehensive codebase review ครอบคลุมทุก dimension — เป็น entry point ของ review workflows และ catalog ของทุก review-* skill

## Execute

### 1. Prepare And Read Context

ตรวจสอบคุณภาพ codebase และอ่าน context ก่อนเริ่ม review

> Goal: Codebase ผ่าน pre-check และเข้าใจ review dimensions

1. ทำ /run-check เพื่อรัน lint, typecheck และ scan — ถ้าพบ errors ให้ทำ /resolve-errors ก่อน
2. ทำ /read-related-skills, /follow-agents-md, /update-review-cli — ระบุ review dimensions และอัปเดต analyzers
3. ถ้าเป็น web project → เพิ่ม /run-dev เพื่อ verify dev server
4. ทำ /deep-analyze เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
5. ทำ /run-review เพื่อรัน review CLI และดึง metrics ล่าสุด
6. ทำ /review-workspace เพื่อรวบรวม workspace-level context

### 2. Run Group And Category Reviews

ทำกลุ่ม review ตาม category แบบ parallel

> Goal: ครอบคลุมทุก dimension โดยไม่ duplicate

1. ทำ /review-frontend, /review-backend, /review-code-quality เป็น group orchestrators
2. ทำ /review-security, /review-auth, /review-compliance
3. ทำ /review-infrastructure, /review-app-stability, /review-observability, /review-performance, /review-memory, /review-platform, /review-cli
4. ทำ /review-business, /review-docs, /review-dx, /review-workflow-content, /review-coverage, /review-debugging, /review-test
5. ทำ /review-formal-verification, /review-simplicity, /review-codebase-issue, /review-workspace
6. ถ้ามี PR ที่กำลัง review → เพิ่ม /review-pr
7. ถ้า category หรือ workflow ไม่เกี่ยวข้องกับ project → ข้าม workflow นั้น
8. ถ้าพบ critical issues → หยุดและทำ /validate ก่อนดำเนินต่อ

### 3. Validate Findings

ตรวจสอบและ validate issues ที่พบจากทุก category

> Goal: Issues ถูก validate ครบถ้วนตาม severity

1. ทำ /deep-validate เพื่อ validate findings หลายมิติ
2. ทำ /validate สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. ทำ /implement-all สำหรับ issues ที่ต้องการ refactor

### 4. Report And Verify

รายงานผลและวัด review score หลัง validate

> Goal: รายงาน before-after review score และสรุปผล

1. ทำ /run-review เพื่อวัด review score
2. ทำ /report-format-terminal, /report-format-table
3. ทำ /report เพื่อสรุปผล
4. ทำ /suggest-next-action เพื่อแนะนำ action ถัดไป

## Rules

### 1. Delegation And Scope

- Orchestrator เรียก group/category workflows โดยตรง ไม่ทำ review เอง
- ไม่ duplicate เนื้อหา inline — ใช้ /review-frontend, /review-backend, /review-code-quality เพื่อ cover sub-reviews
- ถ้า project ไม่มี dimension ใด → ข้าม workflow นั้น

### 2. Execution Governance

- ทำ category workflows ตามลำดับ Step 2
- ทำ /update-reference หลังจากแก้ไขไฟล์
- รัน tests หลังแต่ละ improvement

### 3. Severity And Evidence

- จัดลำดับ issues ตาม severity: Critical → High → Medium → Low
- ทุก finding ต้องมี evidence: file path, line number, code snippet

### 4. Health Score

- คำนวณ review score เป็น percentage 0-100 จาก /run-review
- แสดง score ต่อ category และ overall

### 5. Formatting

- ห้ามใช้ bold markers ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย /report-format-table

## Review Catalog

รวมทุก review-* skill ที่ /review-codebase-everything ประสานงาน

- Group orchestrators: `review-frontend`, `review-backend`, `review-code-quality`
- Foundation and code quality: `review-architecture`, `review-bug-prone`, `review-codebase-issue`, `review-formal-verification`, `review-naming`, `review-realize-implementation`, `review-refactor`, `review-simplicity`, `review-types`
- Frontend and UX: `review-accessibility`, `review-browser-compat`, `review-bundler`, `review-components`, `review-css`, `review-data-fetching`, `review-design-system`, `review-event-handling`, `review-form`, `review-hooks-composables`, `review-i18n`, `review-images`, `review-rendering`, `review-responsive`, `review-seo`, `review-state-management`, `review-uxui`
- Backend and data: `review-api`, `review-concurrency`, `review-data`, `review-data-validation`, `review-database`, `review-error-handling`, `review-file-upload`, `review-integration`, `review-migration`, `review-queue`, `review-scalability`, `review-service`, `review-webhook`, `review-workers`
- Security and compliance: `review-auth`, `review-compliance`, `review-security`
- Infrastructure and operations: `review-app-stability`, `review-cli`, `review-config`, `review-dx`, `review-infrastructure`, `review-memory`, `review-observability`, `review-performance`, `review-platform`
- Business and delivery: `review-business`, `review-coverage`, `review-debugging`, `review-delivery`, `review-docs`, `review-lib`, `review-techstack`, `review-test`, `review-workflow-content`, `review-workspace`
- Pull request: `review-pr`

## Expected Outcome

- Findings และ recommendations จากทุก review-* workflow
- Issues ที่พบถูก validate ครบถ้วนตาม severity
- Before-after review score ผ่าน /run-review
- รายงานในแชทเป็นตาราง
- แนะนำ action ถัดไปผ่าน /suggest-next-action
