# Event Handling

## Overview

Ratatui ไม่รวม event handling ในตัว แต่ให้ใช้ backend library โดยตรง (เช่น crossterm, termion)

## Crossterm Event Handling

### Basic Event Loop

```rust
use crossterm::event::{self, Event, KeyCode, KeyEventKind};

fn handle_events() -> std::io::Result<bool> {
    match event::read()? {
        Event::Key(key) if key.kind == KeyEventKind::Press => {
            match key.code {
                KeyCode::Char('q') => return Ok(true), // quit
                KeyCode::Up => { /* handle up */ }
                KeyCode::Down => { /* handle down */ }
                _ => {}
            }
        }
        Event::Resize(_, _) => { /* handle resize */ }
        Event::Mouse(_) => { /* handle mouse */ }
        _ => {}
    }
    Ok(false)
}
```

### Key Events

```rust
use crossterm::event::{KeyCode, KeyModifiers};

match key.code {
    KeyCode::Char('c') => { /* character key */ }
    KeyCode::Enter => { /* enter key */ }
    KeyCode::Esc => { /* escape key */ }
    KeyCode::Backspace => { /* backspace */ }
    KeyCode::Tab => { /* tab */ }
    KeyCode::Up | KeyCode::Down | KeyCode::Left | KeyCode::Right => { /* arrows */ }
    KeyCode::F(1) => { /* F1 */ }
    _ => {}
}

// Check modifiers
if key.modifiers.contains(KeyModifiers::CONTROL) {
    // Ctrl key pressed
}
```

### Mouse Events

```rust
use crossterm::event::{MouseEvent, MouseEventKind, MouseButton};

match event {
    Event::Mouse(MouseEvent {
        kind: MouseEventKind::Down(MouseButton::Left),
        column,
        row,
        ..
    }) => {
        // handle left click at (column, row)
    }
    Event::Mouse(MouseEvent {
        kind: MouseEventKind::ScrollUp,
        ..
    }) => {
        // handle scroll up
    }
    _ => {}
}
```

### Polling vs Blocking

```rust
// Blocking (wait for event)
let event = event::read()?;

// Non-blocking (check if event available)
if event::poll(Duration::from_millis(100))? {
    let event = event::read()?;
    // handle event
}
```

## Termion Event Handling

```rust
use termion::event::{Event, Key};

let stdin = stdin();
for evt in stdin.events() {
    match evt? {
        Event::Key(Key::Char('q')) => break,
        Event::Key(Key::Up) => { /* handle up */ }
        _ => {}
    }
}
```

## Best Practices

- ใช้ `KeyEventKind::Press` เพื่อ filter key repeat events
- Handle resize events เพื่อ update layout
- ใช้ non-blocking poll สำหรับ animations
- Enable mouse events ด้วย `crossterm::execute!(stdout, EnableMouseCapture)`

## See Also

- [Terminal Lifecycle](terminal-lifecycle.md)
- [State Management](state-management.md)
