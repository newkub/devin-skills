---
title: IPC Security
description: Security best practices สำหรับ IPC
---

## Input Validation

```rust
#[tauri::command]
fn safe_command(input: String) -> Result<String, String> {
    if input.len() > 1000 {
        return Err("Input too long".to_string());
    }
    // Process input
    Ok("Success".to_string())
}
```

## Permission Checks

```rust
#[tauri::command]
fn privileged_operation(window: Window) -> Result<String, String> {
    if !window.is_decorated() {
        return Err("Unauthorized".to_string());
    }
    // Perform operation
    Ok("Success".to_string())
}
```

## Rate Limiting

```rust
use std::sync::Arc;
use std::time::{Duration, Instant};

struct RateLimiter {
    last_call: Arc<Mutex<Instant>>,
}

#[tauri::command]
async fn rate_limited_command(limiter: State<RateLimiter>) -> Result<String, String> {
    let mut last_call = limiter.last_call.lock().unwrap();
    let now = Instant::now();
    
    if now.duration_since(*last_call) < Duration::from_secs(1) {
        return Err("Rate limit exceeded".to_string());
    }
    
    *last_call = now;
    Ok("Success".to_string())
}
```
