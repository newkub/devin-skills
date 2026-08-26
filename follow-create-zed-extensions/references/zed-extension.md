# Zed Extension Reference

## Official Sources

- Developing Extensions: https://zed.dev/docs/extensions/developing-extensions
- Extension API: https://docs.rs/zed_extension_api
- GitHub: https://github.com/zed-industries/zed/tree/main/crates/extension_api
- Extension Registry: https://github.com/zed-industries/extensions

## extension.toml

```toml
id = "my-extension"
name = "My extension"
version = "0.0.1"
schema_version = 1
authors = ["Your Name <you@example.com>"]
description = "Example extension"
repository = "https://github.com/your-name/my-zed-extension"
```

## Directory Structure

```text
my-extension/
  extension.toml
  Cargo.toml
  src/
    lib.rs
  languages/
    my-language/
      config.toml
      highlights.scm
  themes/
    my-theme.json
  snippets/
    snippets.json
```

## Cargo.toml

```toml
[package]
name = "my-extension"
version = "0.0.1"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
zed_extension_api = "0.1.0"
```

## Rust Entry

```rust
use zed_extension_api as zed;

struct MyExtension;

impl zed::Extension for MyExtension {
    fn new() -> Self {
        Self
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &zed::LanguageServerId,
        _worktree: &zed::Worktree,
    ) -> zed::Result<zed::Command> {
        Ok(zed::Command {
            command: "my-lsp".to_string(),
            args: vec![],
            env: vec![],
        })
    }
}

zed::register_extension!(MyExtension);
```

## Language Config

```toml
name = "My Language"
grammar = "my_language"
path_suffixes = ["my"]
line_comments = ["//"]
tab_size = 2
```

## highlights.scm

```scheme
"return" @keyword
"function" @keyword
(identifier) @variable
```

## Dev Install

1. เปิด Zed
2. `cmd+shift+p` → `zed: install dev extension`
3. เลือก directory ของ extension
4. Reload Zed

## Build WASM

```bash
rustup target add wasm32-wasip2
cargo build --target wasm32-wasip2 --release
```

## WASM Restrictions

- `cfg` directives อาจไม่ทำงานตามคาด
- `std::env::var` ไม่ทำงาน
- ใช้ `zed_extension_api::current_platform()`
- ใช้ `Worktree` สำหรับอ่านไฟล์และ PATH

## Theme JSON

```json
{
  "name": "My Theme",
  "appearance": "dark",
  "style": {
    "background": "#1e1e1e",
    "text": "#d4d4d4"
  }
}
```

## Best Practices

- ใช้ version ล่าสุดของ `zed_extension_api`
- ตรวจสอบ compatible Zed versions
- ทดสอบ dev install ก่อน publish
