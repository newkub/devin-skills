# IPC Type Safety

## 1. Shared Types

```typescript
// types.ts
export interface UserData {
  id: number
  name: string
  email: string
}

export interface CommandResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

```rust
// types.rs
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct UserData {
    pub id: u32,
    pub name: String,
    pub email: String,
}

#[derive(Serialize, Deserialize)]
pub struct CommandResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}
```

## 2. Type-Safe Commands

```rust
#[tauri::command]
fn typed_command(data: UserData) -> Result<CommandResponse<UserData>, String> {
    Ok(CommandResponse {
        success: true,
        data: Some(data),
        error: None,
    })
}
```

```typescript
const response = await invoke<CommandResponse<UserData>>('typed_command', {
  data: { id: 1, name: 'John', email: 'john@example.com' }
})
```

## 3. Validation with Types

```rust
use validator::Validate;

#[derive(Validate, Serialize, Deserialize)]
struct CreateUser {
    #[validate(length(min = 1, max = 100))]
    name: String,

    #[validate(email)]
    email: String,

    #[validate(range(min = 18, max = 120))]
    age: u8,
}

#[tauri::command]
fn create_user(user: CreateUser) -> Result<User, String> {
    user.validate().map_err(|e| e.to_string())?;
    // Create user
    Ok(User::from(user))
}
```
