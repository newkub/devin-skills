# Quick Start

## 1. Create Project

```bash
cargo new my-tui-app
cd my-tui-app
cargo add ratatui crossterm@0.29
```

## 2. Hello World

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

## 3. Run the App

```bash
cargo run
```

## 4. Add Interactivity

```rust
use crossterm::event::{self, Event, KeyCode, KeyEventKind};
use ratatui::widgets::Paragraph;

fn main() -> std::io::Result<()> {
    let mut count = 0;
    ratatui::run(|terminal| {
        loop {
            terminal.draw(|frame| {
                let text = format!("Count: {count}");
                frame.render_widget(Paragraph::new(text), frame.area());
            })?;
            if let Event::Key(key) = event::read()? {
                if key.kind == KeyEventKind::Press {
                    match key.code {
                        KeyCode::Char('+') => count += 1,
                        KeyCode::Char('-') => count -= 1,
                        KeyCode::Char('q') => return Ok(()),
                        _ => {}
                    }
                }
            }
        }
    })
}
```

## 5. Add a List Widget

```rust
use ratatui::{
    style::Style,
    widgets::{Block, List, ListItem, ListState},
};

struct App {
    items: Vec<String>,
    state: ListState,
}

impl App {
    fn new(items: Vec<String>) -> Self {
        Self { items, state: ListState::default().with_selected(Some(0)) }
    }
}

fn render_list(frame: &mut ratatui::Frame, app: &mut App) {
    let items: Vec<ListItem> = app.items.iter().map(|s| ListItem::new(s.as_str())).collect();
    let list = List::new(items)
        .block(Block::bordered().title("Items"))
        .highlight_style(Style::new().italic())
        .highlight_symbol("> ");
    frame.render_stateful_widget(list, frame.area(), &mut app.state);
}
```

## 6. Add Layout

```rust
use ratatui::{
    layout::{Constraint, Layout},
    widgets::Paragraph,
};
use Constraint::{Length, Min};

fn render_layout(frame: &mut ratatui::Frame, state: &AppState) {
    let [header_area, main_area, status_area] = Layout::vertical([
        Length(3),  // Header
        Min(0),     // Content
        Length(1),  // Status
    ]).areas(frame.area());

    frame.render_widget(Paragraph::new("My TUI App"), header_area);
    render_list(frame, state, main_area);
    frame.render_widget(
        Paragraph::new(format!("Items: {}", state.items.len())),
        status_area,
    );
}
```

## 7. Event Loop Pattern

```rust
use crossterm::event::{self, Event, KeyCode, KeyEventKind};

fn main() -> std::io::Result<()> {
    let mut app = App::new();
    ratatui::run(|terminal| {
        loop {
            terminal.draw(|f| render(f, &mut app))?;
            if let Event::Key(key) = event::read()? {
                if key.kind != KeyEventKind::Press { continue; }
                match key.code {
                    KeyCode::Char('q') => return Ok(()),
                    KeyCode::Down => app.next(),
                    KeyCode::Up => app.prev(),
                    _ => {}
                }
            }
        }
    })
}
```

## Next Steps

| Topic | Description |
|-------|-------------|
| [Installation](installation.md) | Setup development environment |
| [Features](features.md) | Learn about widgets and features |
| [Best Practices](best-practices.md) | Write better TUI apps |
| [Architecture](architecture.md) | Understand the crate structure |
