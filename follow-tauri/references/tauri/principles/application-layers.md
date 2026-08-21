---
title: Application Layers
description: Implementation ของแต่ละ layer ใน Separation of Concerns
---

## Frontend Layer (Presentation)

**Responsibilities**
- UI rendering
- User interactions
- Display data
- Collect user input

**Example**
```vue
<template>
  <div>
    <input v-model="name" placeholder="Enter name" />
    <button @click="greet">Greet</button>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/core'

const name = ref('')
const message = ref('')

async function greet() {
  message.value = await invoke('greet', { name: name.value })
}
</script>
```

## Application Layer (Business Logic)

**Responsibilities**
- Coordinate use cases
- IPC command handlers
- Service orchestration
- Error handling

**Example**
```rust
// commands.rs
use crate::services::greeting_service::GreetingService;

#[tauri::command]
async fn greet(name: String, service: State<GreetingService>) -> Result<String, String> {
    service.generate_greeting(name).await
}
```

```rust
// services/greeting_service.rs
pub struct GreetingService {
    // Dependencies
}

impl GreetingService {
    pub async fn generate_greeting(&self, name: String) -> Result<String, String> {
        // Business logic
        Ok(format!("Hello, {}!", name))
    }
}
```

## Domain Layer (Core Logic)

**Responsibilities**
- Business rules
- Domain entities
- Value objects
- Domain services

**Example**
```rust
// domain/greeting.rs
pub struct Greeting {
    pub message: String,
    pub timestamp: DateTime<Utc>,
}

impl Greeting {
    pub fn new(message: String) -> Self {
        Self {
            message,
            timestamp: Utc::now(),
        }
    }

    pub fn is_valid(&self) -> bool {
        !self.message.is_empty()
    }
}
```

## Infrastructure Layer (External Systems)

**Responsibilities**
- File system operations
- Network calls
- Database access
- External APIs

**Example**
```rust
// infrastructure/file_repository.rs
use std::fs;
use std::path::Path;

pub struct FileRepository;

impl FileRepository {
    pub fn save(&self, path: &Path, content: &str) -> Result<(), std::io::Error> {
        fs::write(path, content)
    }

    pub fn load(&self, path: &Path) -> Result<String, std::io::Error> {
        fs::read_to_string(path)
    }
}
```
