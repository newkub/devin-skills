---
name: optimize-images
description: Compress และ convert รูปใน project เป็น WebP/AVIF พร้อมรายงาน size savings
argument-hint: "[path-or-glob]"
related:
  - convert-files-format
  - convert-to-svg
  - check-size
  - update-references
  - report-table
---

## Goal

Optimize รูปภาพใน project: compress PNG/JPEG, convert เป็น WebP/AVIF และ resize ที่ใหญ่เกิน — ลด bundle/page weight พร้อมรายงาน savings ต่อไฟล์

## Scope

- ใช้กับ images ใน `public/`, `assets/`, `src/`, docs และ directories ที่ระบุ
- ครอบคลุม PNG, JPEG, GIF, WebP, AVIF, SVG (optimize ไม่ใช่ convert-to-svg จาก bitmap)
- ใช้ `bunx` CLI tools เช่น `sharp-cli`, `squoosh-cli` หรือ `@sveltejs/enhanced-img`
- แก้ไขไฟล์จริง — มี backup/dry-run ก่อนเสมอ

## Execute

### 1. Collect Images

> Goal: รู้ว่ามีรูปอะไรใหญ่แค่ไหน

1. ใช้ `find_file_by_name` หา `*.{png,jpg,jpeg,gif,webp,avif,svg}` ตาม scope
2. ใช้ `/check-size` นับขนาดต่อไฟล์
3. เรียงใหญ่ → เล็ก แล้ว flag ไฟล์ >100 KB
4. ข้ามไฟล์ใน `node_modules`, `.git`, `dist`, build outputs

### 2. Plan Optimization

> Goal: เลือก strategy ต่อไฟล์

1. PNG ที่ไม่ต้อง alpha → เสนอ convert เป็น WebP/AVIF
2. JPEG ขนาดใหญ่ → เสนอ quality 80 + resize ตาม max display size
3. GIF → เสนอ convert เป็น video หรือ animated WebP
4. SVG → optimize ด้วย SVGO (ลบ metadata, minify)
5. สรุป plan เป็นตารางก่อนลงมือ — dry run เสมอ

### 3. Execute Optimization

> Goal: ทำตาม plan อย่างปลอดภัย

1. สำรอง originals ใน OS temp หรือ rely on git (ยืนยัน working tree clean ก่อน)
2. รัน tool ตาม format:
   - `bunx sharp-cli -i <in> -o <out> --quality 80` สำหรับ raster
   - `bunx svgo <file>` สำหรับ SVG
3. ถ้า convert format → ทำ `/update-references` อัปเดท imports, `<img src>`, CSS `url()`, markdown links
4. เก็บ output overwrite ตำแหน่งเดิม หรือสร้างไฟล์ใหม่ตาม context

### 4. Verify

> Goal: รูปยังแสดงผลถูกต้อง

1. ตรวจ output เปิดได้และ dimension ไม่เสีย (ยกเว้น resize ตาม plan)
2. ถ้า project เป็น web app → ทำ `/run-dev` หรือ `/capture` verify rendering
3. ตรวจ references ที่อัปเดทว่าชี้ไปไฟล์ใหม่ถูกต้อง

### 5. Report Savings

> Goal: สรุปผลก่อน/หลัง

1. ทำ `/report-table` คอลัมน์: `No.`, `File`, `Before`, `After`, `Saved`, `Format`, `Action`
2. สรุป total saved bytes และเปอร์เซ็นต์
3. ระบุไฟล์ที่ข้ามและเหตุผล

## Rules

### 1. Safety First

- Dry run แสดง plan ก่อนแก้ไขเสมอ
- ต้องมี git backup หรือสำรอง originals ก่อน overwrite
- ถ้า convert format → ต้อง `/update-references` ครบก่อนถือว่าเสร็จ

### 2. Quality Floor

- WebP/AVIF quality ≥75, JPEG ≥80 เว้นแต่ user ระบุ
- ไม่ resize ให้เล็กกว่า display size จริง
- SVG optimize ต้องไม่เปลี่ยน visual output

### 3. Deterministic

- ใช้ settings เดียวกันกับไฟล์ประเภทเดียวกัน
- บันทึก settings ที่ใช้ใน report เพื่อ reproducibility

- ใช้ /convert-files-format ถ้าจำเป็น
- ใช้ /check-size ถ้าจำเป็น
- ใช้ /update-references ถ้าจำเป็น

## Expected Outcome

- รูปถูก compress/convert พร้อม savings ต่อไฟล์และรวม
- References ทั้งหมดชี้ไปไฟล์ใหม่ถูกต้อง
- ไม่มี visual regression หรือ broken images
