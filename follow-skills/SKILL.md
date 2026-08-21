---
name: follow-skills
description: อ่านและใช้ skills ที่มีอยู่ตามที่เหมาะสม
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

อ่านและใช้ skills ที่มีอยู่ตามที่เหมาะสมกับ task ปัจจุบัน

## Scope

ใช้สำหรับทุก workspace เพื่ออ่านและใช้ skills ที่มีอยู่

## Execute

### 1. Read Available Skills

อ่าน skills ที่มีอยู่ทั้งหมด

- ทำ `/read-related-skills` เพื่ออ่าน workflows ที่เกี่ยวข้องกับ skills
- อ่าน skills ที่มีอยู่ใน `skills/`
- ระบุ skills ที่เกี่ยวข้องกับ task ปัจจุบัน
- ตรวจสอบว่า skills มีอยู่จริง

### 2. Check References

ตรวจสอบ references ก่อนเริ่มใช้ skills

- ทำ `/check-reference` เพื่อตรวจสอบ references มีอยู่จริง
- ตรวจสอบ skills ที่จะอ้างถึงว่ามีอยู่จริง
- ตรวจสอบ dependencies ของ skills มีอยู่จริง

### 3. Use Skills

ใช้ skills ที่เลือกตามที่เหมาะสม

- ใช้ skills ที่เลือกตามที่เหมาะสมกับ task
- ทำตาม instructions ใน skills
- ตรวจสอบว่าผลลัพธ์ถูกต้อง

## Rules

- อ่าน skills ที่มีอยู่ก่อนใช้
- ใช้ skills ที่เหมาะสมกับ task
- ตรวจสอบ references มีอยู่จริงก่อนอ้างอิง
- ทำตาม instructions ใน skills
- ตรวจสอบว่าผลลัพธ์ถูกต้อง

## Expected Outcome

- อ่านและใช้ skills ได้อย่างถูกต้อง
- ใช้ skills ที่เหมาะสมกับ task
- References ถูกต้องทั้งหมด
- ผลลัพธ์ถูกต้องตามที่คาดหวัง
