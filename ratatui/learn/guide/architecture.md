# Architecture

## Crate Organization (v0.30+)

```
┌────────────────────────────────────────────────────────────────┐
│                 Ratatui Workspace (v0.30+)                     │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                  ratatui (main crate)                       ││
│  │                  - Re-exports everything                   ││
│  │                  - ratatui::run() entry point              ││
│  └────────────┬───────────────────────────────────────────────┘│
│               │                                                  │
│       ┌───────┼──────────┬──────────────┬──────────────┐        │
│       ▼       ▼          ▼              ▼              ▼        │
│  ┌────────┐ ┌──────────┐ ┌────────────┐ ┌────────────┐ ┌──────┐│
│  │ratatui-│ │ ratatui- │ │  ratatui-   │ │  ratatui-  │ │ratat-││
│  │  core  │ │ widgets  │ │  crossterm  │ │   termion  │ │ui-   ││
│  │        │ │          │ │             │ │            │ │term- ││
│  │traits  │ │  built-  │ │   default   │ │ unix only  │ │wiz   ││
│  │  types │ │   in     │ │  backend    │ │            │ │      ││
│  │ Widget │ │ widgets  │ │             │ │            │ │      ││
│  └────────┘ └──────────┘ └────────────┘ └────────────┘ └──────┘│
│                                                                  │
│                       ┌──────────────────┐                      │
│                       │   ratatui-macros │                      │
│                       │   text! line!    │                      │
│                       └──────────────────┘                      │
└────────────────────────────────────────────────────────────────┘
```

| Crate | Purpose | Audience |
|-------|---------|----------|
| `ratatui` | Main crate, re-exports | App developers |
| `ratatui-core` | Traits, types, Buffer | Widget library authors |
| `ratatui-widgets` | Built-in widgets | Apps needing only widgets |
| `ratatui-crossterm` | Crossterm backend | Backend users |
| `ratatui-termion` | Termion backend | Unix backend users |
| `ratatui-termwiz` | Termwiz backend | Advanced backend users |
| `ratatui-macros` | text!, line!, span!, layout! | All users |

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Ratatui Architecture                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Application Layer                       │  │
│  │  App State ──► Event Handling ──► Widget Rendering        │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                           │                                       │
│  ┌────────────────────────▼──────────────────────────────────┐  │
│  │                    Ratatui Core                            │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │   Widgets   │  │   Layout    │  │    Style    │       │  │
│  │  │ Paragraph   │  │ Constraint  │  │   Colors    │       │  │
│  │  │ List, Table │  │ Direction   │  │  Modifiers  │       │  │
│  │  │ Chart       │  │ Alignment   │  │   Stylize   │       │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │  │
│  │                                                           │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                           │                                       │
│  ┌────────────────────────▼──────────────────────────────────┐  │
│  │                     Backend Layer                          │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │  Crossterm  │  │   Termion   │  │   Termwiz   │       │  │
│  │  │  (default)  │  │  (unix)     │  │             │       │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Core Modules

| Module | Purpose |
|--------|---------|
| `backend` | Backend trait and implementations |
| `buffer` | `Buffer`, `Cell` types |
| `init` | `init()`, `restore()`, `try_init()`, `try_restore()` |
| `layout` | `Layout`, `Constraint`, `Rect`, `Direction` |
| `prelude` | Common imports |
| `style` | `Style`, `Color`, `Modifier`, `Stylize` |
| `symbols` | Box drawing characters |
| `text` | `Text`, `Line`, `Span` |
| `widgets` | Built-in widgets |

## Core Types

```rust
pub enum Constraint {
    Length(u16),        // Fixed rows/cols
    Percentage(u16),    // % of available space
    Ratio(u16, u16),    // Ratio-based sizing
    Min(u16),           // Minimum size
    Max(u16),           // Maximum size
    Fill(u16),          // Distribute remaining space
}

pub enum Direction {
    Horizontal,
    Vertical,
}

pub enum Viewport {
    Fullscreen,
    Inline(u16),
    Fixed(Rect),
}
```

## Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    Rendering Pipeline Detail                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  App State                                                       │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Layout Calculation                       │ │
│  │  Layout::vertical([...]).areas(area)                        │ │
│  └──────────────────────────┬──────────────────────────────────┘ │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Widget Rendering                         │ │
│  │  widget.render(area, buffer)                                │ │
│  └──────────────────────────┬──────────────────────────────────┘ │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Buffer Diff                              │ │
│  │  Compare current vs previous buffer                         │ │
│  │  Emit ANSI escape sequences for changes                     │ │
│  └──────────────────────────┬──────────────────────────────────┘ │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Terminal Output                          │ │
│  │  Write to stdout via Backend                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Traits

| Trait | Module | คำอธิบาย |
|-------|--------|----------|
| `Widget` | widgets | Base trait - consumes self |
| `WidgetRef` | widgets | Unstable - takes `&self` |
| `StatefulWidget` | widgets | Widget with associated state |
| `StatefulWidgetRef` | widgets | Unstable - stateful + ref |
| `Backend` | backend | Terminal backend contract |
| `Stylize` | style | Fluent styling extension |
