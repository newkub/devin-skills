# Naming Convention Checks

รายการตรวจสอบ naming conventions สำหรับ code, API, database, files, CSS

## Naming Categories

### Variable

- camelCase, snake_case, PascalCase consistency ตามภาษา
- ไม่ใช้ abbreviations ที่สับสน เช่น `usrData` → `userData`
- ไม่ใช้ `data`, `temp`, `info` เป็นชื่อกำกวม
- ไม่ใช้ single-letter นอก loop

### Function

- ใช้ verb prefixes: `get`, `fetch`, `load`, `retrieve`
- async naming ชัดเจน
- event handlers มี prefix ที่สื่อความหมาย

### File

- kebab-case หรือ PascalCase ตาม convention ของ framework
- naming patterns สอดคล้องตาม file type
- ไม่ใช้ชื่อกำกวมข้ามไดเรกทอรี

### Component

- PascalCase
- descriptive names ที่สื่อหน้าที่
- prefix conventions สอดคล้องกัน

### Type

- PascalCase
- interface prefixes หรือ type suffixes ตาม convention
- ไม่ใช้ชื่อกำกวมกับ variable

### API

- endpoint naming ชัดเจน
- plural vs singular สอดคล้องกัน
- HTTP method usage ถูกต้องตาม semantics

### Database

- table naming สอดคล้องกัน (singular หรือ plural)
- column naming ชัดเจน สื่อประเภทข้อมูล
- foreign key naming มีรูปแบบสม่ำเสมอ

### CSS

- BEM หรือ utility classes ตาม convention ที่เลือก
- CSS variables มี naming pattern ชัดเจน
- ไม่ใช้ชื่อกำกวม เช่น `box`, `wrapper`

### Constant

- UPPER_SNAKE_CASE สำหรับ global constants
- camelCase สำหรับ local constants

## Idea Generation

### Extends (ปรับปรุงจากเดิม)

- เปลี่ยนชื่อให้ชัดเจนขึ้น
- ทำให้สม่ำเสมอตาม convention
- ลด abbreviations ที่สับสน

### New (เพิ่มใหม่)

- เพิ่ม naming rules ที่ยังไม่มี
- สร้าง naming glossary
- เพิ่ม automated naming checks ผ่าน linter

## Table Columns

ลำดับคอลัมน์สำหรับตาราง naming improvements:

`#` | `Impact` | `Naming Improvement` | `Description` | `Problem/Solves` | `How To` | `Category` | `Type` | `Difficult` | `Scope` | `Current` | `Proposed` | `Topics`

- `Impact`: 🔴 สูง, 🟡 ปานกลาง, 🟢 ต่ำ
- `Difficult`: 🔴 ยาก, 🟡 ปานกลาง, 🟢 ง่าย
- `Type`: `Extends` (ปรับปรุงจากเดิม) หรือ `New` (ใหม่)
- `Category`: variable, function, file, component, type, API, database, CSS, constant
- `Scope`: file-level, module-level, package-level, app-level, cross-app
- `Current`: ชื่อปัจจุบัน (ถ้ามี) เช่น `usrData`, `get_data`
- `Proposed`: ชื่อที่เสนอ เช่น `userData`, `getData`
- `Topics`: casing, abbreviation, consistency, domain-language

## Priority Order

จัดลำดับตาม impact: API naming → database naming → component naming → function naming → variable naming → file naming → CSS naming

## Research Sources

- official style guides ของภาษาและ framework
- community conventions ที่ยอมรับกัน
- domain language ของโปรเจกต์
- ตรวจสอบว่า conventions สอดคล้องกับ linter rules
