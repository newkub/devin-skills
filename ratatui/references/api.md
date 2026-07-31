# API Reference

## Core Functions

### ratatui::run

```rust
pub fn run<F, E>(run_fn: F) -> Result<(), E>
where
    F: FnOnce(&mut DefaultTerminal) -> Result<(), E>,
    E: From<io::Error>;
```

Main entry point - initializes terminal, runs app, restores on exit.

### ratatui::init / ratatui::restore

```rust
pub fn init() -> DefaultTerminal;
pub fn restore() -> Result<(), io::Error>;
```

Manual terminal lifecycle control.

### ratatui::try_init / ratatui::try_restore

```rust
pub fn try_init() -> Result<DefaultTerminal, io::Error>;
pub fn try_restore() -> Result<(), io::Error>;
```

Fallible versions that propagate errors.

### ratatui::init_with_options

```rust
pub fn init_with_options(options: TerminalOptions) -> DefaultTerminal;
pub fn try_init_with_options(options: TerminalOptions) -> Result<DefaultTerminal, io::Error>;
```

Custom viewport configuration.

## Modules

| Module | Purpose |
|--------|---------|
| `backend` | Backend trait and implementations |
| `buffer` | `Buffer`, `Cell` types |
| `init` | Init/restore functions |
| `layout` | `Layout`, `Constraint`, `Rect`, `Direction` |
| `prelude` | Common imports |
| `style` | `Style`, `Color`, `Modifier`, `Stylize` |
| `symbols` | Box drawing characters |
| `text` | `Text`, `Line`, `Span` |
| `widgets` | Built-in widgets |

## Type Aliases

| Type | Definition |
|------|------------|
| `DefaultTerminal` | `Terminal<CrosstermBackend<Stdout>>` |

## Enums

| Enum | Variants |
|------|----------|
| `Viewport` | `Fullscreen`, `Inline(u16)`, `Fixed(Rect)` |
| `Direction` | `Horizontal`, `Vertical` |

## Structs

| Struct | Description |
|--------|-------------|
| `Terminal` | Draws frames to a backend |
| `Frame` | Single-frame drawing surface |
| `Buffer` | 2D grid of `Cell` |
| `CompletedFrame` | State after a draw pass |
| `TerminalOptions` | Options for `Terminal::with_options` |

## Widget Traits

| Trait | Description |
|-------|-------------|
| `Widget` | Base trait - consumes self |
| `WidgetRef` | Unstable - takes `&self` |
| `StatefulWidget` | Widget with associated state |
| `StatefulWidgetRef` | Unstable - stateful + ref |
| `Stylize` | Extension for inline styling |

### Widget Trait

```rust
pub trait Widget {
    fn render(self, area: Rect, buf: &mut Buffer);
}
```

### StatefulWidget Trait

```rust
pub trait StatefulWidget {
    type State;
    fn render(self, area: Rect, buf: &mut Buffer, state: &mut Self::State);
}
```

## Frame

### Frame Methods

```rust
impl Frame {
    pub fn render_widget<W: Widget>(&mut self, w: W, area: Rect);
    pub fn render_stateful_widget<W: StatefulWidget>(&mut self, w: W, area: Rect, state: &mut W::State);
    pub fn area(&self) -> Rect;
    pub fn buffer_mut(&mut self) -> &mut Buffer;
    pub fn count(&self) -> usize;
}
```

## Terminal

### Key Methods

```rust
impl<B: Backend> Terminal<B> {
    pub fn draw<F>(&mut self, f: F) -> io::Result<CompletedFrame>
    where F: FnOnce(&mut Frame);
    pub fn try_draw<F>(&mut self, f: F) -> io::Result<CompletedFrame>;
    pub fn resize(&mut self, area: Rect) -> io::Result<()>;
    pub fn clear(&mut self) -> io::Result<()>;
    pub fn hide_cursor(&mut self) -> io::Result<()>;
    pub fn show_cursor(&mut self) -> io::Result<()>;
    pub fn get_frame(&mut self) -> Frame;
    pub fn flush(&mut self) -> io::Result<()>;
    pub fn swap_buffers(&mut self);
    pub fn backend(&self) -> &B;
    pub fn backend_mut(&mut self) -> &mut B;
}
```

## Backend

| Backend | Feature | Description |
|---------|---------|-------------|
| `CrosstermBackend` | `crossterm_0_29` (default) | Cross-platform |
| `CrosstermBackend` | `crossterm_0_28` | Crossterm 0.28 |
| `TermionBackend` | `termion` | Unix only |
| `TermwizBackend` | `termwiz` | Advanced rendering |

## See Also

| File | Description |
|------|-------------|
| [api-widgets.md](api-widgets.md) | Widget API reference |
