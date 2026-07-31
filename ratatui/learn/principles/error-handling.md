# Error Handling Principles

## Overview

Handle errors อย่างถูกต้องใน TUI applications เพื่อความเสถียรและ UX ที่ดี

## Terminal Errors

### Init Errors

```rust
use ratatui::try_init;

// ✅ Good - handle init errors
fn run_app() -> Result<()> {
    let mut terminal = try_init()
        .map_err(|e| anyhow::anyhow!("Failed to initialize terminal: {}", e))?;
    
    // app logic
    
    Ok(())
}

fn main() {
    if let Err(e) = run_app() {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}
```

### Restore Errors

```rust
// ✅ Good - ensure restore เสมอ
fn run_app() -> Result<()> {
    let mut terminal = try_init()?;
    
    let result = (|| -> Result<()> {
        // app logic
        Ok(())
    })();
    
    // Restore แม้ว่าจะ error
    let _ = try_restore();
    
    result
}
```

## Event Loop Errors

### Graceful Degradation

```rust
// ✅ Good - handle errors ใน loop
loop {
    match terminal.draw(|frame| {
        render_ui(frame);
    }) {
        Ok(_) => {}
        Err(e) => {
            eprintln!("Render error: {}", e);
            // continue หรือ break ตาม severity
        }
    }
    
    match handle_events() {
        Ok(should_quit) => {
            if should_quit {
                break;
            }
        }
        Err(e) => {
            eprintln!("Event error: {}", e);
            // continue
        }
    }
}
```

### Error Display

```rust
// ✅ Good - display errors ใน UI
struct App {
    error: Option<String>,
}

impl App {
    fn show_error(&mut self, error: String) {
        self.error = Some(error);
    }
    
    fn clear_error(&mut self) {
        self.error = None;
    }
}

fn render(app: &App, frame: &mut Frame) {
    if let Some(error) = &app.error {
        let error_block = Block::bordered()
            .title("Error")
            .title_style(Style::default().fg(Color::Red))
            .borders(Borders::ALL);
        
        let error_text = Paragraph::new(error.as_str())
            .block(error_block)
            .style(Style::default().fg(Color::Red));
        
        frame.render_widget(error_text, error_area);
    }
}
```

## I/O Errors

### File Operations

```rust
use std::fs;

fn load_config(path: &str) -> Result<Config> {
    fs::read_to_string(path)
        .map_err(|e| anyhow::anyhow!("Failed to read config: {}", e))
        .and_then(|content| {
            serde_json::from_str(&content)
                .map_err(|e| anyhow::anyhow!("Failed to parse config: {}", e))
        })
}

// ใน app
match load_config("config.json") {
    Ok(config) => app.set_config(config),
    Err(e) => app.show_error(e.to_string()),
}
```

### Network Operations

```rust
fn fetch_data(url: &str) -> Result<String> {
    reqwest::blocking::get(url)
        .map_err(|e| anyhow::anyhow!("Network error: {}", e))?
        .text()
        .map_err(|e| anyhow::anyhow!("Failed to read response: {}", e))
}

// ใน app ด้วย timeout
match tokio::time::timeout(
    Duration::from_secs(5),
    fetch_data_async(url)
).await {
    Ok(Ok(data)) => app.set_data(data),
    Ok(Err(e)) => app.show_error(e.to_string()),
    Err(_) => app.show_error("Request timed out".to_string()),
}
```

## Panic Handling

### Prevent Panics

```rust
// ❌ Bad - unwrap อาจ panic
let value = some_option.unwrap();

// ✅ Good - handle gracefully
let value = some_option.ok_or_else(|| anyhow!("Missing value"))?;
```

### Catch Panics

```rust
use std::panic;

fn run_with_panic_handler<F>(f: F) -> Result<()>
where
    F: FnOnce() -> Result<()>,
{
    panic::catch_unwind(panic::AssertUnwindSafe(f))
        .map_err(|e| anyhow::anyhow!("Panic: {:?}", e))?
}

fn main() {
    if let Err(e) = run_with_panic_handler(|| run_app()) {
        eprintln!("Fatal error: {}", e);
        std::process::exit(1);
    }
}
```

## Error Recovery

### Retry Logic

```rust
fn with_retry<F, T>(mut f: F, max_retries: u32) -> Result<T>
where
    F: FnMut() -> Result<T>,
{
    let mut retries = 0;
    loop {
        match f() {
            Ok(value) => return Ok(value),
            Err(e) if retries < max_retries => {
                retries += 1;
                std::thread::sleep(Duration::from_millis(100 * retries));
            }
            Err(e) => return Err(e),
        }
    }
}
```

### Fallback Values

```rust
fn get_config() -> Config {
    load_config("config.json")
        .unwrap_or_else(|e| {
            eprintln!("Failed to load config: {}, using defaults", e);
            Config::default()
        })
}
```

## Best Practices

- ใช้ `try_init()` / `try_restore()` สำหรับ error handling
- Ensure restore เสมอ แม้ว่าจะ error
- Display errors ใน UI สำหรับ user feedback
- Handle errors ใน event loop อย่าง graceful
- หลีกเลี่ยง unwrap และ expect
- Implement retry logic สำหรับ transient errors
- Provide fallback values เมื่อเป็นไปได้

## See Also

- [Terminal Lifecycle](../key-concepts/terminal-lifecycle.md)
- [State Management](../key-concepts/state-management.md)
