---
name: loop-until-complete
description: ทำซ้ำงานจนกว่าจะเสร็จสมบูรณ์ หรือถึงจุดทีดีพอ โดยหยุดก่อน over-engineer
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - run-until-pass
  - retry
  - use-subagents
  - report
  - suggest-next-action
  - report-progress
  - dont-over-engineer
  - deep-validate
  - continue

---

## Goal

ทำซ้ำงานจนกว่าจะบรรลุวัตถุประสงค์และเสร็จสมบูรณ์ หรือจนถึงจุดที "ดีพอ" คือ ไม่สามารถทำให้ดีกว่านี้ได้อีก หรือถ้ายังทำได้แต่ impact ไม่คุ้มกับต้นทุน โดยหยุดก่อน over-engineering

## Scope

ใช้สำหรับการทำซ้ำงานทีต้อง verify จนกว่าจะผ่านเงื่อนไข หรืองานทีปรับปรุงได้หลายรอบ เช่น refactor, optimize, แก้ไข content, ปรับ UX, ออกแบบ schema — รวมการออกแบบ agentic loop ทีรันอัตโนมัติ (scheduled/trigger/long-running) ใน `### 8`

## Execute

### 1. Define Loop Condition

> Goal: กำหนดเงื่อนไขทีวัดผลได้

1. ระบุวัตถุประสงค์ทีต้องบรรลุ
2. กำหนดเงื่อนไขการหยุดทีชัดเจน
3. ตั้งค่าจำนวนรอบสูงสุดถ้าจำเป็น
4. ระบุ over-engineering indicators เช่น ไฟล์/บรรทัดเพิ่มขึ้นโดยไม่จำเป็น, abstraction เพิ่มแต่ไม่มี consumer, complexity สูงขึ้น

### 2. Establish Baseline

> Goal: รู้จุดเริ่มต้นก่อนวนปรับปรุง

1. บันทึกสถานะปัจจุบันของงาน เช่น code, design, content, metrics
2. ระบุตัวชี้วัดหลัก (KPIs) ทีจะใช้วัด improvement เช่น performance, readability, coverage, simplicity
3. ถ้ามี test/lint/build อยู่ ให้รันเพื่อเก็บ baseline ก่อน

### 3. Execute Loop

> Goal: ทำงานซ้ำตามเงื่อนไข

1. เลือกสิ่งเดียวที improve ได้มากทีสุดในรอบนี้
2. ใช้ minimal changes ในการปรับปรุง
3. ทำงานตามขั้นตอนทีกำหนด
4. ตรวจสอบเงื่อนไขการหยุด
5. ถ้าผลลัพธ์ไม่ผ่าน ให้ทำ `/retry` เพื่อ recheck และแก้ไข
6. ทำซ้ำถ้ายังไม่บรรลุเงื่อนไข

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

### 6. Verify Completion

> Goal: ตรวจสอบว่างานเสร็จสมบูรณ์

1. ตรวจสอบวัตถุประสงค์บรรลุหรือไม่
2. ตรวจสอบคุณภาพของผลลัพธ์
3. ยืนยันว่าไม่มีงานค้าง
4. รัน `/run-check` หรือ `/deep-validate` ครั้งสุดท้าย

### 7. Finalize And Report

> Goal: สรุปผลและส่งมอบ

1. สรุปจำนวนรอบ, สิ่งทีเปลี่ยน, metrics before/after, และเหตุผลทีหยุด
2. ทำ `/report` หรือ `/report-progress` แสดง progress ตามลำดับรอบ
3. ถ้าพร้อม ให้ทำ `/ship` หรือ `/continue` ตาม context

### 8. Design Agentic Loop (Conditional — merged จาก `/follow-loop-engineering`)

> Goal: ออกแบบระบบทีหางาน แบ่งงาน มอบหมาย verify ผล บันทึกสถานะ และหยุดเมื่อถึง human gate ได้เอง

