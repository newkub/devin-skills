# Traits

### Defining Traits

```rust
trait Drawable {
    fn draw(&self);
    fn area(&self) -> f64;
}

struct Circle { radius: f64 }
struct Rectangle { width: f64, height: f64 }

impl Drawable for Circle {
    fn draw(&self) {
        println!("Circle with radius {}", self.radius);
    }
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}

impl Drawable for Rectangle {
    fn draw(&self) {
        println!("Rectangle {}x{}", self.width, self.height);
    }
    fn area(&self) -> f64 {
        self.width * self.height
    }
}
```

### Default Implementation

```rust
trait Greeting {
    fn name(&self) -> &str;
    fn greet(&self) {
        println!("Hello, {}!", self.name());
    }
}
```

### Trait Bounds

```rust
// Single trait bound
fn print_debug(item: &impl std::fmt::Debug) {
    println!("{:?}", item);
}

// Multiple bounds
fn print_display_debug(item: &(impl std::fmt::Display + std::fmt::Debug)) {
    println!("{} {:?}", item, item);
}

// Where clause
fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: std::fmt::Display + Clone,
    U: std::fmt::Debug + Clone,
{
    42
}
```
