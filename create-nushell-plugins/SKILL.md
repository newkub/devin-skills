---
name: create-nushell-plugins
description: สร้าง NuShell plugin ด้วย Rust ตาม official contributor guide
---

## Goal

สร้าง NuShell plugin ด้วย Rust ที่ทำงานได้จริง ตามมาตรฐานของ official NuShell contributor guide

## Scope

ใช้สำหรับสร้าง NuShell plugin ใหม่ด้วย Rust โดยใช้ `nu-plugin` และ `nu-protocol` crates

## Execute

### 1. Setup Project

สร้างโครงสร้าง project สำหรับ NuShell plugin

1. สร้าง project ด้วย `cargo new nu_plugin_<name>`
2. แก้ไข `Cargo.toml` เพื่อเพิ่ม dependencies:
   - `nu-plugin = "0.104.0"`
   - `nu-protocol = "0.104.0"`
3. ตั้งค่า `edition = "2024"` และให้ version ตรงกับติดตั้ง NuShell
4. สร้าง `src/main.rs` เป็น entry point ของ plugin

### 2. Implement Plugin Trait

สร้าง struct ที่ implement `Plugin` trait

1. สร้าง unit struct สำหรับ plugin (เช่น `LenPlugin`)
2. implement `Plugin` trait:
   - `fn version(&self) -> String` ใช้ `env!("CARGO_PKG_VERSION").into()`
   - `fn commands(&self) -> Vec<Box<dyn PluginCommand<Plugin = Self>>>` คืนค่า list ของ commands
3. เก็บ state ของ plugin ใน struct นี้ได้ ถ้าจำเป็น

### 3. Implement Command

สร้าง command ด้วย `SimplePluginCommand` หรือ `PluginCommand`

1. สร้าง unit struct สำหรับแต่ละ command (เช่น `Len`)
2. implement `SimplePluginCommand` (หรือ `PluginCommand` ถ้าต้อง handle streams):
   - `fn name(&self) -> &str`
   - `fn description(&self) -> &str`
   - `fn signature(&self) -> Signature` ระบุ input/output types
   - `fn run(...)` ประมวลผล input และคืนค่า `Value` หรือ `LabeledError`
3. ใช้ `EvaluatedCall` สำหรับ arguments และ `call.head` สำหรับ span ของ error
4. ใช้ `PluginCommand` แทน ถ้า command ต้องรับหรือส่ง stream

### 4. Wire Main Entry Point

ต่อเข้ากับ NuShell plugin runtime

1. ใน `main()` เรียก `serve_plugin(&YourPlugin, JsonSerializer)` หรือ `MsgPackSerializer`
2. ใช้ `MsgPackSerializer` สำหรับ production เพราะเร็วกว่า
3. ใช้ `JsonSerializer` สำหรับ debug หรือทดสอบ protocol

### 5. Build and Register Plugin

ติดตั้งและ register plugin กับ NuShell

1. สร้าง release build ด้วย `cargo install --path . --locked`
2. ใน NuShell register plugin ด้วย `plugin add <path/to/nu_plugin_name>` (เติม `.exe` บน Windows)
3. โหลด plugin ทันทีด้วย `plugin use <command_name>` หรือ restart NuShell
4. ตรวจสอบด้วย `plugin list`

### 6. Development Workflow

พัฒนาและทดสอบ plugin

1. ใช้ `cargo build` และ `cargo run` ใน development
2. ใช้ `cargo clippy` และ `cargo fmt` สำหรับ code quality
3. ทดสอบ command ใน NuShell หลัง `plugin use <command_name>`
4. ปรับ `Signature` ให้ประกาศ input/output types ถูกต้องเพื่อ type checking

## Rules

- ตั้งชื่อ project ด้วย `nu_plugin_<name>` เสมอ
- `nu-plugin` และ `nu-protocol` version ต้องตรงกับ version ของ NuShell ที่ติดตั้ง
- ใช้ `SimplePluginCommand` สำหรับ command ที่ไม่ต้องจัดการ stream
- ใช้ `PluginCommand` สำหรับ command ที่ต้องจัดการ stream
- คืนค่า error ด้วย `LabeledError` พร้อม `call.head` span เพื่อให้ NuShell underline command ที error
- ใช้ `MsgPackSerializer` สำหรับ production
- อย่า hardcode version แต่ให้ดึงจาก `env!("CARGO_PKG_VERSION")`

## Expected Outcome

- NuShell plugin ที่ build และ register ได้สำเร็จ
- Command แสดงใน NuShell พร้อม help และ type signature
- Plugin ทำงานได้ตาม `Signature` ที่ประกาศ
- Code ผ่าน `cargo clippy` และ `cargo fmt`

## Example

### Cargo.toml

```toml
[package]
name = "nu_plugin_len"
version = "0.1.0"
edition = "2024"

[dependencies]
nu-plugin = "0.104.0"
nu-protocol = "0.104.0"
```

### src/main.rs

```rust
use nu_plugin::{
    EngineInterface, EvaluatedCall, JsonSerializer, Plugin, PluginCommand, SimplePluginCommand,
    serve_plugin,
};
use nu_protocol::{LabeledError, Signature, Type, Value};

struct LenPlugin;

impl Plugin for LenPlugin {
    fn version(&self) -> String {
        env!("CARGO_PKG_VERSION").into()
    }

    fn commands(&self) -> Vec<Box<dyn PluginCommand<Plugin = Self>>> {
        vec![Box::new(Len)]
    }
}

struct Len;

impl SimplePluginCommand for Len {
    type Plugin = LenPlugin;

    fn name(&self) -> &str {
        "len"
    }

    fn description(&self) -> &str {
        "calculates the length of its input"
    }

    fn signature(&self) -> Signature {
        Signature::build(PluginCommand::name(self))
            .input_output_type(Type::String, Type::Int)
    }

    fn run(
        &self,
        _plugin: &LenPlugin,
        _engine: &EngineInterface,
        call: &EvaluatedCall,
        input: &Value,
    ) -> Result<Value, LabeledError> {
        let span = input.span();
        match input {
            Value::String { val, .. } => Ok(Value::int(val.len() as i64, span)),
            _ => Err(
                LabeledError::new("Expected String input from pipeline")
                    .with_label(
                        format!("requires string input; got {}", input.get_type()),
                        call.head,
                    )
            ),
        }
    }
}

fn main() {
    serve_plugin(&LenPlugin, JsonSerializer);
}
```

### Register and Use

```nu
# build and install (from project root)
cargo install --path . --locked

# register in NuShell
plugin add ~/.cargo/bin/nu_plugin_len   # add .exe on Windows

# load and test
plugin use len
"hello" | len    # => 5
```

## Reference

- [NuShell Plugins Guide](https://www.nushell.sh/contributor-book/plugins.html#creating-a-plugin-in-rust)
- [nu-plugin crate docs](https://docs.rs/nu-plugin)
- [nu-protocol crate docs](https://docs.rs/nu-protocol)
