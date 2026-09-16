---
name: from-downloads-dir
description: ดึงกลุ่มไฟล์ล่าสุดจาก Downloads dir ตามช่วงเวลา แล้ว analyze บริบทร่วมกัน ไม่ใช่ไฟล์เดียว
argument-hint: "[time-range-or-count]"
related:
  - from-screenshots-dir
  - read-from-downloads
  - capture
  - analyze-codebase-quality
  - report
  - suggest-next-action
---

## Goal

ดึงกลุ่มไฟล์ล่าสุดจาก `C:\Users\Veerapong\Downloads` ตามช่วงเวลาหรือจำนวนกลุ่ม แล้ว analyze เนื้อหา/บริบทที่เกิดขึ้นพร้อมกัน ไม่ใช่แค่ไฟล์ล่าสุดไฟล์เดียว

## Scope

- ใช้สำหรับไฟล์ที่ save ไว้ใน `Downloads` — images, documents, archives, installers
- วิเคราะห์กลุ่มไฟล์ ไม่ใช่ไฟล์เดียว
- ไม่ upload หรือส่งไฟล์ออกไปนอก environment
- ถ้าต้องการ list/read ไฟล์เดียวตาม pattern → ใช้ `/read-from-downloads` แทน

## Execute

### 1. Locate Downloads

> Goal: หาไฟล์ทั้งหมดใน Downloads path

1. ใช้ `exec` รัน `Get-ChildItem -Path 'C:\Users\Veerapong\Downloads' -File | Sort-Object LastWriteTime -Descending`
2. บันทึกรายการไฟล์: ชื่อ, ขนาด, วันที่แก้ไข
3. ถ้าโฟลเดอร์ไม่มีไฟล์ → stop และ report

### 2. Group By Recent Window

> Goal: เลือกกลุ่มไฟล์ล่าสุดจากช่วงเวลาเดียวกัน

1. ถ้า user ระบุ `time-range-or-count` (เช่น `5m`, `30m`, `10`) → ใช้ตามนั้น
2. ถ้าไม่ระบุ → ใช้ default `5 นาที` ก่อนไฟล์ล่าสุด หรือ `10` ไฟล์ล่าสุดที่ใกล้กัน
3. กรองไฟล์ที่มี `LastWriteTime` อยู่ในช่วงเวลาเดียวกัน (ห่างกันไม่เกิน 5 นาทีต่อ default)
4. เรียงลำดับจากเก่าไปใหม่เพื่อดูลำดับเหตุการณ์

### 3. Read Files

> Goal: อ่านเนื้อหาไฟล์ที่เลือก

1. image (png, jpg, jpeg, gif, webp, bmp, svg) → ใช้ `read` อ่านเนื้อหาภาพ
2. text (txt, md, json, csv, yml, yaml, log) → ใช้ `read`
3. binary/archive (zip, exe, msi, pdf) → รายงานชื่อ ขนาด ประเภท แทนการอ่านเนื้อหา
4. ถ้าไฟล์มากเกิน 20 ไฟล์ → ขอ user ยืนยันก่อน analyze ทั้งหมด หรือเลือก top 20 ล่าสุด

### 4. Analyze Group

> Goal: วิเคราะห์บริบทจากกลุ่มไฟล์

1. ดูลำดับเหตุการณ์จากไฟล์แรกไปไฟล์สุดท้าย — ชุด download เดียวกันมัก relate กัน (installer + docs, assets ชุดเดียว)
2. หา pattern: ไฟล์จาก source เดียวกัน, versions, file sets, export bundles
3. สรุป action, intent และผลลัพธ์ที่อาจเกิดขึ้น — เช่น กำลัง setup tool, export งาน, เก็บ reference
4. ถ้าเป็น images → วิเคราะห์เนื้อหาภาพเหมือน `/from-screenshots-dir`

### 5. Report

> Goal: สรุปผลการ analyze

1. ทำ `/report` ด้วยคอลัมน์: No, Filename, Timestamp, Type, Key Observations
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

- ไม่อัปโหลด ไม่ส่ง ไม่แชร์ไฟล์ออกนอกเครื่อง
- ไม่คัดลอกไฟล์ไปยังที่อื่นนอกเวอร์ก์สเปซ
- ถ้าไฟล์ดู sensitive (credentials, personal docs) → ถาม user ก่อนอ่าน และ censored ใน report

### 4. Safety

- ไม่ลบ ไม่ย้าย ไม่แก้ไขไฟล์ต้นฉบับ
- ไม่ execute installers/binaries ที่พบ — analyze เท่านั้น
- ถ้าไฟล์เยอะเกิน 20 ให้ confirm ก่อน

- ใช้ /from-screenshots-dir ถ้าจำเป็น
- ใช้ /read-from-downloads ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น
- ใช้ `/capture` ถ้าจำเป็น
- ใช้ `/analyze-codebase-quality` ถ้าจำเป็น

## Expected Outcome

- กลุ่มไฟล์ล่าสุดถูกเลือกตามช่วงเวลา
- ไฟล์ทุกตัวในกลุ่มถูก analyze หรือรายงานสาเหตุที่ไม่ analyze
- ได้ summary ของบริบท/เหตุการณ์ที่เกิดขึ้น
- ได้ตารางรายละเอียดแต่ละไฟล์
- ได้ `/suggest-next-action` ถ้ามี
