---
name: review-simplicity
description: Review simplicity ตรวจ over-engineering, YAGNI violations, premature optimization และ indirection
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
  - review-refactor
  - scan-codebase
  - deep-analyze
  - update-codebase-health-cli
  - run-health
  - deep-validate
  - validate
  - report-review
  - report-format-table
  - suggest-next-action
---

## Goal

Review simplicity ของ codebase ตรวจจับ over-engineering, unnecessary abstractions, YAGNI violations, premature optimization, และ indirection layers ที่เพิ่ม complexity โดยไม่จำเป็น

## Scope

รวม: over-engineering patterns, unnecessary abstractions (interfaces ที่มี implementor เดียว, generic ที่ใช้กับ type เดียว, wrapper classes ที่ไม่เพิ่ม value), YAGNI violations (features ที่ยังไม่ได้ใช้, config options ที่ไม่มี consumer, extension points ที่ไม่มี extension), premature optimization (micro-optimizations ก่อน measure, cache ที่ไม่จำเป็น, complex algorithms แทน simple), unnecessary indirection (proxy layers, adapter ที่ adapt แค่ตัวเอง, pass-through functions), dead abstractions (base classes ที่มี subclass เดียว, strategy pattern ที่มี strategy เดียว), และ configuration complexity (config ที่ไม่จำเป็น, environment-specific code ที่ไม่ได้ใช้) — ไม่รวม `review-refactor` ที่ focus ที่ SRP, duplication, coupling

## Execute

### 1. Prepare

สแกน codebase เพื่อเข้าใจโครงสร้างและระบุ simplicity patterns

> Goal: เข้าใจ project structure และระบุ tools สำหรับตรวจจับ over-engineering

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, dependencies, และ codebase size
2. ระบุ tools ที่มี: `knip` สำหรับ unused exports, `ast-grep` สำหรับ pattern detection, `madge` สำหรับ dependency graph
3. ถ้าสแกนไม่ได้ → stop และ report

### 2. Deep Analyze

วิเคราะห์ simplicity issues อย่างลึกซึ้งด้วย rules และ scripts

