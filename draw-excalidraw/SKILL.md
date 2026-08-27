---
name: draw-excalidraw
description: สร้างไฟล์ .excalidraw จากคำอธิบาย shapes
argument-hint: "[description]"
related:
  - draw-svg-image
---

## Goal

สร้างไฟล์ `.excalidraw` จากคำอธิบาย diagram หรือ drawing

## Scope

- สร้าง JSON ตาม Excalidraw schema
- รองรับ shapes: rectangle, diamond, ellipse, arrow, line, text, freedraw
- สร้างไฟล์ทีเปิดใน Excalidraw หรือ VS Code extension ได้

## Execute

### 1. Parse Description

> Goal: เข้าใจ diagram

1. รับ description จาก user
2. ระบุ elements ทีต้องสร้าง: shapes, text, arrows, positions
3. กำหนด canvas size และ background color
4. ถ้า complex → สร้าง layout ง่ายๆ ก่อน

### 2. Generate Schema

> Goal: สร้าง JSON ตาม Excalidraw

1. ใช้ schema:
   ```json
   {
     "type": "excalidraw",
     "version": 2,
     "source": "https://excalidraw.com",
     "elements": [],
     "appState": { "viewBackgroundColor": "#ffffff" },
     "files": {}
   }
   ```
2. สร้าง element objects สำหรับแต่ละ shape:
   - `rectangle`: `type: "rectangle"`
   - `diamond`: `type: "diamond"`
   - `ellipse`: `type: "ellipse"`
   - `arrow`: `type: "arrow"`
   - `line`: `type: "line"`
   - `text`: `type: "text"`
   - `freedraw`: `type: "freedraw"`
3. ใส่ properties: `id`, `x`, `y`, `width`, `height`, `strokeColor`, `backgroundColor`, `fillStyle`, `strokeWidth`, `roughness`

### 3. Save File

> Goal: บันทึกไฟล์

1. บันทึกเป็น `<name>.excalidraw`
2. ตรวจสอบ JSON valid
3. รายงาน path

## Rules

### 1. Schema

- ต้องมี `type`, `version`, `source`, `elements`, `appState`
- ใช้ `version: 2`
- `id` ต้องไม่ซ้ำกัน

### 2. Layout

- จัดวาง elements ให้มีระยะห่างพออ่าน
- ใช้ grid หรือ coordinate ง่ายๆ
- text ควรอยู่ใกล้ shape ทีเกี่ยวข้อง

### 3. Simple First

- สร้าง diagram ง่ายๆ ก่อน ถ้า user ต้องการเพิ่มค่อยปรับ
- ไม่ต้องสร้างทุก style option

## Expected Outcome

- ไฟล์ `.excalidraw` ทีเปิดใน Excalidraw ได้
- มี elements ตาม description
- JSON valid และถูกต้องตาม schema
