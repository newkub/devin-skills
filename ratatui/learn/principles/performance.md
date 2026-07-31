# Performance Principles

## Overview

Ratatui ออกแบบมาสำหรับ performance สูง แต่ต้องใช้งานอย่างถูกต้อง

## Rendering Performance

### Minimal Redraws

Render เฉพาะสิ่งที่เปลี่ยน:

```rust
// ❌ Bad - render ทุก frame
loop {
    terminal.draw(|frame| {
        render_full_ui(frame);
    })?;
}

// ✅ Good - render เฉพาะเมื่อจำเป็น
let mut needs_redraw = true;
loop {
    if needs_redraw {
        terminal.draw(|frame| {
            render_full_ui(frame);
        })?;
        needs_redraw = false;
    }
    
    if handle_events()? {
        needs_redraw = true;
    }
}
```

### Efficient Widget Usage

```rust
// ❌ Bad - recreate widgets ทุก frame
loop {
    terminal.draw(|frame| {
        let list = List::new(items.clone()); // clone ทุกครั้ง
        frame.render_widget(list, area);
    })?;
}

// ✅ Good - reuse widgets
let list = List::new(items);
loop {
    terminal.draw(|frame| {
        frame.render_widget(&list, area); // reference
    })?;
}
```

### Buffer Operations

```rust
// ❌ Bad - loop set_char
for y in 0..height {
    for x in 0..width {
        buffer.get_mut(x, y).set_char(' ');
    }
}

// ✅ Good - batch operations
buffer.set_string(x, y, &" ".repeat(width), style);
```

## Event Loop Performance

### Non-blocking Poll

```rust
// ❌ Bad - blocking read
loop {
    let event = event::read()?; // blocks
    handle_event(event);
    terminal.draw(...)?;
}

// ✅ Good - non-blocking poll
loop {
    if event::poll(Duration::from_millis(16))? { // ~60fps
        let event = event::read()?;
        handle_event(event);
    }
    terminal.draw(...)?;
}
```

### Event Throttling

```rust
use std::time::{Duration, Instant};

let mut last_draw = Instant::now();
const FRAME_RATE: Duration = Duration::from_millis(16);

loop {
    if last_draw.elapsed() >= FRAME_RATE {
        terminal.draw(...)?;
        last_draw = Instant::now();
    }
}
```

## Memory Performance

### Avoid Cloning

```rust
// ❌ Bad - clone large data
struct App {
    items: Vec<String>,
}

fn render(&self, frame: &mut Frame) {
    let items = self.items.clone(); // clone
    let list = List::new(items);
    frame.render_widget(list, area);
}

// ✅ Good - use references
fn render(&self, frame: &mut Frame) {
    let list = List::new(&self.items); // reference
    frame.render_widget(list, area);
}
```

### Reuse State

```rust
// ❌ Bad - recreate state
loop {
    let mut state = ListState::default();
    state.select(Some(0));
    frame.render_stateful_widget(list, area, &mut state);
}

// ✅ Good - reuse state
let mut state = ListState::default();
state.select(Some(0));
loop {
    frame.render_stateful_widget(&list, area, &mut state);
}
```

## Layout Performance

### Cache Layouts

```rust
// ❌ Bad - recalculate layout ทุก frame
loop {
    terminal.draw(|frame| {
        let layout = Layout::vertical([...]).split(frame.area());
        // use layout
    })?;
}

// ✅ Good - cache layout
let mut cached_layout = None;
let mut last_area = Rect::default();

loop {
    terminal.draw(|frame| {
        let area = frame.area();
        if area != last_area {
            cached_layout = Some(Layout::vertical([...]).split(area));
            last_area = area;
        }
        if let Some(layout) = &cached_layout {
            // use layout
        }
    })?;
}
```

## Best Practices

- Render เฉพาะเมื่อจำเป็น (dirty rectangles)
- ใช้ references แทน clones
- Reuse widgets และ state
- Cache layouts สำหรับ static UIs
- ใช้ non-blocking poll สำหรับ animations
- Limit frame rate สำหรับ non-interactive apps

## See Also

- [Buffer & Rendering](../key-concepts/buffer-rendering.md)
- [Event Handling](../key-concepts/event-handling.md)