> Goal: ครอบคลุมทุก simplicity dimension พร้อม health score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-codebase-health-cli` เพื่อให้ analyzers ครอบคลุม simplicity categories ล่าสุด
3. รัน `bun --filter @booking/tools-health health:json` เพื่อดึง health report พร้อม metrics
4. ทำ `/run-health` เพื่อรัน health CLI และดึง metrics ล่าสุด
5. Analyzer ตรวจจับ unnecessary abstractions: interfaces ที่มี implementor เดียว, abstract classes ที่มี subclass เดียว, generic functions ที่ใช้กับ type เดียว, wrapper classes ที่ไม่เพิ่ม value
6. Analyzer ตรวจจับ YAGNI violations: unused config options, unused parameters, unused exports ด้วย `knip`, extension points ที่ไม่มี extension, features ที่ปิดอยู่หรือไม่ได้ใช้
7. Analyzer ตรวจจับ premature optimization: cache ก่อน measure, complex algorithms แทน simple, micro-optimizations ที่ไม่จำเป็น, manual inlining, bit manipulation แทน readable code
8. Analyzer ตรวจจับ unnecessary indirection: proxy layers ที่ไม่เพิ่ม behavior, adapter classes ที่ adapt แค่ตัวเอง, pass-through functions ที่เรียก function เดียว, delegation chains ที่ยาวเกินจำเป็น
9. Analyzer ตรวจจับ dead abstractions: base classes ที่มี subclass เดียว, strategy pattern ที่มี strategy เดียว, factory ที่สร้าง object ประเภทเดียว, builder ที่ไม่จำเป็น
10. Analyzer ตรวจจับ configuration complexity: config ที่ไม่จำเป็น, environment-specific code ที่ไม่ได้ใช้, feature flags ที่ไม่มี consumer, over-configurable components
11. Analyzer ตรวจจับ over-generic code: functions ที่รับ `any` หรือ `unknown` โดยไม่จำเป็น, generic ที่ซับซ้อนเกินไป, utility functions ที่ไม่ได้ใช้
12. Health CLI คำนวณ simplicity health score จาก health report
13. ถ้า health CLI ไม่ผ่าน → ทำ `/update-codebase-health-cli` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 3. Validate Findings

ตรวจสอบความถูกต้องของ findings ก่อน report

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives ที่พบ — ตรวจสอบว่า abstraction จำเป็นจริง เช่น มี multiple implementors ในอนาคต, เป็น public API, หรือเป็น extension point ที่ documented
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 4. Rate Severity And Health Score

ให้คะแนน severity และคำนวณ health score

> Goal: ผู้ใช้รู้ลำดับความสำคัญและสถานะ overall simplicity

1. ให้ severity: Critical, High, Medium, Low, Info
2. Critical: over-engineering ที่ทำให้ code อ่านไม่ได้หรือ maintain ไม่ได้
3. High: unnecessary abstractions ที่เพิ่ม complexity อย่างมีนัยสำคัญ
4. Medium: YAGNI violations ที่เพิ่ม code โดยไม่จำเป็น
5. Low: minor indirection หรือ minor premature optimization
6. Info: patterns ที่อาจเป็น over-engineering แต่ยังไม่ชัด
7. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average

### 5. Report

รายงานผลและแนะนำ actions

> Goal: ผู้ใช้รู้ว่าต้องทำอะไรก่อน พร้อม estimated effort

1. สำหรับแต่ละ finding → แนะนำ simplification: remove abstraction, inline function, delete dead code, simplify config
2. จัดกลุ่ม recommendations: immediate (delete dead code), short-term (inline unnecessary abstractions), long-term (simplify architecture)
3. ระบุ estimated effort สำหรับแต่ละ action
4. ทำ `/report-review`, ทำ `/report-format-table` สำหรับ summary
5. ทำ `/suggest-next-action`

## Rules

### 1. Objectivity

- ให้คะแนนตาม criteria ที่กำหนด ไม่ตามความชอบส่วนตัว
- ระบุ evidence ทุก finding — file, line, code snippet
- ถ้าไม่แน่ใจว่า abstraction จำเป็นหรือไม่ → ระบุระดับความไม่แน่นอน

### 2. Actionable

- ทุก finding ต้องมี recommendation ที่ concrete
- ถ้า recommendation คือ "remove abstraction" → ระบุว่า inline ยังไง
- ถ้า abstraction จำเป็นจริง → ระบุเหตุผลและ mark เป็น Info

### 3. Balance

- รายงานทั้ง strengths (simple patterns ที่ดี) และ weaknesses
- ไม่ตรวจทุก abstraction เป็น over-engineering — ตรวจเฉพาะที่ไม่จำเป็นจริง
- ชื่นชม simple, readable code

### 4. Scope

- ไม่ review นอก scope ที่กำหนด
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น
- ถ้า issue ซ้อนทับกับ `review-refactor` → อ้างอิง ไม่ duplicate

### 5. Evidence Quality

- แต่ละ finding ต้องมี: file path, line number, code snippet และคำอธิบายว่าทำไมเป็น over-engineering
- ตรวจสอบ consumers ของ abstraction ก่อน report — ถ้ามี multiple consumers → ไม่ใช่ over-engineering
- ห้าม report โดยไม่มี evidence หรืออ้างอิงจากความจำเพียงอย่างเดียว

### 6. Health Score

- คำนวณ health score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 7. Formatting

- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- Review report พร้อม severity ratings, health score, และ simplification recommendations
- ผู้ใช้รู้ลำดับการแก้ไขและ estimated effort
- ทุก finding มี evidence และ actionable simplification
- Health score ต่อ dimension และ overall
