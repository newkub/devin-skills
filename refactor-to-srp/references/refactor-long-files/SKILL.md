---
name: refactor-to-srp\references\refactor-long-files
description: ตรวจหาและ refactor ไฟล์ที่ยาวกว่า threshold ให้มีขนาดเหมาะสม
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
related:
- refactor-codebase
---

## Goal

ตรวจหาและ refactor ไฟล์ที่ยาวกว่า threshold ให้มีขนาดเหมาะสมและ maintainability สูง

## Scope

- ใช้สำหรับ refactor ไฟล์ที่ยาวกว่า threshold ในทุก workspace
- ใช้ภายใต้ `/refactor-codebase` เมื่องาน refactor ครบวงจร

## Execute

### 1. Find And Categorize Long Files

ค้นหาและจัดหมวดหมู่ไฟล์ที่ยาวกว่า threshold

1. ทำ `/check-long-files` เพื่อหาไฟล์ที่ยาวกว่า 250 บรรทัด
2. จัดหมวดหมู่ไฟล์เป็น 4 กลุ่ม:
   - Generated — ข้าม (เช่น `*.gen.ts`, `routeTree.gen.ts`)
   - Migrations — ข้าม (เช่น `migrations/`)
   - Tests — บันทึกไว้ แต่ให้ความสำคัญรองลงมา
   - Source — ทำ refactor กลุ่มนี้ก่อน
3. บันทึกรายการไฟล์และจำนวนบรรทัดเป็น baseline
4. ถ้าไม่มี source files ที่เกิน threshold → stop และ report

### 2. Analyze And Plan

วิเคราะห์แต่ละไฟล์และวางแผน refactor

1. อ่าน source files ที่ยาวที่สุดก่อน
2. ระบุ mixed concerns และ mixed concerns ในไฟล์
3. วางแผน split: แยกตาม responsibility, domain, หรือ feature
4. ระบุส่วนที่เป็น pure functions และ side effects
5. ทำ `/report-plan` เพื่อแสดงแผนก่อนลงมือ
6. ถ้าไฟล์ไม่สามารถ split ได้โดยไม่ทำลาย functionality → skip และไปไฟล์ถัดไป

### 3. Refactor Files

ทำ refactor ทีละไฟล์ เริ่มจาก source files ที่ยาวที่สุด

1. ทำ `/refactor` สำหรับ mixed concerns ที่ชัดเจน
2. แยกไฟล์ตาม plan จาก step 2 — ต้องมี user confirmation ก่อน execute
3. ทำ `/simplify` สำหรับ functions ที่ซับซ้อนเกินไป
4. ทำ `/update-reference` หลัง split ทุกไฟล์เพื่ออัปเดท references
5. ถ้ามี broken references → ทำ `/resolve-errors` ก่อนไปไฟล์ถัดไป

### 4. Verify And Report

ตรวจสอบว่า refactor ผ่านทุกเงื่อนไข

1. ทำ `/check-long-files` อีกครั้งเพื่อยืนยันว่าไฟล์ที่ refactor แล้วไม่เกิน threshold
2. ทำ `/run-check` เพื่อตรวจสอบ lint และ typecheck ผ่าน
3. ทำ `/validate` เพื่อตรวจสอบความถูกต้องของการ refactor
4. เปรียบเทียบกับ baseline: จำนวนไฟล์ที่เกิน threshold ต้องลดลง
5. ถ้ามีไฟล์ที่ยังเกิน threshold → กลับไปทำ step 2-3 ซ้ำ
6. ทำ `/report` เพื่อสรุปผลการ refactor

## Rules

### 1. Execution Order

- ทำตามลำดับ: find → analyze → refactor → verify
- ทำ refactor ทีละไฟล์ เริ่มจาก source files ที่ยาวที่สุดก่อน
- ต้องมี baseline ก่อน refactor เสมอ
- ถ้า fail ที่ step ไหน → stop และ report พร้อมสาเหตุ

### 2. File Categorization

- ข้าม generated files (เช่น `*.gen.ts`, `routeTree.gen.ts`)
- ข้าม migration files (เช่น `migrations/`)
- ทำ source files ก่อน test files
- ถ้า test files เกิน threshold → ทำหลัง source files ทั้งหมด

### 3. Safety

- ทำ `/update-reference` หลัง split ทุกไฟล์
- ถ้ามี broken references → ทำ `/resolve-errors` ก่อนไปไฟล์ถัดไป
- Destructive refactor actions (split, move) ต้องมี user confirmation ก่อน execute

### 4. Quality

- ไฟล์ที่ split ออกมาต้องมี single responsibility ชัดเจน
- ห้ามย้าย code ไปไฟล์ใหม่โดยไม่ตรวจสอบ dependencies
- ถ้าไฟล์ที่ split ออกมายังเกิน threshold → split ต่อจนกว่าจะไม่เกิน

## Expected Outcome

- ไฟล์ที่ยาวกว่า threshold ถูก refactor ให้มีขนาดเหมาะสม
- จำนวนไฟล์ที่เกิน threshold ลดลงจาก baseline
- ไฟล์ที่ split ออกมามี single responsibility ชัดเจน
- Code ผ่าน lint และ typecheck
- References ทั้งหมดถูกอัปเดท ไม่มี broken references
