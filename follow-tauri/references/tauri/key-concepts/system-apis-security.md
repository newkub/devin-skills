---
title: System APIs Security
description: Security considerations สำหรับ System APIs
---

## Capabilities

```json
// capabilities/default.json
{
  "identifier": "default",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:allow-read-file",
    "fs:allow-write-file",
    "shell:allow-open",
    "dialog:allow-open"
  ]
}
```

## Scoped Access

```json
{
  "permissions": [
    {
      "identifier": "fs:allow-read-file",
      "allow": [{ "path": "$HOME/documents/*" }]
    }
  ]
}
```

## Permission Checks

```rust
#[tauri::command]
async fn check_permission() -> bool {
    // Check if permission is granted
    true
}
```
