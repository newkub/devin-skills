---
name: read-related-workflows
description: อ่านและสรุป workflows ที่เกี่ยวข้องแบบ recursive ทุกระดับ
---

## Goal

อ่านและสรุป workflows ที่เกี่ยวข้องทั้งหมดแบบ recursive ทุกระดับเพื่อทำความเข้าใจ dependencies และสิ่งที่ต้องทำ

## Scope

ครอบคลุมการอ่าน workflow ปัจจุบันและ workflows ที่ถูกอ้างอิงภายในนั้นแบบ recursive ทุกระดับ (sub-workflows ของ sub-workflows ของ sub-workflows ฯลฯ)

## Execute

### 0. Initialize Tracking

สร้าง todo_list เพื่อ track ทุก workflow ที่ต้องอ่าน

> Goal: ไม่พลาดการอ่าน workflow ใดๆ

1. สร้าง `todo_list` เพื่อ track ทุก workflow ที่จะอ่าน
2. ทุก workflow ใน dependency graph ต้องเป็น item ใน `todo_list`
3. ก่อนอ่านแต่ละ workflow ให้ mark เป็น `in_progress`
4. หลังอ่านเสร็จแต่ละ workflow ให้ mark เป็น `completed`
5. ห้ามข้าม workflow ใดๆ — ทุก item ต้องเป็น `completed` ก่อนจบ
6. ถ้าพบ workflow ใหม่ระหว่างอ่าน ให้เพิ่มเข้า `todo_list` ทันที

### 1. Read Current Workflow

อ่าน workflow ปัจจุบันที่กำลังทำงาน

- อ่าน workflow file ปัจจุบันด้วย `read_file` tool
- ระบุ workflows ที่ถูกอ้างอิงจาก 3 แหล่ง:
  - `related` ใน frontmatter (field ชื่อ `related` ไม่ใช่ `related_workflows`)
  - patterns `/workflow-name` ในเนื้อหา Execute และ Rules
  - patterns `workflow-name.md` ในเนื้อหา

### 2. Build Dependency Graph

สร้าง dependency graph ของ workflows ทั้งหมดแบบ recursive ทุกระดับ

- สแกน `related` ใน frontmatter ของ workflow ปัจจุบัน (ไม่ใช่ `related_workflows`)
- สแกน references `/workflow-name` ในเนื้อหาของ workflow ปัจจุบัน
- สแกน `related` และ references ของ workflows ที่พบ (recursive ทุกระดับ)
- อ่าน sub-workflows ของ sub-workflows ของ sub-workflows ฯลฯ จนกว่าจะไม่พบ references ใหม่
- สร้าง dependency graph แบบ tree structure แสดงทุกระดับ
- เพิ่มทุก workflow ที่พบเข้า `todo_list` จาก Phase 0

### 3. Read All Related Workflows

อ่าน workflows ทั้งหมดใน dependency graph ทุกระดับ — ห้ามข้ามไฟล์ใด

> Goal: อ่านไฟล์จริงทุกไฟล์ ไม่ใช่แค่ระบุชื่อ

- อ่าน workflows ตามลำดับจาก root ไปยัง leaf nodes
- อ่าน sub-workflows ของ sub-workflows จนครบทุกระดับ
- ทุก workflow ต้องถูกอ่านด้วย `read_file` tool จริง — ห้ามสรุปจากชื่อหรือ assumption
- Path ของ workflow files: `C:\Users\Veerapong\.codeium\windsurf\global_workflows\{workflow-name}.md`
- ถ้าไฟล์ไม่มี ให้ระบุใน summary ว่าไม่พบ และข้ามไป
- เก็บข้อมูล: title, description, execute steps, rules, expected outcome
- mark `completed` ใน `todo_list` หลังอ่านเสร็จแต่ละไฟล์

### 4. Summarize Tasks

สรุป tasks ที่ต้องทำจากทุก workflow ทุกระดับ

