---
name: deep-plan
description: วางแผนละเอียดระดับ implementation-ready ระบุชัดว่าเขียนอะไร ไฟล์ไหน แบบไหน
argument-hint: "[scope]"
related:
  - plan
  - follow-deep-review
  - deep-review
  - deep-thinking
  - deep-research
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

วางแผนอย่างละเอียดสำหรับงานซับซ้อนหรือเสี่ยงสูง — ผลลัพธ์คือ implementation-ready plan ที่ระบุชัดเจนว่าจะเขียนอะไร ไฟล์ไหน แบบไหน โดยไม่ต้องตีความเพิ่ม

## Scope

ใช้เมื่อ task ซับซ้อนสูง เสี่ยงสูง หรือต้องการแผนที่ละเอียดพอให้ลงมือได้ทันที — ครอบคลุม file-level spec, API surface, data structures, error cases, test cases และ acceptance criteria ต่อ task

- Boundary: วางแผนทั่วไป/งานไม่ซับซ้อน → `/plan`; skill นี้ = `/plan` + ความละเอียดระดับ implementable spec

- ดูเพิ่มเติม: /plan, /follow-deep-review

## Execute

### 1. Gather Evidence

> Goal: มี findings จริงก่อนเขียนแผน

1. ทำ `/follow-deep-review` เพื่อรวบรวม review findings ที่เกี่ยวข้องกับ scope
2. ทำ `/deep-thinking` ทบทวน architectural decisions และ `/deep-research` ถ้าต้องใช้ความรู้ใหม่
3. ระบุ constraints, assumptions, dependencies และ unknowns ทั้งหมด

### 2. Write Detailed Plan

> Goal: ระบุว่าจะเขียนอะไร ไฟล์ไหน แบบไหน ครบทุก task

ทุก task ในแผนต้องระบุครบ:

1. File: path เต็มที่จะสร้าง/แก้ไข/ลบ
2. What: สิ่งที่จะเขียน — public API signatures, exported types, data structures, config keys
3. How: pattern/approach ที่ใช้ — เช่น library, convention ใน codebase, code sketch สั้นๆ ถ้าจำเป็น
4. Why: เหตุผลและ alternative ที่ปฏิเสธ
5. Acceptance: เงื่อนไขผ่านที่วัดได้ — test case, command, expected output
6. Risk: impact ถ้าผิด + rollback/mitigation

### 3. Order And Dependencies

> Goal: ลำดับงาน fail fast

1. เรียง Foundation → Dependencies → High impact → Critical path → High risk
2. ระบุ task graph: อะไรทำ parallel ได้ อะไร block กัน
3. ระบุ checkpoint ที่ต้อง verify ก่อนไปต่อ

### 4. Validate Plan

> Goal: แผน implement ได้จริง ไม่มี gap

1. ตรวจทุก task: มี file + what + how + acceptance ครบ
2. ทำ `/deep-validate` กับแผน — ห้ามมี placeholder, TBD, หรือ decision ที่ค้าง
3. จำลอง walkthrough: ถ้าทำตามแผนทีละข้อ ผลลัพธ์ครบตาม goal หรือไม่

### 5. Report

> Goal: รายงานแผนละเอียดในแชทก่อนลงมือ

1. ทำ `/report` คอลัมน์: `No.`, `Task`, `File`, `What`, `How`, `Acceptance`, `Risk`
2. แสดง file structure และ task graph
3. ทำ `/suggest-next-action`

## Rules

### 1. No Ambiguity

- ห้ามเขียน task ที่ตีความได้หลายแบบ — ทุก task ต้องระบุ file, what, how, acceptance
- ห้ามใช้ placeholder, TBD, "decide later" — ถ้าตัดสินใจไม่ได้ให้ทำ `/deep-research` หรือ `/ask-me` ก่อน
- ทุก finding จาก deep-review ที่เกี่ยวข้องต้อง map เข้า task หรือระบุว่าตัดออกเพราะอะไร

### 2. Detail Level

- เขียนละเอียดระดับที่คนอื่น (หรือ subagent) เอาไป implement ได้โดยไม่ถามเพิ่ม
- Code sketch ใช้เฉพาะเมื่อช่วยให้ชัด — ไม่เขียน implementation เต็มในแผน
- เก็บแผนในแชท; ถ้า tasks > 10 → บันทึกด้วย `/create-plan-in-dot-devin`

### 3. Evidence Based

- ทุก architectural choice ต้องมี evidence จาก review findings หรือ research
- ห้ามเดา APIs, file paths, หรือ library behavior — ตรวจจาก codebase/official docs ก่อน

## Expected Outcome

- Implementation-ready plan: ทุก task ระบุ file, what, how, acceptance, risk
- Task graph พร้อม ordering และ parallelization
- ไม่มี placeholder หรือ decision ค้าง — ผ่าน `/deep-validate`
- ผู้ใช้เห็นชัดว่าจะเขียนอะไร ไฟล์ไหน แบบไหน ก่อนลงมือ
