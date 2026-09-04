## Repo-Scoped CI/CD Resolve

ขั้นตอนสำหรับ `resolve-cicd` เมื่อได้รับ repo หรือตรวจพบ repo ปัจจุบัน โดย resolve ทั้ง GitHub Actions และ Cloudflare Workers/Pages ทีตรงกับ repo นั้น

## Goal

ตรวจสอบและแก้ไข CI/CD failures สำหรับ project/repo ทีระบุ ครอบคลุม GitHub Actions และ Cloudflare

## Scope

ใช้กับ repo ปัจจุบันหรือ repo ที user ระบุ โดยหา worker/project ทีตรงกับ repo name แล้ว resolve

## Execute

### 1. Identify Repo

> Goal: ระบุ repo ปัจจุบัน
1. ถ้ามี argument `--repo` → ใช้ค่านั้น
2. ถ้าไม่มี → รัน `gh repo view --json nameWithOwner` หรือ `git remote -v` จาก current directory
3. ถ้าหาไม่พบ → ทำ `/ask-me`

### 2. Resolve GitHub Actions

> Goal: แก้ไข GitHub Actions สำหรับ repo
1. ทำ `/resolve-github-actions-fails --repo <owner/repo>`
2. ถ้าไม่มี local repo ต้องการ code fix → ใช้ `/search-project-in-drive-d <repo-name>`
3. บันทึกผล runs ที resolve ได้และค้าง

### 3. Resolve Cloudflare

> Goal: แก้ไข Cloudflare Workers/Pages ทีตรงกับ repo
1. หา worker name ทีตรงกับ repo name หรือ project name จาก `wrangler.toml`
2. ทำ `/resolve-cloudflare-worker-fails --worker <worker-name>` หรือ `/resolve-all-cloudflare-fails --project <project-name>`
3. ถ้าไม่พบ worker ทีตรงกับ repo → ข้ามและบันทึกว่าไม่มี Cloudflare resource
4. ถ้าพบ local project ทีตรงกัน → ใช้ `/search-project-in-drive-d <worker-name>` แล้ว `wrangler deploy`
5. ทำซ้ำสูงสุด 3 รอบ

### 4. Cross-Check

> Goal: ยืนยันว่า CI/CD ของ repo ผ่าน
1. รัน `gh run list --repo <owner/repo> --status failure --limit 10` อีกครั้ง
2. ถ้ายังมี failure → กลับไปขั้นตอน 2 หรือ 3
3. ถ้าผ่าน → ไป Report

### 5. Report

> Goal: สรุปผล
1. ใช้ `/report-table` คอลัมน์: No., Repo, CI Status, CD Status, Action Taken, Notes
2. สรุป: resolve ได้, ค้าง, manual-fix-required
3. ทำ `/suggest-next-action`

## Rules

### 1. Scope
- resolve เฉพาะ project/repo ทีตรงกับ repo ทีระบุ
- ไม่ขยับไป repo อื่นโดยอัตโนมัติ

### 2. Worker Matching
- worker name สามารถตรงกับ repo name หรือ slug ของ project
- ถ้าไม่ชัด → ใช้ Cloudflare API list workers/pages แล้ว filter ด้วย repo name

### 3. Local Project
- ใช้ `/search-project-in-drive-d` หา local project
- ถ้าไม่พบ → ทำเครื่องหมาย `manual-fix-required`

### 4. Safety
- ถาม user ก่อน deploy/redeploy worker ถ้ามีผลกระทบสูง
- ไม่ commit/push อัตโนมัติ

## Expected Outcome

- GitHub Actions ของ repo ไม่มี failures ค้าง
- Cloudflare Workers/Pages ทีตรงกับ repo ถูก resolve หรือทำเครื่องหมาย manual-fix-required
- ตารางสรุป repo-scoped CI/CD status
