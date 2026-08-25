# Reference Index — `follow-create-tauri-plugins`

รายการ reference files สำหรับ skill `follow-create-tauri-plugins` ครอบคลุมการสร้าง custom Tauri plugins ด้วย Rust backend และ JavaScript API

## Files

| File | ความรับผิดชอบ |
|------|-------------|
| `tauri-plugin-api.md` | Tauri plugin Rust API reference — `Builder`, `generate_handler!` macro, lifecycle hooks (`setup`, `on_navigation`, `on_webview_ready`, `on_event`, `on_drop`), state management, `Manager` trait, extension traits, plugin configuration, command permissions |
| `tauri-cli.md` | Tauri CLI commands สำหรับ plugin development — `plugin new`, `plugin android add`, `plugin ios add`, `tauri add`, `cargo build`, build script, platform support declaration |

## Usage

- ใช้ `tauri-plugin-api.md` เมื่อต้องเขียน Rust code ของ plugin เช่น `Builder`, commands, lifecycle hooks, state
- ใช้ `tauri-cli.md` เมื่อต้องสร้าง plugin project, เพิ่ม mobile support, ติดตั้ง plugin ใน app, หรือ build
- ทั้งสองไฟล์อ้างอิงจาก Tauri v2 official documentation

## Sources

- Tauri Plugin Development: https://v2.tauri.app/develop/plugins/
- Tauri CLI Reference: https://v2.tauri.app/reference/cli/
- Tauri Mobile Plugin Development: https://v2.tauri.app/develop/plugins/develop-mobile/
