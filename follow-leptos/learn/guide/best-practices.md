# Best Practices

## Project Structure

```
my-leptos-app/
├── src/
│   ├── lib.rs           # App component
│   ├── main.rs          # Entry point
│   ├── components/      # Shared components
│   ├── pages/           # Route pages
│   └── api/             # Server functions
├── Cargo.toml
└── leptos.toml
```

## Signal Best Practices

### Use Derive for Complex State

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserState {
    pub user: Option<User>,
    pub is_loading: bool,
}

#[component]
fn UserProfile() -> impl IntoView {
    let (state, set_state) = create_signal(UserState {
        user: None,
        is_loading: false,
    });
}
```

## Component Patterns

### Extract Reusable Logic

```rust
// components/use_counter.rs
pub fn use_counter(initial: i32) -> (Signal<i32>, Callback<()>) {
    let (count, set_count) = create_signal(initial);
    let increment = move || set_count.update(|n| *n += 1);
    (count, increment)
}

// In component
#[component]
fn Counter() -> impl IntoView {
    let (count, increment) = use_counter(0);
    view! { <button on:click=increment>{count}</button> }
}
```

## Performance

### Use Key for List Items

```rust
view! {
    <For each={items}>
        {(item) => {
            let id = item.id;
            view! { <li key={id}>{item.name}</li> }
        }}
    </For>
}
```

## Error Handling

### Use Result Types

```rust
#[server]
async fn fetch_user(id: i32) -> Result<User, ServerFnError> {
    db.users.find(id)
        .await
        .map_err(|e| ServerFnError::new(format!("DB error: {}", e)))
}
```

## Testing

### Unit Test Signals

```rust
#[test]
fn test_signal_increment() {
    assert_eq!(count(), 0);
    increment();
    assert_eq!(count(), 1);
}
```
