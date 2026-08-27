---
name: draw-svg-image
description: สร้าง SVG image จากคำอธิบายหรือ prompt ด้วย code
argument-hint: "[description]"
related:
  - convert-to-svg
  - visualize-in-web
---
## Goal

สร้างไฟล์ `.svg` จากคำอธิบายหรือ prompt ที user ให้มา

## Scope

- สร้าง SVG ด้วย manual code สำหรับ shapes พื้นฐาน
- รองรับทั้ง simple icon, diagram, และ illustration ง่าย
- ถ้า complex มาก ให้แนะนำ `gen-ai-images` แล้วแปลงเป็น SVG ด้วย `convert-to-svg`

## Execute

### 1. Parse Description

> Goal: เข้าใจสิ่งทีต้องสร้าง

1. รับ description หรือ prompt จาก user
2. ระบุ shapes: `rectangle`, `circle`, `ellipse`, `line`, `polygon`, `path`, `text`
3. ระบุสี, ขนาด, ตำแหน่ง ถ้ามี
4. ถ้าไม่ชัด → ถามเพิ่ม

### 2. Choose Approach

> Goal: เลือกวิธีสร้าง SVG ทีเหมาะสม

1. ถ้าเป็น simple shapes → สร้าง SVG markup โดยตรง
2. ถ้า user ต้องการ style สูง หรือ complex scene → ใช้ `gen-ai-images` แล้ว `/convert-to-svg`
3. ถ้าต้องการ animation → ใช้ CSS animation หรือ SMIL ภายใน SVG

### 3. Generate SVG

> Goal: สร้างไฟล์ SVG ทีถูกต้อง

1. สร้าง root `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 width height">`
2. เพิ่ม `<rect>`, `<circle>`, `<ellipse>`, `<line>`, `<polygon>`, `<path>`, `<text>` ตาม description
3. ใช้ `fill`, `stroke`, `stroke-width`, `opacity` ตาม style
4. ใส่ `viewBox` เพื่อ responsiveness

### 4. Save And Validate

> Goal: บันทึกและตรวจสอบ

1. บันทึกเป็น `<name>.svg`
2. ตรวจสอบ syntax ด้วย opening ใน browser หรือ `xmllint`
3. รายงาน path ไฟล์

## Rules

### 1. Manual First

- พยายามสร้าง SVG ด้วย code ก่อนเสมอ
- ไม่พึ่ง AI generation ถ้า simple shapes

### 2. Clean SVG

- ใช้ `viewBox` แทน fixed width/height
- ใช้ group `<g>` สำหรับ elements ทีเกี่ยวข้องกัน
- ใส่ `id` หรือ `class` สำหรับ styling ถ้าจำเป็น

### 3. Fallback

- ถ้า description complex หรือ user ต้องการ photorealistic → แนะนำ `gen-ai-images` + `convert-to-svg`
- ถ้าต้องการ preview → ใช้ `/visualize-in-web` หรือ `/open-web`

## Expected Outcome

- ไฟล์ `.svg` ทีถูกต้องตามคำอธิบาย
- SVG สามารถเปิดดูใน browser ได้
- มี path ไฟล์และ approach ทีใช้
