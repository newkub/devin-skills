---
name: check-correctness
description: ตรวจสอบความถูกต้องตามที่ผู้ใช้ระบุ
---

## Goal

ตรวจสอบความถูกต้องของสิ่งที่ผู้ใช้ระบุตาม criteria ที่กำหนด

## Scope

ตรวจสอบความถูกต้องของ code, workflow, documentation, configuration หรือสิ่งอื่นๆ ตามที่ผู้ใช้ระบุ

## Execute

### 1. Identify Check Target

- ระบุสิ่งที่ต้องตรวจสอบจากผู้ใช้
- กำหนด criteria สำหรับการตรวจสอบ
- เลือก tools หรือ workflows ที่เกี่ยวข้อง

### 2. Research Best Practices (ถ้าจำเป็น)

- ทำ `/deep-research` เพื่อค้นหา best practices, references, และ standards
- ใช้ findings เพื่อปรับ criteria การตรวจสอบ

### 3. Perform Check

- ตรวจสอบตาม criteria ที่กำหนด
- บันทึก issues ที่พบ
- จัดลำดับความสำคัญของ issues

### 4. Report Results

- ทำ `/report` เพื่อสรุปผลการตรวจสอบ
- ท้า /suggest-next-action เพือแนะนำอก์ชันถัดไป้
- แนะนำการแก้ไขที่ concrete
- ระบุ priority สำหรับการแก้ไข

## Rules

### 1. Check Criteria

- ต้องชัดเจนว่าตรวจสอบอะไร
- ต้องมี criteria ที่ measurable
- ต้องสอดคล้องกับ requirements

### 2. Issue Prioritization

- Critical: ทำให้ system ไม่ทำงาน
- High: ทำให้มีปัญหา serious
- Medium: ทำให้มีปัญหา moderate
- Low: เป็น minor issues

### 3. Reporting

- สรุปกระชับและชัดเจน
- แนะนำการแก้ไขที่ concrete
- ระบุ priority ชัดเจน

## Expected Outcome

- ตรวจสอบความถูกต้องตาม criteria ที่กำหนด
- บันทึก issues ที่พบพร้อม priority
- แนะนำการแก้ไขที่เหมาะสม
