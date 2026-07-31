# Best Practices

## 1. Use Async for I/O

```rust
// File operations
async fn read_file(path: &str) -> Result<String, Error> {
    tokio::fs::read_to_string(path).await.map_err(Into::into)
}

// Network operations
async fn fetch_url(url: &str) -> Result<String, Error> {
    reqwest::get(url).await?.text().await.map_err(Into::into)
}
```

## 2. Handle Timeouts

```rust
async fn with_timeout<T, E>(
    future: impl Future<Output = Result<T, E>>,
    duration: Duration
) -> Result<T, String>
where
    E: std::fmt::Display,
{
    timeout(duration, future)
        .await
        .map_err(|_| "Timeout".to_string())?
        .map_err(|e| e.to_string())
}
```

## 3. Cancel Long Operations

```rust
use tokio_util::sync::CancellationToken;

let token = CancellationToken::new();
let child_token = token.child_token();

// Cancel operation
token.cancel();
```

## 4. Resource Cleanup

```rust
async fn with_cleanup() -> Result<String, Error> {
    let resource = acquire_resource().await?;
    
    scopeguard::guard!(resource, |r| {
        // Cleanup on scope exit
        release_resource(r);
    });
    
    // Use resource
    Ok("Success".to_string())
}
```
