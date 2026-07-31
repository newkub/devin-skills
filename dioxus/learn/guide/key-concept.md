# Key Concept

## What is Dioxus?

Rust framework สำหรับสร้าง cross-platform GUI รองรับ web, desktop, mobile และ liveview ด้วย React-like syntax

## Core Concepts

### Components

```rust
use dioxus::prelude::*;

fn App() -> Element {
    let mut count = use_signal(|| 0);
    
    rsx! {
        div {
            h1 { "Count: {count}" }
            button { onclick: move |_| count += 1, "Increment" }
        }
    }
}
```

### Signals

```rust
use dioxus::prelude::*;

fn Counter() -> Element {
    let mut count = use_signal(|| 0);
    
    rsx! {
        button { onclick: move |_| count += 1, "{count}" }
    }
}
```

### Props

```rust
use dioxus::prelude::*;

#[component]
fn Button(title: String) -> Element {
    rsx! {
        button { "{title}" }
    }
}

// Usage
rsx! { Button { title: "Click me".to_string() } }
```

### Lifecycle

```rust
use dioxus::prelude::*;

fn MyComponent() -> Element {
    use_effect(move || {
        // Runs on mount
        println!("Mounted!");
        
        || {
            // Cleanup on unmount
            println!("Unmounted!");
        }
    });
    
    rsx! { div { "Hello" } }
}
```

## When to Use

- ต้องการ share code ระหว่าง web และ desktop
- ชอบ React-like syntax ใน Rust
- ต้องการ performance สูง
- ต้องการ SSR สำหรับ web