---
name: list-github-branch
description: แสดง branches ทั้งหมดของ repo ที่ระบุบน GitHub
---

## Goal

แสดงรายการ branches ทั้งหมดของ repository ที่ระบุ

## Scope

ใช้สำหรับดู branches ของ repository ใดๆ บน GitHub

## Execute

### 1. Get Authenticated User
> Goal: Get Authenticated User

1. ทำ `mcp7_get_me` เพื่อรับ GitHub username
2. รับชื่อ repository ที่ต้องการดู branches จากผู้ใช้

### 2. List Branches
> Goal: List Branches

1. ทำ `mcp7_list_branches` ด้วย `owner` และ `repo` parameters
2. ใช้ `perPage: 100` สำหรับ pagination
3. ใช้ `page` parameter ถ้ามีมากกว่า 100 branches

### 3. Format Output
> Goal: Format Output

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. กำหนด columns:
   - No. ลำดับ
   - Branch ชื่อ branch
   - Last Commit SHA SHA ของ commit ล่าสุด
   - Protected มี branch protection หรือไม่

## Rules

### 1. API Usage

- ใช้ `mcp7_list_branches` สำหรับ list branches ของ repo ที่ระบุ
- ใช้ `mcp7_get_me` สำหรับรับ authenticated user
- ใช้ `perPage: 100` สำหรับ pagination

### 2. Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- แสดงข้อมูลสำคัญ: branch name, last commit SHA, protected status

## Expected Outcome

- รายการ branches ทั้งหมดของ repository
- จัดรูปแบบเป็นตารางที่อ่านง่าย
- ข้อมูลครบถ้วน: branch name, last commit SHA, protected status
