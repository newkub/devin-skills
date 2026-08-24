---
name: search-github-star
description: ค้นหา repositories จาก GitHub stars ด้วย gh CLI
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
---

## Goal

ค้นหา repositories จาก GitHub stars ด้วย `gh` CLI

## Scope

ใช้สำหรับค้นหา repositories จาก GitHub stars ผ่าน `gh search` command

## Execute

### 1. Search Repositories By Stars
> Goal: Search Repositories By Stars

ค้นหา repositories ด้วย `gh search` command

1. ใช้ `gh search repos <query>` command
2. ใช้ `stars:>N` syntax สำหรับ filter ตาม stars
3. ใช้ flags: `--sort stars`, `--order desc`
4. ใช้ `--limit N` สำหรับ pagination
5. ใช้ qualifiers: `language:`, `topic:`, `user:`, `org:`

### 2. Filter Results
> Goal: Filter Results

กรองผลลัพธ์ตามเงื่อนไข

1. กรองตาม language ด้วย `language:<lang>`
2. กรองตาม topics ด้วย `topic:<topic>`
3. กรองตาม stars count ด้วย `stars:>N`
4. กรองตาม updated date ด้วย `pushed:>YYYY-MM-DD`
5. กรองตาม license ด้วย `license:<license>`

### 3. Parse Output
> Goal: Parse Output

แปลง output จาก `gh` CLI

1. ใช้ `--json` flag สำหรับ JSON output
2. ดึง fields: `name`, `fullName`, `description`, `url`
3. ดึง stats: `stargazersCount`, `forksCount`, `openIssuesCount`
4. ดึง timestamps: `createdAt`, `updatedAt`, `pushedAt`
5. ดึง owner: `owner.login`, `owner.avatarUrl`

## Rules

### 1. Gh CLI Authentication

จัดการ authentication อย่างปลอดภัย

- ใช้ `gh auth login` สำหรับ authentication
- `gh` CLI จัดการ token อัตโนมัติ
- ไม่ต้องจัดการ token ใน code
- ตรวจสอบ authentication ด้วย `gh auth status`

### 2. Search Query Construction

สร้าง search query อย่างถูกต้อง

- ใช้ specific qualifiers ลดขนาด result set
- ใช้ `stars:>N` qualifiers แทน broad searches
- ใช้ `--limit` สำหรับ pagination
- ใช้ `--sort` และ `--order` parameters อย่างเหมาะสม
- ใช้ `--json` flag สำหรับ programmatic output

### 3. Output Formatting

จัดการ output จาก `gh` CLI

- ใช้ `--json` flag สำหรับ structured output
- ระบุ fields ที่ต้องการด้วย `--json field1,field2`
- ใช้ `--jq` สำหรับ additional filtering
- ใช้ `--template` สำหรับ custom formatting
- ใช้ `--limit` สำหรับ large result sets

### 4. Error Handling

จัดการ errors จาก `gh` CLI

- ตรวจสอบ `gh` CLI ติดตั้งแล้ว
- จัดการ authentication errors ด้วย `gh auth login`
- จัดการ rate limit errors (GitHub API limits)
- จัดการ network errors ด้วย retries
- ตรวจสอบ exit codes จาก `gh` command

### 5. Performance Optimization

เพิ่มประสิทธิภาพการค้นหา

- ใช้ specific qualifiers ลดขนาด result set
- ใช้ `--limit` จำกัดจำนวน results
- ใช้ `--json` แทน text output สำหรับ parsing
- Cache frequent search queries ถ้าจำเป็น
- ใช้ `gh search` โดยตรงแทน API calls

## Expected Outcome

- `gh` CLI command ที่ทำงานได้จริง
- Search functionality ที่มีประสิทธิภาพ
- JSON output ที่ง่ายต่อ parsing
- Error handling ที่ครอบคลุม
