# Terminal Lifecycle

## Overview

Terminal lifecycle คือกระบวนการจัดการ terminal ตั้งแต่เริ่มต้นจนจบการทำงานของ TUI application

## Phases

### 1. Initialization

เริ่มต้นด้วยการ initialize terminal backend:

```rust
use ratatui::init;

let mut terminal = init();
```

หรือใช้แบบ fallible:

```rust
use ratatui::try_init;

let mut terminal = try_init()?;
```

### 2. Drawing Loop

วน loop เพื่อ render UI และ handle events:

```rust
loop {
    terminal.draw(|frame| {
        // render widgets
    })?;
    
    // handle events
    if should_quit {
        break;
    }
}
```

### 3. Restoration

คืนค่า terminal สู่สถานะเดิม:

```rust
use ratatui::restore;

restore()?;
```

## Entry Points

### ratatui::run()

วิธีที่ง่ายที่สุด - handle init, run, restore อัตโนมัติ:

```rust
ratatui::run(|mut terminal| {
    // app logic
})?;
```

### init() / restore()

Manual control เมื่อต้องการ custom event loop:

```rust
let mut terminal = init();
// app logic
restore()?;
```

### init_with_options()

Custom viewport configuration:

```rust
let options = TerminalOptions {
    viewport: Viewport::Inline(10),
};
let mut terminal = init_with_options(options)?;
```

## Best Practices

- เสมอ restore terminal เมื่อ app จบ (ใช้ `run()` หรือ `try_restore()`)
- Handle resize events อย่างถูกต้อง
- ใช้ `try_init()` / `try_restore()` เมื่อต้องการ error handling
- ใช้ `init_with_options()` สำหรับ inline rendering หรือ fixed viewport

## See Also

- [Terminal Backends](backends.md)
- [Event Handling](event-handling.md)
