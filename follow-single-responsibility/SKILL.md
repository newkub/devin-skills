---
name: follow-single-responsibility
description: แยก task หรือ prompt ออกเป็นหน่วยงานย่อยทีละอย่าง (single responsibility)
---

## Goal

แยก task หรือ prompt ของ user ออกเป็นรายการ numbered list ทีแต่ละข้อมีหน่วยงานเดียว เพื่อง่ายต่อ planning, delegation, และติดตามผล

## Scope

ใช้เมื่อ prompt หรือ task มีหลายคำขอ/หลายงานผสมกัน ก่อนเริ่ม plan หรือ implement

## Execute

### 1. Parse Input
> Goal: เข้าใจความต้องการที user ระบุ
1. อ่าน prompt ล่าสุดและ context ทีเกี่ยวข้อง
2. ระบุ goal หลัก, ขอบเขต, และ expected outcome
3. ระบุ constraints, references, และ files ทีเกี่ยวข้อง
4. ถ้า input ไม่ชัดเจน → ทำ `/ask-me` ก่อนดำเนินการ

### 2. Decompose
> Goal: แยกงานออกเป็นหน่วยย่อยทีละอย่าง
1. แยกแต่ละคำสั่ง/คำขอออกจากกัน
2. ตรวจสอบว่าแต่ละข้อทำสิ่งเดียวเท่านั้น
3. ถ้าข้อไหนมีหลายงาน → แบ่งย่อยอีก
4. เรียงลำดับตาม dependency หรือลำดับการทำงานทีเหมาะสม

### 3. Format
> Goal: นำเสนอผลลัพธ์ในรูปแบบเข้าใจง่าย
1. สรุปแต่ละข้อด้วยประโยคสั้น กระชับ ชัดเจน
2. ใช้รูปแบบ `N. <responsibility> — <short detail>`
3. จัดลำดับตาม prepare → read → research → analyze → write → validate → report ถ้าเป็นไปได้

### 4. Hand Off
> Goal: พร้อมให้ step ถัดไปรับผิดชอบ
1. แสดง numbered list ในแชททันที
2. ไม่ลงมือ implement หรือแก้ไขไฟล์ใดๆ ในขั้นตอนนี้
3. ถ้าต้องการ → ทำ `/report-plan` หรือ `/continue` ต่อไป

## Rules

### 1. One Thing Per Item
- ข้อเดียวทำสิ่งเดียว ห้ามรวมหลายคำขอในข้อเดียว
- ถ้าพบคำว่า "และ" หรือ "," หลายตัวในข้อเดียว → แบ่งย่อย

### 2. Preserve Original Intent
- รักษาความหมายและข้อกำหนดดั้งเดิมของ prompt
- ไม่เพิ่ม scope หรือลด scope โดยไม่มีเหตุผล

### 3. Use Same Language
- ใช้ภาษาเดียวกับ prompt ต้นทาง (ไทยหรืออังกฤษ)
- ไม่สลับภาษาระหว่างข้อ

### 4. No Execution
- ไม่แก้ไขไฟล์ ไม่รัน commands และไม่ลงมือ implement
- เป็นเพียงการสรุป task เท่านั้น

## Expected Outcome

- Numbered list ทีอ่านง่าย แต่ละข้อมี single responsibility
- ไฟล์/งานทีเกี่ยวข้องระบุชัดเจน
- ข้อกำหนดของ user ถูกถ่ายทอดครบถ้วนโดยไม่เพิ่มหรือลด
- พร้อมส่งต่อให้ `/report-plan` หรือ `/continue`
