---
name: dont-ask
description: ดำเนินการโดยไม่ถามผู้ใช้เมื่อคำตอบชัดเจนหรืองานมีความเสี่ยงต่ำ
related:
  - ask-me
  - continue
  - follow-your-suggestion
  - ask-project-requirement
  - suggest-next-action
---

## Goal

ตัดสินใจและดำเนินการต่อทันทีโดยไม่ถามผู้ใช้ เมื่อ context ชัดเจน เลือกทางเลือกได้เอง หรืองานเป็น low-risk

## Scope

ใช้เมื่อ task หรือ workflow ระบุให้ "ไม่ถาม" หรือคำตอบมีได้ทางเดียวที่ปลอดภัย ไม่ใช่เก็บ requirement หรือความชอบ

## Execute

### 1. Evaluate Context

> Goal: ตรวจสอบว่าสามารถไม่ถามได้

1. อ่าน context, memory, project conventions, และ `AGENTS.md`
2. ตรวจว่าทางเลือกมีผลลัพธ์ชัดเจนและปลอดภัย
3. ถ้ายังไม่ชัดเจน → ใช้ `/ask-me` หรือ `/ask-project-requirement` ตามลำดับ

### 2. Pick Safe Default

> Goal: เลือกทางเลือกที่ง่ายและปลอดภัยที่สุด

1. เลือกทางเลือกที่มี risk ต่ำที่สุด
2. อ้างอิง best practices และ project conventions
3. ถ้ามีหลายทางเลือกที่เท่ากัน เลือกตัวที่ง่ายและถอยกลับได้

### 3. Proceed

> Goal: ดำเนินการทันที

1. ดำเนินการตามทางเลือกที่เลือก
2. ไม่ใช้ `ask_user_question`, ไม่แสดง prompt ให้เลือก, ไม่เรียก `/follow-your-suggestion`
3. บันทึกการตัดสินใจใน memory หรือ report

### 4. Report

> Goal: รายงานผลและ next step

1. สรุปสิ่งที่ทำและเหตุผลที่ไม่ถาม
2. ระบุ default ที่ใช้
3. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Rules

### 1. When To Skip Asking

ไม่ถามเมื่อ:

- คำตอบชัดเจนจาก context หรือ memory
- เป็น low-risk action ที่ทำได้เลย
- ผู้ใช้ระบุ `dont-ask`, `no ask`, `proceed`, หรือ `continue`
- มี convention หรือ default ที่ชัดเจน

### 2. When To Still Ask

ถามได้หาก:

- มีหลายทางเลือกที่ต่างกันมาก
- มีความเสี่ยงสูง เช่น ลบข้อมูล, overwrite, deploy
- ข้อมูลไม่เพียงพอ

### 3. No Prompt Discipline

- ห้ามใช้ `ask_user_question` ใน `/dont-ask` flow
- ห้ามแสดง prompt ให้เลือกทางเลือก
- ห้ามเรียก `/follow-your-suggestion` เพื่อขอคำยืนยัน
- ใช้ `/continue` ถัดไปได้

### 4. Safety

- ไม่ดำเนินการที่เป็นอันตรายโดยไม่ยืนยัน
- ถ้าเกิดข้อสงสัยระหว่างทำ → หยุดและ report ไม่ถาม

## Expected Outcome

- ลดการถามที่ไม่จำเป็น
- งานเสร็จเร็วขึ้นโดยไม่เสี่ยง
- การตัดสินใจมีเหตุผลและ traceable
- ไม่ทำให้ผู้ใช้ต้องตอบคำถามซ้ำ
