---
name: improve-context-rot
description: ลด context rot ใน AI conversation เพื่อรักษาคุณภาพการทำงานตลอด long-horizon tasks
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

ลด context rot ใน AI conversation เพื่อรักษาคุณภาพการทำงานตลอด long-horizon tasks

## Scope

ใช้สำหรับจัดการ context degradation ใน AI coding assistant เมื่อ conversation ยาวนาน มี tool calls หลายรอบ หรือทำงาน multi-session

## Execute

### 1. Detect Context Rot
> Goal: Detect Context Rot

ตรวจจับสัญญาณ context rot ใน conversation ปัจจุบัน

1. ตรวจสอบสัญญาณวิ่งเข้า: การตอบซ้ำ, ลืม context เดิม, หลุดจาก goal, คุณภาพตอบลดลง
2. ประเมิน context size: จำนวน tool calls, ความยาว conversation, จำนวน files ที่อ่าน
3. ตรวจสอบว่า model ยังจำ goal หลักของ task อยู่หรือไม่
4. ถ้ามีสัญญาณ context rot ให้ดำเนินการ mitigate

### 2. Summarize And Preserve
> Goal: Summarize And Preserve

สรุป context สำคัญเพื่อ preserve ไว้ใช้ต่อ

1. สรุป goal หลัก, progress ปัจจุบัน, และ tasks ที่เหลือ
2. ระบุ files ที่แก้ไขแล้วและ files ที่ยังต้องทำ
3. ระบุ decisions สำคัญที่ทำไปแล้ว เพื่อไม่ให้กลับมาถามซ้ำ
4. บันทึกสรุปลงใน `progress.txt` หรือไฟล์ notes ใน workspace (ถ้าจำเป็น)
5. ใช้ `create_memory` tool สำหรับบันทึก context สำคัญที่ต้องใช้ข้าม session

### 3. Reset Context
> Goal: Reset Context

รีเซ็ต context เพื่อเริ่มต้นใหม่อย่างสะอาด

1. แนะนำผู้ใช้ให้เริ่ม conversation ใหม่เมื่อ context ใหญ่เกินไป
2. ส่งสรุปจากขั้นตอนที่ 2 เป็น context เริ่มต้นใน conversation ใหม่
3. ระบุ workflow ที่ต้องทำต่อ (เช่น `/continue`, `/loop-until-complete`)
4. ถ้าไม่สามารถเริ่ม conversation ใหม่ได้ ให้ใช้ goal reminder แทน

### 4. Apply Goal Reminders
> Goal: Apply Goal Reminders

ใช้ goal reminders เพื่อลด context drift โดยไม่ต้อง reset

1. ย้ำ goal หลักของ task ก่อนดำเนินการต่อ
2. ย้ำ constraints และ requirements สำคัญ
3. ย้ำ progress ปัจจุบันและขั้นตอนถัดไป
4. ทำซ้ำทุก 5-10 tool calls เมื่อ conversation ยาวนาน
5. ใช้ `/deep-plan` เพื่อวางแผนใหม่ถ้า goal เปลี่ยนหรือไม่ชัดเจน

### 5. Break Long Tasks
> Goal: Break Long Tasks

แบ่ง long-horizon tasks เป็น chunks เล็กลง

1. แบ่ง task ใหญ่เป็น sub-tasks ที่ทำเสร็จใน 5-10 tool calls
2. แต่ละ sub-task ต้องมีเงื่อนไขการเสร็จชัดเจน
3. ทำ `/deep-plan` เพื่อวางแผน sub-tasks ก่อนเริ่ม
4. ใช้ `/loop-until-complete` สำหรับแต่ละ sub-task
5. สรุปผลแต่ละ sub-task ก่อนไปต่อ

### 6. Manage Context Window
> Goal: Manage Context Window

จัดการ context window อย่างมีประสิทธิภาพ

1. หลีกเลี่ยงการอ่านไฟล์ใหญ่ทั้งไฟล์ ใช้ `offset` และ `limit` เพื่ออ่านเฉพาะส่วนที่จำเป็น
2. ใช้ `code_search` แทนการอ่านไฟล์ทีละไฟล์เพื่อค้นหา
3. หลีกเลี่ยงการรัน command ที่ output ยาว ใช้ `OutputCharacterCount` เพื่อจำกัด
4. รวม independent tool calls เป็น parallel calls เพื่อลดจำนวนรอบ
5. ถ้ามี tool calls มากกว่า 20 รอบ ให้พิจารณา reset context

## Rules

### 1. Detection

ตรวจจับ context rot อย่างต่อเนื่อง

- ตรวจสอบสัญญาณ context rot ทุก 10 tool calls
- ถ้าตอบซ้ำหรือลืม context ให้ reset ทันที
- ถ้าหลุดจาก goal ให้ใช้ goal reminder
- ถ้าคุณภาพตอบลดลง ให้สรุปและเริ่ม conversation ใหม่

### 2. Preservation

preserve context สำคัญก่อน reset

- สรุป goal, progress, และ tasks ที่เหลือเสมอก่อน reset
- บันทึก decisions สำคัญเพื่อไม่ให้ถามซ้ำ
- ใช้ `progress.txt` สำหรับข้อมูลที่ใช้ข้าม session
- ใช้ `create_memory` สำหรับข้อมูลที่ใช้ข้าม project

### 3. Minimal Context

ใช้ context น้อยที่สุดเท่าที่จำเป็น

- อ่านเฉพาะส่วนไฟล์ที่จำเป็น (ใช้ `offset`, `limit`)
- ใช้ `code_search` แทนการอ่านไฟล์ทีละไฟล์
- จำกัด command output ด้วย `OutputCharacterCount`
- รวม independent tool calls เป็น parallel calls
- หลีกเลี่ยงการอ่านไฟล์เดิมซ้ำหลายครั้ง

### 4. Task Decomposition

แบ่ง task ใหญ่เป็น chunks เล็ก

- แต่ละ sub-task ไม่เกิน 10 tool calls
- แต่ละ sub-task มีเงื่อนไขการเสร็จชัดเจน
- สรุปผลแต่ละ sub-task ก่อนไปต่อ
- ใช้ `/deep-plan` สำหรับวางแผน sub-tasks

### 5. Goal Alignment

รักษา goal alignment ตลอด conversation

- ย้ำ goal หลักทุก 5-10 tool calls
- ตรวจสอบว่า output ยังสอดคล้องกับ goal
- ใช้ `/suggest-next-action` เมื่อไม่แน่ใจทิศทาง
- ปรับ goal ถ้า requirements เปลี่ยน

## Expected Outcome

- Context rot ลดลง คุณภาพการทำงานคงที่ตลอด conversation
- Context สำคัญถูก preserve ข้าม session
- Long-horizon tasks ถูกแบ่งเป็น chunks ที่จัดการได้
- Context window ใช้อย่างมีประสิทธิภาพ
- Goal alignment รักษาไว้ตลอด conversation
