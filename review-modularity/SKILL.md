---
name: review-modularity
description: Review modularity ครอบคลุม module boundaries, cohesion, coupling, and responsibilities
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

Review modularity ของ project ครอบคลุม module boundaries, cohesion, coupling, single responsibility, และ modularity best practices พร้อม review score และ actionable findings

## Scope

modularity review สำหรับ: module boundaries (public API, encapsulation, export granularity, layer boundaries), cohesion (single responsibility, relatedness of module members, functional cohesion, feature cohesion), coupling (dependency direction, circular dependencies, fan-in/fan-out, tight vs loose coupling, dependency inversion, stable dependencies principle), modularity patterns (barrel exports, feature-based folders, vertical slices, package by feature), module size and complexity, cross-module communication, shared abstractions, and dependency rules

## Execute

### 1. Prepare

สแกน codebase เพื่อเข้าใจ module structure

> Goal: เข้าใจ project structure, module layout, และ dependency graph

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ module layout
2. รัน `madge` เพื่อสร้าง dependency graph และหา circular dependencies
3. ระบุ module boundaries ตาม folder structure, package boundaries, หรือ layer boundaries
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Deep Analyze

วิเคราะห์ modularity อย่างลึกซึ้งด้วย scripts

> Goal: ครอบคลุมทุก modularity dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม modularity categories ล่าสุด
3. รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. Analyzer ตรวจสอบ module boundaries: unclear public API, leaky encapsulation, over-exposed internals, missing boundaries ระหว่าง layers
6. Analyzer ตรวจสอบ cohesion: modules ที่มีหลาย responsibility, mixed concerns, low-feature cohesion, God modules
7. Analyzer ตรวจสอบ coupling: tight coupling, circular dependencies, high fan-in/fan-out, wrong dependency direction, violations of stable dependencies principle
8. Analyzer ตรวจสอบ modularity patterns: barrel exports, feature-based folders, vertical slices, package-by-feature consistency
9. Analyzer ตรวจสอบ module size: files เกิน 250 บรรทัด, modules ที่รวมหลาย feature
10. Review CLI คำนวณ modularity review score จาก review report
11. ถ้า review CLI ไม่ผ่าน → ทำ `/update-create-review-cli` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 3. Review Checklist

ตรวจสอบ modularity ด้วย checklist สำหรับ boundaries, cohesion, coupling

> Goal: ระบุ findings ที่เกี่ยวข้องกับ modularity อย่างเป็นระบบ

#### Module Boundaries
- แต่ละ module มี public API ชัดเจนและเก็บ implementation details ไว้ภายใน
- ไม่มี internal symbols ถูก import โดย module อื่น
- layer boundaries (presentation, domain, data, infrastructure) ไม่มี bypass
- exports ไม่ over-granular หรือ over-exposed
- barrel exports ไม่ซ่อน circular dependencies

#### Cohesion
- แต่ละ module มี single responsibility หรือ single reason to change
- members ใน module เกี่ยวข้องกับ feature หรือ function เดียวกัน
- ไม่มี God module ที่รวม concerns ต่างกัน
- feature-based folders หรือ vertical slices จัดกลุ่ม code ตาม feature
- shared utilities แยกออกจาก business modules

#### Coupling
- dependencies ระหว่าง modules มีทิศทางชัดเจนและสอดคล้องกับ architecture
- ไม่มี circular dependencies ระหว่าง modules
- fan-in/fan-out อยู่ในระดับที่ยอมรับได้
- high-level modules ไม่ขึ้นกับ low-level modules โดยตรง (dependency inversion)
- ใช้ abstractions/interfaces สำหรับ dependencies ระหว่าง modules เมื่อเหมาะสม

### 4. Validate Findings

ตรวจสอบความถูกต้องของ findings ก่อน report

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 5. Report

รายงานผลการ review ในแชท

> Goal: รายงาน findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Modularity Metrics Summary: boundaries, cohesion, coupling, circular dependencies, module size, score
3. สร้างตาราง Findings by Category: Category, Finding, Severity, Location, Recommendation
4. สร้างตาราง Recommended Actions: Priority, Action, Impact, Effort, Workflow
5. แสดง modularity review score พร้อม progress bar และ grade
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 6. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Severity Classification

- Critical: circular dependency ระหว่าง core modules, God module ที่รวมทุก concern, public API ที่ leak internal state, layer boundary bypass ใน critical path
- High: tight coupling ระหว่าง modules, SRP violation ใน module หลัก, missing dependency inversion, high fan-in/fan-out ที่ก่อให้เกิด fragility
- Medium: mixed concerns ใน module, unclear public API, moderate circular dependency, inconsistent modularity patterns
- Low: minor export granularity issue, naming, cosmetic improvement, missing barrel export

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification (`madge`, `knip`, `ast-grep`)
- ระบุ false positives ที่พบ

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ใช้ `/review-codebase` สำหรับระบุ issues ใน code
- แยก review process จาก improvement process
- ถ้าต้องปรับปรุง modularity ให้ทำ `/improve-modularity` หลัง review

### 4. Health Score Formula

- 5 metrics หลัก: module boundaries, cohesion, coupling, circular dependencies, module size
- คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Review score = (total score / 5) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง Modularity Metrics Summary พร้อม status indicators
- รายงาน Findings by Category พร้อม severity และ location
- รายงาน Recommended Actions พร้อม priority และ workflow
- Modularity review score พร้อม grade และ progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

