---
name: implement-plan
description: อ่านแผนใน .devin/plan/<title-date>.md ทำงานให้ครบ แล้วลบแผน
---

## Goal

อ่านแผนจาก `.devin/plan/<title-date>.md` ดำเนินการให้ครบถ้วน แล้วลบไฟล์แผน

## Scope

- อ่านไฟล์ `.devin/plan/`
- ทำงานตาม task table ให้ครบ
- ลบไฟล์แผนเมื่องานเสร็จ
- ใช้ได้กับงาน refactor หรือ implement ทั่วไป

## Execute

### 1. Find Plan File
> Goal: ระบุไฟล์แผน

1. ถ้ามี argument ให้ใช้เป้น plan path หรือ title
2. ถ้าไม่มี ให้ list ไฟล์ใน `.devin/plan/` แล้วถาม user เลือก
3. อ่านไฟล์ด้วย `read`

### 2. Analyze Tasks
> Goal: รู้ว่าต้องทำอะไร

1. สร้าง task list จากไฟล์แผน
2. ระบุ task ที่ยัง `status: pending`
3. จัดลำดับตาม `## Execution Order` ในแผน

### 3. Execute Tasks
> Goal: ทำงานให้ครบตามแผน

1. ทำตาม task ทีละข้อ เริ่มจาก critical path
2. ถ้างานซับซ้อน → ทำ `/deep-plan` หรือ `/report-plan` ซ้ำก่อนลงมือ
3. อัปเดต status ในไฟล์แผนเป้น `in-progress` หรือ `completed` ตามความเหมาะสม
4. ถ้าพบปัญหา → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

### 4. Verify And Delete Plan
> Goal: ยืนยันว่างานครบแล้วลบแผน

1. ตรวจสอบว่า tasks ทั้งหมด `status: completed`
2. รัน `/validate` และ `/run-check` ถ้ามี
3. ลบไฟล์ `.devin/plan/<title>-<date>.md`
4. รายงานสรุปผล

## Rules

### 1. Plan Compliance

- ทำตามแผนตรงตาม task table
- ถ้าต้องเปลี่ยนแผน ให้ถาม user ก่อน
- ไม่ลบแผนก่อนยืนยันว่างานครบ

### 2. Safety

- ถ้า task มีความเสี่ยงสูง ให้ใช้ `/ask-me` ก่อน
- ไม่ force execute ถ้าข้อมูลไม่ชัด

### 3. Cleanup

- ลบไฟล์แผนทันทีเมื่องานครบ
- สรุปผลลัพธ์ให้ user

## Expected Outcome

- งานตามแผนทำเสร็จครบถ้วน
- ไฟล์แผนถูกลบ
- รายงานผลสรุป
