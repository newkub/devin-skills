---
name: add-to-devin-global-skills
description: เพิ่ม link/resource/topic ที user ให้มาเข้าไปใน Devin global skill ทีเหมาะสมโดยตรวจหา skill ทีควรใช้
argument-hint: "<url-or-topic>"
related:
  - update-devin-global-skills
  - consider-use-in-another-skills
  - check-skills-related
  - review-devin-global-skills
---

## Goal

รับ link, resource, topic หรือ reference ที user ให้มา แล้วหาว่าควรเพิ่มเข้าไปใน global skill ใด หรือสร้าง skill ใหม่อย่างไร

## Scope

- รับ input เป็น URL, keyword, concept, library, tool, หรือ reference
- สแกน existing global skills เพื่อหา skill ทีเกี่ยวข้อง
- อ่าน skill ทีคาดว่าเหมาะสม
- ตัดสินใจเพิ่มลงใน `related`, `references` หรือ section ทีเหมาะสม
- ถ้าไม่มี skill ทีตรง แนะนำสร้าง skill ใหม่หรือถาม user

## Execute

### 1. Capture Input

1. รับค่า input จาก user ได้แก่ link, keyword, topic, หรือ resource
2. ถ้า input เป็น link ให้ fetch หรือ scrape หัวข้อ/คำอธิบายสั้นๆ
3. ถ้า input เป็น keyword ให้สรุป domain เช่น library, tool, framework, deployment

### 2. Discover Relevant Skills

1. ใช้ `skill list` หรือ `skill search` เพื่อ list global skills
2. ใช้ `grep` ค้นหาชื่อ skill ทีเกี่ยวข้อง (case-insensitive)
3. อ่าน skill ทีมีความเกี่ยวข้องสูง 2-4 ไฟล์
4. ดู `description`, `related`, `scope` เพื่อประเมินความเหมาะสม

### 3. Decide Placement

1. ถ้า input เป็น tool/library → เน้น skill ทีชื่อตรงกับ tool/library นั้น
2. ถ้า input เป็นหัวข้อกว้าง → อาจเพิ่ม `related` ใน skill หลักและ skill ย่อย
3. ถ้า input เป็น deployment/hosting → เน้น deploy skill
4. ถ้า input เป็นคู่มือ/official docs → อาจเพิ่ม `references` section
5. ถ้า input เป็น skill ทีมีอยู่แล้ว → หยุดและบอก user ว่ามีอยู่แล้ว

### 4. Edit Skill

1. เปิด `SKILL.md` ของ skill ทีเลือก
2. เพิ่ม input ลงใน `related` ถ้าเป้นชื่อ skill อื่น
3. เพิ่มลงใน `references` หรือ `links` ถ้าเป้น URL หรือ resource
4. ถ้าต้องการ context มากกว่า ให้เพิ่ม bullet ใน `Execute` หรือ `Rules`
5. ใช้ `edit` หรือ `write` อย่างระมัดระวัง ไม่ทำลาย frontmatter
6. ตรวจ frontmatter ให้ถูกต้อง (name, description, related)

### 5. Verify

1. รัน `skill list` หรือ `skill search` เพื่อตรวจสอบว่า skill ถูกอ่านได้
2. อ่าน skill อีกครั้งเพื่อตรวจว่า reference ถูกใส่ถูกต้อง
3. ถ้าแก้หลาย skill ให้ตรวจ `related` ซ้ำซ้อน

### 6. Ask If Uncertain

1. ถ้ามีหลาย skill ทีอาจเหมาะ ให้ถาม user ก่อนแก้
2. ถ้า input ไม่ตรงกับ skill ใดเลย ให้ถามว่าต้องการสร้าง skill ใหม่หรือเพิ่มลง skill กว้างๆ

## Rules

1. อย่าสร้าง skill ใหม่ ถ้า input สามารถใส่ใน skill มีอยู่ได้
2. อย่าเพิ่ม reference ซ้ำ
3. อย่าแก้ `name` หรือ `description` ของ skill โดยไม่จำเป็น
4. ถ้า input เป็น secret/token ให้ปฏิเสธและบอกให้เก็บใน secret manager
5. ถ้า input เป็น URL ทีละเอียด ให้ fetch เพื่อสรุป title/คำอธิบายก่อนตัดสินใจ

- ใช้ /update-devin-global-skills ถ้าจำเป็น
- ใช้ /consider-use-in-another-skills ถ้าจำเป็น
- ใช้ /check-skills-related ถ้าจำเป็น
- ใช้ /review-devin-global-skills ถ้าจำเป็น
## Expected Outcome

- รู้ว่า input ควรอยู่ใน skill ใด
- Skill ถูกอัปเดตด้วย reference ทีถูกต้อง
- User ทราบวาเพิ่มลงทีไหนและเหตุผล
