# Features

Features และ capabilities ของ Dioxus

## Routing

```rust
use dioxus_router::prelude::*;

#[component]
fn App() -> Element {
    rsx! {
        Router {
            Route { to: "/", HomePage }
            Route { to: "/blog/:id", BlogPost }
        }
    }
}
```

## Global State

```rust
use dioxus::prelude::*;

static APP_STATE: GlobalState<Signal<AppData>> = GlobalState::new(AppData::default());

#[component]
fn MyComponent() -> Element {
    let state = APP_STATE.read();
    rsx! { div { "{state.name}" } }
}
```

## Event Handling

```rust
fn EventExample() -> Element {
    let mut value = use_signal(|| String::new());
    
    rsx! {
        input {
            oninput: move |evt| value.set(evt.value().to_string()),
            value: "{value}"
        }
        button {
            onclick: move |_| println!("Clicked!"),
            "Click me"
        }
    }
}
```

## Async Data

```rust
use dioxus::prelude::*;

#[component]
fn AsyncData() -> Element {
    let mut data = use_resource(|| async { fetch_data().await });
    
    match data.read().as_ref() {
        Some(Ok(items)) => rsx! {
            for item in items {
                div { key: "{item.id}", "{item.name}" }
            }
        },
        Some(Err(_)) => rsx! { "Error loading data" },
        None => rsx! { "Loading..." },
    }
}
```

## CSS Styling

```rust
use dioxus::prelude::*;

fn StyledButton() -> Element {
    rsx! {
        button {
            style: "padding: 8px 16px; background: blue; color: white;",
            "Click me"
        }
    }
}
```

## Interpolation

```rust
fn Interpolate() -> Element {
    let name = "World";
    let count = 42;
    let items = vec!["a", "b", "c"];
    
    rsx! {
        div {
            "Hello {name}!"          // String
            "Count: {count}"         // Number
            for item in items {      // For loops
                span { key: "{item}", "{item}" }
            }
        }
    }
}
```