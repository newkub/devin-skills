---
name: add-windsurf-global-workflows
description: เพิ่ม workflow ไปยัง global_workflows ที่ C:\Users\Veerapong\.codeium\windsurf\global_workflows
---

## Goal

เพิ่ม workflow ใหม่ไปยัง global_workflows ตามมาตรฐาน `/write-workflows`

## Execute

### 1. Prepare Workflow Content

1. วางแผนเนื้อหา workflow ที่จะสร้าง
2. ทำ `/write-workflows` เพื่อดูโครงสร้างมาตรฐาน
3. อ้างอิง workflows ที่คล้ายกันใน global_workflows

### 2. Create Workflow File

1. สร้างไฟล์ `.md` ที่ `C:\Users\Veerapong\.codeium\windsurf\global_workflows`
2. เขียน frontmatter ตามมาตรฐาน
3. เขียน Goal, Execute, Rules, Expected Outcome
4. ใช้ `/content-quality` เพื่อตรวจสอบคุณภาพ

### 3. Validate Workflow

1. ตรวจสอบตาม `/write-workflows`
2. ตรวจสอบว่าไม่เกิน 300 บรรทัด
3. ตรวจสอบว่า workflows ที่อ้างอิงมีอยู่จริง

### 4. Update References

1. ทำ `/update-references` หากมี file operations
2. ตรวจสอบ consistency กับ workflows อื่น

## Rules

### 1. File Location

ตำแหน่งและชื่อไฟล์:

- ต้องสร้างที่ `C:\Users\Veerapong\.codeium\windsurf\global_workflows`
- ใช้ชื่อไฟล์ตรงกับ title (kebab-case)
- นามสกุลต้องเป็น `.md`

### 2. Frontmatter Structure

ตาม `/write-workflows`:

- `title`: Title Case (ตรงกับ filename ไม่รวม follow-)
- `description`: กระชับไม่เกิน 100 ตัวอักษร
- `auto_execution_mode`: 3 เท่านั้น

### 3. Content Structure

ตาม `/write-workflows`:

- ## Goal - วัตถุประสงค์กระชับ
- ## Execute - ขั้นตอนการทำงานแบบ numbered list
- ## Rules - กฎและมาตรฐานแบบ grouped
- ## Expected Outcome - ผลลัพธ์ที่คาดหวัง

### 4. Workflow References

การอ้างอิง workflows:

- อ้างอิง workflows ในรูปแบบ `/workflow-name`
- เช็คว่า workflows ที่อ้างอิงมีอยู่จริง
- เขียนในรูปแบบ ทำ `/workflow-name` เพื่อ [วัตถุประสงค์]

### 5. Content Quality

คุณภาพเนื้อหา:

- ใช้ `/content-quality` ก่อนเริ่มเขียน
- เนื้อหาไม่เกิน 300 บรรทัด
- เขียนเป็นหลักการ how-to ที่ใช้ได้ทั่วไป
- ไม่ซ้ำซ้อนกับ workflows อื่น

## Expected Outcome

- Workflow file สร้างที่ `C:\Users\Veerapong\.codeium\windsurf\global_workflows`
- โครงสร้างสอดคล้องกับ `/write-workflows`
- Content อ่านง่าย ไม่ซ้ำซ้อน
- สอดคล้องกับ workflows อื่นใน global_workflows
