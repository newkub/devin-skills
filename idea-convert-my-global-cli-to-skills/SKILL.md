---
name: idea-convert-my-global-cli-to-skills
description: สร้างไอเดียและ draft แปลง CLI tools ที่ติดตั้งเป็น Devin skills
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
  - skill
triggers:
  - user
  - model
related:
---

## Goal

สร้างไอเดียและ draft สำหรับแปลง CLI tools ที่ติดตั้งบนเครื่อง หรือ CLI ที่ระบุ เป็น Devin skills ตามมาตรฐาน

## Scope

ใช้หลัง `/report-my-global-cli` หรือเมื่อต้องการ convert CLI ใดๆ เป็น skills:

- สำรวจ commands ของ installed CLI tools
- ประเมิน command ใดควรเป็น skill
- เขียน draft skill ตาม `/follow-write-devin-skills`
- รองรับทั้ง single CLI, multiple tools และ global CLI set

## Execute

### 1. Select CLI Tools

> Goal: ระบุ CLI ทีต้องการ convert
> Goal: ทราบ scope ของ tools

1. ดูรายการจาก `/report-my-global-cli` หรือถาม user
2. ถ้าไม่มี report ทำ `/follow-my-global-cli` เพื่อ list ทีติดตั้ง
3. เลือก 1-3 tools ต่อรอบ — ถ้ามากกว่านั้นให้ทำ `/create-plan`
4. ตรวจสอบ version, installation path และ global availability

### 2. Explore Commands

> Goal: เรียนรู้ command structure ของแต่ละ tool
> Goal: รู้ commands, subcommands, options ที่ควร convert

1. ทำ `/learn-from-cli` กับแต่ละ tool
2. รัน `<tool> --help` และ `<tool> <command> --help`
3. บันทึก:
   - ชื่อ command และ subcommand
   - flags/options ที่ใช้บ่อย
   - input/output pattern, exit codes
   - ตัวอย่างการใช้งานทั่วไป

### 3. Evaluate Conversion Candidates

> Goal: ประเมินว่า command ไหนน่าเป็น skill
> Goal: ได้รายการ commands ที่มี justification ชัดเจน

1. ใช้ criteria:
   - ใช้บ่อยใน project หรือ workflow
   - มี flags/options หลายตัว จำเป็นต้องมี guideline
   - ใช้งานซับซ้อนหรือต้องจำลำดับขั้นตอน
   - นำไปใช้ใน workspace อื่นได้
2. ให้คะแนน 1-5 สำหรับแต่ละ command ในแต่ละ criterion
3. รวมคะแนนและจัดลำดับ: High (≥14), Medium (9-13), Low (<9)
4. รวม commands ที่คล้ายกันเป็น skill เดียวถ้า goal ตรงกัน

### 4. Group And Prioritize

> Goal: จัดกลุ่ม commands ตาม concern และ priority
> Goal: ได้กลุ่ม commands ทีสมควรแยก skill

1. แยก commands ทีซับซ้อนหรือใช้บ่อยมากเป็น skill เดียว
2. รวม create/delete/list ของ resource เดียวกันเป็น skill เดียวถ้าเหมาะสม
3. ระบุ low-priority commands ที่อาจไม่ต้องสร้าง skill
4. กำหนดชื่อ skill ในรูป `<tool>-<command>` หรือ `<tool>-<purpose>`

### 5. Draft Skills

> Goal: เขียน draft skill สำหรับ candidates ที่เลือก
> Goal: ได้ draft skills ทีพร้อม review

1. ใช้ `/follow-write-devin-skills` สำหรับแต่ละ skill
2. ใน draft ต้องระบุ:
   - `name` ทีสื่อความหมาย
   - `description` ≤100 ตัวอักษร
   - `triggers`, `allowed-tools`, `related`
   - `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
3. ใส่ `related` ไปยัง skills อื่นใน ecosystem เดียวกัน
4. ทำ `/report-table` เพื่อสรุป draft skills ทีสร้าง

### 6. Validate And Suggest

> Goal: ตรวจสอบและนำเสนอทิศทางถัดไป
> Goal: skills ผ่านเกณฑ์และผู้ใช้ทราบ next step

1. ทำ `/validate` ตรวจ frontmatter, references, เงื่อนไขต่างๆ
2. ตรวจว่าไม่มีชื่อ skill ซ้ำด้วย `grep`
3. ถ้า draft ผ่าน → ทำ `/follow-write-devin-skills` เพื่อ commit หรือบันทึก skills
4. ถ้าต้องปรับ → ทำ `/follow-my-global-cli` อีกรอบหรือ `/learn-from-cli`
5. ถ้าไม่มี candidates → ทำ `/suggest-next-action`

## Rules

### 1. Conversion Criteria

- สร้าง skill เฉพาะ command ทีมี justification ชัดเจน
- ไม่ duplicate กับ skills ทีมีอยู่ — ทำ `grep` ชื่อคล้ายกันก่อน
- หนึ่ง skill ครอบคลุม command หรือกลุ่ม commands ทีมี goal เดียวกัน
- ไม่สร้าง skill สำหรับ command ทีทำงานเสร็จในบรรทัดเดียวและไม่มี options สำคัญ

### 2. Naming And Semantics

- ชื่อ skill ควรสะท้อน command จริง เช่น `<tool>-<command>` หรือ `<tool>-<purpose>`
- ใช้ flags/options เดิมของ CLI ใน instructions
- รักษา exit codes และ error handling ของ CLI
- หลีกเลี่ยงชื่อ generic เช่น `use-cli` หรือ `my-cli`
- ถ้า command ใช้ใน project หลาย workspace ควรตั้งชื่อให้ทั่วไป

### 3. Draft Quality

- ใช้ภาษาไทยสำหรับเนื้อหา
- ใช้ backticks สำหรับ `commands`, `tools`, `paths` และ skill references
- ไม่เกิน 250 บรรทัดต่อ skill
- ระบุ `allowed-tools` ตาม tools ที command เรียกโดยตรง

## Expected Outcome

- รายการ CLI tools และ commands ทีควรแปลงเป็น skills พร้อมคะแนน
- กลุ่ม commands ทีจัดเป็น skill เดียวกันและ priority
- draft skills สำหรับ High priority commands
- ตารางสรุป commands, draft skill names และ next action
- ทุก draft ผ่าน `/validate` และไม่มีชื่อซ้ำ
