---
title: Command Definition
description: วิธีกำหนด commands ใน Tauri
---

## Basic Command

```rust
#[tauri::command]
fn my_command(param: String) -> Result<String, String> {
    Ok(format!("Received: {}", param))
}
```

## Async Command

```rust
#[tauri::command]
async fn async_command() -> Result<String, String> {
    tokio::time::sleep(Duration::from_secs(1)).await;
    Ok("Async completed".to_string())
}
```

## Command with State

```rust
struct MyState {
    counter: Mutex<i32>,
}

#[tauri::command]
fn increment(state: State<MyState>) -> i32 {
    let mut counter = state.counter.lock().unwrap();
    *counter += 1;
    *counter
}
```

## Command with Window

```rust
#[tauri::command]
fn close_window(window: Window) {
    window.close().unwrap();
}
```
