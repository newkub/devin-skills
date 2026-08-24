---
name: check-code-structure
description: วิเคราะห์และปรับปรุง code structure ด้วย sg outline ครอบคลุม symbols, exports, members, และ cohesion
---

## Goal

วิเคราะห์และปรับปรุง code structure ระดับ micro ด้วย `sg outline` เพื่อแก้ไข top-level symbols, exports, members, SRP violations, และ cohesion issues

## Scope

ใช้กับ source code ที่ต้องการปรับปรุง code structure เช่น `src/` หรือ workspace ใด workspace หนึ่ง ครอบคลุม top-level symbols, exports, imports, members, และรูปแบบการจัดกลุ่มโค้ด

## Execute

### 1. Review And Inventory
> Goal: Review And Inventory

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure
2. ทำ `/update-rules` ถ้ามี `ast-grep` rules หรือ `.devin/rules` ที่เกี่ยวข้อง
3. ทำ `/use-ast-grep-outline` เพื่อเข้าใจวิธีใช้งาน `sg outline` และ options ที่มี
4. เลือก `sg outline` flags ตาม scope (ดู Rules section `sg outline Flags`)
5. ระบุ target paths ที่จะ improve
6. ถ้า `sg outline` ไม่พร้อมใช้ → stop และ report

### 2. Analyze Code Structure
> Goal: Analyze Code Structure

1. ทำ `/use-ast-grep-outline` เพื่อเลือก flags ที่เหมาะสมกับ scope
2. รัน `sg outline` ด้วย flags ที่เลือก:
   - `sg outline --view expanded --items structure <paths>` สำหรับ top-level symbols และ members
   - `sg outline --view signatures --items exports <paths>` สำหรับ exported surface
   - `sg outline --json compact --items all <paths>` สำหรับ structured aggregation
3. ใช้ `sg outline --items imports` ตรวจสอบการ import/export ระหว่าง modules
4. ถ้า scope ใหญ่ ใช้ `--type` หรือ `--match` ลด noise
5. ถ้า analyze ไม่ผ่าน → re-run ถ้าไม่ผ่านหลัง 3 ครั้ง → stop และ report

### 3. Identify Structure Issues
> Goal: Identify Structure Issues

Goal: ระบุ structure issues จาก `sg outline` output ก่อนเริ่มปรับปรุง

1. ตรวจสอบ top-level symbols ต่อไฟล์: เกิน 5 อาจมี mixed concerns
2. ตรวจสอบ members ต่อ type/class: เกิน 10 อาจ violate SRP
3. ตรวจสอบ exports ที่ไม่ควร public: internal utilities, helper types
4. ตรวจสอบ imports ที่ข้าม boundary หรือชั้น layer
5. ตรวจสอบ file ที่มี symbols จากหลาย domain หรือ layer ปนกัน
6. ใช้ `/use-ast-grep` สำหรับ patterns ที่ `sg outline` ไม่ครอบ เช่น God class
7. ถ้าต้อง review filesystem ด้วย ให้ทำ `/review-codebase` แยก
8. ถ้าต้อง review refactor opportunities ลึก ให้ทำ `/review-codebase` แยก

### 4. Validate Findings
> Goal: Validate Findings

1. ทำ `/validate` สำหรับ validate findings
2. จัดลำดับ severity: Critical → High → Medium → Low
3. ระบุ false positives ที่พบ
4. ถ้าไม่มี issues ที่ต้อง improve → stop และ report

### 5. Improve Code Structure
> Goal: Improve Code Structure

Goal reminder: ปรับปรุง code structure ตาม findings จาก Step 3

1. แยกไฟล์ที่มี top-level symbols เกิน 5 ออกเป็นไฟล์ย่อยตาม domain หรือ responsibility
2. ลด public members ใน type/class ที่เกิน 10 โดย extract ออกเป็น sub-type หรือ helper
3. ทำ `/follow-import-export` เพื่อจัดการ barrel exports และ import aliases — ซ่อน internal exports ที่ไม่ต้อง public, แทนที่ relative paths ที่ซับซ้อน
4. แก้ไข imports ที่ข้าม boundary หรือ layer
5. แยก file ที่มี symbols จากหลาย domain ออกจากกัน
6. ทำ `/rename` สำหรับ rename identifiers และ `/update-reference` หลังทุกการ split หรือ rename
7. ถ้าต้องปรับ physical structure ให้ทำ `/restructure`

### 6. Verify
> Goal: Verify

