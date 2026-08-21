---
title: Separation of Concerns Best Practices
description: Best practices สำหรับ Separation of Concerns
---

## Dependency Direction

```
Presentation → Application → Domain ← Infrastructure
```

- ไม่มี dependencies จาก lower layers ไป upper layers
- Domain layer ไม่ขึ้นกับ layers อื่น
- Infrastructure implements interfaces จาก Domain

## Interface Segregation

```rust
// domain/repository.rs
pub trait UserRepository {
    async fn find(&self, id: u32) -> Result<User, Error>;
    async fn save(&self, user: User) -> Result<(), Error>;
}

// infrastructure/sqlite_repository.rs
pub struct SqliteUserRepository {
    // SQLite-specific implementation
}

impl UserRepository for SqliteUserRepository {
    async fn find(&self, id: u32) -> Result<User, Error> {
        // SQLite implementation
    }
    
    async fn save(&self, user: User) -> Result<(), Error> {
        // SQLite implementation
    }
}
```

## Single Responsibility

```rust
// Good: Single responsibility
#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn process_file(content: String) -> Result<String, String> {
    // Process content
    Ok(processed)
}

// Bad: Multiple responsibilities
#[tauri::command]
async fn read_and_process(path: String) -> Result<String, String> {
    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    // Process content
    Ok(processed)
}
```
