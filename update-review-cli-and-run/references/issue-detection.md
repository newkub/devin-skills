# Issue Detection And Severity Criteria

## Purpose

เกณฑ์สำหรับตรวจจับ issues และจัดประเภท severity ของแต่ละ finding

## Review Criteria

### ความถูกต้อง

- logic, syntax, facts, หรือ content accuracy
- ตรวจสอบว่า implementation ตรงกับ requirements

### คุณภาพ

- readability, consistency, completeness
- การ follow best practices และ conventions

### ความเหมาะสม

- สอดคล้องกับ context, requirements, และ constraints
- เหมาะสมกับ scale และ usage pattern

## Pattern-Based Checks

ใช้ `grep` หรือ `ast-grep` สำหรับ pattern-based checks เมื่อเกี่ยวข้อง:

- ค้นหา anti-patterns ที่รู้จัก
- ตรวจสอบ convention compliance
- หา code smells ที่ซ้ำกัน

## Severity Levels

จัดประเภทความรุนแรงของแต่ละ finding:

- `Critical`: blocking, security risk, data loss, ผิดพื้นฐาน
- `High`: core functionality at risk, ผิดหลักการสำคัญ
- `Medium`: quality issue, minor gap, ไม่ follow best practice
- `Low`: cosmetic, naming, minor improvement

## Evidence Requirements

ทุก finding ต้องมี evidence:

- file path
- line number
- code snippet หรือ section
- อ้างอิง standards หรือ best practices ที่ตรวจสอบได้

ไม่เดา ใช้ tools สำหรับ verification เท่านั้น

## Root Cause Analysis

- ระบุ root cause ของแต่ละ finding ถ้าเป็นไปได้
- ระบุ false positives ที่พบ
- แต่ละ finding ต้อง map ไปยัง review workflow ที่เหมาะสม

## Recommendations

สำหรับทุก finding ให้ recommendation ที่:

- concrete และ actionable
- จัดลำดับตาม severity และ impact
- ระบุ quick wins และ strategic fixes
- ชี้ไปยัง `/resolve-errors` หรือ workflow ที่เกี่ยวข้อง ถ้าต้องแก้ไข
