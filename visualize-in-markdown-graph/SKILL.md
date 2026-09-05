---
name: visualize-in-markdown-graph
description: ตอบกลับเป็น markdown graph แสดงความเชื่อมโยงของข้อมูล
argument-hint: "[topic]"
related:
  - report-table
  - report-flow
  - report-workspace-graph
  - visualize-in-web
  - visualize-project
  - use-in-another-skills
  - ask-me
---

## Goal

แปลงข้อมูลหรือ `topic` ทีผู้ใช้ให้มาเป็น markdown graph เพื่อแสดงความเชื่อมโยง/relationships ใน chat

## Scope

ใช้สำหรับ visualize ข้อมูล โครงสร้าง flow concept หรือ comparison โดยใช้ markdown อย่างเดียว

- ไม่เปิด browser
- ไม่สร้าง HTML
- ไม่ใช้ CDN หรือ frontend runtime
- output อยู่ใน chat เท่านั้น

## Execute

### 1. Collect Input

> Goal: รวบรวมข้อมูลทีจะ visualize

1. รับ `topic` จาก argument หรือ context ปัจจุบัน
2. ถ้า input ไม่ชัดเจน → ทำ `/ask-me` เพื่อถามข้อมูล/สิ่งทีต้องการ visualize
3. ระบุประเภท: `data`, `structure`, `flow`, `concept`, `comparison`, `relationships`

### 2. Identify Nodes And Edges

> Goal: แยก nodes และ edges จากข้อมูล

1. สร้าง `nodes` เป็น entities หลัก
2. สร้าง `edges` จากความสัมพันธ์/dependency/related ระหว่าง nodes
3. กำหนดกลุ่มหรือประเภทให้แต่ละ node ถ้ามี
4. ถ้าข้อมูลซับซ้อน → ใช้ `/use-in-another-skills` หรือ `/taxonomy` ช่วยจัดกลุ่ม

### 3. Choose Graph Format

> Goal: เลือกรูปแบบ markdown graph ทีเหมาะสม

1. ถ้าต้องการ flow/dependency → ใช้ `mermaid flowchart` หรือ `mermaid graph LR/TD`
2. ถ้าต้องการ hierarchy → ใช้ `mermaid mindmap` หรือ nested markdown list
3. ถ้าต้องการ comparison → ใช้ `mermaid quadrantChart` หรือ table
4. ถ้า mermaid ไม่รองรับหรือ user context ไม่รองรับ → ใช้ text graph หรือ ASCII boxes
5. ถ้าต้องการความละเอียดสูง → ใช้ `/report-table` ประกอบ

### 4. Render Markdown Graph

> Goal: สร้าง graph ใน chat

1. สร้าง code block ด้วย syntax `mermaid` ถ้าใช้ mermaid
2. ระบุ node labels ให้ชัดเจน ไม่ซ้ำกัน
3. ระบุ edge labels ถ้าจำเป็น
4. ใช้สี/กลุ่ม โดย mermaid classDef หรือสัญลักษณ์ในข้อความ
5. ถ้าใช้ text graph ให้ใช้ `├─`, `└─`, `│`, `─`, `➡` หรือ `↔`

### 5. Add Legend And Table

> Goal: ทำให้ graph อ่านง่ายขึ้น

1. เพิ่ม legend อธิบายสี/กลุ่ม/สัญลักษณ์
2. ใช้ `/report-table` สรุป nodes, edges, groups ถ้าช่วยให้เข้าใจ
3. อธิบาย insight สั้นๆ หลัง graph

### 6. Output And Suggest

> Goal: ส่งมอบผลลัพธ์และแนะนำต่อ

1. ตอบกลับใน chat เท่านั้น
2. ทำ `/suggest-next-action` สำหรับ action ถัดไป เช่น `/visualize-in-web` ถ้าต้องการ interactive web

## Rules

### 1. Output Constraints

- output อยู่ใน chat เท่านั้น
- ไม่เปิด browser, ไม่ใช้ `/open-web`
- ไม่สร้าง HTML, ไม่ใช้ `/report-in-html` หรือ `/visualize-in-web`
- ไม่สร้างไฟล์ใน project

### 2. Graph Clarity

- labels ชัดเจน ไม่ซ้ำกัน
- edges ระบุทิศทางถ้าเป็น directed graph
- หลีกเลี่ยง graph ซ้อนกันจนอ่านไม่ไหว
- ถ้ามากกว่า 20 nodes ให้แบ่งเป็นหลาย graph หรือใช้ table

### 3. Format Selection

- mermaid เป็น default ถ้า chat UI รองรับ
- text graph เป็น fallback เสมอ
- ไม่ใช้ image หรือ external diagram service

### 4. No Emojis

- ไม่ใช้ emoji ใน output
- ใช้สัญลักษณ์ text เช่น `[A]`, `(*)`, `(?)` แทน

- ใช้ /report-flow ถ้าจำเป็น
- ใช้ /report-workspace-graph ถ้าจำเป็น
- ใช้ /visualize-project ถ้าจำเป็น

## Expected Outcome

- markdown graph ใน chat ทีแสดงความเชื่อมโยงของข้อมูล
- legend และ/หรือ table ประกอบ
- ไม่มีไฟล์หรือ web ถูกสร้าง
- มี `/suggest-next-action` ชัดเจน
