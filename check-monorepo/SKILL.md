---
name: check-monorepo
description: ตรวจสอบว่า project เป็น monorepo หรือไม่
allowed-tools:
  - read
  - glob
  - exec
  - grep
triggers:
  - user
  - model
related:
  - report-table
---

## Goal

ตรวจสอบว่า project เป็น monorepo หรือไม่ เพื่อกำหนด structure ที่เหมาะสม

## Scope

ใช้สำหรับตรวจสอบประเภท project ก่อนเริ่มทำงานที่ต้องรู้ว่าเป็น monorepo หรือไม่

## Execute

### 1. Check Package Manifests
> Goal: Check Package Manifests

ตรวจสอบ root `package.json` และ package manager workspace files เพื่อดู workspaces configuration

1. อ่าน `package.json` ที่ root ของ project
2. ตรวจสอบว่ามี `workspaces` field หรือไม่
3. ตรวจสอบ `pnpm-workspace.yaml` หรือ `bunfig.toml` สำหรับ package manager workspaces
4. ถ้ามี `workspaces` field หรือ package manager workspace file ให้ทำตามขั้นตอนถัดไป
5. ถ้าไม่มี ให้ไป Step 3 ตรวจ monorepo tools อื่นๆ เช่น Moonrepo ก่อนรายงานผล

### 2. Check Workspace Directories
> Goal: Check Workspace Directories

ตรวจสอบว่า workspace directories มีอยู่จริง ทั้ง package workspaces และ Moonrepo projects

1. ถ้ามี `workspaces` field ใน `package.json` หรือ `pnpm-workspace.yaml` ให้อ่าน patterns (เช่น `apps/*`, `integrations/*`, `server/*`, `shared/*`)
2. ตรวจสอบว่า directories ที่ match กับ glob patterns มีอยู่จริง
3. ถ้าเป็น Moonrepo ให้อ่าน `.moon/workspace.yml` หรือ `.moon/projects.yml` เพื่อดู `projects` mapping
4. ระบุ workspaces ทั้งหมดที่พบ

### 3. Check Monorepo Tools
> Goal: Check Monorepo Tools

ตรวจสอบ monorepo management tools ทั้ง package-workspace based และ tool-based

1. ตรวจสอบว่ามี `turbo.json` (Turborepo) หรือไม่
2. ตรวจสอบว่ามี `pnpm-workspace.yaml` (pnpm workspaces) หรือไม่
3. ตรวจสอบว่ามี `lerna.json` (Lerna) หรือไม่
4. ตรวจสอบว่ามี `nx.json` (Nx) หรือไม่
5. ตรวจสอบ `.moon/` directory และ `.moon/workspace.yml` หรือ `.moon/projects.yml` (Moonrepo) หรือไม่
6. ถ้าไม่มี `workspaces` field ใน `package.json` แต่มี `.moon/` ให้ถือว่าเป็น monorepo

### 4. Report Result
> Goal: Report Result

รายงาบผลการตรวจสอบพร้อม run command ที่เหมาะสม

1. รายงาบว่า project เป็น monorepo หรือไม่
2. ถ้าเป็น monorepo ให้ระบุ workspaces ทั้งหมด
3. ถ้าเป็น monorepo ให้ระบุ monorepo tool ที่ใช้
4. ระบุ run command pattern ทั่วไป เช่น `moon run <project>:<task>` สำหรับ Moonrepo หรือ `<tool> run <task>` สำหรับ Turborepo/pnpm
5. ใช้ `/report-table` สำหรับ output

## Rules

### 1. Detection Criteria

- มี `workspaces` field ใน `package.json` หรือ package manager workspace file = monorepo
- มี `turbo.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, หรือ `.moon/` directory = monorepo
- ถ้าไม่ตรงเงื่อนไขข้างต้น = single project

### 2. Output Format

- ระบุผลเป็น `monorepo` หรือ `single-project`
- ถ้าเป็น monorepo ให้ระบุ workspaces ทั้งหมดและ monorepo tool

## Expected Outcome

- ทราบว่า project เป็น monorepo หรือไม่ โดยไม่จำกัดที่ `package.json` workspaces เพียงอย่างเดียว
- ถ้าเป็น monorepo ทราบ workspaces ทั้งหมด tool ที่ใช้ และ run command pattern
