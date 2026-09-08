# Framework Ratatui API & Dependencies

## Install

```sh
# Add the crate (crossterm backend enabled by default)
cargo add ratatui

# Backend crate for terminal setup (raw mode, alternate screen)
cargo add crossterm

# Alternative backends
cargo add ratatui --no-default-features --features termion
cargo add ratatui --no-default-features --features termwiz
cargo add ratatui --no-default-features --features termina

# Scaffold from official templates (needs cargo-generate)
cargo install cargo-generate
cargo generate ratatui/templates hello-world
```

## Version

- Latest stable: 0.30.2
- MSRV: Rust 1.88
- [Package Registry](https://crates.io/crates/ratatui)
- [Repository](https://github.com/ratatui/ratatui)

## Dependencies

- Default backend: `crossterm` (feature). Alternatives via features: `termion`, `termwiz`, `termina`.
- Companion crates: `ratatui-core`, `ratatui-widgets`, `ratatui-crossterm`, `ratatui-termion`, `ratatui-termwiz`, `ratatui-macros` (re-exported/usable standalone).
- Common companion deps in apps: `color-eyre` or `anyhow` for errors, `crossterm` for event handling (`event::read`, `KeyCode`).

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `ratatui::run(app)` | Run app fn on default terminal | crossterm backend | closure `FnOnce(&mut DefaultTerminal) -> io::Result<()>` |
| `ratatui::init()` | Initialize default terminal | crossterm backend | `ratatui::try_init()` (fallible), `ratatui::restore()` |
| `Terminal::new(backend)` | Create terminal manually | any `Backend` impl | `CrosstermBackend::new(writer)`, `TerminalOptions` |
| `terminal.draw(render)` | Draw one frame | double-buffered | closure `FnOnce(&mut Frame)`, `CompletedFrame` return |
| `Frame::render_widget` | Render a widget into area | widget `impl Widget` | `(widget, area)`; `render_stateful_widget` for `StatefulWidget` |
| `Layout` / `Constraint` | Split terminal into rects | horizontal | `Constraint::{Length, Min, Max, Percentage, Ratio, Fill}`, `Direction::{Horizontal, Vertical}` |
| `ratatui::widgets::*` | Built-in widgets | unstyled | `Block`, `Paragraph`, `List`, `Table`, `Tabs`, `Gauge`, `BarChart`, `Chart`, `Canvas`, `Calendar`, `Sparkline`, `Scrollbar`, `Clear` |
| `Stylize` methods | Style text inline | terminal default | `.red()`, `.bold()`, `.underlined()`, `.bg()`, `.on_<color>()` on `Line`/`Span`/`&str` |
| `crossterm::event::*` | Input events | `event::read()` | `Event::Key`, `KeyCode`, `KeyModifiers`, `Event::Resize`, `Event::Mouse` |
| `cargo run` | Run the TUI app | dev profile | `--release` for optimized build |
| `cargo test` | Test rendering via `TestBackend` | `backend::TestBackend` | `terminal.backend().assert_buffer()` snapshot assertions |

## Source

- Official docs: https://ratatui.rs/
- API docs: https://docs.rs/ratatui/latest/ratatui/
- Templates: https://github.com/ratatui/templates
- Description: Ratatui — a Rust library for cooking up rich terminal user interfaces (TUIs).
