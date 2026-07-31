# Integration

## With Other Rust Crates

### Tokio for Async

```rust
use tokio::time::{sleep, Duration};

async fn fetch_data() -> String {
    sleep(Duration::from_secs(1)).await;
    "data".to_string()
}

// In app: spawn a task and poll results
```

### Serde for Themes and Config

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Theme {
    primary: String,
    background: String,
    accent: String,
}

fn load_theme(path: &str) -> Result<Theme, Box<dyn std::error::Error>> {
    let data = std::fs::read_to_string(path)?;
    let theme: Theme = serde_json::from_str(&data)?;
    Ok(theme)
}
```

### Tracing for Logging

```rust
use tracing::{info, warn, instrument};

#[instrument]
fn render_ui(state: &AppState) {
    info!(items = state.items.len(), "rendering");
    if state.items.is_empty() {
        warn!("empty items list");
    }
}
```

## Snapshot Testing

### Insta + TestBackend

```rust
use insta::assert_snapshot;
use ratatui::backend::TestBackend;
use ratatui::Terminal;

#[test]
fn renders_list_correctly() {
    let backend = TestBackend::new(20, 5);
    let mut terminal = Terminal::new(backend).unwrap();
    terminal.draw(|f| render(f, &app())).unwrap();
    assert_snapshot!(terminal.backend());
}
```

## With Databases

### SQLite with rusqlite

```rust
use rusqlite::{Connection, Result};

fn get_items(conn: &Connection) -> Result<Vec<String>> {
    let mut stmt = conn.prepare("SELECT name FROM items")?;
    let items = stmt
        .query_map([], |row| row.get(0))?
        .collect::<Result<Vec<String>>>()?;
    Ok(items)
}
```

## With HTTP Clients

### Reqwest

```rust
use reqwest::Client;

async fn fetch_data(url: &str) -> Result<String, reqwest::Error> {
    let client = Client::new();
    let response = client.get(url).send().await?;
    let body = response.text().await?;
    Ok(body)
}
```

## With File System

### Walkdir for File Browsing

```rust
use walkdir::WalkDir;

fn list_files(path: &str) -> Vec<String> {
    WalkDir::new(path)
        .into_iter()
        .filter_map(|e| e.ok())
        .map(|e| e.path().display().to_string())
        .collect()
}
```

## With CLI Arguments

### Clap

```rust
use clap::Parser;

#[derive(Parser)]
struct Args {
    #[arg(long, default_value = "config.toml")]
    config: String,
    #[arg(long)]
    debug: bool,
}

fn main() {
    let args = Args::parse();
    // pass to app
}
```

## With Other TUI Libraries

| Crate | Purpose |
|-------|---------|
| `crossterm` | Terminal I/O (bundled with default ratatui) |
| `termion` | Alternative Unix terminal backend |
| `termwiz` | Advanced terminal with sixel |
| `tui-input` | Input widgets (text field with cursor) |
| `tui-textarea` | Multi-line text editor |
| `color-eyre` | Better error reports |
| `anyhow` | Error handling |

### Tui-input for Text Input

```rust
use tui_input::Input;

let mut input = Input::default();
input.push_str("hello");
// render as Paragraph with input.value()
```

## Crate Workspace

| Crate | Use When |
|-------|----------|
| `ratatui` | Default - re-exports everything |
| `ratatui-core` | Building custom widget libraries |
| `ratatui-widgets` | Need only built-in widgets |
| `ratatui-crossterm` | Direct crossterm backend access |
| `ratatui-macros` | text!, line!, span!, layout! macros |
