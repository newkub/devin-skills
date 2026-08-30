---
name: create-mermaid-diagram-all-workspace
description: สร้าง Mermaid source code สำหรับทุก workspace ใน monorepo
argument-hint: "[output-name]"
related:
  - create-mermaid-diagram
  - report-workspace-graph
  - list-workspaces
  - check-monorepo
  - follow-monorepo
  - follow-package-manifest
  - check-circular-dependencies
  - ship
---

## Goal

สร้าง Mermaid source code แสดงความสัมพันธ์ของทุก workspace ใน monorepo บันทึกเป็นไฟล์ `.md` หรือ `.mmd` ที render ได้ทันที

## Scope

ใช้เมื่อ project เป็น monorepo ทีมี workspaces หลาย packages สร้างไฟล์ Mermaid สรุป:
- overview: workspaces และ internal dependencies
- per-workspace: scripts, entry points, exports, internal imports, shared dependencies
ไม่ซ้ำกับ `/report-workspace-graph` ทีรายงานใน chat แต่ skill นี้เน้นสร้างไฟล์ Mermaid source

## Execute

### 1. Detect Monorepo

> Goal: ยืนยันว่าเป็น monorepo

1. ทำ `/check-monorepo`
2. อ่าน `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `moon.yml` หรือ `Cargo.toml` workspace
3. ถ้าไม่ใช่ monorepo → stop และ report

### 2. List Workspaces

> Goal: รวบรวม workspaces ทั้งหมด

1. ทำ `/list-workspaces`
2. บันทึก `name`, `path`, `package.json`/`Cargo.toml` ของแต่ละ workspace
3. ระบุ workspace type: `app`, `package`, `tool`, `config`, `docs`
4. เก็บ root path ไว้ใช้ map path

### 3. Collect Metadata

> Goal: รวบรวมข้อมูลสำหรับ diagram

1. อ่าน manifest ของแต่ละ workspace
2. บันทึก `scripts`, `dependencies`, `devDependencies`, `peerDependencies`, `exports`, `main`, `types`
3. ค้นหา `workspace:*` หรือ references ไปยัง workspace อื่น
4. ใช้ `grep`/`ast-grep` หา imports ระหว่าง workspaces (เช่น `from '<workspace-name>'`)
5. บันทึกจำนวน references ไว้ใช้เป็น coupling strength

### 4. Build Overview Diagram

> Goal: สร้าง Mermaid overview ของทุก workspace

1. ใช้ `flowchart` หรือ `graph` กำหนด node เป้นแต่ละ workspace
2. สร้าง edge จาก internal dependencies
3. ใช้ `subgraph` แบ่งกลุ่มตาม type หรือ layer ถ้ามี
4. ระบุ workspaces ทีเป้น leaf, root, หรือ shared config
5. บันทึกเป้น `<output-name>-overview.md` หรือ `<output-name>-overview.mmd`

### 5. Build Per-Workspace Diagrams

> Goal: สร้าง diagram รายละเอียดของแต่ละ workspace

1. สำหรับแต่ละ workspace สร้าง flowchart แสดง:
   - entry points / exports
   - main scripts (`build`, `test`, `dev`, `lint`)
   - dependencies ภายใน (inbound/outbound)
   - shared dependencies ทีสำคัญ
2. ใช้ `subgraph` แยก `scripts`, `exports`, `deps`
3. บันทึกเป้น `<output-name>-<workspace>.md` หรือ `.mmd`

### 6. Detect Circular And Shared Dependencies

> Goal: ระบุปัญหาทีควรเห็นใน diagram

1. ทำ `/check-circular-dependencies` ระหว่าง workspaces
2. ระบุ shared dependencies ทีหลาย workspace ใช้
3. ใส่ edge style `stroke-dasharray` หรือ note สำหรับ circular
4. ใส่ `classDef` สำหรับ highlight shared / circular

### 7. Validate And Save

> Goal: บันทึก source code ให้ render ได้

1. รวมไฟล์ทั้งหมดลง directory หรือ root ตาม context
2. ตรวจสอบชื่อไฟล์ไม่ซ้ำ
3. ตรวจ syntax ของแต่ละ mermaid block ด้วยตาเปล่าหรือ `mmdc --version` ถ้ามี
4. ถ้า `mmdc` พร้อมและ user ขอ render → render เป็น `.svg` แต่ ห้ามบังคับเป็น output หลัก
5. ถ้าไม่มี `mmdc` ให้แนะนำ Mermaid Live Editor

### 8. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดงไฟล์ output, จำนวน workspaces, circular, shared deps
2. สรุป key findings
3. ทำ `/suggest-next-action`

## Rules

### 1. Output Location

- บันทึก source ไว้ใน root ของ project หรือ `.devin/diagrams/` ถ้ามี
- default ชื่อ: `<repo-name>-workspaces-overview.md` และ `<repo-name>-<workspace>.md`
- ถ้าไม่ระบุ `output-name` ให้ใช้ชื่โปรเจกต์หรือ directory name

### 2. Output Format

- output หลักต้องเป็น source code `.md` หรือ `.mmd` เท่านั้น
- ทุกไฟล์ `.md` ต้องห่อ code ด้วย ` ```mermaid ` เพื่อ render ใน markdown preview ได้
- render image เป็น optional ต้องทำเมื่อ user ขอเท่านั้น

### 3. Workspace Boundaries

- แยก diagram เป้น overview + per-workspace ไม่รวมทุกอย่างไว้หน้าเดียว
- ไฟล์ไม่เกิน 250 บรรทัด ถ้าเกินให้แบ่งหรือลดรายละเอียด
- ไม่ต้องวาด dependencies ภายนอกทั้งหมด แค่สำคัญและ shared

### 4. Accuracy

- ใช้ข้อมูลจริงจาก `package.json`, `Cargo.toml`, `pnpm-workspace.yaml`, source imports
- อย่าสร้าง node หรือ edge จากข้อมูลทีไม่มีอยู่จริง
- ถ้า data ไม่ชัดให้ทำ `/ask-me`

### 5. Reusability

- ใช้ `/use-scripts` ถ้ามี workspaces มากกว่า 20
- ใช้ `/create-mermaid-diagram` สำหรับ syntax หรือรูปแบบทั่วไป
- ถ้าพบ pattern ที่ซ้ำ ให้สร้าง template ใน `references/` ของ skill

### 6. Fallback

- ถ้าไม่ใช่ monorepo → ไม่สร้างไฟล์
- ถ้า `mmdc` render ไม่ผ่าน → ส่ง mermaid source ให้ user
- ถ้ามี circular dependencies ให้ highlight ด้วย dashed edge หรือ note

- ใช้ /follow-monorepo ถ้าจำเป็น
- ใช้ /follow-package-manifest ถ้าจำเป็น
- ใช้ /ship ถ้าจำเป็น

## Expected Outcome

- ไฟล์ Mermaid source overview ของ workspaces ทั้งหมด
- ไฟล์ Mermaid source รายละเอียดของแต่ละ workspace (optional ถ้า user ไม่ต้องการสามารถข้าม)
- ทุกไฟล์ `.md` สามารถ render ได้ทันทีใน Mermaid Live Editor / VS Code / markdown preview
- (optional) ไฟล์ `.svg` ถ้า user ขอ render image
- รายงาน output files, จำนวน workspaces, circular/shared dependencies, next action
- ไม่มี TODO/MOCK/placeholder
