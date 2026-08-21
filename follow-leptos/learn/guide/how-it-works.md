# How It Works

## Leptos Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Leptos Reactive System                    │
├─────────────────────────────────────────────────────────────┤
│  Signals ─────► Computeds ─────► Effects                   │
│      │              │                │                      │
│      ▼              ▼                ▼                      │
│   Values        Memos          Side Effects                  │
└─────────────────────────────────────────────────────────────┘
```

## Signal Update Flow

```
1. set_count(5)
       │
       ▼
2. Signal marks dirty
       │
       ▼
3. Subscriber notified
       │
       ▼
4. Effect/Memo recalculates
       │
       ▼
5. DOM nodes updated (fine-grained)
```

## SSR Flow

```
HTTP Request ─► Leptos Router ─► Server Functions ─► HTML Render
                                      │                    │
                                      ▼                    ▼
                               ┌───────────┐         ┌───────────┐
                               │ Stream    │◄────────│  Browser  │
                               │ Response  │         │ Hydrate   │
                               └───────────┘         └───────────┘
```

## Component Lifecycle

```rust
use leptos::*;

#[component]
fn MyComponent() -> impl IntoView {
    // Runs once on mount
    let _ = create_effect(|| {
        log!("Component mounted");
    });

    // Runs on cleanup
    on_cleanup(|| {
        log!("Component unmounted");
    });

    view! { <div>"Hello"</div> }
}
```

## Resource Loading

```rust
use leptos::*;

#[component]
fn DataList() -> impl IntoView {
    let data = create_resource(
        move || page.get(),
        |page| async move { fetch_data(page).await }
    );

    view! {
        <Suspense fallback=|| view! { <p>"Loading..."</p> }>
            {data.get().map(|d| view! { <Items items={d} /> })}
        </Suspense>
    }
}
```