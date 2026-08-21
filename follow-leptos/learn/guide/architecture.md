# Architecture

## Project Structure

```
my-leptos-app/
├── src/
│   ├── lib.rs              # App component & routes
│   ├── main.rs             # Entry point (server)
│   ├── main_web.rs         # Entry point (client/WASM)
│   ├── components/         # Shared components
│   │   ├── mod.rs
│   │   ├── button.rs
│   │   └── card.rs
│   ├── pages/              # Route pages
│   │   ├── mod.rs
│   │   ├── home.rs
│   │   ├── about.rs
│   │   └── blog.rs
│   └── api/                # Server functions
│       ├── mod.rs
│       └── users.rs
├── Cargo.toml
├── leptos.toml
└── index.html
```

## Component Architecture

```rust
// src/lib.rs
use leptos::*;

#[component]
pub fn App() -> impl IntoView {
    provide_context(router());

    view! {
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" view=HomePage />
                    <Route path="/about" view=AboutPage />
                    <Route path="/blog/:slug" view=BlogPostPage />
                </Routes>
            </main>
            <Footer />
        </Router>
    }
}
```

## Server Functions Pattern

```rust
// src/api/users.rs
use leptos::*;

#[server]
pub async fn get_user(id: i32) -> Result<User, ServerFnError> {
    let pool = expect_context::<Pool<Postgres>>();

    sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
        .fetch_optional(pool)
        .await
        .map_err(|e| ServerFnError::new(e.to_string()))?
        .ok_or_else(|| ServerFnError::new("User not found"))
}
```

## State Management Pattern

```rust
// Shared state via context
#[component]
fn AppProvider(children: Children) -> impl IntoView {
    let (user, set_user) = create_signal::<Option<User>>(None);
    let (theme, set_theme) = create_signal(Theme::Light);

    provide_context(user);
    provide_context(set_user);
    provide_context(theme);

    view! { {children()} }
}

// Access in child components
#[component]
fn ProfileButton() -> impl IntoView {
    let user = expect_context::<Signal<Option<User>>>();

    view! {
        <button>
            {move || user.get().map(|u| u.name).unwrap_or("Guest")}
        </button>
    }
}
```

## Routing Pattern

```rust
use leptos_router::*;

#[derive(Route)]
pub struct Routes;

impl Routes {
    #[route("/", priority = 1)]
    pub fn home() -> impl IntoView {
        view! { <HomePage /> }
    }

    #[route("/blog/:slug")]
    pub fn blog(slug: String) -> impl IntoView {
        view! { <BlogPost slug={slug} /> }
    }

    #[route("/admin")]
    pub fn admin() -> impl IntoView {
        view! { <AdminPage /> }
    }
}
```
