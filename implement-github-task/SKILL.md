---
name: implement-github-task
description: นำ task จาก GitHub issue หรือ project item ไป implement
argument-hint: "[task-id]"
---

## Goal

อ่าน GitHub issue หรือ project task แล้ว implement งานนั้น

## Scope

ใช้เพื่อแปลง issue/task เป็นการเปลี่ยนแปลง code หรือ documentation

## Execute

### 1. Read task

> Goal: อ่าน task

1. รัน gh issue view หรือ gh project item-list
1. ดึง title, body, acceptance criteria

### 2. Plan

> Goal: วางแผน

1. เรียก /create-plan ถ้าซับซ้อน
1. ระบุ files และ skills ที่จำเป็น

### 3. Implement

> Goal: implement

1. ทำการเปลี่ยนแปลงตาม task
1. เรียก /realize-implementation หรือ /refactor

### 4. Verify

> Goal: ตรวจสอบ

1. รัน /run-verify และ /run-test
1. อัปเดต project status หรือปิด issue

### 5. Report

> Goal: รายงาน

1. สรุปการเปลี่ยนแปลงและลิงก์ไปยัง issue/PR

## Rules

- ถาม user ก่อนทำการเปลี่ยนแปลงที่ทำลายล้าง
- ปิด issue เฉพาะหลังตรวจสอบแล้ว
- อัปเดต project status เมื่อเสร็จ

## Expected Outcome

- Task ถูก implement แล้ว
- Issue ถูกปิดหรือ project status ถูกอัปเดต
- การตรวจสอบผ่าน