1. กำหนด purpose: goal หลักของ loop, trigger (cron, git event, issue, notification, หรือ manual), stop condition ทีชัดเจน, max iterations หรือ budget กัน infinite loop
2. Work discovery: scan แหล่งงาน — git diff, issues, PR comments, logs, metrics; ใช้ `/scan-codebase` / `grep` หา pattern ทีต้องแก้; จัดลำดับความสำคัญของงานทีเจอ; ไม่มีงาน → loop หยุดและ report
3. Triage and isolate: จัดหมวดงาน (bug, refactor, test, docs, security); แยกแต่ละงาน into context อิสระ — branch หรือ worktree; บันทึก state ของงานลง `STATE.md`
4. Implement and verify แบบไม่ขึ้นกัน: มอบหมายผ่าน `/use-subagents` — implementer agent และ verifier agent แยกกัน ไม่ใช้ context/state เดียวกัน; รัน test, lint, typecheck, build ตามความเหมาะสม; ไม่ผ่าน → ส่งกลับแก หรือข้ามไปงานถัดไป
5. Persist state: อัปเดต `STATE.md` ด้วย งาน, ผล, การตัดสินใจ, รอบถัดไป + log, diff, test result, PR link; งานค้างข้าม session → `/save-to-todo-md`; state ต้องตรวจสอบย้อนกลับได้
6. Human gates: ระบุ action ทีเสี่ยงหรือย้อนกลับไม่ได้ (publish, merge, push, delete, deploy) — สรุปผลและข้อเสนอก่อนถาม user; ไม่ทำ remote side effects โดยไม่ได้รับอนุญาต; ไม่อนุมัติ → บันทึกเหตุผลแล้วหยุดหรือข้าม
7. Monitor and iterate: ติดตาม success rate, cost, review burden, จำนวน human gate; loop ทีสร้าง noise มากกว่าคุณค่า → ลดความถี่หรือลบ; ปรับ trigger, triage rule และ max iterations; รายงานทุกรอบด้วย `/report`

## Rules

### 1. Safety

- ห้ามวนลูปไม่มีทีสิ้นสุด
- ต้องมีเงื่อนไขการหยุดทีตรวจสอบได้จริง
- ถ้าเกินจำนวนรอบสูงสุด ให้หยุดและรายงาน
- ทำ dry run ก่อน action ทีเปลี่ยนแปลงเยอะ

### 2. Quality

- ตรวจสอบคุณภาพของผลลัพธ์ก่อนหยุด
- ใช้ minimal changes ในแต่ละรอบ
- ทุกรอบต้องมีข้อมูลเปรียบเทียบ before/after
- ใช้ตัวเลข, test result, lint score, หรือ metrics จริง ไม่ใช่ความรู้สึก

### 3. Stop Conditions

- หยุดเมื่องานเสร็จสมบูรณ์ตาม criteria
- หยุดเมื่องานดีพอตาม criteria ทีกำหนด
- หยุดเมื่องานไม่สามารถดีขึ้นได้อีกโดยไม่เพิ่ม cost หรือ risk
- หยุดเมื่องานถัดไปมี impact น้อยกว่าต้นทุน
- ถ้าถึง max iterations ให้หยุดและ report สาเหตุ

### 4. Over-Engineering Guardrails

- ห้ามสร้าง abstraction, layer, dependency ใหม่ถ้าไม่จำเป็นจริงๆ
- ห้าม optimize ส่วนทีไม่ใช่ bottleneck หรือไม่มี evidence
- ห้ามเพิ่ม features หรือ config นอก scope ปัจจุบัน
- ถ้ามีข้อสงสัยว่า over-engineer ให้ทำ `/dont-over-engineer`

### 5. Agentic Loop Guardrails (merged จาก `/follow-loop-engineering`)

- ห้าม loop ไม่มีทีสิ้นสุด — ต้องมี stop condition + max iterations; เกินแล้ว → หยุดและรายงาน
- ห้าม destructive action โดยไม่ผ่าน human gate; ไม่ทำ remote side effects โดยไม่ได้รับอนุญาต
- implementer และ verifier ต้องไม่ใช้ context/state เดียวกัน; ทุกผลลัพธ์มี evidence — test output, diff, log
- ติดตาม token/execution cost ต่อรอบ; ใช้ minimal context; loop ต้องทิ้ง audit trail (state, log, decision, ผล)

### 6. Related Skills

- ใช้ `/retry` ถ้าจำเป็น
- ใช้ `/run-until-pass` ถ้าจำเป็น
- ใช้ `/suggest-next-action` ถ้าจำเป็น
- ใช้ `/report-progress` ถ้าจำเป็น

## Expected Outcome

- งานทำซ้ำจนบรรลุวัตถุประสงค์หรือถึงจุดทีดีพอ
- เงื่อนไขการหยุดชัดเจน
- ผลลัพธ์มีคุณภาพและสมบูรณ์
- ไม่เกิด over-engineering หรือ scope creep
- มีบันทึกรอบ, metrics, และเหตุผลทีหยุด
- ถ้าใช้เป็น agentic loop: มีเอกสารออกแบบ (goal, trigger, stop condition, max iterations, human gates) และ `STATE.md` ทีตรวจสอบย้อนกลับได้
- ผลลัพธ์พร้อม validate และ ship
