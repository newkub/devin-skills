---
name: add-task-in-package-manifest
description: เพิ่มหรืออัปเดท script ใน package.json และ turbo.json สำหรับ workspace ใน monorepo
---

## Goal

เพิ่มหรืออัปเดท script ใน `package.json` ของ workspace และ root พร้อม register task ใน `turbo.json` สำหรับ Turborepo monorepo

## Scope

ใช้สำหรับเพิ่ม script เฉพาะที่จำเป็นใน `package.json` ของ workspace หรือ root — ไม่ใช่ setup scripts ทั้งหมด (ใช้ `/follow-package-manifest` หรือ `/follow-tasks` แทน)

## Execute

### 1. Identify Target

ระบุ workspace และ `package.json` ปลายทางที่ต้องเพิ่ม script

> Goal: รู้ target workspace, script name, command และ manifest path

1. ระบุ workspace จาก task scope (เช่น `tools/health`, `apps/website`)
2. ระบุ `package.json` path ของ workspace นั้น
3. ระบุ script name, command และ description ที่ต้องเพิ่ม
4. ถ้าเป็น monorepo → ระบุ root `package.json` path ด้วย
5. ถ้า workspace ไม่มี `package.json` → stop และ report

### 2. Check Existing Script

ตรวจสอบ script ที่มีอยู่เพื่อหลีกเลี่ยงการเขียนซ้ำ

> Goal: รู้ว่า script มีอยู่แล้วและถูกต้อง หรือต้องสร้าง/อัปเดท

1. อ่าน `package.json` ของ workspace
2. เช็คว่า script name มีอยู่แล้วหรือไม่
3. ถ้ามีและ command ตรง → ข้ามไป Step 4 (Register Turbo Task)
4. ถ้ามีและ command ไม่ตรง → อัปเดท command ใน Step 3
5. ถ้าไม่มี → เพิ่มใหม่ใน Step 3

### 3. Add Or Update Script

เพิ่มหรืออัปเดท script ใน `package.json` ของ workspace

> Goal: script อยู่ใน `package.json` ของ workspace และถูกต้อง

1. เปิด `package.json` ของ workspace
2. เพิ่มหรืออัปเดท script ใน `scripts` object โดยใช้ `edit` tool
3. รักษา alphabetical order ของ scripts ถ้าเป็น convention ของ project
4. ตรวจสอบว่า JSON syntax ถูกต้องหลังแก้ไข

### 4. Register Turbo Task

Register task ใน `turbo.json` ถ้าเป็น Turborepo monorepo และ task ต้อง orchestration

> Goal: task อยู่ใน `turbo.json` พร้อม inputs, outputs, dependsOn ที่ถูกต้อง

1. อ่าน `turbo.json` ที่ project root
2. เช็คว่า task name มีอยู่แล้วหรือไม่
3. ถ้าไม่มีและ task ต้อง orchestration → เพิ่ม task definition:
   - `dependsOn`: ระบุ upstream tasks (เช่น `["^build"]`)
   - `inputs`: ระบุไฟล์ที่ task อ่าน (เช่น `["src/**", "package.json"]`)
   - `outputs`: ระบุไฟล์ที่ task สร้าง (เช่น `["dist/**"]`)
   - `cache`: `true` ถ้า task สามารถ cache ได้, `false` ถ้าไม่
4. ถ้า task ไม่ต้อง orchestration (เช่น CLI command ที่รัน directly) → ข้ามไป Step 5
5. ตรวจสอบว่า JSON syntax ถูกต้องหลังแก้ไข

### 5. Add Root Proxy Script

เพิ่ม proxy script ใน root `package.json` ถ้าต้องเรียกจาก root ของ monorepo

> Goal: script เรียกได้จาก root โดยใช้ `bun --filter` หรือ `turbo run`

1. อ่าน root `package.json`
2. เช็คว่า proxy script มีอยู่แล้วหรือไม่
3. ถ้าไม่มี → เพิ่ม proxy script ในรูปแบบ `bun --filter <workspace-name> <script-name>`
4. ถ้ามีและ command ตรง → ข้าม
5. ถ้ามีและ command ไม่ตรง → อัปเดท
6. ตรวจสอบว่า JSON syntax ถูกต้องหลังแก้ไข

### 6. Validate

ตรวจสอบว่า script ทำงานได้จริง

> Goal: script รันได้โดยไม่ error และ output ถูกต้อง

1. รัน script ใน workspace: `bun --filter <workspace-name> <script-name>`
2. ตรวจสอบ output ว่าถูกต้องตามที่คาดหวัง
3. ถ้ามี root proxy script → รันจาก root: `bun run <script-name>`
4. ถ้ามี turbo task → รัน `turbo run <task-name>` เพื่อยืนยัน orchestration
5. ถ้า script ไม่ทำงาน → แก้ไขและ re-validate (max 3 ครั้ง → stop/report)

## Rules

### 1. Single Script Scope

- แต่ละครั้งเพิ่มหรืออัปเดท script เดียวเท่านั้น — ถ้าต้องเพิ่มหลาย scripts → เรียก workflow ซ้ำตามจำนวน scripts
- ไม่ใช่ setup scripts ทั้งหมด — ใช้ `/follow-package-manifest` หรือ `/follow-tasks` สำหรับ setup ทั้งหมด

### 2. JSON Safety

- ใช้ `edit` tool สำหรับแก้ไข `package.json` และ `turbo.json` — ห้าม overwrite ทั้งไฟล์
- ตรวจสอบ JSON syntax หลังแก้ไขทุกครั้ง
- รักษา indentation และ formatting ตามที่มีอยู่

### 3. Turbo Task Registration

- Register task ใน `turbo.json` เฉพาะเมื่อ task ต้อง orchestration ข้าม workspaces
- ระบุ `inputs` และ `outputs` ให้ถูกต้องเพื่อ cache efficiency
- ถ้า task เป็น CLI command ที่รัน directly ไม่ต้อง register ใน `turbo.json`

### 4. Root Proxy Script

- เพิ่ม root proxy script เฉพาะเมื่อต้องเรียกจาก root ของ monorepo
- รูปแบบ: `bun --filter <workspace-name> <script-name>`
- ถ้า script เรียกจาก workspace โดยตรงเท่านั้น → ไม่ต้องเพิ่ม root proxy

### 5. Idempotency

- ถ้า script มีอยู่และถูกต้อง → ไม่ต้องแก้ไข
- ถ้า turbo task มีอยู่และถูกต้อง → ไม่ต้องแก้ไข
- ถ้า root proxy มีอยู่และถูกต้อง → ไม่ต้องแก้ไข

## Expected Outcome

- `package.json` ของ workspace มี script ที่ถูกต้องและรันได้
- `turbo.json` มี task definition ถ้าจำเป็น พร้อม inputs, outputs, dependsOn ที่ถูกต้อง
- root `package.json` มี proxy script ถ้าจำเป็น
- script รันได้จริงจากทั้ง workspace และ root ถ้ามี proxy
