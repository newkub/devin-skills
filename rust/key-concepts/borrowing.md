# Borrowing

## Concept Overview

Borrowing คือการอ้างอิงถึงข้อมูลโดยไม่ต้องย้าย ownership ช่วยให้สามารถใช้ข้อมูลได้โดยไม่เปลี่ยน owner

## Rules of Borrowing

```text
┌─────────────────────────────────────────────────────────────┐
│                   Borrowing Rules                           │
├─────────────────────────────────────────────────────────────┤
│  1. At any time, you can have EITHER one mutable reference  │
│     OR any number of immutable references                  │
│  2. References must always be valid (no dangling pointers)  │
└─────────────────────────────────────────────────────────────┘
```

## Immutable Borrow

```rust
fn main() {
    let s = String::from("hello");
    
    // Immutable borrow - can have multiple
    let len = calculate_length(&s);
    let upper = to_uppercase(&s);
    
    println!("'{}' has {} characters", s, len);
    println!("Uppercase: {}", upper);
    println!("{}", s);  // s still valid
}

fn calculate_length(s: &String) -> usize {
    s.len()  // Read-only access
}

fn to_uppercase(s: &String) -> String {
    s.to_uppercase()  // Read-only access
}
```

## Mutable Borrow

```rust
fn main() {
    let mut s = String::from("hello");
    
    // Mutable borrow - can only have one
    append_exclamation(&mut s);
    
    println!("{}", s);  // "hello!"
}

fn append_exclamation(s: &mut String) {
    s.push('!');  // Modify the borrowed value
}
```

## Borrow Checker Rules in Action

```rust
fn main() {
    let mut s = String::from("hello");
    
    let r1 = &s;        // Immutable borrow
    let r2 = &s;        // Another immutable borrow - OK
    println!("{} and {}", r1, r2);
    
    // r1 and r2 are no longer used after this point
    
    let r3 = &mut s;    // Mutable borrow - OK (r1, r2 ended)
    r3.push_str(" world");
    println!("{}", r3);
}
```

### ERROR Case - Mixing Immutable and Mutable

```rust
fn main() {
    let mut s = String::from("hello");
    
    let r1 = &s;             // Immutable borrow
    let r2 = &mut s;         // ERROR: can't have mutable while immutable exists
    println!("{} and {}", r1, r2);  // r1 is still used here
}
```

## Borrowing with Functions

### Pass by Reference

```rust
fn change(s: &String) {
    // s.push_str("!");  // ERROR: can't modify immutable reference
    println!("{}", s);
}

fn main() {
    let s = String::from("hello");
    change(&s);
    println!("{}", s);  // OK: s not modified
}
```

### Mutable Reference

```rust
fn change(s: &mut String) {
    s.push_str("!");  // OK: can modify mutable reference
}

fn main() {
    let mut s = String::from("hello");
    change(&mut s);
    println!("{}", s);  // "hello!"
}
```

## Reference Scope

```rust
fn main() {
    let mut s = String::from("hello");
    
    let r = &s;                    // r is valid here
    println!("{}", r);              // r is used here
    
    // r goes out of scope here (after last use)
    
    let r2 = &mut s;               // OK: r is no longer in scope
    r2.push_str(" world");
    println!("{}", r2);
}
```

## Multiple Immutable Borrows

```rust
fn main() {
    let s = String::from("hello");
    
    let r1 = &s;
    let r2 = &s;
    let r3 = &s;  // Multiple immutable borrows are fine
    
    println!("{} {} {}", r1, r2, r3);
}
```

## One Mutable Borrow

```rust
fn main() {
    let mut s = String::from("hello");
    
    let r1 = &mut s;
    // let r2 = &mut s;  // ERROR: can only have one mutable borrow
    r1.push_str("!");
    println!("{}", r1);
}
```

## Slices - Reference to Part of Collection

```rust
fn main() {
    let s = String::from("hello world");
    
    // String slice
    let hello = &s[0..5];    // Reference to first 5 bytes
    let world = &s[6..11];   // Reference to last 5 bytes
    
    println!("{} {}", hello, world);
    
    // Array slice
    let arr = [1, 2, 3, 4, 5];
    let slice = &arr[1..4];  // [2, 3, 4]
    println!("{:?}", slice);
}
```

## Borrowing in Structs

```rust
struct User {
    name: String,
    email: String,
}

struct UserBuilder<'a> {
    name: &'a str,
    email: &'a str,
}

impl<'a> UserBuilder<'a> {
    fn new() -> Self {
        UserBuilder {
            name: "",
            email: "",
        }
    }
    
    fn name(&mut self, name: &'a str) -> &mut Self {
        self.name = name;
        self
    }
}
```

## Best Practices

```rust
// GOOD: Borrowed parameters when you only read
fn process(data: &[u8]) { }

// GOOD: Mutable borrow only when modification needed
fn transform(data: &mut Vec<i32>) { }

// BAD: Taking ownership when borrowing would suffice
fn process(data: String) { }  // Unnecessary

// GOOD: Take ownership only when you need to consume the data
fn consume(data: Vec<i32>) { }

// Reference rules summary:
// - Read-only operations: Use &T
// - Modify operations: Use &mut T
// - Transfer ownership: Take T
```