---
name: dont-over-engineer
description: หลีกเลี่ยงการ over-engineering ใช้ minimal changes
---

## Goal

แก้ปัญหาด้วย minimal changes ที่เป็นไปได้เสมอ

## Scope

ใช้สำหรับทุกการแก้ไข code และ implementation

## Execute

### 1. Analyze Problem

วิเคราะห์ปัญหาเพื่อหา root cause

1. ทำ `/debug-issue` เพื่อวิเคราะห์ปัญหา
2. หา solution ที่เรียบง่ายที่สุด
3. ไม่สร้าง abstraction ที่ไม่จำเป็น

### 2. Apply Minimal Fix

ใช้ minimal changes ที่เป็นไปได้

1. ใช้ `single-line change` เมื่อเป็นไปได้
2. ไม่ refactor ทั้งโค้ดเบสเพื่อแก้ปัญหาเล็กๆ
3. ไม่สร้าง generic solution สำหรับปัญหาเฉพาะ

### 3. Verify Solution

ตรวจสอบว่าแก้ปัญหาได้จริง

1. ทดสอบว่าแก้ปัญหาได้จริง
2. ตรวจสอบไม่มี side effects
3. ลบ code ที่ไม่จำเป็นที่เพิ่มขึ้น

## Rules

### 1. Minimal Changes

ใช้ minimal changes ที่เป็นไปได้เสมอ

- ใช้ `single-line change` เมื่อเป็นไปได้
- ไม่ refactor ทั้งโค้ดเบสเพื่อแก้ปัญหาเล็กๆ
- ไม่สร้าง abstraction ที่ไม่จำเป็น
- ไม่เพิ่ม complexity โดยไม่จำเป็น

### 2. Root Cause First

ต้องเข้าใจ root cause ก่อนแก้

- ทำ `/debug-issue` เพื่อวิเคราะห์ปัญหา
- ไม่แก้ symptom โดยไม่รู้สาเหตุ
- ไม่เดา solution โดยไม่วิเคราะห์
- ใช้ solution ที่เรียบง่ายที่สุด

### 3. Simple Solutions

ใช้ solution ที่เรียบง่ายและตรงประเด็น

- ไม่สร้าง generic solution สำหรับปัญหาเฉพาะ
- ไม่เพิ่ม dependency ที่ไม่จำเป็น
- ไม่สร้าง architecture ที่ซับซ้อนเกินไป
- ใช้ `YAGNI` principle (You Aren't Gonna Need It)

### 4. Verify Impact

ตรวจสอบผลกระทบของการเปลี่ยนแปลง

- ทดสอบว่าแก้ปัญหาได้จริง
- ตรวจสอบไม่มี side effects
- ลบ code ที่ไม่จำเป็นที่เพิ่มขึ้น
- วัดผลกระทบ (performance, complexity)

## Expected Outcome

- แก้ปัญหาด้วย minimal changes
- ไม่มี over-engineering
- Code ยังเรียบง่ายและเข้าใจง่าย
- ไม่มี abstraction ที่ไม่จำเป็น
- Solution ตรงประเด็นและเข้าใจง่าย
