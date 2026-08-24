---
name: review-bug-prone
description: Review bug-prone code patterns พร้อม review score และ actionable findings
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
  - suggest-next-action
  - validate
---

## Goal

Review รูปแบบโค้ดที่มีแนวโน้มก่อให้เกิด bugs ใน codebase ครอบคลุม null safety, control flow, arithmetic, mutable state, async/promise, parse/regex, และ resource cleanup พร้อมสร้างรายงานตารางและ review score

## Scope

bug-prone patterns ที่ยังไม่ถูกครอบคลุมโดย review workflows เฉพาะทาง:

- การเข้าถึงค่าที่อาจเป็น `null`/`undefined` โดยไม่มี fallback
- type assertions, `as`, `any`, unsafe narrowing
- non-exhaustive `switch`/`if-else` หรือ discriminated unions ที่ขาด case
- off-by-one, indexing, date/time arithmetic, floating-point, และ monetary calculation
- mutable shared state, side effects, global state
- floating promises, `await` ในเงื่อนไขที่ไม่เหมาะสม
- `JSON.parse`/`eval`/regex ที่ไม่ผ่าน validation
- ไม่ cleanup resources: event listeners, subscriptions, timers, intervals
- implicit assumptions, unsafe defaults
- ไม่ซ้ำกับ `/review-codebase` — ถ้าพบ issues ในหมวดนั้น ให้ส่งต่อไปยัง review workflow นั้น

## Execute

### 1. Prepare

สแกน codebase เพื่อเข้าใจโครงสร้างและระบุ bug-prone hotspots

> Goal: เข้าใจ project structure และ bug-prone patterns

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, tech stack และ source code ที่มีความเสี่ยง
2. ระบุภาษา, framework, และ patterns ที่เป็น bug-prone สำหรับ project นี้
3. ถ้าสแกนไม่ได้ → stop และ report

### 2. Deep Analyze

วิเคราะห์ bug-prone patterns อย่างลึกซึ้งด้วย scripts

> Goal: ครอบคลุมทุก bug-prone dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. Analyzer ตรวจสอบ `null`/`undefined` safety: unsafe access, optional chaining ไม่มี fallback, non-null assertions
6. Analyzer ตรวจสอบ type assertions, `as`, `any`, และ unsafe narrowing
7. Analyzer ตรวจสอบ exhaustive handling: `switch`/`if-else` ที่ไม่ครอบคลุมทุก case, missing default branch
8. Analyzer ตรวจสอบ arithmetic bugs: off-by-one, array indexing, date/time calculation, floating-point, monetary calculation
9. Analyzer ตรวจสอบ mutable shared state, global state, และ side effects ใน pure functions
10. Analyzer ตรวจสอบ async/promise bugs: floating promises, missing `await`, `Promise` ใน boolean expression
11. Analyzer ตรวจสอบ unsafe parse/regex: `JSON.parse` ไม่มี `try-catch`, unsafe `eval`, regex ที่ไม่ validated
12. Analyzer ตรวจสอบ resource cleanup: event listeners, subscriptions, timers, intervals ที่ไม่ถูก cleanup
13. Analyzer ตรวจสอบ implicit assumptions และ unsafe defaults
14. Review CLI คำนวณ bug-prone review score จาก review report
15. ถ้า review CLI ไม่ผ่าน → ทำ `/update-create-review-cli` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 3. Validate Findings

ตรวจสอบความถูกต้องของ findings ก่อน report

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 4. Report

สร้างรายงานผลการ review ในแชท

> Goal: รายงาน findings พร้อม review score และ actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Bug-Prone Metrics Summary: 8 metrics พร้อม count, threshold, status
3. สร้างตาราง Findings by Category: Category, Finding, Severity, Location, Recommendation
4. สร้างตาราง Recommended Actions: Priority, Action, Impact, Effort, Workflow
5. แสดง bug-prone review score พร้อม progress bar และ grade
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 5. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Severity Classification

- Critical: การเข้าถึง `null`/`undefined` ใน critical path, type assertion ที่ bypass type safety, floating promise ที่ lead to unhandled rejection, `JSON.parse`/`eval` ที่ไม่ผ่าน validation ใน critical path
- High: ขาด exhaustive handling, off-by-one ใน loop, unsafe default ใน critical path, missing resource cleanup ที่ก่อให้เกิด leak
- Medium: optional chaining ไม่มี fallback, regex ที่อันตราย, unsafe narrowing, implicit assumption ใน non-critical path
- Low: missing fallback, minor assumption, documentation gap

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification (`ast-grep`, `grep`, script analysis)
- ระบุ bug pattern ที่พบ และ recommended fix ที่ชัดเจน
- ระบุ false positives ที่พบ

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- แยก review process จาก fix process
- ถ้าต้องแก้ไข ให้ทำ `/resolve-errors` หลัง review

### 4. Health Score Formula

- 8 metrics หลัก:
  1. Null/Undefined Safety
  2. Type Assertions & Casting
  3. Exhaustive Control Flow
  4. Numeric/Date/Arithmetic Operations
  5. Mutable State & Side Effects
  6. Async Promise Handling
  7. Parse/Serialize/Regex Safety
  8. Resource Cleanup & Assumptions
- คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Review score = (total score / 8) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 5. Scope Boundaries

- ไม่ซ้ำกับ `/review-codebase` สำหรับ race condition, deadlock, parallel execution
- ไม่ซ้ำกับ `/review-codebase` สำหรับ error boundaries, error messages, graceful degradation
- ไม่ซ้ำกับ `/review-codebase` สำหรับ type design, hardcode, naming, readability
- ถ้าพบ issues ในหมวดเหล่านั้น ให้ส่งต่อไปยัง `/review-codebase`

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง Bug-Prone Metrics Summary พร้อม status indicators
- รายงาน Findings by Category พร้อม severity และ location
- รายงาน Recommended Actions พร้อม priority และ workflow
- Bug-prone review score พร้อม grade และ progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
