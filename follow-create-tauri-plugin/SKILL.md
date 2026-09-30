---
name: follow-create-tauri-plugin
description: สร้าง custom Tauri plugins ด้วย Rust และ JavaScript API
argument-hint: "[scope]"
related:
  - follow-create-web
  - deep-review
  - follow-tool-cargo
  - ship-to-dev-branch

---
## Goal

สร้าง custom Tauri plugins เพื่อขยายความสามารถของ Tauri applications ด้วย Rust backend และ JavaScript API

## Scope

ครอบคลุมการสร้าง plugins สำหรับ desktop และ mobile platforms พร้อม commands, state management, lifecycle events และ mobile native code

- Packages: `tauri` crate, `@tauri-apps/cli`, `@tauri-apps/api` — ยืนยันเวอร์ชันล่าสุดด้วย `/deep-research` + `/follow-best-practice` ทุกครั้ง (ไม่ pin ในไฟล์ — ตาม `/update-devin-global-skills`)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/deep-research` + `/follow-best-practice` เพื่อยืนยันเวอร์ชันและ pattern ล่าสุด จากนั้นทำ `/deep-review` เพื่อสรุป tech stack
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create tauri plugins)

### 2. Initialize Plugin Project

> Goal: สร้าง plugin project ใหม่ด้วย Tauri CLI พร้อมโครงสร้างมาตรฐาน

1. รัน `bunx @tauri-apps/cli plugin new <name>` สำหรับสร้าง plugin ใหม่ (ทางเลือก: `cargo tauri plugin new <name>`)
2. ใช้ `--no-api` หากไม่ต้องการ NPM package
3. ใช้ `--android` และ `--ios` สำหรับ mobile support
4. ใช้ `--github-workflows` ถ้าต้องการ `.github` CI workflows (CLI ปัจจุบันไม่ generate `.github` โดย default)
5. Plugin จะถูกสร้างใน `tauri-plugin-<name>/`

### 3. Configure Plugin

> Goal: กำหนด configuration ของ plugin ผ่าน Builder และ Config struct

1. กำหนด plugin configuration ใน `tauri.conf.json > plugins` — `api.config()` ใน `setup` คืนค่า config ที่ parse จาก section นี้
2. กำหนด `Config` struct (derive `Deserialize`) — ใช้ `Builder::<R, Option<Config>>` ถ้า config เป็น optional
3. ใช้ `tauri::plugin::Builder::<R, Config>::new("<plugin-name>").setup(|app, api| { ... Ok(()) }).build()` คืน `TauriPlugin<R, Config>`

### 4. Define Commands

> Goal: สร้าง commands สำหรับให้ webview เรียกใช้ผ่าน invoke handler

1. สร้าง commands ใน `src/commands.rs` ด้วย `#[tauri::command]` macro — ใช้ `tauri::ipc::Channel` parameter สำหรับ stream progress กลับ frontend
2. Register commands ใน `src/lib.rs` ผ่าน `invoke_handler(tauri::generate_handler![commands::my_command])`
3. Commands สามารถ access `AppHandle`, `Window`, state และ input parameters

### 5. Implement Lifecycle Events

> Goal: เชื่อม lifecycle hooks ของ plugin เพื่อจัดการ state และ events

1. Implement lifecycle hooks: `setup`, `on_navigation` (คืน `false` เพื่อ cancel navigation), `on_page_load`, `on_webview_ready` (init scripts เมื่อ window สร้าง), `on_event` (`RunEvent::ExitRequested`/`Exit`), `on_drop`
2. จัดการ state ใน `setup` hook ผ่าน `app.manage()` — commands access ผ่าน `tauri::State<T>`, นอก commands ใช้ `Manager` trait (`app.state::<T>()`, `app.emit()`)
3. Export plugin API ใน `desktop.rs`/`mobile.rs` เป็น struct + extension trait (เช่น `<Name>Ext`) เพื่อ access ผ่าน `app.<name>()...`

### 6. Create JavaScript API

> Goal: สร้าง JavaScript/TypeScript bindings สำหรับเรียก commands จาก frontend

1. สร้าง bindings ใน `webview-src/index.ts`:

```typescript
import { invoke } from '@tauri-apps/api/core'
export async function myCommand() {
  await invoke('plugin:<plugin-name>|my_command')
}
```

2. Build TypeScript: `bun run build`

### 7. Add Mobile Support

> Goal: เพิ่ม mobile support สำหรับ Android และ iOS

1. รัน `bunx @tauri-apps/cli plugin android add` สำหรับ Android
2. รัน `bunx @tauri-apps/cli plugin ios add` สำหรับ iOS
3. Implement native code ใน Kotlin (Android) และ Swift (iOS)
4. Trigger mobile code จาก Rust ผ่าน `mobile.rs`

### 8. Test And Publish

> Goal: ทดสอบและ publish plugin

1. Test plugin ใน Tauri app: ติดตั้งด้วย `tauri add <plugin-name>`
2. Build plugin: `cargo build`
3. Publish ไป crates.io และ NPM

### 9. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-to-dev-branch`
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

- Commands ไม่ accessible โดย default — generate permissions ผ่าน `build.rs`: `tauri_plugin::Builder::new(&["cmd1", "cmd2"]).build()` สร้าง `allow-<cmd>`/`deny-<cmd>` ใน `permissions/` อัตโนมัติ (เพิ่ม `global_scope_schema` สำหรับ scope autocomplete)
- `permissions/default.toml` define default permission set (`"$schema" = "schemas/schema.json"` + `[default] permissions = [...]`)
- ประกาศ platform support ใน `Cargo.toml > [package.metadata.platforms.support]` — `windows`/`linux`/`macos`/`android`/`ios` ระดับ `"full"`/`"partial"`(+`notes`)/`"none"`
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

- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-tool-cargo ถ้าจำเป็น

## Expected Outcome

- Tauri plugin สร้างสำเร็จด้วย CLI
- Commands และ JavaScript API ทำงานได้
- Lifecycle events implemented ครบถ้วน
- Plugin รองรับ desktop และ mobile platforms
- Plugin สามารถ publish ไป crates.io และ NPM

