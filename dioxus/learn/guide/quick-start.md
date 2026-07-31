# Quick Start

สร้าง Dioxus app แรกของคุณใน 5 นาที

## 1. Create Project

```bash
cargo install dioxus-cli
cargo new my-app --name my_app
cd my-app
dx init --platform web
```

## 2. Start Development

```bash
dx serve --platform web
```

เปิด http://localhost:8080

## 3. Write Your First Component

```rust
// src/main.rs (lib.rs)
use dioxus::prelude::*;

fn App() -> Element {
    let mut count = use_signal(|| 0);
    
    rsx! {
        div {
            h1 { "Counter: {count}" }
            button {
                onclick: move |_| count += 1,
                "Click me"
            }
        }
    }
}
```

## 4. Run with Hot Reload

```bash
dx serve --hot-reload --platform web
```

## Next Steps

- [Key Concepts](key-concept.md) - เข้าใจ Components และ Signals
- [Best Practices](best-practices.md) - วิธีเขียน code ที่ดี
- [Configuration](configuration.md) - ตั้งค่า Dioxus