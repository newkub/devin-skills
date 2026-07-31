# Ownership

## Concept Overview

Ownership เป็นระบบจัดการ memory ที่ช่วยให้ Rust รับประกัน memory safety โดยไม่ต้องมี garbage collector

## Rules of Ownership

```text
┌─────────────────────────────────────────────────────────────┐
│                  Three Ownership Rules                     │
├─────────────────────────────────────────────────────────────┤
│  1. Each value has exactly one owner                        │
│  2. When the owner goes out of scope, the value is dropped │
│  3. There can only be one owner at a time                  │
└─────────────────────────────────────────────────────────────┘
```

## Move Semantics

```rust
fn main() {
    // String is stored on the heap, s1 owns it
    let s1 = String::from("hello");
    
    // Ownership is moved to s2, s1 is no longer valid
    let s2 = s1;
    
    // This will cause a compile error:
    // println!("{}", s1);  // Error: value borrowed after move
    println!("{}", s2);     // OK: s2 is the owner
}
```

### Stack-Only Types (Copy)

```rust
fn main() {
    // Integer types implement Copy trait
    let x = 5;
    let y = x;  // x is still valid, because i32 is Copy
    
    println!("x: {}, y: {}", x, y);  // Both valid
}
```

## Copy vs Move

| Type | Behavior | Examples |
|------|----------|----------|
| Copy | Value is copied, original still valid | i32, f64, bool, char, Tuples of Copy types |
| Move | Ownership transferred, original invalid | String, Vec, Box, custom structs |

## Ownership in Functions

```rust
fn take_ownership(s: String) {  // s takes ownership
    println!("{}", s);
}  // s is dropped here

fn borrow(s: &String) {  // s is borrowed
    println!("{}", s);
}  // s is still valid here (borrow ends)

fn main() {
    let s = String::from("hello");
    
    take_ownership(s);  // s is moved into function
    // println!("{}", s);  // Error: s is no longer valid
    
    let s2 = String::from("world");
    borrow(&s2);  // s2 is borrowed
    println!("{}", s2);  // OK: s2 still owns the value
}
```

## Returning Ownership

```rust
fn calculate_length(s: String) -> (String, usize) {
    let len = s.len();
    (s, len)  // Return ownership back to caller
}

fn main() {
    let s = String::from("hello");
    let (s, len) = calculate_length(s);
    println!("Length of '{}' is {}", s, len);
}
```

## Clone for Explicit Deep Copy

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();  // Explicit deep copy
    
    println!("s1: {}, s2: {}", s1, s2);  // Both valid
}
```

## Common Pitfalls

```rust
// WRONG: Trying to use moved value
let s1 = String::from("hello");
let s2 = s1;
println!("{}", s1);  // Compile error

// CORRECT: Borrow instead of move
let s1 = String::from("hello");
let len = get_length(&s1);
println!("Length: {}, s1: {}", len, s1);

// CORRECT: Clone if you need two owners
let s1 = String::from("hello");
let s2 = s1.clone();
println!("s1: {}, s2: {}", s1, s2);
```

## Ownership with Loops

```rust
fn main() {
    let strings = vec![
        String::from("one"),
        String::from("two"),
        String::from("three"),
    ];
    
    for s in strings {  // Each String is moved into the loop
        println!("{}", s);
    }  // All strings are dropped here
    
    // println!("{:?}", strings);  // Error: strings was moved
}
```

## Using References to Avoid Moving

```rust
fn print_all(strings: &[String]) {  // Borrow slice of Strings
    for s in strings {
        println!("{}", s);
    }
}

fn main() {
    let strings = vec![
        String::from("one"),
        String::from("two"),
    ];
    
    print_all(&strings);  // Pass reference
    println!("{:?}", strings);  // OK: still owner
}
```