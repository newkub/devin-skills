# Architecture

## Project Structure

```
my-dioxus-app/
├── src/
│   ├── lib.rs                  # Main app (export components)
│   ├── main.rs                 # Entry points
│   ├── main_web.rs             # Web entry
│   ├── main_desktop.rs         # Desktop entry
│   ├── main_mobile.rs          # Mobile entry
│   ├── components/             # Shared components
│   │   ├── mod.rs
│   │   ├── button.rs
│   │   ├── card.rs
│   │   └── layout.rs
│   ├── pages/                  # Route pages
│   │   ├── mod.rs
│   │   ├── home.rs
│   │   ├── about.rs
│   │   └── blog.rs
│   ├── state/                  # State management
│   │   ├── mod.rs
│   │   └── app_state.rs
│   └── utils/                  # Utilities
│       ├── mod.rs
│       └── api.rs
├── public/                     # Static assets
├── dioxus.toml                 # Dioxus config
└── Cargo.toml
```

## Component Architecture

```rust
// src/lib.rs
use dioxus::prelude::*;
use dioxus_router::prelude::*;

pub fn App() -> Element {
    rsx! {
        Router {
            NavBar {},
            main { Routes {} }
            Footer {}
        }
    }
}

// src/components/nav_bar.rs
#[component]
pub fn NavBar() -> Element {
    rsx! {
        nav { class: "navbar",
            Link { to: "/", "Home" }
            Link { to: "/about", "About" }
        }
    }
}
```

## State Architecture

```rust
// src/state/app_state.rs
#[derive(Default, Clone)]
pub struct AppState {
    pub user: Option<User>,
    pub theme: Theme,
    pub notifications: Vec<Notification>,
}

impl AppState {
    pub fn set_user(&mut self, user: Option<User>) {
        self.user = user;
    }
}

// Usage in component
#[component]
fn UserProfile() -> Element {
    let state = use_context::<Signal<AppState>>();
    
    match state.read().user {
        Some(user) => rsx! { div { "Hello, {user.name}" } },
        None => rsx! { Link { to: "/login", "Login" } },
    }
}
```

## Platform Entry Points

```rust
// src/main_web.rs (WASM)
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    dioxus_web::launch(App);
}
```

```rust
// src/main_desktop.rs
fn main() {
    dioxus_desktop::launch(App);
}
```

```rust
// src/main_mobile.rs (iOS/Android)
fn main() {
    dioxus_mobile::launch(App);
}
```

## Routing Pattern

```rust
use dioxus_router::prelude::*;

#[derive(Routable)]
enum Routes {
    #[layout(NavBar)]
    #[route("/")]
    Home,
    
    #[route("/blog/:slug")]
    BlogPost { slug: String },
    
    #[layout(Footer)]
    #[route("/about")]
    About,
}

#[component]
fn BlogPost(slug: String) -> Element {
    rsx! {
        article {
            h1 { "{slug}" }
            "Blog post content..."
        }
    }
}
```