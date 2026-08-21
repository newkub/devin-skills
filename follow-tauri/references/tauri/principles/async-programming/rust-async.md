# Rust Async

## 1. Async Functions

```rust
async fn fetch_data() -> Result<String, Error> {
    // Async operation
    Ok("Data".to_string())
}
```

## 2. Async Await

```rust
#[tauri::command]
async fn process_data() -> Result<String, String> {
    let data = fetch_data().await.map_err(|e| e.to_string())?;
    Ok(data)
}
```

## 3. Spawn Tasks

```rust
use tokio::task;

#[tauri::command]
async fn background_task() -> Result<String, String> {
    task::spawn(async move {
        // Background work
        "Completed".to_string()
    }).await.map_err(|e| e.to_string())
}
```

## 4. Concurrent Operations

```rust
async fn fetch_multiple() -> Result<Vec<String>, Error> {
    let (a, b, c) = tokio::join!(
        fetch_data_a(),
        fetch_data_b(),
        fetch_data_c()
    );
    
    Ok(vec![a?, b?, c?])
}
```

## 5. Timeout Handling

```rust
use tokio::time::{timeout, Duration};

async fn with_timeout() -> Result<String, String> {
    match timeout(Duration::from_secs(5), fetch_data()).await {
        Ok(result) => result.map_err(|e| e.to_string()),
        Err(_) => Err("Timeout".to_string()),
    }
}
```
