---
name: use-workflows
description: หลักการใช้ global workflows ใน workspace
---

## Goal

ตรวจสอบความซ้ำซ้อนระหว่าง workspace workflows และ global workflows และใช้งานจาก global workflows

## Scope

ใช้สำหรับการตรวจสอบและใช้งาน global workflows ใน workspace ต่างๆ

## Execute

### 1. Check For Redundancy

ตรวจสอบความซ้ำซ้อนกับ global workflows

1. อ่าน global rules จาก `c:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md` เพื่อดู global workflows ทั้งหมด
2. อ่าน workflows ใน `global_workflows/` ที่คล้ายกับสิ่งที่ต้องการทำ
3. เปรียบเทียบกับ workflows ที่มีอยู่ใน workspace
4. ระบุสิ่งที่ซ้ำซ้อนและสามารถลบได้
5. ระบุสิ่งที่ global workflows มีแต่ workspace ยังไม่มี

### 2. Identify Reusable Workflows

ระบุสิ่งที่สามารถใช้จาก global workflows ได้

1. ค้นหา workflows ตามหมวดหมู่ที่ต้องการ (development, deployment, code quality, ฯลฯ)
2. อ่าน description ใน frontmatter เพื่อเข้าใจ purpose
3. ตรวจสอบ related_workflows สำหรับ dependencies
4. ระบุ workflows ที่สามารถใช้ได้โดยไม่ต้องปรับแต่ง
5. ระบุ workflows ที่ต้อง customize สำหรับ workspace

### 3. Use Global Workflows

ใช้งานจาก global workflows

1. เรียกใช้ด้วย `/workflow-name` ในแชท
2. Cascade ค้นหาจาก `global_workflows/` ก่อน
3. หากไม่พบ จะค้นใน `.windsurf/workflows/` ของ workspace
4. Workspace workflows override global workflows (priority สูงกว่า)

### 4. Customize If Needed

ปรับแต่ง workflows สำหรับ workspace ถ้าจำเป็น

1. คัดลอก workflows ที่ต้องการไป `.windsurf/workflows/`
2. ปรับแต่งตาม project type และ tech stack
3. รักษา core logic จาก global workflows
4. Document customizations ใน README

## Rules

ทำตาม `/follow-principles-engineering`

- เขียนเป็นหลักการทั่วไป ไม่เจาะจง
- ใช้ generic terms แทน specific tools
- อธิบาย concepts ไม่ใช่ implementations
- หลีกเลี่ยง hard-coded values

## Expected Outcome

- รู้จักวิธีค้นหา global workflows
- สามารถใช้ global workflows ได้
- สามารถ customize ตาม workspace ได้
