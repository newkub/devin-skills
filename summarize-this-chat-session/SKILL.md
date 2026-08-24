---
name: summarize-this-chat-session
description: สรุป chat session ทีคุยในครังนี้
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - memorize
  - report-table
---

---
title: Summarize This Chat Session
description: สรุปสิ่งที่ทำใน chat session นี้: ไฟล์ที่แก้, การตัดสินใจ, ปัญหาที่พบ
auto_execution_mode: 3
related:
  - /report-table
  - /memorize
---

## Goal

สรุปสิ่งที่ทำใน chat session ปัจจุบัน: ไฟล์ที่แก้, การตัดสินใจ, ปัญหาที่พบ และ next steps

## Scope

ใช้สำหรับการสรุป session work ในตอนท้ายของ conversation — ไม่รวมการสรุปโปรเจกต์ทั้งหมด (ใช้ `/sumarize-to-bullet` หรือ `/sumrize-this-project`)

## Execute

### 1. Collect Session Activity

> Goal: รวบรวมกิจกรรมที่ทำใน session นี้
> Goal: มีข้อมูลครบสำหรับการสรุป

1. ระบุ tasks ที่ทำใน session นี้จาก conversation context
2. ระบุไฟล์ที่สร้าง, แก้ไข, ลบ จาก tool calls
3. ระบุ commands ที่รันและผลลัพธ์
4. ระบุ workflows ที่เรียกใช้

### 2. Categorize Changes

> Goal: จัดประเภทการเปลี่ยนแปลงที่ทำ
> Goal: การเปลี่ยนแปลงจัดประเภทชัดเจน

1. จัดประเภทตาม action:
   - Created: ไฟล์ที่สร้างใหม่
   - Modified: ไฟล์ที่แก้ไข
   - Deleted: ไฟล์ที่ลบ
   - Renamed: ไฟล์ที่เปลี่ยนชื่อ
2. จัดประเภทตาม category:
   - code: `*.ts`, `*.tsx`, `*.js`, `*.jsx`
   - config: `*.json`, `*.jsonc`, `*.yml`, `*.yaml`, `*.toml`
   - docs: `*.md`
   - workflow: workflow files
   - skill: skill files
3. นับจำนวนไฟล์และบรรทัดที่เปลี่ยนแปลงต่อกลุ่ม

### 3. Identify Decisions

> Goal: ระบุการตัดสินใจที่ทำใน session
> Goal: เข้าใจเหตุผลของการเปลี่ยนแปลง

1. ระบุ design decisions ที่ทำ
2. ระบุ trade-offs ที่เลือก
3. ระบุ alternatives ที่ปฏิเสธ
4. ระบุ user preferences ที่เรียนรู้

### 4. Identify Issues

> Goal: ระบุปัญหาที่พบและแก้ไข
> Goal: เข้าใจปัญหาและการแก้ไข

1. ระบุ errors ที่พบและแก้ไข
2. ระบุ warnings ที่พบ
3. ระบุ edge cases ที่จัดการ
4. ระบุปัญหาที่ยังไม่ได้แก้ (ถ้ามี)

### 5. Format Summary

> Goal: จัดรูปแบบสรุปให้อ่านง่าย
> Goal: สรุปกระชับ ครบข้อมูล อ่านง่าย

1. ทำ `/report-table` สำหรับสรุปไฟล์ที่เปลี่ยนแปลง
2. แสดงผลตามลำดับ: Summary → Files Changed → Decisions → Issues → Next Steps
3. กำหนด columns สำหรับตาราง files:
   - No. ลำดับ
   - File ชื่อไฟล์
   - Action created / modified / deleted / renamed
   - Category code / config / docs / workflow / skill
   - Description สรุปสิ่งที่เปลี่ยนแปลง
4. ใช้ bullet points สำหรับ decisions, issues, next steps

### 6. Save Important Context

> Goal: บันทึก context สำคัญจาก session
> Goal: context สำคัญไม่หายไป

1. ทำ `/memorize` สำหรับ decisions และ preferences ที่สำคัญ
2. ระบุ context ที่ควรบันทึก: architecture decisions, user preferences, lessons learned
3. ระบุ context ที่ไม่จำเป็นต้องบันทึก: temporary fixes, one-off tasks

## Rules

### Accuracy

- รายงานเฉพาะสิ่งที่ทำจริงใน session นี้
- ไม่อ้างอิง sessions อื่น
- ไม่สรุปสิ่งที่ไม่ได้ทำ

### Output Format

- ทำ `/report-table` สำหรับตารางไฟล์
- ใช้ bullet points สำหรับ decisions, issues, next steps
- สรุปกระชับ — ไม่เกิน 50 บรรทัด
- ใช้ symbols: ✅ created, ✏️ modified, ❌ deleted, 📝 renamed

### High Impact Content

- ชี้เน้นไฟล์ที่เปลี่ยนแปลงมากที่สุด
- ชี้เน้น decisions ที่มีผลกระทบสูง
- ชี้เน้น issues ที่ยังไม่ได้แก้
- ไม่แสดงรายละเอียดของทุกไฟล์ถ้าเกิน 20 ไฟล์ → แสดงเฉพาะ summary

### Non-Redundancy

- การสรุปโปรเจกต์ทั้งหมดอยู่ใน `/sumrize-this-project` แล้ว
- การสรุปเป็น bullet points อยู่ใน `/sumarize-to-bullet` แล้ว
- การบันทึก context อยู่ใน `/memorize` แล้ว

## Expected Outcome

- สรุป session work กระชับ ครบข้อมูล
- ตารางไฟล์ที่เปลี่ยนแปลง: action, category, description
- ระบุ decisions, issues และ next steps
- context สำคัญถูกบันทึกด้วย `/memorize`
- ผู้ใช้เข้าใจสิ่งที่ทำใน session นี้
