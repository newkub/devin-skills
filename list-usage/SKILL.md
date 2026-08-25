---
name: list-usage
description: แสดงรายการการใช้งาน dependencies, functions, exports ใน project
---

## Goal

แสดงรายการการใช้งาน dependencies, functions, exports ใน project เพื่อให้ user เห็นภาพรวม

## Scope

ใช้สำหรับทุก workspace เพื่อตรวจสอบการใช้งานของ dependencies, functions, exports

## Execute

### 1. Scan Codebase

> Goal: Scan Codebase

สแกน codebase เพื่อหาการใช้งาน

1. สแกน imports และ requires ในทุกไฟล์
2. สแกน function calls และ API usage
3. สแกน exports จาก package.json และ source files
4. สแกน dependencies จาก package.json

### 2. Analyze Dependencies Usage

> Goal: Analyze Dependencies Usage

วิเคราะห์การใช้งาน dependencies

1. ตรวจสอบ dependencies ที่ถูก import ใน code
2. ตรวจสอบ dependencies ที่ไม่ได้ใช้
3. ตรวจสอบ dependencies ที่ใช้แต่ไม่ได้ประกาศ
4. ตรวจสอบ dependencies ที่ใช้บางส่วนเท่านั้น (tree-shaking opportunity)

### 3. Analyze Functions Usage

> Goal: Analyze Functions Usage

วิเคราะห์การใช้งาน functions

1. ตรวจสอบ functions ที่ถูกเรียกใช้
2. ตรวจสอบ functions ที่ไม่ได้ใช้ (dead code)
3. ตรวจสอบ functions ที่ใช้ภายใน workspace เท่านั้น
4. ตรวจสอบ functions ที่ควร export แต่ยังไม่ได้

### 4. Analyze Exports Usage

> Goal: Analyze Exports Usage

วิเคราะห์การใช้งาน exports

1. ตรวจสอบ exports จาก package.json
2. ตรวจสอบ exports ที่ถูก import จาก workspaces อื่น
3. ตรวจสอบ exports ที่ไม่ได้ใช้
4. ตรวจสอบ exports ที่ขาดไป (missing exports)

## Rules

### 1. Codebase Scanning

สแกน codebase อย่างถูกต้อง

- สแกน imports และ requires ในทุกไฟล์
- สแกน function calls และ API usage
- สแกน exports จาก package.json และ source files
- สแกน dependencies จาก package.json

### 2. Dependencies Analysis

วิเคราะห์การใช้งาน dependencies

- ตรวจสอบ dependencies ที่ถูก import ใน code
- ตรวจสอบ dependencies ที่ไม่ได้ใช้
- ตรวจสอบ dependencies ที่ใช้แต่ไม่ได้ประกาศ
- ตรวจสอบ tree-shaking opportunities

### 3. Functions Analysis

วิเคราะห์การใช้งาน functions

- ตรวจสอบ functions ที่ถูกเรียกใช้
- ตรวจสอบ dead code
- ตรวจสอบ internal vs external usage
- ตรวจสอบ functions ที่ควร export

### 4. Exports Analysis

วิเคราะห์การใช้งาน exports

- ตรวจสอบ exports จาก package.json
- ตรวจสอบ cross-workspace imports
- ตรวจสอบ unused exports
- ตรวจสอบ missing exports

### 5. Report Formatting

จัดรูปแบบ output ตาม `/report-table`

1. กำหนด table structure ด้วย numbered columns (No, Name, Type, Usage, Status, Recommendation)
2. ใช้ markdown table format มาตรฐานพร้อม headers ชัดเจน
3. ใช้ alignment ที่เหมาะสม (left สำหรับ text, right สำหรับ numbers)
4. ใช้ bold สำหรับ headers และ keywords สำคัญ
5. ใช้ backticks สำหรับ names และ paths
6. ใช้ symbols (✅, ❌, ⚠️) สำหรับ status indicators
7. จัดกลุ่มตาม category (Dependencies, Functions, Exports)
8. เรียงลำดับภายในกลุ่มตามความสำคัญ
9. ใช้ separators สำหรับแยกกลุ่มที่ชัดเจน
10. ตรวจสอบว่าตารางอ่านง่ายบนทุก device

## Expected Outcome

- User เห็นภาพรวมการใช้งาน dependencies, functions, exports
- User รู้ว่า dependencies ไหนไม่ได้ใช้
- User รู้ว่า functions ไหนเป็น dead code
- User รู้ว่า exports ไหนไม่ได้ใช้
- User สามารถลบ code ที่ไม่ได้ใช้ได้อย่างมั่นใจ