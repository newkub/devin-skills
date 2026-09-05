---
name: review-stability
description: Review app stability, error handling, debuggability, recovery, monitoring and score
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - scan-codebase
  - deep-analyze
  - update-project-rules
  - run-review
  - use-in-another-skills
  - report-table
---

## Goal

Review ความเสถียรของ application ครอบคลุม crashes, error handling, debuggability, recovery, monitoring พร้อม review score

## Scope

- `app-stability`: crashes, error boundaries, recovery, monitoring, health checks, graceful degradation
- `error-handling`: try-catch, unhandled rejections, error messages, error codes, error classification
- `debuggability`: logging context, error message clarity, naming conventions, code complexity
- `error-patterns`: log clustering and recurring issue detection from logs
- ไม่รวมการ fix (ใช้ `/deep-review` สำหรับ fix)

- ดูเพิ่มเติม: /deep-review-codebase

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ stability, error handling, debuggability ปัจจุบันของ codebase

1. ทำ `/scan-codebase` เพื่อหา error handling, logging, monitoring, health checks
2. ระบุ error handling framework, error boundary patterns, error logging service, error monitoring ที่ใช้
3. ตรวจสอบ logging statements, error messages, naming conventions, code complexity และ nesting
4. ระบุ files ที่เกี่ยวข้องกับ top-level error boundaries หรือ crash handlers
5. ค้นหา patterns: try-catch, unhandled rejections, global error handlers, memory leaks, infinite loops
6. ถ้ามี log หรือ error aggregation ให้ทำตาม `references/error-patterns.md`

### 2. Deep Analyze

> Goal: ครอบคลุมทุก stability dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ stability, error handling, debuggability patterns
2. ทำ `/deep-review` — เรียก `/update-project-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/deep-review` ข้าม `/update-project-rules` → ทำ `/update-project-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. App Stability

> Goal: app ไม่ crash ทั้งหมดเมื่อส่วนใดส่วนหนึ่งพัง

ทำตาม `references/app-stability.md`

### 4. Error Handling

> Goal: errors ถูกจัดการอย่างถูกต้อง ครอบคลุมทุก dimension

ทำตาม `references/error-handling.md`

### 5. Debuggability

> Goal: รู้ว่า logging, error messages, naming, complexity เหมาะสมหรือไม่

ทำตาม `references/debuggability.md`

### 6. Recovery

> Goal: ระบบพังบางส่วนได้โดยไม่หยุดทำงานทั้งหมด

ทำตาม `references/recovery.md`

### 7. Related Workflows

> Goal: ไม่ซ้ำซ้อนกับ review skills อื่น

1. ทำ `/use-in-another-skills` เพื่อหา skills ที่เกี่ยวข้อง
2. ถ้าพบ performance issues ให้ทำ `/deep-review`
3. ถ้าพบ concurrency issues ให้ทำ `/deep-review`
4. ถ้าพบ security issues ให้ทำ `/deep-review`
5. ใช้ `/report-table` เพื่อจัดรูปแบบผลลัพธ์

### 8. Validate, Score And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง พร้อม review score

1. ทำ `/deep-validate` เพื่อ validate findings จากทุก section
2. จัดลำดับตาม severity: Critical → High → Medium → Low
3. คำนวณ review score ตาม `references/scoring.md`
4. ทำ `/report` พร้อม `/report-table` กำหนด columns: `No`, `Category`, `Issue`, `Severity`, `Location`, `Recommendation`
5. จัดกลุ่มตาม category: Crashes, Errors, Debuggability, Monitoring, Recovery, Health
6. ทำ `/suggest-next-action`

## Rules

### 1. Scope Boundary

- เน้นความเสถียรของ app โดยรวม ไม่ใช่แค่ app crash
- ไม่ซ้ำกับ `/deep-review` ใช้ workflows เหล่านั้นแทนการเขียนซ้ำ
- รายละเอียด debuggability principles อยู่ใน `references/debuggability.md`
- workflow นี้เป็น review เท่านั้น ไม่ fix

### 2. Skip Conditions

- ถ้า project ไม่มี error boundaries → ข้าม `app-stability` error boundary checks
- ถ้า project ไม่มี error monitoring → ข้าม `error-handling` error monitoring checks
- ถ้า project ไม่มี async operations → ข้าม `error-handling` unhandled rejections checks

### 3. Severity Classification

- Critical: unhandled error on critical path, silent failure ที่ก่อให้เกิด data loss, missing error handling on critical integration, empty catch block ใน critical path, no global error handler, data loss from error, no error recovery on critical path, PII exposed in error logs, no error monitoring on critical path, no logging
- High: missing error boundary, missing try-catch on external call, floating promise, swallowing error, missing error classification, confusing error message, no error recovery, missing error logging, no graceful degradation, no error monitoring, generic errors
- Medium: suboptimal error message, missing error code, missing structured logging, inconsistent error classification, missing retry option, poor naming
- Low: cosmetic, minor error message improvement, documentation gap, high complexity

### 4. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ function, error handler, หรือ error path ที่เกี่ยวข้อง
- ให้ actionable recommendations ทุกรายการ

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ backticks สำหรับ `files`, `functions`, `commands`
- รายงานเป็นตารางด้วย `/report-table`

### 6. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder

## Expected Outcome

- รายงานความเสถียรของ app ครอบคลุมทุกด้าน: stability, error handling, debuggability
- Crashes, errors, unhandled exceptions ถูกระบุ
- Error boundaries, recovery patterns, health checks ถูกประเมิน
- Debuggability gaps ถูกระบุและจัดลำดับ
- Review score ต่อ dimension และ overall
- Severity และ recommendations ชัดเจน
- ไม่ซ้ำซ้อนกับ review skills อื่น
