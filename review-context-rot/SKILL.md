---
name: review-context-rot
description: Review context rot controls in long analysis and multi-session workflows
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
  - review-codebase
  - suggest-next-action
  - validate
---

## Goal

Review context rot detection, preservation, reset practices, goal reminders, task decomposition, and context window management in long analysis or sessions พร้อมรายงาน findings และ review score

## Scope

ใช้สำหรับ review การจัดการ context degradation ใน AI conversation ระหว่าง long analysis หรือ sessions ยาว มี tool calls หลายรอบ หรือทำงานข้าม session

## Execute

### 1. Review Context Rot Detection
> Goal: ตรวจสอบว่ามีการตรวจจับ context rot ใน session ปัจจุบัน

1. ตรวจสอบว่ามีการตรวจสอบสัญญาณเตือนเข้าของ context rot: การตอบซ้ำ, ลืม context เดิม, หลุดจาก goal, คุณภาพตอบลดลง
2. ตรวจสอบว่ามีการประเมิน context size: จำนวน tool calls, ความยาว conversation, จำนวน files ที่อ่าน
3. ตรวจสอบว่า model ยังจำ goal หลักของ task ได้หรือไม่
4. ถ้าพบสัญญาณ context rot ให้บันทึกเป็น finding

### 2. Review Context Preservation
> Goal: ตรวจสอบว่ามีการสรุปและ preserve context สำคัญ

1. ตรวจสอบว่ามีการสรุป goal หลัก, progress ปัจจุบัน, และ tasks ที่เหลือ
2. ตรวจสอบว่ามีการระบุ files ที่แก้ไขแล้วและ files ที่ยังต้องทำ
3. ตรวจสอบว่ามีการระบุ decisions สำคัญที่ทำไปแล้ว
4. ตรวจสอบว่ามีการบันทึกสรุปลง `progress.txt` หรือไฟล์ notes ใน workspace
5. ตรวจสอบว่ามีการใช้ `create_memory` สำหรับบันทึก context สำคัญข้าม session

### 3. Review Context Reset Practices
> Goal: ตรวจสอบว่ามีการ reset context ทันเวลา

1. ตรวจสอบว่ามีการแนะนำให้เริ่ม conversation ใหม่เมื่อ context ใหญ่เกินไป
2. ตรวจสอบว่ามีการส่งสรุปจากขั้นตอนที่ 2 เป็น context เริ่มต้น
3. ตรวจสอบว่ามีการระบุ workflow ที่ต้องทำต่อ (เช่น `/continue`, `/loop-until-complete`)
4. ตรวจสอบว่ามีการใช้ goal reminder แทนเมื่อไม่สามารถ reset ได้

### 4. Review Goal Reminder Usage
> Goal: ตรวจสอบว่ามีการใช้ goal reminders เพื่อลด context drift

1. ตรวจสอบว่ามีการย้ำ goal หลักของ task ก่อนดำเนินการต่อ
2. ตรวจสอบว่ามีการย้ำ constraints และ requirements สำคัญ
3. ตรวจสอบว่ามีการย้ำ progress ปัจจุบันและขั้นตอนถัดไป
4. ตรวจสอบความถี่ของ goal reminders ทุก 5-10 tool calls
5. ตรวจสอบว่ามีการใช้ `/deep-plan` เมื่อ goal เปลี่ยนหรือไม่ชัดเจน

### 5. Review Task Decomposition
> Goal: ตรวจสอบว่า long-horizon tasks ถูกแบ่งเป็น chunks เล็กลง

1. ตรวจสอบว่า task ใหญ่ถูกแบ่งเป็น sub-tasks ที่ทำเสร็จใน 5-10 tool calls
2. ตรวจสอบว่าแต่ละ sub-task มีเงื่อนไขการเสร็จชัดเจน
3. ตรวจสอบว่ามีการใช้ `/deep-plan` เพื่อวางแผน sub-tasks
4. ตรวจสอบว่ามีการใช้ `/loop-until-complete` สำหรับแต่ละ sub-task
5. ตรวจสอบว่ามีการสรุปผลแต่ละ sub-task ก่อนไปต่อ

### 6. Review Context Window Management
> Goal: ตรวจสอบว่ามีการจัดการ context window อย่างมีประสิทธิภาพ

