# Error Handling Principles

## Goal

ใช้ error handling ใน Rust อย่างถูกต้องและปลอดภัย

## Core Principles

### 1. Explicit Error Handling

- **No Silent Failures** - ทุก error ต้องถูก handle อย่างชัดเจน
- **Type Safety** - ใช้ `Result<T, E>` และ `Option<T>` แทน null
- **Compile-Time Checks** - compiler บังคับให้ handle errors

### 2. Error Propagation

- **Use `?` Operator** - Propagate errors อย่างกระชับ
- **Custom Error Types** - สร้าง error types ที่เฉพาะเจาะจง
- **Context Preservation** - เก็บ context ของ errors

### 3. Error Recovery

- **Graceful Degradation** - handle errors อย่างสุภาพ
- **Fallback Strategies** - มี backup plans
- **User Communication** - แจ้ง errors ให้ผู้ใช้เข้าใจ

## Best Practices

### Use Result for Recoverable Errors

```rust
// ✅ Good: Use Result for operations that can fail
fn read_file(path: &str) -> Result<String, std::io::Error> {
    std::fs::read_to_string(path)
}
```

### Use Option for Optional Values

```rust
// ✅ Good: Use Option for values that may not exist
fn find_user(id: u32) -> Option<User> {
    users.get(&id).cloned()
}
```

### Use ? Operator for Propagation

```rust
// ✅ Good: Clean error propagation
fn process_file(path: &str) -> Result<usize, std::io::Error> {
    let content = std::fs::read_to_string(path)?;
    let count = content.lines().count();
    Ok(count)
}
```

### Create Custom Error Types

```rust
// ✅ Good: Custom error type with context
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Parse error: {0}")]
    Parse(String),
    
    #[error("Not found: {0}")]
    NotFound(String),
}
```

## Common Pitfalls

### 1. Ignoring Errors

```rust
// ❌ Bad: Ignoring error
let _ = std::fs::read_to_string("file.txt");

// ✅ Good: Handle error
let content = std::fs::read_to_string("file.txt")?;
```

### 2. Using unwrap() in Production

```rust
// ❌ Bad: unwrap() in production code
let value = some_option.unwrap();

// ✅ Good: Handle properly
let value = some_option.ok_or_else(|| AppError::NotFound("value".to_string()))?;
```

### 3. Vague Error Messages

```rust
// ❌ Bad: Vague error
Err("error occurred".to_string())

// ✅ Good: Specific error with context
Err(AppError::Io(std::io::Error::new(
    std::io::ErrorKind::NotFound,
    format!("Config file not found: {}", path)
)))
```

## Expected Outcome

- Errors ที่ handle อย่างถูกต้องทั้งหมด
- Error messages ที่ชัดเจนและมีประโยชน์
- Code ที่ robust และ maintainable
- ไม่มี silent failures
- Error recovery ที่เหมาะสม
