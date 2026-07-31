# Buffer & Rendering

## Overview

Buffer คือ 2D grid ของ cells ที่ใช้สำหรับ rendering UI ใน terminal

## Buffer Structure

### Cell

แต่ละ cell มี:
- Character (char)
- Style (foreground color, background color, modifiers)
- Symbol (for special characters)

```rust
use ratatui::buffer::Cell;
use ratatui::style::{Color, Style, Modifier};

let mut cell = Cell::default();
cell.set_char('A')
    .set_style(Style::default()
        .fg(Color::Red)
        .bg(Color::Blue)
        .add_modifier(Modifier::BOLD));
```

### Buffer

Buffer เป็น grid ของ cells:

```rust
use ratatui::buffer::Buffer;

let width = 80;
let height = 24;
let mut buffer = Buffer::empty(Rect::new(0, 0, width, height));
```

## Rendering Pipeline

### Frame Rendering

```rust
terminal.draw(|frame| {
    // frame.buffer() คือ mutable reference ไปยัง buffer
    // frame.area() คือ area ที่ render ได้
    
    let area = frame.area();
    let buffer = frame.buffer_mut();
    
    // render widgets ลง buffer
    widget.render(area, buffer);
})?;
```

### Double Buffering

Ratatui ใช้ double buffering:
- Front buffer: แสดงผลบน terminal
- Back buffer: render ใหม่
- Swap: สลับ buffers เมื่อ render เสร็จ

```rust
impl<B: Backend> Terminal<B> {
    pub fn draw<F>(&mut self, f: F) -> io::Result<CompletedFrame>
    where F: FnOnce(&mut Frame);
    
    pub fn swap_buffers(&mut self);
}
```

## Buffer Operations

### Set Character

```rust
buffer.get_mut(x, y).set_char('X');
```

### Set String

```rust
buffer.set_string(x, y, "Hello", Style::default());
```

### Set Line

```rust
use ratatui::text::Line;

let line = Line::from("Hello World");
buffer.set_line(x, y, line, width);
```

### Set Area

```rust
// Clear area
buffer.set_style(area, Style::default());

// Fill area with character
for y in area.top()..area.bottom() {
    for x in area.left()..area.right() {
        buffer.get_mut(x, y).set_char(' ');
    }
}
```

## Performance Optimization

### Minimal Redraws

```rust
// เฉพาะ render areas ที่เปลี่ยน
if needs_redraw {
    widget.render(area, buffer);
}
```

### Dirty Rects

```rust
// Track areas ที่เปลี่ยน
let mut dirty_areas = Vec::new();
dirty_areas.push(changed_area);

// Render เฉพาะ dirty areas
for area in dirty_areas {
    widget.render(area, buffer);
}
```

### Batch Operations

```rust
// ใช้ set_string แทน loop set_char
buffer.set_string(x, y, "text", style); // faster than loop
```

## Debugging

### Visualize Buffer

```rust
// Print buffer content สำหรับ debugging
for y in 0..buffer.area.height {
    for x in 0..buffer.area.width {
        let cell = buffer.get(x, y);
        print!("{}", cell.symbol());
    }
    println!();
}
```

### Inspect Cells

```rust
let cell = buffer.get(x, y);
println!("Char: {}, Style: {:?}", cell.symbol(), cell.style());
```

## Best Practices

- ใช้ built-in widgets เมื่อเป็นไปได้
- หลีกเลี่ยง manual buffer manipulation
- Optimize ด้วย minimal redraws
- Test rendering บนขนาด terminal ต่างๆ

## See Also

- [Custom Widgets](custom-widgets.md)
- [Terminal Lifecycle](terminal-lifecycle.md)
