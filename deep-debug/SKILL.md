---
name: deep-debug
description: Debug อย่างละเอียดหลายมิติ ตั้งแต่ reproduce จนถึง prevent recurrence
related:
  - git-debug
  - check-git-files-history
  - search-in-git
  - analyze-root-cause-analysis
  - resolve-errors
  - update-test
  - follow-debugging
  - follow-incident-triage
  - deep-thinking
  - deep-retro
  - deep-impact
  - deep-trace
  - report-table
---

## Goal

หา root cause ของปัญหาอย่างเป็นระบบ ตั้งแต่ triage, reproduce, isolate, fix, regression test, verify และ prevent recurrence โดยลดการเดาและแก้หลายอย่างพร้อมกัน

## Scope

ใช้สำหรับ debug ที่ซับซ้อน ต้องการ systematic approach ครบวงจร ไม่ใช่แค่หาสาเหตุเฉพาะหน้า

ครอบคลุมทั้ง VSCode, terminal, shell, runtime และ OS layers
ไม่ใช้สำหรับ debug ปัญหาที่เกี่ยวกับ git โดยเฉพาะ — ใช้ `/git-debug` แทน
สำหรับแก้ error เฉพาะที่รู้สาเหตุแล้ว ใช้ `/resolve-errors`

## Execute

### 1. Triage And Reproduce

> Goal: จัดลำดับความสำคัญและสร้างปัญหาซ้ำได้

1. ทำ `/follow-incident-triage` เพื่อจัดลำดับความสำคัญและกำหนด action plan
2. เขียนปัญหาให้ชัดเจน: Expected, Actual, Scope (VSCode / OS / app / API), Frequency
3. บันทึก environment: runtime version, OS, config, dependencies
4. ทำ `/follow-debugging` เพื่อ reproduce ปัญหา ถ้า reproduce ไม่ได้ให้หาเงื่อนไขที่ทำให้เกิด
5. ถ้าปัญหาซับซ้อนหรือเกิดซ้ำๆ → ทำ `/deep-thinking` ก่อน debug
6. ถ้า reproduce ไม่ได้ → stop และ report ไม่ฝืน debug

### 2. Hypothesis Generation

> Goal: สร้าง hypothesis list 3–5 ข้อ

1. สร้าง hypothesis list H = {H₁, H₂, ..., Hₙ} 3–5 ข้อ เช่น: config issue, environment (PATH / runtime), dependency / package, tool version mismatch, user mistake
2. กำหนด prior probability P(H) สำหรับแต่ละ hypothesis (0.1–0.9)
3. ระบุ evidence ที่ต้องการเพื่อยืนยันหรือปฏิเสธแต่ละ hypothesis
4. ถ้าทุก hypothesis ถูกตัดใน step ต่อไป → กลับมาสร้าง hypothesis ใหม่

### 3. Rank By Probability

> Goal: ใช้ Bayesian Inference เพื่อจัดลำดับความเป็นไปได้

1. ประเมิน likelihood P(E|H) ความน่าจะเป็นที่ evidence เกิดขึ้นถ้า H เป็นจริง
2. คำนวณ posterior probability P(H|E) = P(E|H) × P(H) / P(E)
3. เลือก top 1–2 ที่มี P(H|E) สูงสุด
4. จัดลำดับตาม probability สูงก่อน

### 4. Eliminate Fast

> Goal: ใช้ Information Theory เพื่อเลือก test ที่ให้ข้อมูลมากที่สุด

1. คำนวณ entropy H(H) = -Σ P(Hᵢ) log₂ P(Hᵢ) ของ hypotheses ปัจจุบัน
2. สำหรับแต่ละ test T คำนวณ conditional entropy H(H|T)
3. เลือก test ที่มี Information Gain = H(H) - H(H|T) สูงสุด
4. ทำ test ที่เลือกและอัปเดต P(H|E) ด้วย Bayesian update
5. ตัด hypothesis ที่ P(H|E) < 0.05
6. ทำซ้ำจนเหลือ hypothesis ที่ P(H|E) → 1.0
7. ทางเลือกง่าย: ถ้าไม่ต้องการคำนวณ entropy → เลือก test ที่แยก hypothesis ได้มากที่สุด (ครึ่งหนึ่งผ่าน ครึ่งหนึ่งไม่ผ่าน)

### 5. Isolate And Confirm Root Cause

> Goal: ยืนยัน root cause ด้วย 3 เงื่อนไข

1. เปลี่ยนทีละอย่างเท่านั้น: ปิด extension, เปลี่ยน PATH, ใช้ clean terminal, run bare command, เปลี่ยน config, dependency, runtime, code
2. ไล่จากบนลงล่าง: UI (VSCode) → Terminal → Shell (pwsh / powershell) → Runtime → OS
3. บันทึกผลลัพธ์ของแต่ละการเปลี่ยนแปลง
4. ยืนยัน root cause ด้วย 3 เงื่อนไข:
   - Reproduce ได้ — สร้างปัญหาซ้ำได้
   - Fix แล้วหาย — แก้แล้วปัญหาหาย
   - กลับมา error ถ้าถอย fix — ถอนการแก้แล้วปัญหากลับมา
5. ถ้าต้องค้นหา pattern ใน code หรือ history → ทำ `/search-in-git` หรือ `/git-debug`
6. ถ้าไม่ผ่าน 3 เงื่อนไข → กลับไป Step 4

### 6. Root Cause Analysis

> Goal: วิเคราะห์หาสาเหตุหลักอย่างละเอียด

