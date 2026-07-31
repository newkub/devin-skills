---
title: IPC Error Handling
description: Error handling สำหรับ IPC commands
---

## Rust Error Handling

```rust
#[tauri::command]
fn may_fail() -> Result<String, String> {
    match perform_operation() {
        Ok(result) => Ok(result),
        Err(e) => Err(e.to_string()),
    }
}
```

## Frontend Error Handling

```typescript
try {
  const result = await invoke('may_fail')
  console.log(result)
} catch (error) {
  console.error('Command failed:', error)
}
```
