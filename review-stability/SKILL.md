---
name: review-stability
description: Review app stability, error handling, debuggability ครอบคลุม crashes, recovery, monitoring, score
---

## Goal

Review ความเสถียรของ application ครอบคลุม crashes, error handling, debuggability, recovery, monitoring พร้อม review score

## Scope

ใช้สำหรับ review ความเสถียรของ app ครอบคลุม 3 ด้าน:
- `app-stability`: crashes, error boundaries, recovery, monitoring, health checks, graceful degradation
- `debugging`: logging context, error messages clarity, naming conventions, code complexity, debuggability score
- `error-handling`: try-catch, unhandled rejections, error messages, error codes, error classification, recovery

ไม่รวมการ fix (ใช้ `/review-codebase-everything` สำหรับ fix)

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ stability, error handling, debuggability ปัจจุบันของ codebase

1. ทำ `/scan-codebase` เพื่อหา error handling, logging, monitoring, health checks
2. ระบุ error handling framework, error boundary patterns, error logging service, error monitoring (Sentry, Bugsnag) ที่ใช้
3. ตรวจสอบ logging statements, error messages, naming conventions, code complexity และ nesting
4. ระบุ files ที่เกี่ยวข้องกับ top-level error boundaries หรือ crash handlers
5. ค้นหา patterns: try-catch, unhandled rejections, global error handlers, memory leaks, infinite loops

### 2. Deep Analyze

> Goal: ครอบคลุมทุก stability dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ stability, error handling, debuggability patterns
2. ทำ `/update-create-review-cli` — เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. App Stability Review

> Goal: app ไม่ crash ทั้งหมดเมื่อส่วนใดส่วนหนึ่งพัง

1. ตรวจสอบ React Error Boundaries, Vue error handlers, หรือ framework equivalent
2. ระบุ components หรือ modules ที่ไม่มี error boundary
3. ตรวจสอบ graceful fallback UI เมื่อ error
4. ตรวจสอบ process-level crash handlers สำหรับ backend/CLI
5. ค้นหา health check endpoints: `/health`, `/ready`, `/live`
6. ตรวจสอบว่า health checks ตรวจ dependencies จริง เช่น database, queue
7. ระบุ health checks ที่ dummy หรือไม่ตรวจอะไร
8. ตรวจสอบ startup/shutdown hooks

### 4. Error Handling Review

> Goal: errors ถูกจัดการอย่างถูกต้อง ครอบคลุมทุก dimension

1. ตรวจสอบ error boundaries: coverage, fallback UI, recovery, logging, nested boundaries
2. ตรวจสอบ try-catch coverage: async operations, external calls, critical functions, catch block quality
3. ตรวจสอบ unhandled rejections: handler, floating promises, promise chain error propagation
4. ตรวจสอบ error classification: types (network, validation, auth, server, client), hierarchy, custom classes
5. ตรวจสอบ error messages: user-friendly, actionable, localized, clarity, specificity, no technical jargon
6. ตรวจสอบ error codes: system, uniqueness, documentation, API response, mapping to user messages
7. ตรวจสอบ graceful degradation: fallback UI, partial functionality, cached data fallback, offline mode
8. ตรวจสอบ error recovery: retry, state recovery, error boundary reset, form data preservation
9. ตรวจสอบ error logging: completeness, context (stack, user, request), PII scrubbing, log level, structured logging
10. ตรวจสอบ error monitoring: integration, alerting, rate thresholds, grouping, dashboard, trend tracking
11. จัด severity ตาม `## Rules` section Severity Classification

### 5. Debuggability Review

> Goal: รู้ว่า logging, error messages, naming, complexity เหมาะสมหรือไม่

1. ตรวจสอบ logging มี context ครบถ้วน และใช้ structured logging
2. ตรวจสอบ log levels ที่เหมาะสม (debug, info, warn, error) และ timestamps, correlation IDs
3. ระบุ logging ที่ซ้ำซ้อน
4. ตรวจสอบ error messages ชัดเจน เป็นประโยค ระบุสาเหตุและวิธีแก้ไข ใช้ typed error classes
5. ระบุ generic error messages ที่ไม่มีประโยชน์
6. ตรวจสอบ naming บ่งบอกถึง purpose, verbs สำหรับ functions, nouns สำหรับ variables และ types
7. ตรวจสอบ abbreviations ที่ไม่ชัดเจน
8. ตรวจสอบ nesting levels สูงสุด 3 levels, functions ที่ยาวกว่า 50 บรรทัด
9. ตรวจสอบ early returns และ guard clauses

### 6. Recovery And Degradation Review

> Goal: ระบบพังบางส่วนได้โดยไม่หยุดทำงานทั้งหมด

1. ค้นหา retry, circuit breaker, fallback patterns
2. ตรวจสอบ timeout และ backoff strategies
3. ระบุ dependencies ที่ไม่มี fallback
4. ตรวจสอบ queue, dead letter queue, และ error recovery workers

### 7. Check Related Workflows

> Goal: ไม่ซ้ำซ้อนกับ review skills อื่น

1. ทำ `/consider-use-in-another-skills` เพื่อหา skills ที่เกี่ยวข้อง
2. ถ้าพบ performance issues ให้ทำ `/review-codebase-everything`
3. ถ้าพบ concurrency issues ให้ทำ `/review-codebase-everything`
4. ถ้าพบ security issues ให้ทำ `/review-codebase-everything`
5. ใช้ `/report-table` เพื่อจัดรูปแบบผลลัพธ์

### 8. Validate, Score And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง พร้อม review score

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score ตาม `references/scoring.md`
5. ทำ `/report` พร้อม `/report-table` กำหนด columns: `No`, `Category`, `Issue`, `Severity`, `Location`, `Recommendation`
6. จัดกลุ่มตาม category: Crashes, Errors, Debuggability, Monitoring, Recovery, Health
7. ทำ `/suggest-next-action`

## Rules

### 1. Scope Boundary

- เน้นความเสถียรของ app โดยรวม ไม่ใช่แค่ app crash
- ไม่ซ้ำกับ `/review-codebase-everything` ใช้ workflows เหล่านั้นแทนการเขียนซ้ำ
- รายละเอียด debugging principles อยู่ใน `/follow-debugging` แล้ว
- workflow นี้เป็น review เท่านั้น ไม่ fix

### 2. Skip Conditions

- ถ้า project ไม่มี error boundaries → ข้าม Step 4 item 1
- ถ้า project ไม่มี error monitoring → ข้าม Step 4 item 10
- ถ้า project ไม่มี async operations → ข้าม Step 4 item 3

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
