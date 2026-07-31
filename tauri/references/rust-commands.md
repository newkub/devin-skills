---
title: Rust Commands
description: Rust Command Definition ใน Tauri
---

```rust
use serde::{Deserialize, Serialize};
use tauri::Command;

#[derive(Serialize, Deserialize)]
pub struct User {
    pub name: String,
    pub age: u32,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
async fn fetch_user(id: u32) -> Result<User, String> {
    // Async operation
    Ok(User { name: "John".into(), age: 30 })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, fetch_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```
