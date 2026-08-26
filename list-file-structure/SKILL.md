---
name: list-file-structure
description: สแกนและแสดงรายการโครงสร้างไฟล์และโฟลเดอรใน project
---

## Goal

สแกน project และแสดงรายการโครงสร้างไฟล์และโฟลเดอรให้ชัดเจน

## Scope

ใช้สำหรับดู file tree ของ project หรือ workspace โดยไม่ต้องวิเคราะห์ลึก

## Execute

### 1. Scan Files

> Goal: รวบรวมรายการไฟล์และโฟลเดอร

1. ทำ `/scan-codebase` เพื่อสแกนไฟล์ทั้งหมด
2. กรอง `node_modules`, `.git`, `dist`, `build`, `.cache`
3. กำหนด root directory และ depth (default 3)

### 2. Format And Report

> Goal: แสดงผลลัพธ์ให้อ่านง่าย

1. ส่งผลไปยัง `/report-file-structure` เพื่อจัดรูปแบบ tree, metadata, statistics
2. ถ้าต้องการสรุปเฉพาะ ใช้ `/report-table` สำหรับ file counts ตามประเภท

## Rules

- ไม่แก้ไขไฟล์ แค่รายงานโครงสร้าง
- กรองไฟล์ build/cache ออกจากรายงาน
- ระบุ depth กรณี project ใหญ่

## Expected Outcome

- รายการไฟล์และโฟลเดอรทีอ่านง่าย
- สถิติพื้นฐาน (จำนวนไฟล์, ประเภท)
- ไฟล์ build/cache ถูกกรอง
