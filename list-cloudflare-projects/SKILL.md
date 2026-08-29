---
name: list-cloudflare-projects
description: แสดงรายการ Cloudflare projects ทั้งหมดในเครื่องและใน account พร้อม status
argument-hint: "[path]"
related:
  - list-cloudflare-project
  - list-cloudflare-worker-fail
  - list-project-git-in-computer
  - report-table
  - open-cloudflare-workers
---

## Goal

แสดงรายการ Cloudflare projects ทั้งหมดทีพบในเครื่องและใน Cloudflare account พร้อม local path, remote repo, worker/service name, deployment status

## Scope

ใช้สำหรับหา projects ทีใช้ Cloudflare (Workers, Pages, Wrangler) ทั้ง local และ remote โดย detect จาก `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`, หรือ `wrangler.config.ts`

## Execute

### 1. Scan Local Drives

> Goal: หาไฟล์ config ของ Wrangler

1. ใช้ `/list-project-git-in-computer` เพื่อหา git projects ทั้งหมด
2. ในแต่ละ project ตรวจหา:
   - `wrangler.toml`
   - `wrangler.jsonc`
   - `wrangler.json`
   - `wrangler.config.ts`
3. ถ้า user ระบุ `path` ให้ scan เฉพาะ path นั้น
4. ถ้า scan ช้า → รันเฉพาะ `D:\`, `E:\`, หรือ path ทีระบุ
5. บันทึก: project name, local path, config file name

### 2. Match Remote Repos

> Goal: เชื่อมโยง local project กับ remote repo

1. รัน `git remote -v` ในแต่ละ project
2. ดึง `owner/name` จาก remote URL
3. บันทึก `RemoteUrl`, `Owner`, `RepoName`
4. ถ้าไม่มี remote → ระบุ `local-only`

### 3. Read Wrangler Config

> Goal: หา worker/service name และ config

1. อ่าน config file ทีพบ
2. ดึง `name` ของ worker/service
3. ตรวจสอบ `compatibility_date`, `main`, `routes`
4. ถ้าเป็น Pages project → ระบุ `pages_build_output_dir`

### 4. Check Remote Cloudflare Projects

> Goal: หา projects ทีอยู่บน Cloudflare แต่อาจไม่มี local

1. ถ้า `wrangler` authenticated → รัน `wrangler deployments list` สำหรับแต่ละ worker
2. บันทึก latest deployment: status, created at
3. ถ้าไม่ authenticated → ข้ามและระบุ `auth-required`

### 5. Build Report

> Goal: สรุปผลเป็นตาราง

1. สร้าง table คอลัมน์: No., Project, LocalPath, RemoteRepo, WorkerName, ConfigFile, Status, Notes
2. เรียงตามชื่อ project
3. รายงาน summary จำนวน projects

## Rules

- ใช้ absolute path
- ไม่ลบหรือแก้ไขไฟล์ใดๆ
- ถ้า `wrangler` ไม่ authenticated → ข้าม remote status check
- ระบุ `local-only` ถ้าไม่มี remote
- รองรับ Workers, Pages และ Wrangler config ทุก format

## Expected Outcome

- รายการ Cloudflare projects ทั้ง local และ remote
- Table ครบถ้วน: local path, remote match, worker name, status
- ไม่มี project ทีเกิดการเปลี่ยนแปลงใดๆ
