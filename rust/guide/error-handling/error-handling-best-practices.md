# Error Handling

```rust
// Use Result for recoverable errors
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}

// Use Option for optional values
fn find_user(id: u32) -> Option<User> {
    // return Some(user) or None
}

// Prefer ? operator over match
fn read_config(path: &str) -> Result<Config, Error> {
    let content = fs::read_to_string(path)?;
    let config = parse_config(&content)?;
    Ok(config)
}

// Create custom error types
#[derive(Debug)]
enum MyError {
    NotFound(String),
    InvalidInput(String),
    IoError(std::io::Error),
}

impl std::fmt::Display for MyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MyError::NotFound(s) => write!(f, "Not found: {}", s),
            MyError::InvalidInput(s) => write!(f, "Invalid input: {}", s),
            MyError::IoError(e) => write!(f, "IO error: {}", e),
        }
    }
}
```
