# Integration

## Database

### SQLx

```toml
[dependencies]
sqlx = { version = "0.7", features = ["runtime-tokio", "postgres", "macros"] }
```

```rust
use sqlx::PgPool;

#[server]
pub async fn get_users(pool: Data<PgPool>) -> Result<Vec<User>, ServerFnError> {
    sqlx::query_as!(User, "SELECT * FROM users")
        .fetch_all(pool.get_ref())
        .await
        .map_err(|e| ServerFnError::new(e.to_string()))
}
```

## Authentication

### Auth with Session

```rust
#[server]
pub async fn login(
    data: Data<SessionPgPool>,
    username: String,
    password: String,
) -> Result<(), ServerFnError> {
    if verify_credentials(&username, &password).await? {
        let session = data.session();
        session.insert("user_id", user.id).ok();
        Ok(())
    } else {
        Err(ServerFnError::new("Invalid credentials"))
    }
}
```

## Testing

### WASM Tests

```rust
#[wasm_bindgen_test]
fn test_signal_update() {
    let (value, set_value) = create_signal(0);
    set_value(5);
    assert_eq!(value.get(), 5);
}
```

## Deployment

### Server Setup (Axum)

```rust
use axum::{Router, routing::get};
use leptos_axum::{generate_route_list, LeptosRoutes};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .leptos_routes(&executor, routes, |cx| view! { <App /> })
        .fallback(file_and_error_handler)
        .with_state(executor);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

### Static Files

```rust
let app = Router::new()
    .nest_service("/pkg", ServeDir::new("pkg"))
    .leptos_routes(&executor, routes, |cx| view! { <App /> });
```