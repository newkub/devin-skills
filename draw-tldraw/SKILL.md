---
name: draw-tldraw
description: สร้างไฟล์ .tldr จากคำอธิบาย shapes
argument-hint: "[description]"
related:
  - draw-excalidraw
  - draw-tldraw-diagram
---

## Goal

สร้างไฟล์ `.tldr` จากคำอธิบาย drawing หรือ diagram

## Scope

- สร้าง JSON ตาม tldraw schema
- รองรับ shapes: geo, text, draw, arrow, line, note
- สร้างไฟล์ทีเปิดใน tldraw app หรือ VS Code extension ได้

## Execute

### 1. Parse Description

> Goal: เข้าใจ drawing

1. รับ description จาก user
2. ระบุ shapes และ text ทีต้องสร้าง
3. กำหนด page size และตำแหน่ง
4. ถ้า complex → สร้าง layout ง่ายๆ ก่อน

### 2. Generate Schema

> Goal: สร้าง JSON ตาม tldraw

1. ใช้ schema:
   ```json
   {
     "tldrawFileFormatVersion": 1,
     "schema": {
       "schemaVersion": 2,
       "sequences": {
         "com.tldraw.store": 5,
         "com.tldraw.page": 1,
         "com.tldraw.shape.geo": 11,
         "com.tldraw.shape.text": 4,
         "com.tldraw.shape.arrow": 8,
         "com.tldraw.shape.draw": 4,
         "com.tldraw.shape.line": 5,
         "com.tldraw.shape.note": 10,
         "com.tldraw.shape.group": 0
       }
     },
     "records": []
   }
   ```
2. สร้าง records สำหรับ `document`, `page`, และแต่ละ shape
3. แต่ละ shape record ต้องมี `id`, `typeName: "shape"`, `parentId`, `pageId`, `index`, `type`, `x`, `y`, `props`

### 3. Save File

> Goal: บันทึกไฟล์

1. บันทึกเป็น `<name>.tldr`
2. ตรวจสอบ JSON valid
3. รายงาน path

## Rules

### 1. Schema

- ต้องมี `tldrawFileFormatVersion`, `schema`, `records`
- `schemaVersion` ควรเป็น 2
- `records` ต้องมี `document`, `page`, และ shapes

### 2. Shape Types

- `geo` สำหรับ rectangle, ellipse, triangle, diamond
- `text` สำหรับ label
- `arrow` สำหรับเชื่อมระหว่าง shapes
- `draw` สำหรับ freehand
- `note` สำหรับ sticky note

### 3. Simple First

- สร้าง drawing ง่ายๆ ก่อน
- ค่อยๆ เพิ่ม detail ถ้า user ต้องการ

- ใช้ /draw-excalidraw ถ้าจำเป็น
- ใช้ /draw-tldraw-diagram ถ้าจำเป็น

## Expected Outcome

- ไฟล์ `.tldr` ทีเปิดใน tldraw ได้
- มี records ครบถ้วน
- JSON valid และถูกต้องตาม schema
