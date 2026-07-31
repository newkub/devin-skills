# Lifetimes

## Concept Overview

Lifetimes เป็นระบบที่ช่วยให้ Rust ตรวจสอบว่า references จะ valid ตลอดเวลาที่ถูกใช้งาน ป้องกัน dangling references

## Why Lifetimes?

```rust
// This would be dangerous if allowed:
fn dangling() -> &String {  // ERROR: missing lifetime specifier
    let s = String::from("hello");
    &s  // s is dropped here, reference is dangling!
}
```

## Lifetime Annotations

```rust
// 'a is a lifetime parameter - declares that x and y live at least as long as 'a
// and the return value lives at least as long as 'a
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
        println!("Longest: {}", result);  // OK: result used before s2 drops
    }
    // println!("{}", result);  // ERROR: s2 dropped, result may reference it
}
```

## Lifetime Syntax

```rust
// Reference with lifetime 'a
 &'a str

// Mutable reference with lifetime 'a
 &'a mut str

// Struct with lifetime
struct<'a> Context<'a> {
    text: &'a str,
}
```

## Struct with Lifetime

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,  // This reference must outlive the struct
}

fn main() {
    let novel = String::from("Call me Ishmael. Years ago...");
    let first_sentence = novel.split('.').next().unwrap();
    
    let excerpt = ImportantExcerpt {
        part: first_sentence,
    };
    
    println!("{}", excerpt.part);  // OK: excerpt owns the reference
}
```

## Methods with Lifetimes

```rust
struct Article<'a> {
    title: &'a str,
}

impl<'a> Article<'a> {
    // Method returns reference with same lifetime as struct
    fn get_title(&self) -> &'a str {
        self.title
    }
    
    // Method with additional lifetime parameter
    fn longest_sentence<'b>(&self, other: &'b str) -> &'b str {
        if self.title.len() > other.len() {
            self.title
        } else {
            other
        }
    }
}
```

## Lifetime Elision

Rust can infer lifetimes in certain cases:

```rust
// These are equivalent:
fn first_word(s: &str) -> &str { ... }
fn first_word<'a>(s: &'a str) -> &'a str { ... }

// Rule 1: Each reference parameter gets its own lifetime
fn foo(x: &i32, y: &i32) -> &i32 { ... }
fn foo<'a, 'b>(x: &'a i32, y: &'b i32) -> &i32 { ... }  // Ambiguous!

// Rule 2: If there's exactly one input lifetime, it's assigned to output
fn get_first(s: &str) -> &str { ... }
fn get_first<'a>(s: &'a str) -> &'a str { ... }

// Rule 3: If one parameter is &self, output gets self's lifetime
impl Article {
    fn level(&self) -> &str { ... }
    fn level<'a>(&'a self) -> &'a str { ... }
}
```

## Lifetime in Functions

```rust
// Multiple lifetimes
fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &'b str {
    if x.len() > y.len() { x } else { y }
}

// Static lifetime - lives for entire program duration
fn get_default() -> &'static str {
    "default value"
}

// 'a tied to input
fn first_or_default<'a>(first: Option<&'a str>) -> &'a str {
    first.unwrap_or("default")
}
```

## Lifetime Subtyping

```rust
// 'long must live at least as long as 'short
fn require_valid<'long, 'short>(long: &'long str, short: &'short str)
where
    'long: 'short,
{
    println!("{} {}", long, short);
}

fn main() {
    let long_lived = String::from("long");
    {
        let short_lived = String::from("short");
        // This would fail: short doesn't live as long as long
        // require_valid(&long_lived, &short_lived);
    }
}
```

## Lifetime in Enums

```rust
enum MyEnum<'a> {
    Simple(&'a str),
    Complex { value: &'a str, count: usize },
}

fn process<'a>(e: MyEnum<'a>) -> &'a str {
    match e {
        MyEnum::Simple(s) => s,
        MyEnum::Complex { value, .. } => value,
    }
}
```

## Lifetime in Generics

```rust
use std::fmt::Display;

fn print_longest<'a, T: Display>(x: &'a str, y: &'a str, info: T) -> &'a str {
    println!("Info: {}", info);
    if x.len() > y.len() { x } else { y }
}

struct Wrapper<'a, T: 'a> {
    data: &'a T,
}

impl<'a, T: Display> Wrapper<'a, T> {
    fn print(&self) {
        println!("{}", self.data);
    }
}
```

## Common Lifetime Patterns

```rust
// Borrow entire struct
struct Parser<'a> {
    input: &'a str,
    position: usize,
}

impl<'a> Parser<'a> {
    fn remaining(&self) -> &'a str {
        &self.input[self.position..]
    }
}

// Multiple references in struct
struct Comparison<'a> {
    left: &'a str,
    right: &'a str,
}

impl<'a> Comparison<'a> {
    fn longer(&self) -> &'a str {
        if self.left.len() > self.right.len() {
            self.left
        } else {
            self.right
        }
    }
}
```

## Static Lifetime

```rust
// String literal lives for entire program
let s: &'static str = "I live forever";

// References to constants
const GREETING: &str = "Hello";
let static_ref: &'static str = GREETING;

// Box with static lifetime
let boxed: Box<&'static str> = Box::new("static");
```