1. ทำ `/use-ast-grep-outline` เพื่อยืนยันการใช้งาน `sg outline` สำหรับ verify
2. รัน `sg outline --items structure <paths>` อีกครั้งเพื่อยืนยันว่า issues ถูกแก้ไข
3. รัน `sg outline --items exports <paths>` ตรวจสอบว่า public API ไม่เปลี่ยนโดยไม่ตั้งใจ
4. ทำ `/run-check` lint และ typecheck
5. ถ้า fail ให้ทำ `/resolve-errors`
6. ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 7. Report
> Goal: Report

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Structure Metrics: File, Top-Level Symbols, Exports, Public Members, Status
3. สร้างตาราง Improvements: File, Issue Type, Action Taken, Severity, Result
4. สร้างตาราง Recommended Actions: Priority, Action, Impact, Workflow
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Severity Classification

- Critical: circular import, cross-layer import, ไฟล์ที่มีหลาย domain ใน critical path, exported internal API ที่ทำให้ boundary แตก
- High: ไฟล์เกิน 5 top-level symbols ที่ไม่เกี่ยวข้องกัน, type/class เกิน 10 public members, ไฟล์ผิด layer
- Medium: ไฟล์มี 4-5 top-level symbols, type มี 6-10 members, exports ไม่สม่ำเสมอ
- Low: naming ไม่สะท้อน responsibility, รูปแบบ exports ไม่สม่ำเสมอ

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path, line number, หรือ symbol name จาก `sg outline`
- ใช้ `sg outline` เป็น primary evidence ไม่เดา
- ระบุ false positives

### 3. Review Before Improve

- วิเคราะห์และ validate findings ให้ครบก่อนเริ่ม improve
- ถ้าต้อง refactor ลึก ให้ทำ `/review-codebase` แยกก่อน improve
- แยก improvement process จาก review process อื่น เช่น `/review-codebase`

### 4. Follow Write Standards

- ทำ `/update-reference` หลังทุกการ split, rename, หรือย้ายไฟล์
- ใช้ `/rename` สำหรับ rename code identifiers ที่ไม่สะท้อน responsibility
- แต่ละไฟล์ไม่เกิน 250 บรรทัด
- แต่ละ function/type/class ทำหน้าที่เดียว
- ใช้ `sg outline` ยืนยัน structure หลัง improve

### 5. sg outline Flags

- `--view expanded` สำหรับ top-level symbols พร้อม members
- `--view signatures` สำหรับ signatures ของ top-level items
- `--view names` สำหรับ grouped names by symbol type
- `--items structure` สำหรับ top-level symbols ในไฟล์
- `--items exports` สำหรับ exported surface
- `--items imports` สำหรับ imports และ boundary crossing
- `--items all` สำหรับ imports และ exports รวมกัน
- `--json compact` สำหรับ structured output (เพิ่มเติม: `--json stream` สำหรับ one file per line)
- `--type class,interface,enum,function` สำหรับกรอง symbol types (LSP-compatible, lower camel case)
- `--match <regex>` สำหรับกรองชื่อ symbols (Rust regex, case-sensitive)
- `--pub-members` สำหรับดูเฉพาะ public members
- `--globs <pattern>` สำหรับกรองไฟล์ (match .gitignore globs, prefix `!` เพื่อ exclude)
- `--outline-rules <file>` สำหรับโหลด custom extraction rules
- `--no-default-outline-rules` สำหรับแทนที่ bundled extractors
- `--color auto|always|ansi|never` สำหรับควบคุม ANSI color
- `-c <config>` สำหรับระบุ sgconfig.yml path
- `--no-ignore hidden|dot|exclude|global|parent|vcs` สำหรับไม่ respect ignore files

### 6. Scope Boundaries

- ไม่ improve architecture ที่ `/review-codebase` ทำ
- ไม่ improve filesystem organization ที่ `/review-codebase` ทำ
- ไม่ refactor separation of concerns ลึกที่ `/refactor` ทำ
- focus ที่ code-level structure: symbols, exports, members, cohesion
- สำหรับ system-wide view ทำ `/review-codebase`

## Expected Outcome

- Code structure ถูกปรับปรุง: symbols ต่อไฟล์, exports, members, cohesion อยู่ในเกณฑ์
- รายงานตาราง Structure Metrics พร้อม status ก่อนและหลัง improve
- รายงาน Improvements พร้อม file, issue, action, severity, result
- รายงาน Recommended Actions พร้อม priority และ workflow
- ระบุ false positives ที่พบ
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
