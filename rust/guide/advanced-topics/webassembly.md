# WebAssembly Integration

### wasm-pack Setup

```powershell
# Install wasm-pack
cargo install wasm-pack

# Build for web
wasm-pack build --target web

# Build for bundlers
wasm-pack build --target bundler
```

### Cargo.toml for WASM

```toml
[package]
name = "my-wasm"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"
js-sys = "0.3"

[dependencies.web-sys]
version = "0.3"
features = ["Window", "Document", "Element"]
```

### WASM Example

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[wasm_bindgen]
pub struct Counter {
    count: u32,
}

#[wasm_bindgen]
impl Counter {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Counter { count: 0 }
    }

    #[wasm_bindgen]
    pub fn increment(&mut self) {
        self.count += 1;
    }

    #[wasm_bindgen]
    pub fn get_count(&self) -> u32 {
        self.count
    }
}
```
