---
name: report-file-structure
description: แสดงโครงสร้างไฟล์ โฟลเดอร์ พร้อม metadata สถิติ และคำแนะนำ
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - report-table
  - suggest-next-action
  - report-ansi
  - use-scripts
  - scan-codebase
---

## Goal

แสดงโครงสร้างไฟล์และโฟลเดอร์พร้อม metadata สถิติ และคำแนะนำ ให้ชัดเจนและอ่านง่าย

## Scope

ใช้สำหรับการแสดง:
- Project structure และ file trees
- Directory organization และ component hierarchy
- File counts, sizes, types และ statistics
- Organization analysis พร้อม recommendations

## Execute

### 1. Scan Project Structure
> Goal: Scan Project Structure

1. ทำ `/scan-codebase` เพื่อสแกนไฟล์ทั้งหมด
2. ทำ `/deep-review` เพื่อวิเคราะห์โครงสร้าง
3. กำหนด root directory และ depth สำหรับ tree
4. กรองไฟล์ที่ไม่จำเป็น (`node_modules`, `.git`, `dist`, `build`)

### 2. Format Tree
> Goal: Format Tree

1. ใช้ tree characters (`├──`, `└──`, `│`) สำหรับ hierarchy
2. ใช้ icons สำหรับ file types (`📁`, `📄`, `🔧`, `📦`)
3. จัด sorting ตาม logical order (directories ก่อน, แล้ว files ตามตัวอักษร)
4. ใช้ depth limits สำหรับ large projects (default: 3 levels)

### 3. Calculate Statistics
> Goal: Calculate Statistics

1. นับจำนวน files และ directories ทั้งหมด
2. นับ files ตามประเภท (`.ts`, `.js`, `.json`, `.md`, ฯลฯ)
3. คำนวณ total size และ average file size
4. ระบุไฟล์ที่ใหญ่ที่สุด 5 ไฟล์
5. ถ้า project มีมากกว่า 10 directories ให้ทำ `/use-scripts` สำหรับ aggregation

### 4. Analyze Organization
> Goal: Analyze Organization

1. ตรวจสอบว่า structure สอดคล้องกับ project type:
   - Monorepo: `apps/`, `packages/`, `framework/`
   - Single project: `src/`, `tests/`, `docs/`
2. ตรวจสอบ barrel files (`index.ts`) ในแต่ละ directory
3. ตรวจสอบ empty directories และ deeply nested files (> 5 levels)
4. ระบุ files ที่อยู่ผิดที่ (out of convention)

### 5. Highlight Important Files
> Goal: Highlight Important Files

1. ระบุ entry points (`package.json`, `tsconfig.json`, `AGENTS.md`)
2. ระบุ config files (`.devin/`, `biome.jsonc`, `turbo.json`)
3. ระบุ documentation files (`README.md`, `CHANGELOG.md`)
4. ระบุ CI/CD files (`.github/`, `lefthook.yml`)
5. ใช้ markers สำหรับ highlight

### 6. Add Metadata
> Goal: Add Metadata

1. เพิ่ม file sizes สำหรับ large files
2. เพิ่ม file counts สำหรับ directories
3. เพิ่ม summary statistics สำหรับ overview
4. แสดงจำนวนไฟล์ที่กรองในสรุป

### 7. Report Output
> Goal: Report Output

1. แสดง tree view พร้อม icons และ hierarchy
2. แสดงสถิติโดยใช้ `/report-table`:
   - Metric, Value (total files, total dirs, total size, file types)
3. แสดงสรุป: structure health, issues found, recommendations
4. ทำ `/report` สำหรับจัดรูปแบบ output รวม

## Rules

### Report UX/UI
> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Tree Structure

- ใช้ consistent tree characters
- ใช้ proper indentation สำหรับ depth
- จัด sorting ตาม logical order
- ใช้ icons ที่ชัดเจนสำหรับ file types

### Filtering

- กรอง `node_modules`, `.git`, `dist`, `build`, `.cache` จาก tree
- ใช้ `.gitignore` patterns เป็น reference
- แสดงจำนวนไฟล์ที่กรองในสรุป
- ไม่แสดง binary files ใน tree

### Depth Control

- กำหนด depth limit สำหรับ large projects (default: 3 levels)
- ใช้ `...` สำหรับ directories ที่เกิน depth
- แสดงจำนวนไฟล์ที่ซ่อนในสรุป
- ถ้าต้องการ depth เพิ่ม ให้ระบุในแต่ละ directory

### Statistics Accuracy

- นับเฉพาะไฟล์ที่ไม่ถูกกรอง
- คำนวณ size จาก actual file sizes
- แยก source files จาก generated files
- ระบุ percentage ของแต่ละ file type

## Expected Outcome

- Tree view ที่ชัดเจนและอ่านง่าย
- สถิติครบถ้วน (file counts, sizes, types)
- Organization analysis พร้อม recommendations
- Important files ที่ถูก highlight
- Metadata ที่เป็นประโยชน์
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
