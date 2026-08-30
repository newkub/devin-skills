---
name: loop-continuous
description: วนปรับปรุงงานซ้ำจนถึงจุดทีดีพอ โดยหยุดก่อน over-engineer
related:
  - ship
  - loop-until-complete
  - run-until-pass
  - follow-loop-engineering
  - dont-over-engineer
  - improve
  - follow-your-suggestion
  - suggest-next-action
  - report-session-status
  - continue
  - deep-validate
---

## Goal

ปรับปรุงผลลัพธ์ซ้ำไปเรื่อยๆ จนกระทั่งถึงจุดที "ดีพอ" คือ ไม่สามารถทำให้ดีกว่านี้ได้อีก หรือถ้ายังทำได้แต่ impact ไม่คุ้มกับต้นทุน หรือมีแนวโน้ม over-engineering

## Scope

ใช้สำหรับงานทีสามารถ improve ได้หลายรอบ แต่ต้องหยุดตอนทีคุณค่าทีเพิ่มลดลง หรือค่าใช้จ่ายในการปรับปรุงสูงกว่าประโยชน์ทีจะได้รับ เช่น refactor, optimize, แก้ไข content, ปรับ UX, ออกแบบ schema

## Execute

### 1. Establish Baseline

> Goal: รู้จุดเริ่มต้นก่อนวนปรับปรุง

1. บันทึกสถานะปัจจุบันของงาน เช่น code, design, content, metrics
2. ระบุตัวชี้วัดหลัก (KPIs) ทีจะใช้วัด improvement เช่น performance, readability, coverage, simplicity
3. ถ้ามี test/lint/build อยู่ ให้รันเพื่อเก็บ baseline ก่อน

### 2. Define Good Enough Criteria

> Goal: กำหนดเส้นชัยทีวัดผลได้

1. ระบุ criteria ทีต้องผ่าน เช่น test ผ่าน, lint ผ่าน, typecheck ผ่าน, metrics ถึง threshold
2. ระบุ over-engineering indicators เช่น ไฟล์/บรรทัดเพิ่มขึ้นโดยไม่จำเป็น, abstraction เพิ่มแต่ไม่มี consumer, complexity สูงขึ้น
3. ตั้งค่า max iterations หรือ budget เพื่อป้องกัน infinite loop
4. ถ้าไม่มาตรฐานชัดเจน ให้ทำ `/ask-me` ก่อนดำเนินการ

### 3. Iterate And Evaluate

> Goal: ปรับปรุงทีละรอบและวัดผล

1. เลือกสิ่งเดียวที improve ได้มากทีสุดในรอบนี้
2. ใช้ minimal changes ในการปรับปรุง
3. รัน verify ตาม criteria ทีกำหนด เช่น `/run-check`, `/run-test`, `/deep-validate`
4. บันทึก delta ระหว่างรอบ: ดีขึ้นหรือไม่, ดีขึ้นเท่าใด, มี regression หรือไม่

### 4. Check Diminishing Returns

> Goal: ประเมินว่าคุ้มค่าหรือไม่ทีจะทำต่อ

1. ถ้าผลลัพธ์เท่าเดิม หรือดีขึ้นไม่ถึง threshold ให้หยุด
2. ถ้าจะดีขึ้นได้ต้องใช้ทรัพยากร/เวลา/ความซับซ้อนมากกว่าประโยชน์ทีได้ ให้หยุด
3. ถ้าการปรับปรุงครั้งถัดไปทำให้ abstraction, dependency, หรือ complexity เพิ่มผิดสัดส่วน ให้หยุด
4. ถ้ายังไม่ถึง max iterations และยังมี improvement ทีชัดเจน ให้ทำต่อ

### 5. Decide Continue Or Stop

> Goal: ตัดสินใจอย่างมีเหตุผลว่าหยุดหรือทำต่อ

1. ถ้า criteria ทั้งหมดผ่าน และไม่มี improvement ทีมีนัยสำคัญ ให้หยุด
2. ถ้ายังไม่ผ่าน criteria แต่ improvement ลดลงจนไม่คุ้ม cost ให้หยุดและ report
3. ถ้าพบวิธีทีดีกว่าที impact สูง ให้ทำต่อในรอบถัดไป
4. ถ้าคิดไม่ออกว่าจะดีขึ้นอย่างไร ให้ทำ `/suggest-next-action` หรือ `/ask-me`

### 6. Finalize And Report

> Goal: สรุปผลและส่งมอบ

1. รัน `/run-check` หรือ `/deep-validate` ครั้งสุดท้าย
2. สรุปจำนวนรอบ, สิ่งทีเปลี่ยน, metrics before/after, และเหตุผลทีหยุด
3. ทำ `/report-table` แสดง progress ตามลำดับรอบ
4. ถ้าพร้อม ให้ทำ `/ship` หรือ `/continue` ตาม context

## Rules

### 1. Stop Conditions

- หยุดเมื่องานดีพอตาม criteria ทีกำหนด
- หยุดเมื่องานไม่สามารถดีขึ้นได้อีกโดยไม่เพิ่ม cost หรือ risk
- หยุดเมื่องานถัดไปมี impact น้อยกว่าต้นทุน
- ถ้าถึง max iterations ให้หยุดและ report สาเหตุ

### 2. Over-Engineering Guardrails

- ห้ามสร้าง abstraction, layer, dependency ใหม่ถ้าไม่จำเป็นจริงๆ
- ห้าม optimize ส่วนทีไม่ใช่ bottleneck หรือไม่มี evidence
- ห้ามเพิ่ม features หรือ config นอก scope ปัจจุบัน
- ถ้ามีข้อสงสัยว่า over-engineer ให้ทำ `/dont-over-engineer`

### 3. Measurement And Evidence

- ทุกรอบต้องมีข้อมูลเปรียบเทียบ before/after
- ใช้ตัวเลข, test result, lint score, หรือ metrics จริง ไม่ใช้ความรู้สึก
- บันทึกสิ่งทีทดลองแล้วไม่ได้ผลเพื่อไม่วนซ้ำ

### 4. Safety

- ทำ dry run ก่อน action ทีเปลี่ยนแปลงเยอะ
- ไม่ทำ destructive action โดยไม่มี user confirmation
- ถ้าพบว่างานเริ่มแย่ลงหรือ drift ออกจาก goal ให้หยุดทันที

## Expected Outcome

- งานถูกปรับปรุงซ้ำจนถึงจุดทีดีพอ
- มีบันทึกรอบ, metrics, และเหตุผลทีหยุด
- ไม่เกิด over-engineering หรือ scope creep
- ผลลัพธ์พร้อม validate และ ship
