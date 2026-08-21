---
title: IPC Best Practices
description: Best practices สำหรับ IPC commands
---

## Use Type-Safe Serialization

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct MyData {
    id: u32,
    name: String,
}

#[tauri::command]
fn typed_command(data: MyData) -> Result<String, String> {
    Ok(format!("Received: {}", data.name))
}
```

## Keep Commands Focused

```rust
// Good: Single responsibility
#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

// Bad: Multiple responsibilities
#[tauri::command]
fn read_and_process_and_save(path: String) -> Result<String, String> {
    // Too many operations
}
```

## Document Commands

```rust
/// Reads a file from the file system
///
/// # Arguments
/// * `path` - The path to the file to read
///
/// # Returns
/// * `Result<String, String>` - The file content or error message
#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}
```
