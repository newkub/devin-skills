# Best Practices

## Application Structure

### Use ratatui::run for Default Apps

```rust
fn main() -> std::io::Result<()> {
    ratatui::run(|terminal| {
        // app loop
        Ok(())
    })
}
```

### Use init/restore for Manual Control

```rust
fn main() -> std::io::Result<()> {
    let mut terminal = ratatui::init();
    let result = run_app(&mut terminal);
    ratatui::restore();
    result
}
```

## State Management

### Centralized State

```rust
struct App {
    counter: u32,
    todos: Vec<Todo>,
    selected: usize,
    should_quit: bool,
}

impl App {
    fn new() -> Self { /* ... */ }

    fn handle_key(&mut self, key: KeyCode) {
        match key {
            KeyCode::Char('q') => self.should_quit = true,
            KeyCode::Up => self.selected = self.selected.saturating_sub(1),
            KeyCode::Down => self.selected = (self.selected + 1).min(self.todos.len().saturating_sub(1)),
            _ => {}
        }
    }
}
```

### Pass State by Reference

```rust
fn render(frame: &mut Frame, app: &App) {
    // ...
}
```

## Error Handling

### Use Result Throughout

```rust
fn main() -> std::io::Result<()> {
    ratatui::run(|terminal| {
        terminal.draw(render)?;
        Ok(())
    })
}
```

### Distinguish Press from Release

```rust
use crossterm::event::{Event, KeyCode, KeyEventKind};

if let Event::Key(key) = event::read()? {
    if key.kind != KeyEventKind::Press { continue; }
    match key.code {
        KeyCode::Char('q') => return Ok(()),
        _ => {}
    }
}
```

## Performance Tips

### Avoid Allocations in Render

```rust
// Bad - allocates every frame
let text = format!("Value: {}", self.value);
frame.render_widget(Paragraph::new(text), area);

// Good - pre-compute when state changes
let text = self.cached_text.clone();
frame.render_widget(Paragraph::new(text), area);
```

### Use Layout Shortcuts

```rust
// Faster - no Vec allocation
let [a, b] = Layout::horizontal([Fill(1); 2]).areas(area);

// Slower - allocates Vec<Rect>
let chunks = Layout::horizontal([Fill(1); 2]).split(area);
frame.render_widget(w_a, chunks[0]);
```

## Layout Best Practices

### Responsive Layout

```rust
let horizontal = Layout::default()
    .direction(Direction::Horizontal)
    .constraints([
        Constraint::Percentage(30),  // Sidebar
        Constraint::Percentage(70),  // Main
    ])
    .split(frame.area());
```

### Use Fill for Flexible Areas

```rust
let [sidebar, main] = Layout::horizontal([
    Length(20),   // Fixed sidebar
    Fill(1),      // Flexible main
]).areas(area);
```

## Widget Composition

### Builder Pattern

```rust
let widget = Paragraph::new("Text")
    .style(Style::default().fg(Color::Red))
    .alignment(Alignment::Center)
    .wrap(Wrap { trim: true });

frame.render_widget(widget, area);
```

### Component Functions

```rust
fn render_header(frame: &mut Frame, title: &str, area: Rect) {
    let block = Block::bordered().title(title);
    frame.render_widget(block, area);
}
```

## Testing

### Snapshot Tests with Insta

```rust
use insta::assert_snapshot;
use ratatui::backend::TestBackend;
use ratatui::Terminal;

#[test]
fn test_list_rendering() {
    let backend = TestBackend::new(20, 5);
    let mut terminal = Terminal::new(backend).unwrap();
    terminal.draw(|f| render(f, &app)).unwrap();
    assert_snapshot!(terminal.backend());
}
```

## Keyboard Navigation

| Action | Key | Description |
|--------|-----|-------------|
| Quit | `q` / `Ctrl+C` | Exit application |
| Up | `↑` / `k` | Move up |
| Down | `↓` / `j` | Move down |
| Left | `←` / `h` | Move left |
| Right | `→` / `l` | Move right |
| Enter | `⏎` | Select/confirm |
| Escape | `Esc` | Cancel/back |
