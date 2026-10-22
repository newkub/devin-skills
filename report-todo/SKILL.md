---
name: report-todo
description: Action plan in chat as numbered bullets, one action per bullet, no table
argument-hint: "[actions-or-context]"
related:
  - report
  - suggest-next-action
---

## Goal

ตอบแผนงานในแชทเป็น bullet ที่มีหมายเลข 1, 2, 3, ... หนึ่ง action ต่อหนึ่งข้อ อ่านง่าย ไม่ใช้ตาราง

## Scope

ใช้เมื่อต้องตอบคำถามหรือแนะนำสิ่งที่ต้องทำโดยยังไม่ลงมือ หรือสรุปสถานะปัจจุบันก่อนเริ่มงาน

## Execute

### 1. Collect Actions

> Goal: รวบรวม action ที่ต้องรายงาน

1. ดึง context หรือ action จาก user/skill
2. ถ้ายังไม่มี action → ทำ `/suggest-next-action`
3. แยกแต่ละ action ให้มี single responsibility
4. เรียงตาม impact/risk จากมากไปน้อย

### 2. Write Bullets

> Goal: เขียนเป็นข้อๆ ที่อ่านง่าย

1. เขียนเป็น list มีหมายเลข `1.` `2.` `3.` ... หนึ่ง action ต่อหนึ่งบรรทัด
2. แต่ละข้อสั้นๆ: ทำอะไร → ไฟล์หรือคำสั่งที่เกี่ยว (เฉพาะที่จำเป็น)
3. ต่อท้ายด้วยเหตุผลหรือความเสี่ยงด้วย `—` เฉพาะเมื่อมีผลต่อการตัดสินใจ
4. ใช้ backtick กับ paths, skill names, commands
5. ห้ามใช้ตาราง, bold markers, และ emoji status

ตัวอย่าง:

```
1. สำรองไฟล์ rules ปัจจุบัน → `%APPDATA%\devin\AGENTS.md` — กันข้อมูลหาย
2. ย้าย harness ไป `.agents/` — ยังไม่ลบต้นฉบับจนกว่าจะตรวจครบ
3. อัปเดต reference ที่ชี้ path เดิม — ไม่งั้น `/follow-agents-md` อ่านผิด
```

### 3. Close

> Goal: บอกจุดเริ่ม

1. ปิดท้ายด้วยบรรทัดเดียว `เริ่มที่ข้อ N: ...`
2. ระบุ dependency ระหว่างข้อเฉพาะเมื่อไม่ชัดเจน

### 4. Validate

> Goal: ตรวจความครบถ้วน

1. ทุกข้อเป็น bullet และมีหมายเลขเรียงต่อกัน
2. ไม่มีตารางในผลลัพธ์
3. ทุกข้อมี action เดียว และไม่มี field ที่ไม่ให้ข้อมูล

## Rules

- ใช้เมื่อ user ถามหรือต้องการแผน โดยยังไม่ลงมือทำ
- หนึ่ง action ต่อหนึ่งข้อ
- ไฟล์ที่ระบุต้องเดาได้อย่างสมเหตุสมผล; ถ้าไม่แน่ใจให้เขียน `TBD`
- ตัด field ที่ไม่มีข้อมูลจริง ไม่ต้องเติมให้ครบ
- ตอบในแชทเท่านั้น

## Expected Outcome

- bullet ที่มีหมายเลข สั้น อ่านง่าย
- บรรทัดบอกจุดเริ่มข้อแรก
- dependency ระบุเฉพาะที่จำเป็น