1. ทำ `/analyze-root-cause-analysis` เพื่อวิเคราะห์หาสาเหตุหลักอย่างละเอียด
2. ระบุ root cause ในระดับ process: ทำไมปัญหานี้ถึงเกิดขึ้นได้
3. ถ้าซับซ้อนมาก → ทำ `/deep-research` หา known issues ที่คล้ายกัน

### 7. Fix And Regression Tests

> Goal: แก้ปัญหาที่ root cause และสร้าง regression tests

1. แก้ปัญหาที่ root cause ไม่ใช่ symptoms ใช้ minimal changes ที่สุด
2. ทำ `/resolve-errors` เพื่อแก้ปัญหาที่ root cause อย่างเป็นระบบ ใช้ scripts automate เมื่อมีหลายไฟล์
3. ทำ `/update-test` เพื่อสร้าง regression tests จาก reproduction steps
4. ทดสอบว่า test fail ก่อน fix และ pass หลัง fix
5. ครอบคลุม edge cases ที่เกี่ยวข้อง
6. รัน test suite ทั้งหมดเพื่อยืนยันไม่มี regression
7. ถ้ามี regression → กลับไปแก้ fix

### 8. Verify And Prevent

> Goal: Verify จนกว่าจะผ่านทุกเงื่อนไขและป้องกันการเกิดซ้ำ

1. ทำ `/loop-until-complete` เพื่อรัน test suite ทั้งหมดจนกว่าจะผ่าน
2. ทำ `/run-verify` เพื่อตรวจสอบ lint และ typecheck ผ่าน
3. ระบุ root cause ในระดับ process: ทำไมปัญหานี้ถึงเกิดขึ้นได้
4. แนะนำ preventive measures: linter rules, type constraints, code review checklist
5. บันทึก root cause และ prevention ลงไฟล์บันทึกหรือ memory ของ project
6. ถ้าเกิน 3 รอบแล้วยังไม่ผ่าน → stop และ report

### 9. Report

> Goal: สร้างตารางสรุปผลและแนะนำขั้นต่อไป

1. ทำ `/report-table` เพื่อสร้างตาราง: Step, Hypothesis, P(H|E), Test, Result, Status
2. สรุป root cause, fix, regression tests, preventive measures
3. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. Core Principles

> Goal: debug อย่างเป็นระบบ ไม่เดา

- ห้ามแก้หลายอย่างพร้อมกัน
- ห้ามเดา
- ต้อง isolate variable
- ถ้าปัญหาเกี่ยวกับ git → ใช้ `/git-debug` แทน

### 2. Heuristic Cheatsheet

> Goal: เริ่ม debug ได้เร็วด้วย common patterns

| Symptom                 | Likely Cause                         |
| ----------------------- | ------------------------------------ |
| tool detect wrong shell | PATH                                 |
| VSCode weird behavior   | extension / profile                  |
| command not found       | PATH                                 |
| version mismatch        | runtime manager (mise / node / etc.) |
| build fail              | config / dependency version          |
| test fail suddenly      | code change / test data / flaky test |
| import error            | alias / export / barrel file         |
| type error cascade      | upstream type change / missing type  |
| runtime crash           | null / undefined / async timing      |

### 3. Bayesian Method

> Goal: ใช้ Bayesian Inference อย่างถูกต้อง

- กำหนด prior probability สำหรับทุก hypothesis
- เลือก test ที่มี Information Gain สูงสุดก่อน
- ตัด hypothesis ที่ P(H|E) < 0.05
- ถ้าทุก hypothesis ถูกตัด ให้สร้าง hypothesis ใหม่

### 4. Fast Debug Loop

> Goal: debug loop ที่รวดเร็วและซ้ำได้

1. Observe → 2. List 3–5 causes → 3. Pick top 1–2 → 4. Test one change at a time → 5. Eliminate → 6. Repeat

### 5. Regression Safety

> Goal: ทุก bug fix ต้องมี regression test

- ทุก bug fix ต้องมี regression test
- Test ต้อง fail ก่อน fix และ pass หลัง fix
- รัน test suite ทั้งหมดเพื่อยืนยันไม่มี regression
- ถ้ามี regression ให้กลับไปแก้ fix

### 6. Time Budget And Escalation

> Goal: ไม่ใช้เวลานานเกินไปกับปัญหาเดียว

- ปัญหาเล็ก: ≤ 5 นาที | กลาง: ≤ 15 นาที | ใหญ่: ≤ 30 นาที
- ถ้าเกินเวลา → ทำ `/deep-thinking` หรือ `/deep-research`
- ถ้าหา root cause ไม่ได้หลังพยายาม 3 รอบ → ทำ `/deep-thinking` หรือขอความช่วยเหลือ
- ถ้าปัญหาเกี่ยวกับ git → ใช้ `/git-debug` แทน

### 7. Prevention

> Goal: ป้องกันการเกิดปัญหาซ้ำ

- ระบุ root cause ในระดับ process ไม่ใช่แค่ code
- แนะนำ preventive measures ที่ actionable
- บันทึก root cause และ prevention ลงไฟล์บันทึกหรือ memory ของ project

## Expected Outcome

1. หา root cause ได้เร็วขึ้นด้วย Bayesian approach
2. ลดการเดาและแก้หลายอย่างพร้อมกัน
3. มี systematic approach สำหรับ debug ทุกประเภท
4. Root cause ถูกระบุอย่างชัดเจนด้วย evidence
5. Bug ถูกแก้ที่ root cause ไม่ใช่ symptoms
6. Regression tests ที่ป้องกันปัญหาซ้ำ
7. Preventive measures สำหรับ future
