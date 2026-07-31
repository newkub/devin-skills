# Control Flow

```rust
fn main() {
    // if expression
    let number = 7;
    if number < 5 {
        println!("less than 5");
    } else if number < 10 {
        println!("between 5 and 10");
    } else {
        println!("10 or more");
    }

    // Loop
    let mut count = 0;
    let result = loop {
        count += 1;
        if count == 10 {
            break count * 2;
        }
    };
    println!("Result: {}", result);

    // While
    let mut n = 3;
    while n > 0 {
        println!("{}", n);
        n -= 1;
    }

    // For
    for i in 1..=5 {
        println!("{}", i);
    }
}
```
