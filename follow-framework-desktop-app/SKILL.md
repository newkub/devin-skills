---
name: follow-framework-desktop-app
description: สร้าง Desktop Applications ด้วย Tauri, SolidStart, และ UnoCSS
---

## Goal

สร้าง Tauri desktop application ที่ใช้ SolidStart เป็น frontend framework และ UnoCSS สำหรับ styling ร่วมกับ Rust backend สำหรับ cross-platform desktop apps

## Scope

ใช้สำหรับ desktop applications ที่ใช้:
- Tauri สำหรับ desktop wrapper
- SolidStart (Vinxi) สำหรับ frontend framework
- UnoCSS สำหรับ styling
- Rust สำหรับ backend

## Execute

### 1. Setup Environment

> Goal: ตรวจสอบ Rust, Bun, และ WebView2 ก่อนเริ่มโปรเจกต์

1. ตรวจสอบ Rust ติดตั้งแล้ว: `rustc --version`
2. ตรวจสอบ Bun ติดตั้งแล้ว: `bun --version`
3. ยืนยัน WebView2 บน Windows (ติดตั้งอัตโนมัติตอน run ครั้งแรก)

### 2. Initialize Project

> Goal: สร้าง SolidStart project ใหม่ด้วย starter template

สร้าง SolidStart project ใหม่ด้วย starter

1. รัน `bun create solid` หรือ `npm init solid` หรือ `pnpm create solid` หรือ `yarn create solid`
2. เลือก template (basic, bare, with-solidbase, with-auth, with-drizzle, with-mdx, with-prisma, with-solid-styled, with-tailwindcss)
3. เลือก options (SSR, TypeScript)
4. Install dependencies ด้วย `bun i`

### 3. Install Dependencies

> Goal: ติดตั้ง Tauri และ UnoCSS dependencies

1. ติดตั้ง Tauri API: `bun add @tauri-apps/api`
2. ติดตั้ง Tauri CLI: `bun add -D @tauri-apps/cli`
3. ติดตั้ง UnoCSS: `bun add -d unocss`
4. สำหรับ Icons ติดตั้ง iconify collections: `bun add -d @iconify-json/mdi`
5. รัน `bun install`

### 4. Configure TypeScript And Vite

> Goal: ตั้งค่า TypeScript และ Vite สำหรับ SolidStart + Tauri

1. ตั้งค่า TypeScript: `jsx: preserve`, `jsxImportSource: solid-js`, `moduleResolution: bundler`, `strict: true`
2. แก้ไข `vite.config.ts`: port 5173, ignore `src-tauri/`, `envPrefix` รองรับ `VITE_` และ `TAURI_`
3. เพิ่ม UnoCSS plugin ใน `vite.config.ts`

### 5. Configure UnoCSS

> Goal: กำหนด UnoCSS configuration สำหรับ styling

สร้าง `uno.config.ts`:

```ts
import { defineConfig, presetWind4, presetIcons, transformerVariantGroup, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  content: { filesystem: ['./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'] }
})
```

เพิ่ม `@unocss all;` ใน `src/style.css`

### 6. Configure Tauri

> Goal: แก้ไข `src-tauri/tauri.conf.json`
- ตั้ง `productName`, `identifier`
- `devUrl: http://localhost:5173`
- `beforeDevCommand: bun run dev`
- `beforeBuildCommand: bun run build`

กำหนด capabilities ใน `src-tauri/capabilities/default.json`:
```json
["core:default", "fs:allow-read-file", "dialog:allow-open"]
```

### 7. Develop IPC Commands

> Goal: สร้าง Rust IPC commands และเรียกใช้จาก frontend
1. สร้าง Rust command ใน `src-tauri/src/lib.rs`:

```rust
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}!", name)
}
```

2. Register command:

```rust
tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![greet])
  .run(tauri::generate_context!())
```

3. เรียกใช้จาก frontend:

```typescript
import { invoke } from '@tauri-apps/api/core'
const response = await invoke('greet', { name: 'World' })
```

### 8. Add Plugins And Develop

> Goal: ติดตั้ง plugins และพัฒนา application ตาม best practices

1. ติดตั้ง plugins ด้วย `bun run tauri add <plugin-name>` หรือ `bun add @tauri-apps/plugin-<plugin-name>`
2. รัน `bun run dev` สำหรับ development server
3. ใช้ `.tsx` สำหรับ components
4. กำหนด types สำหรับ props
5. ทำ `/refactor-all-workspace` เพื่อปรับปรุงโค้ด

### 9. Build And Test

> Goal: Build และ test Tauri desktop app บน target platforms
1. Development mode: `bun run tauri dev`
2. Production build: `bun run tauri build`
3. Platform specific: `bun run tauri build --target x86_64-apple-darwin`

## Rules

### 1. Configuration Standards

- ใช้ `bun` สำหรับทุก commands
- Vite port ตรงกับ `tauri.conf.json` (default: 5173)
- Vite ignore `src-tauri/`
- TypeScript: `jsx: preserve`, `jsxImportSource: solid-js`, `moduleResolution: bundler`, `strict: true`
- UnoCSS: `presetWind4`, `presetIcons`, `transformerVariantGroup`, `transformerDirectives`
- Tauri: กำหนด capabilities ใน `tauri.conf.json`

### 2. Development Standards

- ใช้ `.tsx` สำหรับ components
- กำหนด types สำหรับ props อย่างชัดเจน
- IPC ใช้ `invoke()` สำหรับ frontend → backend
- เขียน isomorphic code (ใช้ได้ทั้ง client และ server)

## Expected Outcome

- Tauri + SolidStart project สร้างสำร็จ
- TypeScript configuration ถูกต้องสำหรับ SolidStart
- UnoCSS integration สำเร็จด้วย presetWind4
- Dev server ทำงานได้ที่ `bun run tauri dev`
- Frontend (SolidStart) และ Rust backend เชื่อมต่อกันผ่าน IPC
- Production build สร้าง executables ได้
