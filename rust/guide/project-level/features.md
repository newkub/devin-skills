---
title: Rust Features
description: Features หลักของภาษา Rust
---

## Features

### Pattern Matching

Rust มี pattern matching ที่ powerful ผ่าน `match` expression:

```rust
match value {
    Pattern1 => expr1,
    Pattern2 => expr2,
    _ => default_expr,
}
```

### Traits

Traits กำหนด shared behavior:

```rust
trait Summary {
    fn summarize(&self) -> String;
}

struct Article {
    title: String,
    content: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{}: {}", self.title, self.content)
    }
}
```

### Generics

Generics ช่วยให้เขียน code ที่ reusable:

```rust
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```

### Error Handling

ใช้ `Result<T, E>` และ `Option<T>` สำหรับ error handling:

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Cannot divide by zero"))
    } else {
        Ok(a / b)
    }
}
```

### Concurrency

Rust มี concurrency primitives ที่ safe:

```rust
use std::thread;
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        tx.send("Hello").unwrap();
    });

    let received = rx.recv().unwrap();
    println!("{}", received);
}
```

### Smart Pointers

Smart pointers ให้ additional functionality:

```rust
// Box<T> - heap allocation
let b = Box::new(5);

// Rc<T> - reference counting
use std::rc::Rc;
let a = Rc::new(5);

// Arc<T> - atomic reference counting
use std::sync::Arc;
let a = Arc::new(5);
```

### Closures

Anonymous functions ที่ capture environment:

```rust
let add_one = |x: i32| x + 1;
let result = add_one(5);
```

### Iterators

Process sequences อย่าง efficient:

```rust
let v = vec![1, 2, 3, 4, 5];
let sum: i32 = v.iter().sum();
```

### Macros

Code generation ที่ compile time:

```rust
macro_rules! say_hello {
    () => {
        println!("Hello!");
    };
}

say_hello!();
```

### Async/Await

Asynchronous programming:

```rust
async fn fetch_data() -> String {
    // async operations
    String::from("data")
}

#[tokio::main]
async fn main() {
    let data = fetch_data().await;
    println!("{}", data);
}
```

### Unsafe

Unsafe operations เมื่อจำเป็น:

```rust
unsafe {
    // unsafe operations
}
```

### Foreign Function Interface (FFI)

Call functions จากภาษาอื่น:

```rust
extern "C" {
    fn abs(input: i32) -> i32;
}
```
