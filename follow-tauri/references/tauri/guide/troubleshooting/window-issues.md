---
title: Window Issues
description: การแก้ปัญหา window issues ที่พบบ่อย
---

## Error: "Window not found"

**Cause**: Window label ไม่ตรงกัน

**Solution**:
```rust
// Rust
WindowBuilder::new(
    app,
    "main", // <- window label
    tauri::WindowUrl::App("index.html".into())
).build()?;

// Frontend
import { getCurrentWindow } from '@tauri-apps/api/window'
const window = getCurrentWindow() // Uses "main" by default
```

## Error: "Window closes immediately"

**Cause**: Error ใน frontend หรือ Rust initialization

**Solution**:
```bash
# Run with verbose logging
bun run tauri dev -- --verbose

# Check terminal for error messages
```
