# How It Works

## Architecture Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      Ratatui Architecture                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User Input (Terminal)                                        │
│  ┌─────────────────────────────────────┐                          │
│  │  Keyboard / Mouse / Resize Events   │                          │
│  │  (crossterm / termion / termwiz)    │                          │
│  └────────────────┬────────────────────┘                          │
│                   │                                               │
│                   ▼                                               │
│  2. Event Loop                                                   │
│  ┌─────────────────────────────────────┐                          │
│  │  ┌─────────┐  ┌─────────┐          │                          │
│  │  │  read   │→ │ update  │          │                          │
│  │  │  event  │  │  state  │          │                          │
│  │  └─────────┘  └─────────┘          │                          │
│  │       │                            │                          │
│  │       ▼                            │                          │
│  │  ┌─────────────────────────────────┐ │                          │
│  │  │  App State Update               │ │                          │
│  │  └─────────────────────────────────┘ │                          │
│  └────────────────┬────────────────────┘                          │
│                   │                                               │
│                   ▼                                               │
│  3. Render Phase                                                 │
│  ┌─────────────────────────────────────┐                          │
│  │  terminal.draw(|frame| {             │                          │
│  │    layout.areas(frame.area())       │                          │
│  │    widgets.render(area, buf)        │                          │
│  │  })                                 │                          │
│  │       │                            │                          │
│  │       ▼                            │                          │
│  │  ┌─────────────────────────────────┐ │                          │
│  │  │  Buffer diff & write            │ │                          │
│  │  │  ANSI escape sequences          │ │                          │
│  │  └─────────────────────────────────┘ │                          │
│  └─────────────────────────────────────┘                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Main Loop Pattern

```rust
use crossterm::event::{self, Event, KeyCode, KeyEventKind};
use ratatui::widgets::Paragraph;

fn main() -> std::io::Result<()> {
    ratatui::run(|terminal| {
        let mut should_quit = false;
        while !should_quit {
            terminal.draw(|frame| {
                frame.render_widget(Paragraph::new("Hello"), frame.area());
            })?;
            should_quit = handle_events()?;
        }
        Ok(())
    })
}

fn handle_events() -> std::io::Result<bool> {
    if let Event::Key(key) = event::read()? {
        if key.kind == KeyEventKind::Press && key.code == KeyCode::Char('q') {
            return Ok(true);
        }
    }
    Ok(false)
}
```

## Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    Rendering Pipeline                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  App State (Rust types)                                          │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────┐                                             │
│  │ Layout::areas   │  ──► Compute Rect for each region            │
│  └────────┬────────┘                                             │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                             │
│  │ Widget::render  │  ──► Write styled cells to Buffer            │
│  │ (self, area,    │                                             │
│  │  buf)           │                                             │
│  └────────┬────────┘                                             │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                             │
│  │ Buffer diff     │  ──► Compare with previous buffer           │
│  │                 │                                             │
│  └────────┬────────┘                                             │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                             │
│  │ Backend::draw   │  ──► Emit ANSI escape sequences              │
│  └────────┬────────┘                                             │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐                                             │
│  │ Terminal / VT   │  ──► Terminal renders to screen              │
│  └─────────────────┘                                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Immediate Mode Rendering

| Aspect | คำอธิบาย |
|--------|----------|
| **Redraw every frame** | No widget tree tracking |
| **Full re-render** | Simpler code, consistent UI |
| **Diffing** | Only changed cells written to terminal |
| **State management** | User manages state separately |
| **Layout cache** | Repeated layouts skip recalculation |

## Event Handling

Ratatui does not include input handling - use backend's event module.

```rust
use crossterm::event::{self, Event, KeyCode, KeyEventKind};

loop {
    if let Event::Key(key) = event::read()? {
        if key.kind == KeyEventKind::Press {
            match key.code {
                KeyCode::Char('q') => break,
                KeyCode::Down => state.next(),
                KeyCode::Up => state.prev(),
                _ => {}
            }
        }
    }
    terminal.draw(|f| render(f, &state))?;
}
```

## Resize Handling

Ratatui does not redraw automatically on resize - call `draw` again. The `Frame::area()` reflects the current backend size on each render pass.

```rust
// No special handler needed - just keep calling terminal.draw()
// frame.area() will return the current size
```
