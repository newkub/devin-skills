# Async IPC

## 1. Async Commands

```rust
#[tauri::command]
async fn async_command() -> Result<String, String> {
    tokio::time::sleep(Duration::from_secs(1)).await;
    Ok("Async completed".to_string())
}
```

```typescript
const result = await invoke('async_command')
console.log(result)
```

## 2. Streaming Results

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

## 3. Progress Reporting

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

```typescript
import { listen } from '@tauri-apps/api/event'

await listen('progress', (event) => {
  console.log('Progress:', event.payload, '%')
})
```
