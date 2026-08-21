# Common Issues

## 1. Deadlocks

```rust
// Bad: Potential deadlock
let (tx, mut rx) = mpsc::channel(1);
tx.send(1).await?;
let value = rx.recv().await?;

// Good: Use buffer or separate tasks
let (tx, mut rx) = mpsc::channel(100);
tokio::spawn(async move {
    tx.send(1).await.unwrap();
});
let value = rx.recv().await?;
```

## 2. Memory Leaks

```rust
// Bad: Unbounded channels
let (tx, rx) = mpsc::unbounded_channel();

// Good: Bounded channels
let (tx, rx) = mpsc::channel(100);
```

## 3. Race Conditions

```rust
// Bad: Shared state without synchronization
let counter = Arc::new(Mutex::new(0));

// Good: Proper synchronization
let counter = Arc::new(Mutex::new(0));
let mut guard = counter.lock().await;
*guard += 1;
drop(guard);
```
