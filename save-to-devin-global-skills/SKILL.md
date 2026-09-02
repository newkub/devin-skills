---
name: save-to-devin-global-skills
description: รับ link, resource, topic หรือ prompt แล้วบันทึกลง global skill ทีเหมาะสม
argument-hint: "<input-or-prompt>"
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
  - update-devin-global-skills
  - new-skills
  - idea-new-skills
  - check-skills-related
  - use-in-another-skills
  - review-devin-global-skills
---

## Goal

รับ `link`, `resource`, `topic` หรือ `prompt` ที user ให้มา แล้วหาว่าควรบันทึกลง global skill ใด หรือสร้าง skill ใหม่อย่างไร

## Scope

ใช้เมื่อ user ต้องการ save context ทีคุยกันล่าสุด หรือ save `prompt` ทีบอกไป ลงใน `C:\Users\Veerapong\AppData\Roaming\devin\skills` รองรับ input เป็น URL, keyword, concept, library, tool, framework, หรือ reference

## Execute

### 1. Capture Input

1. รับค่า input จาก user ได้แก่ `link`, `keyword`, `topic`, `prompt` หรือสรุป context ล่าสุด
2. ถ้า input เป็น link ให้ fetch หรือ scrape หัวข้อและคำอธิบายสั้น ๆ
3. ถ้า input เป็น keyword ให้สรุป domain เช่น library, tool, framework, deployment
4. ถ้า user ไม่ระบุ input ให้ถามว่าต้องการ save context ล่าสุด หรือ save อะไร

### 2. Discover Relevant Skills

1. รายการ global skills ทั้งหมดจาก `C:\Users\Veerapong\AppData\Roaming\devin\skills`
2. ใช้ `grep` ค้นหาชื่อ skill ทีเกี่ยวข้องแบบ case-insensitive
3. อ่าน skill ทีมีความเกี่ยวข้องสูง 2-4 ไฟล์
4. ดู `description`, `related`, `scope` เพื่อประเมินความเหมาะสม

### 3. Decide Placement

1. ถ้า input เป็น tool/library → เน้น skill ทีชื่อตรงกับ tool/library นั้น
2. ถ้า input เป็นหัวข้อกว้าง → อาจเพิ่ม `related` ใน skill หลักและ skill ย่อย
3. ถ้า input เป็น deployment/hosting → เน้น deploy skill
4. ถ้า input เป็นคู่มือ/official docs → อาจเพิ่มลงใน `references/` ของ skill
5. ถ้า input เป็น skill ทีมีอยู่แล้ว → หยุดและบอก user ว่ามีอยู่แล้ว

### 4. Edit Skill

1. เปิด `SKILL.md` ของ skill ทีเลือก
2. เพิ่ม input ลงใน `related` ถ้าเป้นชื่อ skill อื่น
3. เพิ่มลงใน `references/` หรือ `links` ถ้าเป้น URL หรือ resource
4. ถ้าต้องการ context มากกว่า ให้เพิ่ม bullet ใน `Execute` หรือ `Rules`
5. ใช้ `edit` หรือ `write` อย่างระมัดระวัง ไม่ทำลาย frontmatter
6. ตรวจ frontmatter ให้ถูกต้อง (`name`, `description`, `related`)

### 5. Verify

1. รัน `grep` หรืออ่าน skill อีกครั้งเพื่อตรวจว่า reference ถูกใส่ถูกต้อง
2. ทำ `/check-skills-related` เพื่อตรวจ `related` ซ้ำซ้อนหรือหาย
3. ถ้าแก้หลาย skill ให้ตรวจ `related` ซ้ำซ้อน

### 6. Ask If Uncertain

1. ถ้ามีหลาย skill ทีอาจเหมาะ ให้ถาม user ก่อนแก้
2. ถ้า input ไม่ตรงกับ skill ใดเลย ให้ถามว่าต้องการสร้าง skill ใหม่หรือเพิ่มลง skill กว้าง ๆ

## Rules

- อย่าสร้าง skill ใหม่ ถ้า input สามารถใส่ใน skill ทีมีอยู่ได้
- อย่าเพิ่ม reference ซ้ำ
- อย่าแก้ `name` หรือ `description` ของ skill โดยไม่จำเป็น
- ถ้า input เป็น secret/token ให้ปฏิเสธและบอกให้เก็บใน `secret manager`
- ถ้า input เป็น URL ทีละเอียด ให้ fetch เพื่อสรุป title/คำอธิบายก่อนตัดสินใจ
- ถ้าต้องสร้าง skill ใหม่ → ใช้ `/new-skills` หรือ `/update-devin-global-skills`
- ถ้าไม่แน่ใจว่า input ควรใส่ skill ไหน → ใช้ `/use-in-another-skills`
- หลังแก้ skill → ใช้ `/review-devin-global-skills` เพื่อตรวจความถูกต้อง

## Expected Outcome

- รู้ว่า input ควรอยู่ใน skill ใด
- Skill ถูกอัปเดตด้วย reference ทีถูกต้อง
- User ทราบว่าเพิ่มลงทีไหนและเหตุผล
