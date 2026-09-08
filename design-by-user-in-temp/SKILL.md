---
name: design-by-user-in-temp
description: ออกแบบ UI/UX หรือ component กับ user ใน temp directory แล้วเปิด preview
argument-hint: "[topic]"
related:
  - ask-me
  - report-in-html
  - open-web
  - suggest-next-action
---

## Goal

ออกแบบ UI/UX, component, หรือ layout กับ user ใน temp directory แบบ interactive แล้วสร้าง preview เปิดดูใน browser

## Scope

ใช้เมื่อต้องการลองออกแบบหน้าตา UI หรือ component ก่อนตัดสินใจ implement จริง

- สร้างไฟล์ HTML/CSS/JS ชั่วคราวใน temp directory
- ออกแบบ interactive กับ user ผ่าน `/ask-me`
- ใช้ `/report-in-html` สร้าง preview จาก design
- เปิดด้วย `/open-web` เสมอ
- ไม่ต้อง commit ถ้ายังไม่ตกลง

## Execute

### 1. Setup Temp Workspace

> Goal: สร้าง temp directory สำหรับ design

1. สร้าง temp directory ใน `%TEMP%\design-with-me-<timestamp>`
2. ถ้ามี existing temp → ถาม user ว่าล้างหรือไม่
3. ตั้งค่า `index.html`, `style.css`, `script.js` พื้นฐาน

### 2. Gather Requirements

> Goal: เข้าใจสิ่งที user ต้องการออกแบบ

1. ถาม user เรื่อง: topic, target users, key features, style/mood
2. ถ้ามี reference → ขอ URL หรือภาพ
3. สรุป requirements ด้วย `/report-in-table` คอลัมน์: `No.`, `Requirement`, `Priority`

### 3. Design Iterations

> Goal: ออกแบบไปทีละรอบจนกว่าจะตกลง

1. สร้าง wireframe หรือ mockup ใน `index.html`
2. ใช้ `/report-in-html` เพื่อ render design เป็น HTML
3. เปิดดูด้วย `/open-web` เสมอ
4. ถาม user feedback ผ่าน `/ask-me`
5. ปรับแก้ตาม feedback
6. ทำซ้ำจน user ตกลง

### 4. Capture Final Design

> Goal: เก็บ design ทีตกลง

1. บันทึก final `index.html` พร้อม assets
2. ทำ `/report-in-table` สรุป: `No.`, `File`, `Description`
3. แจ้ง user ว่าเป็น temp design — ต้อง implement เองหรือใช้ `/productionize-implementation`

### 5. Next Action

> Goal: สรุปทิศทางถัดไป

1. ทำ `/suggest-next-action`
2. ถ้า user ต้องการ implement → แนะนำ `/productionize-implementation`
3. ถ้า user ต้องการ save → ย้ายจาก temp ไป project ด้วย `/move-to`

## Rules

- ทำงานใน temp directory เท่านั้น
- ต้องเปิด preview ด้วย `/open-web` หลังทุก iteration
- ไม่ commit หรือ push โดยอัตโนมัติ
- เก็บ feedback เป็น checklist ก่อนแก้
- ถ้ามีหลายทางเลือก → ใช้ `/choose-and-apply`

## Expected Outcome

- Temp HTML/CSS/JS ที user ตกลง
- Preview เปิดดูใน browser ได้
- Feedback log พร้อม iterations
- ทิศทางถัดไปชัดเจน
