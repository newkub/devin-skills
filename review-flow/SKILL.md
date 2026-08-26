---
name: review-flow
description: Review workflow เพื่อให้เร็ว ปลอดภัย ใช้ง่าย มีประสิทธิภาพ และไม่ซ้ำซ้อน
related:
  - review-references
  - review-redundancy
  - review-consistency
  - review-quality
  - simplify
  - follow-single-responsibility
---

## Goal

Review workflow ใดๆ แล้วปรับปรุงให้ทำงานรวดเร็ว ปลอดภัย ใช้ง่าย มีประสิทธิภาพ ไม่ซ้ำซ้อน และไม่เกิน scope

## Scope

ใช้สำหรับ workflow, skill, process หรือ script ใดๆ ทีต้องตรวจสอบ flow ให้ดีขึ้น

## Execute

### 1. Read Flow

> Goal: เข้าใจ workflow ปัจจุบัน

1. อ่านไฟล์ workflow หรือ skill ทีต้องการ review
2. วาด high-level flow จาก `## Execute`
3. ระบุ input, output, branches, loops, และ decision points
4. ถ้า flow ยาว > 250 บรรทัด → ทำ `/simplify` ก่อน

### 2. Check Speed

> Goal: ลด latency และ unnecessary steps

1. หา steps ทีรัน redundant หรือซ้ำซ้อน
2. หา steps ทีสามารถรันขนานได้
3. ลด round-trips หรือ polling ทีไม่จำเป็น
4. แนะนำให้รวมหรือลบ steps ทีไม่เพิ่มค่า

### 3. Check Safety

> Goal: ลด risk ของ workflow

1. ตรวจสอบ dry-run / confirmation สำหรับ destructive actions
2. ตรวจสอบ error handling ในทุก external call
3. ตรวจสอบว่าไม่ expose secrets หรือ sensitive data
4. ตรวจสอบ rollback path

### 4. Check Usability

> Goal: ให้ง่ายต่อการเรียกใช้

1. ตรวจสอบชื่อและ descriptions ชัดเจน
2. ตรวจสอบว่า flow มี state หรือ context ทีเข้าใจง่าย
3. ตรวจสอบ output format และ report
4. ตรวจสอบว่า user ไม่ต้องจำ state เอง

### 5. Check Efficiency

> Goal: ใช้ resources คุ้มค่า

1. ตรวจสอบการใช้ tool หรือ skill ทีเกินจำเป็น
2. ตรวจสอบการ loop หรือ retry ที unbounded
3. แนะนำ tool หรือ skill ทีเหมาะสมกว่า
4. ลด duplicated logic ระหว่าง steps

### 6. Remove Redundancy

> Goal: ไม่ซ้ำซ้อน

1. ทำ `/review-redundancy` สำหรับ steps ทีซ้ำ
2. ทำ `/review-consistency` สำหรับ terminology และ format
3. รวม steps ทีเหมือนกัน หรือแยกเป็น sub-skill ถ้าทำหลายงาน
4. ลบ placeholder, TODO, MOCK ทีไม่จำเป็น

### 7. Report

> Goal: สรุปผลการ review

1. สร้าง table: Aspect, Finding, Severity, Recommendation
2. Aspects: speed, safety, usability, efficiency, redundancy
3. ระบุ quick wins และ high-impact changes
4. ถ้ามีปัญหาใหญ่ → ทำ `/ask-me` ก่อน implement

## Rules

- ไม่เพิ่ม complexity โดยไม่จำเป็น
- รักษา backward compatibility ถ้ามีผู้ใช้งานเดิม
- แยก flow ออกเป็นย่อยถ้า SRP ไม่ชัด
- ใช้ existing skills แทนการ duplicate logic
- ถ้ามี destructive change → ต้อง dry-run ก่อน
- ไม่เกิน 250 บรรทัดต่อไฟล์

## Expected Outcome

- Flow ทำงานเร็วขึ้น ปลอดภัยขึ้น ใช้ง่ายขึ้น
- ไม่มี redundancy หรือ duplicated steps
- มี report ชัดเจนพร้อม recommendations
- ผ่าน `/validate` หลังปรับปรุง
