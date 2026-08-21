---
title: IPC Advanced Patterns
description: Advanced patterns สำหรับ IPC communication
---

## Streaming Data

```rust
use tauri::Emitter;

#[tauri::command]
async fn stream_data(app: AppHandle) -> Result<(), String> {
    for i in 0..10 {
        app.emit("data-chunk", i).map_err(|e| e.to_string())?;
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
    Ok(())
}
```

```typescript
import { listen } from '@tauri-apps/api/event'

const unlisten = await listen('data-chunk', (event) => {
  console.log('Received:', event.payload)
})
```

## Progress Reporting

```rust
#[tauri::command]
async fn long_task(app: AppHandle) -> Result<String, String> {
    for i in 0..100 {
        app.emit("progress", i).map_err(|e| e.to_string())?;
        tokio::time::sleep(Duration::from_millis(50)).await;
    }
    Ok("Completed".to_string())
}
```

## Bidirectional Communication

```rust
#[tauri::command]
async fn bidirectional(window: Window) -> Result<(), String> {
    window.emit("server-message", "Hello from server")?;
    Ok(())
}
```

```typescript
import { listen } from '@tauri-apps/api/event'

await listen('server-message', (event) => {
  console.log('Server says:', event.payload)
})
```
