---
name: follow-create-zed-extensions
description: สร้าง Zed extensions ด้วย Rust/WASM และ extension manifest
related:
  - follow-create-rust-crate
  - follow-create-sdk
  - follow-lang-rust
  - open-in-zed
  - follow-my-tech-stack
  - review-techstack
  - report-table
---
## Goal

สร้าง Zed extension project ทีมี `extension.toml` manifest, Rust/WASM code ถ้าจำเป็น, themes, languages, snippets, หรือ language server integration

## Scope

ใช้สำหรับสร้าง Zed extension ที provide languages, themes, icon themes, snippets, debuggers, หรือ MCP servers รองรับทั้ง pure manifest และ Rust/WASM custom code

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Determine Extension Type

> Goal: เลือกประเภท extension

1. ถ้าเพิ่ม language support: ใช้ `languages/` ด้วย `config.toml` และ highlights
2. ถ้าเพิ่ม theme: ใช้ `themes/` ด้วย JSON
3. ถ้าเพิ่ม snippets: ใช้ `snippets/`
4. ถ้า language server/debugger/MCP: ใช้ Rust/WASM custom code

### 3. Setup Manifest

> Goal: สร้าง `extension.toml`

1. สร้าง root `extension.toml` ด้วย `id`, `name`, `version`, `schema_version`, `authors`, `description`, `repository`
2. ระบุ `themes`, `languages`, `snippets`, `lib` ตาม feature

### 4. Add Rust/WASM Code (If Needed)

> Goal: implement custom code สำหรับ language server หรือ debugger

1. ติดตั้ง Rust target `wasm32-wasip2` ด้วย `rustup target add wasm32-wasip2`
2. สร้าง `Cargo.toml` ด้วย `crate-type = ["cdylib"]`
3. ติดตั้ง `zed_extension_api`
4. สร้าง `src/lib.rs` ด้วย `impl zed::Extension for MyExtension` และ `register_extension!`
5. ระวังว่า `std::env::var` ไม่ทำงานใน WASM

### 5. Add Languages

> Goal: เพิ่ม language support

1. สร้าง `languages/{language}/config.toml`
2. สร้าง `languages/{language}/highlights.scm`
3. ระบุ `path_suffixes`, `line_comments`, `tab_size`

### 6. Add Themes

> Goal: เพิ่ม theme หรือ icon theme

1. สร้าง `themes/{theme}.json`
2. ติดตั้ง theme format ตาม Zed docs
3. ระบุ theme ใน `extension.toml`

### 7. Test Locally

> Goal: ทดสอบ extension ใน Zed

1. เปิด Zed → Extensions → Install Dev Extension
2. เลือก directory ของ extension
3. ตรวจสอบ logs ด้วย `zed: open log`
4. ถ้า Rust extension เปิด Zed ด้วย `zed --foreground` เพื่อเห็น `println!`

### 8. Publish

> Goal: publish สู่ Zed extension registry

1. ตรวจสอบ `extension.toml` และ `Cargo.toml` ครบถ้วน
2. build Rust extension ด้วย `cargo build --target wasm32-wasip2 --release`
3. สร้าง GitHub repo พร้อม release
4. ส่ง PR ไปยัง `zed-industries/extensions` หรือ publish ผ่าน Zed registry
5. ทำ `/ship-ci`

## Rules

- `extension.toml` ต้องมี `id`, `name`, `version`, `schema_version`
- `id` ใช้ lowercase, hyphen, ไม่มี space
- Rust code ต้อง target `wasm32-wasip2`
- ใช้ `zed_extension_api::current_platform()` แทน `std::env::var`
- หลีกเลี่ยง `std::fs` ใน WASM; ใช้ `Worktree` methods

## Expected Outcome

- `extension.toml` ถูกต้อง
- Extension ติดตั้งใน Zed เป้น dev extension ได้
- Rust/WASM build ผ่าน (ถ้ามี)
- Languages, themes, หรือ snippets ทำงาน
- พร้อม publish ไป Zed registry
