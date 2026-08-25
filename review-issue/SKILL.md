---
name: review-issue
description: ตรวจสอบ issue ใดๆ เพื่อดูความชัดเจน, scope, acceptance criteria และความพร้อม
---

## Goal

ตรวจสอบ issue (ไฟล์, chat หรือ external tracker) เพื่อดูคุณภาพ, ความชัดเจน, ความครบถ้วน และความพร้อมก่อน implementation

## Scope

ใช้สำหรับ issue source ใดๆ ไม่ใช่แค่ GitHub ครอบคลุม title, description, acceptance criteria, scope, dependencies, risks และ next steps ที่นำไปปฏิบัติได้ ไม่แก้ไข issue เว้นแต่ได้รับการร้องขอ

## Execute

### 1. Collect Issue Content

> Goal: รับข้อความและ context ของ issue แบบเต็ม

1. หากผู้ใช้ให้ไฟล์หรือ path ของ issue ให้ `read` มัน
2. หากผู้ใช้ให้หมายเลขหรือ URL ของ issue ให้ใช้ tool ที่เกี่ยวข้องหรือ `ask_user_question` เพื่อขอรายละเอียด
3. หากไม่มี issue ให้ `ask_user_question` เพื่อขอ title, body และ source
4. บันทึก source, author และ linked PRs หรือ tasks ใดๆ

### 2. Check Completeness

> Goal: ยืนยันว่า issue มีข้อมูลเพียงพอที่จะเริ่มงานได้

1. title กระชับและอธิบายปัญหาหรือเป้าหมาย
2. มี `## Goal` หรือ goal statement ที่ชัดเจน
3. `## Scope` หรือขอบเขตระบุชัดเจน
4. acceptance criteria ระบุเป็นลิสต์และตรวจสอบได้
5. dependencies, blockers และ related skills ระบุชื่อ
6. environment, version หรือ context รวมอยู่หากเกี่ยวข้อง

### 3. Assess Quality

> Goal: ระบุปัญหาด้านความชัดเจนและความเป็นไปได้

1. ทำเครื่องหมายคำสั่งที่กำกวม เช่น "do the right thing" หรือ "improve" โดยไม่ระบุรายละเอียด
2. ทำเครื่องหมาย evidence, logs, screenshots หรือ file references ที่ขาดหาย
3. ทำเครื่องหมาย scope creep หรือคำขอที่ไม่เกี่ยวข้องกันหลายรายการใน issue เดียว
4. ทำเครื่องหมายข้อความ TODO, MOCK, placeholder ที่ควรพร้อม implement
5. ระบุ issues ที่ซ้ำซ้อนหรือทับซ้อนหากทราบ
6. ตรวจว่า issue สอดคล้องกับ conventions และ global rules ของโปรเจกต์

### 4. Rate Severity And Recommend

> Goal: สร้างรายงานการตรวจสอบที่นำไปปฏิบัติได้

1. กำหนด severity: Critical, High, Medium, Low, Info
2. จัดกลุ่มผลการตรวจตาม severity พร้อม quote หรือ reference evidence
3. แนะนำ next action สำหรับแต่ละผลการตรวจ: ขอรายละเอียด, แยก issue, ดำเนินการ หรือใช้ skill เฉพาะ
4. ใช้ `report-table` หรือ `report-review` เพื่อสรุป
5. รัน `suggest-next-action`

## Rules

### 1. Neutrality
- ประเมิน issue ไม่ใช่ผู้เขียน
- ทุกผลการตรวจต้องมี quote หรือ reference จากข้อความ issue

### 2. No Hidden Edits
- ห้ามแก้ไข issue ต้นฉบับ เว้นแต่ผู้ใช้ร้องขออย่างชัดเจน
- หากแนะนำการแก้ไข ให้นำเสนอเป็น draft ก่อน

### 3. Scope Boundaries
- หาก issue มีคำขอที่ไม่เกี่ยวข้องกันหลายรายการ ให้แนะนำการแยก
- ห้ามเพิ่มงานนอกเหนือ scope ที่ระบุ

### 4. Actionable Output
- ทุกผลการตรวจต้องมีข้อแนะนำที่เป็นรูปธรรม
- ผลลัพธ์ต้องระบุความพร้อมโดยรวม: Ready, Needs Clarification, Blocked หรือ Not Ready

## Expected Outcome

- รายงานการตรวจสอบ issue พร้อม severity, evidence และข้อแนะนำ
- ระบุความพร้อมอย่างชัดเจน
- รายการข้อมูลที่ขาดหายหรือ blockers
- next action หรือ skill ที่แนะนำให้ใช้