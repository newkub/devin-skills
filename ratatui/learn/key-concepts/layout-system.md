# Layout System

## Overview

Layout system ใน Ratatui ใช้ constraint-based layout สำหรับ responsive terminal UI

## Basic Layout

### Vertical Layout

```rust
use ratatui::layout::{Layout, Constraint};

let vertical = Layout::vertical([
    Constraint::Length(1),    // header - fixed 1 row
    Constraint::Min(0),       // content - fill remaining
    Constraint::Length(1),    // footer - fixed 1 row
]);

let [header, content, footer] = vertical.areas(area);
```

### Horizontal Layout

```rust
let horizontal = Layout::horizontal([
    Constraint::Percentage(30),  // left sidebar - 30%
    Constraint::Percentage(70),  // main content - 70%
]);

let [sidebar, main] = horizontal.areas(area);
```

## Constraint Types

### Fixed Size

```rust
Constraint::Length(10)  // exactly 10 rows/cols
```

### Percentage

```rust
Constraint::Percentage(50)  // 50% of available space
```

### Ratio

```rust
Constraint::Ratio(1, 2)  // 1/2 of available space
```

### Minimum

```rust
Constraint::Min(10)  // at least 10, fill remaining
```

### Maximum

```rust
Constraint::Max(20)  // at most 20, shrink if needed
```

### Fill

```rust
Constraint::Fill(1)  // distribute remaining proportionally
```

## Nested Layouts

### Complex Layout

```rust
// Split vertically
let vertical = Layout::vertical([
    Constraint::Length(1),
    Constraint::Min(0),
]).split(area);

let [header, main] = vertical;

// Split main horizontally
let horizontal = Layout::horizontal([
    Constraint::Percentage(30),
    Constraint::Percentage(70),
]).split(main);

let [sidebar, content] = horizontal;
```

### Three-Column Layout

```rust
let layout = Layout::horizontal([
    Constraint::Fill(1),
    Constraint::Fill(2),
    Constraint::Fill(1),
]).split(area);

let [left, center, right] = layout;
```

## Layout Methods

### Direction

```rust
let mut layout = Layout::default();
layout = layout.direction(Direction::Horizontal);
```

### Constraints

```rust
let layout = Layout::default()
    .constraints(vec![
        Constraint::Length(10),
        Constraint::Min(0),
    ]);
```

### Margin

```rust
let layout = Layout::default()
    .margin(1);  // 1 cell margin on all sides
```

### Split vs Areas

```rust
// split() returns Vec<Rect>
let areas = layout.split(area);

// areas() destructures into named variables
let [a, b, c] = layout.areas(area);
```

## Responsive Layouts

### Adaptive Layout

```rust
fn create_layout(area: Rect) -> Vec<Rect> {
    if area.width < 50 {
        // narrow layout - single column
        Layout::vertical([Constraint::Min(0)]).split(area)
    } else {
        // wide layout - two columns
        Layout::horizontal([
            Constraint::Percentage(30),
            Constraint::Percentage(70),
        ]).split(area)
    }
}
```

### Dynamic Constraints

```rust
let sidebar_width = if area.width > 100 { 30 } else { 20 };

let layout = Layout::horizontal([
    Constraint::Length(sidebar_width),
    Constraint::Min(0),
]).split(area);
```

## Best Practices

- ใช้ `Min(0)` สำหรับ flexible areas
- ใช้ `Fill(n)` สำหรับ proportional distribution
- Nest layouts สำหรับ complex UIs
- Handle resize events สำหรับ responsive layouts
- Test บนขนาด terminal ต่างๆ

## See Also

- [Widget API](../../references/api-widgets.md)
- [Custom Widgets](custom-widgets.md)
