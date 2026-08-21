---
name: list-github-release
description: แสดง releases ทั้งหมดของ repo ที่ระบุบน GitHub
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

แสดงรายการ releases ทั้งหมดของ repository ที่ระบุพร้อมข้อมูลสำคัญ

## Scope

ใช้สำหรับดู releases ของ repository ใดๆ บน GitHub

## Execute

### 1. Get Authenticated User

1. ทำ `mcp7_get_me` เพื่อรับ GitHub username
2. รับชื่อ repository ที่ต้องการดู releases จากผู้ใช้

### 2. List Releases

1. ทำ `mcp7_list_releases` ด้วย `owner` และ `repo` parameters
2. ใช้ `perPage: 100` สำหรับ pagination
3. ใช้ `page` parameter ถ้ามีมากกว่า 100 releases

### 3. Format Output

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. กำหนด columns:
   - No. ลำดับ
   - Tag tag name
   - Title ชื่อ release
   - Draft เป็น draft หรือไม่
   - Prerelease เป็น prerelease หรือไม่
   - Published วันที่ publish
   - Author ผู้สร้าง

## Rules

### 1. API Usage

- ใช้ `mcp7_list_releases` สำหรับ list releases ของ repo ที่ระบุ
- ใช้ `mcp7_get_me` สำหรับรับ authenticated user
- ใช้ `perPage: 100` สำหรับ pagination

### 2. Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- เรียงตามวันที่ publish ล่าสุด
- แสดงข้อมูลสำคัญ: tag, title, draft, prerelease, published, author

## Expected Outcome

- รายการ releases ทั้งหมดของ repository
- จัดรูปแบบเป็นตารางที่อ่านง่าย
- ข้อมูลครบถ้วน: tag, title, draft, prerelease, published, author
