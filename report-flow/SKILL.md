---
name: report-flow
description: สรุปขั้นตอน workflow หรือกระบวนการเป็นลำดับ step ทีอ่านง่าย
---

## Goal

สรุปกระบวนการ, workflow หรือขั้นตอนการทำงานเป็นรายการ step-by-step ทีอ่านง่าย ติดตามได้ และนำไปใช้ซ้ำได้

## Scope

ใช้เมื่อต้องการอธิบาย flow ของ process, algorithm, user journey, หรือ task ให้ผู้อื่นเข้าใจตามลำดับ

## Execute

### 1. Identify Flow

> Goal: ระบุกระบวนการทีต้องสรุป

1. รับ topic หรือ process จาก user หรือ context
2. ระบุ trigger หรือจุดเริ่มต้น
3. ระบุ output หรือจุดจบ
4. ระบุ stakeholders หรือ systems ที่เกี่ยวข้อง

### 2. Extract Steps

> Goal: แยกกระบวนการออกเป็น steps

1. รวบรวมขั้นตอนทั้งหมดจาก source (code, docs, conversation, observation)
2. จัดลำดับตามเวลา/dependency
3. กรอง steps ที่ซ้ำซ้อนหรือไม่จำเป็น
4. ถ้ามี branches หรือ conditions → ระบุ decision points

### 3. Structure Steps

> Goal: เขียน steps ในรูปแบบทีอ่านง่าย

1. ใช้ continuous numbering `1.`, `2.`, `3.`
2. ถ้ามี sub-step ใช้ `1.1`, `1.2`
3. แต่ละ step ระบุ action, responsible party, input, output
4. ใช้ `>` สำหรับ decision/condition เช่น `> ถ้า X → ทำ A, ถ้าไม่ → ทำ B`
5. ถ้ามี loop → ระบุ condition ทีกลับไปทำซ้ำ

### 4. Add Context

> Goal: เพิ่มข้อมูลทีช่วยเข้าใจ flow

1. ระบุเครื่องมือ/ระบบที่ใช้ในแต่ละ step
2. ระบุข้อมูล input/output ที่สำคัญ
3. ระบุเงื่อนไขหรือข้อจำกัด
4. ระบุ failure path ถ้ามี

### 5. Format And Report

> Goal: นำเสนอ flow ให้สวยงามและใช้งานได้

1. ใช้ `/report-table` สรุป overview: Step, Action, Input, Output, Tool
2. แสดงลำดับ steps แบบ numbered list
3. ถ้ามี branches → ใช้ nested list หรือ flow chart ASCII
4. ทำ `/suggest-next-action`

## Rules

### 1. One Action Per Step

- แต่ละ step ควรมี action เดียวทีชัดเจน
- ถ้ามีหลาย action → แยกย่อย
- ไม่รวมหลายระบบเข้าด้วยกันโดยไม่ระบุชัด

### 2. Deterministic Flow

- ระบุเงื่อนไขทุกครั้งทีมี decision
- ไม่เดา flow ถ้า input ไม่ชัด
- ถ้ามีหลายทางเลือก → ระบุ default path

### 3. Reusability

- ใช้ภาษาที general ไม่เจาะจงเครื่องมือมากเกินไป
- ระบุ inputs/outputs ทีชัดเจนเพื่อนำไปใช้ซ้ำ
- เก็บ flow ในไฟล์ `docs/flows/` ถ้าต้องการใช้ซ้ำ

## Expected Outcome

- กระบวนการถูกสรุปเป้น steps ต่อเนื่อง
- แต่ละ step มี action, input, output ชัดเจน
- ระบุ branches, loops, decision points
- report สวยงาม อ่านง่าย พร้อม next action
