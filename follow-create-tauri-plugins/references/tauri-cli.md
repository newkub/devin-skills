# Tauri CLI Reference — Plugin Development

อ้างอิง Tauri CLI commands สำหรับ plugin development ครอบคลุมการสร้าง, เพิ่ม mobile support, ติดตั้ง plugin และ build

## Prerequisites

ติดตั้ง Tauri CLI ก่อนใช้งาน:

```sh
# ผ่าน cargo
cargo install tauri-cli --version "^2.0.0"

# ผ่าน npm
npm install -g @tauri-apps/cli

# ผ่าน bun (one-off)
bunx @tauri-apps/cli <command>
```

## plugin new

สร้าง plugin project ใหม่ สร้าง directory `tauri-plugin-<name>/`

```sh
# พื้นฐาน
cargo tauri plugin new <name>

# ผ่าน npm
npx @tauri-apps/cli plugin new <name>

# ผ่าน bun
bunx @tauri-apps/cli plugin new <name>
```

### Options

| Flag | คำอธิบาย |
|------|---------|
| `--no-api` | ไม่สร้าง NPM package (เฉพาะ Rust crate) |
| `--android` | เพิ่ม Android library project |
| `--ios` | เพิ่ม iOS Swift package |
| `--directory <path>` | ระบุ parent directory |

### โครงสร้างที่สร้าง

```
tauri-plugin-<name>/
├── src/
│   ├── commands.rs    - commands สำหรับ webview
│   ├── desktop.rs     - desktop implementation
│   ├── error.rs       - error types
│   ├── lib.rs         - plugin entry point
│   ├── mobile.rs      - mobile implementation
│   └── models.rs      - shared structs
├── permissions/       - permission files
├── android/           - Android library (ถ้ามี --android)
├── ios/               - Swift package (ถ้ามี --ios)
├── guest-js/          - JavaScript API source
├── dist-js/           - transpiled JS
├── Cargo.toml
└── package.json
```

## plugin android add

เพิ่ม Android support ใน plugin ที่มีอยู่ สร้าง Android library project และ guide การเปลี่ยนแปลงที่จำเป็น

```sh
cargo tauri plugin android add

# ผ่าน npm
npx @tauri-apps/cli plugin android add
```

- สร้าง `android/` directory พร้อม Kotlin project
- แก้ไข `Cargo.toml` เพื่อเพิ่ม mobile dependencies
- อัปเดต `src/mobile.rs` สำหรับ Android implementation

## plugin ios add

เพิ่ม iOS support ใน plugin ที่มีอยู่ สร้าง Swift package และ guide การเปลี่ยนแปลงที่จำเป็น

```sh
cargo tauri plugin ios add

# ผ่าน npm
npx @tauri-apps/cli plugin ios add
```

- สร้าง `ios/` directory พร้อม Swift package
- แก้ไข `Cargo.toml` เพื่อเพิ่ม mobile dependencies
- อัปเดต `src/mobile.rs` สำหรับ iOS implementation

## tauri add

ติดตั้ง plugin ใน Tauri application แก้ไข `Cargo.toml` และ `tauri.conf.json` อัตโนมัติ

```sh
# ผ่าน cargo
cargo tauri add <plugin-name>

# ผ่าน npm
npm run tauri add <plugin-name>

# ผ่าน bun
bun tauri add <plugin-name>

# ผ่าน pnpm
pnpm tauri add <plugin-name>
```

- ติดตั้ง Rust crate จาก crates.io
- ติดตั้ง NPM package จาก npm registry
- เพิ่ม plugin ใน `tauri.conf.json > plugins`
- สร้าง default permissions ใน capabilities

## cargo build

build Rust crate ของ plugin

```sh
# build ปกติ
cargo build

# build สำหรับ Android
cargo build --target aarch64-linux-android

# build สำหรับ iOS
cargo build --target aarch64-apple-ios

# build พร้อม features
cargo build --features mobile
```

## Build Script

plugin ใช้ `build.rs` สำหรับ generate permissions และ schemas

```rust
const COMMANDS: &[&str] = &["upload", "download"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .global_scope_schema(schemars::schema_for!(scope::Entry))
        .build();
}
```

- `COMMANDS` เป็น list ของ command names ใน snake_case
- สร้าง `allow-<command>` และ `deny-<command>` permissions อัตโนมัติ
- `global_scope_schema` สร้าง JSON schema สำหรับ scope autocomplete

## JavaScript API Build

build TypeScript bindings ใน `guest-js/`

```sh
# ผ่าน npm
npm install && npm run build

# ผ่าน pnpm
pnpm install && pnpm build

# ผ่าน bun
bun install && bun run build
```

- output ไปที่ `dist-js/`
- ใช้ `@tauri-apps/api/core` สำหรับ `invoke` และ `Channel`

## Platform Support Declaration

ประกาศ platform support ใน `Cargo.toml`

```toml
[package.metadata.platforms.support]
windows = { level = "full" }
linux = { level = "full" }
macos = { level = "full" }
android = { level = "partial", notes = "Access is restricted to the Application folder" }
ios = { level = "none" }
```

- `level`: `"full"`, `"partial"`, หรือ `"none"`
- `notes`: คำอธิบาย limitations (optional)

## Publish

```sh
# publish Rust crate ไป crates.io
cargo publish

# publish NPM package
npm publish
```

## Sources

- https://v2.tauri.app/develop/plugins/
- https://v2.tauri.app/reference/cli/
- https://v2.tauri.app/develop/plugins/develop-mobile/
- https://v2.tauri.app/learn/security/writing-plugin-permissions/
