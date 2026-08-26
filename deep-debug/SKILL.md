---
name: deep-debug
description: Debug อย่างละเอียดหลายมิติ ตั้งแต่ reproduce จนถึง prevent recurrence
---

## Goal

Debug อย่างละเอียดหลายมิติ: reproduce, isolate, root cause, fix, regression test, verify, prevent recurrence

## Scope

ใช้สำหรับ debug ที่ซับซ้อน ต้องการ systematic approach ครบวงจร ไม่ใช่แค่หาสาเหตุเฉพาะหน้า

สำหรับ debug แบบปกติ ใช้ `/debug-issue`, สำหรับแก้ error เฉพาะ ใช้ `/resolve-errors`

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ (Step N ขึ้นกับ Step N-1)

### 1. Deep Thinking Phase

> Goal: วางแผน debug อย่างเป็นระบบก่อนเริ่ม investigate

1. ทำ `/deep-thinking` เพื่อกำหนด debug objectives: อาการ, ความถี่, ผลกระทบ
2. ระบุ debug dimensions ที่เกี่ยวข้อง: runtime, network, database, UI, config
3. สร้าง debug strategy ก่อนเริ่ม investigate
4. ถ้าซับซ้อนมาก → ทำ `/deep-research` หา known issues ที่คล้ายกัน

### 2. Reproduce And Define

> Goal: Reproduce ปัญหาและนิยามให้ชัดเจน

1. ทำ `/follow-debugging` เพื่อ reproduce ปัญหา ถ้า reproduce ไม่ได้ให้หาเงื่อนไขที่ทำให้เกิด
2. เขียนนิยามปัญหา: Expected, Actual, Scope, Frequency
3. บันทึก environment: runtime version, OS, config, dependencies
4. ถ้า reproduce ไม่ได้ → stop และ report ไม่ฝืน debug

### 3. Hypothesis Generation

> Goal: สร้าง hypothesis list 3-5 ข้อพร้อม prior probability

1. สร้าง hypothesis H = {H₁, H₂, ..., Hₙ} จากอาการและ environment
2. กำหนด prior probability P(H) สำหรับแต่ละ hypothesis (0.1-0.9)
3. จัดลำดับตาม probability สูงก่อน
4. ระบุ evidence ที่ต้องการเพื่อยืนยันหรือปฏิเสธแต่ละ hypothesis

### 4. Systematic Elimination

> Goal: ใช้ Bayesian Inference และ Information Theory เพื่อตัด hypothesis

1. คำนวณ Information Gain สำหรับแต่ละ test ที่ทำได้
2. เลือก test ที่ให้ Information Gain สูงสุดก่อน
3. ทำ test ทีละอย่าง ปรับ P(H|E) หลังแต่ละ test
4. ตัด hypothesis ที่ P(H|E) < 0.05
5. ทำซ้ำจนเหลือ hypothesis ที่ P(H|E) → 1.0
6. ถ้าทุก hypothesis ถูกตัด → กลับไป Step 3 สร้าง hypothesis ใหม่

### 5. Isolate And Confirm Root Cause

> Goal: ยืนยัน root cause ด้วยการ isolate variable

1. เปลี่ยนทีละอย่างเท่านั้น: config, dependency, runtime, code
2. ไล่จากบนลงล่าง: UI → Terminal → Shell → Runtime → OS
3. ยืนยัน root cause ด้วย 3 เงื่อนไข: reproduce ได้, fix แล้วหาย, กลับมา error ถ้าถอย fix
4. ทำ `/analyze-root-cause-analysis` เพื่อวิเคราะห์หาสาเหตุหลักอย่างละเอียด
5. ถ้าไม่ผ่าน 3 เงื่อนไข → กลับไป Step 4

### 6. Fix At Root Cause

> Goal: แก้ปัญหาที่ root cause ด้วย minimal changes

1. แก้ปัญหาที่ root cause ไม่ใช่ symptoms ใช้ minimal changes ที่สุด
2. ถ้า fix กระทบหลายไฟล์ → ทำ `/update-reference` อัปเดท references
3. ถ้า fix มี side effects → ทำ `/resolve-errors` จนกว่าจะไม่มี error ใหม่
4. ถ้า fix ไม่ได้ → stop และ report

