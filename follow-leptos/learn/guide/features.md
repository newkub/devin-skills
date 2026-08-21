# Features

Features และ capabilities ของ Leptos

## Routing

```rust
use leptos_router::*;

#[component]
fn App() -> impl IntoView {
    view! {
        <Router>
            <nav>
                <A href="/">Home</A>
                <A href="/blog">Blog</A>
            </nav>
            <Routes>
                <Route path="/" view=Home />
                <Route path="/blog" view=Blog />
                <Route path="/blog/:id" view=Post />
            </Routes>
        </Router>
    }
}
```

## Server-Side Rendering

```rust
// Enable with features
[dependencies]
leptos = { version = "0.6", features = ["ssr"] }
```

## Forms & Actions

```rust
use leptos::*;

#[component]
fn LoginForm() -> impl IntoView {
    let (name, set_name) = create_signal(String::new());
    
    view! {
        <form>
            <input
                type="text"
                value={name}
                on:input=move |ev| set_name(event_target_value(&ev))
            />
            <button type="submit">"Login"</button>
        </form>
    }
}
```

## Async & Resources

```rust
use leptos::*;

let async_data = create_resource(
    move || fetch_params.get(),
    |params| async move {
        fetch_data(params).await
    }
);

view! {
    <Suspense fallback=|| view! { <p>"Loading..."</p> }>
        {async_data.get().map(|data| view! { <DataView data={data} /> })}
    </Suspense>
}
```