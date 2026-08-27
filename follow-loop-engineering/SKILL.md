---
name: follow-loop-engineering
description: ออกแบบ agentic loop ทีหา, triage, มอบหมาย, verify, และ persist state ได้เอง
related:
  - loop-continuous
  - loop-until-complete
  - run-until-pass
---

## Goal

ออกแบบและสร้าง loop engineering สำหรับ AI coding agents: ระบบทีหางาน แบ่งงาน มอบหมายให้ agent ตัวย่อย verify ผล บันทึกสถานะ และหยุดเมื่อถึง human gate

## Scope

ใช้เมื่อต้องสร้าง workflow ทีรันซ้ำอัตโนมัติ ทั้งแบบ scheduled, trigger, หรือ long-running task ทีต้องให้ agent ทำงานต่อเนื่องโดยไม่ต้อง prompt ทีละ step

## Execute

### 1. Define Loop Purpose

> Goal: กำหนดเป้าหมายและขอบเขตของ loop
1. ระบุ goal หลักที loop ต้องบรรลุ
2. เลือก trigger: cron, git event, issue, notification, หรือ manual
3. กำหนด stop condition ทีชัดเจน
4. กำหนด max iterations หรือ budget เพื่อป้องกัน infinite loop

### 2. Design Work Discovery

> Goal: หางานเข้ามาใน loop อย่างครอบคลุม
1. อ่าน/scan source ของงาน: git diff, issues, PR comments, logs, metrics
2. ใช้ `scan-codebase`, `grep`, `code_search` หา pattern ทีต้องแก้
3. จัดลำดับความสำคัญของงานทีเจอ
4. ถ้าไม่มีงาน → loop หยุดและ report

### 3. Triage and Isolate

> Goal: แบ่งงานและแยก context ไม่ให้ปนกัน
1. จัดหมวดหมู่งาน: bug, refactor, test, docs, security
2. สร้าง isolated context สำหรับแต่ละงาน: worktree, branch, หรือ workspace
3. ระบุ agent หรือ skill ทีเหมาะกับแต่ละงาน
4. บันทึก state ของงานลง `STATE.md` หรือไฟล์บันทึก

### 4. Implement and Verify

> Goal: ให้ agent ทำงานและ verify อิสระ
1. มอบหมายงานให้ implementer agent พร้อม context ที่จำเป็น
2. ให้ verifier agent ตรวจผลโดยไม่ขึ้นกับ implementer
3. รัน test, lint, typecheck, build ตามความเหมาะสม
4. ถ้าไม่ผ่าน → ส่งกลับไปแก้ไขหรือข้ามไปงานถัดไป

### 5. Persist State

> Goal: บันทึกสถานะและผลลัพธ์ที loop ทำ
1. อัปเดต `STATE.md` ด้วย: งาน, ผล, การตัดสินใจ, รอบถัดไป
2. เก็บ log, diff, test result, PR link
3. ใช้ `create_memory` หรือ `progress.txt` ถ้าต้องข้าม session
4. ทำให้ state สามารถตรวจสอบย้อนกลับได้

### 6. Human Gates

> Goal: กำหนดจุดหยุดสำหรับคนตัดสินใจ
1. ระบุ actions ทีเสี่ยงหรือย้อนกลับไม่ได้: publish, merge, push, delete, deploy
2. สรุปผลและข้อเสนอก่อนถาม user
3. ไม่ทำ remote side effects โดยไม่ได้รับอนุญาต
4. ถ้า user ไม่อนุมัติ → บันทึกเหตุผลและหยุด หรือข้าม

### 7. Monitor and Iterate

> Goal: ปรับปรุง loop จากผลการทำงาน
1. ติดตาม success rate, cost, review burden, จำนวน human gate
2. หา loop ทีสร้าง noise หรือใช้ cost สูงเกินไป
3. ปรับ trigger, triage rule, และ max iterations
4. ทำ `/suggest-next-action` เพื่อปรับปรุงต่อ

## Rules

### 1. Safety
- ห้าม loop ไม่มีที่สิ้นสุด ต้องมี stop condition และ max iterations
- ถ้าเกิน max iterations ให้หยุดและรายงาน
- ห้ามทำ destructive action โดยไม่ผ่าน human gate

### 2. Isolation
- แต่ละงานควรอยู่ใน branch หรือ worktree ของตัวเอง
- ห้ามให้ implementer และ verifier ใช้ context หรือ state เดียวกัน
- เก็บสถานะของแต่ละงานแยกกัน

### 3. Verification
- verify ต้องเป็น agent หรือ step ที่แยกอิสระจาก implementer
- ทุกผลลัพธ์ต้องมี evidence: test output, diff, log
- ถ้า verify ไม่ผ่าน → ต้องระบุสาเหตุและแนวทางแก้

### 4. Cost Awareness
- ติดตาม token/execution cost ของ loop
- ลบหรือลดความถี่ของ loop ทีสร้าง noise มากกว่าคุณค่า
- ใช้ minimal context ในแต่ละรอบ

### 5. Observability
- loop ต้องทิ้ง audit trail: state, log, decision, ผล
- รายงานทุกรอบด้วย `/report` หรือ `/report-table`
- ระบุจุดทีต้องให้คนตรวจสอบ

## Expected Outcome

- เอกสารออกแบบ loop: goal, trigger, stop condition, max iterations, human gates
- `STATE.md` หรือไฟล์บันทึกสถานะทีตรวจสอบได้
- ระบบ triage, isolation, implementation, verification ทีชัดเจน
- รายงานผลและค่าใช้จ่ายของแต่ละรอบ
- ขั้นตอนปรับปรุง loop ต่อไป