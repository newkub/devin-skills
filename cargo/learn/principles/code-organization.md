# Code Organization

## หลักการจัดระเบียบ Code

## Module Organization

### Flat Structure

```
src/
├── main.rs
├── utils.rs
├── models.rs
└── api.rs
```

ใช้สำหรับ projects เล็ก

### Nested Structure

```
src/
├── main.rs
├── lib.rs
├── utils/
│   ├── mod.rs
│   ├── string.rs
│   └── file.rs
├── models/
│   ├── mod.rs
│   ├── user.rs
│   └── post.rs
└── api/
    ├── mod.rs
    ├── client.rs
    └── server.rs
```

ใช้สำหรับ projects ขนาดกลาง-ใหญ่

## Module Principles

### 1. Single Responsibility

แต่ละ module ควรมี responsibility เดียว

```rust
// src/utils/string.rs
pub fn trim(s: &str) -> String {
    s.trim().to_string()
}

// src/utils/file.rs
pub fn read_file(path: &str) -> Result<String, io::Error> {
    fs::read_to_string(path)
}
```

### 2. Clear Naming

ตั้งชื่อ modules ให้ชัดเจน

```rust
// ดี
pub mod string_utils;
pub mod file_operations;

// หลีกเลี่ยง
pub mod utils1;
pub mod helpers2;
```

### 3. Logical Grouping

จัดกลุ่ม functions ที่เกี่ยวข้อง

```rust
pub mod auth {
    pub fn login() {}
    pub fn logout() {}
}

pub mod database {
    pub fn connect() {}
    pub fn query() {}
}
```

## File Organization

### Module per File

```
src/
├── mod.rs
├── auth.rs
├── database.rs
└── api.rs
```

### Module per Directory

```
src/
├── mod.rs
├── auth/
│   ├── mod.rs
│   ├── login.rs
│   └── logout.rs
├── database/
│   ├── mod.rs
│   └── query.rs
└── api/
    ├── mod.rs
    └── client.rs
```

## Visibility

### Public

```rust
pub fn public_function() {}
```

### Private

```rust
fn private_function() {}
```

### Crate

```rust
pub(crate) fn crate_function() {}
```

### Super

```rust
pub(super) fn super_function() {}
```

## Re-exports

### Simple Re-export

```rust
pub use crate::auth::login;
```

### Re-export with Rename

```rust
pub use crate::auth::login as auth_login;
```

### Re-export Module

```rust
pub mod auth;
pub use auth::*;
```

## Code Organization Best Practices

### 1. ใช้ Module System อย่างมีประสิทธิภาพ

```rust
// src/lib.rs
pub mod utils;
pub mod models;
pub mod api;

// src/utils/mod.rs
pub mod string;
pub mod file;
```

### 2. จัดระเบียบตาม Domain

```
src/
├── auth/      # Authentication
├── database/  # Database operations
├── api/       # API layer
└── models/    # Data models
```

### 3. ใช้ Re-exports สำหรับ Public APIs

```rust
// src/lib.rs
pub use crate::models::User;
pub use crate::api::Client;
```

### 4. จำกัด Visibility

```rust
// Private โดย default
fn internal_helper() {}

// Public เฉพาะที่จำเป็น
pub fn public_api() {}
```

### 5. ใช้ Consistent Naming

```rust
// Functions: snake_case
pub fn get_user() {}

// Types: PascalCase
pub struct UserData {}

// Constants: SCREAMING_SNAKE_CASE
pub const MAX_SIZE: usize = 100;
```

## Workspace Organization

### Monorepo Structure

```
workspace/
├── Cargo.toml
├── crates/
│   ├── core/      # Core logic
│   ├── api/       # API layer
│   ├── cli/       # CLI interface
│   └── utils/     # Shared utilities
```

### Layered Architecture

```
workspace/
├── crates/
│   ├── domain/    # Domain logic
│   ├── application/ # Application logic
│   ├── infrastructure/ # Infrastructure
│   └── interfaces/ # Interfaces
```

## File Size Guidelines

### แต่ละไฟล์ไม่เกิน 250 บรรทัด

แบ่งไฟล์ขนาดใหญ่:

```rust
// src/models/user.rs
pub struct User {}
pub struct UserBuilder {}

// src/models/post.rs
pub struct Post {}
pub struct PostBuilder {}
```

### ใช้ sub-modules สำหรับ logic ที่ซับซ้อน

```rust
// src/auth/mod.rs
pub mod login;
pub mod logout;
pub mod session;
```
