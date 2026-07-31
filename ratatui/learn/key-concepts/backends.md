# Terminal Backends

## Overview

Ratatui รองรับหลาย terminal backends สำหรับ cross-platform compatibility

## Available Backends

### Crossterm (Default)

Cross-platform backend สำหรับ Windows, macOS, Linux

```toml
[dependencies]
ratatui = { version = "0.30", features = ["crossterm"] }
crossterm = "0.29"
```

```rust
use ratatui::backend::CrosstermBackend;
use ratatui::Terminal;

let backend = CrosstermBackend::new(stdout());
let mut terminal = Terminal::new(backend)?;
```

**Features:**
- Cross-platform (Windows, macOS, Linux)
- Mouse support
- True color support
- Unicode support

### Termion

Unix-only backend สำหรับ Linux/macOS

```toml
[dependencies]
ratatui = { version = "0.30", features = ["termion"] }
termion = "4"
```

```rust
use ratatui::backend::TermionBackend;
use ratatui::Terminal;

let backend = TermionBackend::new(stdout());
let mut terminal = Terminal::new(backend)?;
```

**Features:**
- Unix only
- Lightweight
- No Windows support

### Termwiz

Advanced backend สำหรับ modern terminals

```toml
[dependencies]
ratatui = { version = "0.30", features = ["termwiz"] }
termwiz = "0.22"
```

```rust
use ratatui::backend::TermwizBackend;
use ratatui::Terminal;

let backend = TermwizBackend::new()?;
let mut terminal = Terminal::new(backend)?;
```

**Features:**
- Advanced rendering
- Better performance
- More terminal features

## Backend Selection

### Default Backend

ใช้ `ratatui::run()` หรือ `ratatui::init()` สำหรับ default (Crossterm):

```rust
ratatui::run(|terminal| {
    // uses CrosstermBackend by default
})?;
```

### Custom Backend

```rust
use ratatui::backend::CrosstermBackend;
use ratatui::Terminal;

let backend = CrosstermBackend::new(stdout());
let mut terminal = Terminal::new(backend)?;
```

## Backend Features

### Mouse Support

```rust
use crossterm::execute;
use crossterm::cursor::EnableMouseCapture;

execute!(stdout(), EnableMouseCapture)?;
```

### True Color

```rust
use crossterm::execute;
use crossterm::terminal::EnableAlternateScreen;

execute!(stdout(), EnableAlternateScreen)?;
```

## Best Practices

- ใช้ Crossterm สำหรับ cross-platform apps
- ใช้ Termion สำหรับ Unix-only lightweight apps
- ใช้ Termwiz สำหรับ advanced features
- Enable required features ใน Cargo.toml

## See Also

- [Terminal Lifecycle](terminal-lifecycle.md)
- [Event Handling](event-handling.md)
