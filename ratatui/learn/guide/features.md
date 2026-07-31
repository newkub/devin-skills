# Features

## Core Features

| Feature | คำอธิบาย |
|---------|----------|
| **Immediate Mode** | Render full frame each tick - no widget tree diffing |
| **Cross-Platform** | Windows, macOS, Linux, BSD |
| **Backend Agnostic** | crossterm, termion, termwiz |
| **No-std Support** | Works on embedded targets |
| **Sub-ms Render** | Zero-cost abstractions, minimal overhead |
| **Pure Rust** | Memory-safe, no C dependencies |

## Built-in Widgets

### Display Widgets

| Widget | คำอธิบาย |
|--------|----------|
| **Paragraph** | Multi-line styled text |
| **Gauge** | Progress bar indicator |
| **Sparkline** | Mini line chart |
| **BarChart** | Bar chart visualization |
| **Canvas** | Custom drawing with shapes (lines, points, labels) |
| **Calendar** | Monthly calendar view (feature `widget-calendar`) |

### List Widgets

| Widget | คำอธิบาย |
|--------|----------|
| **List** | Scrollable item list with selection |
| **Table** | Tabular data with rows, columns, selection |
| **Tree** | Hierarchical structure with expand/collapse |
| **Tabs** | Tabbed interface |

### Scrollbar

| Widget | คำอธิบาย |
|--------|----------|
| **Scrollbar** | Vertical/horizontal scroll indicator |
| **ScrollbarState** | Companion state for Scrollbar |

### Container Widgets

| Widget | คำอธิบาย |
|--------|----------|
| **Block** | Border, padding, title |
| **Clear** | Clear a render area |

## Layout Features

| Feature | Description |
|---------|-------------|
| **Constraint-based** | Length, Percentage, Ratio, Min, Max, Fill |
| **Direction** | Vertical, Horizontal |
| **Nested layouts** | Split inside splits |
| **Convenience methods** | `Layout::vertical()`, `Layout::horizontal()` |
| **Destructure splits** | `let [a, b] = layout.areas(area);` |
| **Margin** | Outer spacing on each side |
| **Alignment** | Position within remaining space |

## Style Features

| Feature | คำอธิบาย |
|---------|----------|
| **24-bit Color** | Rgb, Indexed, named colors |
| **Modifiers** | BOLD, ITALIC, UNDERLINED, etc. |
| **Stylize Trait** | Fluent API: `"text".red().bold()` |
| **Underline Color** | Set underline color (Crossterm/Termwiz) |
| **Custom Symbols** | Box drawing characters |
| **Theme Support** | Serde for theme persistence |

## Text Primitives

| Type | คำอธิบาย |
|------|----------|
| **Text** | List of Lines |
| **Line** | List of Spans |
| **Span** | Styled string |

## Backend Features

| Backend | Features |
|---------|----------|
| **Crossterm** | Cross-platform, mouse, colors, raw mode |
| **Termion** | Lightweight, Unix only |
| **Termwiz** | Advanced rendering, sixel |

## Viewport Modes

| Mode | คำอธิบาย |
|------|----------|
| **Fullscreen** | Full terminal (default) |
| **Inline(u16)** | Reserve N lines below cursor |
| **Fixed(Rect)** | Fixed rectangular region |

## Special Features

### Animation Support

```rust
use std::time::Instant;

let start = Instant::now();
loop {
    let elapsed = start.elapsed().as_secs_f32();
    let progress = elapsed % 1.0;
    // Update widget with animation
}
```

### Stateful Widgets

```rust
pub trait StatefulWidget {
    type State;
    fn render(self, area: Rect, buf: &mut Buffer, state: &mut Self::State);
}
```

### Custom Rendering

```rust
impl Widget for CustomWidget {
    fn render(self, area: Rect, buf: &mut Buffer) {
        buf.set_string(area.x, area.y, "custom", Style::default());
    }
}
```
