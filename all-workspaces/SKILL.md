---
name: all-workspaces
description: ทำงานกับทุก workspace ใน monorepo จนครบถ้วน
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

ทำงานกับทุก workspace ใน monorepo อย่างเป็นระบบ

## Scope

ใช้สำหรับทำงานกับทุก workspace ใน monorepo ตามลำดับที่เหมาะสม

## Execute

### 1. Discover Workspaces
> Goal: Discover Workspaces

ค้นหาและระบุ workspaces ทั้งหมดใน monorepo

1. ทำ `/analyze-project` เพื่อดู workspace configuration ทั้งหมด
2. อ่าน package manifest เพื่อดูว่ามี workspace อะไรบ้าง
3. จัดลำดับ workspaces ตามความสำคัญ (foundation packages ก่อน, applications ทีหลัง)

### 2. Process Each Workspace
> Goal: Process Each Workspace

ทำงานกับแต่ละ workspace ตามลำดับ

1. ทำงานกับ workspaces ที่เป็น foundation ก่อน (shared packages, utilities)
2. ทำงานกับ workspaces ที่มี dependencies ซับซ้อนทีหลัง
3. หลีกเลี่ยง circular dependencies ระหว่าง workspaces

### 3. Verify Completion
> Goal: Verify Completion

ตรวจสอบว่าทุก workspace ได้รับการประมวลผลครบถ้วน

1. ทำ `/validate` เพื่อตรวจสอบความถูกต้อง
2. ตรวจสอบว่าไม่มี workspace ที่ถูกข้าม
3. ตรวจสอบว่าไม่มี workspace ที่มีปัญหาค้างคา

## Rules

### 1. Workspace Processing Order

จัดลำดับการประมวลผลตามความสำคัญ

- ทำ workspaces ที่เป็น foundation ก่อน (shared packages, utilities)
- ทำ workspaces ที่มี dependencies ซับซ้อนทีหลัง
- หลีกเลี่ยง circular dependencies ระหว่าง workspaces

### 2. Error Handling

จัดการข้อผิดพลาดอย่างเป็นระบบ

- บันทึก workspaces ที่มีปัญหาไว้ตรวจสอบ
- ทำ `/resolve-errors` เพื่อแก้ไขปัญหาใน workspaces
- ตรวจสอบว่าการประมวลผลไม่ทำให้เกิดปัญหาใหม่

### 3. Batch Operations

ใช้ batch processing เพื่อเพิ่มประสิทธิภาพ

- อ่าน workspaces แบบ parallel เมื่อเป็นไปได้
- ประมวลผล workspaces แบบ sequential เพื่อหลีกเลี่ยง conflicts
- จัดกลุ่ม workspaces ที่มีลักษณะเดียวกันเพื่อประมวลผลร่วมกัน

## Expected Outcome

- ทุก workspace ใน monorepo ได้รับการประมวลผลครบถ้วน
- การประมวลผลเป็นไปตาม workflow ที่กำหนด
- ไม่มี workspace ที่ถูกข้ามหรือมีปัญหาค้างคา
- Monorepo อยู่ในสถานะที่ถูกต้องหลังการประมวลผล
