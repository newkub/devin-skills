---
name: follow-workflows
description: อ่านและทำตาม workflows ทั้ง global และ project
---

## Goal

อ่านและทำตาม workflows ทั้ง global workflows และ project workflows ตามที่เหมาะสม

## Scope

ใช้สำหรับทุก workspace เพื่ออ่านและทำตาม workflows ทั้งใน global_workflows/ และ workspace

## Execute

### 1. Read Global Workflows

อ่าน global workflows ทั้งหมดใน `global_workflows/` เพื่อเข้าใจมาตรฐานและป้องกันการซ้ำซ้อน

- ทำ `/read-related-workflows` เพื่ออ่าน workflows ที่เกี่ยวข้องแบบ recursive
- ระบุ workflows ที่เกี่ยวข้องกับ task ปัจจุบัน
- ตรวจสอบว่า workflows มีอยู่จริง

### 2. Read Project Workflows

อ่าน project workflows ใน workspace ปัจจุบัน

- อ่าน workflows ใน `.devin/workflows/` หรือ `.windsurf/workflows/`
- ระบุ workflows ที่เกี่ยวข้องกับ task ปัจจุบัน
- ตรวจสอบว่า workflows มีอยู่จริง

### 3. Check References

ตรวจสอบ references ก่อนเริ่มทำตาม workflows

- ทำ `/check-reference` เพื่อตรวจสอบ references มีอยู่จริง
- ตรวจสอบ workflows ที่จะอ้างถึงว่ามีอยู่จริง
- ตรวจสอบ skills ที่จะอ้างถึงว่ามีอยู่จริง

### 4. Execute Workflows

ทำตาม workflows ที่เลือกตามลำดับที่ระบุ

- ทำตาม workflows ที่เลือกตามลำดับที่ระบุ
- ใช้ reference แทนการ duplicate เนื้อหา
- ตรวจสอบว่า execution steps ทำครบถ้วน

## Rules

- อ่าน global workflows ก่อน project workflows
- ใช้ reference แทนการ duplicate เนื้อหา
- ตรวจสอบ references มีอยู่จริงก่อนอ้างอิง
- ทำตามลำดับที่ระบุใน workflows
- ตรวจสอบว่า execution steps ทำครบถ้วน

## Expected Outcome

- อ่านและทำตาม workflows ทั้ง global และ project ได้อย่างถูกต้อง
- ไม่มีการ duplicate เนื้อหา
- References ถูกต้องทั้งหมด
- Execution steps ทำครบถ้วน
