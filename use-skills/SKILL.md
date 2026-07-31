---
name: use-skills
description: หลักการใช้ skills จาก skills repository ใน workspace
---

## Goal

อธิบายหลักการในการดูแลและใช้ skills จาก skills repository ใน workspace

## Scope

ใช้สำหรับการจัดการ skills จาก `c:\Users\Veerapong\.codeium\windsurf\skills` ใน workspace ต่างๆ

## Execute

### 1. Discover Available Skills

ค้นหา skills ที่มีอยู่ใน skills repository

1. ดูใน `skills/` folder
2. ค้นหาตามหมวดหมู่ที่ต้องการ (frameworks, tools, patterns, ฯลฯ)
3. อ่าน description ใน frontmatter เพื่อเข้าใจ purpose
4. ตรวจสอบ related_workflows สำหรับ dependencies
5. อ่าน `SKILL.md` ของแต่ละ skill

### 2. Use Skills in Workspace

ใช้ skills ใน workspace

1. เรียกใช้ด้วย `/skill-name` ในแชท
2. Cascade ค้นหาจาก `skills/` ก่อน
3. หากไม่พบ จะค้นใน `.windsurf/skills/` ของ workspace
4. Workspace skills override global skills (priority สูงกว่า)

### 3. Customize for Workspace

ปรับแต่ง skills ตามความต้องการ

1. คัดลอก skills ที่ต้องการไป `.windsurf/skills/`
2. ปรับแต่งตาม project type และ tech stack
3. รักษา core logic จาก global skills
4. Document customizations ใน README

## Rules

ทำตาม `/follow-principles-engineering`

- เขียนเป็นหลักการทั่วไป ไม่เจาะจง
- ใช้ generic terms แทน specific tools
- อธิบาย concepts ไม่ใช่ implementations
- หลีกเลี่ยง hard-coded values

## Expected Outcome

- รู้จักวิธีค้นหา skills
- สามารถใช้ skills ได้
- สามารถ customize ตาม workspace ได้
