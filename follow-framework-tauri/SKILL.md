---
name: follow-framework-tauri
description: สร้าง Desktop Applications ด้วย Tauri, Vite, React และ Rust backend
argument-hint: "[scope]"
related:
  - follow-create-tauri-plugins
  - follow-framework-astro
  - follow-framework-capacitor
  - follow-best-practice
  - setup-cicd
  - follow-my-tech-stack
---

## Goal

สร้าง Tauri desktop application ที่ใช้ web frontend (Vite + React) ร่วมกับ Rust backend สำหรับ cross-platform desktop apps

## Scope

ใช้สำหรับสร้าง ปรับปรุง และ build Tauri desktop apps ด้วย Bun และ Vite

- ตรวจสอบ prerequisites (Rust, Bun, WebView2)
- ติดตั้ง dependencies และ Tauri CLI
- ตั้งค่า Vite และ `tauri.conf.json`
- สร้าง IPC commands ระหว่าง frontend และ Rust backend
- เพิ่ม plugins ตามต้องการ
- build และ test บน target platforms

## Execute

### 1. Setup Environment

> Goal: ตรวจสอบ prerequisites สำหรับ Tauri development

1. ตรวจสอบ Rust ติดตั้งแล้ว: `rustc --version`
2. ตรวจสอบ Bun ติดตั้งแล้ว: `bun --version`
3. ยืนยัน WebView2 บน Windows (ติดตั้งอัตโนมัติตอน run ครั้งแรก)

### 2. Install Dependencies

> Goal: ติดตั้ง dependencies สำหรับ Tauri app

1. รัน `bun install`
2. ติดตั้ง Tauri API: `bun add @tauri-apps/api`
3. ติดตั้ง Tauri CLI: `bun add -D @tauri-apps/cli`

### 3. Configure Vite

> Goal: ตั้งค่า `vite.config.ts` ให้เข้ากับ Tauri dev server

1. ตั้งค่า port 5173
2. ตั้งค่า `server.fs.deny` หรือ ignore `src-tauri/`
3. ตั้งค่า `envPrefix` ให้รองรับ `VITE_` และ `TAURI_`

### 4. Configure Tauri

> Goal: ตั้งค่า `tauri.conf.json` และ capabilities

1. แก้ไข `src-tauri/tauri.conf.json`: ตั้ง `productName`, `identifier`, `devUrl: http://localhost:5173`, `beforeDevCommand: bun run dev`, `beforeBuildCommand: bun run build`
2. กำหนด capabilities ใน `src-tauri/capabilities/default.json`: `["core:default", "fs:allow-read-file", "dialog:allow-open"]`

### 5. Develop IPC Commands

> Goal: สร้าง Rust commands และเรียกใช้จาก frontend

1. สร้าง Rust command ใน `src-tauri/src/lib.rs`
2. Register command ด้วย `tauri::Builder::default().invoke_handler(...)`
3. เรียกใช้จาก frontend ด้วย `invoke('command', args)`

### 6. Add Plugins

> Goal: ติดตั้ง official หรือ community plugins ตามต้องการ

1. ติดตั้ง official plugins ด้วย `bun run tauri add <plugin-name>`
2. ติดตั้ง community plugins ด้วย `bun add @tauri-apps/plugin-<plugin-name>`
3. อัปเดต `tauri.conf.json` และ capabilities สำหรับ plugin ที่เพิ่ม

### 7. Build And Test

> Goal: Build และ test Tauri app

1. Development mode: `bun run tauri dev`
2. Production build: `bun run tauri build`
3. Platform specific: `bun run tauri build --target <triple>`

## Rules

### Project Structure

```text
desktop-apps/{project}/
├── src/                    # Frontend
│   ├── components/
│   ├── hooks/
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
├── vite.config.ts
├── package.json
└── index.html
```

### Standards

- ใช้ `bun` สำหรับทุก commands
- Vite port ต้องตรงกับ `tauri.conf.json` (default: 5173)
- Vite ต้อง ignore `src-tauri/`
- IPC ใช้ `invoke()` สำหรับ frontend → backend
- กำหนด capabilities ใน `tauri.conf.json`

### IPC Pattern

| Direction | Method |
|-----------|--------|
| Frontend → Backend | `invoke('command', args)` |
| Backend → Frontend | Events |

### Plugins

- เพิ่ม plugin เฉพาะที่จำเป็นจริง ๆ
- อัปเดต `src-tauri/capabilities/default.json` สำหรับ permission ของ plugin
- ไม่เปิด permission กว้างเกินความจำเป็น

- ใช้ /follow-create-tauri-plugins ถ้าจำเป็น
- ใช้ /follow-framework-astro ถ้าจำเป็น
- ใช้ /follow-framework-capacitor ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /follow-my-tech-stack ถ้าจำเป็น

## Expected Outcome

- Tauri project สร้างสำเร็จ
- Dev server ทำงานได้ที่ `bun run tauri dev`
- Frontend และ Rust backend เชื่อมต่อกันผ่าน IPC
- Production build สร้าง executables ได้
- Capabilities กำหนดตาม least privilege
