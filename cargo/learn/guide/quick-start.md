# Quick Start

## เริ่มต้นใช้งาน Cargo อย่างรวดเร็ว

### สร้าง Project ใหม่

```bash
cargo new my-project
cd my-project
```

โครงสร้าง project:

```
my-project/
├── Cargo.toml
└── src/
    └── main.rs
```

### Build Project

```bash
cargo build
```

### Run Project

```bash
cargo run
```

### Check Code

```bash
cargo check
```

### Run Tests

```bash
cargo test
```

## Hello World Example

`src/main.rs`:

```rust
fn main() {
    println!("Hello, world!");
}
```

```bash
cargo run
# Output: Hello, world!
```

## เพิ่ม Dependency

```bash
cargo add serde
```

`Cargo.toml`:

```toml
[dependencies]
serde = "1.0"
```

`src/main.rs`:

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Person {
    name: String,
    age: u8,
}

fn main() {
    let person = Person {
        name: String::from("Alice"),
        age: 30,
    };
    println!("{} is {} years old", person.name, person.age);
}
```

## Build for Release

```bash
cargo build --release
```

Binary จะอยู่ที่ `target/release/my-project`

## Project Types

### Binary Project

```bash
cargo new my-bin --bin
```

### Library Project

```bash
cargo new my-lib --lib
```

`src/lib.rs`:

```rust
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }
}
```

## Common Commands

| Command | Description |
|---------|-------------|
| `cargo new` | สร้าง project ใหม่ |
| `cargo build` | Build project |
| `cargo run` | Build และ run |
| `cargo test` | Run tests |
| `cargo check` | Type check อย่างรวดเร็ว |
| `cargo clean` | ลบ build artifacts |
| `cargo doc` | Generate documentation |

## Development Workflow

```bash
# 1. เริ่ม project
cargo new my-app
cd my-app

# 2. เขียน code
# แก้ไข src/main.rs

# 3. Check อย่างรวดเร็ว
cargo check

# 4. Run tests
cargo test

# 5. Run application
cargo run

# 6. Build release
cargo build --release
```

## Next Steps

- อ่าน [key-concept.md](./key-concept.md) สำหรับแนวคิดหลัก
- อ่าน [features.md](./features.md) สำหรับ features ทั้งหมด
- อ่าน [best-practices.md](./best-practices.md) สำหรับ best practices