- รวบรวม execute steps จากทุก workflow ทุกระดับ
- รวบรวม rules ที่ต้องปฏิบัติจากทุกระดับ
- สรุป expected outcomes ทั้งหมด
- จัดลำดับความสำคัญของ tasks ตาม dependency graph
- ระบุ tasks ที่ซ้ำซ้อนระหว่าง workflows เพื่อหลีกเลี่ยงการทำซ้ำ

### 5. Generate Summary

สร้าง summary ที่อ่านง่าย

- แสดง dependency graph แบบ tree structure ทุกระดับ
- แสดง tasks ที่ต้องทำตามลำดับ
- แสดง rules ที่ต้องปฏิบัติ
- แสดง expected outcomes ทั้งหมด
- แสดงสถานะการอ่าน: ✅ อ่านแล้ว, ❌ ไม่พบไฟล์
- ใช้ `/report-format-table` สำหรับจัดรูปแบบ output

## Rules

### 1. Recursive Depth

- อ่าน sub-workflows ของ sub-workflows ของ sub-workflows ฯลฯ จนกว่าจะไม่พบ references ใหม่
- ไม่จำกัดจำนวนระดับของ recursion
- หยุด recursion เมื่อ workflow ไม่มี `related` ใน frontmatter หรือ references ในเนื้อหา
- ตรวจสอบ circular dependencies และหยุดถ้าพบ

### 2. Dependency Resolution

- อ่าน workflows ตามลำดับ topological sort
- อ่าน parent workflows ก่อน child workflows
- หลีกเลี่ยง circular dependencies

### 3. Workflow Parsing

- แยก frontmatter, goal, scope, execute, rules, expected outcome
- ระบุ workflow references จาก `related` ใน frontmatter (ไม่ใช่ `related_workflows`)
- ระบุ workflow references จาก patterns `/workflow-name` ในเนื้อหา
- ระบุ workflow references จาก patterns `workflow-name.md`

### 4. File Path Resolution

- Workflow files อยู่ที่: `C:\Users\Veerapong\.codeium\windsurf\global_workflows\{workflow-name}.md`
- แปลง `/workflow-name` เป็น path: ลบ `/` นำหน้า แล้วต่อด้วย `.md`
- ตัวอย่าง: `/ship` → `C:\Users\Veerapong\.codeium\windsurf\global_workflows\ship.md`
- ถ้า path ไม่มีไฟล์ ให้ระบุว่าไม่พบและข้าม

### 5. Read Enforcement

- คำว่า "อ่าน workflow" หมายถึง: เรียก `read_file` tool กับไฟล์จริง
- ห้ามสรุป workflow จากชื่อหรือ description เพียงอย่างเดียว
- ห้ามข้ามการอ่านไฟล์ใดๆ ที่อยู่ใน dependency graph
- ทุกไฟล์ที่อ่านต้อง mark `completed` ใน `todo_list`
- ถ้า `todo_list` ยังมี item ที่ไม่ `completed` ห้ามจบ workflow

### 6. Redundancy Detection

- ระบุ tasks ที่ซ้ำซ้อนระหว่าง orchestrator และ sub-workflows
- แจ้งว่ารายละเอียดใดอยู่ใน sub-workflow แล้ว
- แนะนำให้ orchestrator อ้างถึง sub-workflow โดยไม่ duplicate

### 7. Summary Format

- ใช้ tree structure สำหรับ dependency graph แสดงทุกระดับ
- ใช้ numbered list สำหรับ tasks
- ใช้ bullet points สำหรับ rules
- ใช้ bullet points สำหรับ expected outcomes

## Expected Outcome

- Dependency graph ที่ครบถ้วนของ workflows ที่เกี่ยวข้องทุกระดับ
- Summary ของ tasks ที่ต้องทำตามลำดับ
- Summary ของ rules ที่ต้องปฏิบัติ
- Summary ของ expected outcomes ทั้งหมด
- ระบุ tasks ที่ซ้ำซ้อนระหว่าง workflows
- เข้าใจ dependencies ของ workflows ทั้งหมดทุกระดับ
