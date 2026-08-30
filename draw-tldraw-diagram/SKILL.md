---
name: draw-tldraw-diagram
description: สร้าง diagram.tldraw จากคำอธิบาย flow หรือ architecture
argument-hint: "[description]"
related:
  - draw-tldraw
  - draw-excalidraw
  - draw-svg-image
---

## Goal

สร้างไฟล์ `diagram.tldr` ทีอธิบาย flow, architecture, หรือ system diagram ด้วย shapes และ arrows

## Scope

- สร้าง tldraw file สำหรับ diagram ทีมี nodes และ edges
- รองรับ flowchart, architecture diagram, sequence diagram ง่าย
- ใช้ tldraw schema เหมือน `draw-tldraw`

## Execute

### 1. Parse Diagram Description

> Goal: เข้าใจ flow

1. รับ description จาก user
2. ระบุ nodes: labels, shapes, colors
3. ระบุ edges/relationships: ใครชี้ไปหาใคร
4. กำหนด direction: top-to-bottom, left-to-right
5. ถ้าไม่ชัด → ถามให้ user ยืนยัน

### 2. Layout Nodes

> Goal: จัดวาง nodes ให้เห็นภาพ

1. เรียง nodes ตาม direction
2. คำนวณ x, y ให้มีระยะห่างพอสมควร
3. กำหนดสีหรือสไตล์ให้แต่ละ node ตาม group
4. ถ้ามีหลาย layer → แบ่งกลุ่มด้วย `group` shapes หรือสี

### 3. Generate Diagram File

> Goal: สร้าง `diagram.tldr`

1. ใช้ tldraw schema เหมือน `draw-tldraw`
2. สร้าง records:
   - `document`, `page`
   - สำหรับแต่ละ node: `geo` shape หรือ `note` shape
   - สำหรับแต่ละ edge: `arrow` shape
   - สำหรับ label: `text` shape
3. บันทึกเป็น `diagram.tldr`

### 4. Validate

> Goal: ตรวจสอบ diagram

1. ตรวจสอบ JSON valid
2. ตรวจสอบว่า `arrow` มี `start` และ `end` id ทีถูกต้อง
3. รายงาน path และ summary ของ diagram

## Rules

### 1. Direction

- default คือ top-to-bottom
- ถ้า user ไม่ระบุให้ใช้ left-to-right สำหรับ flowchart
- ระบุ direction ใน description

### 2. Node And Edge

- ใช้ `geo` shape สำหรับ node
- ใช้ `arrow` shape สำหรับ edge
- ใส่ label บน arrow ด้วย `text` ถ้ามี

### 3. Maintainability

- จัดเรียงให้เห็นภาพรวมง่าย
- ไม่ให้ arrow ซ้อนกันมาก
- ถ้า node มากเกินไป ให้แบ่งเป็นหลายหน้าหรือย่อย

- ใช้ /draw-excalidraw ถ้าจำเป็น
- ใช้ /draw-svg-image ถ้าจำเป็น

## Expected Outcome

- ไฟล์ `diagram.tldr` ทีเปิดใน tldraw ได้
- มี nodes และ arrows ตาม flow
- รายงาน structure และ path