1. ตรวจสอบว่ามีการหลีกเลี่ยงการอ่านไฟล์ใหญ่ทั้งไฟล์ โดยใช้ `offset` และ `limit`
2. ตรวจสอบว่ามีการใช้ `code_search` แทนการอ่านไฟล์ทีละไฟล์
3. ตรวจสอบว่ามีการหลีกเลี่ยงการรัน command ที่ output ยาว โดยใช้ `OutputCharacterCount`
4. ตรวจสอบว่ามีการรวม independent tool calls เป็น parallel calls
5. ตรวจสอบว่ามีการพิจารณา reset context เมื่อ tool calls มากกว่า 20 รอบ

### 7. Validate Findings
> Goal: ตรวจสอบความถูกต้องของ findings

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives ที่พบ

### 8. Report
> Goal: รายงานผล review

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Context Rot Review Findings: Category, Finding, Severity, Location, Recommendation
3. สร้างตาราง Recommended Actions: Priority, Action, Impact, Effort, Workflow
4. แสดง context rot review score พร้อม progress bar และ grade
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Detection

- ตรวจสอบการตรวจจับ context rot ทุก 10 tool calls
- ถ้าตอบซ้ำหรือลืม context ควร reset ทันที
- ถ้าหลุดจาก goal ควรใช้ goal reminder
- ถ้าคุณภาพตอบลดลง ควรสรุปและเริ่ม conversation ใหม่

### 2. Preservation

- สรุป goal, progress, และ tasks ที่เหลือเสมอก่อน reset
- บันทึก decisions สำคัญเพื่อไม่ให้ถามซ้ำ
- ใช้ `progress.txt` สำหรับข้อมูลที่ใช้ข้าม session
- ใช้ `create_memory` สำหรับข้อมูลที่ใช้ข้าม project

### 3. Minimal Context

- อ่านเฉพาะส่วนไฟล์ที่จำเป็น (ใช้ `offset`, `limit`)
- ใช้ `code_search` แทนการอ่านไฟล์ทีละไฟล์
- จำกัด command output ด้วย `OutputCharacterCount`
- รวม independent tool calls เป็น parallel calls
- หลีกเลี่ยงการอ่านไฟล์เดิมซ้ำหลายครั้ง

### 4. Task Decomposition

- แต่ละ sub-task ไม่เกิน 10 tool calls
- แต่ละ sub-task มีเงื่อนไขการเสร็จชัดเจน
- สรุปผลแต่ละ sub-task ก่อนไปต่อ
- ใช้ `/deep-plan` สำหรับวางแผน sub-tasks

### 5. Goal Alignment

- ย้ำ goal หลักทุก 5-10 tool calls
- ตรวจสอบว่า output ยังสอดคล้องกับ goal
- ใช้ `/suggest-next-action` เมื่อไม่แน่ใจทิศทาง
- ปรับ goal ถ้า requirements เปลี่ยน

### 6. Severity Classification

- Critical: สูญเสีย goal หลัก, ลืม decisions สำคัญ, ทำงานซ้ำโดยไม่จำเป็น, หลุดจาก scope อย่างมาก, context rot ทำให้ผลผิดพลาด
- High: คุณภาพตอบลดลงชัดเจน, ไม่มีการ preserve context, ไม่มี goal reminders ใน session ยาว
- Medium: อ่านไฟล์ซ้ำหรืออ่านเกินจำเป็น, sub-task ไม่ชัดเจน, ไม่มี progress summary
- Low: ข้อความ goal reminder ไม่สม่ำเสมอ, จัดการ context window ได้ปานกลาง

### 7. Health Score Formula

- 6 metrics หลัก:
  1. Context Rot Detection
  2. Context Preservation
  3. Context Reset Practices
  4. Goal Reminder Usage
  5. Task Decomposition
  6. Context Window Management
- คะแนนต่อ metric: ผ่าน = 1, มี warning = 0.5, ไม่ผ่าน = 0
- Review score = (total score / 6) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 8. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Context rot ถูก detect, preserve, reset, และ manage ได้ดี
- Context สำคัญถูก preserve ข้าม session
- Long-horizon tasks ถูกแบ่งเป็น chunks ที่จัดการได้
- Context window ใช้อย่างมีประสิทธิภาพ
- Goal alignment รักษาไว้ตลอด conversation
- รายงาน findings พร้อม severity, review score, และ action items
