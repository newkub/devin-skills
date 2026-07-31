# Rust Type Safety

## 1. Strong Typing

```rust
// Good: Explicit types
fn process_user(id: u32, name: String, age: u8) -> Result<User, Error> {
    // ...
}

// Bad: Ambiguous types
fn process_user(id, name, age) {
    // ...
}
```

## 2. Enum for State

```rust
enum AppState {
    Loading,
    Ready { data: Data },
    Error { message: String },
}

fn handle_state(state: AppState) {
    match state {
        AppState::Loading => println!("Loading..."),
        AppState::Ready { data } => println!("Ready: {:?}", data),
        AppState::Error { message } => println!("Error: {}", message),
    }
}
```

## 3. Result for Error Handling

```rust
fn read_file(path: &str) -> Result<String, std::io::Error> {
    fs::read_to_string(path)
}

// Usage
match read_file("data.txt") {
    Ok(content) => println!("{}", content),
    Err(e) => eprintln!("Error: {}", e),
}
```

## 4. Option for Nullable Values

```rust
fn find_user(id: u32) -> Option<User> {
    // Returns Some(user) or None
}

// Usage
if let Some(user) = find_user(1) {
    println!("Found: {}", user.name);
} else {
    println!("Not found");
}
```
