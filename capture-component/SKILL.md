---
name: capture-component
description: Capture ภาพแต่ละ UI component แยกสำหรับ documentation, review และ testing
argument-hint: "<component-path-or-name> [url-or-port]"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - skill
  - ask_user_question
  - browser_preview
  - report
  - report-table
  - suggest-next-action
  - resolve-errors
triggers:
  - user
  - model
related:
  - capture-web
  - capture-image-app-to-screenshot
  - capture-terminal
  - watch-browser-and-improve-uxui
  - review-uxui
  - follow-design-system
  - watch-browser-and-test-all-routes
  - update-readme-md
  - from-recent-windows-capture
---

## Goal

Capture ภาพแต่ละ UI component แยกจากกัน เพื่อใช้สำหรับ documentation, review, และ testing

## Scope

ใช้กับ web components ที render ได้ผ่าน:
- dev server route ทีแสดง component เดี่ยว
- storybook / isolated component page
- static HTML file ที import component
- TUI/CLI component output

- ดูเพิ่มเติม: /capture-image-app-to-screenshot, /follow-design-system, /watch-browser-and-test-all-routes, /from-recent-windows-capture

## Execute

### 1. Identify Component

> Goal: รู้ว่าต้อง capture component อะไร

1. ถ้า user ระบุ component file → อ่านไฟล์เพื่อดู props และ variants
2. ถ้า user ระบุ URL → ใช้ URL นั้น
3. ถ้าไม่ระบุ → ค้นหา components จาก `src/components`, `src/ui`, `packages/*/src/components`

### 2. Prepare Component View

> Goal: มีหน้าจอแสดง component เพียงอย่างเดียว

1. ถ้ามี Storybook → เปิด story ของ component นั้น
2. ถ้ามี dev server → สร้างหรือหา URL ที render component เปล่า ๆ
3. ถ้าเป็น static HTML → ใช้ `/write` สร้าง `public/screenshots/components/<name>.html` ชั่วคราว
4. ถ้าเป็น TUI/CLI → รัน command แล้ว capture terminal

### 3. Capture Screenshot

> Goal: บันทึกภาพ component

1. ถ้าเป้น web → ทำ `/capture-web <url> --full`
2. ถ้าเป้น terminal → ทำ `/capture-terminal`
3. บันทึกลง `public/screenshots/components/<component-name>[-<variant>].png`
4. ถ้ามีหลาย variants → แยกไฟล์ เช่น `<name>-primary.png`, `<name>-disabled.png`

### 4. Verify Output

> Goal: ตรวจสอบภาพที capture

1. ใช้ `/read` เปิดดูภาพ
2. ตรวจว่า component ชัดเจน
3. ถ้าไม่ชัด → ปรับ viewport หรือ theme แล้ว capture ใหม่

### 5. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง captured components
2. ทำ `/report` สรุป paths และ variants
3. ทำ `/suggest-next-action`

## Rules

### 1. Component Isolation

- component ต้องแสดงเพียงอย่างเดียวบนหน้าจอ
- ไม่ capture navbar, sidebar, หรือ page layout
- ถ้า component ต้องใช้ provider → setup provider ก่อน capture

### 2. Naming

- ใช้ชื่อ component ตาม PascalCase หรือชื่อไฟล์
- ถ้ามี variants ให้ระบุเติมท้ายชื่อ
- บันทึกลง `public/screenshots/components/`

### 3. Tool Selection

- Web: ใช้ `/capture-web` เป้นหลัก
- Terminal: ใช้ `/capture-terminal`
- ถ้าไม่มี dev server → สร้าง temporary page แล้ว capture

### 4. Safety

- ไม่ capture หน้าจอทีมีข้อมูล sensitive
- ถ้า component ต้อง authentication ให้ถาม user
- ลบ temporary HTML หลัง capture เสร็จถ้าไม่ต้องการ

## Expected Outcome

- มีภาพของแต่ละ component แยกไฟล์
- รองรับ variants และ states ต่าง ๆ
- บันทึกลง `public/screenshots/components/`
- พร้อมใช้กับ `/watch-browser-and-improve-uxui`, `/review-uxui`, `/update-readme-md`
