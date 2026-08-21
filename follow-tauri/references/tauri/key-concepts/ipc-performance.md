---
title: IPC Performance
description: Performance optimization สำหรับ IPC
---

## Batch Operations

```rust
#[tauri::command]
async fn batch_process(items: Vec<String>) -> Result<Vec<String>, String> {
    items.into_iter()
        .map(|item| process_item(item))
        .collect()
}
```

## Caching

```rust
use std::collections::HashMap;

struct Cache {
    data: Mutex<HashMap<String, String>>,
}

#[tauri::command]
async fn cached_fetch(key: String, cache: State<Cache>) -> Result<String, String> {
    {
        let data = cache.data.lock().unwrap();
        if let Some(value) = data.get(&key) {
            return Ok(value.clone());
        }
    }
    
    let value = fetch_from_network(&key).await?;
    cache.data.lock().unwrap().insert(key.clone(), value.clone());
    Ok(value)
}
```

## Debouncing

```typescript
let debounceTimer: number

function debouncedInvoke() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    await invoke('expensive_operation')
  }, 300)
}
```
