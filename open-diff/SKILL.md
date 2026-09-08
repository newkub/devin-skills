---
name: open-diff
description: เปิดดู diff จาก PR, git, branch, หรือไฟล์สองไฟล์ ใน Solid+TanStack app บน browser ผ่าน Bun server
argument-hint: "[pr <n>] | [git <ref>] | [branch <base>..<head>] | [file <old> <new>] [--repo owner/repo]"
related:
  - follow-create-web-solid-tanstack-router
  - follow-lib-unocss
  - use-gh-cli
  - open-web
  - report-git-diff
  - review-diff
---

## Goal

เปิด diff จากหลายแหล่ง (GitHub PR, git ref, branch, หรือไฟล์สองไฟล์) ใน browser ด้วย SolidJS + TanStack Router บน Bun server โดยมี UX แบบ dim-focused และ close tab แล้ว server ปิดตัวเอง

## Scope

ใช้สำหรับ review diff แบบสวยงาม อ่านง่าย เน้นโค้ดที่เปลี่ยนแปลง โดยไม่ต้องพึ่ง GitHub web UI

รองรับ:
- GitHub PR: `open-diff pr <number> [--repo owner/repo]`
- Git ref vs HEAD: `open-diff git <ref> [--repo path]`
- Branch base..head: `open-diff branch <base>..<head> [--repo path]`
- ไฟล์สองไฟล์: `open-diff file <old> <new>`
- แสดง diff ด้วย `@pierre/diffs` (diffs.com)
- Syntax highlighting ด้วย Shiki
- Dark / light mode
- Sidebar file list พร้อมสถิติ add/delete
- Auto-load เมื่อสั่งจาก CLI
- Auto-shutdown เมื่อปิด tab

ไม่รองรับ:
- PR diff ที่ใหญ่เกิน GitHub API limit
- binary files

## Execute

### 1. Resolve Source

> Goal: ระบุ diff source

1. อ่าน argument แรกเป็น subcommand (`pr`, `git`, `branch`, `file`)
2. อ่าน argument `--repo` สำหรับ `pr`/`git`/`branch`
3. ถ้าไม่ระบุ `--repo` สำหรับ `pr` → ใช้ repo ปัจจุบุบันจาก `gh repo view --json nameWithOwner`
4. ถ้าไม่ระบุ subcommand → เปิด app แบบไม่มี default source

### 2. Prepare App Workspace

> Goal: ติดตั้งและ build แอป `open-diff` ถ้ายังไม่มี

1. สร้าง workspace ชั่วคราว เช่น `.devin/open-diff-app`
2. Copy `references/open-diff-app/` จาก skill directory ไปยัง workspace (หรือ clone submodule)
3. รัน `bun install` ใน workspace
4. รัน `bun run build:client && bun run build:server` เพื่อ embed frontend assets

### 3. Run And Open

> Goal: เปิด diff ใน browser

1. รัน `bun src/server.ts <subcommand> [args] [--repo ...]`
2. รอ console แสดง URL
3. ใช้ `/open-web` หรือ OS command เปิด URL นั้น (Windows: `start`, macOS: `open`, Linux: `xdg-open`)
4. ถ้า server เปิด browser เองแล้ว → ยืนยันว่า tab เปิด

### 4. Verify

> Goal: ยืนยันว่า app ทำงาน

1. ตรวจสอบ header แสดง source ถูกต้อง
2. ตรวจ sidebar มี file list
3. ตรวจ main area แสดง diff พร้อม line numbers และ +/- markers
4. ลอง click เปลี่ยนไฟล์
5. ลองกด Dark/Light
6. ปิด tab แล้วตรวจสอบว่า server process หยุด (รอ 2-5 วินาที)
7. ถ้ามี error → ทำ `/resolve-errors`

## Rules

### 1. Source Parsing

- `pr <number>` สำหรับ GitHub PR
- `git <ref>` สำหรับ `git diff <ref>..HEAD`
- `branch <base>..<head>` สำหรับ `git diff <base>..<head>`
- `file <old> <new>` สำหรับ `git diff --no-index <old> <new>`
- `--repo` รับ `owner/repo` สำหรับ `gh` หรือ path สำหรับ `git`

### 2. Workspace Safety

- ติดตั้ง dependencies เฉพาะใน workspace ชั่วคราว
- ไม่แก้ไข `package.json` ของ repo หลัก
- ลบ workspace ชั่วคราวหลังใช้เสร็จถ้า user ไม่ขอเก็บ

### 3. Build Requirement

- ต้องมี Bun ติดตั้ง
- ต้องมี `gh` CLI สำหรับ PR
- ต้องมี `git` สำหรับ git/branch/file diff
- ติดตั้ง dependencies ด้วย `bun install`
- build ด้วย `bun run build:client && bun run build:server`

### 4. UX Requirements

- ใช้ UnoCSS `presetWind4` จาก `@unocss/preset-wind4`
- ใช้ shortcuts (`btn`, `input`, `panel`, `dim`, `file-item`)
- ใช้ CSS variables สำหรับ dark/light theme
- ใช้ Shiki สำหรับ syntax highlighting
- แยก add/del/context ด้วยสี/background ชัดเจน
- แสดง +/- markers
- แสดง stats +additions/-deletions/files บน header
- แสดง PR metadata (title, author avatar, state) เมื่อโหลด PR

### 5. Auto-Shutdown

- Frontend ส่ง heartbeat ไป `/api/ping` ทุก 2 วินาที
- Frontend ส่ง `/api/close` ผ่าน `navigator.sendBeacon` เมื่อ `beforeunload`
- Server ปิดตัวเองเมื่อไม่มี ping เกิน 5 วินาที (หลัง first ping) หรือได้รับ `/api/close`
- ถ้า user ปิด tab แล้ว process ยังไม่ตาย → ตรวจสอบว่ามี tab อื่นเปิดอยู่

### 6. Use Existing Skills

- `/use-gh-cli` สำหรับ PR
- `/follow-lib-unocss` สำหรับ styling
- `/follow-create-web-solid-tanstack-router` สำหรับ stack
- `/open-web` สำหรับเปิด browser

## Expected Outcome

- Server `open-diff` รันและเปิด tab ใน browser
- แสดง diff source, file list, และ diff view
- มี line numbers, +/- markers, syntax highlight
- สลับ dark/light ได้
- สลับไฟล์ได้
- ปิด tab แล้ว server ปิดตัวเอง
- ไม่มีไฟล์หรือ dependency ใหม่ใน repo หลัก


