---
name: visualize-in-web
description: สร้าง visual แบบ Web ใน browser บน OS temp directory
---

## Goal

สร้าง visual แบบ Web (HTML) ใน browser ให้เข้าใจข้อมูล โครงสร้าง หรือ concept ได้ง่าย

## Scope

ใช้สำหรับ visualize ข้อมูล โครงสร้าง หรือ concept ที่ซับซ้อน ต้องการ interaction, search, filter, tabs โดยสร้างไฟล์ชั่วคราวใน OS temp directory

## Execute

### 1. Analyze Content

วิเคราะห์เนื้อหาที่จะ visualize:

1. ระบุประเภทเนื้อหา (data, structure, flow, concept, comparison)
2. ระบุความสัมพันธ์และ hierarchy
3. กำหนด layout ที่เหมาะสม (tables, hierarchies, flows, comparisons, statistics, relationships)

### 2. Generate Web Mode

สร้าง visual แบบ HTML ใน browser:

1. ทำ `/report-html` สำหรับ HTML structure พื้นฐาน
2. ใช้ Vue 3 ผ่าน unpkg CDN
3. ใช้ Tailwind CSS สำหรับ styling
4. ถ้าต้องการ tab system ให้อ้างอิง `/open-readme-html`
5. สร้างไฟล์ใน OS temp directory:
   - Windows: `$env:TEMP\visualize-<name>.html`
   - macOS/Linux: `/tmp/visualize-<name>.html`
6. ทำ `/open-web` เพื่อเปิดใน browser

### 3. Design Visual Layout

ออกแบบ layout ตามประเภทเนื้อหา:

1. Data tables: ใช้ `<el-table>` หรือ HTML tables พร้อม sorting
2. Hierarchies: ใช้ tree structure หรือ nested boxes
3. Flows: ใช้ arrows และ decision points
4. Comparisons: ใช้ side-by-side layout
5. Statistics: ใช้ charts หรือ bar graphs
6. Relationships: ใช้ graph หรือ matrix

### 4. Add Interactivity

เพิ่ม interaction สำหรับ Web mode:

1. เพิ่ม search ด้วย `<el-input>` หรือ `<input v-model>`
2. เพิ่ม filter ด้วย computed properties
3. เพิ่ม expand/collapse ด้วย `<el-collapse>`
4. เพิ่ม tabs สำหรับจัดกลุ่มข้อมูล
5. เพิ่ม dark mode ด้วย `<html class="dark">`

## Rules

### 1. Output Location

- สร้างไฟล์ใน OS temp directory เท่านั้น เป็นไฟล์ชั่วคราว
- Windows: ใช้ `$env:TEMP` environment variable
- macOS/Linux: ใช้ `/tmp` directory
- ตั้งชื่อไฟล์ `visualize-<descriptive-name>.html`
- ไม่สร้างไฟล์ใน project directory

### 2. Web Standards

- ทำตาม `/report-html` สำหรับ HTML structure
- ใช้ Vue 3 ผ่าน unpkg CDN
- ใช้ Tailwind CSS CDN
- รองรับ dark mode
- ถ้าต้องการ Element Plus components ให้อ้างอิง `/open-readme-html`

### 3. Content Clarity

- เน้นความเข้าใจง่ายกว่าความสวยงาม
- ใช้ labels และ annotations ชัดเจน
- จัดกลุ่มข้อมูลที่เกี่ยวข้อง
- ใช้ color/contrast สำหรับ emphasis

## Expected Outcome

- Visual แบบ Web ที่เข้าใจง่าย
- ไฟล์ชั่วคราวใน OS temp directory
- เปิดใน browser พร้อม interaction
- ข้อมูลที่ซับซ้อนกลายเป็น visual ที่เข้าใจได้ง่าย
