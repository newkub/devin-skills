---
title: Debugging Tools
description: Debugging tools สำหรับ Tauri
---

## Logging

**Rust Logging**
```rust
use log::{info, error};

#[tauri::command]
fn my_command() {
    info!("Command started");
    // ... logic
    error!("Something went wrong");
}
```

**Frontend Logging**
```typescript
console.log('Debug info')
console.error('Error occurred')
```

## DevTools

**Enable DevTools**
```rust
WindowBuilder::new(app, "main", tauri::WindowUrl::App("index.html".into()))
    .devtools(true) // Enable DevTools in dev mode
    .build()?;
```

## Profiling

**Rust Profiling**
```bash
cargo install flamegraph
cargo flamegraph
```

**Frontend Profiling**
- Chrome DevTools Performance tab
- React DevTools Profiler
