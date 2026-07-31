# How It Works

## Dioxus Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Dioxus Renderer                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Reactive System                          │   │
│  │                                                       │   │
│  │   Signals ─────► Components ─────► Virtual DOM        │   │
│  │      │                │                │              │   │
│  │      ▼                ▼                ▼              │   │
│  │   Reactive         Render         Diff & Update        │   │
│  │   Graph            Tree           (Platform-specific)  │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Platform Backends                         │   │
│  │                                                       │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │   │
│  │   │   Web   │  │Desktop  │  │ Mobile  │  │ SSR    │ │   │
│  │   │  WASM   │  │ Tauri   │  │  Dioxus │  │  Axum   │ │   │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘ │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Rendering Flow

```
Component Tree (RSX)
       │
       ▼
  Virtual DOM
       │
       ▼
┌──────────────┐
│  Diff Engine  │ (Calculate changes)
└──────────────┘
       │
       ▼
  Platform API
       │
       ├──► Web (WASM/DOM)
       ├──► Desktop (Tauri/wry)
       └──► Mobile (iOS/Android)
```

## Signal Update Flow

```
User Event (click, input)
       │
       ▼
  Signal Update
       │
       ▼
  Mark Dirty
       │
       ▼
  Notify Subscribers
       │
       ▼
  Re-render Components
       │
       ▼
  Diff Virtual DOM
       │
       ▼
  Update Platform UI
```

## Component Lifecycle

```rust
use dioxus::prelude::*;

fn LifecycleExample() -> Element {
    // 1. Mount phase
    use_effect(move || {
        println!("Component mounted!");
        
        // 2. Cleanup function
        || println!("Component unmounted!")
    });
    
    // 3. Update phase (on prop/context change)
    
    rsx! { div { "Hello" } }
}
```

## Server-Side Rendering

```rust
// Server entry point
#[tokio::main]
async fn main() {
    let mut apps = LiveviewPool::new();
    
    let addr = "0.0.0.0:8080";
    println!("Listening on {}", addr);
    
    axum::Server::bind(&addr.parse().unwrap())
        .serve(
            axum::body::body_to_bytes,
            |body| async move {
                let bytes = axum::body::to_bytes(body, 1_000_000).await?;
                let string = String::from_utf8(bytes.to_vec())?;
                
                let content = dioxus::ssr::render_vnode(
                    &rsx! { App {} }
                );
                
                Ok(format!(r#"
                    <!DOCTYPE html>
                    <html>
                    <head><title>Dioxus SSR</title></head>
                    <body>
                        <div id="main">{}</div>
                    </body>
                    </html>
                "#, content))
            },
        )
        .await
        .unwrap();
}
```