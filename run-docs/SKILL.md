---
name: run-docs
description: รัน documentation site และแก้ไขข้อผิดพลาด
---

## Goal

รัน documentation site และแก้ไขข้อผิดพลาดที่เกิดขึ้น

## Scope

ใช้สำหรับ documentation site ที่สร้างด้วย VitePress, Docus, หรือ documentation frameworks อื่นๆ

## Execute

### 1. Check Documentation Setup

> Goal: Check Documentation Setup

1. ตรวจสอบว่ามี documentation config หรือไม่ (VitePress, Docus, ฯลฯ)
2. ถ้าเป็น VitePress ให้ทำ `/follow-tool-vitepress` เพื่อตรวจสอบ configuration
3. ตรวจสอบ package manifest สำหรับ dev script
4. ตรวจสอบว่า dependencies ที่จำเป็นถูกติดตั้งแล้ว
5. ตรวจสอบว่า content structure ครบถ้วน

### 2. Update Documentation

> Goal: Update Documentation

1. ทำ `/follow-tool-vitepress` เพื่อสร้างและอัพเดทเอกสาร
2. ทำ `/update-review-cli-and-run` เพื่อปรับปรุง SEO สำหรับ documentation site
3. ตรวจสอบว่า documentation ถูกสร้างอย่างถูกต้อง

### 3. Run Dev Server

> Goal: Run Dev Server

1. ดำเนินการรัน dev server ด้วยคำสั่งที่เหมาะสมตาม documentation framework
2. ถ้ามี errors ให้รัน `/deep-review` เพื่อวิเคราะห์และจัดลำดับ
3. `/deep-review` จะตัดสินใจว่าควรไป workflow ไหนต่อ:
   - ถ้าเป็น cascade issues → `/debug-issue` → `/deep-debug` → `/resolve-errors`
   - ถ้าเป็น isolated errors → `/resolve-errors`
4. ติดตามและแก้ไขข้อผิดพลาดที่เกิดขึ้นทันทีจนกว่าจะผ่าน
5. ตรวจสอบว่า dev server เริ่มต้นสำเร็จ

### 4. Open Browser and Watch (ถ้าจำเป็น)

> Goal: Open Browser and Watch (ถ้าจำเป็น)

1. ถ้าต้องเปิด URL ให้เลือก:
   - ถ้าต้องการตรวจสอบผ่าน browser automation → รัน `/watch-browser`
   - ถ้าต้องการเปิดใน browser เท่านั้น → รัน `/open-web`
   - ถ้าต้องการ watch terminal ทุก 5 วินาที → รัน `/watch-terminal`
2. ตรวจสอบว่า documentation site โหลดได้จริง
3. ทดสอบเข้าถึง documentation site และตรวจสอบว่า features หลักทำงานได้

### 5. Verify

> Goal: Verify

1. ยืนยันว่าไม่มี critical errors ที่ขัดขวางการทำงาน
2. ตรวจสอบว่า navigation และ content แสดงผลถูกต้อง
3. ยืนยันว่าไม่มี runtime errors ใน console
4. ตรวจสอบว่า styling และ theme ทำงานได้

### 6. Report

> Goal: Report

1. รัน `/report-ansi` เพื่อวาด terminal output ด้วย ANSI codes
2. รัน `/report-table` เพื่อจัดรูปแบบตาราง
3. แสดงผลลัพธ์ที่จัดรูปแบบแล้ว

## Rules

- ใช้คำสั่งที่เหมาะสมกับ documentation framework
- ติดตามและแก้ไขข้อผิดพลาดทันทีจนกว่าจะผ่าน
- ตรวจสอบว่า dev server เริ่มต้นสำเร็จก่อนเปิด browser
- ต้องทำ `/follow-tool-vitepress` ก่อนเพื่อสร้างและอัพเดทเอกสาร

## Expected Outcome

- Documentation site ทำงานได้
- ไม่มี critical errors
- Navigation และ content แสดงผลถูกต้อง
- Styling และ theme ทำงานได้