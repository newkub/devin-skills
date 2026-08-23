---
name: consider-use-in-another-skills
description: พิจารณาใช้หรืออ้างอิง skill อื่นก่อนสร้าง/duplicate
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - list-skills
  - ask-me
  - check-circular-dependencies
  - check-reference
  - update-reference
  - validate
---

## Goal

ใช้งานหรืออ้างอิง skill หนึ่งภายในอีก skill โดยปลอดภัย ไม่ซ้ำซ้อน และ references ถูกต้อง

## Scope

ใช้เมื่อ skill ต้องการ delegate งานไปยัง skill อื่น หรือต้องการให้ user/AI เรียก skill อื่นต่อใน workflow

## Execute

### 1. Identify Reusable Skill

> Goal: ระบุ skill ที่จะใช้งาน
> Goal: ไม่ reinvent เนื้อหาที่มีอยู่

1. ทำ `/list-skills` เพื่อหา skill ที่เกี่ยวข้อง
2. อ่าน `SKILL.md` ของ skill เป้าหมาย
3. ตรวจสอบ Goal, Scope, Execute ว่าเหมาะกับงานของเรา
4. ถ้าไม่มี skill ที่เหมาะ → ทำ `/ask-me` ก่อนสร้างใหม่

### 2. Add To Related

> Goal: เพิ่ม reference ใน frontmatter
> Goal: skill ของเราลิงก์ไป skill เป้าหมายอย่างถูกต้อง

1. เปิด `SKILL.md` ของเรา
2. เพิ่มชื่อ skill เป้าหมายใน `related` ถ้ายังไม่มี
3. เรียงลำดับ `related` ตามลำดับการเรียก
4. ไม่่เพิ่ม skill ที่ไม่ได้ใช้จริง

### 3. Reference In Prompt Body

> Goal: อ้างอิง skill ในเนื้อหา
> Goal: บอกว่าต้องเรียก skill เป้าหมายเมื่อใด

1. ใช้ backticks สำหรับ `skill-name` เช่น ทำตาม `/follow-containerize-app`
2. ระบุ condition ก่อนเรียก เช่น "ถ้าเป็น production → ทำ `/follow-release-docker`"
3. ไม่่คัดลอกเนื้อหาของ skill เป้าหมายมาทั้้งหมด
4. ถ้า skill เป้าหมายหลายตัว ให้ระบุลำดับก่อนหลัง

### 4. Verify Circular References

> Goal: ตรวจสอบ references ไม่วนกลับ
> Goal: ไม่เกิด infinite loop หรือ circular dependency

1. ทำ `/check-circular-dependencies` หรือ `/check-reference`
2. ตรวจว่า skill เป้าหมายไม่ได้อ้างอิงกลับมาที่เรา
3. ถ้ามี loop ให้เลือก skill ตัวกลางหรือรวมเนื้อหา

### 5. Update And Validate

> Goal: อัปเดท references และ validate
> Goal: ทุก reference ใช้งานได้จริง

1. ทำ `/update-reference` เพื่อ sync references
2. ทำ `/validate` เพื่อตรวจความถูกต้อง
3. ทำ `/check-reference` เพื่อยื่นยันว่า skill เป้าหมายมีอยู่จริง

## Rules

### 1. Delegate, Don’t Duplicate

- ถ้า skill อื่นครอบคลุมงานอยู่แล้ว ให้อ้างอิงแทนการคัดลอก
- เก็บเฉพาะ context หรือ steps ที่เฉพาะของ skill เรา

### 2. Explicit Conditions

- ระบุว่าเมื่อไหร่ต้องเรียก skill เป้าหมาย
- อย่าสั่งให้เรียกทุกกรณี ถ้าไม่จำเป็น

### 3. Keep Related Accurate

- `related` ต้องมีเฉพาะ skills ที่เรียกโดยตรง
- ถ้าเลิกใช้ skill ให้เอาออกจาก `related`

### 4. No Circular Dependencies

- ไม่ให้ skill A อ้างอิง skill B แล้ว B อ้างอิง A
- ถ้าจำเป็นทั้งสองทาง ให้รวมเป็น skill เดียวหรือใช้ skill กลาง

## Expected Outcome

- Skill ของเราอ้างอิง skill อื่นได้ถูกต้อง
- `related` ครบถ้วนและไม่มี missing/unused
- ไม่มี circular references
- ผ่าน `/validate` และ `/check-reference`
