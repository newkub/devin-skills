---
name: convert-to-json
description: แปลง CSV, YAML, TOML, หรือ text ไปยัง JSON
---

## Goal

แปลงข้อมูลจากรูปแบบอื่น (CSV, YAML, TOML, text) ไปยัง JSON format ที่ machine-readable

## Scope

ใช้สำหรับแปลง structured data จาก file หรือ text เป้น JSON สำหรับ API, config, หรือ processing

## Execute

### 1. Analyze Input

> Goal: ระบุ input type

1. ระบุ input: `csv`, `yaml`, `toml`, `text`, `markdown table`
2. ถ้า input ไม่ชัด → ถาม user
3. อ่านข้อมูลจาก file หรือ chat

### 2. Parse Input

> Goal: แปลง input เป้น data structure

1. CSV: ใช้ header เป้น keys, แต่ละ row เป้น object
2. YAML/TOML: parse ด้วย library เช่น `js-yaml`, `@iarna/toml`
3. Text ทั่วไป: ระบุ delimiter หรือ pattern
4. Markdown table: แปลงแถวเป้น objects

### 3. Convert To JSON

> Goal: สร้าง JSON output

1. จัดโครงสร้างข้อมูลเป้น object หรือ array
2. ใช้ `JSON.stringify(data, null, 2)` สำหรับ pretty print
3. ตรวจสอบ type consistency
4. ถ้ามี nested data → ใช้ arrays/objects ซ้อน

### 4. Validate

> Goal: ตรวจสอบ JSON

1. รัน `JSON.parse` เพื่อ verify syntax
2. ตรวจสอบว่า keys ครบและไม่มี missing
3. ตรวจสอบ data types
4. ถ้าไม่ถูกต้อง → กลับไป Step 2

### 5. Output

> Goal: ส่งมอบ JSON

1. ถ้าต้องการไฟล์ → ใช้ `write` หรือ `create-files-in-temp`
2. ถ้าต้องการแสดง → ใช้ code block `json`
3. ระบุ schema ถ้ามี

## Rules

### 1. Valid JSON

- keys ใช้ double quotes
- ไม่มี trailing commas
- strings escape ถูกต้อง

### 2. Structure

- arrays สำหรับ list of objects
- objects สำหรับ key-value
- ใช้ consistent naming convention

### 3. Type Safety

- numbers ไม่ต้องมี quotes
- booleans ใช้ `true`/`false`
- null ใช้ `null`
- ไม่ใช้ `undefined` เพราะ JSON ไม่รองรับ

## Expected Outcome

- JSON ที่ valid และ well-structured
- ข้อมูลครบถ้วนตาม input
- พร้อมใช้งานใน API หรือ config
