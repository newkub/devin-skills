---
name: list-github-pr
description: แสดง pull requests ของ repo ที่ระบุพร้อม state และ metadata
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - report-table
---

## Goal

แสดงรายการ pull requests ของ repository ที่ระบุพร้อมข้อมูลสำคัญ

## Scope

ใช้สำหรับดู pull requests ของ repository ใดๆ บน GitHub กรองตาม state ได้

## Execute

### 1. Get Authenticated User
> Goal: Get Authenticated User

1. ทำ `mcp7_get_me` เพื่อรับ GitHub username
2. รับชื่อ repository ที่ต้องการดู PRs จากผู้ใช้

### 2. List Pull Requests
> Goal: List Pull Requests

1. ทำ `mcp7_list_pull_requests` ด้วย `owner` และ `repo` parameters
2. ใช้ `state` parameter สำหรับกรอง: `open`, `closed`, `all`
3. ใช้ `sort: updated` และ `direction: desc` เพื่อเรียงจากใหม่สุด
4. ใช้ `perPage: 100` สำหรับ pagination

### 3. Format Output
> Goal: Format Output

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. กำหนด columns:
   - No. เลข PR
   - Title ชื่อ PR
   - State open/closed/merged
   - Author ผู้สร้าง
   - Branch head branch → base branch
   - Reviews จำนวน reviews
   - Updated วันที่อัปเดตล่าสุด

## Rules

### 1. API Usage

- ใช้ `mcp7_list_pull_requests` สำหรับ list PRs ของ repo ที่ระบุ
- ใช้ `mcp7_get_me` สำหรับรับ authenticated user
- ใช้ `state` parameter สำหรับกรอง open/closed/all
- ใช้ `sort` และ `direction` สำหรับ sorting

### 2. Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- เรียงตามวันที่อัปเดตล่าสุด
- แสดงข้อมูลสำคัญ: number, title, state, author, branch, reviews, updated

## Expected Outcome

- รายการ pull requests ของ repository ที่ระบุ
- จัดรูปแบบเป็นตารางที่อ่านง่าย
- ข้อมูลครบถ้วน: number, title, state, author, branch, reviews, updated
