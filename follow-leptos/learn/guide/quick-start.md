# Quick Start

สร้าง Leptos app แรกของคุณใน 5 นาที

## 1. Create Project

```bash
cargo generate gh:leptos-rs/leptos-template
cd my-app
```

## 2. Start Development

```bash
cargo leptos watch
```

เปิด http://localhost:3000

## 3. Create Your First Component

```rust
use leptos::*;

#[component]
fn App() -> impl IntoView {
    let (count, set_count) = create_signal(0);
    
    view! {
        <main>
            <p>"Count: " {count}</p>
            <button on:click=move |_| set_count.update(|n| *n += 1)>
                "Click me"
            </button>
        </main>
    }
}
```

## Next Steps

- [Key Concepts](key-concept.md) - เข้าใจ Signals และ Reactivity
- [Best Practices](best-practices.md) - วิธีเขียน code ที่ดี
- [Configuration](configuration.md) - ตั้งค่า Leptos