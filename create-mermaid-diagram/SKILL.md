---
name: create-mermaid-diagram
description: สร้าง Mermaid source code จากคำอธิบาย บันทึกเป็น .md หรือ .mmd
argument-hint: "[prompt or topic]"
related:
  - draw-excalidraw
  - draw-tldraw
  - report-table
  - report-flow
  - report-architecture-diagram
  - use-scripts
  - ship
  - ship
  - ship
---

## Goal

สร้าง Mermaid source code จาก prompt, คำอธิบาย, หรือไฟล์ทีให้มา บันทึกเป็นไฟล์ `.md` หรือ `.mmd` ทีเปิด render ได้ด้วย Mermaid Live Editor, VS Code Mermaid extension, หรือ markdown preview

## Scope

ใช้สำหรับสร้าง diagram ทั่วไป เช่น flowchart, sequence, class, state, er, gantt, gitgraph, pie, user-journey, quadrant, mindmap สำหรับ project ใดก็ได้
รองรับทั้งการระบุ prompt โดยตรง และการอ่านจากไฟล์/รูปภาพ ถ้าต้องการ visualize จาก code ให้ใช้ `/report-architecture-diagram` หรือ `/report-workspace-graph` แทน

## Execute

### 1. Parse Request

> Goal: เข้าใจสิ่งทีจะวาด

1. รับ `prompt` หรือ `topic` จาก argument หรือ context
2. ถ้า user ให้ไฟล์รูป หรือไฟล์ text → อ่านเนื้อหา
3. ระบุ diagram type: `flowchart`, `sequenceDiagram`, `classDiagram`, `stateDiagram-v2`, `erDiagram`, `gantt`, `gitGraph`, `pie`, `journey`, `quadrantChart`, `mindmap`
4. ถ้าไม่ชัด → ทำ `/ask-me` เลือก type หรือใช้ `flowchart` เป็น default
5. ระบุ output name: `<topic>-diagram.md` หรือ `<topic>.mmd` ถ้าไม่ระบุ

### 2. Generate Mermaid Source

> Goal: สร้าง code ทีถูกต้อง

1. เขียน mermaid source ตาม type ทีเลือก
2. ตั้งชื่อ node id เป็น `kebab-case` หรือ `camelCase` ไม่มีอักขระพิเศษ
3. ใช้ quote สำหรับ label ทีมี `/`, `<`, `>`, `&`, space, หรือภาษาไทย เช่น `"dev/<n>"`, `"release/deploy"`
4. หลีกเลี่ยง `()` `[]` `()` ซ้อนภายใน label ถ้าไม่จำเป็น
5. สำหรับ flowchart ใช้ `direction` เช่น `direction TB`, `direction LR` เพื่อควบคุม layout
6. ใส่ `subgraph` เมื่อต้องการจัดกลุ่มชัดเจน

### 3. Save Source File

> Goal: บันทึกไฟล์ diagram แบบ code

1. บันทึกเป็น `.md` โดยห่อ code ด้วย ` ```mermaid ` เพื่อ render ใน markdown preview ได้ทันที
2. หรือบันทึกเป็น `.mmd` ถ้าต้องการ pure mermaid source
3. ใส่ heading/comment สรุปสิ่งที diagram แสดง
4. ตรวจสอบว่าไฟล์ไม่เกิน 250 บรรทัด ถ้าเกินให้แยกเป็นหลายไฟล์

### 4. Validate Syntax (Optional)

> Goal: ยืนยันว่า Mermaid ถูกต้องโดยไม่บังคับ render เป็น image

1. ตรวจสอบโครงสร้าง code ด้วยตาเปล่า หรือใช้ `mmdc --version` ถ้าต้องการ verify
2. ถ้า `mmdc` พร้อม สามารถรัน `mmdc -i <input.md> -o <output.svg>` ได้ แต่ **ห้ามบังคับเป็น output หลัก**
3. ตรวจดูว่าไม่มี syntax error เช่น node id ซ้ำ, edge ไม่ถูกต้อง, quote ไม่ครบ
4. ถ้า validation ผิดพลาด → อ่าน error แล้วแก้ source แล้ว validate ใหม่ (max 3 รอบ)

### 5. Render Image Only On Request

> Goal: render เป็น image เฉพาะเมื่อ user ขอเท่านั้น

1. ถ้า user ไม่ขอ image → ข้าม step นี้
2. ถ้า user ขอ image → ตรวจ `mmdc` แล้ว render เป็น `.svg` หรือ `.png` ตามทีขอ
3. ถ้า `mmdc` ไม่พร้อม → แนะนำให้ user เปิด source ใน [Mermaid Live Editor](https://mermaid.live) หรือ VS Code Mermaid extension
4. ถ้า render ผิดพลาดหลัง 3 รอบ → report สถานะแล้วหยุด

### 6. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง output file, diagram type, render status
2. แนะนำ next action หรือวิธีแก้ไขถ้า syntax validation ไม่ผ่าน

## Rules

### 1. Output Format

- default output ต้องเป็น source code: `.md` หรือ `.mmd` เท่านั้น
- ไฟล์ `.md` ต้องห่อ code ด้วย ` ```mermaid ` เพื่อ render ใน markdown preview ได้เลย
- render image (`svg/png`) เป็น optional output ต้องสร้างเมื่อ user ขอเท่านั้น

### 2. Mermaid Safety

- ไม่ hardcode secrets, paths ส่วนตัว, หรือ API keys ลงใน diagram
- ใช้ quote สำหรับ label ทีมี special character
- ห้ามใช้ `%%{init}%%` directive ทีซับซ้อนเกินไป
- หลีกเลี่ยง label ยาวเกินจำเป็น

### 3. Reusability

- ใช้ `/use-scripts` ถ้าต้องสร้าง diagram หลายไฟล์หรือประมวลผลซับซ้อน
- ถ้า prompt ซ้ำซ้อนให้ทำ `/enhance-prompt` ก่อน
- เก็บ diagram ไว้ใน `.devin/diagrams/` ถ้าเป็น project-level docs

### 4. Fallback

- ถ้า `mmdc` ไม่พร้อม → ส่ง mermaid source ให้ user โดยไม่ทำอะไรเพิ่ม
- ถ้า validation ผิดพลาดหลัง 3 รอบ → report สถานะแล้วหยุด

## Expected Outcome

- ไฟล์ `.md` หรือ `.mmd` ทีมี Mermaid source ถูกต้อง
- source สามารถ render ได้ทันทีใน Mermaid Live Editor / VS Code / markdown preview
- (optional) ไฟล์ `.svg` หรือ `.png` ถ้า user ขอ render image
- รายงาน output file, diagram type, validation status
- ไม่มี TODO/MOCK/placeholder
