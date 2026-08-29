---
name: found-issue
description: Map ปัญหา/อาการทั่วไปไปยัง skill หรือ workflow ทีถูกต้อง
related:
  - suggest-next-action
  - resolve-errors
  - search-skills
  - follow-skills
  - follow-skills-map
  - ask-me
---

## Goal

ช่วยหา skill หรือ workflow ทีถูกต้องเมื่อพบปัญหา/อาการ/ข้อผิดพลาด โดยไม่ต้องเดาสุ่ม

## Scope

ใช้เมื่อ user หรือ context ระบุอาการ (symptom) แต่ยังไม่รู้ว่าควรเรียก skill ใด
ไม่รวมการแก้ไขโค้ด/ไฟล์โดยตรง ให้ส่งต่อไปยัง skill เป้าหมาย

## Execute

### 1. Identify Symptom

> Goal: เข้าใจ issue ทีพบ

1. ถ้า user ระบุ `/found-issue <symptom>` → ค้นหา match ใน `references/issue-map.md`
2. ถ้าไม่ระบุ symptom → สรุปจาก context หรือถาม user สั้นๆ
3. ถ้าหา match ไม่เจอ → ไปขั้น Fallback

### 2. Route to Skill

> Goal: ส่งต่อไปยัง skill ทีเหมาะสม

1. อ่าน `references/issue-map.md` และหา row ทีใกล้เคียงกับ symptom ทีสุด
2. ถ้ามีหลาย match → ถาม user เลือก หรือเรียงตาม impact (ความเสี่ยง > ความถี่)
3. เรียก skill ทีได้จากตาราง โดยทำตาม `## Execute` ของ skill นั้น
4. ถ้า skill เป้าหมาย fail → ทำ `/resolve-errors`

### 3. Report

> Goal: สรุปผลการ map

1. ใช้ `/report-table` สรุป: symptom, matched skill, reason, next action
2. ทำ `/suggest-next-action`

## Rules

### 1. Match First

- อ่าน `references/issue-map.md` ก่อนเสมอ
- ถ้าหลาย row match ให้เรียงตาม impact ก่อน

### 2. Fallback

- ถ้าไม่ match → ทำ `/search-skills` หรือ `/ask-me`
- ไม่เดาสุ่ม skill

### 3. No Direct Fix

- `found-issue` ไม่แก้ไข code หรือ config เอง
- ส่งต่อไปยัง skill เป้าหมายและทำตาม `## Execute` ของ skill นั้น

## Expected Outcome

- ระบุ skill หรือ workflow ที่เหมาะสมกับปัญหาที่พบ
- รายงาน symptom → skill → next action ครบถ้วน
- ถ้าไม่มี match ให้มี fallback ชัดเจน
