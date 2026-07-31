---
title: Separation of Concerns Example
description: ตัวอย่างการใช้ Separation of Concerns แบบสมบูรณ์
---

```rust
// Domain Layer
pub struct User {
    pub id: u32,
    pub name: String,
}

pub trait UserRepository {
    async fn find(&self, id: u32) -> Result<User, Error>;
    async fn save(&self, user: User) -> Result<(), Error>;
}

// Application Layer
pub struct UserService<R: UserRepository> {
    repo: R,
}

impl<R: UserRepository> UserService<R> {
    pub fn new(repo: R) -> Self {
        Self { repo }
    }
    
    pub async fn get_user(&self, id: u32) -> Result<User, Error> {
        self.repo.find(id).await
    }
}

// Infrastructure Layer
pub struct SqliteUserRepository {
    // SQLite implementation
}

impl UserRepository for SqliteUserRepository {
    async fn find(&self, id: u32) -> Result<User, Error> {
        // SQLite implementation
    }
    
    async fn save(&self, user: User) -> Result<(), Error> {
        // SQLite implementation
    }
}

// IPC Layer
#[tauri::command]
async fn get_user(id: u32, service: State<UserService<SqliteUserRepository>>) -> Result<User, String> {
    service.get_user(id).await.map_err(|e| e.to_string())
}
```
