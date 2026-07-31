# State Management

## Overview

State management ใน Ratatui ใช้ StatefulWidget trait สำหรับ widgets ที่ต้องการ maintain state ระหว่าง render passes

## StatefulWidget Pattern

### Basic StatefulWidget

```rust
use ratatui::widgets::{List, ListState, StatefulWidget};

let items = vec!["Item 1", "Item 2", "Item 3"];
let mut state = ListState::default();
state.select(Some(0)); // select first item

List::new(items)
    .render(area, buf, &mut state);
```

### Custom StatefulWidget

```rust
use ratatui::widgets::StatefulWidget;

struct MyWidget {
    // widget properties
}

struct MyWidgetState {
    selected_index: usize,
    // other state
}

impl StatefulWidget for MyWidget {
    type State = MyWidgetState;

    fn render(self, area: Rect, buf: &mut Buffer, state: &mut Self::State) {
        // render using state
    }
}
```

## Common Stateful Widgets

### List

```rust
let mut list_state = ListState::default();
list_state.select(Some(0));

// In event loop
if key.code == KeyCode::Down {
    if let Some(selected) = list_state.selected() {
        list_state.select(Some(selected + 1));
    }
}
```

### Table

```rust
let mut table_state = TableState::default();
table_state.select(Some(0));

// Handle selection
if key.code == KeyCode::Up {
    if let Some(selected) = table_state.selected() {
        if selected > 0 {
            table_state.select(Some(selected - 1));
        }
    }
}
```

### Tree

```rust
let mut tree_state = TreeState::default();
tree_state.select(vec![0]); // select first item at root

// Handle expand/collapse
if key.code == KeyCode::Enter {
    if let Some(selected) = tree_state.selected() {
        tree_state.toggle(selected);
    }
}
```

## Application State

### Global State Pattern

```rust
struct AppState {
    items: Vec<String>,
    selected: usize,
    filter: String,
}

impl AppState {
    fn new() -> Self {
        Self {
            items: vec![],
            selected: 0,
            filter: String::new(),
        }
    }
    
    fn handle_key(&mut self, key: KeyCode) {
        match key {
            KeyCode::Down => self.selected = self.selected.saturating_add(1),
            KeyCode::Up => self.selected = self.selected.saturating_sub(1),
            _ => {}
        }
    }
}
```

### State with Lifecycle

```rust
struct App {
    should_quit: bool,
    list_state: ListState,
}

impl App {
    fn new() -> Self {
        Self {
            should_quit: false,
            list_state: ListState::default(),
        }
    }
    
    fn run(&mut self, mut terminal: Terminal) -> Result<()> {
        while !self.should_quit {
            terminal.draw(|f| self.render(f))?;
            self.handle_events()?;
        }
        Ok(())
    }
}
```

## Best Practices

- เก็บ state แยกจาก widget definitions
- Initialize state ก่อน render loop
- Update state ใน event handler ไม่ใช่ใน render
- Clone state ถ้าจำเป็นสำหรับ async operations

## See Also

- [Event Handling](event-handling.md)
- [Custom Widgets](custom-widgets.md)
