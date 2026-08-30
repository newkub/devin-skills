---
name: visualize-in-web
description: สร้าง visual แบบ Web ใน browser บน OS temp directory
related:
  - report-in-html
  - open-web
  - visualize-project
  - open-readme-html
---

## Goal

สร้าง visual แบบ Web (HTML) ใน browser ให้เข้าใจข้อมูล โครงสร้าง หรือ concept ได้ง่าย โดยเลือก frontend runtime ตาม user context

## Scope

- ใช้สำหรับ visualize ข้อมูล โครงสร้าง หรือ concept ที่ซับซ้อน
- สร้างไฟล์เดียวใน OS temp directory แบบ no-build
- เลือก runtime ตาม context: `Vue 3`, `solid-js/html`, `Alpine.js`, หรือ `Vanilla JS`
- ถ้าต้องการ preview `TSX` component หรือ build → ใช้ `/visualize-project`

## Execute

### 1. Analyze Content

> Goal: เข้าใจเนื้อหาที่จะ visualize

1. ระบุประเภทเนื้อหา (`data`, `structure`, `flow`, `concept`, `comparison`)
2. ระบุความสัมพันธ์และ hierarchy
3. กำหนด layout ที่เหมาะสม (`tables`, `hierarchies`, `flows`, `comparisons`, `statistics`, `relationships`)

### 2. Select Runtime

> Goal: เลือก frontend runtime ตาม user context

1. ดู context ของ user: project stack, active files, หรือ config
2. ถ้า user ใช้ `Solid` → ใช้ `solid-js/html` หรือ `solid-js/h` จาก CDN
3. ถ้า user ใช้ `Vue` → ใช้ Vue 3 global build จาก unpkg
4. ถ้า user ใช้ `Alpine` → ใช้ Alpine.js CDN
5. ถ้าไม่ชัด → ใช้ Vue 3 เป็น default
6. ถ้าต้องการ build หรือ `TSX` → เปลี่ยนไปใช้ `/visualize-project`

### 3. Generate Web Mode

> Goal: สร้าง visual แบบ HTML

1. ทำ `/report-in-html` สำหรับ HTML structure พื้นฐาน
2. ใช้ runtime ที่เลือกจากข้อ 2
3. ใช้ Tailwind CSS สำหรับ styling
4. ถ้าต้องการ tab system ให้อ้างอิง `/open-readme-html`
5. สร้างไฟล์ใน OS temp directory:
   - Windows: `$env:TEMP\visualize-<name>.html`
   - macOS/Linux: `tmp/visualize-<name>.html`
6. ทำ `/open-web` เพื่อเปิดใน browser

### 4. Design Visual Layout

> Goal: ออกแบบ layout ตามประเภทเนื้อหา

1. Data tables: ใช้ `<el-table>` หรือ HTML tables พร้อม sorting
2. Hierarchies: ใช้ tree structure หรือ nested boxes
3. Flows: ใช้ arrows และ decision points
4. Comparisons: ใช้ side-by-side layout
5. Statistics: ใช้ charts หรือ bar graphs
6. Relationships: ใช้ graph หรือ matrix

### 5. Add Interactivity

> Goal: เพิ่ม interaction สำหรับ Web mode

1. เพิ่ม search ด้วย `<el-input>` หรือ `<input v-model>`
2. เพิ่ม filter ด้วย computed properties
3. เพิ่ม expand/collapse ด้วย `<el-collapse>`
4. เพิ่ม tabs สำหรับจัดกลุ่มข้อมูล
5. เพิ่ม dark mode ด้วย `<html class="dark">`

## Rules

### 1. Output Location

- สร้างไฟล์ใน OS temp directory เท่านั้น เป็นไฟล์ชั่วคราว
- Windows: ใช้ `$env:TEMP` environment variable
- macOS/Linux: ใช้ `tmp` directory
- ตั้งชื่อไฟล์ `visualize-<descriptive-name>.html`
- ไม่สร้างไฟล์ใน project directory

### 2. Web Standards

- ทำตาม `/report-in-html` สำหรับ HTML structure
- เลือก frontend runtime ตาม user context (`Vue`, `Solid`, `Alpine`, `Vanilla`)
- ใช้ Tailwind CSS CDN
- รองรับ dark mode
- ถ้าต้องการ Element Plus components ให้อ้างอิง `/open-readme-html`

### 3. No Build

- ไฟล์เดียว ไม่มี build step
- JS/CSS/Runtime โหลดจาก CDN
- ถ้าต้องการ `TSX` หรือ build → ใช้ `/visualize-project` แทน

### 4. Content Clarity

- เน้นความเข้าใจง่ายกว่าความสวยงาม
- ใช้ labels และ annotations ชัดเจน
- จัดกลุ่มข้อมูลที่เกี่ยวข้อง
- ใช้ color/contrast สำหรับ emphasis

## Expected Outcome

- Visual แบบ Web ที่เข้าใจง่าย
- ไฟล์ชั่วคราวใน OS temp directory
- เปิดใน browser พร้อม interaction
- ข้อมูลที่ซับซ้อนกลายเป็น visual ที่เข้าใจได้ง่าย
- ใช้ runtime ตาม context ของ user
