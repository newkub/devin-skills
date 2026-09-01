---
name: list-cloudflare-projects
description: รายการ Cloudflare projects ทั้งหมดในเครื่อง พร้อม local path, remote match และ status
argument-hint: "[path]"
related:
  - list-project-git-in-computer
  - list-chezmoi-files
  - resolve-all-cloudflare-worker-fails
  - open-cloudflare-workers
  - open-all-cloudflare-projects
---

## Goal

สแกนเครื่องหา projects ทีใช้ Cloudflare (Workers, Pages, Wrangler) พร้อม local path, remote repo match, deployment status และสรุปเป็น table

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `list-chezmoi-files`, `open-cloudflare-workers`, `open-all-cloudflare-projects`

ใช้เพื่อหา Cloudflare projects ทั้งหมดในเครื่อง โดย detect จาก `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`, หรือ `wrangler.config.ts`

## Execute

### 1. Scan Local Drives

> Goal: หาไฟล์ config ของ Wrangler

1. ใช้ `/list-project-git-in-computer` เพื่อหา git projects ทั้งหมด
2. ในแต่ละ project ตรวจหา:
   - `wrangler.toml`
   - `wrangler.jsonc`
   - `wrangler.json`
   - `wrangler.config.ts`
3. ถ้า scan ช้า → รันเฉพาะ `D:\`, `E:\`, หรือ path ที user ระบุ
4. บันทึก: project name, local path, config file name

### 2. Match Remote Repos

> Goal: เชื่อมโยง local project กับ remote repo

1. รัน `git remote -v` ในแต่ละ project
2. ดึง `owner/name` จาก remote URL
3. บันทึก `RemoteUrl`, `Owner`, `RepoName`
4. ถ้าไม่มี remote → ระบุ `local-only`

### 3. Read Wrangler Config

> Goal: หา worker/service name และ status

1. อ่าน config file ทีพบ
2. ดึง `name` ของ worker/service
3. ตรวจสอบ `compatibility_date`, `main`, `routes`
4. ถ้าเป็น Pages project → ระบุ `pages_build_output_dir`

### 4. Check Deployment Status

> Goal: ดูสถานะของ worker ถ้าได้

1. รัน `wrangler deployments list --name <worker>` ถ้า authenticated
2. บันทึก latest deployment: status, created at
3. ถ้าไม่ authenticated → ข้ามและระบุ `auth-required`

### 5. Build Report

> Goal: สรุปผลเป็น table

1. สร้าง table คอลัมน์: Project, LocalPath, RemoteRepo, WorkerName, ConfigFile, Status, Notes
2. เรียงตามชื่อ project
3. รายงาน summary จำนวน projects

## Rules

- ใช้ absolute path
- ไม่ลบหรือแก้ไขไฟล์ใดๆ
- ถ้า `wrangler` ไม่ authenticated → ข้าม status check
- ระบุ `local-only` ถ้าไม่มี remote
- รองรับ Workers, Pages และ Wrangler config ทุก format

- ใช้ /resolve-all-cloudflare-worker-fails ถ้าจำเป็น

## Expected Outcome

- รายการ Cloudflare projects ทั้งหมดในเครื่อง
- Table ครบถ้วน: local path, remote match, worker name, status
- ไม่มี project ทีเกิดการเปลี่ยนแปลงใดๆ
