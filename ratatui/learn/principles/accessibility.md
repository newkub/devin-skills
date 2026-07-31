# Accessibility Principles

## Overview

ทำ TUI ให้ accessible สำหรับผู้ใช้ทุกคน รวมถึงผู้ใช้ screen readers และผู้ใช้ที่มีข้อจำกัดทางสายตา

## Color Accessibility

### High Contrast

```rust
// ❌ Bad - low contrast
let style = Style::default()
    .fg(Color::DarkGray)
    .bg(Color::Black);

// ✅ Good - high contrast
let style = Style::default()
    .fg(Color::White)
    .bg(Color::Black);
```

### Color Independence

อย่าพึ่งพา color เพียงอย่างเดียว:

```rust
// ❌ Bad - color only
let error_style = Style::default().fg(Color::Red);
let success_style = Style::default().fg(Color::Green);

// ✅ Good - color + symbol/modifier
let error_style = Style::default()
    .fg(Color::Red)
    .add_modifier(Modifier::BOLD);
let success_style = Style::default()
    .fg(Color::Green)
    .add_modifier(Modifier::BOLD);

// Add symbols
let error_prefix = "[X] ";
let success_prefix = "[✓] ";
```

## Keyboard Accessibility

### Keyboard Navigation

```rust
// Support arrow keys
match key.code {
    KeyCode::Up => move_selection(-1),
    KeyCode::Down => move_selection(1),
    KeyCode::Left => move_selection(-1),
    KeyCode::Right => move_selection(1),
    _ => {}
}

// Support common shortcuts
match key.code {
    KeyCode::Char('q') | KeyCode::Esc => quit(),
    KeyCode::Char('?') => show_help(),
    KeyCode::Char('/') => search(),
    _ => {}
}
```

### Focus Indicators

```rust
// Show focus clearly
let focused_style = Style::default()
    .add_modifier(Modifier::REVERSED)
    .add_modifier(Modifier::BOLD);

let unfocused_style = Style::default();
```

## Screen Reader Support

### Semantic Text

```rust
// Use clear, descriptive text
let title = "User List - 5 items";
let status = "Selected: John Doe (index 2)";

// Avoid ambiguous symbols
let clear_text = "Error: File not found";
// not: "X: File not found"
```

### Announce Changes

```rust
// Log important changes สำหรับ screen readers
fn log_change(message: &str) {
    // ส่งไปยัง screen reader หรือ log file
    eprintln!("{}", message);
}

// Use เมื่อ selection เปลี่ยน
if selection_changed {
    log_change(&format!("Selected: {}", items[selected]));
}
```

## Visual Accessibility

### Font Size

Support ขนาด terminal ต่างๆ:

```rust
// Test บนขนาด terminal ต่างๆ
// - 80x24 (small)
// - 120x40 (medium)
// - 160x60 (large)

// Adapt layout ตามขนาด
let layout = if area.width < 80 {
    create_compact_layout(area)
} else {
    create_full_layout(area)
};
```

### Spacing

```rust
// ใช้ padding และ spacing อย่างเหมาะสม
let block = Block::bordered()
    .padding(Padding::uniform(1)) // padding 1 cell
    .title("Title");
```

## Testing Accessibility

### Color Blindness

Test กับ color blindness simulators:
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)

### Keyboard Only

Test โดยใช้ keyboard เท่านั้น:
- Navigate ทุก elements
- Activate ทุก actions
- Exit app ได้

### Screen Reader

Test กับ screen readers:
- NVDA (Windows)
- VoiceOver (macOS)
- Orca (Linux)

## Best Practices

- ใช้ high contrast colors
- อย่าพึ่งพา color เพียงอย่างเดียว
- Support keyboard navigation ครบถ้วน
- ใช้ clear, descriptive text
- Test บนขนาด terminal ต่างๆ
- Consider screen reader users

## See Also

- [Style & Colors](../../references/api-widgets.md#style)
- [Event Handling](../key-concepts/event-handling.md)
