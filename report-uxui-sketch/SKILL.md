---
name: report-uxui-sketch
description: วาด UX/UI sketch ด้วย ANSI box-drawing characters ในแชทจาก codebase จริง
---

## Goal

วาด UX/UI sketch ด้วย ANSI box-drawing characters ในแชท เพื่อ visualize component layout, user flow, และ interaction patterns จาก codebase จริง

## Scope

ใช้สำหรับรายงาน UX/UI ของ features ที่จะสร้างใหม่หรือปรับปรุง ครอบคลุม: page layouts, component structure, user flows, form layouts, dialog/modal layouts, และ mobile responsive views

## Execute

### 1. Analyze Existing Components

> Goal: Analyze Existing Components

1. ทำ `/scan-codebase` เพื่อหา components, routes, และ layouts ที่เกี่ยวข้อง
2. ระบุ existing UI components ที่จะ reuse หรือ extend
3. ระบุ route paths และ navigation structure
4. ระบุ form fields, buttons, และ interactive elements จาก schema
5. จดขนาดและประเภทของ content ที่จะแสดง

### 2. Define Sketch Scope

> Goal: Define Sketch Scope

1. เลือก view type: full page, dialog/modal, component, หรือ flow
2. กำหนด target device: desktop, mobile, หรือ both
3. ระบุ key interactions: click, input, select, drag, scroll
4. กำหนดความกว้างสูงสุดไม่เกิน 80 characters สำหรับ chat readability

### 3. Draw Page Layout

> Goal: Draw Page Layout

1. วาด outer window frame ด้วย `┌─┐│└─┘` พร้อม title bar และ close button `[×]`
2. วาด sections หลัก: header, content area, sidebar, footer
3. วาด component boxes ภายใน content area
4. ใช้ `├─┤` สำหรับแยก sections ภายใน
5. ใส่ labels สั้นๆ ในแต่ละ section: ชื่อ component และ key content

### 4. Draw Components And Interactions

> Goal: Draw Components And Interactions

1. วาด interactive elements: `[Button]`, `[Input]`, `[Select]`, `[Checkbox]`
2. ใช้ `[____]` สำหรับ text inputs
3. ใช้ `[✓]` และ `[ ]` สำหรับ checkboxes และ radio buttons
4. ใช้ `📅` และ `🔍` สำหรับ date picker และ search icons
5. ระบุ state indicators: `[✓]` selected, `[ ]` unselected, `[Loading...]` pending
6. วาด lists ด้วย `┌─┐` boxes หรือ bullet points

### 5. Draw User Flow

> Goal: Draw User Flow

1. วาด flow จาก entry point ถึง completion
2. ใช้ arrows (`→`, `↓`) ระหว่าง steps
3. ใช้ numbered steps (`1.`, `2.`, `3.`) สำหรับ sequence
4. ใช้ diamonds (`◇`) สำหรับ decision points
5. แสดง error และ success paths แยกกัน
6. ระบุ page transitions ด้วย `→ [Page Name]`

### 6. Draw Mobile View (ถ้าจำเป็น)

> Goal: Draw Mobile View (ถ้าจำเป็น)

1. วาด mobile frame แสดงเฉพาะ essential elements
2. ลด columns เป็น single column
3. แสดง bottom navigation หรือ tab bar
4. ระบุ touch targets ด้วย `[  Button  ]` (wider padding)
5. แสดง swipe gestures ด้วย `←swipe→`

### 7. Add Annotations

> Goal: Add Annotations

1. ใช้ `//` สำหรับ inline comments ใน sketch
2. ใช้ `⚠` สำหรับ UX concerns หรือ edge cases
3. ใช้ `✨` สำหรับ new components ที่จะสร้าง
4. ระบุ data source ใต้ component ที่แสดง dynamic data
5. ระบุ route path เหนือ sketch (`/provider/$id/dashboard/bookings`)

### 8. Validate And Present

> Goal: Validate And Present

1. ตรวจสอบว่าทุก interactive element มี label ชัดเจน
2. ตรวจสอบว่า layout สมเหมาะกับ target device
3. ตรวจสอบว่า flow ครบถ้วน: entry → interaction → completion
4. ตรวจสอบว่าอ้างอิง components และ routes ที่มีอยู่จริงใน codebase
5. ตอบ sketch ในแชทโดยตรง ไม่สร้างไฟล์

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Accuracy

- อ้างอิง components, routes, และ forms ที่มีอยู่จริงใน codebase เท่านั้น
- ห้ามประดิษฐ์ UI elements ที่ไม่มีใน design system
- ตรวจสอบ route paths จาก codebase ก่อนวาด
- ระบุเฉพาะหน้า/ส่วนที่เกี่ยวข้องกับ feature ปัจจุบัน

### Box Drawing Characters

- Window frame: `┌─┐│└─┘` พร้อม `[×]` close button
- Section dividers: `├─┤` และ `┬─┴`
- Interactive: `[Button]`, `[____]`, `[✓]`, `[ ]`, `[Select ▼]`
- Arrows: `→ ↓ ↑ ⇄`
- Flow: `◇` (decision), `○` (start), `●` (end)
- Markers: `✨ ⚠ ✓ ✗ 📅 🔍 ❤️ 🔔`

### Layout

- ความกว้างสูงสุด 80 characters สำหรับ chat readability
- ใช้ 2 spaces สำหรับ indentation
- ใช้ consistent spacing ระหว่าง components
- จัด alignment ให้สมมาตร
- แยก sections ด้วย `├─┤` หรือ blank lines

### Content

- ใช้ labels สั้นๆ ไม่เกิน 1 บรรทัดต่อ component
- ระบุ route path เหนือ sketch
- แสดงเฉพาะ essential UI elements ไม่ใส่ทุก micro-detail
- ระบุ data source สำหรับ dynamic content
- ไม่สร้างไฟล์ .md, .html หรือ .json

## Expected Outcome

- ANSI UX/UI sketch ในแชทที่เข้าใจ layout และ interaction ได้ทันที
- Component structure ที่อ้างอิง codebase จริง
- User flow ที่ชัดเจนจาก entry ถึง completion
- Interactive elements ที่ labeled ชัดเจน
- Mobile และ desktop views ที่เหมาะสมกับแต่ละ device
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน