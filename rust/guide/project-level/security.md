---
title: Rust Security
description: ความปลอดภัยในการพัฒนา Rust
---

## Security Features

### Memory Safety

Rust ป้องกัน memory vulnerabilities ทั่วไป:

- **Buffer Overflows** - bounds checking บน arrays และ slices
- **Null Pointer Dereferences** - ไม่มี null pointers
- **Dangling Pointers** - borrow checker ป้องกัน
- **Use-after-free** - ownership system ป้องกัน
- **Double Free** - ownership system ป้องกัน

### Type Safety

- **Strong Static Typing** - type errors ที่ compile time
- **No Undefined Behavior** - well-defined semantics
- **Safe Abstractions** - unsafe code ถูก isolated

### Concurrency Safety

- **No Data Races** - borrow checker ป้องกัน
- **Thread Safety** - `Send` และ `Sync` traits
- **Memory Ordering** - atomic operations ที่ safe

## Secure Coding Practices

### Input Validation

```rust
fn parse_input(input: &str) -> Result<u32, ParseError> {
    let num: u32 = input.parse()
        .map_err(|_| ParseError::InvalidNumber)?;
    
    if num > 1000 {
        return Err(ParseError::OutOfRange);
    }
    
    Ok(num)
}
```

### Error Handling

```rust
// Always handle errors
fn read_config(path: &Path) -> Result<Config, IoError> {
    let content = fs::read_to_string(path)?;
    let config: Config = serde_json::from_str(&content)?;
    Ok(config)
}
```

### Avoid Unwrap

```rust
// Bad: can panic
let value = some_option.unwrap();

// Good: handle explicitly
let value = some_option.ok_or(Error::MissingValue)?;
```

### Use Safe APIs

```rust
// Prefer safe APIs over unsafe
let mut vec = Vec::with_capacity(100);
vec.push(value);  // Safe

// Avoid unsafe unless necessary
unsafe {
    // Only when absolutely needed
}
```

## Security Auditing

### Tools

- **cargo-audit** - check for vulnerable dependencies
- **cargo-deny** - lint dependencies
- **cargo-bans** - check for banned licenses

```bash
cargo install cargo-audit
cargo audit
```

### Dependency Management

```toml
[dependencies]
# Pin specific versions
serde = "=1.0.150"

# Use cargo-deny
[workspace.metadata.cargo-deny]
advisories = { db-path = "~/.cargo/advisory-db" }
```

## Common Vulnerabilities

### Integer Overflow

```rust
// Rust checks for overflow in debug mode
let x: u32 = u32::MAX;
let y = x + 1;  // Panics in debug, wraps in release

// Use checked arithmetic
let y = x.checked_add(1).ok_or(Error::Overflow)?;
```

### Untrusted Input

```rust
// Validate input before processing
fn process_input(input: &str) -> Result<()> {
    if input.len() > MAX_LENGTH {
        return Err(Error::InputTooLong);
    }
    
    // Process safely
    Ok(())
}
```

### Secret Management

```rust
// Use zeroize for secrets
use zeroize::Zeroize;

struct Secret {
    data: Vec<u8>,
}

impl Drop for Secret {
    fn drop(&mut self) {
        self.data.zeroize();
    }
}
```