### 7. Regression Tests

> Goal: สร้าง regression tests จาก reproduction steps

1. ทำ `/write-test` เพื่อสร้าง test จาก reproduction steps ใน Step 2
2. ทดสอบว่า test fail ก่อน fix และ pass หลัง fix
3. ครอบคลุม edge cases ที่เกี่ยวข้อง
4. รัน test suite ทั้งหมดเพื่อยืนยันไม่มี regression
5. ถ้ามี regression → กลับไป Step 6 แก้ fix

### 8. Verify And Prevent

> Goal: Verify จนกว่าจะผ่านทุกเงื่อนไขและป้องกันการเกิดซ้ำ

1. ทำ `/loop-until-complete` เพื่อรัน test suite ทั้งหมดจนกว่าจะผ่าน 100%
2. ทำ `/run-verify` เพื่อตรวจสอบ lint และ typecheck ผ่าน
3. ระบุ root cause ในระดับ process: ทำไมปัญหานี้ถึงเกิดขึ้นได้
4. แนะนำ preventive measures: linter rules, type constraints, code review checklist
5. ทำ `/memorize` เพื่อบันทึก root cause และ prevention สำหรับ future reference
6. ถ้าเกิน 3 รอบแล้วยังไม่ผ่าน → stop และ report

### 9. Report

> Goal: สร้างตารางสรุปผลและแนะนำขั้นต่อไป

1. ทำ `/report-table` เพื่อสร้างตาราง: Step, Hypothesis, P(H|E), Test, Result, Status
2. สรุป root cause, fix, regression tests, preventive measures
3. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. Systematic Approach

> Goal: debug อย่างเป็นระบบ ไม่เดา

- ห้ามเดา ต้องมี hypothesis และ evidence
- ห้ามแก้หลายอย่างพร้อมกัน เปลี่ยนทีละอย่าง
- ต้อง isolate variable ก่อน confirm root cause
- ต้องผ่าน 3 เงื่อนไข: reproduce, fix หาย, ถอย fix กลับมา error
- ถ้าปัญหาเกี่ยวกับ git → ใช้ `/git-debug` แทน

### 2. Bayesian Method

> Goal: ใช้ Bayesian Inference อย่างถูกต้อง

- กำหนด prior probability สำหรับทุก hypothesis
- เลือก test ที่มี Information Gain สูงสุดก่อน
- ตัด hypothesis ที่ P(H|E) < 0.05
- ถ้าทุก hypothesis ถูกตัด ให้สร้าง hypothesis ใหม่

### 3. Regression Safety

> Goal: ทุก bug fix ต้องมี regression test

- ทุก bug fix ต้องมี regression test
- Test ต้อง fail ก่อน fix และ pass หลัง fix
- รัน test suite ทั้งหมดเพื่อยืนยันไม่มี regression
- ถ้ามี regression ให้กลับไปแก้ fix

### 4. Error Handling

> Goal: หยุดเมื่อไม่สามารถดำเนินต่อได้อย่างปลอดภัย

- ถ้า reproduce ไม่ได้ → stop และ report
- ถ้า fix ไม่ได้ → stop และ report
- ถ้าเกิน 3 รอบแล้วยังไม่ผ่าน → stop และ report
- ถ้าซับซ้อนมาก → ทำ `/deep-thinking` ก่อน debug

### 5. Prevention

> Goal: ป้องกันการเกิดปัญหาซ้ำ

- ระบุ root cause ในระดับ process ไม่ใช่แค่ code
- แนะนำ preventive measures ที่ actionable
- บันทึก root cause และ prevention ด้วย `/memorize` สำหรับ future reference

## Expected Outcome

1. Root cause ถูกระบุอย่างชัดเจนด้วย evidence
2. Bug ถูกแก้ที่ root cause ไม่ใช่ symptoms
3. Regression tests ป้องกันปัญหาซ้ำ
4. Preventive measures ลดความเสี่ยงการเกิดปัญหาใหม่
5. ตารางสรุปผล: hypothesis, test, result, status