---
name: list-workspaces
description: แสดงรายการ workspaces ทั้งหมดใน monorepo พร้อม dependencies graph
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

แสดงรายการ workspaces ทั้งหมดใน monorepo เพื่อให้ user เห็นภาพรวมและ dependencies graph

## Scope

ใช้สำหรับ monorepo ที่มี workspaces หลาย packages

## Execute

### 1. Discover Workspaces

ค้นหา workspaces ทั้งหมดใน monorepo

1. อ่าน `package.json` ที่ root เพื่อดู workspaces configuration
2. ค้นหา `package.json` ในทุก workspace ตาม workspaces pattern
3. ระบุ workspace names และ paths
4. ตรวจสอบ workspaces ที่ไม่มี package.json (orphaned)

### 2. Analyze Dependencies

วิเคราะห์ dependencies ระหว่าง workspaces

1. อ่าน dependencies ของแต่ละ workspace
2. ระบุ workspace dependencies (workspace:*)
3. สร้าง dependency graph ระหว่าง workspaces
4. ระบุ circular dependencies ถ้ามี

### 3. Categorize Workspaces

จัดกลุ่ม workspaces ตามประเภท

1. จัดกลุ่มตาม directory structure (apps, packages, tooling)
2. จัดกลุ่มตาม purpose (cli, core, data, network, terminal)
3. ระบุ workspaces ที่เป็น libraries (no bin)
4. ระบุ workspaces ที่เป็น CLI tools (มี bin)

### 4. Identify Issues

ระบุปัญหาใน workspaces

1. ตรวจสอบ workspaces ที่ไม่มีใครใช้ (orphaned)
2. ตรวจสอบ workspaces ที่มี dependencies วงจร (circular)
3. ตรวจสอบ workspaces ที่มี version ไม่สอดคล้อง
4. ตรวจสอบ workspaces ที่ขาด dependencies ที่จำเป็น

## Rules

### 1. Workspace Discovery

ค้นหา workspaces อย่างถูกต้อง

- อ่าน workspaces configuration จาก root `package.json`
- ค้นหา `package.json` ในทุก workspace ตาม pattern
- ระบุ workspace names และ paths อย่างชัดเจน
- ตรวจสอบ workspaces ที่ไม่มี package.json

### 2. Dependency Analysis

วิเคราะห์ dependencies ระหว่าง workspaces

- ระบุ workspace dependencies (workspace:*)
- สร้าง dependency graph อย่างชัดเจน
- ระบุ circular dependencies ถ้ามี
- แสดง dependency depth และ levels

### 3. Categorization

จัดกลุ่ม workspaces อย่างเป็นระบบ

- จัดกลุ่มตาม directory structure
- จัดกลุ่มตาม purpose และ functionality
- ระบุ libraries และ CLI tools
- แยก production และ development workspaces

### 4. Issue Identification

ระบุปัญหาใน workspaces

- ตรวจสอบ orphaned workspaces
- ตรวจสอบ circular dependencies
- ตรวจสอบ version inconsistencies
- ตรวจสอบ missing dependencies

### 5. Report Formatting

จัดรูปแบบ output ตาม `/report-format-table`

1. กำหนด table structure ด้วย numbered columns (No, Name, Path, Type, Dependencies, Status)
2. ใช้ markdown table format มาตรฐานพร้อม headers ชัดเจน
3. ใช้ alignment ที่เหมาะสม (left สำหรับ text, right สำหรับ numbers)
4. ใช้ bold สำหรับ headers และ keywords สำคัญ
5. ใช้ backticks สำหรับ workspace names และ paths
6. ใช้ symbols (✅, ❌, ⚠️) สำหรับ status indicators
7. จัดกลุ่ม workspaces ตาม category (Apps, Packages, Tooling)
8. เรียงลำดับภายในกลุ่มตามความสำคัญ
9. ใช้ separators สำหรับแยกกลุ่มที่ชัดเจน
10. ตรวจสอบว่าตารางอ่านง่ายบนทุก device

## Expected Outcome

- User เห็นภาพรวม workspaces ทั้งหมดใน monorepo
- User เห็น dependency graph ระหว่าง workspaces
- User รู้ว่า workspace ไหน orphaned หรือมีปัญหา
- User สามารถจัดระเบียบ workspaces ได้อย่างมีประสิทธิภาพ
