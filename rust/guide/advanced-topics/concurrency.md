# Concurrency

### Threads

```rust
use std::thread;
use std::time::Duration;

let handle = thread::spawn(|| {
    for i in 1..5 {
        println!("Thread: {}", i);
        thread::sleep(Duration::from_millis(100));
    }
});

handle.join().unwrap();
```

### Message Passing

```rust
use std::sync::mpsc;

let (tx, rx) = mpsc::channel();

thread::spawn(move || {
    tx.send(42).unwrap();
});

let received = rx.recv().unwrap();
println!("Got: {}", received);
```

### Mutex

```rust
use std::sync::Mutex;

let counter = Mutex::new(0);

let mut handles = vec![];
for _ in 0..10 {
    let handle = thread::spawn(move || {
        let mut num = counter.lock().unwrap();
        *num += 1;
    });
    handles.push(handle);
}

for handle in handles {
    handle.join().unwrap();
}

println!("Result: {}", *counter.lock().unwrap());
```
