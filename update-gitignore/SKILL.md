---
name: update-gitignore
description: อัปเดต .gitignore ให้ครบถ้วนตาม stack และ artifacts ทีใช้
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related: []
---
## Goal

อัปเดต `.gitignore` ใน root และ workspaces ให้ครอบคลุม dependencies, build outputs, IDE, secrets, และ environment artifacts

## Scope

ใช้สำหรับ project ใดๆ ที่ต้องปรับปรุง `.gitignore`

## Execute

### 1. Inspect Current

> Goal: ตรวจสอบ `.gitignore` ปัจจุบัน
> Goal: รู้ว่ามี entries อะไรบ้างและขาดอะไร

1. อ่าน root `.gitignore`
2. ค้นหา `.gitignore` ใน workspaces
3. ระบุ missing entries ตาม stack

### 2. Determine Stack

> Goal: ระบุ artifacts ทีต้อง ignore
> Goal: รู้ stack-specific patterns

1. อ่าน `package.json` สำหรับ package manager (bun, node)
2. อ่าน config สำหรับ build tools (vite, tauri, rust, vitepress)
3. อ่าน tooling (moon, turbo, lefthook, ast-grep)

### 3. Update Root .gitignore

> Goal: อัปเดต root `.gitignore`
> Goal: root `.gitignore` ครอบคลุมสิ่งทีควร ignore

1. เพิ่ม `node_modules`, `dist`, `.output`, `coverage`, `target`, `.turbo`, `.moon/cache`
2. เพิ่ม `.env`, `.env.*` ยกเว้น `.env.example`
3. เพิ่ม IDE files (`.vscode/` ถ้าไม่ต้องการ share, `.idea/`)
4. เพิ่ม lock files ทีไม่ใช้ (ถ้าใช้ bun ให้ ignore `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)
5. เพิ่ม OS files (`.DS_Store`, `Thumbs.db`)

### 4. Update Workspace .gitignore

> Goal: อัปเดต workspace-specific `.gitignore`
> Goal: workspace `.gitignore` ไม่ซ้ำ root และครบ

1. ตรวจสอบว่า workspace มี build output พิเศษหรือไม่
2. เพิ่ม entries ตาม stack ของ workspace
3. หลีกเลี่ยง duplicate กับ root

### 5. Validate

> Goal: ตรวจสอบความถูกต้อง
> Goal: `.gitignore` ทำงานได้ตาม expected

1. รัน `git status` เพื่อดูว่าไม่มีไฟล์ทีควร ignore
2. ทำ `git check-ignore` กับตัวอย่างไฟล์
3. ทำ `/validate` เพื่อ verify

## Rules

### 1. Safety

- ไม่ลบ entries ทีมีอยู่ ยกเว้น user confirm
- ไม่ ignore ไฟล์ config ทีต้อง commit
- ไม่ ignore source files

### 2. Stack-Aware

- ใช้ Bun ให้ ignore `bun.lockb` ถ้ามี
- ใช้ Moonrepo ให้ ignore `.moon/cache`
- ใช้ Rust/Tauri ให้ ignore `target/`, `pkg/`, `gen/`
- ใช้ VitePress ให้ ignore `.vitepress/dist`, `.vitepress/cache`

### 3. Consistency

- รักษา pattern เดียวกันระหว่าง root และ workspaces
- เรียงลำดับ categories: dependencies > build > IDE > secrets > OS

## Expected Outcome

- `.gitignore` ครอบคลุม stack ที่ใช้
- ไม่เกิน 250 บรรทัด (ถ้าเกินให้ split เป็น workspace-specific)
- `git status` ไม่แสดง artifacts ทีไม่ควร commit
