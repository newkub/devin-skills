# Enum and Match

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

fn process(msg: Message) {
    match msg {
        Message::Quit => println!("Quit"),
        Message::Move { x, y } => println!("Move to ({}, {})", x, y),
        Message::Write(text) => println!("Write: {}", text),
    }
}

fn main() {
    process(Message::Quit);
    process(Message::Move { x: 10, y: 20 });
    process(Message::Write(String::from("Hello")));
}
```
