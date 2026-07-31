# Configuration Reference

## Cargo.toml

### Basic Setup

```toml
[dependencies]
ratatui = "0.30"
crossterm = "0.29"
```

### Using cargo add

```bash
cargo add ratatui
cargo add crossterm@0.29
```

## Feature Flags

### Backend Selection

| Feature | Default | Description |
|---------|---------|-------------|
| `crossterm_0_29` | Yes | Crossterm 0.29 backend |
| `crossterm_0_28` | No | Crossterm 0.28 backend |
| `termion` | No | Termion backend (Unix only) |
| `termwiz` | No | Termwiz backend |

### Core Features

| Feature | Default | Description |
|---------|---------|-------------|
| `std` | Yes | Standard library support |
| `macros` | Yes | Utility macros (text!, line!, span!) |
| `layout-cache` | Yes | Speed up layout calculations |
| `underline-color` | Yes | Underline color (Crossterm/Termwiz) |
| `all-widgets` | Yes | All built-in widgets |

### Optional Features

| Feature | Default | Description |
|---------|---------|-------------|
| `widget-calendar` | Yes | Calendar widget |
| `serde` | No | Serialize Style/Color |
| `palette` | No | Color conversions from palette crate |
| `portable-atomic` | No | Atomic types for embedded |
| `scrolling-regions` | No | Terminal scrolling regions |

### Unstable Features

| Feature | Description |
|---------|-------------|
| `unstable` | Enable all unstable features |
| `unstable-rendered-line-info` | Paragraph::line_count/line_width |
| `unstable-widget-ref` | WidgetRef and StatefulWidgetRef traits |
| `unstable-backend-writer` | Access backend writers |

### Full Example

```toml
[dependencies]
ratatui = { version = "0.30", default-features = false, features = [
    "crossterm_0_29",
    "macros",
    "widget-calendar",
    "serde",
] }
crossterm = "0.29"
```

## Application Configuration

### State Struct Pattern

```rust
struct AppState {
    items: Vec<String>,
    selected: usize,
    scroll_offset: usize,
    should_quit: bool,
}

impl AppState {
    fn new() -> Self {
        Self {
            items: Vec::new(),
            selected: 0,
            scroll_offset: 0,
            should_quit: false,
        }
    }
}
```

## Layout Configuration

### Vertical Layout

```rust
use ratatui::layout::{Layout, Constraint};
use Constraint::{Fill, Length, Min};

let [header, main, status] = Layout::vertical([
    Length(1),  // Header
    Min(0),     // Content (flexible)
    Length(1),  // Status
]).areas(frame.area());
```

### Horizontal Layout

```rust
let [sidebar, content] = Layout::horizontal([
    Constraint::Percentage(20),
    Constraint::Percentage(80),
]).areas(frame.area());
```

### Nested Layout

```rust
let [top, bottom] = Layout::vertical([Length(3), Min(0)]).areas(area);
let [left, right] = Layout::horizontal([Fill(1); 2]).areas(bottom);
```

## Style Configuration

### Basic Style

```rust
use ratatui::style::{Style, Color};

let style = Style::default()
    .fg(Color::White)
    .bg(Color::Black);
```

### Using Stylize Trait

```rust
use ratatui::style::Stylize;

let styled = "Hello".red().bold().on_black();
```

## Terminal Viewport

```rust
use ratatui::Viewport;
use ratatui::layout::Rect;

let viewport = Viewport::Fullscreen;          // Default
let viewport = Viewport::Inline(5);            // Inline 5 lines
let viewport = Viewport::Fixed(Rect::new(0, 0, 80, 24));
```

## Build Configuration

### Release Profile

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
strip = true
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TERM` | Terminal type |
| `COLUMNS` | Terminal columns |
| `LINES` | Terminal lines |
| `RUST_LOG` | Tracing log filter |
