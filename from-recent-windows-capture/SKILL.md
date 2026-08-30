---
name: from-recent-windows-capture
description: ดึงกลุ่มภาพ capture ล่าสุดจาก Windows Screenshots เพื่อ analyze หลายไฟล์ตามช่วงเวลา ไม่ใช่ไฟล์เดียว
argument-hint: "[time-range-or-count]"
related:
  - capture-terminal
  - analyze-codebase-quality
  - report-ansi
  - report-table
  - suggest-next-action
---

## Goal

ดึงกลุ่มภาพ capture ล่าสุดจาก `C:\Users\Veerapong\Pictures\Screenshots` ตามช่วงเวลาหรือจำนวนกลุ่ม แล้ว analyze เนื้อหา/บริบททีเกิดขึ้นพร้อมกัน ไม่ใช่แค่ไฟล์ล่าสุดไฟล์เดียว

## Scope

- ใช้สำหรับ Windows screenshots ที save ไว้ใน `Pictures\Screenshots`
- วิเคราะห์กลุ่มภาพ ไม่ใช่ภาพเดียว
- ไม่ upload หรือส่งภาพออกไปนอก environment

## Execute

### 1. Locate Screenshots

> Goal: หาไฟล์ capture ทั้งหมดใน default path

1. ใช้ `exec` รัน `Get-ChildItem -Path 'C:\Users\Veerapong\Pictures\Screenshots' -File | Sort-Object LastWriteTime -Descending`
2. บันทึกรายการไฟล์: ชื่อ, ขนาด, วันทีแก้ไข
3. ถ้าโฟลเดอร์ไม่มีไฟล์ → stop และ report

### 2. Group By Recent Window

> Goal: เลือกกลุ่มไฟล์ล่าสุดจากช่วงเวลาเดียวกัน

1. ถ้า user ระบุ `time-range-or-count` (เช่น `5m`, `30m`, `10`) → ใช้ตามนั้น
2. ถ้าไม่ระบุ → ใช้ default `5 นาที` ก่อนไฟล์ล่าสุด หรือ `10` ไฟล์ล่าสุด ทีใกล้กัน
3. กรองไฟล์ทีมี `LastWriteTime` อยู่ในช่วงเวลาเดียวกัน (ห่างกันไม่เกิน 5 นาทีต่อ default)
4. เรียงลำดับจากเก่าไปใหม่เพื่อดูลำดับเหตุการณ์

### 3. Read Captures

> Goal: อ่านเนื้อหาภาพทีเลือก

1. ใช้ `read` อ่านทุกไฟล์ในกลุ่ม (รองรับ PNG/JPG)
2. บันทึก index ของแต่ละภาพ
3. ถ้าไฟล์มากเกิน 20 ไฟล์ → ขอ user ยืนยันก่อน analyze ทั้งหมด หรือเลือก top 20 ล่าสุด

### 4. Analyze Group

> Goal: วิเคราะห์บริบทจากกลุ่มภาพ

1. ดูลำดับเหตุการณ์จากภาพแรกไปภาพสุดท้าย
2. หา UI/state changes, error messages, flow ทีกำลังทำ
3. สรุป action, intent, และผลลัพธ์ทีอาจเกิดขึ้น
4. ถ้าเป็นภาพ IDE/terminal → ดึง code, commands, paths ทีปรากฏ

### 5. Report

> Goal: สรุปผลการ analyze

1. ทำ `/report-table` ด้วยคอลัมน์: No, Filename, Timestamp, Key Observations
2. สรุป overall context และ likely next steps
3. ทำ `/suggest-next-action` ถ้าจำเป็น

## Rules

### 1. Group Not Single

- ไม่ analyze แค่ไฟล์ล่าสุดไฟล์เดียว เว้นแต่ user ระบุชัดเจน
- กลุ่มต้องมีอย่างน้อย 2 ไฟล์ ถ้าได้มาเพียงไฟล์เดียว → รายงานและหยุด

### 2. Time Window

- Default ช่วงเวลาห่างกันไม่เกิน 5 นาทีจากไฟล์ล่าสุด
- ถ้า user ระบุ `time-range-or-count` ให้ใช้ค่านั้น
- ถ้าไฟล์ห่างกันเกินช่วง ให้แบ่งเป็นกลุ่มแยก และเลือกกลุ่มล่าสุด

### 3. Privacy

- ไม่อัปโหลด ไม่ส่ง ไม่แชร์ภาพออกนอกเครื่อง
- ไม่คัดลอกไฟล์ภาพไปยังที่อื่นนอกเวอร์ก์สเปซ
- ถ้าภาพมี secrets ให้ censored ใน report

### 4. Safety

- ไม่ลบ ไม่ย้าย ไม่แก้ไขไฟล์ต้นฉบับ
- ถ้าไฟล์เยอะเกิน 20 ให้ confirm ก่อน

- ใช้ /capture-terminal ถ้าจำเป็น
- ใช้ /analyze-codebase-quality ถ้าจำเป็น
- ใช้ /report-ansi ถ้าจำเป็น

## Expected Outcome

- กลุ่มภาพ capture ล่าสุดถูกเลือกตามช่วงเวลา
- ภาพทุกใบในกลุ่มถูก analyze หรือรายงานสาเหตุทีไม่ analyze
- ได้ summary ของบริบท/เหตุการณ์ทีเกิดขึ้น
- ได้ตารางรายละเอียดแต่ละภาพ
- ได้ `/suggest-next-action` ถ้ามี
