# Concurrency Principles

## Goal

ใช้ concurrency ใน Rust อย่างปลอดภัยและมีประสิทธิภาพ

## Core Principles

### 1. Fearless Concurrency

- **Compile-Time Safety** - compiler ป้องกัน data races
- **Message Passing** - ใช้ channels สำหรับ communication
- **Shared State** - ใช้ synchronization primitives อย่างถูกต้อง

### 2. Thread Safety

- **Send and Sync** - ใช้ traits เพื่อรับประกัน thread safety
- **Arc for Sharing** - ใช้ `Arc<T>` สำหรับ shared ownership ข้าม threads
- **Mutex for Exclusion** - ใช้ `Mutex<T>` สำหรับ exclusive access

### 3. Async Programming

- **Futures** - ใช้ async/await สำหรับ asynchronous operations
- **Runtimes** - ใช้ tokio หรือ async-std สำหรับ execution
- **Cancellation** - handle cancellation อย่างถูกต้อง

## Best Practices

### Use Channels for Communication

```rust
// ✅ Good: Message passing with channels
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    std::thread::spawn(move || {
        tx.send(42).unwrap();
    });
    
    let received = rx.recv().unwrap();
    println!("Received: {}", received);
}
```

### Use Arc for Shared Data

```rust
// ✅ Good: Shared ownership with Arc
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let data = Arc::new(Mutex::new(vec![1, 2, 3]));
    let mut handles = vec![];
    
    for i in 0..3 {
        let data = Arc::clone(&data);
        let handle = thread::spawn(move || {
            let mut data = data.lock().unwrap();
            data.push(i);
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap();
    }
    
    println!("{:?}", *data.lock().unwrap());
}
```

### Use Async/Await

```rust
// ✅ Good: Async with tokio
use tokio::time::{sleep, Duration};

async fn fetch_data() -> String {
    sleep(Duration::from_secs(1)).await;
    "data".to_string()
}

#[tokio::main]
async fn main() {
    let data = fetch_data().await;
    println!("{}", data);
}
```

## Common Pitfalls

### 1. Data Races

```rust
// ❌ Bad: Data race (compile error prevented)
use std::thread;

fn bad() {
    let mut data = vec![1, 2, 3];
    let handle = thread::spawn(|| {
        data.push(4);  // Error: data may be invalid
    });
    data.push(5);
    handle.join().unwrap();
}
```

### 2. Deadlocks

```rust
// ❌ Bad: Potential deadlock
use std::sync::Mutex;

fn bad() {
    let mutex1 = Mutex::new(1);
    let mutex2 = Mutex::new(2);
    
    let _lock1 = mutex1.lock().unwrap();
    let _lock2 = mutex2.lock().unwrap();
    // If another thread locks in reverse order, deadlock occurs
}
```

### 3. Blocking Async Code

```rust
// ❌ Bad: Blocking in async context
async fn bad() {
    std::thread::sleep(std::time::Duration::from_secs(1));  // Blocks thread
}

// ✅ Good: Non-blocking async
async fn good() {
    tokio::time::sleep(std::time::Duration::from_secs(1)).await;
}
```

## Expected Outcome

- Concurrency ที่ปลอดภัยจาก data races
- Performance ที่ดีขึ้นด้วย parallel execution
- Code ที่ maintainable และ debug ง่าย
- ไม่มี deadlocks และ race conditions
- Async operations ที่ efficient
