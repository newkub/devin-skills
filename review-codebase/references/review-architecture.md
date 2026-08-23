---
name: review-architecture
description: Review architecture ครอบคลุม patterns, boundaries, coupling, design principles, design pattern correctness, anti-patterns, และ pattern appropriateness
---

## Goal

Review architecture ระดับ macro ครอบคลุม design patterns, module boundaries, dependency directions, coupling, SOLID principles, design pattern correctness, anti-patterns, และ pattern appropriateness

## Scope

architectural patterns, module boundaries, dependency directions, SOLID principles, scalability, concurrency, multi-tenancy, queue architecture, routing, side effects, creational patterns (Factory, Builder, Singleton, Prototype), structural patterns (Adapter, Decorator, Facade, Proxy, Composite), behavioral patterns (Strategy, Observer, Command, Iterator, State), functional patterns (composition over inheritance, pure functions, immutability), anti-patterns (God object, singleton abuse, factory overuse, callback hell, premature abstraction), และ pattern appropriateness

## Execute

### 1. Prepare

สแกน codebase เพื่อเข้าใจ architecture ปัจจุบัน

> Goal: เข้าใจ architecture และ patterns ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ architecture
2. ระบุ architectural patterns ที่ใช้
3. ถ้าสแกนไม่ได้ → stop และ report

### 2. Deep Analyze

วิเคราะห์ architecture อย่างลึกซึ้งด้วย scripts

> Goal: ครอบคลุมทุก architecture dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. Analyzer ตรวจสอบ:
   - Module boundaries และ import directions
   - Dependency graph และ circular dependencies
   - SOLID principles
   - Scalability และ concurrency issues
6. Analyzer ตรวจสอบ creational patterns: Singleton abuse, Factory ที่ไม่จำเป็น, Builder ที่ over-engineer
7. Analyzer ตรวจสอบ structural patterns: Adapter ที่ไม่จำเป็น, Decorator chain ยาวเกินไป, Facade ที่ซ่อน complexity มากเกินไป
8. Analyzer ตรวจสอบ behavioral patterns: Strategy ที่ไม่มี shared interface, Observer ที่ไม่ cleanup, Command ที่ไม่ support undo
9. Analyzer ตรวจสอบ anti-patterns: God object, singleton abuse, callback hell, premature abstraction, magic numbers ใน pattern logic
10. Analyzer ตรวจสอบ pattern appropriateness: pattern ที่ over-engineer สำหรับ use case ง่าย หรือ under-engineer สำหรับ use case ซับซ้อน
11. Analyzer ตรวจสอบ functional patterns: composition over inheritance, pure functions, immutability ที่ควรใช้แทน OOP patterns
12. Review CLI คำนวณ architecture review score จาก review report
13. ถ้า review CLI ไม่ผ่าน → ทำ `/update-create-review-cli` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 3. Validate Findings

ตรวจสอบความถูกต้องของ findings ก่อน report

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับการ validate ตาม severity
4. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 4. Report

รายงานผลการ review ในแชท

> Goal: รายงาน findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง findings: Category, Finding, Severity, Location, Recommendation
3. จัดกลุ่ม findings ตาม category และเรียงตาม severity
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 5. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Severity Classification

- Critical: broken architecture, circular dependency ระหว่าง modules, God object ที่ทำทุกอย่าง, Singleton abuse ที่ทำให้ test ไม่ได้, anti-pattern ใน critical path ที่ก่อน bugs
- High: violated SOLID principle, tight coupling, pattern ที่ใช้ผิด intent, Factory overuse ในที่ไม่จำเป็น, Observer ที่ไม่ cleanup ทำให้ memory leak, premature abstraction
- Medium: inconsistent pattern, missing abstraction, Decorator chain ยาวเกินไป, Facade ที่ซ่อน complexity มากเกินไป, pattern ที่ over-engineer สำหรับ use case ง่าย
- Low: minor pattern improvement, pattern ที่สามารถ simplify ได้, cosmetic

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ false positives ที่พบ

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ใช้ `/review-codebase` สำหรับระบุ issues ใน code
- แยก review process จาก fix process

### 4. Scope Boundaries

- ไม่ review code-level structure (symbols, exports, members) ที่ `/check-code-structure` ทำ
- ไม่ review filesystem organization ที่ `/check-code-structure` ทำ
- ไม่ review refactor opportunities ลึกที่ `/review-codebase` ทำ
- focus ที่ system-level: patterns, boundaries, coupling, SOLID, scalability, design pattern correctness และ appropriateness
- สำหรับ drill-down ระดับไฟล์ ทำ `/check-code-structure`

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง findings พร้อม severity และ location
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
