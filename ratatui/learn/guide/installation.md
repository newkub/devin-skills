# Installation

## Requirements

| Requirement | Version | คำอธิบาย |
|-------------|---------|----------|
| **Rust** | 1.80+ | Rust toolchain |
| **Cargo** | Latest | Package manager |
| **Terminal** | ANSI-compatible | For rendering |
| **OS** | Windows / macOS / Linux | Cross-platform |

## Add to Cargo.toml

### Default (crossterm 0.29)

```toml
[dependencies]
ratatui = "0.30"
crossterm = "0.29"
```

### Crossterm 0.28 Backend

```toml
[dependencies]
ratatui = { version = "0.30", default-features = false, features = ["crossterm_0_28"] }
crossterm = "0.28"
```

### Termion Backend (Unix only)

```toml
[dependencies]
ratatui = { version = "0.30", default-features = false, features = ["termion"] }
termion = "4"
```

### Termwiz Backend

```toml
[dependencies]
ratatui = { version = "0.30", default-features = false, features = ["termwiz"] }
termwiz = "0.23"
```

## Using cargo add

```bash
# Default setup
cargo add ratatui
cargo add crossterm@0.29

# With calendar widget
cargo add ratatui --features widget-calendar

# All features
cargo add ratatui --features "unstable"
```

## Feature Flags

### Backend Features

| Feature | Default | คำอธิบาย |
|---------|---------|----------|
| `crossterm_0_29` | Yes | Crossterm 0.29 backend |
| `crossterm_0_28` | No | Crossterm 0.28 backend |
| `termion` | No | Termion backend |
| `termwiz` | No | Termwiz backend |

### Core Features

| Feature | Default | คำอธิบาย |
|---------|---------|----------|
| `std` | Yes | Standard library |
| `macros` | Yes | text!, line!, span!, layout! |
| `layout-cache` | Yes | Layout caching |
| `underline-color` | Yes | Underline colors |
| `all-widgets` | Yes | All built-in widgets |

### Optional Features

| Feature | Default | คำอธิบาย |
|---------|---------|----------|
| `widget-calendar` | Yes | Calendar widget |
| `serde` | No | Style/Color serde support |
| `palette` | No | palette crate integration |
| `portable-atomic` | No | Embedded atomic support |
| `scrolling-regions` | No | Terminal scroll regions |

### Unstable Features

| Feature | คำอธิบาย |
|---------|----------|
| `unstable` | Enable all unstable features |
| `unstable-rendered-line-info` | Paragraph line_count/line_width |
| `unstable-widget-ref` | WidgetRef and StatefulWidgetRef |
| `unstable-backend-writer` | Access backend writers |

## Project Setup

```rust
// src/main.rs
use ratatui::{
    style::Stylize,
    widgets::{Block, Paragraph},
};

fn main() -> std::io::Result<()> {
    ratatui::run(|terminal| {
        terminal.draw(|frame| {
            let greeting = Paragraph::new("Hello, Ratatui!")
                .centered()
                .yellow()
                .block(Block::bordered().title("Welcome"));
            frame.render_widget(greeting, frame.area());
        })?;
        std::thread::sleep(std::time::Duration::from_secs(5));
        Ok(())
    })
}
```

## VS Code Setup

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [{
    "label": "Run Ratatui App",
    "type": "shell",
    "command": "cargo run",
    "problemMatcher": ["$rustc"]
  }]
}
```

## Cargo Generate Templates

```bash
# Install cargo-generate
cargo install cargo-generate

# Use official Ratatui template
cargo generate ratatui/templates
```
