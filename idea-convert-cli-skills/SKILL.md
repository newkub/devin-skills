---
name: idea-convert-cli-skills
description: สร้างไอเดียแปลง CLI commands จาก installed tools เป็น devin skills
triggers:
  - user
  - model
allowed-tools:
  - read
  - skill
related:
  - follow-my-global-cli
  - learn-from-cli
  - follow-write-devin-skills
  - report-format-table
  - suggest-next-action
---

## Goal

สร้างไอเดียและ draft สำหรับแปลง CLI commands ที่ใช้บ่อย เป็น devin skills ที่ติดตามมาตรฐาน

## Scope

ใช้เมื่อต้องการแปลง CLI commands ที่ติดตั้งอยู่ เป็น devin skills โดย:

- สำรวจ commands ของ installed CLI tools
- ประเมินว่า command ใดควรเป็น skill
- เขียน draft skill ตาม `/follow-write-devin-skills`

## Execute

### 1. List Installed CLI Tools

หา CLI tools ที่ติดตั้ง

> Goal: มีรายการ tools ที่จะสำรวจ

1. ทำ `/follow-my-global-cli` เพื่อรายการ tools ที่ติดตั้ง
2. ถ้ามีผลลัพธ์จากการ report CLI tools ก่อนหน้า ให้ใช้เป็นจุดเริ่มต้น
3. เลือก 1-3 tools ต่อรอบเพื่อไม่ให้ผลลัพธ์ยาวเกินไป

### 2. Explore Commands

เรียนรู้ commands ของแต่ละ tool

> Goal: รู้ commands, subcommands, options ที่ควร convert

1. ทำ `/learn-from-cli` กับแต่ละ tool เพื่อดู command structure
2. บันทึก:
   - ชื่อ command และ subcommand
   - flags/options ที่ใช้บ่อย
   - input/output pattern
   - exit codes
   - ตัวอย่างการใช้งานทั่วไป

### 3. Evaluate Conversion Candidates

ประเมินว่า command ไหนน่าเป็น skill

> Goal: ได้รายการ commands ที่มี justification ชัดเจน

1. ใช้ criteria:
   - ใช้บ่อยใน project หรือ workflow
   - มี flags/options หลายตัว จำเป็นต้องมี guideline
   - ใช้งานซับซ้อนหรือต้องจำลำดับขั้นตอน
   - นำไปใช้ใน workspace อื่นได้
2. ให้คะแนน 1-5 สำหรับแต่ละ command ในแต่ละ criterion
3. รวมคะแนนและจัดลำดับ: High (≥14), Medium (9-13), Low (<9)

### 4. Draft Skills

เขียน draft skill สำหรับ candidates ที่เลือก

> Goal: ได้ draft skill ที่สมบูรณ์พอให้ตัดสินใจต่อ

1. ทำ `/follow-write-devin-skills` เพื่อสร้าง draft skill สำหรับ command แต่ละอัน
2. ใน draft ต้องระบุ:
   - `name` ที่สื่อความหมาย เช่น `<tool>-<command>`
   - `description` ≤100 ตัวอักษร
   - `triggers`, `allowed-tools`, `related`
   - `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
3. ทำ `/report-format-table` เพื่อสรุป draft skills ที่สร้าง

### 5. Suggest Next Action

นำเสนอทิศทางถัดไป

> Goal: ผู้ใช้ทราบว่าควรทำอะไรต่อ

1. ถ้า draft ผ่าน → ทำ `/follow-write-devin-skills` เพื่อ commit หรือบันทึก skills
2. ถ้าต้องปรับ criteria → ทำ `/follow-my-global-cli` อีกรอบเพื่อรวบรวมข้อมูลใหม่
3. ถ้าไม่มี candidates → ทำ `/suggest-next-action` เพื่อหาทิศทางอื่น

## Rules

### 1. Conversion Criteria

- สร้าง skill เฉพาะ command ที่มี justification ชัดเจน
- ไม่ duplicate กับ skills ที่มีอยู่ — ทำ `grep` ชื่อคล้ายกันก่อน
- กลุ่ม commands ที่ใกล้เคียงกันสามารถรวมเป็น skill เดียวได้
- ไม่สร้าง skill สำหรับ command ที่ทำงานเสร็จในบรรทัดเดียวและไม่มี options สำคัญ

### 2. Draft Quality

- ใช้ภาษาไทยสำหรับเนื้อหา
- ใช้ backticks สำหรับ `commands`, `tools`, `paths` และ skill references
- ไม่เกิน 250 บรรทัดต่อ skill
- ระบุ `allowed-tools` ตาม tools ที่ command เรียกโดยตรง

### 3. Naming Convention

- ชื่อ skill ควรเป็น `<tool>-<command>` หรือ `<tool>-<purpose>`
- หลีกเลี่ยงชื่อ generic เช่น `use-cli` หรือ `my-cli`
- ถ้าเป็น command ที่ใช้ใน project หลาย workspace ควรตั้งชื่อให้ทั่วไป

## Expected Outcome

- รายการ CLI commands ที่ควรแปลงเป็น skills พร้อมคะแนน
- draft skills สำหรับ High priority commands
- ตารางสรุป commands และ draft skill names
- คำแนะนำถัดไป เช่น refine, commit หรือหยุด
