---
title: Command Registration
description: วิธี register commands ใน Tauri
---

## Register Commands

```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            my_command,
            async_command,
            increment
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Custom Command Handler

```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(|cmd| {
            match cmd.name.as_str() {
                "greet" => {
                    let name = cmd.args.get("name").unwrap().as_str().unwrap();
                    Ok(format!("Hello, {}!", name))
                }
                _ => Err("Unknown command".to_string()),
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```
