# Widgets API Reference

## Display Widgets

| Widget | Description |
|--------|-------------|
| `Paragraph` | Multi-line styled text |
| `Gauge` | Progress indicator |
| `Sparkline` | Mini line chart |
| `BarChart` | Bar chart |
| `Canvas` | Custom drawing with shapes (lines, points, labels) |
| `Calendar` | Monthly calendar (feature `widget-calendar`) |

## List Widgets

| Widget | Description |
|--------|-------------|
| `List` | Scrollable list |
| `ListState` | State for `List` |
| `Table` | Tabular data with selection |
| `TableState` | State for `Table` |
| `Tree` | Hierarchical view with expand/collapse |
| `TreeState` | State for `Tree` |
| `Tabs` | Tab container |

## Scrollbar

| Widget | Description |
|--------|-------------|
| `Scrollbar` | Vertical/horizontal scroll indicator |
| `ScrollbarState` | State for `Scrollbar` |

## Container Widgets

| Widget | Description |
|--------|-------------|
| `Block` | Borders, padding, title |
| `Clear` | Clear a render area |

## Layout

### Shortcut Constructors

```rust
let vertical = Layout::vertical([Length(1), Min(0), Length(1)]);
let horizontal = Layout::horizontal([Fill(1); 2]);
let [a, b, c] = vertical.areas(area);
```

### Layout Methods

```rust
impl Layout {
    pub fn vertical<C: Into<Constraint>>(constraints: C) -> Self;
    pub fn horizontal<C: Into<Constraint>>(constraints: C) -> Self;
    pub fn default() -> Self;
    pub fn direction(self, dir: Direction) -> Self;
    pub fn constraints(self, c: Vec<Constraint>) -> Self;
    pub fn margin(self, m: u16) -> Self;
    pub fn split(self, area: Rect) -> Vec<Rect>;
    pub fn areas(self, area: Rect) -> Vec<Rect>;
}
```

### Constraint Types

| Type | Description |
|------|-------------|
| `Length(u16)` | Fixed size in rows/cols |
| `Percentage(u16)` | Percentage of available space |
| `Ratio(u16, u16)` | Ratio-based sizing |
| `Min(u16)` | Minimum size |
| `Max(u16)` | Maximum size |
| `Fill(u16)` | Distribute remaining space proportionally |

## Style

### Stylize Trait

```rust
use ratatui::style::Stylize;
let styled = "text".red().bold().on_blue();
```

### Color Types

| Variant | Description |
|---------|-------------|
| `Black, Red, Green, Yellow, Blue, Magenta, Cyan, Gray` | Base colors |
| `DarkGray, LightRed, ...` | Bright colors |
| `White, Reset` | Special |
| `Rgb(u8, u8, u8)` | 24-bit color |
| `Indexed(u8)` | 256-color palette |

### Modifier Types

| Modifier | Effect |
|----------|--------|
| `BOLD` | Bold text |
| `ITALIC` | Italic text |
| `UNDERLINED` | Underlined text |
| `SLOW_BLINK`, `RAPID_BLINK` | Blinking |
| `REVERSED` | Reverse colors |
| `CROSSED_OUT` | Strikethrough |
| `DIM` | Dim text |
| `HIDDEN` | Hidden text |

## Text Primitives

| Type | Description |
|------|-------------|
| `Text` | List of `Line`s |
| `Line` | List of `Span`s |
| `Span` | Styled string |

### Construction

```rust
use ratatui::text::{Text, Line, Span};

let span = Span::raw("hello");
let styled = Span::styled("world", Style::new().red());
let line = Line::from(vec![span, styled]);
let text = Text::from(line);
```

## See Also

| File | Description |
|------|-------------|
| [api.md](api.md) | Core functions, types, traits |
