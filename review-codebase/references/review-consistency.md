---
name: review-consistency
description: Review ความสอดคล้องของ skill files ในด้าน structure, ภาษา, format, terminology และ references
related:
  - review-codebase
  - scan-codebase
  - validate
  - report-table
  - suggest-next-action

---


## Goal

Review ความสอดคล้องของ skill files ในเรื่อง structure, ภาษา, format, terminology และ references พร้อมรายงาน findings, severity และ review score

## Scope

ใช้สำหรับ review `SKILL.md` และไฟล์ใน skill directories (`guide/`, `references/`, `workflows/` ฯลฯ) ทั้งใน global skills และ project workspace

ไม่รวมการแก้ไขเนื้อหาเชิงลึกหรือ best practices (ใช้ `/improve-devin-skills`)

## Execute

### 1. Prepare And Scan

> Goal: รวบรวม skill files และบันทึก baseline สำหรับ review

1. ทำ `/scan-codebase` เพื่อรวบรวม skill files ทั้งหมด
2. อ่าน frontmatter ของแต่ละ `SKILL.md` และบันทึก patterns
3. ตรวจสอบ directory structure ของแต่ละ skill
4. ระบุ conventions ที่ใช้ร่วมกัน เช่น heading style, bullet language, backtick usage

### 2. Review Structure Consistency

> Goal: ตรวจสอบโครงสร้าง skill files

1. ตรวจสอบลำดับ sections (`## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`)
2. ตรวจสอบ frontmatter มี `name`, `description` และ `description` ไม่เกิน 100 ตัวอักษร
3. ตรวจสอบ Execute headings เป็น English Title Case และรายการภาษาไทย
4. ตรวจสอบไฟล์ไม่เกิน 250 บรรทัด
5. บันทึก findings พร้อม file path, line number และ evidence

### 3. Review Language And Terminology

> Goal: ตรวจสอบภาษาและคำศัพท์ให้สม่ำเสมอ

1. ตรวจสอบคำศัพท์สำคัญ (เช่น `skill`, `workflow`, `Execute`, `Rules`) ใช้สม่ำเสมอ
2. ตรวจสอบภาษาไทย/อังกฤษใน bullet points และ headings ตาม conventions
3. ตรวจสอบ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`
4. ตรวจสอบการใช้ parallel markers `∥` อยู่ใน Execute numbered list เท่านั้น
5. ระบุ inconsistency ที่พบพร้อม severity

### 4. Review Formatting And Style

> Goal: ตรวจสอบรูปแบบและ style ให้สม่ำเสมอ

1. ตรวจสอบ spacing, indentation, การเว้นบรรทัด
2. ตรวจสอบ file naming เป็น kebab-case
3. ตรวจสอบความยาว `description` ไม่เกิน 100 ตัวอักษร
4. ตรวจสอบ `related` references มีอยู่จริงและไม่มี unused
5. ประเมินความสอดคล้องของ formatting ข้าม skill

### 5. Validate Findings

> Goal: ตรวจสอบความถูกต้องของ findings

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives ที่พบและแยกออกจาก report หลัก

### 6. Rate And Report

> Goal: รายงานผล review พร้อม score และ action ถัดไป

1. คำนวณ review score จาก findings ที่ validate แล้ว
2. จัดลำดับตาม severity: Critical → High → Medium → Low
3. ทำ `/report-table` เพื่อรายงาน findings เป็น table
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี skill files ใน workspace → ข้าม review นี้
- ถ้าพบว่า skill เป็น project-specific เท่านั้น → ระบุ scope ชัดเจนใน report
- ถ้าต้องการแก้ไขเนื้อหาเชิงลึก → ใช้ `/improve-devin-skills` แทนการ review ใน scope นี้

### 2. Severity Classification

- Critical: frontmatter หาย, `name` ไม่ตรงกับ filename, section order ผิด, broken `related` references ที่กระทบ execution, `description` เกิน 100 ตัวอักษร
- High: section ขาดหรือลำดับผิด, file เกิน 250 บรรทัด, terminology ไม่สม่ำเสมอข้าม skill, kebab-case ไม่ถูกต้อง
- Medium: spacing ไม่สม่ำเสมอ, backtick ใช้ไม่สม่ำเสมอ, parallel marker `∥` อยู่นอก Execute list, `description` ไม่ชัดเจน
- Low: cosmetic formatting, minor wording inconsistency, optional `related` หาย

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ใช้ `grep`, `glob`, `/scan-codebase` ก่อนระบุ findings
- ไม่เดาว่ามี inconsistency โดยไม่มี evidence
- ระบุ expected convention กับ actual convention ที่พบ

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code หรือ skill files ระหว่าง review
- ไม่ apply fixes ภายใน review reference นี้
- ถ้าต้องการแก้ไข ให้ทำ `/resolve-errors` หรือ `/improve-devin-skills` หลัง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็น table ด้วย `/report-table`
- ใช้ heading levels สำหรับ structure
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`

## Expected Outcome

- รายงาน findings ของ consistency issues พร้อม file path, line number และ severity
- ระบุ inconsistencies ใน structure, language, format, terminology และ references
- ไม่มี broken `related` references หรือ unused references ที่พบ
- review score พร้อม grade และ progress bar
- รายงานเป็น table ผ่าน `/report-table`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
