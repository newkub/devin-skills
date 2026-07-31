# Key Concepts

## Core Traits

### Widget Trait

```rust
use ratatui::widgets::Widget;

pub trait Widget {
    fn render(self, area: Rect, buf: &mut Buffer);
}
```

Consumes `self` - call `clone()` if you need to re-render.

### StatefulWidget Trait

```rust
pub trait StatefulWidget {
    type State;
    fn render(self, area: Rect, buf: &mut Buffer, state: &mut Self::State);
}
```

State lives outside the widget (e.g. selection, scroll).

### WidgetRef (Unstable)

```rust
#[cfg(feature = "unstable-widget-ref")]
pub trait WidgetRef {
    fn render_ref(&self, area: Rect, buf: &mut Buffer);
}
```

Renders from `&self` - useful for borrow-heavy code.

## Layout System

### Constraint-based Layout

```rust
use ratatui::layout::{Layout, Constraint};
use Constraint::{Length, Min, Percentage, Fill};

Layout::vertical([
    Length(3),        // Fixed 3 rows
    Min(10),          // At least 10 rows
    Fill(1),          // Takes remaining
])
```

### Destructure Pattern

```rust
let [header, main, footer] = Layout::vertical([...]).areas(frame.area());
```

### Nested Layouts

```rust
let [top, bottom] = Layout::vertical([Length(3), Min(0)]).areas(area);
let [left, right] = Layout::horizontal([Fill(1); 2]).areas(bottom);
```

## Style System

### Text Styling

```rust
use ratatui::style::Stylize;

let styled = "Hello".red().bold().on_blue();
```

### Color Types

| Variant | Description |
|---------|-------------|
| `Black`, `Red`, `Green`, `Yellow`, `Blue`, `Magenta`, `Cyan`, `Gray` | Base colors |
| `DarkGray`, `LightRed`, `LightGreen`, ... | Bright variants |
| `White`, `Reset` | Special |
| `Rgb(u8, u8, u8)` | 24-bit color |
| `Indexed(u8)` | 256-color palette |

### Modifier Flags

| Modifier | Effect |
|----------|--------|
| `BOLD` | Bold text |
| `ITALIC` | Italic text |
| `UNDERLINED` | Underlined text |
| `REVERSED` | Reverse colors |
| `CROSSED_OUT` | Strikethrough |
| `DIM` | Dim text |
| `HIDDEN` | Hidden text |

## Text Primitives

```rust
use ratatui::text::{Text, Line, Span};

let span = Span::raw("hello");
let styled = Span::styled("world", Style::new().red());
let line = Line::from(vec![span, styled]);
let text = Text::from(line);
```

| Type | Composed of |
|------|-------------|
| `Span` | String + Style |
| `Line` | Vec of `Span`s |
| `Text` | Vec of `Line`s |

## Backends

| Backend | Feature | Description |
|---------|---------|-------------|
| **crossterm** | `crossterm_0_29` (default) | Cross-platform |
| **crossterm 0.28** | `crossterm_0_28` | Legacy version |
| **termion** | `termion` | Unix only, lightweight |
| **termwiz** | `termwiz` | Advanced rendering, sixel |

## Entry Points

| Function | Use Case |
|----------|----------|
| `ratatui::run()` | Most apps - auto init/restore |
| `ratatui::init()` / `restore()` | Manual control over lifecycle |
| `ratatui::init_with_options()` | Custom viewport |
| `Terminal::new()` | Custom backend construction |

## Viewport Modes

```rust
use ratatui::Viewport;

Viewport::Fullscreen           // Default
Viewport::Inline(5)            // Reserve 5 lines below cursor
Viewport::Fixed(rect)          // Specific rectangle
```

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Ratatui Component Hierarchy                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Application                                                    │
│       │                                                           │
│       ▼                                                           │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    Terminal                             │   │
│   │   Layout (Constraint-based)                             │   │
│   │   ├── Length(3) - Header                                 │   │
│   │   ├── Min(10)  - Content                                │   │
│   │   └── Fill(1)   - Footer                                 │   │
│   │       │                                                   │   │
│   │       ▼                                                   │   │
│   │   ┌─────────────────────────────────────────────────┐   │   │
│   │   │                 Frame                           │   │   │
│   │   │   Block::bordered()                              │   │   │
│   │   │       │                                           │   │   │
│   │   │       ├── Paragraph                              │   │   │
│   │   │       ├── List (StatefulWidget)                  │   │   │
│   │   │       ├── Table (StatefulWidget)                 │   │   │
│   │   │       ├── Chart                                  │   │   │
│   │   │       └── Scrollbar (StatefulWidget)             │   │   │
│   │   └─────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Types

| Type | Module | คำอธิบาย |
|------|--------|----------|
| `Terminal` | ratatui | Draws frames to a backend |
| `DefaultTerminal` | ratatui | Type alias for CrosstermBackend |
| `Frame` | ratatui | Single-frame drawing surface |
| `Buffer` | ratatui | 2D grid of `Cell` |
| `Cell` | buffer | Single character + style |
| `Rect` | layout | Area in terminal |
| `Color` | style | Color values |
| `Style` | style | Text styling |
| `Text` / `Line` / `Span` | text | Text primitives |
