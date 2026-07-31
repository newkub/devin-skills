# Variables and Mutability

```rust
fn main() {
    // Immutable by default
    let x = 5;
    // x = 6; // ERROR: cannot assign twice

    // Mutable variable
    let mut y = 5;
    y = 6; // OK

    // Constants
    const MAX_POINTS: u32 = 100_000;

    // Shadowing
    let z = 5;
    let z = z + 1; // OK: new variable with same name
}
```
