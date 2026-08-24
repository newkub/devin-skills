---
name: run-parallel-via-spawn-subagents
description: ทำงานแบ่ง subagents ขนานกัน รวมผล merge, review, validate, verify ครบวงจร
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
  - run_subagent
  - read_subagent
triggers:
  - user
  - model
related:
  - ask-me
  - deep-plan
  - deep-validate
  - deep-verify
  - follow-deep
  - merge
  - read-related-skills
  - report
  - review-and-fix
  - suggest-next-action
---

## Goal

ทำงานซับซ้อนโดยแบ่ง subagents ทำงานขนานกัน แล้ว merge ผล, review, validate, verify จนพร้อมส่งมอบ

## Scope

ใช้เมื่องานสามารถแบ่งเป็น subtasks ที independent และทำพร้อมกันได้ โดยท้ายสุดต้องได้ผลลัพธ์ทีตรวจสอบแล้ว

## Execute

### 1. Read Related Skills

> Goal: เข้าใจ workflows และ skills ทีเกี่ยวข้องก่อนลงมือ

1. ทำ `/read-related-skills` เพื่ออ่าน skills/workflows ทีเกี่ยวข้องแบบ recursive
2. สรุปสิ่งทีจะทำ: subtasks หลัก, dependencies, expected outputs
3. บันทึก constraints และ allowed tools จาก skills ทีอ่าน

### 2. Follow Deep Workflows

> Goal: ระบุ deep workflows ทีเกี่ยวข้อง

1. ทำ `/follow-deep` เพื่อพิจารณา deep-* workflows ทีจำเป็น
2. ระบุ dimensions ทีต้องทำ: analyze, plan, review, validate, verify
3. ถ้า task ไม่ซับซ้อน ให้ข้าม deep workflows ได้

### 3. Deep Plan

> Goal: วางแผน subtasks ทีชัดเจน

1. ทำ `/deep-plan` เพื่อวางแผนงาน พร้อมระบุ subtasks, risks, dependencies
2. แบ่ง subtasks ตาม responsibility ให้ independent กัน
3. ระบุ inputs, expected outputs, allowed tools, และ timeout ของแต่ละ subtask
4. ถ้า subtask เสี่ยงสูง ให้ทำ `/ask-me` ก่อน spawn

### 4. Spawn Subagents

> Goal: สร้าง subagents ตาม plan

1. ใช้ `run_subagent` ด้วย `is_background=true` สำหรับแต่ละ subtask
2. ส่ง prompt ทีชัดเจน: context, deliverable, constraints, success criteria
3. บันทึก agent ids ทั้งหมด
4. ไม่เกิน 10 subagents ต่อ batch ถ้ามากกว่าให้แบ่ง batch

### 5. Monitor Progress

> Goal: ติดตามทุก subagent จนเสร็จ

1. ใช้ `read_subagent` ตรวจสอบ progress เป็นระยะ
2. ถ้า agent ล้มเหลว → ทำ `/resolve-errors` แล้ว retry หรือ escalate
3. รวบรวม results จากทุก agent ก่อนไป merge
4. ไม่ปล่อยให้ agent ค้าง

### 6. Merge Results

> Goal: รวมผลลัพธ์จาก subagents

1. ทำ `/merge` เพื่อรวมผลลัพธ์หรือไฟล์ทีเกิดจาก subagents
2. ตรวจสอบ conflicts ก่อนยืนยัน merge
3. บันทึกสถานะแต่ละ agent: success, partial, fail

### 7. Review And Fix

> Goal: ทบทวนและแก้ไขผลรวม

1. ทำ `/review-and-fix` เพื่อ review ผลรวมและแก้ไข issues
2. แก้ไข conflicts หรือ inconsistencies จาก subagents
3. ถ้าแก้ไม่ผ่านให้ทำ `/resolve-errors` แล้วกลับไป Step 6

### 8. Deep Validate

> Goal: validate ผลรวมหลายมิติ

1. ทำ `/deep-validate` เพื่อ validate correctness, quality, security, compliance
2. บันทึก findings พร้อม severity
3. ถ้าพบ Critical/High ให้ทำ `/resolve-errors` แล้วกลับไป Step 7

### 9. Deep Verify

> Goal: verify สุดท้ายก่อนส่งมอบ

1. ทำ `/deep-verify` เพื่อรัน checks, tests, typecheck, references
2. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` แล้วทำ `/deep-verify` ซ้ำ (สูงสุด 3 รอบ)
3. ถ้าไม่ผ่านเกิน 3 รอบ → stop และ report

### 10. Report

> Goal: รายงานผลลัพธ์ครบวงจร

1. ทำ `/report` พร้อม `/report-table`: agent id, status, result, severity
2. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป
3. ถ้ามี orphan agents ให้หยุดและ report ก่อนจบ

## Rules

### 1. Task Isolation

- แต่ละ subtask ต้อง independent และมี scope ชัดเจน
- ห้ามหลาย agent แก้ไขไฟล์เดียวกัน
- กำหนด timeout แต่ละ agent ชัดเจน

### 2. Clear Prompts

- prompt ต้องระบุ deliverable, constraints, success criteria
- ห้ามสั่งให้ agent ตัดสินใจเรื่องเสี่ยงเอง
- แนบ context ที่จำเป็นเท่านั้น

### 3. No Orphan Agents

- บันทึกทุก agent id
- ติดตามจนทุก agent จบหรือถูก kill
- ถ้า agent ค้างเกิน timeout ให้ kill แล้ว report

### 4. Merge Safety

- ตรวจสอบ conflicts ก่อน merge เสมอ
- รักษา consistency ของ codebase
- validate/verify หลัง merge เสมอ

## Expected Outcome

- Subagents ถูก spawn ตาม subtasks และจบครบทุกตัว
- ผลลัพธ์ถูก merge โดยไม่มี conflicts
- ผลลัพธ์ผ่าน `/review-and-fix`, `/deep-validate`, `/deep-verify`
- รายงาน status ของทุก agent พร้อม evidence
- ขั้นต่อไปชัดเจนจาก `/suggest-next-action`
