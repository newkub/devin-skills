---
name: list-github-issue
description: แสดงรายการ issues ของ repository ที่ระบุบน GitHub
argument-hint: "[repo]"
related:
  - open-github-issue
  - create-github-issue
  - review-github-issue
  - list-github-pr
  - report-table
---

## Goal

แสดงรายการ issues ของ repository ที่ระบุพร้อมข้อมูลสำคัญ

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `open-github-issue`, `create-github-issue`, `review-github-issue`, `list-github-pr`

ใช้สำหรับดู issues ของ repository ใดๆ บน GitHub ที่ authenticated user มีสิทธิ์เข้าถึง

## Execute

### 1. Get Authenticated User

> Goal: Get Authenticated User

1. ทำ `mcp7_get_me` เพื่อรับ GitHub username
2. รับชื่อ repository ที่ต้องการดู issues จากผู้ใช้

### 2. List Issues

> Goal: List Issues

1. ทำ `mcp7_list_issues` ด้วย `owner` และ `repo` parameters
2. ใช้ `state` parameter สำหรับกรอง:
   - `OPEN` — issues ที่เปิดอยู่
   - `CLOSED` — issues ที่ปิดแล้ว
   - ไม่ระบุ — ทั้งหมด
3. ใช้ `orderBy: UPDATED` และ `direction: DESC` เพื่อเรียงจากใหม่สุด
4. ใช้ `perPage: 100` สำหรับ pagination
5. ใช้ `labels` parameter ถ้าต้องการกรองตาม label

### 3. Format Output

> Goal: Format Output

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. กำหนด columns:
   - No. เลข issue
   - Title ชื่อ issue
   - Labels labels ทั้งหมด
   - State open/closed
   - Author ผู้สร้าง
   - Comments จำนวน comments
   - Updated วันที่อัปเดตล่าสุด

## Rules

### 1. API Usage

- ใช้ `mcp7_list_issues` สำหรับ list issues ของ repo ที่ระบุ
- ใช้ `mcp7_get_me` สำหรับรับ authenticated user
- ใช้ `state` parameter สำหรับกรอง open/closed
- ใช้ `labels` parameter สำหรับกรองตาม label
- ใช้ `orderBy` และ `direction` สำหรับ sorting

### 2. Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- เรียงตามวันที่อัปเดตล่าสุด
- แสดงข้อมูลสำคัญ: number, title, labels, state, author, comments, updated

## Expected Outcome

- รายการ issues ของ repository ที่ระบุ
- จัดรูปแบบเป็นตารางที่อ่านง่าย
- ข้อมูลครบถ้วน: number, title, labels, state, author, comments, updated