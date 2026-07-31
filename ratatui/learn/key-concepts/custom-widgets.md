# Custom Widgets

## Overview

สร้าง custom widgets ด้วย implementation Widget trait หรือ StatefulWidget trait

## Basic Widget

### Implement Widget Trait

```rust
use ratatui::{widgets::Widget, Frame, buffer::Buffer, layout::Rect};

struct MyWidget {
    content: String,
}

impl Widget for MyWidget {
    fn render(self, area: Rect, buf: &mut Buffer) {
        buf.set_string(area.x, area.y, &self.content, Style::default());
    }
}
```

### Usage

```rust
let widget = MyWidget {
    content: String::from("Hello"),
};

frame.render_widget(widget, area);
```

## StatefulWidget

### Implement StatefulWidget Trait

```rust
use ratatui::widgets::StatefulWidget;

struct MyStatefulWidget {
    items: Vec<String>,
}

struct MyState {
    selected: usize,
}

impl StatefulWidget for MyStatefulWidget {
    type State = MyState;

    fn render(self, area: Rect, buf: &mut Buffer, state: &mut Self::State) {
        for (i, item) in self.items.iter().enumerate() {
            let style = if i == state.selected {
                Style::default().add_modifier(Modifier::BOLD)
            } else {
                Style::default()
            };
            buf.set_string(area.x, area.y + i as u16, item, style);
        }
    }
}
```

### Usage

```rust
let mut state = MyState { selected: 0 };
let widget = MyStatefulWidget {
    items: vec!["Item 1".to_string(), "Item 2".to_string()],
};

frame.render_stateful_widget(widget, area, &mut state);
```

## Advanced Patterns

### Composable Widgets

```rust
struct Container {
    title: String,
    content: Box<dyn Widget>,
}

impl Widget for Container {
    fn render(self, area: Rect, buf: &mut Buffer) {
        let block = Block::bordered().title(self.title);
        let inner = block.inner(area);
        block.render(area, buf);
        self.content.render(inner, buf);
    }
}
```

### Conditional Rendering

```rust
struct ConditionalWidget {
    condition: bool,
    true_widget: Box<dyn Widget>,
    false_widget: Box<dyn Widget>,
}

impl Widget for ConditionalWidget {
    fn render(self, area: Rect, buf: &mut Buffer) {
        if self.condition {
            self.true_widget.render(area, buf);
        } else {
            self.false_widget.render(area, buf);
        }
    }
}
```

## Buffer Manipulation

### Direct Buffer Access

```rust
use ratatui::buffer::Cell;

// Set single cell
buf.get_mut(x, y)
    .set_char('X')
    .set_style(Style::default().red());

// Set string
buf.set_string(x, y, "text", Style::default());

// Set line
buf.set_line(x, y, Line::from("text"), width);
```

### Drawing Shapes

```rust
// Draw border
let block = Block::bordered();
block.render(area, buf);

// Draw horizontal line
for x in area.left()..area.right() {
    buf.get_mut(x, area.top()).set_char('─');
}

// Draw vertical line
for y in area.top()..area.bottom() {
    buf.get_mut(area.left(), y).set_char('│');
}
```

## Best Practices

- ใช้ Widget trait สำหรับ stateless widgets
- ใช้ StatefulWidget trait สำหรับ stateful widgets
- Compose widgets จาก built-in widgets เมื่อเป็นไปได้
- ใช้ Block สำหรับ borders และ padding
- Test widgets ด้วย unit tests

## See Also

- [State Management](state-management.md)
- [Buffer & Rendering](buffer-rendering.md)
