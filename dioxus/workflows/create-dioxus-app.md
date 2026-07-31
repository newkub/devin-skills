# Create Dioxus App

Workflow for creating a Dioxus application.

## Steps

1. **Install prerequisites**
   ```bash
   cargo install dioxus-cli
   ```

2. **Create new project**
   ```bash
   dx create my-app
   ```

3. **Choose platform**
   - Web
   - Desktop
   - Mobile
   - TUI

4. **Configure project**
   - Set up dependencies
   - Configure build settings
   - Set up hot reload

5. **Implement components**
   - Create components
   - Add state management
   - Implement hooks

6. **Run development server**
   ```bash
   cd my-app
   dx serve
   ```

7. **Build for production**
   ```bash
   dx build
   ```

## Example: Simple Component

```rust
use dioxus::prelude::*;

fn app() -> Element {
    let mut count = use_signal(|| 0);

    rsx! {
        div {
            h1 { "Hello Dioxus!" }
            button {
                onclick: move |_| count += 1,
                "Count: {count}"
            }
        }
    }
}
```

## Best Practices

- Use signals for state
- Follow component patterns
- Test on target platforms
- Optimize for performance
