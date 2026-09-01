---
name: report-workspace-graph
description: รายงานความสัมพันธ์ระหว่าง workspaces ใน monorepo พร้อม dependency graph
related:
  - check-monorepo
  - list-workspaces
  - check-circular-dependencies
  - refactor-workspace
  - all-workspace
  - report-table
  - report-ansi
  - suggest-next-action
  - follow-package-manifest
  - follow-monorepo
---

## Goal

รายงานความสัมพันธ์ระหว่าง workspaces ใน monorepo เพื่อให้เห็นการพึ่งพาอาศัยกัน imports และ shared dependencies

## Scope

ใช้สำหรับ monorepo ที่มี workspaces หลาย packages — ไม่ซ้ำกับ `/list-workspaces` ที่เน้นรายการ workspaces แต่เน้นความสัมพันธ์ระหว่าง workspaces

## Execute

### 1. Detect Workspace Structure

> Goal: ตรวจพบโครงสร้าง workspaces ใน project

1. ทำ `/check-monorepo` เพื่อตรวจสอบว่าเป็น monorepo หรือไม่
2. อ่าน `package.json` ที่ root ดู `workspaces` หรือ `pnpm-workspace.yaml` หรือ `turbo.json`
3. ระบุ workspace `name` และ `path` ของแต่ละ workspace
4. ถ้าไม่ใช่ monorepo ให้ report สถานะและ stop

### 2. Collect Workspace Metadata

> Goal: รวบรวมข้อมูลพื้นฐานของแต่ละ workspace

1. อ่าน `package.json` ของแต่ละ workspace
2. บันทึก `name`, `version`, `dependencies`, `devDependencies`, `peerDependencies`
3. บันทึก `exports`, `main`, `types` ถ้ามี
4. ระบุ workspace type: `app`, `package`, `tool`, `config`

### 3. Analyze Internal Dependencies

> Goal: วิเคราะห์ dependencies ภายใน monorepo

1. ค้นหา `workspace:*` หรือชื่อ workspace อื่นใน `dependencies` และ `devDependencies`
2. สร้าง directed graph ของ internal dependencies
3. ระบุ parent-child relations
4. ระบุ workspaces ที่เป็น leaf หรือ root

### 4. Analyze External References

> Goal: วิเคราะห์การ import หรืออ้างอิงระหว่าง workspaces ผ่าน source code

1. ใช้ `grep` ค้นหา `from '<workspace-name>'` หรือ `from '<workspace-path>'`
2. นับจำนวน imports ระหว่าง workspaces
3. ระบุไฟล์และ path ที่มีการอ้างอิง
4. แยกแยะ direct imports กับ re-exports

### 5. Identify Shared Dependencies

> Goal: หา dependencies ที่หลาย workspace ใช้ร่วมกัน

1. เปรียบเทียบ dependencies ระหว่าง workspaces
2. ระบุ dependencies ที่มี version ต่างกัน
3. ระบุ dependencies ที่ใช้ร่วมกันทั้งหมด
4. แนะนำให้ hoist ถ้าจำเป็น

### 6. Detect Circular Dependencies

> Goal: ตรวจหา circular dependencies ระหว่าง workspaces

1. ทำ `/check-circular-dependencies` ระหว่าง workspaces
2. ระบุวงจรทั้งหมดถ้ามี
3. ระบุ severity ของแต่ละวงจร
4. แนะนำวิธีแก้ไข

### 7. Categorize Relations

> Goal: จัดประเภทความสัมพันธ์ระหว่าง workspaces

1. จัดกลุ่มตาม relation type: `depends-on`, `imports-from`, `shared-dep`, `peer`, `circular`
2. จัดกลุ่มตามทิศทาง: `inbound`, `outbound`, `bidirectional`
3. ระบุ coupling strength ตามจำนวน references
4. ระบุ workspaces ที่ loosely coupled หรือ tightly coupled

### 8. Format Report

> Goal: จัดรูปแบบรายงาน

1. ทำ `/report-table` เพื่อจัดรูปแบบตาราง
2. กำหนด columns: `No.`, `Source`, `Target`, `Relation`, `Strength`, `Files`, `Notes`
3. แสดง dependency graph ด้วย text หรือ mermaid
4. แยก section: Internal Relations, Shared Dependencies, Circular, Recommendations

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้คอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... โดย headers ชัดเจน จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Workspace Detection

- ตรวจสอบ monorepo ก่อนเสมอ
- รองรับ `npm/yarn/pnpm workspaces` และ `turbo`
- ไม่ทำงานถ้าไม่ใช่ monorepo

### 2. Relation Analysis

- ใช้ `workspace:*` และ source imports ประกอบกัน
- นับ coupling strength ตามจำนวน references
- แยก `devDependencies` ออกจาก `dependencies`

### 3. Circular Dependencies

- ใช้ `/check-circular-dependencies`
- ระบุ severity ของ circular
- แนะนำ next step ให้ชัดเจน

### 4. Output Format

- ใช้ `/report-table` สำหรับตาราง
- ใช้ mermaid หรือ text graph สำหรับ relations
- ใช้ symbols: `➡️` depends, `↔️` circular, `🔗` shared

### 5. Non-Redundancy

- ไม่ซ้ำกับ `/list-workspaces`
- ไม่ซ้ำกับ `/check-circular-dependencies`
- ใช้ results จาก skills เหล่านั้นแล้วเพิ่ม relation analysis

### 6. Chat-Only Output

- รายงานทั้งหมดต้องอยู่ใน chat เท่านั้น
- ห้ามเปิด browser, web preview, หรือ HTML report
- ไม่เรียก `/open-web`, `/visualize-in-web`, `/visualize-project`, `/open-devin-in-web`, `/report-in-html`
- ถ้า graph ซับซ้อนจริงๆ ให้ใช้ mermaid หรือ text graph ใน markdown แทน

- ใช้ /refactor-workspace ถ้าจำเป็น
- ใช้ /all-workspace ถ้าจำเป็น
- ใช้ /follow-package-manifest ถ้าจำเป็น
- ใช้ /follow-monorepo ถ้าจำเป็น

## Expected Outcome

- รายงานความสัมพันธ์ระหว่าง workspaces ทั้งหมด
- Dependency graph ระหว่าง workspaces
- Shared dependencies ที่หลาย workspace ใช้ร่วมกัน
- Circular dependencies ถ้ามี พร้อม severity
- คำแนะนำสำหรับการลด coupling หรือ refactoring
- Report อ่านง่าย มี key findings ด้านบน
- รายงานทั้งหมดอยู่ใน chat ไม่เปิด browser หรือ web preview
- มี next action ชัดเจน