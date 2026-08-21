---
name: review-codebase
description: Master orchestrator สำหรับ review ทุกมิติของ codebase ผ่าน review CLI และ references
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
  - review-pr
  - review-devin-global-skills
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

Review codebase ครบทุกมิติอย่างลึกซึ้ง ตามลำดับความสำคัญ validate issues ที่พบ และสรุปผลเป็น review score

## Scope

ใช้สำหรับ comprehensive codebase review ครอบคลุมทุก dimension — เป็น entry point ของ review workflows โดยอ่าน references ของแต่ละ dimension แทนการเรียกหลาย skill

## Execute

### 1. Prepare And Read Context

ตรวจสอบคุณภาพ codebase และอ่าน context ก่อนเริ่ม review

> Goal: Codebase ผ่าน pre-check และเข้าใจ review dimensions

1. ทำ `/run-check` เพื่อรัน lint, typecheck และ scan — ถ้าพบ errors ให้ทำ `/resolve-errors` ก่อน
2. ทำ `/read-related-skills`, `/follow-agents-md`, `/update-review-cli` — ระบุ review dimensions และอัปเดต analyzers
3. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server
4. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
5. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
6. อ่าน `references/review-workspace/SKILL.md` เพื่อรวบรวม workspace-level context

### 2. Run Dimension Reviews

Review ทุก dimension โดยอ่าน references ใน `## Review Catalog`

> Goal: ครอบคลุมทุก dimension โดยไม่ duplicate

1. อ่าน `references/review-frontend/`, `references/review-backend/`, `references/review-code-quality/` เป็น group orchestrators
2. อ่าน `references/review-security/`, `references/review-auth/`, `references/review-compliance/`
3. อ่าน `references/review-infrastructure/`, `references/review-app-stability/`, `references/review-observability/`, `references/review-performance/`, `references/review-memory/`, `references/review-platform/`, `references/review-cli/`
4. อ่าน `references/review-business/`, `references/review-docs/`, `references/review-dx/`, `references/review-workflow-content/`, `references/review-coverage/`, `references/review-debugging/`, `references/review-test/`
5. อ่าน `references/review-formal-verification/`, `references/review-simplicity/`, `references/review-codebase-issue/`, `references/review-workspace/`
6. ถ้ามี PR ที่กำลัง review → เพิ่ม `/review-pr`
7. ถ้าต้องการ review global skills → เพิ่ม `/review-devin-global-skills`
8. ถ้า dimension ใดไม่เกี่ยวข้องกับ project → ข้าม dimension นั้น
9. ถ้าพบ critical issues → หยุดและทำ `/validate` ก่อนดำเนินต่อ

### 3. Validate Findings

ตรวจสอบและ validate issues ที่พบจากทุก category

> Goal: Issues ถูก validate ครบถ้วนตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. ทำ `/implement-all` สำหรับ issues ที่ต้องการ refactor

### 4. Report And Verify

รายงานผลและวัด review score หลัง validate

> Goal: รายงาน before-after review score และสรุปผล

1. ทำ `/run-review` เพื่อวัด review score
2. ทำ `/report-format-terminal`, `/report-format-table`
3. ทำ `/report` เพื่อสรุปผล
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Delegation And Scope

- `/review-codebase` เป็น entry point สำหรับ review ทุก dimension
- อ่าน `references/review-<dimension>/SKILL.md` แทนการเรียก `/review-<dimension>`
- ถ้า project ไม่มี dimension ใด → ข้าม dimension นั้น

### 2. Execution Governance

- ทำ dimension reviews ตามลำดับใน `## Review Catalog`
- ทำ `/update-reference` หลังจากแก้ไขไฟล์
- รัน tests หลังแต่ละ improvement

### 3. Severity And Evidence

- จัดลำดับ issues ตาม severity: Critical → High → Medium → Low
- ทุก finding ต้องมี evidence: file path, line number, code snippet

### 4. Review Score

- คำนวณ review score เป็น percentage 0-100 จาก `/run-review`
- แสดง score ต่อ category และ overall

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Review Catalog

รวม references ของทุก review dimension ที่ `/review-codebase` ประสานงาน

- Group orchestrators: `references/review-frontend/`, `references/review-backend/`, `references/review-code-quality/`
- Foundation and code quality: `references/review-architecture/`, `references/review-bug-prone/`, `references/review-codebase-issue/`, `references/review-formal-verification/`, `references/review-naming/`, `references/review-realize-implementation/`, `references/review-refactor/`, `references/review-simplicity/`, `references/review-types/`
- Frontend and UX: `references/review-accessibility/`, `references/review-browser-compat/`, `references/review-bundler/`, `references/review-components/`, `references/review-css/`, `references/review-data-fetching/`, `references/review-design-system/`, `references/review-event-handling/`, `references/review-form/`, `references/review-hooks-composables/`, `references/review-i18n/`, `references/review-images/`, `references/review-rendering/`, `references/review-responsive/`, `references/review-seo/`, `references/review-state-management/`, `references/review-uxui/`
- Backend and data: `references/review-api/`, `references/review-concurrency/`, `references/review-data/`, `references/review-data-validation/`, `references/review-database/`, `references/review-error-handling/`, `references/review-file-upload/`, `references/review-integration/`, `references/review-migration/`, `references/review-queue/`, `references/review-scalability/`, `references/review-service/`, `references/review-webhook/`, `references/review-workers/`
- Security and compliance: `references/review-auth/`, `references/review-compliance/`, `references/review-security/`
- Infrastructure and operations: `references/review-app-stability/`, `references/review-cli/`, `references/review-config/`, `references/review-dx/`, `references/review-infrastructure/`, `references/review-memory/`, `references/review-observability/`, `references/review-performance/`, `references/review-platform/`
- Business and delivery: `references/review-business/`, `references/review-coverage/`, `references/review-debugging/`, `references/review-delivery/`, `references/review-docs/`, `references/review-lib/`, `references/review-techstack/`, `references/review-test/`, `references/review-workflow-content/`, `references/review-workspace/`
- Pull request: `/review-pr`
- Global skills: `/review-devin-global-skills`

## Expected Outcome

- Findings และ recommendations จากทุก dimension
- Issues ที่พบถูก validate ครบถ้วนตาม severity
- Before-after review score ผ่าน `/run-review`
- รายงานในแชทเป็นตาราง
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
