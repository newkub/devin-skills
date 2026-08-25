# Ratatui (Rust TUI Library) Reference

## Install

```bash
cargo add ratatui
```

Or add to `Cargo.toml`:

```toml
[dependencies]
ratatui = "0.30.2"
```

By default, Ratatui enables the `crossterm` backend. Alternative backends:

```bash
cargo add ratatui --no-default-features --features termion
cargo add ratatui --no-default-features --features termwiz
cargo add ratatui --no-default-features --features termina
```

```toml
[dependencies]
ratatui = { version = "0.30.2", default-features = false, features = ["termion"] }
```

## Version Info

- Latest stable: `0.30.2`
- Requires Rust `1.74+`
- Default backend: `crossterm`
- Alternative backends: `termion`, `termwiz`, `termina`

## Project Setup with Template

Install `cargo-generate`:

```bash
cargo install cargo-generate
```

Create a new project:

```bash
cargo generate ratatui/templates hello-world
```

## `Cargo.toml` Example

```toml
[package]
name = "hello-ratatui"
version = "0.1.0"
edition = "2024"

[dependencies]
color-eyre = "0.6.3"
crossterm = "0.29.0"
ratatui = "0.30.2"

[profile.release]
codegen-units = 1
lto = true
opt-level = "s"
strip = true
```

## Minimal Hello World

```rust
use ratatui::{DefaultTerminal, Frame};

fn main() -> color_eyre::Result<()> {
    color_eyre::install()?;
    ratatui::run(app)?;
    Ok(())
}

fn app(terminal: &mut DefaultTerminal) -> std::io::Result<()> {
    terminal.draw(render)?;
    std::io::stdin().read_line(&mut String::new())?;
    Ok(())
}

fn render(frame: &mut Frame) {
    frame.render_widget(
        ratatui::widgets::Paragraph::new("Hello Ratatui!"),
        frame.area(),
    );
}
```

## The Elm Architecture (TEA) Pattern

### Define Your Model

```rust
#[derive(Debug, Default)]
struct Model {
    counter: i32,
    running_state: RunningState,
}

#[derive(Debug, Default, PartialEq, Eq)]
enum RunningState {
    #[default]
    Running,
    Done,
}
```

### Handling Updates

```rust
#[derive(PartialEq)]
enum Message {
    Increment,
    Decrement,
    Reset,
    Quit,
}

fn update(model: &mut Model, msg: Message) {
    match msg {
        Message::Increment => model.counter += 1,
        Message::Decrement => model.counter -= 1,
        Message::Reset => model.counter = 0,
        Message::Quit => model.running_state = RunningState::Done,
    };
}
```

### Rendering the View

```rust
fn view(model: &Model, frame: &mut Frame) {
    frame.render_widget(
        ratatui::widgets::Paragraph::new(format!("Counter: {}", model.counter)),
        frame.area(),
    );
}
```

## Layout with Constraints

```rust
use ratatui::layout::{Layout, Constraint, Direction};

fn render(frame: &mut Frame) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Percentage(10),
            Constraint::Percentage(80),
            Constraint::Percentage(10),
        ])
        .split(frame.area());
}
```

## Terminal Setup with Crossterm

```rust
use crossterm::{
    execute,
    terminal::{enable_raw_mode, disable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::Terminal;
use ratatui::backend::CrosstermBackend;
use std::io::stdout;

fn main() -> std::io::Result<()> {
    enable_raw_mode()?;
    execute!(stdout(), EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout());
    let mut terminal = Terminal::new(backend)?;

    // Run app...

    disable_raw_mode()?;
    execute!(stdout(), LeaveAlternateScreen)?;
    Ok(())
}
```

## Panic Hook for Graceful Shutdown

```rust
use std::panic;

let original_hook = panic::take_hook();
panic::set_hook(Box::new(move |info| {
    let _ = crossterm::terminal::disable_raw_mode();
    let _ = crossterm::execute!(
        std::io::stdout(),
        crossterm::terminal::LeaveAlternateScreen
    );
    original_hook(info);
}));
```

## CLI Commands

```bash
cargo add ratatui                              # Add ratatui with crossterm backend
cargo add crossterm                            # Add crossterm separately
cargo generate ratatui/templates hello-world   # Create project from template
cargo run                                      # Run the TUI app
```

## Source

- https://ratatui.rs/installation/
- https://ratatui.rs/tutorials/hello-ratatui/
- https://ratatui.rs/concepts/application-patterns/the-elm-architecture/
