---
title: Runtime Errors
description: การแก้ปัญหา runtime errors ที่พบบ่อย
---

## Error: "Failed to resolve path"

**Cause**: Path ไม่ถูกต้องหรือไม่มี permission

**Solution**:
```rust
// ใช้ absolute paths
let path = std::path::PathBuf::from("/absolute/path/to/file");

// หรือ resolve relative to app directory
let app_dir = app.path_resolver().app_dir().unwrap();
let file_path = app_dir.join("data.txt");
```

## Error: "IPC command not found"

**Cause**: Command ไม่ได้ register ใน invoke_handler

**Solution**:
```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            my_command,
            another_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```
