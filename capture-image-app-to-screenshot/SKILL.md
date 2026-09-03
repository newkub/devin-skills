---
name: capture-image-app-to-screenshot
description: Capture ภาพหน้าจอทั้งหมดของ app ที route/component บันทึกลง public/screenshots/
argument-hint: "[workspace-or-target]"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - skill
  - ask_user_question
  - todo_write
  - browser_preview
  - report
  - report-table
  - suggest-next-action
triggers:
  - user
  - model
related:
  - capture-web
  - capture-terminal
  - capture-component
  - watch-browser-and-improve-uxui
  - from-recent-windows-capture
  - scan-codebase
  - follow-tool-agent-browser
  - follow-tool-playwright
  - run-build
  - run-verify
  - suggest-next-action
---

## Goal

Capture ภาพหน้าจอของ app ครอบคลุม routes และ components สำคัญ แล้วบันทึกลง `public/screenshots/` เพื่อใช้สำหรับ review, improve UX/UI หรือ documentation

## Scope

ใช้กับ web apps (React, Vue, Svelte, Solid, Next, Nuxt, Astro) และ TUI/CLI apps
- สำหรับ web app: capture ทุก route ทีหาได้จาก file structure
- สำหรับ TUI/CLI: capture หน้าจอ terminal output ของ commands สำคัญ
- บันทึกภาพลง `public/screenshots/` ของ workspace นั้น

- ดูเพิ่มเติม: /from-recent-windows-capture, /scan-codebase, /run-build, /run-verify

## Execute

### 1. Detect App Type

> Goal: ตรวจจับ App Type
1. ตรวจ `package.json` scripts, dependencies, และ file structure
2. ระบุ type: web (browser routes) หรือ terminal/CLI (TUI)
3. หา entry points และ routes จาก `src/app`, `src/pages`, `src/routes`, `apps/*/pages`, `examples`
4. ถ้าไม่ชัด → ถาม user

### 2. Setup Output

> Goal: ตั้งค่า Output
1. ตรวจ `public/screenshots/` ถ้าไม่มีให้สร้าง
2. ลบ screenshots เก่าถ้า user ต้องการ refresh
3. กำหนด naming convention: `<route-or-component-name>.png`

### 3. Generate Capture Script

> Goal: สร้าง Capture Script
1. สร้าง `tools/capture-screenshots.{js|ts|mjs}` ใน workspace ถ้าไม่มี
2. Script ต้องรองรับ:
   - เปิด dev server (ถ้าจำเป็น)
   - วนลูป routes และ capture แต่ละ route
   - ใช้ `agent-browser` หรือ `playwright` ตามทีมี
3. ถ้า project ไม่มี capture tool → ใช้ `/follow-tool-agent-browser` หรือ `/follow-tool-playwright` ติดตั้ง

### 4. Capture Web Routes

> Goal: capture Web Routes
1. เริ่ม dev server ถ้าจำเป็น (`npm run dev` หรือ `bun dev`)
2. สำหรับแต่ละ route:
   - สร้าง URL จาก base URL + route path
   - ทำ `/capture-web <url>` ด้วย `--full`
   - บันทึกไฟล์ลง `public/screenshots/routes/<route-name>.png`
3. ถ้ามี components ทีต้อง capture โดยเฉพาะ (เช่น storybook, isolated pages):
   - ระบุ URL ของแต่ละ component
   - ทำ `/capture-web` ทีละ URL
   - ทำ `/capture-component <component-name-or-url>` สำหรับ capture แยก
   - บันทึกลง `public/screenshots/components/<component-name>.png`

### 5. Capture Terminal Views

> Goal: capture Terminal Views
1. สำหรับ TUI/CLI apps ระบุ commands หรือ views สำคัญ
2. ทำ `/capture-terminal` สำหรับแต่ละ command
3. บันทึกลง `public/screenshots/terminal/<command-name>.png`

### 6. Verify And Report

> Goal: ตรวจสอบ And Report
1. ตรวจ `public/screenshots/` ว่ามีไฟล์ถูกสร้าง
2. ทำ `/report-table` แสดง: No, Type, Name, File, Size
3. ถ้าบาง route fail → ทำ `/resolve-errors` แล้ว retry
4. ทำ `/suggest-next-action`

## Rules

### 1. Output Location

- บันทึกภาพลง `public/screenshots/` ของ workspace นั้น
- แยก subdirectories: `routes/`, `components/`, `terminal/`
- ไม่ commit ภาพถ้า user ไม่ต้องการ

### 2. Tool Selection

- Web: ใช้ `/capture-web` (agent-browser) เป้นหลัก ถ้าไม่พร้อม ใช้ Playwright ตาม `/follow-tool-playwright`
- Terminal: ใช้ `/capture-terminal` (termshot, terminal-shot, termframe)
- ถ้า project มี `playwright.config.*` อยู่แล้ว ให้ใช้ Playwright

### 3. Routes Discovery

- อ่าน file structure จาก `src/app`, `src/pages`, `src/routes`
- ไม่เดา URL ถ้าไม่มี routing file
- ถ้าเป็น dynamic route ให้ใช้ route pattern ทีง่ายทีสุด

### 4. Script Generation

- สร้าง `tools/capture-screenshots.{js|ts|mjs}` ที่ reproducible
- ใช้ relative paths
- รองรับ rerun ด้วย command เดิม
- ไม่ hardcode environment-specific values

### 5. Safety

- ไม่ capture หน้าจอทีมีข้อมูล sensitive
- ถ้า route ต้อง authentication ให้ถาม user ก่อน
- ไม่ deploy หรือ push screenshots โดยอัตโนมัติ

## Expected Outcome

- `public/screenshots/` มีภาพของทุก routes/components/views สำคัญ
- มี `tools/capture-screenshots` script สำหรับ rerun
- รายงาน captured files พร้อม paths
- พร้อมใช้กับ `/watch-browser-and-improve-uxui` หรือ `/review-uxui`
