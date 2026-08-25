---
name: read-all-files
description: อ่านไฟล์ทั้งหมดในโปรเจกต์เพื่อวิเคราะห์
---

## Goal

อ่านและวิเคราะห์ไฟล์ทั้งหมดในโปรเจกต์อย่างครบถ้วน

## Scope

ใช้ `read-all-files` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Prepare

> Goal: Prepare

1. ใช้ `/update-reference` เพื่อเก็บ reference
2. ระบุประเภทไฟล์ที่ต้องการอ่าน
3. กำหนดลำดับความสำคัญของไฟล์

### 2. Read Files

> Goal: Read Files

1. อ่านไฟล์ที่สำคัญก่อน (config, index, main)
2. อ่านไฟล์ตามลำดับ dependency
3. ใช้ parallel reading สำหรับไฟล์ที่ไม่มีความสัมพันธ์
4. อ่านไฟล์ใน directory structure ตามลำดับ

### 3. Analyze

> Goal: Analyze

1. วิเคราะห์โครงสร้างโปรเจกต์
2. ระบุความสัมพันธ์ระหว่างไฟล์
3. สรุป pattern และ architecture
4. ตรวจสอบความสมบูรณ์ของการอ่าน

## Rules

1. Reading Order

- อ่าน config ก่อนเสมอ
- อ่าน entry points ก่อน dependencies
- อ่านตาม import chain
- ใช้ parallel reading สำหรับไฟล์อิสระ

2. File Selection

- อ่านไฟล์ที่เกี่ยวข้องกับ task เป็นหลัก
- อ่าน test files หลังจาก source files
- อ่าน documentation เมื่อจำเป็น
- ข้ามไฟล์ที่ไม่เกี่ยวข้อง

3. Analysis

- ติดตาม import chain
- ระบุ shared patterns
- หาความสัมพันธ์ระหว่าง modules
- สรุป architecture ที่ใช้

## Expected Outcome

- อ่านไฟล์ทั้งหมดที่เกี่ยวข้อง
- เข้าใจโครงสร้างโปรเจกต์
- ระบุความสัมพันธ์ระหว่างไฟล์
- พร้อมสำหรับการวิเคราะห์ต่อ