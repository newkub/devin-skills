---
name: list-github-repo
description: แสดงรายการ repositories ทั้งหมดที่ผู้ใช้สร้างบน GitHub
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

แสดงรายการ repositories ทั้งหมดที่ผู้ใช้สร้างบน GitHub พร้อมข้อมูลสำคัญ

## Scope

ใช้สำหรับดู repositories ทั้งหมดของ authenticated user บน GitHub

## Execute

### 1. Get Authenticated User

1. ทำ `mcp7_get_me` เพื่อรับ GitHub username ของผู้ใช้
2. บันทึก username สำหรับใช้ใน step ถัดไป

### 2. List Repositories

1. ทำ `mcp7_search_repositories` ด้วย `user:{username} sort:updated`
2. ใช้ `perPage: 100` สำหรับดูได้มากครั้งละ
3. ถ้ามีมากกว่า 100 ให้ใช้ `page` parameter เพื่อ pagination

### 3. Format Output

1. ทำ `/report-format-table` เพื่อจัดรูปแบบเป็นตาราง
2. กำหนด columns:
   - No. ลำดับ
   - Name ชื่อ repository
   - Description คำอธิบาย
   - Language ภาษาหลัก
   - Stars จำนวน stars
   - Forks จำนวน forks
   - Updated วันที่อัปเดตล่าสุด
   - Visibility public/private

## Rules

### 1. API Usage

- ใช้ `mcp7_get_me` สำหรับรับ authenticated user
- ใช้ `mcp7_search_repositories` ด้วย `user:{username}` qualifier
- ใช้ `sort:updated` เพื่อเรียงตามวันที่อัปเดตล่าสุด
- ใช้ `perPage: 100` สำหรับ pagination ที่มีประสิทธิภาพ

### 2. Output Format

- ทำ `/report-format-table` สำหรับจัดรูปแบบผลลัพธ์
- เรียงตามวันที่อัปเดตล่าสุด
- แสดงข้อมูลสำคัญ: name, description, language, stars, forks, updated

## Expected Outcome

- รายการ repositories ทั้งหมดของผู้ใช้
- จัดรูปแบบเป็นตารางที่อ่านง่าย
- ข้อมูลครบถ้วน: name, description, language, stars, forks, updated
