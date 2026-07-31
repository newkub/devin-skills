# Documentation

## หลักการ Documentation

## Documentation Types

### Public API Documentation

Document public functions, types, และ modules:

```rust
/// Adds two numbers together.
///
/// # Arguments
///
/// * `a` - First number
/// * `b` - Second number
///
/// # Returns
///
/// Sum of `a` and `b`
///
/// # Examples
///
/// ```
/// let result = add(2, 3);
/// assert_eq!(result, 5);
/// ```
///
/// # Errors
///
/// This function never errors.
///
/// # Panics
///
/// This function never panics.
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

### Module Documentation

Document modules:

```rust
//! # Authentication Module
//!
//! This module provides authentication functionality
//! including login, logout, and session management.
//!
//! ## Examples
//!
//! ```
//! use my_crate::auth;
//!
//! auth::login("username", "password");
//! ```
```

### Crate Documentation

Document entire crate:

```rust
//! # My Crate
//!
//! This crate provides functionality for...
//!
//! ## Features
//!
//! - Feature 1
//! - Feature 2
//!
//! ## Getting Started
//!
//! Add to Cargo.toml:
//!
//! ```toml
//! [dependencies]
//! my-crate = "0.1.0"
//! ```
```

## Documentation Best Practices

### 1. Document Public APIs

ทุก public function, type, และ module ต้องมี documentation

### 2. ใช้ Examples

ใส่ examples ใน documentation:

```rust
/// # Examples
///
/// ```
/// let result = add(2, 3);
/// assert_eq!(result, 5);
/// ```
```

### 3. Document Errors และ Panics

```rust
/// # Errors
///
/// Returns an error if...
///
/// # Panics
///
/// Panics if...
```

### 4. ใช้ Consistent Format

ใช้ format เดียวกันทั่วทั้ง crate

### 5. Run Doc Tests

```bash
cargo test --doc
```

## Documentation Generation

### Generate Documentation

```bash
cargo doc
cargo doc --no-deps
cargo doc --open
```

### Document All Features

```bash
cargo doc --all-features
```

## Documentation Tools

### cargo-doc

Built-in documentation generator:

```bash
cargo doc
```

### mdBook

Documentation hosting:

```bash
cargo install mdbook
mdbook build
```

## Documentation Structure

### README.md

Project overview และ getting started

### docs/

Detailed documentation:

```
docs/
├── guide/
│   ├── installation.md
│   ├── quick-start.md
│   └── advanced.md
├── api/
│   └── reference.md
└── examples/
    └── usage.md
```

## Documentation Examples

### Function Documentation

```rust
/// Creates a new user.
///
/// # Arguments
///
/// * `name` - User's name
/// * `email` - User's email
///
/// # Returns
///
/// A new `User` instance
///
/// # Examples
///
/// ```
/// use my_crate::User;
///
/// let user = User::new("Alice", "alice@example.com");
/// ```
///
/// # Errors
///
/// Returns an error if the email is invalid.
pub fn new(name: &str, email: &str) -> Result<User, Error> {
    // implementation
}
```

### Struct Documentation

```rust
/// Represents a user in the system.
///
/// # Fields
///
/// * `name` - User's name
/// * `email` - User's email
///
/// # Examples
///
/// ```
/// use my_crate::User;
///
/// let user = User {
///     name: String::from("Alice"),
///     email: String::from("alice@example.com"),
/// };
/// ```
pub struct User {
    pub name: String,
    pub email: String,
}
```

## Documentation Best Practices

### 1. ใช้ Rustdoc Format

```rust
/// Short description
///
/// Longer description
///
/// # Section
///
/// Content
```

### 2. ใส่ Examples ที่ Run ได้

```rust
/// ```
/// let result = add(2, 3);
/// assert_eq!(result, 5);
/// ```
```

### 3. Document Behavior ไม่ใช่ Implementation

อธิบาย "what" และ "why" ไม่ใช่ "how"

### 4. อัปเดต Documentation พร้อม Code

เมื่อเปลี่ยน code ต้องอัปเดต documentation

### 5. Review Documentation

ตรวจสอบ documentation อย่างสม่ำเสมอ
