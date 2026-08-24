---
name: write-github-issue
description: เขียนหรืออัปเดต title, body และ metadata ของ GitHub issue
---

## Goal

แก้ไข title, body, labels, assignees และ metadata อื่นๆ ของ issue

## Scope

ใช้เมื่อ issue ที่มีอยู่ต้องอัปเดตเนื้อหาหรือ metadata

## Execute

### 1. Identify issue
> Goal: ระบุ issue

1. รัน `gh issue view <number>`
1. ยืนยัน issue number และ repo

### 2. Update content
> Goal: อัปเดตเนื้อหา

1. แก้ไข title และ body ด้วย `gh issue edit`
1. เพิ่มหรือลบ labels และ assignees
1. อัปเดต milestone หรือ project

### 3. Verify
> Goal: ตรวจสอบ

1. ดู issue อีกครั้งเพื่อยืนยันการเปลี่ยนแปลง
1. ตรวจสอบ PR หรือ sub-issues ที่เชื่อมโยง

### 4. Report
> Goal: รายงาน

1. สรุปการเปลี่ยนแปลง
1. ส่ง issue URL กลับ

## Rules

- ห้ามเขียนทับ body โดยไม่ได้รับการยืนยันจากผู้ใช้ หากมี comments
- ใช้ `--add-label` และ `--remove-label` เพื่อจัดการ labels
- แก้ไขให้กระชับและน้อยที่สุด

## Expected Outcome

- เนื้อหาและ metadata ของ issue ถูกอัปเดต
- การเปลี่ยนแปลงผ่านการตรวจสอบ
