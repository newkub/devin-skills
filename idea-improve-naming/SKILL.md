---
name: idea-improve-naming
description: สร้างตารางไอเดียปรับปรุง naming conventions ทั้ง code, API, database, files, CSS พร้อม
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related: []
---
## Goal

สร้างตารางไอเดียปรับปรุง naming conventions ทั้ง code, API, database, files, CSS พร้อม continuous numbering และ scope ที่ชัดเจน

## Scope

ใช้เมื่อผู้ใช้ต้องการไอเดียปรับปรุง naming ทั่ว codebase ครอบคลุม: variables, functions, files, components, types, API endpoints, database tables/columns, CSS classes, constants ไม่รวมการ implement (ใช้ `/review-codebase`)

## Execute

### 1. Analyze Current Naming
> Goal: Analyze Current Naming

วิเคราะห์ naming conventions ปัจจุบัน

1. ทำ `/deep-review` เพื่อวิเคราะห์ naming patterns และ inconsistencies
2. ระบุ naming categories ที่ต้องปรับปรุง: variables, functions, files, components, types, API, database, CSS, constants
3. ระบุ inconsistencies, abbreviations ที่สับสน, และชื่อที่ไม่สื่อความหมาย
4. บันทึก findings เป็น baseline สำหรับสร้างไอเดีย

### 2. Research Best Practices
> Goal: Research Best Practices

ค้นหา naming best practices สำหรับ tech stack ที่ใช้

1. ทำ `/follow-best-practice` สำหรับ naming conventions ของภาษาและ framework ที่ใช้
2. ศึกษา community conventions และ style guides
3. ระบุ domain-specific naming patterns ที่เหมาะสม
4. ระบุ framework-specific naming rules (เช่น SolidJS component naming, Drizzle table naming)

### 3. Generate Ideas
> Goal: Generate Ideas

สร้างไอเดียปรับปรุง naming ทั้ง Extends และ New

1. สร้างไอเดียปรับปรุง naming ที่มีอยู่ (Extends): เปลี่ยนชื่อให้ชัดเจนขึ้น, ทำให้สม่ำเสมอ, ลด abbreviations
2. สร้างไอเดีย naming conventions ใหม่ที่ยังไม่มี (New): เพิ่ม naming rules, สร้าง naming glossary, เพิ่ม automated naming checks
3. ระบุ problem ที่แต่ละไอเดียจะ solve (ความสับสน, inconsistency, อ่านยาก)
4. ระบุ naming category: variable, function, file, component, type, API, database, CSS, constant
5. จัดกลุ่มไอเดียตาม category

### 4. Prioritize And Present Results
> Goal: Prioritize And Present Results

จัดลำดับและรายงานในแชท

1. จัดลำดับตาม impact: API naming → database naming → component naming → function naming → variable naming → file naming → CSS naming
2. ทำ `/report` พร้อม `/report-table` เพื่อแสดงผลเป็นตาราง
3. สร้างตารางเดียวรวมทั้ง Extends และ New พร้อม continuous numbering
4. ใช้ impact indicators: 🔴 สูง, 🟡 ปานกลาง, 🟢 ต่ำ
5. ใช้ difficult indicators: 🔴 ยาก, 🟡 ปานกลาง, 🟢 ง่าย
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Single Table With Continuous Numbering

- ตารางเดียวรวมทั้ง Extends และ New naming improvements
- Continuous numbering เริ่มจาก 1 ไม่เกิน 40 row
- Type column ระบุ: Extends (ปรับปรุงจากเดิม) หรือ New (ใหม่)
- เรียงลำดับตาม Impact (🔴 สูง → 🟡 ปานกลาง → 🟢 ต่ำ)

### 2. Column Order

- ลำดับคอลัมน์: # | Impact | Naming Improvement | Description | Problem/Solves | How To | Category | Type | Difficult | Scope | Current | Proposed | Topics
- Description สั้นกระชับ ไม่เกิน 1 บรรทัด
- Problem/Solves ระบุปัญหาที่แก่ เช่น `ชื่อสับสน`, `inconsistent casing`
- How To ระบุวิธีทำสั้นๆ เช่น `rename via IDE refactoring`
- Category ระบุ: variable, function, file, component, type, API, database, CSS, constant
- Type ระบุ: Extends หรือ New
- Difficult ระบุ: 🔴 ยาก, 🟡 ปานกลาง, 🟢 ง่าย
- Impact ระบุ: 🔴 สูง, 🟡 ปานกลาง, 🟢 ต่ำ
- Scope ระบุ: file-level, module-level, package-level, app-level, cross-app
- Current ระบุชื่อปัจจุบัน (ถ้ามี) เช่น `usrData`, `get_data`
- Proposed ระบุชื่อที่เสนอ เช่น `userData`, `getData`
- Topics ระบุหัวข้อ เช่น casing, abbreviation, consistency, domain-language

### 3. Define Problem First

- ทุกไอเดียต้อง solve real naming problem
- ไม่เสนอการเปลี่ยนชื่อเพราะเท่ห์อย่างเดียว
- เปลี่ยนชื่อเมื่อชื่อปัจจุบันสับสน ไม่สื่อความหมาย หรือ inconsistent
- พิจารณา impact ของการเปลี่ยนชื่อต่อ codebase ทั้งหมด

### 4. Naming Categories

- Variable: camelCase, snake_case, PascalCase consistency
- Function: verb prefixes (get/fetch/load/retrieve), async naming, event handlers
- File: kebab-case, PascalCase, naming patterns per file type
- Component: PascalCase, descriptive names, prefix conventions
- Type: PascalCase, interface prefixes, type suffixes
- API: endpoint naming, plural vs singular, HTTP method usage
- Database: table naming, column naming, foreign key naming
- CSS: BEM, utility classes, CSS variables
- Constant: UPPER_SNAKE_CASE, camelCase for local

### 5. Research-Driven

- อ้างอิง official style guides ของภาษาและ framework
- ใช้ community conventions ที่ยอมรับกัน
- พิจารณา domain language ของโปรเจกต์
- ตรวจสอบว่า conventions สอดคล้องกับ linter rules

### 6. Non-Duplication

- ใช้ `/deep-review` สำหรับ analysis
- ใช้ `/review-codebase` สำหรับ implement naming improvements แบบครบวงจร
- ใช้ `/rename` สำหรับ rename code identifiers รายตัวที่ได้จากไอเดีย
- Workflow นี้เน้นเฉพาะการสร้างไอเดียและรายงาน

### 7. Output Format

- ใช้ markdown table สำหรับแสดง naming improvements
- ตารางเป็นภาษาไทยทั้งหมด
- ตอบกลับในแชทเท่านั้น ไม่สร้างไฟล์แยก

## Expected Outcome

- ตาราง naming improvements พร้อม continuous numbering ไม่เกิน 40 row
- แยกประเภท Extends และ New ในตารางเดียว
- ทุกไอเดียมี Current และ Proposed naming
- จัดลำดับตาม Impact (🔴 สูง → 🟡 ปานกลาง → 🟢 ต่ำ)
- ระบุ Category และ Scope ชัดเจน
- พร้อมสำหรับ `/review-codebase` เพื่อ implement naming improvements แบบครบวงจร
- พร้อมสำหรับ `/rename` เพื่อ rename code identifiers รายตัว
