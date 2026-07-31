# Configuration

## Cargo.toml Setup

### Minimal

```toml
[dependencies]
ratatui = "0.30"
crossterm = "0.29"
```

### With Selected Features

```toml
[dependencies]
ratatui = { version = "0.30", features = ["widget-calendar", "serde"] }
crossterm = "0.29"
```

### With Custom Backend

```toml
[dependencies]
ratatui = { version = "0.30", default-features = false, features = ["termion"] }
termion = "4"
```

## Application State

### Basic State

```rust
struct AppState {
    items: Vec<String>,
    selected: usize,
    should_quit: bool,
}

impl AppState {
    fn new() -> Self {
        Self { items: Vec::new(), selected: 0, should_quit: false }
    }
}
```

### State with Cached Render Data

```rust
struct AppState {
    items: Vec<String>,
    selected: usize,
    cached_lines: Vec<Line<'static>>,  // pre-computed
    should_quit: bool,
}
```

## Layout Configuration

### Vertical Layout

```rust
use ratatui::layout::{Layout, Constraint};
use Constraint::{Length, Min, Fill};

let [header, main, footer] = Layout::vertical([
    Length(3),
    Min(0),
    Length(1),
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

### Theme Pattern

```rust
use ratatui::style::{Color, Style};

struct Theme {
    primary: Color,
    background: Color,
    text: Color,
    highlight: Color,
}

impl Theme {
    fn default() -> Self {
        Self {
            primary: Color::Cyan,
            background: Color::Black,
            text: Color::White,
            highlight: Color::Yellow,
        }
    }
}
```

### Default Style

```rust
use ratatui::style::{Style, Color};

let default_style = Style::default()
    .fg(Color::White)
    .bg(Color::Black);
```

### Using Stylize

```rust
use ratatui::style::Stylize;
let text = "Hello".red().bold().on_blue();
```

## Terminal Viewport

```rust
use ratatui::{Terminal, Viewport, layout::Rect};
use ratatui::backend::CrosstermBackend;
use std::io::stdout;

let backend = CrosstermBackend::new(stdout());

// Fullscreen (default)
let terminal = Terminal::new(backend)?;

// Inline - 5 lines below cursor
let terminal = Terminal::new(backend)?
    .with_options(ratatui::TerminalOptions { viewport: Viewport::Inline(5) })?;
```

## State Management Patterns

| Pattern | Use Case |
|---------|----------|
| **Simple struct** | Single app state, single thread |
| **Arc<Mutex<T>>** | Background thread + UI thread |
| **Channels (mpsc)** | Producer/consumer pattern |
| **Reducer pattern** | Predictable state transitions |
| **Component state** | Each widget owns its state |

### Channel Pattern

```rust
use std::sync::mpsc;

let (tx, rx) = mpsc::channel();

// background thread
std::thread::spawn(move || {
    tx.send("update").unwrap();
});

// in main loop
if let Ok(msg) = rx.try_recv() {
    // update app state
}
```

## Environment Variables

```bash
# For tracing/debugging
RUST_LOG=debug cargo run

# Terminal size hints (if autodetect fails)
COLUMNS=80
LINES=24
TERM=xterm-256color
```
