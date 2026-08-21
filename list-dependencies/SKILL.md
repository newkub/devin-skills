---
name: list-dependencies
description: แสดงรายการ dependencies ทั้งหมดใน project พร้อมข้อมูลและการวิเคราะห์
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

แสดงรายการ dependencies ทั้งหมดใน project เพื่อให้ user เห็นภาพรวมและสามารถจัดการได้

## Scope

ใช้สำหรับทุก workspace ที่มี package manifest เช่น `package.json`, `Cargo.toml`, `pyproject.toml`

## Execute

### 1. Read Package Manifest

อ่าน package manifest เพื่อดู dependencies ทั้งหมด

1. อ่าน `package manifest` เช่น `package.json`, `Cargo.toml`, `pyproject.toml`
2. ระบุประเภท dependencies (dependencies, devDependencies, peerDependencies, optionalDependencies)
3. รวบรวม version ของแต่ละ dependency
4. ถ้าเป็น monorepo อ่านทุก workspace

### 2. Categorize Dependencies

จัดกลุ่ม dependencies ตาม purpose

1. จัดกลุ่มตามประเภท (framework, utilities, testing, linting, build tools)
2. จัดกลุ่มตาม source (npm, GitHub, local packages)
3. ระบุ dependencies ที่เป็น `workspace packages` ใน monorepo
4. แยก `production` และ `development` dependencies

### 3. Analyze Usage

วิเคราะห์การใช้งาน dependencies

1. ทำ `/check-unused-deps` เพื่อหา dependencies ที่ไม่ได้ใช้
2. ค้นหา dependencies ที่ซ้ำซ้อนหรือทำงานคล้ายกัน
3. ตรวจสอบ dependencies ที่มี security vulnerabilities
4. ดู dependencies ที่มี version เก่ากว่า latest

### 4. Suggest Improvements

แนะนำ improvements สำหรับ dependencies

1. ทำ `/use-lib-better` เพื่อเปรียบเทียบกับ alternatives
2. แนะนำ dependencies ที่ควร update
3. แนะนำ dependencies ที่ควรลบ
4. แนะนำ dependencies ที่ควรเปลี่ยนเป็น alternatives ที่ดีกว่า

## Rules

### 1. Manifest Reading

อ่าน package manifest อย่างถูกต้อง

- อ่านจาก `package.json`, `Cargo.toml`, `pyproject.toml` ตาม project type
- ระบุทุกประเภท dependencies (dependencies, devDependencies, peerDependencies, optionalDependencies)
- อ่านทุก workspace ใน monorepo
- รวบรวม version และ semver ranges

### 2. Categorization

จัดกลุ่ม dependencies อย่างเป็นระบบ

- จัดกลุ่มตาม purpose (framework, utilities, testing, linting, build tools)
- จัดกลุ่มตาม source (npm, GitHub, local packages)
- แยก `production` และ `development` dependencies
- ระบุ `workspace packages` ใน monorepo

### 3. Usage Analysis

วิเคราะห์การใช้งาน dependencies

- ใช้ `/check-unused-deps` เพื่อหา dependencies ที่ไม่ได้ใช้
- ตรวจสอบ dependencies ที่ซ้ำซ้อนหรือทำงานคล้ายกัน
- ตรวจสอบ security vulnerabilities ด้วย `/run-audit`
- ดู dependencies ที่มี version เก่ากว่า latest

### 4. Improvement Suggestions

แนะนำ improvements ที่เป็นประโยชน์

- ใช้ `/use-lib-better` เพื่อเปรียบเทียบกับ alternatives
- แนะนำ dependencies ที่ควร update ด้วย `/follow-taze`
- แนะนำ dependencies ที่ควรลบ
- แนะนำ dependencies ที่ควรเปลี่ยนเป็น alternatives ที่ดีกว่า

### 5. Report Formatting

จัดรูปแบบ output ตาม `/report-format-table`

1. กำหนด table structure ด้วย numbered columns (No, Name, Version, Type, Purpose, Status)
2. ใช้ markdown table format มาตรฐานพร้อม headers ชัดเจน
3. ใช้ alignment ที่เหมาะสม (left สำหรับ text, right สำหรับ version)
4. ใช้ bold สำหรับ headers และ keywords สำคัญ
5. ใช้ backticks สำหรับ package names และ versions
6. ใช้ symbols (✅, ❌, ⚠️) สำหรับ status indicators
7. จัดกลุ่ม dependencies ตาม category (Production, Development, Workspace)
8. เรียงลำดับภายในกลุ่มตามความสำคัญ
9. ใช้ separators สำหรับแยกกลุ่มที่ชัดเจน
10. ตรวจสอบว่าตารางอ่านง่ายบนทุก device

## Expected Outcome

- User เห็นภาพรวม dependencies ทั้งหมดใน project
- User รู้ว่า dependencies ไหนไม่ได้ใช้
- User รู้ว่า dependencies ไหนซ้ำซ้อน
- User รู้ alternatives ที่ดีกว่า
- User สามารถจัดการ dependencies ได้อย่างมีประสิทธิภาพ
