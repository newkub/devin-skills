---
name: add-context-to-devin-global-skills
description: รับ context จาก session หรือ user แล้วตัดสินใจเพิ่มลง global skill ทีมีอยู่ หรือสร้าง skill ใหม
argument-hint: "<context-or-prompt>"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - skill
  - run_subagent
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - list-devin-global-skills
  - new-skills
  - update-devin-global-skills
  - use-related-skills
  - review-devin-global-skills
  - idea-devin-global-skills-from-session
  - from-chat-session
  - ask-me
---

## Goal

รับ context จาก session, user prompt, หรือ learned information แล้วตัดสินใจว่าควรเพิ่มลง global skill ใด หรือสร้าง skill ใหม

## Scope

ใช้เมื่อ user ต้องการบันทึก context, ความรู้, pattern, workflow, หรือข้อมูลทีคุยกันล่าสุด ลงใน `%APPDATA%\devin\skills` โดยพยายามเพิ่มในทีมีอยู่ก่อน ถ้าไม่ได้ค่อยสร้างใหม

## Execute

### 1. Capture Context

> Goal: รับและสรุป context ทีต้องการเพิ่ม

1. ถ้ามี argument จาก user ให้ทำ `/from-chat-session` เพื่อดึง context จาก session แล้วทำ `/ask-me` ถาม user ว่าเหมายถึงอันไหน
2. รับ input จาก user เช่น สรุป context, keyword, topic, prompt, หรือสรุปสิ่งทีคุยกัน
3. ถ้า input เป้น link/URL ให้ fetch หรือ scrape เพื่อสรุป title และคำอธิบาย
4. ถ้า input กว้างหรือไม่ชัด ให้ถาม user ว่าต้องการ save อะไร
5. ถ้าไม่มี input ให้สรุป context ล่าสุดจาก session

### 2. List Existing Skills

> Goal: หา skill ทีอาจเหมาะสม

1. ทำ `/list-devin-global-skills` เพื่อดู skills ทีมี
2. ทำ `/use-related-skills` เพื่อหา skills ทีเกี่ยวข้อง
3. ใช้ `grep` ค้นหา skill ทีเกี่ยวข้องกับ context แบบ case-insensitive
4. อ่าน skill ทีมีความเกี่ยวข้องสูง 2-4 ไฟล์
5. ดู `description`, `scope`, `related` เพื่อประเมินความเหมาะสม

### 3. Decide Placement

> Goal: ตัดสินใจวาง context ทีไหน

1. ถ้า context เป้น tool/library/framework → เน้น skill ทีชื่อตรง
2. ถ้า context เป้นหัวข้อกว้าง/คู่มือ → อาจเพิ่ม `related` หรือ `references/`
3. ถ้า context เป้น workflow/pattern → เพิ่มลง skill ทีมี domain ตรงกัน
4. ถ้า context เป้น skill candidate ใหม → สร้าง skill ใหม
5. ถ้า context ซ้ำกับ skill ทีมี → หยุดและบอก user

### 4. Add To Existing Skill

> Goal: เพิ่ม context ลง skill ทีมีอยู่

1. เปิด `SKILL.md` ของ skill ทีเลือก
2. เพิ่ม context ลงใน `related` ถ้าเป้นชื่อ skill อื่น
3. เพิ่มลงใน `references/` หรือ `links` ถ้าเป้น URL/resource
4. เพิ่ม bullet ใน `Execute` หรือ `Rules` ถ้าเป้นข้อกำหนด/ขั้นตอน
5. ใช้ `edit` หรือ `write` อย่างระมัดระวัง ไม่ทำลาย frontmatter
6. ตรวจ frontmatter ให้ถูกต้อง

### 5. Create New Skill

> Goal: สร้าง skill ใหมถ้าไม่มีทีเหมาะ

1. ถ้า context ไม่เข้ากับ skill ใดเลย ให้ถาม user ว่าต้องการสร้างใหมหรือไม
2. ถ้า context มาจาก session pattern ทำ `/idea-devin-global-skills-from-session`
3. ถ้า user ตกลง ให้ใช้ `/new-skills` หรือ `/update-devin-global-skills`
4. ตั้งชื่อ skill ให้ตรงกับ directory name และ `description` ≤ 100 ตัวอักษร
5. ใส่ `related` ครบถ้วน

### 6. Verify

> Goal: ตรวจสอบความถูกต้อง

1. อ่าน skill ทีแก้ไขอีกครั้งเพื่อตรวจ reference
2. ทำ `/check-skills-related` เพื่อตรวจ `related` ซ้ำ/หาย
3. ทำ `/review-devin-global-skills` ถ้าแก้หลาย skill
4. ทำ `/update-references` ถ้ามีการสร้าง/ลบ/ย้าย skill

## Rules

- พยายามเพิ่ม context ใน skill ทีมีอยู่ก่อน ก่อนจะสร้างใหม
- อย่าเพิ่ม reference ซ้ำ
- อย่าแก้ `name` หรือ `description` ของ skill โดยไม่จำเป็น
- ถ้า context เป้น secret/token ให้ปฏิเสธและบอกให้เก็บใน secret manager
- ถ้า context เป้น URL ให้ fetch สรุปก่อนตัดสินใจ
- ถ้าไม่แน่ใจให้ถาม user ก่อนแก้
- ถ้าต้องสร้าง skill ใหม ให้ตรวจซ้ำก่อนสร้าง

## Expected Outcome

- Context ถูกเพิ่มลง skill ทีเหมาะสม
- User ทราบว่า context อยู่ทีไหนและเหตุผล
- ถ้าสร้าง skill ใหม ก็ต้องผ่าน conventions และ validation
