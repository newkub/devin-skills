---
title: Rust Quick Start
description: เริ่มต้นใช้งาน Rust อย่างรวดเร็ว
---

## Quick Start

### Installation

ติดตั้ง Rust ด้วย rustup:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

หรือดูรายละเอียดใน `guide/installation.md`

### Hello World

สร้าง project ใหม่:

```bash
cargo new hello_world
cd hello_world
```

แก้ไข `src/main.rs`:

```rust
fn main() {
    println!("Hello, World!");
}
```

รัน:

```bash
cargo run
```

### Variables and Mutability

```rust
fn main() {
    let x = 5;           // immutable
    let mut y = 10;      // mutable
    y = 15;
    
    println!("x = {}, y = {}", x, y);
}
```

### Functions

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result = add(5, 3);
    println!("5 + 3 = {}", result);
}
```

### Control Flow

```rust
fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }

    // Loop
    let mut counter = 0;
    loop {
        counter += 1;
        if counter == 10 {
            break;
        }
    }

    // While
    let mut number = 3;
    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }

    // For
    for i in 1..=5 {
        println!("i = {}", i);
    }
}
```

### Structs

```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        sign_in_count: 1,
    };

    println!("User: {}", user1.username);
}
```

### Enums

```rust
enum IpAddr {
    V4(String),
    V6(String),
}

fn main() {
    let home = IpAddr::V4(String::from("127.0.0.1"));
    let loopback = IpAddr::V6(String::from("::1"));

    match home {
        IpAddr::V4(addr) => println!("IPv4: {}", addr),
        IpAddr::V6(addr) => println!("IPv6: {}", addr),
    }
}
```

### Error Handling

```rust
use std::fs::File;

fn main() {
    let file = File::open("test.txt");

    let file = match file {
        Ok(file) => file,
        Err(error) => {
            eprintln!("Error opening file: {}", error);
            return;
        }
    };

    // Or use ?
    let file = File::open("test.txt").expect("Failed to open file");
}
```

### Collections

```rust
fn main() {
    // Vector
    let mut v = vec![1, 2, 3];
    v.push(4);
    println!("{:?}", v);

    // String
    let s = String::from("hello");
    let s2 = s + " world";
    println!("{}", s2);

    // HashMap
    use std::collections::HashMap;
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
    println!("{:?}", scores);
}
```

### Next Steps

- อ่าน `guide/overview.md` สำหรับภาพรวม
- อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
- อ่าน `key-concepts/ownership.md` สำหรับ ownership system
- อ่าน `guide/features.md` สำหรับ features ขั้นสูง
