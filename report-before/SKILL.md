---
name: report-before
description: รายงานสถานะปัจจุบันก่อนเริ่มทำงาน แล้วดำเนินการต่อทันที
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
- deep-report
- report-plan
- analyze-project
- scan-codebase
- report-format-table
- suggest-next-action
---

## Goal

รายงานสถานะปัจจุบันของ workspace ก่อนเริ่มทำงาน แล้วดำเนินการต่อทันทีโดยไม่หยุดรอ

## Scope

ใช้กับทุก task ที่ต้องเข้าใจสถานะปัจจุบันก่อนลงมือ เพื่อให้ผู้ใช้ทราบสิ่งที่จะเปลี่ยนแปลงและตัดสินใจได้

## Execute

### 1. Analyze Current State

วิเคราะห์สถานะปัจจุบันของ workspace ก่อนเริ่มงาน

> Goal: ทราบสถานะปัจจุบันและสิ่งที่จะเปลี่ยนแปลง

1. ทำ `analyze-project` เพื่อวิเคราะห์โครงสร้างและ dependencies
2. ทำ `scan-codebase` เพื่อสแกน codebase เบื้องต้น
3. ระบุไฟล์ที่เกี่ยวข้องและผลกระทบต่อระบบ

> Goal: มีข้อมูลสถานะปัจจุบันครบสำหรับสร้าง report

### 2. Report Current State

รายงานสถานะปัจจุบันให้ผู้ใช้ทราบก่อนดำเนินการ

> Goal: ผู้ใช้ทราบสถานะปัจจุบันและสิ่งที่จะเปลี่ยนแปลง

1. ทำ `deep-report` เพื่อสร้าง deep report ของสถานะปัจจุบัน
2. สรุป findings สำคัญและสิ่งที่จะเปลี่ยนแปลงเป็น bullet points สั้นๆ
3. ระบุไฟล์ที่จะกระทบและประเภทการเปลี่ยนแปลง

> Goal: ผู้ใช้ได้รับ report ที่ชัดเจนก่อนเริ่มงาน

### 3. Proceed Immediately

ดำเนินการต่อทันทีหลัง report โดยไม่หยุดรอ

> Goal: เริ่มทำงานได้ทันทีหลัง report

1. ทำ `report-plan` เพื่อวางแผนการทำงาน
2. ดำเนินการตามแผนทันที ไม่ต้องรอการยืนยัน
3. ถ้าพบเรื่องเสี่ยงสูงระหว่างทำ → หยุดและใช้ `ask-me`

> Goal: งานเริ่มต้นทันทีหลัง report โดยไม่ชะลอ

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-format-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-format-terminal` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Report First Always

- ทุก task ต้อง report สถานะปัจจุบันก่อนเริ่มงาน
- report ต้องกระชับ ชัดเจน และมี evidence
- ไม่ข้ามขั้นตอน report โดยไม่มีเหตุผล

### 2. No Waiting After Report

- หลัง report ให้ดำเนินการต่อทันที
- ไม่หยุดรอการยืนยันจากผู้ใช้ ยกเว้นเรื่องเสี่ยงสูง
- ถ้าเรื่องเสี่ยงสูง → ใช้ `ask-me` ก่อนดำเนินการ

### 3. Deep Report Integration

- ใช้ `deep-report` สำหรับ report ที่ละเอียด
- ใช้ `report-plan` สำหรับแผนการทำงาน
- ถ้า task เล็ก → สรุปสั้นๆ พอ ไม่ต้อง deep report เต็มรูปแบบ

### 4. Evidence Based

- report ต้องอิงจากข้อมูลจริงใน codebase
- ระบุไฟล์และบรรทัดที่เกี่ยวข้อง
- ไม่กล่าวอ้างผลที่ยังไม่ตรวจสอบ

## Expected Outcome

- ผู้ใช้ทราบสถานะปัจจุบันก่อนเริ่มงาน
- งานดำเนินการต่อทันทีหลัง report โดยไม่ชะลอ
- มี evidence ชัดเจนสำหรับทุกการเปลี่ยนแปลง
- เรื่องเสี่ยงสูงมีการยืนยันก่อนดำเนินการ
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
