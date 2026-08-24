---
name: review-error-handling
description: Review error boundaries, try-catch, unhandled rejections, messages, codes, recovery, degradation
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

Review error handling ครอบคลุม error boundaries, try-catch, unhandled rejections, error messages, recovery พร้อม review score

## Scope

error handling review สำหรับ: error boundaries, try-catch coverage, unhandled rejections, error messages (user-friendly, actionable, localized), error codes, error classification, graceful degradation, error recovery patterns, error logging, error monitoring, error propagation, error display, error reporting

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ error handling patterns ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ error handling structure
2. ระบุ error handling framework, error boundary patterns, error logging service, error monitoring (Sentry, Bugsnag) ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก error handling dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ error handling patterns
2. ทำ `/update-create-review-cli` — เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Error Capture And Coverage Review

> Goal: ครอบคลุม error boundaries, try-catch, unhandled rejections

1. ตรวจสอบ error boundaries: error boundary coverage on critical paths, error boundary fallback UI, error boundary recovery, error boundary logging, nested error boundaries
2. ตรวจสอบ try-catch coverage: try-catch on async operations, try-catch on external calls, try-catch on critical functions, missing try-catch detection, catch block quality (not empty, not swallowing)
3. ตรวจสอบ unhandled rejections: unhandled rejection handler, global rejection handler, floating promises, promise chain error propagation, async function error propagation
4. ตรวจสอบ error classification: error types (network, validation, auth, server, client), error hierarchy, custom error classes, error discrimination, error vs exception vs fault
5. จัด severity ตาม `## Rules` section Severity Classification

### 4. Error Messages, Recovery And Monitoring Review

> Goal: ครอบคลุม error messages, recovery, logging, monitoring

1. ตรวจสอบ error messages: user-friendly messages, actionable messages (what user should do), localized messages, error message clarity, error message specificity, no technical jargon in user messages, error code for support reference
2. ตรวจสอบ error codes: error code system, error code uniqueness, error code documentation, error code in API response, error code mapping to user messages
3. ตรวจสอบ graceful degradation: fallback UI on error, partial functionality on error, cached data fallback, default value fallback, offline mode, retry option for user
4. ตรวจสอบ error recovery: error recovery patterns, automatic retry, user-initiated retry, state recovery after error, error boundary reset, form data preservation on error
5. ตรวจสอบ error logging: error logging completeness, error context (stack, user, request), error severity logging, PII scrubbing in logs, log level appropriateness, structured logging
6. ตรวจสอบ error monitoring: error monitoring integration, error alerting, error rate thresholds, error grouping, error dashboard, error trend tracking
7. จัด severity ตาม `## Rules` section Severity Classification

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี error boundaries → ข้าม Step 3 item 1
- ถ้า project ไม่มี error monitoring → ข้าม Step 4 item 6
- ถ้า project ไม่มี async operations → ข้าม Step 3 item 3

### 2. Severity Classification

- Critical: unhandled error on critical path, silent failure ที่ก่อให้เกิด data loss, missing error handling on critical integration, empty catch block ใน critical path, no global error handler, data loss from error, no error recovery on critical path, PII exposed in error logs, no error monitoring on critical path
- High: missing error boundary, missing try-catch on external call, floating promise, swallowing error, missing error classification, confusing error message, no error recovery, missing error logging, no graceful degradation, no error monitoring
- Medium: suboptimal error message, missing error code, missing structured logging, inconsistent error classification, missing retry option
- Low: cosmetic, minor error message improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ function, error handler, หรือ error path ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก error handling section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

