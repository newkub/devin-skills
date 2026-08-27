---
name: follow-create-tauri-plugins
description: สร้าง custom Tauri plugins ด้วย Rust และ JavaScript API
related:
  - follow-create-website
  - follow-tool-cargo
---
## Goal

สร้าง custom Tauri plugins เพื่อขยายความสามารถของ Tauri applications ด้วย Rust backend และ JavaScript API

## Scope

ครอบคลุมการสร้าง plugins สำหรับ desktop และ mobile platforms พร้อม commands, state management, lifecycle events และ mobile native code

## Execute

### 1. Initialize Plugin Project

> Goal: สร้าง plugin project ใหม่ด้วย Tauri CLI พร้อมโครงสร้างมาตรฐาน

สร้าง plugin ใหม่ด้วย Tauri CLI — ดู CLI options ใน [references/tauri-cli.md](references/tauri-cli.md)

1. รัน `bunx @tauri-apps/cli plugin new <name>` สำหรับสร้าง plugin ใหม่
2. ใช้ `--no-api` หากไม่ต้องการ NPM package
3. ใช้ `--android` และ `--ios` สำหรับ mobile support
4. Plugin จะถูกสร้างใน `tauri-plugin-<name>/`

### 2. Configure Plugin

> Goal: กำหนด configuration ของ plugin ผ่าน Builder และ Config struct

กำหนด configuration ของ plugin — ดู Builder API ใน [references/tauri-plugin-api.md](references/tauri-plugin-api.md)

1. กำหนด plugin configuration ใน `tauri.conf.json`
2. กำหนด Config struct ใน Rust code
3. ใช้ Builder สำหรับ setup plugin ด้วย config

### 3. Define Commands

> Goal: สร้าง commands สำหรับให้ webview เรียกใช้ผ่าน invoke handler

สร้าง commands สำหรับ webview เรียกใช้ — ดู commands macro ใน [references/tauri-plugin-api.md](references/tauri-plugin-api.md)

1. สร้าง commands ใน `src/commands.rs` ด้วย `#[tauri::command]` macro
2. Register commands ใน `src/lib.rs` ผ่าน `invoke_handler(tauri::generate_handler![commands::my_command])`
3. Commands สามารถ access `AppHandle`, `Window`, state และ input parameters

### 4. Implement Lifecycle Events

> Goal: เชื่อม lifecycle hooks ของ plugin เพื่อจัดการ state และ events

Hook ลง lifecycle events ของ plugin — ดู lifecycle hooks ใน [references/tauri-plugin-api.md](references/tauri-plugin-api.md)

1. Implement lifecycle hooks: `setup`, `on_navigation`, `on_page_load`, `on_webview_ready`, `on_event`, `on_drop`
2. จัดการ state ใน `setup` hook ผ่าน `app.manage()`
3. Access state ผ่าน extension trait บน Manager instances

### 5. Create JavaScript API

> Goal: สร้าง JavaScript/TypeScript bindings สำหรับเรียก commands จาก frontend

สร้าง bindings สำหรับ JavaScript/TypeScript — ดู JavaScript API build ใน [references/tauri-cli.md](references/tauri-cli.md)

1. สร้าง bindings ใน `webview-src/index.ts`:

```typescript
import { invoke } from '@tauri-apps/api/core'
export async function myCommand() {
  await invoke('plugin:<plugin-name>|my_command')
}
```

2. Build TypeScript: `bun run build`

### 6. Add Mobile Support

> Goal: เพิ่ม mobile support สำหรับ Android และ iOS

1. รัน `bunx @tauri-apps/cli plugin android add` สำหรับ Android
2. รัน `bunx @tauri-apps/cli plugin ios add` สำหรับ iOS
3. Implement native code ใน Kotlin (Android) และ Swift (iOS)
4. Trigger mobile code จาก Rust ผ่าน `mobile.rs`

### 7. Test And Publish

> Goal: ทดสอบและ publish plugin

1. Test plugin ใน Tauri app: ติดตั้งด้วย `tauri add <plugin-name>`
2. Build plugin: `cargo build`
3. Publish ไป crates.io และ NPM

### 8. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Naming Convention

- Rust crate: `tauri-plugin-<plugin-name>`
- NPM package: `@scope/plugin-<plugin-name>` หรือ `tauri-plugin-<plugin-name>-api`
- Plugin name ใน `tauri.conf.json > plugins`

### 2. Project Structure

```
tauri-plugin-<name>/
├── src/
│   ├── commands.rs - Commands สำหรับ webview
│   ├── desktop.rs - Desktop implementation
│   ├── mobile.rs - Mobile implementation
│   ├── error.rs - Error types
│   ├── lib.rs - Plugin entry point
│   └── models.rs - Shared structs
├── permissions/ - Permission files
├── android/ - Android library
├── ios/ - Swift package
├── guest-js/ - JavaScript API source
├── dist-js/ - Transpiled JS
├── Cargo.toml
└── package.json
```

### 3. Command Permissions

- Commands จะถูก generate permissions อัตโนมัติใน `permissions/` — ดู [references/tauri-plugin-api.md](references/tauri-plugin-api.md)
- Define permissions ใน `tauri.conf.json > capabilities`
- ใช้ `allow-<command-name>` สำหรับ grant access

### 4. State Management

- ใช้ `app.manage()` ใน `setup` hook
- Access state ผ่าน extension trait บน Manager instances
- ใช้ `AppHandle`, `App`, `Window` สำหรับ state access

### 5. Mobile Development

- Android: Kotlin code ใน `android/`
- iOS: Swift code ใน `ios/`
- Trigger mobile code จาก Rust ผ่าน `mobile.rs`

## Expected Outcome

- Tauri plugin สร้างสำเร็จด้วย CLI
- Commands และ JavaScript API ทำงานได้
- Lifecycle events implemented ครบถ้วน
- Plugin รองรับ desktop และ mobile platforms
- Plugin สามารถ publish ไป crates.io และ NPM
