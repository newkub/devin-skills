---
name: debug-issue
description: หา root cause ของปัญหาอย่างเป็นระบบด้วยการจัดลำดับและตัดสิ่งที่ไม่ใช่
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - memorize
  - git-debug
  - follow-root-cause-analysis
  - follow-incident-triage
  - write-test
---

## Goal

หา root cause ของปัญหาอย่างเป็นระบบด้วยการจัดลำดับความเป็นไปได้และตัดสิ่งที่ไม่ใช่ออก ลดการเดาและแก้ปัญหาได้เร็วขึ้น

## Scope

Debug issues ทั้ง VSCode, terminal, shell, runtime และ OS layers
ไม่ใช้สำหรับ debug ปัญหาที่เกี่ยวกับ git โดยเฉพาะ — ใช้ `/git-debug` แทน

## Execute

### 1. Triage And Define Problem

> Goal: จัดลำดับความสำคัญและเขียนปัญหาให้ชัดเจน
> Goal: ทราบ priority และปัญหาที่ชัดเจน พร้อม expected/actual/scope

1. ทำ `/follow-incident-triage` เพื่อจัดลำดับความสำคัญและกำหนด action plan
2. เขียนปัญหาให้ชัดเจน ระบุ: Expected (สิ่งที่ควรเกิด), Actual (สิ่งที่เกิดจริง), Scope (VSCode / OS / app / API)
3. ถ้าปัญหาซับซ้อนหรือเกิดซ้ำๆ → ทำ `/deep-thinking` ก่อน debug

### 2. List Possible Causes

> Goal: สร้าง hypothesis list 3–5 ข้อ
> Goal: มี hypothesis list ที่ครอบคลุมและไม่เดา

1. สร้าง hypothesis list H = {H₁, H₂, ..., Hₙ} 3–5 ข้อ เช่น: config issue, environment (PATH / runtime), dependency / package, tool version mismatch, user mistake
2. ถ้าปัญหาเกี่ยวกับ git → ทำ `/git-debug` แทน

### 3. Rank By Probability

> Goal: ใช้ Bayesian Inference เพื่อจัดลำดับความเป็นไปได้
> Goal: พบ top 1–2 hypotheses ที่น่าจะเป็นสาเหตุมากที่สุด

1. กำหนด prior probability P(H) สำหรับแต่ละ hypothesis (0.1–0.9)
2. ประเมิน likelihood P(E|H) ความน่าจะเป็นที่ evidence เกิดขึ้นถ้า H เป็นจริง
3. คำนวณ posterior probability P(H|E) = P(E|H) × P(H) / P(E)
4. เลือก top 1–2 ที่มี P(H|E) สูงสุด

### 4. Eliminate Fast

> Goal: ใช้ Information Theory เพื่อเลือก test ที่ให้ข้อมูลมากที่สุด
> Goal: ตัด hypothesis ที่ไม่ใช่ออกอย่างมีประสิทธิภาพ

1. คำนวณ entropy H(H) = -Σ P(Hᵢ) log₂ P(Hᵢ) ของ hypotheses ปัจจุบัน
2. สำหรับแต่ละ test T คำนวณ conditional entropy H(H|T)
3. เลือก test ที่มี Information Gain = H(H) - H(H|T) สูงสุด
4. ทำ test ที่เลือกและอัปเดต P(H|E) ด้วย Bayesian update
5. ตัด hypothesis ที่ P(H|E) < 0.05
6. ทำซ้ำจนเหลือ hypothesis เดียว
7. ทางเลือกง่าย: ถ้าไม่ต้องการคำนวณ entropy → เลือก test ที่แยก hypothesis ได้มากที่สุด (ครึ่งหนึ่งผ่าน ครึ่งหนึ่งไม่ผ่าน)

### 5. Isolate Variable

> Goal: เปลี่ยนทีละอย่างเท่านั้นเพื่อยืนยันสาเหตุ
> Goal: ยืนยันว่า hypothesis ที่เหลือเป็นสาเหตุจริง

