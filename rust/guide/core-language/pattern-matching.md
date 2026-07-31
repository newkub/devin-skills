# Pattern Matching

### Basic Patterns

```rust
let x = 1;

match x {
    1 => println!("one"),
    2 => println!("two"),
    3 => println!("three"),
    _ => println!("other"),
}

// With guards
match x {
    n if n > 0 => println!("positive: {}", n),
    n if n < 0 => println!("negative: {}", n),
    _ => println!("zero"),
}
```

### Destructuring

```rust
// Tuple destructuring
let (a, b) = (1, "hello");

// Struct destructuring
struct Point { x: i32, y: i32 }
let p = Point { x: 10, y: 20 };
let Point { x, y } = p;

// Nested destructuring
let ((a, b), Point { x, y }) = ((1, 2), Point { x: 3, y: 4 });
```

### Option & Result

```rust
// Option pattern matching
fn maybe_double(opt: Option<i32>) -> i32 {
    match opt {
        Some(n) => n * 2,
        None => 0,
    }
}

// Result pattern matching
fn parse_number(s: &str) -> Result<i32, ParseIntError> {
    match s.parse::<i32>() {
        Ok(n) => Ok(n),
        Err(e) => Err(e),
    }
}

// Using if let for cleaner code
if let Some(value) = option {
    println!("Got: {}", value);
}
```
