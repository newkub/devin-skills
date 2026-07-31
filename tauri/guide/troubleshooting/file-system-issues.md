---
title: File System Issues
description: การแก้ปัญหา file system issues ที่พบบ่อย
---

## Error: "Permission denied"

**Cause**: File system permissions ไม่เพียงพอ

**Solution**:
```json
// tauri.conf.json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "scope": ["$HOME/documents/*", "$DOWNLOAD/*"]
      }
    }
  }
}
```

## Error: "File not found"

**Cause**: Relative path ไม่ถูกต้อง

**Solution**:
```rust
use tauri::api::path::resolve_path;

let path = resolve_path(
    &app.config(),
    &app.package_info(),
    "data.txt"
).expect("failed to resolve path");
```
