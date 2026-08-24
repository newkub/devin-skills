---
name: report-bundle
description: สรุปขนาด bundle ต่อ chunk, dependency, tree-shaking effectiveness
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
---

## Goal

รายงานขนาด bundle ของโปรเจกต์: ต่อ chunk, ต่อ dependency, tree-shaking effectiveness และ insights

## Scope

ใช้สำหรับการรายงาน bundle size หลัง build — ไม่รวมการ optimize build (ใช้ `/improve-efficiency` สำหรับ optimization)

## Execute

### 1. Build Project

> Goal: Build โปรเจกต์เพื่อสร้าง bundle
> Goal: มี build output สำหรับวิเคราะห์

1. ทำ `/run-build` เพื่อ build โปรเจกต์
2. ระบุ output directory จาก build config (`dist/`, `.output/`, `build/`)
3. ถ้า build ไม่สำเร็จ → รายงาน error และจบ

### 2. Collect Bundle Statistics

> Goal: รวบรวมสถิติของ bundle
> Goal: มีสถิติครบสำหรับการวิเคราะห์

1. รัน `du -sh <output-dir>` เพื่อดูขนาดรวม
2. รัน `du -sh <output-dir>/*` เพื่อดูขนาดต่อ subdirectory
3. ระบุไฟล์ใหญ่ที่สุด (top 10) ด้วย `du -a <output-dir> | sort -n -r | head -10`
4. ระบุ chunk files: `*.js`, `*.css`, `*.woff2`, `*.png`
5. แยก gzipped size ถ้ามี (`.gz` files)

### 3. Analyze Chunks

> Goal: วิเคราะห์ chunks ของ bundle
> Goal: เข้าใจการกระจายขนาดในแต่ละ chunk

1. ระบุ vendor chunks และ sizes (เช่น `solid-vendor.js`, `tanstack-router.js`)
2. ระบุ application chunks และ sizes
3. ระบุ async/lazy chunks และ sizes
4. ระบุ CSS chunks และ sizes
5. ระบุ asset chunks (fonts, images) และ sizes
6. คำนวณ ratio: vendor vs application vs assets

### 4. Analyze Dependencies

> Goal: วิเคราะห์ dependencies ที่มีผลต่อ bundle size
> Goal: รู้ dependencies ที่ทำให้ bundle ใหญ่

1. ระบุ dependencies ที่อยู่ใน vendor chunks
2. ประเมินขนาดของแต่ละ dependency ใน bundle
3. ระบุ dependencies ที่ใหญ่เกินคาด (เช่น > 50KB)
4. ระบุ dependencies ที่ไม่ได้ tree-shake อย่างมีประสิทธิภาพ
5. ระบุ dependencies ที่ควรเป็น dynamic import

### 5. Check Tree-Shaking

> Goal: ตรวจสอบ tree-shaking effectiveness
> Goal: รู้ว่า tree-shaking ทำงานได้ดีแค่ไหน

1. ตรวจสอบ `sideEffects` ใน `package.json`
2. ระบุ modules ที่มี side effects ทำให้ tree-shaking ไม่ทำงาน
3. ตรวจสอบ named imports vs namespace imports
4. ระบุ dead code ที่ไม่ได้ eliminate
5. ประเมิน potential savings ถ้า tree-shaking ทำงานดีขึ้น

### 6. Format Report

> Goal: จัดรูปแบบรายงานให้อ่านง่าย
> Goal: รายงานครบ อ่านง่าย มี insights

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. แสดงผลตามลำดับ: Summary → Chunks → Dependencies → Tree-Shaking → Recommendations
3. กำหนด columns สำหรับตาราง chunks:
   - No. ลำดับ
   - Chunk ชื่อไฟล์
   - Type vendor / app / async / css / asset
   - Size ขนาด (KB)
   - Gzipped ขนาด gzipped (KB) ถ้ามี
   - % สัดส่วนของ total
4. แยกตารางตามหมวด: Chunks, Large Dependencies, Tree-Shaking Issues

### 7. Provide Insights

> Goal: ให้ insights และ recommendations
> Goal: ผู้อ่านรู้ว่าต้องทำอะไรเพื่อลด bundle size

1. สรุปขนาด bundle รวมและสัดส่วนตามประเภท
2. ระบุ chunks ที่ใหญ่เกิน threshold (เช่น > 100KB)
3. ระบุ dependencies ที่ควรเป็น dynamic import
4. ระบุ modules ที่มี side effects
5. แนะนำ next steps: `/improve-efficiency` สำหรับ optimization

## Rules

### Report UX/UI
> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Read-Only Report

- ไม่ optimize ไม่แก้ไข build config — รายงานเท่านั้น
- ใช้ `/improve-efficiency` สำหรับ optimization
- ใช้ `/run-build` สำหรับการ build

### Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- แยกตารางตามหมวด: Chunks, Large Dependencies, Tree-Shaking Issues
- ใช้ symbols: ✅ good size, ⚠️ large, ❌ too large
- แสดงขนาดเป็น KB หรือ MB

### High Impact Content

- ชี้เน้น chunks ที่ใหญ่เกิน 100KB
- ชี้เน้น dependencies ที่ใหญ่เกิน 50KB
- ชี้เน้น tree-shaking issues ที่มี potential savings > 10KB
- ถ้ามีมากกว่า 50 chunks → แสดงเฉพาะ top 20 ที่ใหญ่ที่สุด

### Thresholds

- Vendor chunk: < 150KB ✅, 150-300KB ⚠️, > 300KB ❌
- Application chunk: < 100KB ✅, 100-200KB ⚠️, > 200KB ❌
- Async chunk: < 50KB ✅, 50-100KB ⚠️, > 100KB ❌
- CSS chunk: < 50KB ✅, 50-100KB ⚠️, > 100KB ❌

### Non-Redundancy

- การ optimize build อยู่ใน `/improve-efficiency` แล้ว
- การ build อยู่ใน `/run-build` แล้ว

## Expected Outcome

- สรุปขนาด bundle รวมและต่อ chunk ในตารางที่อ่านง่าย
- ระบุ chunks และ dependencies ที่ใหญ่เกิน threshold
- ระบุ tree-shaking issues และ potential savings
- มี recommendations ชัดเจน
- ไม่มีการแก้ไข build config — read-only report
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
