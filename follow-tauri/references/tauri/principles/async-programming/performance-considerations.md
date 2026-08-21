# Performance Considerations

## 1. Avoid Blocking

```rust
// Bad: Blocking
#[tauri::command]
fn blocking_operation() -> String {
    std::thread::sleep(Duration::from_secs(5));
    "Done".to_string()
}

// Good: Async
#[tauri::command]
async fn async_operation() -> String {
    tokio::time::sleep(Duration::from_secs(5)).await;
    "Done".to_string()
}
```

## 2. Use Async I/O

```rust
// Bad: Blocking I/O
let content = fs::read_to_string("file.txt")?;

// Good: Async I/O
let content = tokio::fs::read_to_string("file.txt").await?;
```

## 3. Batch Operations

```rust
// Bad: Sequential
for item in items {
    process(item).await?;
}

// Good: Parallel
let results = futures::future::join_all(
    items.into_iter().map(|item| process(item))
).await?;
```
