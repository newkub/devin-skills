# Cargo.toml Template

```toml
[package]
name = "project-name"
version = "0.1.0"
edition = "2021"
authors = ["Your Name <your.email@example.com>"]
description = "Project description"
license = "MIT OR Apache-2.0"
repository = "https://github.com/username/project-name"

[dependencies]
# Add runtime dependencies here

[dev-dependencies]
# Add development dependencies here

[profile.dev]
opt-level = 0
debug = true

[profile.release]
opt-level = 3
debug = false
lto = true
codegen-units = 1
```
