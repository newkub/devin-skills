# Create Leptos App

Workflow for creating a Leptos application.

## Steps

1. Install prerequisites
   ```bash
   cargo install cargo-leptos
   cargo install trunk
   ```

2. Create new project
   ```bash
   cargo leptos new my-app
   ```

3. Choose template
   - SSR (Server-Side Rendering)
   - CSR (Client-Side Rendering)
   - Full Stack

4. Configure project
   - Set up dependencies
   - Configure Cargo.toml
   - Set up build settings

5. Implement components
   - Create components
   - Add signals
   - Implement reactive system

6. Run development
   ```bash
   cd my-app
   cargo leptos watch
   ```

7. Build for production
   ```bash
   cargo leptos build --release
   ```

## Example: Simple Component

```rust
use leptos::*;

#[component]
fn App() -> impl IntoView {
    let (count, set_count) = create_signal(0);

    view! {
        <div>
            <h1>"Hello Leptos!"</h1>
            <button on:click=move |_| set_count.update(|n| *n + 1)>
                {count}
            </button>
        </div>
    }
}

fn main() {
    mount_to_body(App)
}
```

## Best Practices

- Use signals for state
- Follow component patterns
- Test on target platforms
- Optimize for performance
