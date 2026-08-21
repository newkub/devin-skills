---
name: update-reference
description: อัพเดท references ทั้งหมดเมื่อแก้ไขไฟล์
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

## Goal

อัพเดท references ทั้งหมดเมื่อมีการแก้ไขไฟล์ใน project, workflows, หรือ skills

## Scope

Use `update-reference` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Determine Context

ตรวจสอบว่าแก้ไขไฟล์ที่ไหนเพื่อกำหนด scope ของการค้นหา references

1. ตรวจสอบ path ของไฟล์ที่แก้ไข
2. ระบุว่าอยู่ใน project, workflows, หรือ skills
3. ตรวจสอบ workspace ที่ใช้งานปัจจุบัน

### 2. Update Project References

เมื่อแก้ไขไฟล์ใน project ให้ค้นหาและอัพเดท references ภายใน project

1. ใช้ search tool ค้นหา references ใน project directory
2. ระบุชื่อไฟล์หรือ path ที่แก้ไขเพื่อค้นหา references
3. อัพเดท references ที่ตรงกับไฟล์ที่แก้ไข
4. ตรวจสอบว่าไม่มี references ที่เสียหายหรือชี้ไปยังไฟล์เดิม

### 3. Update Workflow References

เมื่อแก้ไขไฟล์ใน workflows ให้ค้นหาและอัพเดท references ใน workflows และ skills

1. ใช้ search tool ค้นหา references ใน global_workflows directory
2. ใช้ search tool ค้นหา references ใน skills directory
3. ระบุชื่อ workflow ที่แก้ไขเพื่อค้นหา references
4. อัพเดท references ที่ตรงกับ workflow ที่แก้ไข
5. ตรวจสอบว่าไม่มี references ที่เสียหายหรือชี้ไปยัง workflow เดิม

### 4. Update Skill References

เมื่อแก้ไขไฟล์ใน skills ให้ค้นหาและอัพเดท references ภายใน skills

1. ใช้ search tool ค้นหา references ใน skills directory
2. ระบุชื่อ skill ที่แก้ไขเพื่อค้นหา references
3. อัพเดท references ที่ตรงกับ skill ที่แก้ไข
4. ตรวจสอบว่าไม่มี references ที่เสียหายหรือชี้ไปยัง skill เดิม

## Rules

## Rules

### 1. Context Detection

ตรวจสอบ context ก่อนอัพเดท references

- ต้องระบุว่าแก้ไขใน project, workflows, หรือ skills
- ใช้ path เพื่อระบุ context
- ตรวจสอบ workspace ที่ใช้งาน

### 2. Search Strategy

ใช้ search strategy ที่เหมาะสมกับ context เพื่อค้นหา references อย่างมีประสิทธิภาพ

- Project: ค้นหาใน project directory โดยใช้ workspace path เป็น base
- Workflows: ค้นหาใน global_workflows และ skills directories
- Skills: ค้นหาใน skills directory โดยใช้ pattern matching สำหรับ skill names
- ใช้ regex patterns สำหรับการค้นหา references ที่ซับซ้อน
- ใช้ exact string matching สำหรับ references ที่ชัดเจน

### 3. Reference Update

อัพเดท references อย่างถูกต้องและครบถ้วน

- ใช้ exact string matching สำหรับ references ที่ชัดเจน
- ใช้ regex replacement สำหรับ references ที่มี pattern ซับซ้อน
- ตรวจสอบว่า references ที่อัพเดทถูกต้องทั้งหมด
- อัพเดททุก references ที่เกี่ยวข้อง ไม่ว่าจะอยู่ในไฟล์ใด
- รักษา formatting และ indentation ของไฟล์หลังอัพเดท

### 4. Validation

ตรวจสอบผลลัพธ์หลังอัพเดทเพื่อให้แน่ใจว่า references ถูกต้องทั้งหมด

- ค้นหา references ที่เสียหายหรือชี้ไปยังไฟล์เดิม
- ตรวจสอบว่า references ที่อัพเดทถูกต้องและสอดคล้องกับการเปลี่ยนแปลง
- ตรวจสอบว่าไม่มี references ที่ซ้ำซ้อนหรือไม่จำเป็น
- ทำการ test หรือ verify ว่า references ที่อัพเดททำงานได้จริง
- ตรวจสอบว่าไม่มี syntax errors หรือ formatting issues หลังอัพเดท

## Expected Outcome

## Expected Outcome

### Project Context

- References ใน project ถูกอัพเดททั้งหมด
- ไม่มี references ที่เสียหายใน project

### Workflow Context

- References ใน workflows ถูกอัพเดททั้งหมด
- References ใน skills ถูกอัพเดททั้งหมด
- ไม่มี references ที่เสียหายใน workflows และ skills

### Skill Context

- References ใน skills ถูกอัพเดททั้งหมด
- ไม่มี references ที่เสียหายใน skills