1. เปลี่ยนทีละอย่าง: ปิด extension, เปลี่ยน PATH, ใช้ clean terminal, run bare command
2. ไล่จากบนลงล่าง: UI (VSCode) → Terminal → Shell (pwsh / powershell) → Runtime → OS
3. บันทึกผลลัพธ์ของแต่ละการเปลี่ยนแปลง

### 6. Confirm Root Cause

> Goal: ยืนยัน root cause ด้วย 3 เงื่อนไข
> Goal: ยืนยันได้ว่านี่คือ root cause จริง

1. Reproduce ได้ — สร้างปัญหาซ้ำได้
2. Fix แล้วหาย — แก้แล้วปัญหาหาย
3. กลับมา error ถ้าถอย fix — ถอนการแก้แล้วปัญหากลับมา

### 7. Perform Root Cause Analysis

> Goal: วิเคราะห์หาสาเหตุหลักอย่างละเอียด
> Goal: เข้าใจ root cause ในระดับ process

1. ทำ `/follow-root-cause-analysis` เพื่อวิเคราะห์หาสาเหตุหลักอย่างละเอียด
2. ระบุ root cause ในระดับ process: ทำไมปัญหานี้ถึงเกิดขึ้นได้

### 8. Fix And Write Regression Tests

> Goal: แก้ปัญหาที่ root cause และสร้าง regression tests
> Goal: ปัญหาถูกแก้และมี test ป้องกันการเกิดซ้ำ

1. ทำ `/resolve-errors` เพื่อแก้ปัญหาที่ root cause อย่างเป็นระบบ ใช้ scripts automate เมื่อมีหลายไฟล์
2. ทำ `/write-test` เพื่อสร้าง regression tests จาก reproduction steps
3. ทดสอบว่า test fail ก่อน fix และ pass หลัง fix
4. รัน test suite ทั้งหมดเพื่อยืนยันไม่มี regression

### 9. Prevent Recurrence

> Goal: ป้องกันการเกิดปัญหาซ้ำ
> Goal: มี preventive measures สำหรับ future

1. แนะนำ preventive measures: linter rules, type constraints, code review checklist
2. ทำ `/memorize` เพื่อบันทึก root cause และ prevention สำหรับ future reference

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

### 3. Mental Model
> Goal: มีกรอบการคิดที่เป็นระบบ

Debug = Bayesian Search in Hypothesis Space

- State: Probability distribution over hypotheses P(H)
- Action: Test that maximizes Information Gain
- Update: Bayesian update P(H|E) = P(E|H) × P(H) / P(E)
- Goal: Find H with P(H|E) → 1.0
- Entropy H(H) = uncertainty ใน hypotheses
- Information Gain = reduction in uncertainty
- Optimal test = maximizes Information Gain

### 4. Fast Debug Loop
> Goal: debug loop ที่รวดเร็วและซ้ำได้

1. Observe → 2. List 3–5 causes → 3. Pick top 1–2 → 4. Test one change at a time → 5. Eliminate → 6. Repeat

### 5. Regression Safety
> Goal: ทุก bug fix ต้องมี regression test

- ทุก bug fix ต้องมี regression test
- Test ต้อง fail ก่อน fix และ pass หลัง fix
- รัน test suite ทั้งหมดเพื่อยืนยันไม่มี regression

### 6. Time Budget And Escalation
> Goal: ไม่ใช้เวลานานเกินไปกับปัญหาเดียว

- ปัญหาเล็ก: ≤ 5 นาที | กลาง: ≤ 15 นาที | ใหญ่: ≤ 30 นาที
- ถ้าเกินเวลา → ทำ `/deep-debug`
- ถ้าหา root cause ไม่ได้หลังพยายาม 3 รอบ → ทำ `/deep-thinking` หรือขอความช่วยเหลือ
- ถ้าปัญหาเกี่ยวกับ git → ใช้ `/git-debug` แทน

## Expected Outcome

1. หา root cause ได้เร็วขึ้นด้วย Bayesian approach
2. ลดการเดาและแก้หลายอย่างพร้อมกัน
3. มี systematic approach สำหรับ debug ทุกประเภท
4. Regression tests ที่ป้องกันปัญหาซ้ำ
5. Preventive measures สำหรับ future
