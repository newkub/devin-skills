# Struct and Impl

```rust
struct User {
    name: String,
    email: String,
    active: bool,
}

impl User {
    fn new(name: String, email: String) -> Self {
        User {
            name,
            email,
            active: true,
        }
    }

    fn greet(&self) {
        println!("Hello, I'm {}", self.name);
    }
}

fn main() {
    let user = User::new(
        String::from("Alice"),
        String::from("alice@example.com"),
    );
    user.greet();
}
```
