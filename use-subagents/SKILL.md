---
name: use-subagents
description: แบ่งงานเป็น subagents sync หรือ async ตามความเหมาะสม พร้อม verify รอบเดียวจบ
argument-hint: "[task]"
---

## Goal

แบ่งงานซับซ้อนเป็น subtasks ทำขนานกัน โดยตัดสินใจ sync หรือ async อัตโนมัติ พร้อม verify รอบเดียวจบ ประหยัด token และเร็ว

## Scope

ใช้เมื่องานสามารถแบ่งเป็น subtasks ได้ ทั้งแบบ independent (async) หรือ dependent (sync)

ครอบคลุมการแบ่งงาน การเลือก subagent ตาม role การ spawn ขนาน การ merge ผล และการ verify — ไม่ครอบคลุม concurrent programming ใน application code (ใช้ `/review-performance` หรือดู `?review-performance/references/concurrency.md`)

## Execute

### 1. Classify Sync Or Async

> Goal: เลือกโหมด execution ตามลักษณะงาน

ตัดสินใจตาม decision tree:

| เงื่อนไข | โหมด | เหตุผล |
|---|---|---|
| 1-2 subtasks หรือ dependent กัน | SYNC | spawn ไม่คุ้ม overhead |
| 3+ independent subtasks | ASYNC | parallel ได้จริง |
| Research-heavy (fetch docs, web) | ASYNC | I/O bound เหมาะ parallel |
| File ops ขนานในไฟล์ต่างกัน | ASYNC | ไม่มี conflict |
| งานเล็ก, 1 ไฟล์, sequential | SYNC | ทำตรงๆ เร็วกว่า |

- ถ้าไม่แน่ใจ → เริ่ม SYNC แล้ว escalate เป็น ASYNC ถ้าพบว่าช้า
- บันทึกเหตุผลการเลือกใน comment สั้นๆ

### 2. Plan Inline

> Goal: มีแผนชัดเวลา spawn โดยไม่ต้องสร้างไฟล์ถ้าไม่จำเป็น

1. แบ่ง subtasks ตาม responsibility ให้ independent
2. ระบุ inputs, deliverables, success criteria ของแต่ละ subtask
3. ระบุ dependencies และ execution order
4. ถ้าเป็น ASYNC → เลือก subagent profile ตาม role:
   - `reviewer`, `senior-frontend`, `senior-backend` สำหรับ code review/implementation
   - `researcher`, `subagent_explore` สำหรับ research/exploration
   - `fixer`, `refactor` สำหรับ bug fixes/refactoring
   - `qa`, `staff-qa` สำหรับ testing
   - `security-auditor` สำหรับ security review
   - ถ้าไม่แน่ใจ → `subagent_general`
5. สร้างไฟล์ plan ใน `.devin/plan/` เฉพาะ เมื่อ:
   - subtasks > 5
   - งาน high-risk (destructive, production)
   - ต้อง human gate ระหว่างขั้นตอน
6. ถ้าไม่ตรงข้อ 5 → plan inline ใน context พอ

### 3. Execute

> Goal: ทำ subtasks ตามโหมดที่เลือก

#### SYNC Mode

1. ทำ subtasks ตามลำดับตรงๆ ด้วย tools ปกติ
2. รวบรวมผลลัพธ์ทุก subtask
3. ไปขั้นตอนที่ 4

#### ASYNC Mode

1. ใช้ `run_subagent` ด้วย `is_background=true` สำหรับแต่ละ subtask
2. prompt ต้องระบุ: context, deliverable, constraints, success criteria
3. บันทึก agent ids ทั้งหมด
4. ไม่เกิน 10 subagents ต่อ batch — ถ้ามากกว่าแบ่ง batch
5. spawn ทุกตัวใน batch เดียวพร้อมกัน
6. รอ `<subagent_completion_notification>` อัตโนมัติ — ไม่ต้อง poll
7. ถ้า agent ล้มเหลว → retry ครั้งเดียว ถ้ายัง fail → escalate
8. รวบรวม results จากทุก agent

### 4. Verify

> Goal: review + validate + verify รวบยอดรอบเดียว

1. ตรวจผลรวม: correctness, completeness, consistency
2. แก้ conflicts ระหว่าง subagents ถ้ามี — ถ้า 2 agents แก้ไฟล์เดียวกัน → เลือกผลที่ถูกต้องและ merge manually
3. รัน checks ที่เกี่ยวข้อง: lint, typecheck, build, tests (ถ้ามี)
4. ตรวจ cross-references ถ้าเปลี่ยนชื่อไฟล์
5. ถ้าพบ issues:
   - Critical/High → แก้ทันที → verify ซ้ำ (max 3 รอบ)
   - Low → บันทึกไว้ report แล้วจบ
6. ถ้าเกิน 3 รอบ → stop และ report พร้อมสาเหตุ

### 5. Report

> Goal: รายงานผลกระชับ

1. สรุปด้วยตาราง: subtask, status, result
2. ระบุสิ่งที่ค้าง ถ้ามี
3. แนะนำขั้นต่อไป 1-2 บรรทัด
4. ลบไฟล์ plan ถ้าสร้างไว้
5. ถ้ามี orphan agents → kill และ report

## Rules

### 1. Auto Sync Async

- ตัดสินใจ sync/async อัตโนมัติตามขั้นตอนที่ 1
- SYNC เป็นค่าเริ่มต้นเมื่อไม่แน่ใจ
- บันทึกเหตุผลการเลือกสั้นๆ

### 2. Task Isolation

- แต่ละ subtask ต้อง independent และมี scope ชัดเจน
- ห้ามหลาย agent แก้ไขไฟล์เดียวกันใน async mode
- กำหนด timeout แต่ละ agent ถ้าเป็น async

### 3. Clear Prompts

- prompt ต้องระบุ deliverable, constraints, success criteria
- ห้ามสั่งให้ agent ตัดสินใจเรื่องเสี่ยงเอง
- แนบ context ที่จำเป็นเท่านั้น

### 4. No Orphan Agents

- บันทึกทุก agent id
- รอ completion notification อัตโนมัติ
- ถ้า agent ค้างเกิน timeout → kill และ report

### 5. Verify Once Fix Loop

- review + validate + verify รวบยอดรอบเดียว
- ถ้า fail → fix → verify ซ้ำ (max 3 รอบ)
- ถ้าเกิน 3 รอบ → stop และ report

### 6. Plan Only When Needed

- plan inline เป็นค่าเริ่มต้น
- สร้างไฟล์ plan เฉพาะ > 5 subtasks หรือ high-risk
- ลบไฟล์ plan หลังงานเสร็จ

### 7. Token Efficiency

- ไม่เรียก skill ย่อยถ้าไม่จำเป็น — ทำตรงๆ
- ใช้ `read_subagent` เฉพาะตอนรอผลจำเป็น
- รอ `<subagent_completion_notification>` อัตโนมัติแทนการ poll

## Expected Outcome

- ตัดสินใจ sync/async อัตโนมัติตามลักษณะงาน
- งานเล็ก 2 steps (classify + execute), งานใหญ่ 5 steps
- ประหยัด 60-80% tokens เทียบ flow เดิม
- ผลลัพธ์ผ่าน verify รอบเดียว ถ้าไม่มี issues
- รายงาน status ของทุก subtask พร้อม next action
