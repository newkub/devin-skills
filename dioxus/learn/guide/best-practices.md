# Best Practices

## Project Structure

```
my-dioxus-app/
├── src/
│   ├── lib.rs              # Main app component
│   ├── main.rs             # Entry point
│   ├── components/         # Shared components
│   │   ├── mod.rs
│   │   ├── button.rs
│   │   └── card.rs
│   ├── pages/             # Route pages
│   │   ├── mod.rs
│   │   ├── home.rs
│   │   └── blog.rs
│   └── state/              # Global state
│       ├── mod.rs
│       └── app_state.rs
├── dioxus.toml
├── Cargo.toml
└── public/
    └── style.css
```

## Component Patterns

### Extract Reusable Components

```rust
// components/button.rs
#[component]
pub fn Button(
    onclick: EventHandler<MouseEvent>,
    children: Element,
) -> Element {
    rsx! {
        button {
            onclick: move |evt| onclick.call(evt),
            class: "px-4 py-2 bg-blue-500 text-white rounded",
            {children}
        }
    }
}
```

### Use Props with Default

```rust
#[derive(Props, PartialEq)]
struct CardProps {
    #[props(default = "Card Title".to_string())]
    title: String,
    
    #[props(default = false)]
    highlighted: bool,
}

#[component]
fn Card(props: CardProps) -> Element {
    rsx! {
        div {
            class: if props.highlighted { "card highlighted" } else { "card" },
            h2 { "{props.title}" }
        }
    }
}
```

## State Management

### Local State with Signals

```rust
#[component]
fn Counter() -> Element {
    let mut count = use_signal(|| 0);
    
    rsx! {
        div {
            button { onclick: move |_| count -= 1, "-" }
            "{count}"
            button { onclick: move |_| count += 1, "+" }
        }
    }
}
```

### Shared State with Context

```rust
// Provide at root
fn App() -> Element {
    let state = use_state(|| AppState::default());
    provide_context(state);
    
    rsx! { Router { Route { to: "/", Dashboard } } }
}

// Use in child
#[component]
fn Dashboard() -> Element {
    let state = use_context::<UseState<AppState>>();
    
    rsx! { div { "User: {state.user.name}" } }
}
```

## Performance

### Avoid Anonymous Closures in Hot Paths

```rust
// ❌ Bad - creates new closure each render
button { onclick: |_| { /* handler */ }, "Click" }

// ✅ Good - stable handler
let handler = move |_| { /* handler */ };
button { onclick: handler, "Click" }
```

### Use Keys in Lists

```rust
rsx! {
    ul {
        for item in items {
            li { key: "{item.id}", "{item.name}" }
        }
    }
}
```

## Error Handling

### Handle Async Errors

```rust
#[component]
fn AsyncData() -> Element {
    let mut data = use_resource(|| async {
        let result = fetch_data().await;
        result?
    });
    
    match data.read().as_ref() {
        Some(Ok(items)) => rsx! {
            for item in items { div { key: "{item.id}", "{item.name}" } }
        },
        Some(Err(e)) => rsx! { div { "Error: {e}" } },
        None => rsx! { div { "Loading..." } },
    }
}
```

## Testing

### Unit Tests

```rust
#[cfg(test)]
mod tests {
    use dioxus::prelude::*;
    
    #[test]
    fn test_signal_update() {
        let mut vdom = VirtualDom::new(|| rsx! { div { "test" } });
        vdom.rebuild();
        assert_eq!(vdom.lazy_evaluation_arena()[0].root_ids().len(), 1);
    }
}
```