---
name: bench-features
description: เปรียบเทียบ features กับคู่แข่ง หา gaps แล้วสร้าง roadmap ให้ดีกว่า
---

## Goal

วิเคราะห์และปรับปรุง features ให้ดีกว่าคู่แข่งในมิติ features โดยเฉพาะ

## Scope

ใช้เมื่อต้อง benchmark มิติ features ของ product กับ competitors หรือหา feature gaps / roadmap ไม่ครอบคลุม performance, UX/UI, architecture, DX, security, business (ใช้ `/bench-competitors` สำหรับทุกมิติ)

## Execute

### 0. Report Current State

> Goal: รายงานสถานะปัจจุบันก่อนเริ่ม benchmark features
> Goal: ผู้ใช้ทราบสถานะปัจจุบันและสิ่งที่จะเปรียบเทียบก่อนเริ่มงาน

1. ระบุ competitors ที่จะ benchmark และ scope ของการเปรียบเทียบ
2. ดำเนินการต่อทันทีหลัง report โดยไม่หยุดรอ

### 1. Research Competitor Features

> Goal: เก็บข้อมูล features ของคู่แข่ง
> Goal: รู้ feature set ของ competitor แต่ละราย

1. ทำ `/deep-research` เพื่อหาข้อมูล features ของคู่แข่ง
2. ระบุ direct / indirect competitors 1-5 ราย
3. แยก features เป็น core, unique, supporting
4. ถ้าหาข้อมูลไม่ได้ → stop และ report

### 2. Compare Features (ตอบในแชท — ภาษาไทย)

> Goal: สร้างตารางเปรียบเทียบ features และไอเดียเพิ่มเติม ตอบในแชทเหมือน `/idea-features`
> Goal: เห็น gaps ในมิติ features ชัดเจน และตอบกระชับในแชท

1. ทำ `/compare-and-idea-features` เพื่อสร้าง feature ideas จาก gaps
2. ตอบตารางเปรียบเทียบในแชท — แถวเป็น feature หลัก, คอลัมน์เป็น competitor + เรา
3. ระบุ status: ✅ มี, ⚠️ partial, ❌ ไม่มี, 🚀 unique
4. ไม่สร้างไฟล์ .md, .html หรือ .json — ตอบในแชทเท่านั้น

### 3. Build Feature Roadmap

> Goal: จัดลำดับ features ที่ต้องปรับปรุง/เพิ่ม
> Goal: ได้ roadmap ที่ actionable

1. รวม gaps จากตารางเปรียบเทียบ
2. ทำ `/deep-plan` เพื่อสร้าง roadmap ด้วย priority: Critical, High, Medium, Nice-to-have
3. ระบุ impact vs effort ของแต่ละ item
4. ถ้า scope ไม่ชัด → ใช้ `/ask-me` ก่อน plan

### 4. Implement Feature Improvements

> Goal: ทำให้ features ดีกว่าคู่แข่ง
> Goal: ปิด gap และสร้าง differentiation

1. ทำ `/ship` เพื่อ implement features ตาม roadmap
2. ทำ `/review-codebase` เพื่อตรวจสอบ completeness
3. หยุดเมื่อ features ดีกว่าคู่แข่งทั้งหมด

### 5. Update Feature Comparison (ตอบในแชท — ภาษาไทย)

> Goal: อัปเดตรายงานหลัง implement ตอบในแชท
> Goal: รายงาน reflect สถานะล่าสุดในแชท

1. ตอบตารางเปรียบเทียบที่อัปเดตแล้วในแชท
2. อัปเดต status ในตารางเปรียบเทียบ
3. Re-benchmark ก่อนจบ
4. ไม่สร้างไฟล์ — ตอบในแชทเท่านั้น

## Rules

### 1. Focus On Features Dimension

- ครอบคลุงเฉพาะ feature set, capabilities, integrations, automation
- ไม่ลง detail ของ performance, UX/UI, architecture, security, business model
- ถ้าเกิน scope ให้ report กลับ user

### 2. Measurable Comparison

- ตารางเปรียบเทียบต้องมี feature name, competitor status, our status, gap/advantage
- ใช้สัญลักษณ์ ✅ ⚠️ ❌ 🚀 ที่เหมือนกันทั้งไฟล์
- ทุก gap ต้องมี priority กำกับ

### 3. Stop When Better

- หยุดทันทีเมื่อ features ดีกว่าคู่แข่งทั้งหมด
- ไม่ over-engineer หรือเพิ่ม features ที่ไม่จำเป็น
- ย้ายไปงานอื่นเมื่อสำเร็จเป้าหมายแล้ว

## Expected Outcome

- ตารางเปรียบเทียบ features ตอบในแชท — ภาษาไทย
- Feature roadmap กับ priority ชัดเจน
- Features ดีกว่าคู่แข่งทั้งหมด
- รายงานถูกอัปเดตแล้วในแชท
- ไม่สร้างไฟล์ใดๆ — ตอบในแชทเท่านั้น
