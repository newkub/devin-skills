---
name: check-monorepo
description: ตรวจสอบว่า project เป็น monorepo หรือไม่
---

## Goal

ตรวจสอบว่า project เป็น monorepo หรือไม่ เพื่อกำหนด structure ที่เหมาะสม

## Scope

ใช้สำหรับตรวจสอบประเภท project ก่อนเริ่มทำงานที่ต้องรู้ว่าเป็น monorepo หรือไม่

## Execute

### 1. Check Package.json

ตรวจสอบ root `package.json` เพื่อดู workspaces configuration

1. อ่าน `package.json` ที่ root ของ project
2. ตรวจสอบว่ามี `workspaces` field หรือไม่
3. ถ้ามี `workspaces` field ให้ทำตามขั้นตอนถัดไป
4. ถ้าไม่มี ให้รายงาบว่า project นี้ไม่ใช่ monorepo

### 2. Check Workspace Directories

ตรวจสอบว่า workspace directories มีอยู่จริง

1. อ่าน `workspaces` field จาก `package.json` (เช่น `apps/*`, `integrations/*`, `server/*`, `shared/*`)
2. ตรวจสอบว่า directories ที่ match กับ glob patterns มีอยู่จริง
3. ระบุ workspaces ทั้งหมดที่พบ

### 3. Check Monorepo Tools

ตรวจสอบ monorepo management tools

1. ตรวจสอบว่ามี `turbo.json` (Turborepo) หรือไม่
2. ตรวจสอบว่ามี `pnpm-workspace.yaml` (pnpm workspaces) หรือไม่
3. ตรวจสอบว่ามี `lerna.json` (Lerna) หรือไม่
4. ตรวจสอบว่ามี `nx.json` (Nx) หรือไม่

### 4. Report Result

รายงาบผลการตรวจสอบ

1. รายงาบว่า project เป็น monorepo หรือไม่
2. ถ้าเป็น monorepo ให้ระบุ workspaces ทั้งหมด
3. ถ้าเป็น monorepo ให้ระบุ monorepo tool ที่ใช้
4. ใช้ `/report-format-table` สำหรับ output

## Rules

### 1. Detection Criteria

- มี `workspaces` field ใน `package.json` = monorepo
- มี `turbo.json`, `pnpm-workspace.yaml`, `lerna.json`, หรือ `nx.json` = monorepo
- ถ้าไม่ตรงเงื่อนไขข้างต้น = single project

### 2. Output Format

- ระบุผลเป็น `monorepo` หรือ `single-project`
- ถ้าเป็น monorepo ให้ระบุ workspaces ทั้งหมดและ monorepo tool

## Expected Outcome

- ทราบว่า project เป็น monorepo หรือไม่
- ถ้าเป็น monorepo ทราบ workspaces ทั้งหมดและ tool ที่ใช้
