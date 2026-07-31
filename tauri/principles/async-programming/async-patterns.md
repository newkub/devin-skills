# Async Patterns

## 1. Producer-Consumer

```rust
use tokio::sync::mpsc;

#[tauri::command]
async fn producer_consumer() -> Result<(), String> {
    let (tx, mut rx) = mpsc::channel(100);
    
    // Producer
    tokio::spawn(async move {
        for i in 0..10 {
            tx.send(i).await.unwrap();
        }
    });
    
    // Consumer
    while let Some(value) = rx.recv().await {
        println!("Received: {}", value);
    }
    
    Ok(())
}
```

## 2. Worker Pool

```rust
use tokio::sync::Semaphore;

#[tauri::command]
async fn worker_pool() -> Result<(), String> {
    let semaphore = Arc::new(Semaphore::new(4)); // 4 workers
    
    let tasks: Vec<_> = (0..10)
        .map(|i| {
            let semaphore = semaphore.clone();
            tokio::spawn(async move {
                let _permit = semaphore.acquire().await.unwrap();
                // Do work
                i
            })
        })
        .collect();
    
    for task in tasks {
        task.await.map_err(|e| e.to_string())?;
    }
    
    Ok(())
}
```

## 3. Cancellation

```rust
use tokio_util::sync::CancellationToken;

#[tauri::command]
async fn cancellable_task(token: CancellationToken) -> Result<String, String> {
    for i in 0..100 {
        if token.is_cancelled() {
            return Err("Cancelled".to_string());
        }
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
    Ok("Completed".to_string())
}
```
